<img src="docs/marquee.svg" alt="Marquee" width="550" />

# Marquee for Jellyfin

A featured-media carousel for Jellyfin Web on **Jellyfin 10.11.x**.

## Install

Add this URL under **Dashboard → Plugins → Repositories**:

```text
https://raw.githubusercontent.com/yo-less/jellyfin-plugin-marquee/main/manifest.json
```

Install **Marquee** from this fork in **Catalog**, restart Jellyfin, and refresh the web player. Marquee was previously Media Bar Enhanced. Update the existing repository URL to the one above. The plugin ID is unchanged. [Releases](https://github.com/yo-less/jellyfin-plugin-marquee/releases)

## Use

- Click an item’s logo or title for details. **Hide Slide Action Buttons** removes the button row.
- Open the **M** settings menu and choose **Lineup**. Search your library, add or remove titles, and select **Apply**. **Use automatic** restores the configured content sources.
- **Daily Five** picks up to five items, favoring a mix of movies, series, libraries, and genres. Picks are stored per user and browser for the local date and refreshed when the bar next loads.
- In **Lineup → Trailers**, preview YouTube links from Jellyfin metadata or paste a link. **Use trailer** gives it precedence over automatic choices and local trailers in the Media Bar. Choose **Automatic** to clear the override. Local files are retained.
- **Editorial Trailers** give the still a moment before fading in the trailer beside the title. The slide returns to the still afterward. **Review Scores** shows the available audience score and critic approval separately. Click the score for the breakdown.
- **YouTube Inset** keeps the still visible and avoids enlarging the trailer to full width. **Local Trailers Only** is available if you want to use trailers whose quality you control.
- **Studio or Network Logo** shows each credited studio, using its name when no art exists. Use **Dashboard → Marquee → Studio Logos** to browse Jellyfin studios, upload or resize artwork, or import a logo with **Find on TMDB**. Imported logos are stored on your server and can be replaced with an upload or reset to Jellyfin’s art.

The dashboard sets defaults. Front-page overrides are saved in the current browser. [Advanced settings reference](https://github.com/CodeDevMLH/jellyfin-plugin-media-bar-enhanced/blob/ab586904a23a40781be6759feb327845797ed59c/README.md#configuration)

## Troubleshooting

- Refresh Jellyfin Web after updates. Native clients such as Android TV, Roku, and Swiftfin do not display the Media Bar.
- For a read-only web installation, install [File Transformation](https://github.com/IAmParadox27/jellyfin-plugin-file-transformation) v2.5.0.0 or later.
- To uninstall, disable and save the plugin first. Restart, uninstall, then restart again.

## Build

Use the .NET 9 SDK:

```sh
dotnet build Jellyfin.Plugin.MediaBarEnhanced/Jellyfin.Plugin.MediaBarEnhanced.csproj -c Release -o bin/Publish
```

Based on [CodeDevMLH’s fork](https://github.com/CodeDevMLH/jellyfin-plugin-media-bar-enhanced), [MakD’s Media Bar](https://github.com/MakD/Jellyfin-Media-Bar), and [IAmParadox27’s plugin](https://github.com/IAmParadox27/jellyfin-plugin-media-bar). [GPL-3.0](LICENSE).
