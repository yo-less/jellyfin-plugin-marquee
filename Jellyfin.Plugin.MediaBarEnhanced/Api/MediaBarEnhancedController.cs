using System;
using System.Globalization;
using System.Linq;
using System.Collections.Generic;
using System.Buffers.Binary;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Jellyfin.Data.Enums;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Library;
using MediaBrowser.Model.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Jellyfin.Plugin.MediaBarEnhanced;
using Jellyfin.Plugin.MediaBarEnhanced.Configuration;

namespace Jellyfin.Plugin.MediaBarEnhanced.Api
{
    /// <summary>
    /// Controller for serving MediaBarEnhanced resources and configuration.
    /// </summary>
    [ApiController]
    [Route("MediaBarEnhanced")]
    public class MediaBarEnhancedController : ControllerBase
    {
        private static readonly object DailyLock = new();
        private static (DateOnly Day, PluginConfiguration Config, Guid[] Ids)? _dailyLineup;

        /// <summary>
        /// Gets the shared daily picks visible to the signed-in account.
        /// </summary>
        [Authorize]
        [HttpGet("DailyLineup")]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public ActionResult<string[]> GetDailyLineup(
            [FromServices] ILibraryManager library,
            [FromServices] IUserManager users)
        {
            if (!Guid.TryParse(User.FindFirst("Jellyfin-UserId")?.Value, out var userId) ||
                users.GetUserById(userId) is not { } user)
            {
                return Unauthorized();
            }

            var config = MediaBarEnhancedPlugin.Instance?.Configuration;
            if (config is null || !config.IsEnabled || !config.DailyFive)
            {
                return Array.Empty<string>();
            }

            var day = DateOnly.FromDateTime(DateTime.Now);
            Guid[] picks;
            lock (DailyLock)
            {
                if (_dailyLineup is not { } lineup || lineup.Day != day || !ReferenceEquals(lineup.Config, config))
                {
                    lineup = (day, config, BuildDailyLineup(library, config, day));
                    _dailyLineup = lineup;
                }

                picks = lineup.Ids;
            }

            return picks.Where(id => library.GetItemById<BaseItem>(id, user) is not null)
                .Select(id => id.ToString("N")).ToArray();
        }

        private static Guid[] BuildDailyLineup(ILibraryManager library, PluginConfiguration config, DateOnly day)
        {
            Guid[] published;
            try
            {
                published = (JsonSerializer.Deserialize<string[]>(config.PublishedLineup) ?? Array.Empty<string>())
                    .Select(value => Guid.TryParse(value, out var id) ? id : Guid.Empty)
                    .Where(id => id != Guid.Empty).Distinct().ToArray();
            }
            catch (JsonException)
            {
                published = Array.Empty<Guid>();
            }

            var items = published.Length > 0
                ? published.Select(id => library.GetItemById(id)).OfType<BaseItem>().ToArray()
                : GetDailyLibraryPool(library, config);
            var dayKey = day.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            var ranked = items.OrderBy(item =>
                BinaryPrimitives.ReadUInt64BigEndian(SHA256.HashData(Encoding.UTF8.GetBytes(dayKey + item.Id.ToString("N")))))
                .ThenBy(item => item.Id).Take(24).ToList();
            var picks = new List<Guid>(5);
            var counts = new Dictionary<BaseItemKind, int>();
            var genres = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            BaseItemKind Kind(BaseItem item) => item.GetBaseItemKind() is BaseItemKind.Season or BaseItemKind.Episode
                ? BaseItemKind.Series
                : item.GetBaseItemKind();
            while (ranked.Count > 0 && picks.Count < Math.Min(5, config.MaxItems))
            {
                var selected = ranked.OrderBy(item => 4 * counts.GetValueOrDefault(Kind(item))
                    - (item.Genres.Any(genre => !genres.Contains(genre)) ? 1 : 0)).First();
                picks.Add(selected.Id);
                ranked.Remove(selected);
                var kind = Kind(selected);
                counts[kind] = counts.GetValueOrDefault(kind) + 1;
                genres.UnionWith(selected.Genres);
            }

            return published.Length > 0 ? published.Where(picks.Contains).ToArray() : picks.ToArray();
        }

        private static BaseItem[] GetDailyLibraryPool(ILibraryManager library, PluginConfiguration config)
        {
            var types = new List<BaseItemKind>();
            if (config.MaxMovies > 0) types.Add(BaseItemKind.Movie);
            if (config.MaxTvShows > 0) types.Add(BaseItemKind.Series);
            if (types.Count == 0 || config.MaxItems <= 0) return Array.Empty<BaseItem>();
            var excludedLibraries = (config.ExcludedLibraries + "," + config.PublishedExcludedLibraryIds)
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(value => Guid.TryParse(value, out var id) ? id : Guid.Empty)
                .Where(id => id != Guid.Empty).ToHashSet();
            var excludedGenres = config.ExcludedGenres.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
            var items = library.GetItemList(new InternalItemsQuery
            {
                Recursive = true,
                IncludeItemTypes = types.ToArray(),
                IsVirtualItem = false,
                ExcludeTags = config.ExcludedTags.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            });

            return items.Where(item => (!config.RequireLogo || item.HasImage(ImageType.Logo, 0))
                && !item.Genres.Any(excludedGenres.Contains)
                && (excludedLibraries.Count == 0 || !library.GetCollectionFolders(item).Any(folder => excludedLibraries.Contains(folder.Id))))
                .ToArray();
        }

        /// <summary>
        /// Gets the current plugin configuration.
        /// </summary>
        /// <returns>The configuration object.</returns>
        [HttpGet("Config")]
        [Produces("application/json")]
        public ActionResult<PluginConfiguration> GetConfig()
        {
            Response.Headers["X-Marquee-Version"] = typeof(MediaBarEnhancedPlugin).Assembly.GetName().Version?.ToString() ?? "";
            return MediaBarEnhancedPlugin.Instance?.Configuration ?? new PluginConfiguration();
        }

        /// <summary>
        /// Serves embedded resources.
        /// </summary>
        /// <param name="path">The path to the resource.</param>
        /// <returns>The resource file.</returns>
        [HttpGet("Resources/{*path}")]
        public ActionResult GetResource(string path)
        {
            // Sanitize path
            if (string.IsNullOrWhiteSpace(path) || path.Contains("..", StringComparison.Ordinal))
            {
                return BadRequest();
            }

            var assembly = typeof(MediaBarEnhancedPlugin).Assembly;
            var resourcePath = path.Replace('/', '.').Replace('\\', '.');
            var resourceName = $"Jellyfin.Plugin.MediaBarEnhanced.Web.{resourcePath}";

            var stream = assembly.GetManifestResourceStream(resourceName);

            if (stream == null)
            {
                return NotFound($"Resource not found: {resourceName}");
            }

            var contentType = GetContentType(path);
            return File(stream, contentType);
        }

        private string GetContentType(string path)
        {
            if (path.EndsWith(".js", StringComparison.OrdinalIgnoreCase)) return "application/javascript";
            if (path.EndsWith(".css", StringComparison.OrdinalIgnoreCase)) return "text/css";
            if (path.EndsWith(".html", StringComparison.OrdinalIgnoreCase)) return "text/html";
            if (path.EndsWith(".svg", StringComparison.OrdinalIgnoreCase)) return "image/svg+xml";
            return "application/octet-stream";
        }
    }
}
