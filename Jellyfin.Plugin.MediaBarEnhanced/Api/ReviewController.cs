using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
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

        [HttpGet]
        public async Task<IActionResult> Get(string type, string? imdb, CancellationToken cancellationToken)
        {
            if (type is not ("movie" or "tv")) return BadRequest();
            var scores = new Dictionary<string, double>();
            var clientId = Environment.GetEnvironmentVariable("MARQUEE_TRAKT_CLIENT_ID");
            if (string.IsNullOrWhiteSpace(clientId) || !Regex.IsMatch(imdb ?? "", @"\Att[0-9]{5,12}\z")) return Ok(scores);
            var score = await Fetch(type + ":" + imdb,
                "https://api.trakt.tv/" + (type == "movie" ? "movies/" : "shows/") + imdb + "/ratings",
                request =>
                {
                    request.Headers.TryAddWithoutValidation("trakt-api-key", clientId);
                    request.Headers.TryAddWithoutValidation("trakt-api-version", "2");
                },
                root => Number(root, "rating"), cancellationToken).ConfigureAwait(false);
            if (score.HasValue) scores["trakt"] = score.Value;
            return Ok(scores);
        }

        private static double? Number(JsonElement root, string field)
            => root.TryGetProperty(field, out var value) && value.ValueKind == JsonValueKind.Number
                && value.TryGetDouble(out var score) && score is > 0 and <= 10 ? score : null;

        private static async Task<double?> Fetch(string key, string url, Action<HttpRequestMessage>? configure,
            Func<JsonElement, double?> read, CancellationToken cancellationToken)
        {
            if (Cache.TryGetValue(key, out var cached) && cached.Expires > DateTimeOffset.UtcNow) return cached.Value;
            if (!await Requests.WaitAsync(TimeSpan.FromSeconds(3), cancellationToken).ConfigureAwait(false)) return null;
            try
            {
                if (Cache.TryGetValue(key, out cached) && cached.Expires > DateTimeOffset.UtcNow) return cached.Value;
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.UserAgent.ParseAdd("Jellyfin-Marquee/3.15.16");
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
