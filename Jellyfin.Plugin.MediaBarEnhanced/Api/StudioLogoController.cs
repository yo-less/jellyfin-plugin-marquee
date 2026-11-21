using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
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
        private static readonly SemaphoreSlim Writes = new(1);

        public StudioLogoController(IApplicationPaths paths)
        {
            _directory = Path.Combine(paths.PluginConfigurationsPath, "Jellyfin.Plugin.MediaBarEnhanced", "StudioLogos");
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
                        var height = stream.ReadByte();
                        if (height is >= 12 and <= 48)
                        {
                            logos[id] = new { height, hasImage = stream.Length > 1 };
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
        public async Task<IActionResult> Save(Guid studioId, [FromForm] int height, [FromForm] IFormFile? file, CancellationToken cancellationToken)
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

            await Writes.WaitAsync(cancellationToken).ConfigureAwait(false);
            string? temporaryPath = null;
            try
            {
                Directory.CreateDirectory(_directory);
                var previous = ReadLogo(studioId);
                var data = replacement != null ? new byte[replacement.Length + 1] :
                    previous.Length > 0 ? previous : new byte[1];
                if (replacement != null) replacement.CopyTo(data, 1);
                data[0] = (byte)height;
                temporaryPath = Path.Combine(_directory, Guid.NewGuid().ToString("N") + ".tmp");
                await System.IO.File.WriteAllBytesAsync(temporaryPath, data, cancellationToken).ConfigureAwait(false);
                System.IO.File.Move(temporaryPath, LogoPath(studioId), true);
                return Ok(new { height, hasImage = data.Length > 1 });
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
