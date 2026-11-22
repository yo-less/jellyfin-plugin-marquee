using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using MediaBrowser.Common.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jellyfin.Plugin.MediaBarEnhanced.Api
{
    [ApiController]
    [Route("MediaBarEnhanced/StudioLogos")]
    public class StudioLogoController : ControllerBase
    {
        private const int MaxImageBytes = 2 * 1024 * 1024;
        private readonly string _directory;
        private readonly string _tmdbConfig;
        private readonly string _tmdbTrailersConfig;
        private static readonly SemaphoreSlim Writes = new(1);

        public StudioLogoController(IApplicationPaths paths)
        {
            _tmdbConfig = Path.Combine(paths.PluginConfigurationsPath, "Jellyfin.Plugin.Tmdb.xml");
            _tmdbTrailersConfig = Path.Combine(paths.PluginConfigurationsPath, "Jellyfin.Plugin.Tmdb.Trailers.xml");
            _directory = Path.Combine(paths.PluginConfigurationsPath, "Jellyfin.Plugin.MediaBarEnhanced", "StudioLogos");
        }

        private static readonly HttpClient Tmdb = new(new HttpClientHandler { AllowAutoRedirect = false })
        {
            Timeout = TimeSpan.FromSeconds(12)
        };

        private static string? ReadConfiguredKey(string path, string field)
        {
            try
            {
                var value = XDocument.Load(path).Root?.Element(field)?.Value.Trim();
                return string.IsNullOrEmpty(value) ? null : value;
            }
            catch (FileNotFoundException) { return null; }
            catch (DirectoryNotFoundException) { return null; }
        }

        private static bool IsTmdbLogoPath(string? path) =>
            path != null && Regex.IsMatch(path, @"\A/[a-zA-Z0-9_-]{1,100}\.(png|jpg|jpeg|webp)\z");

        [Authorize(Policy = "RequiresElevation")]
        [HttpPost("TmdbSearch")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(16384)]
        public async Task<IActionResult> SearchTmdb([FromForm] string query, [FromForm] string? fallbackKey, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length > 150)
                return BadRequest("Enter a studio name.");

            string? token;
            try
            {
                token = ReadConfiguredKey(_tmdbConfig, "TmdbApiKey")
                    ?? ReadConfiguredKey(_tmdbTrailersConfig, "ApiKey");
            }
            catch (Exception error) when (error is IOException or System.Xml.XmlException or UnauthorizedAccessException)
            {
                return StatusCode(500, "Marquee could not read the TMDb or TMDb Trailers configuration.");
            }

            token ??= fallbackKey?.Trim();
            if (string.IsNullOrEmpty(token))
                return StatusCode(428, "Enter a TMDb API key or read access token to search for logos.");

            if (!Regex.IsMatch(token, @"\A[a-zA-Z0-9_.-]{1,2048}\z"))
                return BadRequest("The configured TMDb credential has an invalid format.");

            var url = "https://api.themoviedb.org/3/search/company?query=" + Uri.EscapeDataString(query.Trim());
            bool isApiKey = Regex.IsMatch(token, @"\A[0-9a-fA-F]{32}\z");
            using var request = new HttpRequestMessage(HttpMethod.Get, url + (isApiKey ? "&api_key=" + token : ""));
            if (!isApiKey) request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            try
            {
                using var response = await Tmdb.SendAsync(request, cancellationToken).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                    return StatusCode(502, $"TMDB search returned HTTP {(int)response.StatusCode}. Check the configured credential.");
                using var body = await response.Content.ReadAsStreamAsync(cancellationToken).ConfigureAwait(false);
                using var result = await JsonDocument.ParseAsync(body, cancellationToken: cancellationToken).ConfigureAwait(false);
                var matches = new List<object>();
                foreach (var company in result.RootElement.GetProperty("results").EnumerateArray())
                {
                    var path = company.TryGetProperty("logo_path", out var logo) ? logo.GetString() : null;
                    if (!IsTmdbLogoPath(path)) continue;
                    matches.Add(new {
                        name = company.GetProperty("name").GetString(),
                        id = company.GetProperty("id").GetInt32(),
                        country = company.TryGetProperty("origin_country", out var country) ? country.GetString() : null,
                        path
                    });
                }
                return Ok(matches);
            }
            catch (HttpRequestException) { return StatusCode(502, "TMDB could not be reached."); }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested) { return StatusCode(504, "TMDB search timed out."); }
        }

        [Authorize(Policy = "RequiresElevation")]
        [HttpPost("{studioId:guid}/TmdbImport")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(16384)]
        public async Task<IActionResult> ImportTmdb(Guid studioId, [FromForm] string path, [FromForm] int height, CancellationToken cancellationToken)
        {
            if (!IsTmdbLogoPath(path) || height is < 12 or > 48)
                return BadRequest("Choose a TMDB logo and a height from 12 to 48 px.");

            try
            {
                using var response = await Tmdb.GetAsync("https://image.tmdb.org/t/p/w500" + path,
                    HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                    return StatusCode(502, "TMDB could not provide this logo.");
                using var source = await response.Content.ReadAsStreamAsync(cancellationToken).ConfigureAwait(false);
                using var image = new MemoryStream();
                var buffer = new byte[16384];
                using var budget = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                budget.CancelAfter(TimeSpan.FromSeconds(12));
                int count;
                while ((count = await source.ReadAsync(buffer.AsMemory(), budget.Token).ConfigureAwait(false)) > 0)
                {
                    if (image.Length + count > MaxImageBytes) return BadRequest("This logo exceeds 2 MB.");
                    image.Write(buffer, 0, count);
                }
                var data = image.ToArray();
                if (ImageMediaType(data) == null) return BadRequest("TMDB did not return a supported image.");
                return await SaveLogo(studioId, height, data, cancellationToken).ConfigureAwait(false);
            }
            catch (HttpRequestException) { return StatusCode(502, "TMDB artwork could not be reached."); }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested) { return StatusCode(504, "TMDB image download timed out."); }
        }

        private string LogoPath(Guid id) => Path.Combine(_directory, id.ToString("N") + ".logo");

        [HttpGet]
        [ResponseCache(NoStore = true)]
        public IActionResult List()
        {
            var logos = new Dictionary<string, object>();
            if (Directory.Exists(_directory))
            {
                foreach (var path in Directory.EnumerateFiles(_directory, "*.logo"))
                {
                    var id = Path.GetFileNameWithoutExtension(path);
                    try
                    {
                        using var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read | FileShare.Delete);
                        var header = stream.ReadByte();
                        var height = header & 0x7f;
                        if (height is >= 12 and <= 48)
                        {
                            logos[id] = new { height, hasImage = stream.Length > 1, keepColor = (header & 0x80) != 0 };
                        }
                    }
                    catch (FileNotFoundException) { /* Reset while listing. */ }
                }
            }
            return Ok(logos);
        }

        [HttpGet("{studioId:guid}")]
        [ResponseCache(NoStore = true)]
        public IActionResult GetLogo(Guid studioId)
        {
            var data = ReadLogo(studioId);
            if (data.Length <= 1) return NotFound();
            var mediaType = ImageMediaType(data.AsSpan(1));
            return mediaType == null ? NotFound() : File(data[1..], mediaType);
        }

        [Authorize(Policy = "RequiresElevation")]
        [HttpPost("{studioId:guid}")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(MaxImageBytes + 65536)]
        public async Task<IActionResult> Save(Guid studioId, [FromForm] int height, [FromForm] IFormFile? file, [FromForm] bool? keepColor, CancellationToken cancellationToken)
        {
            if (height is < 12 or > 48 || file is { Length: > MaxImageBytes or 0 })
                return BadRequest("Choose a height from 12 to 48 px and an image up to 2 MB.");

            byte[]? replacement = null;
            if (file != null)
            {
                using var image = new MemoryStream();
                await file.CopyToAsync(image, cancellationToken).ConfigureAwait(false);
                replacement = image.ToArray();
                if (ImageMediaType(replacement) == null)
                    return BadRequest("Upload a PNG, JPEG, or WebP image.");
            }

            return await SaveLogo(studioId, height, replacement, cancellationToken, keepColor).ConfigureAwait(false);
        }

        private async Task<IActionResult> SaveLogo(Guid studioId, int height, byte[]? replacement, CancellationToken cancellationToken, bool? keepColor = null)
        {
            await Writes.WaitAsync(cancellationToken).ConfigureAwait(false);
            string? temporaryPath = null;
            try
            {
                Directory.CreateDirectory(_directory);
                var previous = ReadLogo(studioId);
                var data = replacement != null ? new byte[replacement.Length + 1] :
                    previous.Length > 0 ? previous : new byte[1];
                if (replacement != null) replacement.CopyTo(data, 1);
                var preserveColor = keepColor ?? (previous.Length > 0 && (previous[0] & 0x80) != 0);
                data[0] = (byte)(height | (preserveColor ? 0x80 : 0));
                temporaryPath = Path.Combine(_directory, Guid.NewGuid().ToString("N") + ".tmp");
                await System.IO.File.WriteAllBytesAsync(temporaryPath, data, cancellationToken).ConfigureAwait(false);
                System.IO.File.Move(temporaryPath, LogoPath(studioId), true);
                return Ok(new { height, hasImage = data.Length > 1, keepColor = preserveColor });
            }
            finally
            {
                Writes.Release();
                if (temporaryPath != null) System.IO.File.Delete(temporaryPath);
            }
        }

        [Authorize(Policy = "RequiresElevation")]
        [HttpDelete("{studioId:guid}")]
        public async Task<IActionResult> Reset(Guid studioId, CancellationToken cancellationToken)
        {
            await Writes.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
                if (Directory.Exists(_directory)) System.IO.File.Delete(LogoPath(studioId));
                return NoContent();
            }
            finally { Writes.Release(); }
        }

        private byte[] ReadLogo(Guid studioId)
        {
            try
            {
                using var stream = new FileStream(LogoPath(studioId), FileMode.Open, FileAccess.Read, FileShare.Read | FileShare.Delete);
                using var data = new MemoryStream();
                stream.CopyTo(data);
                return data.ToArray();
            }
            catch (FileNotFoundException) { return Array.Empty<byte>(); }
            catch (DirectoryNotFoundException) { return Array.Empty<byte>(); }
        }

        private static string? ImageMediaType(ReadOnlySpan<byte> data)
        {
            if (data.StartsWith(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 })) return "image/png";
            if (data.StartsWith(new byte[] { 255, 216, 255 })) return "image/jpeg";
            if (data.Length >= 12 && data.StartsWith("RIFF"u8) && data[8..].StartsWith("WEBP"u8)) return "image/webp";
            return null;
        }
    }
}
