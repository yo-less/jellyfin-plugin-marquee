<img src="logo.png" alt="Media Bar Enhanced carousel icon" width="112" />

# Media Bar Enhanced for Jellyfin

Media Bar Enhanced adds a rotating featured-media banner to the Jellyfin home screen. It can show content from your library, playlists, collections, or personalized recommendations.

This fork adds clickable titles and an option to hide the slide controls. It targets Jellyfin **10.11.x**.

![Media Bar Enhanced on the Jellyfin home screen](https://github.com/user-attachments/assets/a3c3c8a8-7925-473c-b15f-fc9695cb573f)

## Install

1. In Jellyfin, open **Dashboard → Plugins → Repositories** and add a repository named **Media Bar Enhanced (yo-less)**.
2. Paste this URL and save:

   ```text
   https://raw.githubusercontent.com/yo-less/jellyfin-plugin-media-bar-enhanced/main/manifest.json
   ```

3. Open **Catalog → General → Media Bar Enhanced** and install version **3.12.1.0** or later from this fork.
4. Restart Jellyfin and refresh Jellyfin Web.

If you already use the upstream plugin, the fork shares its plugin ID. Select the fork’s version when installing or updating.

[Releases and ZIP downloads](https://github.com/yo-less/jellyfin-plugin-media-bar-enhanced/releases)

## Use the media bar

- **Open an item.** Click its logo or text title to open the Jellyfin details page.
- **Hide the button row.** Open **Dashboard → Media Bar Enhanced → General Settings → Layout & Keyboard Controls**, enable **Hide Slide Action Buttons**, and save. This removes Info, Play, Favorite, and the optional Trailer button. The row is visible by default.
- **Set it per device.** If client settings are enabled, open the Media Bar settings from the navbar or sidebar. Change **Hide Slide Action Buttons**, then save to reload the page.

The desktop title block uses plain-text metadata and a short synopsis on a soft translucent backing. The synopsis shows only complete sentences that fit the excerpt budget. Compact layouts omit the synopsis.

## Configure content and layout

| Setting | What it controls |
| --- | --- |
| Content | Use library items, custom media IDs, collections, playlists, seasonal sections, or personalized recommendations. |
| Filters and sorting | Choose libraries, genres, tags, ratings, and release years. Set the sort order and item limits. |
| Trailers | Use local or YouTube trailers, play them as backdrops, or open them from the Trailer button. |
| Layout | Set the mobile layout, slide transitions, pagination, and optional text or image overlays. |
| Client settings | Allow each device to override selected server defaults. |

From highest to lowest priority, the content source is the playlist chosen on the device, recommendations enabled on the device, matching seasonal content, custom media IDs, server-default recommendations, and the library rotation.

For the full settings reference, examples, and theme-specific CSS, see the [upstream documentation this fork was based on](https://github.com/CodeDevMLH/jellyfin-plugin-media-bar-enhanced/blob/ab586904a23a40781be6759feb327845797ed59c/README.md#configuration).

## Client support

The plugin runs in Jellyfin Web, including desktop browsers, Jellyfin Media Player, and mobile apps that use the web interface. Native clients such as Android TV, Fire TV, Roku, Swiftfin, Tizen, and Kodi do not display the media bar. YouTube trailer audio can be restricted in mobile web wrappers.

## Troubleshooting

- **The banner is missing.** Check that the plugin is enabled, restart the server, and hard-refresh Jellyfin Web.
- **Jellyfin Web is read-only.** Install [File Transformation](https://github.com/IAmParadox27/jellyfin-plugin-file-transformation) v2.5.0.0 or later so the plugin can load its web assets without writing to `index.html`.
- **YouTube asks you to sign in.** Prefer local trailers in the plugin settings.
- **Uninstalling.** Disable Media Bar Enhanced in its settings and save so it can remove its web injection. Restart Jellyfin, uninstall the plugin, and restart again.

## Build from source

Build with the .NET 9 SDK from the repository root:

```sh
dotnet build Jellyfin.Plugin.MediaBarEnhanced/Jellyfin.Plugin.MediaBarEnhanced.csproj --configuration Release --output bin/Publish
```

## Credits and license

Forked from [CodeDevMLH’s Media Bar Enhanced](https://github.com/CodeDevMLH/jellyfin-plugin-media-bar-enhanced), based on [MakD’s Jellyfin Media Bar](https://github.com/MakD/Jellyfin-Media-Bar), with contributions from [IAmParadox27’s plugin fork](https://github.com/IAmParadox27/jellyfin-plugin-media-bar). Licensed under the [GPL-3.0](LICENSE).
