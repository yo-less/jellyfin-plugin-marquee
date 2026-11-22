using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using MediaBrowser.Common.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jellyfin.Plugin.MediaBarEnhanced.Api
{
    [ApiController]
    [Authorize]
    [Route("MediaBarEnhanced/Reviews")]
    public class ReviewController : ControllerBase
    {
        private static readonly HttpClient Client = new(new HttpClientHandler { AllowAutoRedirect = false })
        {
            Timeout = TimeSpan.FromSeconds(5)
        };
        private static readonly ConcurrentDictionary<string, (DateTimeOffset Expires, double? Value)> Cache = new();
        private static readonly SemaphoreSlim Requests = new(6);
        private readonly string _path;

        public ReviewController(IApplicationPaths paths) => _path = paths.PluginConfigurationsPath;

        [HttpGet]
        public async Task<IActionResult> Get(string type, string? tmdb, string? imdb, CancellationToken cancellationToken)
        {
            if (type is not ("movie" or "tv")) return BadRequest();
            tmdb = Regex.IsMatch(tmdb ?? "", @"\A[0-9]{1,12}\z") ? tmdb : null;
            imdb = Regex.IsMatch(imdb ?? "", @"\Att[0-9]{5,12}\z") ? imdb : null;
            var tmdbKey = Environment.GetEnvironmentVariable("MARQUEE_TMDB_KEY");
            try
            {
                tmdbKey ??= StudioLogoController.ReadConfiguredKey(Path.Combine(_path, "Jellyfin.Plugin.Tmdb.xml"), "TmdbApiKey")
                    ?? StudioLogoController.ReadConfiguredKey(Path.Combine(_path, "Jellyfin.Plugin.Tmdb.Trailers.xml"), "ApiKey");
            }
            catch (Exception error) when (error is IOException or UnauthorizedAccessException or System.Xml.XmlException) { }

            var traktKey = Environment.GetEnvironmentVariable("MARQUEE_TRAKT_CLIENT_ID");
            var omdbKey = Environment.GetEnvironmentVariable("MARQUEE_OMDB_API_KEY");
            var scores = new Dictionary<string, double>();
            var pending = new Dictionary<string, Task<double?>>();
            if (tmdb != null && !string.IsNullOrWhiteSpace(tmdbKey))
            {
                var queryKey = Regex.IsMatch(tmdbKey, @"\A[0-9a-fA-F]{32}\z");
                pending["tmdb"] = Fetch("tmdb:" + type + ":" + tmdb,
                    "https://api.themoviedb.org/3/" + type + "/" + tmdb + (queryKey ? "?api_key=" + tmdbKey : ""),
                    queryKey ? null : request => request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tmdbKey),
                    root => Number(root, "vote_average"), cancellationToken);
            }
            if (imdb != null && !string.IsNullOrWhiteSpace(traktKey))
            {
                pending["trakt"] = Fetch("trakt:" + type + ":" + imdb,
                    "https://api.trakt.tv/" + (type == "movie" ? "movies/" : "shows/") + imdb + "/ratings",
                    request =>
                    {
                        request.Headers.TryAddWithoutValidation("trakt-api-key", traktKey);
                        request.Headers.TryAddWithoutValidation("trakt-api-version", "2");
                    },
                    root => Number(root, "rating"), cancellationToken);
            }
            if (imdb != null && !string.IsNullOrWhiteSpace(omdbKey))
            {
                pending["tomatometer"] = Fetch("omdb:" + imdb,
                    "https://www.omdbapi.com/?i=" + imdb + "&apikey=" + Uri.EscapeDataString(omdbKey), null,
                    ReadTomatometer, cancellationToken);
            }

            foreach (var source in pending)
            {
                if (await source.Value.ConfigureAwait(false) is double score) scores[source.Key] = score;
            }
            return Ok(scores);
        }

        private static double? Number(JsonElement root, string field)
            => root.TryGetProperty(field, out var value) && value.ValueKind == JsonValueKind.Number
                && value.TryGetDouble(out var score) && score is > 0 and <= 10 ? score : null;

        private static double? ReadTomatometer(JsonElement root)
        {
            if (!root.TryGetProperty("Ratings", out var ratings) || ratings.ValueKind != JsonValueKind.Array) return null;
            foreach (var rating in ratings.EnumerateArray())
            {
                if (rating.GetProperty("Source").GetString() != "Rotten Tomatoes") continue;
                var value = rating.GetProperty("Value").GetString() ?? "";
                if (value.EndsWith('%') && double.TryParse(value[..^1], NumberStyles.None, CultureInfo.InvariantCulture, out var score)
                    && score is >= 0 and <= 100) return score;
            }
            return null;
        }

        private static async Task<double?> Fetch(string key, string url, Action<HttpRequestMessage>? configure,
            Func<JsonElement, double?> read, CancellationToken cancellationToken)
        {
            if (Cache.TryGetValue(key, out var cached) && cached.Expires > DateTimeOffset.UtcNow) return cached.Value;
            if (!await Requests.WaitAsync(TimeSpan.FromSeconds(3), cancellationToken).ConfigureAwait(false)) return null;
            try
            {
                if (Cache.TryGetValue(key, out cached) && cached.Expires > DateTimeOffset.UtcNow) return cached.Value;
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.UserAgent.ParseAdd("Jellyfin-Marquee/3.15.15");
                configure?.Invoke(request);
                using var response = await Client.SendAsync(request, cancellationToken).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode) return null;
                using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false));
                var score = read(json.RootElement);
                if (Cache.Count >= 4096) Cache.Clear();
                Cache[key] = (DateTimeOffset.UtcNow.AddHours(score.HasValue ? 24 : 1), score);
                return score;
            }
            catch (Exception error) when (error is HttpRequestException or OperationCanceledException or JsonException or InvalidOperationException or KeyNotFoundException or FormatException)
            {
                return null;
            }
            finally { Requests.Release(); }
        }
    }
}
