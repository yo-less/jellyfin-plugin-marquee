/*
 * Jellyfin Slideshow by M0RPH3US v4.0.1
 * Modified by CodeDevMLH
 *
 * New features:
 * - optional Trailer background video support (youtube or local trailer/backdrop videos)
 * - option to make video backdrops full width
 * - SponsorBlock support to skip intro/outro segments
 * - option to always show arrows
 * - option to disable/enable keyboard controls
 * - option to show/hide trailer button if trailer as backdrop is disabled (opens in a modal)
 * - option to wait for trailer to end before loading next slide
 * - option to set a maximum for the pagination dots (will turn into a counter style if exceeded)
 * - option to disable loading screen
 * - option to put collection (boxsets) IDs into the slideshow to display their items
 * - option to enable client-side settings (allow users to override settings locally on their device)
 * - option to enable seasonal content (only show items that are relevant to the current season/holiday)
 * - option to prefer local trailers or backdrop videos (from the media item) over online sources
 * - options to sort the content by various criteria (PremiereDate, ProductionYear, Random, Original order, etc.)
 * - options to set parental rating and release date limits to filter out unwanted content
 * - options to customize the overlay (text, image, style, position, etc.) with e.g. seasonal messages or custom branding
 * - many other settings in the advanced settings tab
 */

(function () {
  if (window.mediaBarEnhancedLoaded) {
    console.warn("🎬 Marquee already loaded, skipping duplicate execution.");
    return;
  }
  window.mediaBarEnhancedLoaded = true;

  // MARK: Version
  let pluginVersion = "";

  //Core Module Configuration
  const CONFIG = {
    shuffleInterval: 7000,
    retryInterval: 500,
    minSwipeDistance: 50,
    loadingCheckInterval: 100,
    maxPlotLength: 360,
    maxMovies: 20,
    maxTvShows: 20,
    maxItems: 20,
    preloadCount: 3,
    fadeTransitionDuration: 500,
    maxPaginationDots: 15,
    showPaginationDots: true,
    maxParentalRating: null,
    maxDaysRecent: null,
    maxDaysRecentRelease: null,
    releaseYears: "",
    slideAnimationEnabled: true,
    enableVideoBackdrop: true,
    useSponsorBlock: true,
    sponsorBlockCategories: "intro,outro,preview",
    preferLocalTrailers: false,
    randomizeLocalTrailers: false,
    preferLocalBackdrops: false,
    randomizeThemeVideos: false,
    includeWatchedContent: false,
    waitForTrailerToEnd: true,
    startMuted: true,
    defaultTrailerVolume: 40,
    fullWidthVideo: true,
    enableSplitScreenTrailer: false,
    pauseOnHover: false,
    enableMobileVideo: false,
    showTrailerButton: true,
    hideSlideActionButtons: false,
    dailyFive: false,
    youtubeInset: false,
    showProviderLogo: false,
    recolorStudioLogos: false,
    grayscaleStudioLogos: false,
    keepStudioLogosMonochrome: false,
    safeTrailerFraming: true,
    fillTrailerHeight: false,
    edgeTrailer: true,
    cropLocalTrailers: true,
    skipTrailerPromos: true,
    activePlaylist: "Default",
    publishedExcludedLibraryIds: "",
    publishedLineup: "[]",
    popupColorScheme: "default",
    shufflePublishedLineup: false,
    savedLineups: "[]",
    publishedTrailers: "{}",
    publishedTrailerFraming: "{}",
    compactTrailerDetails: false,
    studioColorDuringTrailers: true,
    trailerCropSettings: "{}",
    trailerWidthPercent: 0,
    trailerStudioLogoSettings: "{}",
    editorialTrailers: true,
    showReviewScores: true,
    enableKeyboardControls: true,
    alwaysShowArrows: false,
    hideArrowsOnMobile: true,
    enableCustomOverlay: false,
    customOverlayText: "",
    customOverlayImageUrl: "",
    customOverlayStyle: "Shadowed",
    customOverlayImageStyle: "None",
    customOverlayPriority: "Image",
    customOverlayPositionX: 0,
    customOverlayPositionY: 0,
    customOverlayScale: 100,
    backdropVideoDelay: 0,
    trailerStartOffset: 0,
    trailerEndOffset: 0,
    randomTrailerStartOffset: true,
    randomTrailerStartMinPercent: 10,
    randomTrailerStartMaxPercent: 75,
    hoverAudioFade: false,
    hoverAudioFadeMs: 400,
    constrainPlotWidth: false,
    enableCustomMediaIds: true,
    enableSeasonalContent: false,
    customMediaIds: "",
    enableLoadingScreen: true,
    enableClientSideSettings: false,
    sortBy: "Random",
    sortOrder: "Ascending",
    applyLimitsToCustomIds: false,
    seasonalSections: "[]",
    excludeSeasonalContent: true,
    maxCachedItems: 20,
    isEnabled: true,
    mobileCompactMode: "Original",
    clientMenuLocation: "Navbar",
    clientMenuLocationMobile: "Sidebar",
    transitionEffect: "Fade",
    showProgressBar: true,
    progressBarLocation: "Dots",
    customPlaylists: "[]",
    forceSlideCounter: false,
    excludedLibraries: "",
    excludedGenres: "",
    excludedTags: "",
    trailerEnabledLibraries: "",
    onlyLocalTrailers: false,
    yoYoProgressBar: true,
    syncPageBackdrop: false,
    randomizeBackdrops: false,
    pauseOnExternalPlayback: false,
    useRecommendations: false,
    requireLogo: false,
    enableBottomGradient: true,
    dotStyle: "Round",
  };

  const CLIENT_MENU_TRANSLATIONS = {
    'en': {
      title: 'Marquee Settings',
      groupGeneral: 'General',
      groupTrailers: 'Trailers',
      groupLayout: 'Layout',
      groupLineup: 'Lineup',
      groupLibraries: 'Libraries',
      enabledLabel: 'Enable Marquee',
      enabledDesc: "Show the Media Bar.",
      videoBackdropsLabel: 'Enable Trailer Backdrops',
      videoBackdropsDesc: 'Play trailers as background videos.',
      trailerButtonLabel: 'Show Trailer Button',
      trailerButtonDesc: "Open trailers in a popup when no backdrop video plays.",
      mobileVideoLabel: 'Enable Trailer On Mobile',
      mobileVideoDesc: 'Allow trailer backdrops on mobile devices.',
      waitForTrailerLabel: 'Wait For Trailer To End',
      waitForTrailerDesc: "Change slides after playback ends.",
      slideAnimationsLabel: 'Enable Animations',
      slideAnimationsDesc: "Zoom still images.",
      mobileModeLabel: 'Mobile Aspect Ratio',
      mobileModeDesc: 'Height of the media bar on portrait mobile devices.',
      defaultTrailerVolumeLabel: 'Default Trailer Volume',
      defaultTrailerVolumeDesc: "Volume from 0 to 100%.",
      hoverAudioFadeLabel: 'Hover Audio Fade',
      hoverAudioFadeDesc: "Fade sound in on hover and out on exit while muted.",
      clientMenuLocationLabel: 'Settings Button Location',
      clientMenuLocationDesc: "Navbar, sidebar, or both.",
      clientMenuLocationMobileLabel: 'Settings Button Location (Mobile)',
      clientMenuLocationMobileDesc: "Navbar, sidebar, or both on mobile.",
      transitionEffectLabel: 'Transition Effect',
      transitionEffectDesc: "Effect between slides.",
      showProgressBarLabel: 'Show Progress Bar',
      showProgressBarDesc: "Show slide timing.",
      progressBarLocationLabel: 'Progress Bar Location',
      progressBarLocationDesc: "Position of the timing bar.",
      progressBarLocationDots: 'Under Dots / Counter',
      progressBarLocationInside: 'Inside Active Dot / Counter',
      progressBarLocationNavbar: 'Top (Under Header)',
      showPaginationDotsLabel: 'Show Pagination Dots / Counter',
      showPaginationDotsDesc: "Show slide dots or a counter.",
      forceSlideCounterLabel: 'Always Use Slide Counter',
      forceSlideCounterDesc: "Always use a counter.",
      dotStyleLabel: 'Pagination Dot Style',
      dotStyleDesc: "Round or pill-shaped active dot.",
      optionDotStyleRound: 'Round (Classic)',
      optionDotStylePill: 'Pill / Capsule',
      activePlaylistLabel: 'Active Playlist',
      activePlaylistDesc: "Choose a saved playlist.",
      optionMobileModeOriginal: 'Original (65vh)',
      optionMobileMode16_9: '16:9 (Compact)',
      optionMobileMode4_3: '4:3 (Classic)',
      optionMenuLocationNavbar: 'Navbar',
      optionMenuLocationSidebar: 'Sidebar',
      optionMenuLocationBoth: 'Both',
      optionTransitionFade: 'Crossfade',
      optionTransitionSlideLeft: 'Slide Left',
      optionTransitionSlideRight: 'Slide Right',
      optionTransitionSlideUp: 'Slide Up',
      optionTransitionSlideDown: 'Slide Down',
      optionTransitionZoomIn: 'Zoom In',
      optionTransitionZoomOut: 'Zoom Out',
      resetBtn: 'Load Server Defaults',
      resetTitle: 'Reset to Server Defaults',
      saveBtn: 'Save & Reload',
      confirmReset: 'Reset all local Media Bar settings to server defaults?',
      libraryFilterHint: "Library filters apply to automatic picks.",
      onlyLocalTrailersLabel: 'Only Play Local Trailers',
      onlyLocalTrailersDesc: "Use the still if no local trailer is available.",
      randomTrailerStartLabel: 'Random Trailer Start Position',
      randomTrailerStartDesc: "Randomize starts when waiting for trailer end is off.",
      yoYoProgressBarLabel: 'Yo-Yo Progress Bar',
      yoYoProgressBarDesc: "Alternate between filling and draining.",
      syncPageBackdropLabel: 'Sync Page Backdrop',
      syncPageBackdropDesc: "Use the current still as the page background.",
      randomizeBackdropsLabel: 'Randomize Background Image',
      randomizeBackdropsDesc: "Randomize when multiple images exist.",
      hideSlideActionButtonsLabel: "Hide Slide Action Buttons",
      hideSlideActionButtonsDesc: "Hide Info, Play, Trailer, and Favorite. Click the title for details.",
      enableBottomGradientLabel: 'Enable Bottom Gradient',
      enableBottomGradientDesc: "Fade the bottom edge. Turn off for a solid edge.",
      useRecommendationsLabel: 'Personalized Recommendations',
      useRecommendationsDesc: 'Show recommendations based on your watch history.',
      requireLogoLabel: 'Require Title Logo',
      requireLogoDesc: 'Only include items that have a title logo.',
      splitScreenTrailerLabel: 'Split-Screen Trailer View',
      splitScreenTrailerDesc: "Artwork and details on the left, trailer on the right.",
      pauseOnHoverLabel: 'Pause Slideshow on Hover',
      pauseOnHoverDesc: "Pause slide timing on hover. Active trailers can also delay transitions.",
      pauseOnExternalPlaybackLabel: 'Pause on External Playback',
      pauseOnExternalPlaybackDesc: "Pause slides and trailers during casting or external playback.",
      toastMuted: 'Muted',
      toastUnmuted: 'Audio On',
      toastPaused: 'Slideshow Paused',
      toastResumed: 'Slideshow Resumed',
      seasonPrefix: 'Season {0}: ',
      episodePrefix: 'Episode {0}: ',
      seasonEpisodePrefix: 'Season {0}, Episode {1}: ',
      seasonLabel: 'Season',
      seasonsLabel: 'Seasons',
      episodeLabel: 'Episode',
      episodesLabel: 'Episodes'
    },
    'de': {
      title: 'Marquee-Einstellungen',
      groupGeneral: 'Allgemein',
      groupTrailers: 'Trailer',
      groupLayout: 'Layout',
      groupLineup: 'Auswahl',
      groupLibraries: 'Bibliotheken',
      transitionEffectLabel: 'Übergangseffekt',
      transitionEffectDesc: 'Wähle den Effekt für den Folienwechsel.',
      showProgressBarLabel: 'Fortschrittsbalken anzeigen',
      showProgressBarDesc: 'Zeigt einen Balken für die Timer-Dauer.',
      progressBarLocationLabel: 'Position des Fortschrittsbalkens',
      progressBarLocationDesc: 'Wähle aus, wo der Timer-Fortschrittsbalken angezeigt wird.',
      progressBarLocationDots: 'Unter den Punkten / Counter',
      progressBarLocationInside: 'Im aktiven Punkt / Counter',
      progressBarLocationNavbar: 'Oben (Unter Kopfzeile)',
      showPaginationDotsLabel: 'Navigationspunkte / Zähler anzeigen',
      showPaginationDotsDesc: 'Zeigt die Navigationspunkte oder den Folienzähler unten an.',
      forceSlideCounterLabel: 'Zähler anstelle von Punkten erzwingen',
      forceSlideCounterDesc: 'Erzwingt den numerischen Diashow-Zähler anstelle der Navigationspunkte.',
      dotStyleLabel: 'Punkte-Stil',
      dotStyleDesc: 'Wähle aus, ob der aktive Navigationspunkt rund oder eine längliche Kapsel ist.',
      optionDotStyleRound: 'Rund (Klassisch)',
      optionDotStylePill: 'Kapsel (Länglich)',
      activePlaylistLabel: 'Aktive Playlist',
      activePlaylistDesc: 'Wähle aus, welche Kachel-Playlist geladen wird.',
      optionMobileModeOriginal: 'Original (65vh)',
      optionMobileMode16_9: '16:9 (Kompakt)',
      optionMobileMode4_3: '4:3 (Klassisch)',
      optionMenuLocationNavbar: 'Kopfzeile (Navbar)',
      optionMenuLocationSidebar: 'Seitenleiste (Sidebar)',
      optionMenuLocationBoth: 'Beide (Kopf- & Seitenleiste)',
      optionTransitionFade: 'Überblenden (Crossfade)',
      optionTransitionSlideLeft: 'Nach links schieben',
      optionTransitionSlideRight: 'Nach rechts schieben',
      optionTransitionSlideUp: 'Nach oben schieben',
      optionTransitionSlideDown: 'Nach unten schieben',
      optionTransitionZoomIn: 'Heranzoomen (Zoom In)',
      optionTransitionZoomOut: 'Herauszoomen (Zoom Out)',
      enabledLabel: 'Marquee aktivieren',
      enabledDesc: 'Schaltet die gesamte Media Bar ein/aus.',
      videoBackdropsLabel: 'Trailer-Hintergründe aktivieren',
      videoBackdropsDesc: 'Spielt Trailer als Hintergrundvideo ab.',
      trailerButtonLabel: 'Trailer-Button anzeigen',
      trailerButtonDesc: 'Zeigt einen Button zum Abspielen von Trailern an (für Kacheln ohne Video-Daten).',
      mobileVideoLabel: 'Trailer auf Handys aktivieren',
      mobileVideoDesc: 'Erlaubt Trailer-Hintergründe auf mobilen Geräten.',
      waitForTrailerLabel: 'Auf Trailer-Ende warten',
      waitForTrailerDesc: 'Wartet, bis der Trailer beendet ist, bevor die nächste Kachel gezeigt wird.',
      slideAnimationsLabel: 'Animationen aktivieren',
      slideAnimationsDesc: 'Aktiviert einen Zoom-Effekt (nur für Hintergrundbilder).',
      mobileModeLabel: 'Mobiles Seitenverhältnis',
      mobileModeDesc: 'Höhe der Media Bar auf mobilen Geräten im Hochformat.',
      defaultTrailerVolumeLabel: 'Standard-Lautstärke',
      defaultTrailerVolumeDesc: 'Standard-Lautstärke für die Trailer-Wiedergabe (in %).',
      hoverAudioFadeLabel: 'Hover Audio Fade',
      hoverAudioFadeDesc: 'Im stummgeschalteten Zustand wird der Ton beim Drüberfahren mit der Maus sanft eingeblendet und beim Verlassen wieder ausgeblendet. Standardmäßig deaktiviert.',
      clientMenuLocationLabel: 'Ort der Einstellungen',
      clientMenuLocationDesc: 'Wähle aus, wo das Einstellungs-Symbol angezeigt wird (Kopfzeile, Seitenleiste oder Beide).',
      clientMenuLocationMobileLabel: 'Ort der Einstellungen (Mobil)',
      clientMenuLocationMobileDesc: 'Wähle aus, wo das Einstellungs-Symbol auf mobilen Geräten angezeigt wird.',
      resetBtn: 'Server-Standardwerte laden',
      resetTitle: 'Auf Server-Standardwerte zurücksetzen',
      saveBtn: 'Speichern & Neu laden',
      confirmReset: 'Alle lokalen Marquee-Einstellungen auf Server-Standardwerte zurücksetzen?',
      libraryFilterHint: 'Hinweis: Diese Filter gelten nur für zufällige oder kürzlich hinzugefügte Medien. Sie haben keinen Einfluss auf feste Wiedergabelisten oder manuell angegebene Element-IDs.',
      onlyLocalTrailersLabel: 'Nur lokale Trailer abspielen',
      onlyLocalTrailersDesc: 'Keine Online-/YouTube-Trailer abspielen.',
      randomTrailerStartLabel: 'Zufällige Trailer-Startposition',
      randomTrailerStartDesc: 'Startet jeden Hintergrund-Trailer an einer zufälligen Position statt am Anfang (greift nur, wenn "Auf Trailer-Ende warten" deaktiviert ist). Für die Media Bar standardmäßig aktiv; deaktivieren, um immer am Anfang zu starten.',
      yoYoProgressBarLabel: 'Yo-Yo-Ladebalken',
      yoYoProgressBarDesc: 'Ladebalken bei abwechselnden Folien von links nach rechts leeren anstatt zurückzuspringen.',
      syncPageBackdropLabel: 'Seiten-Hintergrund synchronisieren',
      syncPageBackdropDesc: 'Spiegelt das Hintergrundbild der aktuellen Folie in den Seiten-Hintergrund von Jellyfin.',
      randomizeBackdropsLabel: 'Zufälliges Hintergrundbild',
      randomizeBackdropsDesc: 'Wählt ein zufälliges Hintergrundbild aus, falls mehrere vorhanden sind, anstatt immer das erste anzuzeigen.',
      hideSlideActionButtonsLabel: "Aktionsschaltflächen ausblenden",
      hideSlideActionButtonsDesc: "Blendet Info, Wiedergabe, Trailer und Favoriten aus. Über den Titel öffnest du den Eintrag.",
      enableBottomGradientLabel: 'Unteren Farbverlauf aktivieren',
      enableBottomGradientDesc: 'Blendet den unteren Rand der Media Bar weich in den Seiteninhalt aus (für eigene Themes/Skins deaktivierbar).',
      useRecommendationsLabel: 'Personalisierte Empfehlungen',
      useRecommendationsDesc: 'Zeigt Vorschläge basierend auf deinem bisherigen Sehverlauf.',
      requireLogoLabel: 'Titel-Logo erforderlich',
      requireLogoDesc: 'Nur Medien anzeigen, für die ein Titel-Logo vorhanden ist.',
      splitScreenTrailerLabel: 'Split-Screen Trailer-Ansicht',
      splitScreenTrailerDesc: 'Trailer-Video auf der rechten Seite mit weichem Verlauf anzeigen, während Poster und Filminfos links bleiben.',
      pauseOnHoverLabel: 'Pause bei Maus-Hover',
      pauseOnHoverDesc: 'Slideshow-Wechsel und Timer pausieren, während sich der Mauszeiger über der Media Bar befindet (Hinweis: Bei aktivem "Auf Trailer-Ende warten" wartet die Slideshow ohnehin auf laufende Videos).',
      pauseOnExternalPlaybackLabel: 'Bei externer Wiedergabe pausieren',
      pauseOnExternalPlaybackDesc: 'Slideshow und Trailer pausieren, wenn Medien extern wiedergegeben werden (z. B. MPV Shim, Cast).',
      toastMuted: 'Stumm geschaltet',
      toastUnmuted: 'Ton aktiviert',
      toastPaused: 'Diashow pausiert',
      toastResumed: 'Diashow fortgesetzt',
      seasonPrefix: 'Staffel {0}: ',
      episodePrefix: 'Folge {0}: ',
      seasonEpisodePrefix: 'Staffel {0}, Folge {1}: ',
      seasonLabel: 'Staffel',
      seasonsLabel: 'Staffeln',
      episodeLabel: 'Folge',
      episodesLabel: 'Folgen'
    },
    'es': {
      title: 'Ajustes de Marquee',
      groupGeneral: 'General',
      groupTrailers: 'Tráilers',
      groupLayout: 'Diseño',
      groupLineup: 'Selección',
      groupLibraries: 'Bibliotecas',
      enabledLabel: 'Habilitar Marquee',
      enabledDesc: 'Activa o desactiva toda la Media Bar.',
      videoBackdropsLabel: 'Habilitar fondos de tráiler',
      videoBackdropsDesc: 'Reproducir tráilers como videos de fondo.',
      trailerButtonLabel: 'Mostrar botón de tráiler',
      trailerButtonDesc: 'Muestra un botón para reproducir el tráiler en una ventana emergente (solo para fondos sin video).',
      mobileVideoLabel: 'Habilitar tráiler en móviles',
      mobileVideoDesc: 'Permitir fondos de tráiler en dispositivos móviles.',
      waitForTrailerLabel: 'Esperar a que termine el tráiler',
      waitForTrailerDesc: 'Espera a que el tráiler termine antes de cambiar de diapositiva.',
      slideAnimationsLabel: 'Habilitar animaciones',
      slideAnimationsDesc: 'Habilita el efecto de zoom (solo en imágenes de fondo).',
      mobileModeLabel: 'Relación de aspecto móvil',
      mobileModeDesc: 'Altura de la barra de medios en dispositivos móviles (vertical).',
      defaultTrailerVolumeLabel: 'Volumen predeterminado del tráiler',
      defaultTrailerVolumeDesc: 'Ajustar el volumen predeterminado del tráiler (en %).',
      hoverAudioFadeLabel: 'Atenuación de audio al pasar el ratón',
      hoverAudioFadeDesc: 'Estando silenciado, al pasar el ratón sobre la barra de medios el sonido se amplifica gradualmente y al salir se atenúa. Desactivado por defecto.',
      clientMenuLocationLabel: 'Ubicación de ajustes',
      clientMenuLocationDesc: 'Elige dónde se muestra el botón de ajustes (Barra de navegación, Menú lateral o Ambos).',
      clientMenuLocationMobileLabel: 'Ubicación de ajustes (Móvil)',
      clientMenuLocationMobileDesc: 'Elige dónde se muestra el botón de ajustes en dispositivos móviles.',
      transitionEffectLabel: 'Efecto de transición',
      transitionEffectDesc: 'Selecciona el estilo de transición entre diapositivas.',
      showProgressBarLabel: 'Mostrar barra de progreso',
      showProgressBarDesc: 'Muestra una línea de progreso de tiempo.',
      progressBarLocationLabel: 'Ubicación de la barra de progreso',
      progressBarLocationDesc: 'Elige dónde se muestra la barra de progreso de tiempo.',
      progressBarLocationDots: 'Debajo de los puntos / contador',
      progressBarLocationInside: 'Dentro del punto activo / contador',
      progressBarLocationNavbar: 'Parte superior (debajo de la cabecera)',
      showPaginationDotsLabel: 'Mostrar puntos / contador de paginación',
      showPaginationDotsDesc: 'Muestra los puntos de navegación o el contador de diapositivas en la parte inferior.',
      forceSlideCounterLabel: 'Forzar contador numérico',
      forceSlideCounterDesc: 'Fuerza el contador numérico de diapositivas en lugar de los puntos de paginación.',
      dotStyleLabel: 'Estilo de puntos',
      dotStyleDesc: 'Elige si el punto activo es redondo o una cápsula alargada.',
      optionDotStyleRound: 'Redondo (Clásico)',
      optionDotStylePill: 'Cápsula (Alargado)',
      activePlaylistLabel: 'Lista de reproducción activa',
      activePlaylistDesc: 'Selecciona qué lista de reproducción de mosaico mostrar.',
      optionMobileModeOriginal: 'Original (65vh)',
      optionMobileMode16_9: '16:9 (Compacto)',
      optionMobileMode4_3: '4:3 (Clásico)',
      optionMenuLocationNavbar: 'Barra de navegación',
      optionMenuLocationSidebar: 'Menú lateral',
      optionMenuLocationBoth: 'Ambos',
      optionTransitionFade: 'Desvanecimiento cruzado',
      optionTransitionSlideLeft: 'Deslizar a la izquierda',
      optionTransitionSlideRight: 'Deslizar a la derecha',
      optionTransitionSlideUp: 'Deslizar hacia arriba',
      optionTransitionSlideDown: 'Deslizar hacia abajo',
      optionTransitionZoomIn: 'Acercar (Zoom In)',
      optionTransitionZoomOut: 'Alejar (Zoom Out)',
      resetBtn: 'Cargar valores del servidor',
      resetTitle: 'Restablecer a valores del servidor',
      saveBtn: 'Guardar y recargar',
      confirmReset: '¿Restablecer todos los ajustes locales de Media Bar a los valores predeterminados del servidor?',
      libraryFilterHint: 'Nota: Estos filtros solo se aplican cuando se obtienen elementos aleatorios o recientes. No afectan a las listas de reproducción personalizadas ni a las listas fijas de IDs de elementos.',
      onlyLocalTrailersLabel: 'Solo reproducir trailers locales',
      onlyLocalTrailersDesc: 'No reproducir trailers remotos/YouTube.',
      randomTrailerStartLabel: 'Posición de inicio aleatoria del tráiler',
      randomTrailerStartDesc: 'Inicia cada tráiler de fondo en un momento aleatorio en lugar del principio (solo activo si "Esperar a que termine el tráiler" está desactivado). Activado por defecto en la barra de medios; desactívalo para empezar siempre desde el principio.',
      yoYoProgressBarLabel: 'Barra de progreso Yo-Yo',
      yoYoProgressBarDesc: 'Vaciar la barra de progreso de izquierda a derecha en diapositivas alternas en lugar de reiniciar.',
      syncPageBackdropLabel: 'Sincronizar fondo de página',
      syncPageBackdropDesc: 'Refleja la imagen de fondo de la diapositiva en el fondo de página de Jellyfin.',
      randomizeBackdropsLabel: 'Imagen de fondo aleatoria',
      randomizeBackdropsDesc: 'Selecciona una imagen de fondo aleatoria en lugar de siempre la primera cuando hay varias disponibles.',
      hideSlideActionButtonsLabel: "Ocultar botones de acción",
      hideSlideActionButtonsDesc: "Oculta los botones de información, reproducción, tráiler y favoritos. Selecciona el título para abrir el elemento.",
      enableBottomGradientLabel: 'Activar degradado inferior',
      enableBottomGradientDesc: 'Desvanece suavemente el borde inferior de la barra multimedia (desactivar para temas o skins personalizados).',
      useRecommendationsLabel: 'Recomendaciones personalizadas',
      useRecommendationsDesc: 'Muestra recomendaciones basadas en tu historial de reproducción.',
      requireLogoLabel: 'Requerir logo de título',
      requireLogoDesc: 'Solo incluir elementos que tengan un logo de título.',
      splitScreenTrailerLabel: 'Vista de tráiler en pantalla dividida',
      splitScreenTrailerDesc: 'Muestra el tráiler en la mitad derecha con un fundido suave, manteniendo el póster y los detalles a la izquierda.',
      pauseOnHoverLabel: 'Pausar al pasar el ratón',
      pauseOnHoverDesc: 'Pausa las transiciones y el temporizador mientras el cursor está sobre la barra de medios (Nota: si "Esperar a que termine el tráiler" está activado, la presentación ya espera al vídeo en reproducción).',
      pauseOnExternalPlaybackLabel: 'Pausar en reproducción externa',
      pauseOnExternalPlaybackDesc: 'Pausa la presentación y los tráilers al transmitir contenido a un reproductor externo (p. ej. MPV Shim, Chromecast).',
      toastMuted: 'Silenciado',
      toastUnmuted: 'Sonido activado',
      toastPaused: 'Diapositivas en pausa',
      toastResumed: 'Diapositivas en reproducción',
      seasonPrefix: 'Temporada {0}: ',
      episodePrefix: 'Episodio {0}: ',
      seasonEpisodePrefix: 'Temporada {0}, Episodio {1}: ',
      seasonLabel: 'Temporada',
      seasonsLabel: 'Temporadas',
      episodeLabel: 'Episodio',
      episodesLabel: 'Episodios'
    },
    'fr': {
      title: 'Paramètres de Marquee',
      groupGeneral: 'Général',
      groupTrailers: 'Bandes-annonces',
      groupLayout: 'Disposition',
      groupLineup: 'Sélection',
      groupLibraries: 'Bibliothèques',
      enabledLabel: 'Activer Marquee',
      enabledDesc: 'Active ou désactive toute la Media Bar.',
      videoBackdropsLabel: 'Activer les fonds de bande-annonce',
      videoBackdropsDesc: 'Lire les bandes-annonces comme vidéos en arrière-plan.',
      trailerButtonLabel: 'Afficher le bouton bande-annonce',
      trailerButtonDesc: 'Affiche un bouton pour lire la bande-annonce dans une popup (uniquement pour les fonds sans vidéo).',
      mobileVideoLabel: 'Activer les bandes-annonces sur mobile',
      mobileVideoDesc: 'Autoriser les bandes-annonces en arrière-plan sur les appareils mobiles.',
      waitForTrailerLabel: 'Attendre la fin de la bande-annonce',
      waitForTrailerDesc: 'Attendre la fin de la bande-annonce avant de changer de diapositive.',
      slideAnimationsLabel: 'Activer les animations',
      slideAnimationsDesc: 'Activer l\'effet de zoom (uniquement sur les images d\'arrière-plan).',
      mobileModeLabel: 'Format d\'image mobile',
      mobileModeDesc: 'Hauteur de la barre multimédia sur les appareils mobiles (portrait).',
      defaultTrailerVolumeLabel: 'Volume par défaut de la bande-annonce',
      defaultTrailerVolumeDesc: 'Définir le volume par défaut de la bande-annonce (en %).',
      hoverAudioFadeLabel: 'Fondu audio au survol',
      hoverAudioFadeDesc: 'Lorsque le son est coupé, survolez la barre multimédia pour faire monter le son en fondu et quittez pour le réduire. Désactivé par défaut.',
      clientMenuLocationLabel: 'Emplacement des paramètres',
      clientMenuLocationDesc: 'Choisissez où afficher le bouton des paramètres (Barre de navigation, Menu latéral ou Les deux).',
      clientMenuLocationMobileLabel: 'Emplacement des paramètres (Mobile)',
      clientMenuLocationMobileDesc: 'Choisissez où afficher le bouton des paramètres sur les appareils mobiles.',
      transitionEffectLabel: 'Effet de transition',
      transitionEffectDesc: 'Sélectionnez le style de transition entre les diapositives.',
      showProgressBarLabel: 'Afficher la barre de progression',
      showProgressBarDesc: 'Affiche une ligne de progression temporelle.',
      progressBarLocationLabel: 'Emplacement de la barre de progression',
      progressBarLocationDesc: 'Choisissez où la barre de progression temporelle est affichée.',
      progressBarLocationDots: 'Sous les points / compteur',
      progressBarLocationInside: 'Dans le point actif / compteur',
      progressBarLocationNavbar: 'En haut (sous l\'en-tête)',
      showPaginationDotsLabel: 'Afficher les points / compteur de pagination',
      showPaginationDotsDesc: 'Affiche les points de navigation ou le compteur de diapositives en bas.',
      forceSlideCounterLabel: 'Toujours utiliser le compteur',
      forceSlideCounterDesc: 'Force le compteur de diapositives numérique au lieu des points de pagination.',
      dotStyleLabel: 'Style des points',
      dotStyleDesc: 'Choisissez si le point actif est rond ou une capsule allongée.',
      optionDotStyleRound: 'Rond (Classique)',
      optionDotStylePill: 'Capsule (Allongé)',
      activePlaylistLabel: 'Liste de lecture active',
      activePlaylistDesc: 'Sélectionnez la liste de lecture personnalisée à afficher.',
      optionMobileModeOriginal: 'Original (65vh)',
      optionMobileMode16_9: '16:9 (Compact)',
      optionMobileMode4_3: '4:3 (Classique)',
      optionMenuLocationNavbar: 'Barre de navigation',
      optionMenuLocationSidebar: 'Menu latéral',
      optionMenuLocationBoth: 'Les deux',
      optionTransitionFade: 'Fondu enchaîné',
      optionTransitionSlideLeft: 'Glisser vers la gauche',
      optionTransitionSlideRight: 'Glisser vers la droite',
      optionTransitionSlideUp: 'Glisser vers le haut',
      optionTransitionSlideDown: 'Glisser vers le bas',
      optionTransitionZoomIn: 'Zoom avant (Zoom In)',
      optionTransitionZoomOut: 'Zoom arrière (Zoom Out)',
      resetBtn: 'Charger les valeurs par défaut',
      resetTitle: 'Réinitialiser aux valeurs du serveur',
      saveBtn: 'Enregistrer et recharger',
      confirmReset: 'Réinitialiser tous les paramètres locaux de Media Bar aux valeurs par défaut du serveur ?',
      libraryFilterHint: 'Remarque : ces filtres ne s\'appliquent que lors de la récupération d\'éléments aléatoires ou récents. Ils n\'affectent pas les listes de lecture personnalisées ni les listes fixes d\'identifiants d\'éléments.',
      onlyLocalTrailersLabel: 'Ne lire que les bandes-annonces locales',
      onlyLocalTrailersDesc: 'Ne pas lire les bandes-annonces distantes/YouTube.',
      randomTrailerStartLabel: 'Position de départ aléatoire de la bande-annonce',
      randomTrailerStartDesc: 'Démarre chaque bande-annonce en arrière-plan à un moment aléatoire au lieu du début (actif uniquement si "Attendre la fin de la bande-annonce" est désactivé). Activé par défaut pour la barre multimédia ; désactivez pour toujours démarrer du début.',
      yoYoProgressBarLabel: 'Barre de progression Yo-Yo',
      yoYoProgressBarDesc: 'Vider la barre de progression de gauche à droite sur les diapositives alternées au lieu de réinitialiser.',
      syncPageBackdropLabel: 'Synchroniser l\'arrière-plan de la page',
      syncPageBackdropDesc: 'Répète l\'image d\'arrière-plan de la diapositive active dans l\'arrière-plan de la page Jellyfin.',
      randomizeBackdropsLabel: 'Arrière-plan aléatoire',
      randomizeBackdropsDesc: 'Sélectionne un arrière-plan aléatoire au lieu de toujours le premier lorsque plusieurs sont disponibles.',
      hideSlideActionButtonsLabel: "Masquer les boutons d’action",
      hideSlideActionButtonsDesc: "Masque les boutons d’informations, de lecture, de bande-annonce et de favoris. Sélectionnez le titre pour ouvrir l’élément.",
      enableBottomGradientLabel: 'Activer le dégradé inférieur',
      enableBottomGradientDesc: 'Estompe doucement le bord inférieur de la barre multimédia (désactiver pour les thèmes personnalisés).',
      useRecommendationsLabel: 'Recommandations personnalisées',
      useRecommendationsDesc: 'Afficher des recommandations basées sur votre historique de visionnage.',
      requireLogoLabel: 'Exiger le logo du titre',
      requireLogoDesc: 'N\'inclure que les éléments disposant d\'un logo de titre.',
      splitScreenTrailerLabel: 'Vue bande-annonce en écran scindé',
      splitScreenTrailerDesc: 'Affiche la bande-annonce sur la moitié droite avec un fondu doux, en gardant l\'affiche et les infos à gauche.',
      pauseOnHoverLabel: 'Pause au survol de la souris',
      pauseOnHoverDesc: 'Suspend les transitions et le minuteur lorsque la souris survole la barre multimédia (Remarque : si "Attendre la fin de la bande-annonce" est activé, le diaporama attend déjà la fin de la vidéo).',
      pauseOnExternalPlaybackLabel: 'Pause lors de lecture externe',
      pauseOnExternalPlaybackDesc: 'Suspend le diaporama et les bandes-annonces lors d\'une diffusion vers un lecteur externe (ex. MPV Shim, Chromecast).',
      toastMuted: 'Muet',
      toastUnmuted: 'Son activé',
      toastPaused: 'Diaporama en pause',
      toastResumed: 'Reprise du diaporama',
      seasonPrefix: 'Saison {0}: ',
      episodePrefix: 'Épisode {0}: ',
      seasonEpisodePrefix: 'Saison {0}, Épisode {1}: ',
      seasonLabel: 'Saison',
      seasonsLabel: 'Saisons',
      episodeLabel: 'Épisode',
      episodesLabel: 'Épisodes'
    },
    'it': {
      title: 'Impostazioni di Marquee',
      groupGeneral: 'Generale',
      groupTrailers: 'Trailer',
      groupLayout: 'Layout',
      groupLineup: 'Selezione',
      groupLibraries: 'Librerie',
      enabledLabel: 'Abilita Marquee',
      enabledDesc: 'Attiva o disattiva l\'intera Media Bar.',
      videoBackdropsLabel: 'Abilita sfondi trailer',
      videoBackdropsDesc: 'Riproduci trailer come video in background.',
      trailerButtonLabel: 'Mostra pulsante trailer',
      trailerButtonDesc: 'Mostra il pulsante per riprodurre il trailer (solo per sfondi senza video).',
      mobileVideoLabel: 'Abilita trailer su mobile',
      mobileVideoDesc: 'Consenti sfondi trailer sui dispositivi mobili.',
      waitForTrailerLabel: 'Attendi fine trailer',
      waitForTrailerDesc: 'Attende la fine del trailer prima di cambiare diapositiva.',
      slideAnimationsLabel: 'Abilita animazioni',
      slideAnimationsDesc: 'Abilita l\'effetto zoom (solo sulle immagini di sfondo).',
      mobileModeLabel: 'Proporzioni mobile',
      mobileModeDesc: 'Altezza della barra multimediale sui dispositivi mobili in verticale.',
      defaultTrailerVolumeLabel: 'Volume predefinito del trailer',
      defaultTrailerVolumeDesc: 'Imposta il volume predefinito per il trailer (in %).',
      hoverAudioFadeLabel: 'Dissolvenza audio al passaggio del mouse',
      hoverAudioFadeDesc: 'Quando il volume è disattivato, passa il mouse sulla barra multimediale per sfumare l\'audio in ingresso e esci per sfumarlo in uscita. Disattivato per impostazione predefinita.',
      clientMenuLocationLabel: 'Posizione impostazioni',
      clientMenuLocationDesc: 'Scegli dove mostrare il pulsante delle impostazioni (Barra di navigazione, Menu laterale o Entrambi).',
      clientMenuLocationMobileLabel: 'Posizione impostazioni (Mobile)',
      clientMenuLocationMobileDesc: 'Scegli dove mostrare il pulsante delle impostazioni sui dispositivi mobili.',
      transitionEffectLabel: 'Effetto di transizione',
      transitionEffectDesc: 'Seleziona lo stile di transizione tra le diapositive.',
      showProgressBarLabel: 'Mostra barra di avanzamento',
      showProgressBarDesc: 'Mostra una linea di avanzamento del tempo.',
      progressBarLocationLabel: 'Posizione della barra di avanzamento',
      progressBarLocationDesc: 'Scegli dove mostrare la barra di avanzamento del tempo.',
      progressBarLocationDots: 'Sotto i punti / contatore',
      progressBarLocationInside: 'Nel punto attivo / contatore',
      progressBarLocationNavbar: 'In alto (sotto l\'intestazione)',
      showPaginationDotsLabel: 'Mostra punti / contatore di navigazione',
      showPaginationDotsDesc: 'Mostra i punti di navigazione o il contatore delle diapositive in basso.',
      forceSlideCounterLabel: 'Forza contatore diapositive',
      forceSlideCounterDesc: 'Forza il contatore numerico delle diapositive al posto dei punti di paginazione.',
      dotStyleLabel: 'Stile dei punti',
      dotStyleDesc: 'Scegli se il punto attivo è rotondo o una capsula allungata.',
      optionDotStyleRound: 'Rotondo (Classico)',
      optionDotStylePill: 'Capsula (Allungata)',
      activePlaylistLabel: 'Playlist attiva',
      activePlaylistDesc: 'Seleziona quale playlist personalizzata visualizzare.',
      optionMobileModeOriginal: 'Originale (65vh)',
      optionMobileMode16_9: '16:9 (Compatto)',
      optionMobileMode4_3: '4:3 (Classico)',
      optionMenuLocationNavbar: 'Barra di navigazione',
      optionMenuLocationSidebar: 'Menu laterale',
      optionMenuLocationBoth: 'Entrambi',
      optionTransitionFade: 'Dissolvenza in linea (Crossfade)',
      optionTransitionSlideLeft: 'Scorri a sinistra',
      optionTransitionSlideRight: 'Scorri a destra',
      optionTransitionSlideUp: 'Scorri verso l\'alto',
      optionTransitionSlideDown: 'Scorri verso il basso',
      optionTransitionZoomIn: 'Ingrandisci (Zoom In)',
      optionTransitionZoomOut: 'Rimpicciolisci (Zoom Out)',
      resetBtn: 'Carica valori del server',
      resetTitle: 'Ripristina valori del server',
      saveBtn: 'Salva e ricarica',
      confirmReset: 'Ripristinare tutte le impostazioni locali di Media Bar ai valori predefiniti del server?',
      libraryFilterHint: 'Nota: questi filtri si applicano solo quando si recuperano elementi casuali o recenti. Non influiscono sulle playlist personalizzate o sugli elenchi fissi di ID elemento.',
      onlyLocalTrailersLabel: 'Riproduci solo trailer locali',
      onlyLocalTrailersDesc: 'Non riprodurre trailer remoti/YouTube.',
      randomTrailerStartLabel: 'Posizione di avvio casuale del trailer',
      randomTrailerStartDesc: 'Avvia ciascun trailer in background in un punto casuale anziché dall\'inizio (attivo solo se "Attendi fine trailer" è disattivato). Attivo per impostazione predefinita per la barra multimediale; disattiva per iniziare sempre dall\'inizio.',
      yoYoProgressBarLabel: 'Barra di avanzamento Yo-Yo',
      yoYoProgressBarDesc: 'Svuota la barra di avanzamento da sinistra a destra nelle diapositive alternate invece di ripristinare.',
      syncPageBackdropLabel: 'Sincronizza sfondo pagina',
      syncPageBackdropDesc: 'Riflette l\'immagine di sfondo della diapositiva corrente nello sfondo della pagina di Jellyfin.',
      randomizeBackdropsLabel: 'Sfondo casuale',
      randomizeBackdropsDesc: 'Seleziona un\'immagine di sfondo casuale anziché sempre la prima quando ce ne sono diverse disponibili.',
      hideSlideActionButtonsLabel: "Nascondi i pulsanti di azione",
      hideSlideActionButtonsDesc: "Nasconde i pulsanti di informazioni, riproduzione, trailer e preferiti. Seleziona il titolo per aprire il contenuto.",
      enableBottomGradientLabel: 'Attiva sfumatura inferiore',
      enableBottomGradientDesc: 'Sfuma delicatamente il bordo inferiore della barra multimediale (disattivare per skin personalizzate).',
      useRecommendationsLabel: 'Raccomandazioni personalizzate',
      useRecommendationsDesc: 'Mostra suggerimenti basati sulla tua cronologia di visione.',
      requireLogoLabel: 'Richiedi logo del titolo',
      requireLogoDesc: 'Includi solo elementi che hanno un logo di titolo.',
      splitScreenTrailerLabel: 'Vista trailer a schermo diviso',
      splitScreenTrailerDesc: 'Mostra il video del trailer sulla metà destra con sfumatura morbida, mantenendo la locandina e i dettagli a sinistra.',
      pauseOnHoverLabel: 'Metti in pausa al passaggio del mouse',
      pauseOnHoverDesc: 'Mette in pausa le transizioni e il timer mentre il cursore è sopra la barra multimediale (Nota: se "Attendi fine trailer" è attivo, la presentazione attende già la fine del video).',
      pauseOnExternalPlaybackLabel: 'Pausa durante riproduzione esterna',
      pauseOnExternalPlaybackDesc: 'Mette in pausa la presentazione e i trailer durante la trasmissione su un lettore esterno (es. MPV Shim, Chromecast).',
      toastMuted: 'Disattivato',
      toastUnmuted: 'Audio attivato',
      toastPaused: 'Presentazione in pausa',
      toastResumed: 'Presentazione ripresa',
      seasonPrefix: 'Stagione {0}: ',
      episodePrefix: 'Episodio {0}: ',
      seasonEpisodePrefix: 'Stagione {0}, Episodio {1}: ',
      seasonLabel: 'Stagione',
      seasonsLabel: 'Stagioni',
      episodeLabel: 'Episodio',
      episodesLabel: 'Episodi'
    }
  };

  // State management
  const STATE = {
    jellyfinData: {
      userId: null,
      appName: null,
      appVersion: null,
      deviceName: null,
      deviceId: null,
      accessToken: null,
      serverAddress: null,
    },
    slideshow: {
      hasInitialized: false,
      initialLoadComplete: false,
      isTransitioning: false,
      isPaused: false,
      currentSlideIndex: 0,
      focusedSlide: null,
      containerFocused: false,
      slideInterval: null,
      itemIds: [],
      loadedItems: {},
      createdSlides: {},
      totalItems: 0,
      isLoading: false,
      videoPlayers: {},
      sponsorBlockInterval: null,
      isMuted: CONFIG.startMuted,
      customTrailerUrls: {},
      ytPromise: null,
      autoplayTimeouts: [],
      playSignals: {},
      hoverAudioEngaged: false,
      volumeFadeToken: 0,
      hasUserInteracted: false,
      trailerStartByItem: {},
      failsafeTimeout: null,
      isVideoPlaying: false,
      wasOnDetailsPage: false,
      wasHomeButtonClicked: false,
    },
  };

  /**
   * Central helper function to detect if Jellyfin is running in TV mode
   * and automatically synchronize TV CSS classes.
   * @returns {boolean} True if running on a TV device or in TV layout mode.
   */
  const isTvMode = () => {
    const isTvDevice = !!(window.browser && window.browser.tv);
    const isTvLayout = !!(window.layoutManager && window.layoutManager.tv);
    const hasTvClass = document.documentElement.classList.contains('layout-tv') ||
      document.body.classList.contains('layout-tv') ||
      document.body.classList.contains('media-bar-tv-mode');
    const isTv = isTvDevice || isTvLayout || hasTvClass;

    if (isTv) {
      if (!document.body.classList.contains('media-bar-tv-mode')) {
        document.body.classList.add('media-bar-tv-mode');
      }
      if (!document.documentElement.classList.contains('media-bar-tv-mode')) {
        document.documentElement.classList.add('media-bar-tv-mode');
      }
    }

    return isTv;
  };

  /**
   * Central helper function to detect if Jellyfin is running version 12
   * and automatically synchronize the jellyfin-v12 CSS class.
   * @returns {boolean} True if running Jellyfin v12.
   */
  const isV12 = () => {
    const serverVer = (window.ApiClient?._serverInfo?.Version)
      || (typeof window.ApiClient?.serverVersion === 'function' ? window.ApiClient.serverVersion() : '')
      || '';
    const serverMajorVer = parseInt(serverVer.split('.')[0], 10);
    const appVer = STATE.jellyfinData?.appVersion || '';
    const majorVer = parseInt(appVer.split('.')[0], 10);

    const isV12Active = !!(
      document.querySelector('.MuiAppBar-root, .MuiToolbar-root') ||
      (serverVer.startsWith('12.') || serverMajorVer >= 12) ||
      (appVer.startsWith('12.') || majorVer >= 12)
    );

    if (document.body) {
      if (isV12Active) {
        document.body.classList.add('jellyfin-v12');
      } else {
        document.body.classList.remove('jellyfin-v12');
      }
    }

    return isV12Active;
  };

  // Immediate detection check
  isV12();

  // Request throttling system
  const requestQueue = [];
  let isProcessingQueue = false;

  /**
   * Process the next request in the queue with throttling
   */
  const processNextRequest = () => {
    if (requestQueue.length === 0) {
      isProcessingQueue = false;
      return;
    }

    isProcessingQueue = true;
    const { url, callback } = requestQueue.shift();

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response;
        }
        throw new Error(`Failed to fetch: ${response.status}`);
      })
      .then(callback)
      .catch((error) => {
        console.error("🎬 Media Bar:", "Error in throttled request:", error);
      })
      .finally(() => {
        setTimeout(processNextRequest, 100);
      });
  };

  /**
   * Add a request to the throttled queue
   * @param {string} url - URL to fetch
   * @param {Function} callback - Callback to run on successful fetch
   */
  const addThrottledRequest = (url, callback) => {
    requestQueue.push({ url, callback });
    if (!isProcessingQueue) {
      processNextRequest();
    }
  };

  /**
   * Checks if the user is currently logged in
   * @returns {boolean} True if logged in, false otherwise
   */

  const isUserLoggedIn = () => {
    try {
      const apiClient = window.ApiClient;
      if (!apiClient) return false;

      if (typeof apiClient.isLoggedIn === 'function') {
        const loggedIn = apiClient.isLoggedIn();
        if (typeof loggedIn === 'boolean') return loggedIn;
      }

      const userId = (typeof apiClient.getCurrentUserId === 'function' ? apiClient.getCurrentUserId() : null) || (apiClient._currentUser ? apiClient._currentUser.Id : null);
      const token = (typeof apiClient.accessToken === 'function' ? apiClient.accessToken() : null) || (apiClient._serverInfo ? apiClient._serverInfo.AccessToken : null);

      return !!(userId && token);
    } catch (error) {
      console.error("🎬 Media Bar:", "Error checking login status:", error);
      return false;
    }
  };

  /**
   * Detects if the current device is a low-power device (Smart TVs, etc.)
   * @returns {boolean} True if running on a low-power device
   */
  const isLowPowerDevice = () => {
    return /webOS|LG Browser|SMART-TV|SmartTV|Tizen|Viera|NetCast|Roku|VIDAA/i.test(navigator.userAgent);
  };

  /**
   * Detects if the current device is an iOS or iPadOS device (including iPads reporting desktop Mac UA)
   * @returns {boolean} True if running on iOS or iPadOS
   */
  const isIOSDevice = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (/Macintosh/i.test(navigator.userAgent));
  };

  /**
   * Initializes Jellyfin data from ApiClient
   * @param {Function} callback - Function to call once data is initialized
   */
  const initJellyfinData = (callback) => {
    if (!window.ApiClient) {
      console.warn("🎬 Media Bar:", "window.ApiClient is not available yet. Retrying...");
      setTimeout(() => initJellyfinData(callback), CONFIG.retryInterval);
      return;
    }

    try {
      const apiClient = window.ApiClient;
      const getVal = (fnName, propName, fallback) => {
        try {
          if (typeof apiClient[fnName] === 'function') {
            const v = apiClient[fnName]();
            if (v != null && v !== '') return v;
          }
        } catch (e) { }
        if (propName && apiClient[propName] != null) return apiClient[propName];
        if (propName === '_serverInfo' && apiClient._serverInfo) {
          return apiClient._serverInfo.AccessToken || apiClient._serverInfo.Id || fallback;
        }
        return fallback || "Not Found";
      };

      STATE.jellyfinData = {
        userId: getVal('getCurrentUserId', '_currentUser', 'Not Found'),
        appName: getVal('appName', '_appName', 'Jellyfin Web'),
        appVersion: getVal('appVersion', '_appVersion', '10.10.0'),
        deviceName: getVal('deviceName', '_deviceName', 'Browser'),
        deviceId: getVal('deviceId', '_deviceId', 'browser'),
        accessToken: getVal('accessToken', '_serverInfo', 'Not Found'),
        serverId: getVal('serverId', '_serverInfo', 'Not Found'),
        serverAddress: getVal('serverAddress', '_serverAddress', window.location.origin),
        pluginVersion,
      };

      try {
        isV12();
      } catch (e) { }

      if (callback && typeof callback === "function") {
        callback();
      }
    } catch (error) {
      console.error("🎬 Media Bar:", "Error initializing Jellyfin data:", error);
      setTimeout(() => initJellyfinData(callback), CONFIG.retryInterval);
    }
  };

  /**
   * Initializes localization by loading translation chunks
   */
  const initLocalization = async () => {
    try {
      const locale = await LocalizationUtils.getCurrentLocale();
      await LocalizationUtils.loadTranslations(locale);
      console.log("🎬 Media Bar:", "Localization initialized for locale:", locale);
    } catch (error) {
      console.error("🎬 Media Bar:", "Error initializing localization:", error);
    }
  };

  /**
   * Creates and displays loading screen
   */

  const isOnHomePage = () => {
    const currentPath = window.location.href.toLowerCase().replace(window.location.origin, "");
    return (
      currentPath.includes("/web/#/home.html") ||
      currentPath.includes("/web/#/home") ||
      currentPath.includes("/web/index.html#/home.html") ||
      currentPath === "/web/index.html#/home" ||
      currentPath.endsWith("/web/")
    );
  };

  const initLoadingScreen = () => {
    if (!isOnHomePage()) return;

    // Check LocalStorage for cached preference to avoid flash
    const cachedSetting = localStorage.getItem('mediaBarEnhanced-enableLoadingScreen');
    if (cachedSetting === 'false') {
      return;
    }

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "bar-loading";
    loadingDiv.id = "page-loader";
    loadingDiv.innerHTML = `
    <div class="loader-content">
      <h1>
        <div class="splashLogo"></div>
      </h1>
      <div class="progress-container">
        <div class="progress-bar" id="progress-bar"></div>
        <div class="progress-gap" id="progress-gap"></div>
        <div class="unfilled-bar" id="unfilled-bar"></div>
      </div>
    </div>
  `;
    document.body.appendChild(loadingDiv);

    requestAnimationFrame(() => {
      document.querySelector(".bar-loading h1 div").style.opacity = "1";
    });

    const progressBar = document.getElementById("progress-bar");
    const unfilledBar = document.getElementById("unfilled-bar");

    let progress = 0;
    let lastIncrement = 5;

    const progressInterval = setInterval(() => {
      if (progress < 95) {
        lastIncrement = Math.max(0.5, lastIncrement * 0.98);
        const randomFactor = 0.8 + Math.random() * 0.4;
        const increment = lastIncrement * randomFactor;
        progress += increment;
        progress = Math.min(progress, 95);

        progressBar.style.width = `${progress}%`;
        unfilledBar.style.width = `${100 - progress}%`;
      }
    }, 150);

    const checkInterval = setInterval(() => {
      // Poll the URL so we also catch navigation that fires no hashchange/popstate.
      if (!isOnHomePage()) {
        finishLoading();
        return;
      }

      const loginFormLoaded = document.querySelector(".manualLoginForm");
      const activeTab = document.querySelector(".pageTabContent.is-active");

      if (loginFormLoaded) {
        finishLoading();
        return;
      }

      if (activeTab) {
        const tabIndex = activeTab.getAttribute("data-index");

        if (tabIndex === "0") {
          const homeSections = document.querySelector(".homeSectionsContainer");
          const slidesContainer = document.querySelector("#slides-container");

          if (homeSections && slidesContainer) {
            const hasSlide = !!slidesContainer.querySelector(".slide");
            const isDisabledOrHidden = slidesContainer.style.display === "none" || !CONFIG.enableMediaBar;
            const isInitialLoadFinished = STATE.slideshow.initialLoadComplete === true;

            if (hasSlide || isDisabledOrHidden || isInitialLoadFinished) {
              finishLoading();
            }
          }
        } else {
          if (
            activeTab.children.length > 0 ||
            activeTab.innerText.trim().length > 0
          ) {
            finishLoading();
          }
        }
      }
    }, CONFIG.loadingCheckInterval);

    const finishLoading = () => {
      clearInterval(progressInterval);
      clearInterval(checkInterval);
      window.removeEventListener("hashchange", leavePageHandler);
      window.removeEventListener("popstate", leavePageHandler);
      progressBar.style.transition = "width 300ms ease-in-out";
      progressBar.style.width = "100%";
      unfilledBar.style.width = "0%";

      progressBar.addEventListener("transitionend", () => {
        requestAnimationFrame(() => {
          const loader = document.querySelector(".bar-loading");
          if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => {
              loader.remove();
            }, 300);
          }
        });
      });
    };

    // Fast path; the checkInterval poll above is the fallback.
    const leavePageHandler = () => {
      if (!isOnHomePage()) {
        finishLoading();
      }
    };
    window.addEventListener("hashchange", leavePageHandler);
    window.addEventListener("popstate", leavePageHandler);

    // Global Failsafe, force remove loading screen after 15 seconds to prevent infinite lockouts
    setTimeout(() => {
      const loader = document.querySelector(".bar-loading");
      if (loader) {
        console.warn("🎬 Media Bar:", "Loading screen timed out! Forcing removal as a failsafe.");
        finishLoading();
      }
    }, 15000);
  };

  /**
   * Resets the slideshow state completely
   */
  const resetSlideshowState = () => {
    console.log("🎬 Media Bar:", "Resetting slideshow state...");

    if (STATE.slideshow.slideInterval) {
      STATE.slideshow.slideInterval.stop();
    }

    // Destroy all video players
    if (STATE.slideshow.videoPlayers) {
      Object.values(STATE.slideshow.videoPlayers).forEach(player => {
        if (player && typeof player.destroy === 'function') {
          player.destroy();
        }
      });
      STATE.slideshow.videoPlayers = {};
    }

    if (STATE.slideshow.sponsorBlockInterval) {
      clearInterval(STATE.slideshow.sponsorBlockInterval);
      STATE.slideshow.sponsorBlockInterval = null;
    }

    const container = document.getElementById("slides-container");
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    STATE.slideshow.hasInitialized = false;
    STATE.slideshow.initialLoadComplete = false;
    STATE.slideshow.isTransitioning = false;
    STATE.slideshow.isPaused = false;
    STATE.slideshow.currentSlideIndex = 0;
    STATE.slideshow.focusedSlide = null;
    STATE.slideshow.containerFocused = false;
    STATE.slideshow.slideInterval = null;
    STATE.slideshow.itemIds = [];
    STATE.slideshow.loadedItems = {};
    STATE.slideshow.createdSlides = {};
    STATE.slideshow.customTrailerUrls = {};
    STATE.slideshow.totalItems = 0;
    STATE.slideshow.isLoading = false;
    STATE.slideshow.playSignals = {};
    STATE.slideshow.hasTrailer = {};
    if (STATE.slideshow.failsafeTimeout) {
      clearTimeout(STATE.slideshow.failsafeTimeout);
      STATE.slideshow.failsafeTimeout = null;
    }
    STATE.slideshow.isVideoPlaying = false;
  };

  /**
   * Watches for login status changes
   */
  const startLoginStatusWatcher = () => {
    let wasLoggedIn = false;

    setInterval(() => {
      const isLoggedIn = isUserLoggedIn();

      if (isLoggedIn !== wasLoggedIn) {
        if (isLoggedIn) {
          console.log("🎬 Media Bar:", "User logged in. Initializing slideshow...");
          if (!STATE.slideshow.hasInitialized) {
            waitForApiClientAndInitialize();
          } else {
            console.log("🎬 Media Bar:", "Slideshow already initialized, skipping");
          }
        } else {
          console.log("🎬 Media Bar:", "User logged out. Stopping slideshow...");
          resetSlideshowState();
        }
        wasLoggedIn = isLoggedIn;
      }
    }, 2000);
  };

  /**
   * Wait for ApiClient to initialize before starting the slideshow
   */
  const waitForApiClientAndInitialize = () => {
    if (window.slideshowCheckInterval) {
      clearInterval(window.slideshowCheckInterval);
    }

    window.slideshowCheckInterval = setInterval(() => {
      if (!window.ApiClient) {
        console.log("🎬 Media Bar:", "ApiClient not available yet. Waiting...");
        return;
      }

      if (isUserLoggedIn()) {
        console.log("🎬 Media Bar:",
          "🔓 User is fully logged in. Starting slideshow initialization..."
        );
        clearInterval(window.slideshowCheckInterval);

        if (!STATE.slideshow.hasInitialized) {
          initJellyfinData(async () => {
            console.log("🎬 Media Bar:", "Jellyfin API client initialized successfully");
            await initLocalization();
            await fetchPluginConfig();
            if (CONFIG.enableClientSideSettings) {
              try {
                const user = await window.ApiClient.getCurrentUser();
                CONFIG.enableClientSideSettings = user?.Policy?.IsAdministrator === true;
              } catch {
                CONFIG.enableClientSideSettings = false;
              }
            }
            slidesInit();
          });
        } else {
          console.log("🎬 Media Bar:", "Slideshow already initialized, skipping");
        }
      } else {
        console.log("🎬 Media Bar:",
          "🔒 Authentication incomplete. Waiting for complete login..."
        );
      }
    }, CONFIG.retryInterval);
  };

  const fetchPluginConfig = async () => {
    try {
      const response = await fetch('../MediaBarEnhanced/Config', { cache: 'no-store' });
      if (response.ok) {
        pluginVersion = response.headers.get("X-Marquee-Version") || "";
        STATE.jellyfinData.pluginVersion = pluginVersion;
        const pluginConfig = await response.json();
        if (pluginConfig) {
          for (const key in pluginConfig) {
            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
            if (CONFIG.hasOwnProperty(camelKey)) {
              CONFIG[camelKey] = pluginConfig[key];
            }
          }
          STATE.slideshow.isMuted = CONFIG.startMuted;
          try {
            const logos = await fetch("../MediaBarEnhanced/StudioLogos");
            if (logos.ok) STATE.studioLogos = await logos.json();
          } catch { /* Jellyfin artwork is still available. */ }

          if (!CONFIG.enableLoadingScreen) {
            const loader = document.querySelector(".bar-loading");
            if (loader) {
              loader.remove();
            }
          }

          // Sync to LocalStorage for next load
          localStorage.setItem('mediaBarEnhanced-enableLoadingScreen', CONFIG.enableLoadingScreen);

          console.log("🎬 Media Bar:", "MediaBarEnhanced config loaded", CONFIG);
        }
      }
    } catch (e) {
      console.error("🎬 Media Bar:", "Failed to load MediaBarEnhanced config", e);
    }
  };

  waitForApiClientAndInitialize();

  /**
   * Utility functions for slide creation and management
   */
  const SlideUtils = {
    /**
     * Sorts items based on configuration
     * @param {Array<Object>} items - Array of item objects
     * @param {string} sortBy - Sort criteria
     * @param {string} sortOrder - Sort order 'Ascending' or 'Descending'
     * @returns {Array<Object>} Sorted array of items
     */
    sortItems(items, sortBy, sortOrder) {
      if (sortBy === 'Random' || sortBy === 'Original') {
        return items;
      }

      if (sortBy === 'RecentlyAddedWeighted') {
        return this.weightedRandomSample(items, items.length);
      }

      const simpleCompare = (a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      };

      const sorted = [...items].sort((a, b) => {
        let valA, valB;

        switch (sortBy) {
          case 'DateCreated':
            valA = a.DateCreated ? new Date(a.DateCreated).getTime() : 0;
            valB = b.DateCreated ? new Date(b.DateCreated).getTime() : 0;
            break;
          case 'PremiereDate':
            valA = new Date(a.PremiereDate).getTime();
            valB = new Date(b.PremiereDate).getTime();
            break;
          case 'ProductionYear':
            valA = a.ProductionYear || 0;
            valB = b.ProductionYear || 0;
            break;
          case 'CriticRating':
            valA = a.CriticRating || 0;
            valB = b.CriticRating || 0;
            break;
          case 'CommunityRating':
            valA = a.CommunityRating || 0;
            valB = b.CommunityRating || 0;
            break;
          case 'Runtime':
            valA = a.RunTimeTicks || 0;
            valB = b.RunTimeTicks || 0;
            break;
          case 'Name':
            valA = (a.Name || '').toLowerCase();
            valB = (b.Name || '').toLowerCase();
            break;
          default:
            return 0;
        }

        return simpleCompare(valA, valB);
      });

      if (sortOrder === 'Descending') {
        sorted.reverse();
      }

      return sorted;
    },

    /**
     * Samples items with probability weighted towards recently added items (power decay)
     * @param {Array} items - Items array
     * @param {number} maxCount - Max number of items to select
     * @returns {Array} Selected items array
     */
    weightedRandomSample(items, maxCount) {
      if (!items || items.length <= maxCount) {
        return this.shuffleArray(items ? [...items] : []);
      }

      const sorted = [...items].sort((a, b) => {
        const da = a.DateCreated ? new Date(a.DateCreated).getTime() : 0;
        const db = b.DateCreated ? new Date(b.DateCreated).getTime() : 0;
        return db - da;
      });

      const pool = sorted.map((item, idx) => ({
        item,
        weight: 1 / Math.pow(idx + 1, 0.6)
      }));

      const selected = [];
      const selectedIds = new Set();
      const count = Math.min(maxCount, pool.length);

      while (selected.length < count && pool.length > 0) {
        const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
        let rand = Math.random() * totalWeight;
        let chosenIdx = 0;

        for (let i = 0; i < pool.length; i++) {
          rand -= pool[i].weight;
          if (rand <= 0) {
            chosenIdx = i;
            break;
          }
        }

        const chosen = pool.splice(chosenIdx, 1)[0];
        if (!selectedIds.has(chosen.item.Id)) {
          selectedIds.add(chosen.item.Id);
          selected.push(chosen.item);
        }
      }

      return this.shuffleArray(selected);
    },

    /**
     * Shuffles array elements randomly
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    },

    /**
     * Parses a year or year-range expression into years array and optional min/max premiere dates
     * Supports:
     * - "2024"                 --> [2024]
     * - "2000-2010", "2000..2010" --> [2000, 2001, ..., 2010]
     * - "2000s", "90s", "1990s"   --> decade range, e.g. 2000-2009
     * - "2020+", ">=2020"      --> minPremiereDate: "2020-01-01T00:00:00.000Z" + years up to currentYear+1
     * - "<=1999", "-1999"      --> maxPremiereDate: "1999-12-31T23:59:59.999Z"
     * - "2020, 2021, 2022"     --> [2020, 2021, 2022]
     * @param {string} expr
     * @returns {{ years: number[], minPremiereDate: string|null, maxPremiereDate: string|null }}
     */
    parseYearExpression(expr) {
      if (!expr || typeof expr !== 'string') return { years: [], minPremiereDate: null, maxPremiereDate: null };
      const trimmed = expr.trim();
      if (!trimmed) return { years: [], minPremiereDate: null, maxPremiereDate: null };

      const years = new Set();
      let minPremiereDate = null;
      let maxPremiereDate = null;
      const currentYear = new Date().getFullYear();

      // Check for decade format: e.g. "1990s" or "2000s" or "90s"
      const decadeMatch = trimmed.match(/^(?:19|20)?(\d{2})0s$/i);
      if (decadeMatch) {
        let baseYear = parseInt(decadeMatch[0].replace(/s$/i, ''), 10);
        if (baseYear < 100) baseYear += 1900;
        for (let y = baseYear; y <= baseYear + 9; y++) {
          years.add(y);
        }
        return { years: Array.from(years), minPremiereDate, maxPremiereDate };
      }

      // Check for range: e.g. "2000-2010" or "2000..2010" or "2000 to 2010"
      const rangeMatch = trimmed.match(/^(\d{4})\s*(?:[-–—..]|to)\s*(\d{4})$/i);
      if (rangeMatch) {
        const start = Math.min(parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10));
        const end = Math.max(parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10));
        for (let y = start; y <= end; y++) {
          years.add(y);
        }
        return { years: Array.from(years), minPremiereDate, maxPremiereDate };
      }

      // Check for >= or +: e.g. "2020+" or ">=2020" or ">2019"
      const greaterMatch = trimmed.match(/^(?:>=?\s*(\d{4})|(\d{4})\+)$/);
      if (greaterMatch) {
        const yr = parseInt(greaterMatch[1] || greaterMatch[2], 10);
        minPremiereDate = `${yr}-01-01T00:00:00.000Z`;
        const endYr = Math.max(yr, currentYear + 1);
        for (let y = yr; y <= endYr; y++) {
          years.add(y);
        }
        return { years: Array.from(years), minPremiereDate, maxPremiereDate };
      }

      // Check for <= or -: e.g. "<=1999" or "-1999" or "<2000"
      const lesserMatch = trimmed.match(/^(?:<=\s*(\d{4})|-(\d{4}))$/);
      if (lesserMatch) {
        const yr = parseInt(lesserMatch[1] || lesserMatch[2], 10);
        maxPremiereDate = `${yr}-12-31T23:59:59.999Z`;
        return { years: [], minPremiereDate, maxPremiereDate };
      }

      // Check for comma or whitespace separated list of 4-digit years
      const matches = trimmed.match(/\b\d{4}\b/g);
      if (matches) {
        matches.forEach(m => years.add(parseInt(m, 10)));
      }

      return { years: Array.from(years), minPremiereDate, maxPremiereDate };
    },

    /**
     * Parses a rating expression into officialRatings array, minCommunityRating, and maxOfficialRating
     * Supports:
     * - "PG-13", "R", "TV-MA", "FSK-16" -> officialRatings: ["PG-13", ...]
     * - ">=7.5", "7.5+", ">8", "8.5"   -> minCommunityRating: 7.5
     * - "<=16", "<18", "max 12"        -> maxOfficialRating: 16
     * - "12, 16, 18"                   -> officialRatings: ["12", "16", "18"]
     * @param {string} expr
     * @param {string} prefix
     * @returns {{ officialRatings: string[], minCommunityRating: number|null, maxOfficialRating: number|null }}
     */
    parseRatingExpression(expr, prefix = 'rating') {
      const res = { officialRatings: [], minCommunityRating: null, maxOfficialRating: null };
      if (!expr || typeof expr !== 'string') return res;
      const trimmed = expr.trim();
      if (!trimmed) return res;

      // If prefix was explicitly minrating, communityrating, or score:
      if (/^(?:minrating|communityrating|score)$/i.test(prefix)) {
        const num = parseFloat(trimmed.replace(/[^\d.]/g, ''));
        if (!isNaN(num)) res.minCommunityRating = num;
        return res;
      }

      // If prefix was explicitly age or parental:
      if (/^(?:age|parental)$/i.test(prefix)) {
        const num = parseInt(trimmed.replace(/\D/g, ''), 10);
        if (!isNaN(num)) {
          res.maxOfficialRating = num;
        } else {
          res.officialRatings.push(trimmed);
        }
        return res;
      }

      // General rating / ratings / officialrating
      // Check for community rating score pattern: e.g. ">= 7.5", "8+", "> 7"
      const minScoreMatch = trimmed.match(/^(?:>=\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\+|>\s*(\d+(?:\.\d+)?))$/);
      if (minScoreMatch) {
        const score = parseFloat(minScoreMatch[1] || minScoreMatch[2] || minScoreMatch[3]);
        if (!isNaN(score)) res.minCommunityRating = score;
        return res;
      }

      // Check for max age rating pattern: e.g. "<= 16", "< 18", "max 12"
      const maxAgeMatch = trimmed.match(/^(?:<=\s*(\d+)|<\s*(\d+)|max\s*(\d+))$/i);
      if (maxAgeMatch) {
        const age = parseInt(maxAgeMatch[1] || maxAgeMatch[2] || maxAgeMatch[3], 10);
        if (!isNaN(age)) res.maxOfficialRating = age;
        return res;
      }

      // Check for decimal number e.g. "7.5" or "8.0" (clear community rating score)
      if (/^\d+\.\d+$/.test(trimmed)) {
        const score = parseFloat(trimmed);
        if (!isNaN(score)) res.minCommunityRating = score;
        return res;
      }

      // Multiple ratings separated by comma or pipe (e.g. "PG-13, R" or "12, 16")
      trimmed.split(/[,|]/).forEach(r => {
        const val = r.trim();
        if (val) {
          res.officialRatings.push(val);
        }
      });

      return res;
    },

    /**
     * Selects complete leading sentences within the synopsis budget.
     */
    detectLetterbox(pixels, width, height) {
      const darkRow = y => {
        let bright = 0;
        for (let x = 2; x < width - 2; x++) {
          const offset = (y * width + x) * 4;
          if (Math.max(pixels[offset], pixels[offset + 1], pixels[offset + 2]) > 24) bright++;
        }
        return bright <= 1;
      };
      let top = 0, bottom = 0;
      while (top < height && darkRow(top)) top++;
      while (bottom < height && darkRow(height - 1 - bottom)) bottom++;
      if (top < 2 || bottom < 2 || Math.abs(top - bottom) > 1 || top + bottom > height * 0.36) return 0;
      const middle = Math.floor(height / 2);
      const visibleRows = [middle - 2, middle, middle + 2].filter(row => !darkRow(row));
      return visibleRows.length === 3 ? Math.min(top, bottom) / height : 0;
    },

    getTrailerStudioLogoSettings(id, source = CONFIG.trailerStudioLogoSettings) {
      try { return JSON.parse(source)?.[id] || {}; } catch { return {}; }
    },

    applyTrailerStudioLogoSettings(slide, id) {
      const settings = this.getTrailerStudioLogoSettings(id);
      this.setTrailerPlacement(slide, settings);
      this.setTrailerStudioAppearance(slide, settings);
    },

    setTrailerStudioAppearance(slide, { visible, scale, studioX, studioY }) {
      const offset = value => Number.isFinite(value) ? Math.max(-100, Math.min(100, value)) : 0;
      slide.style.setProperty("--marquee-studio-x", offset(studioX) + "%");
      slide.style.setProperty("--marquee-studio-y", offset(studioY) + "%");
      slide.classList.toggle("marquee-hide-compact-studio", visible === false);
      slide.style.setProperty("--marquee-compact-studio-scale",
        Number.isFinite(scale) ? Math.min(250, Math.max(50, scale)) / 100 : 1.75);
    },

    setTrailerPlacement(slide, { width, left, down, fade, topFade, bottomFade, rightFade, fadeMidpoint, dim }) {
      this.setTrailerWidth(slide, width || CONFIG.trailerWidthPercent);
      const boundOffset = value => Number.isFinite(value) ? Math.max(-30, Math.min(30, value)) : 0;
      slide.style.setProperty("--marquee-trailer-x", -boundOffset(left) + "%");
      slide.style.setProperty("--marquee-trailer-y", boundOffset(down) + "%");
      slide.classList.toggle("marquee-custom-trailer-fade", [fade, topFade, bottomFade, rightFade, fadeMidpoint].some(Number.isFinite));
      slide.classList.toggle("marquee-undimmed-trailer", dim === false);
      slide.style.setProperty("--marquee-fade-midpoint", Number.isFinite(fadeMidpoint) ? Math.max(5, Math.min(95, fadeMidpoint)) / 100 : 0.5);
      for (const [edge, amount, fallback] of [["left", fade, 12], ["top", topFade, 0], ["bottom", bottomFade, 0], ["right", rightFade, 0]]) {
        const value = Number.isFinite(amount) ? Math.max(0, Math.min(100, amount)) : fallback;
        slide.style.setProperty("--marquee-trailer-fade-" + edge, value + "%");
      }
    },

    setTrailerWidth(slide, widthPercent) {
      slide.classList.toggle("marquee-custom-trailer-width", widthPercent >= 10 && widthPercent <= 100);
      if (widthPercent >= 10 && widthPercent <= 100) slide.style.setProperty("--marquee-trailer-width", widthPercent + "%");
      else slide.style.removeProperty("--marquee-trailer-width");
    },

    getLocalTrailerId(source) {
      const url = typeof source === "object" ? source?.url : source;
      return String(url || "").match(/\/Videos\/([a-f\d-]+)\//i)?.[1].replace(/-/g, "").toLowerCase();
    },

    getConfiguredTrailerCrop(id) {
      try {
        const crop = JSON.parse(CONFIG.trailerCropSettings)?.[id];
        if (typeof crop === "number" && crop >= 0 && crop <= 30) return crop;
      } catch { /* Retain the existing framing if saved data is invalid. */ }
      return undefined;
    },

    applyTrailerCrop(backdrop) {
      const id = backdrop.dataset.marqueeTrailerId;
      const crop = this.getConfiguredTrailerCrop(id);
      if (backdrop.tagName === "VIDEO") {
        backdrop.classList.toggle("marquee-local-manual-crop", crop > 0);
        if (crop !== undefined) backdrop.style.setProperty("object-view-box", "inset(" + crop + "% 0)");
        else backdrop.style.removeProperty("object-view-box");
        return;
      }

      const presets = MediaBarEnhancedSettingsManager.getPublishedPreference("trailerCrops", "publishedTrailerFraming", {});
      const framing = presets[id];
      const fillHeight = framing === "fill" ||
        MediaBarEnhancedSettingsManager.getSetting("fillTrailerHeight", CONFIG.fillTrailerHeight);
      backdrop.classList.toggle("marquee-wide-crop", framing === "wide" && !fillHeight && !(crop > 0));
      backdrop.classList.toggle("marquee-fill-height", fillHeight);
      backdrop.classList.toggle("marquee-manual-crop", crop > 0);
      if (crop > 0) {
        backdrop.dataset.marqueeAppliedCrop = String(crop);
        backdrop.style.setProperty("--marquee-crop-inset", crop + "%");
        backdrop.style.setProperty("--marquee-crop-visible-ratio", 1 - 2 * crop / 100);
        backdrop.style.setProperty("--marquee-crop-max-width", (100 * (16 / 9) / (1 - 2 * crop / 100)) + "cqh");
      } else {
        delete backdrop.dataset.marqueeAppliedCrop;
        backdrop.style.removeProperty("--marquee-crop-inset");
        backdrop.style.removeProperty("--marquee-crop-visible-ratio");
        backdrop.style.removeProperty("--marquee-crop-max-width");
      }
    },

    watchLocalLetterbox(video) {
      if (!CSS.supports("object-view-box", "inset(10% 0)")) return;
      const canvas = document.createElement("canvas");
      canvas.width = 96;
      canvas.height = 54;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      const samples = [];
      let lastTime = -1;
      const sample = () => {
        if (video.readyState < 2 || !video.videoWidth || Math.abs(video.currentTime - lastTime) < 0.45) return;
        lastTime = video.currentTime;
        try {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          samples.push(this.detectLetterbox(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height));
        } catch {
          video.removeEventListener("timeupdate", sample);
          return;
        }
        if (samples.length < 6) return;
        const nonzero = samples.filter(Boolean).sort((a, b) => a - b);
        if (nonzero.length >= 5 && nonzero.at(-1) - nonzero[0] <= 1 / canvas.height) {
          video.style.setProperty("object-view-box", `inset(${nonzero[0] * 100}% 0)`);
        }
        video.removeEventListener("timeupdate", sample);
      };
      video.addEventListener("timeupdate", sample);
    },

    pickDailyItems(items) {
      const pool = items.slice();
      const picks = [];
      const counts = new Map();
      const libraries = new Set();
      const genres = new Set();
      const type = item => ["Season", "Episode"].includes(item.Type) ? "Series" : item.Type;
      const itemGenres = item => (item.Genres || []).map(genre => genre.toLowerCase());
      const score = item => -4 * (counts.get(type(item)) || 0)
        + (item.MediaBarLibraryId && !libraries.has(item.MediaBarLibraryId) ? 2 : 0)
        + (itemGenres(item).some(genre => !genres.has(genre)) ? 1 : 0);
      while (pool.length && picks.length < 5) {
        const index = pool.reduce((best, item, i) => score(item) > score(pool[best]) ? i : best, 0);
        const [item] = pool.splice(index, 1);
        picks.push(item.Id);
        counts.set(type(item), (counts.get(type(item)) || 0) + 1);
        if (item.MediaBarLibraryId) libraries.add(item.MediaBarLibraryId);
        itemGenres(item).forEach(genre => genres.add(genre));
      }
      return picks;
    },

    summarizeOverview(overview, maxLength, locale) {
      const text = (overview || "").replace(/\s+/g, " ").trim();
      if (text.length <= maxLength) return text;

      let sentences;
      if (typeof Intl.Segmenter === "function") {
        sentences = Array.from(new Intl.Segmenter(locale || undefined, {
          granularity: "sentence",
        }).segment(text), ({ segment }) => segment.trim());
      } else {
        sentences = text.match(/.+?(?:[.!?]+["'”’»）)]*(?=\s|$)|[。！？]+[」』”’）)]*|$)/gu) || [];
      }

      let summary = "";
      for (const sentence of sentences) {
        const candidate = summary ? summary + " " + sentence.trim() : sentence.trim();
        if (candidate.length > maxLength) break;
        summary = candidate;
      }
      return summary;
    },

    /**
     * Creates a DOM element with attributes and properties
     * @param {string} tag - Element tag name
     * @param {Object} attributes - Element attributes
     * @param {string|HTMLElement} [content] - Element content
     * @returns {HTMLElement} Created element
     */
    createElement(tag, attributes = {}, content = null) {
      const element = document.createElement(tag);

      Object.entries(attributes).forEach(([key, value]) => {
        if (key === "style" && typeof value === "object") {
          Object.entries(value).forEach(([prop, val]) => {
            if (prop.startsWith('--')) element.style.setProperty(prop, val);
          else element.style[prop] = val;
          });
        } else if (key === "className") {
          element.className = value;
        } else if (key === "innerHTML") {
          element.innerHTML = value;
        } else if (key === "textContent") {
          element.textContent = value;
        } else if (key === "onclick" && typeof value === "function") {
          element.addEventListener("click", value);
        } else if (key === "disablePictureInPicture" || key === "disablepictureinpicture") {
          element.disablePictureInPicture = !!value;
          if (value) element.setAttribute("disablepictureinpicture", "");
        } else {
          element.setAttribute(key, value);
        }
      });

      if (content) {
        if (typeof content === "string") {
          element.textContent = content;
        } else {
          element.appendChild(content);
        }
      }

      return element;
    },

    /**
     * Find or create the slides container
     * @returns {HTMLElement} Slides container element
     */
    getOrCreateSlidesContainer() {
      let container = document.getElementById("slides-container");
      if (!container) {
        container = this.createElement("div", {
          id: "slides-container",
          className: "noautofocus media-bar-hidden",
          tabIndex: "-1",
          "data-scroll-mode-x": "custom",
          "data-scroll-mode-y": "custom",
          style: "display: none; visibility: hidden; pointer-events: none;"
        });
        document.body.appendChild(container);
      } else {
        container.setAttribute("data-scroll-mode-x", "custom");
        container.setAttribute("data-scroll-mode-y", "custom");
      }
      if (typeof isSplitScreenTrailerEnabled === 'function') {
        container.classList.toggle("split-screen-trailer", isSplitScreenTrailerEnabled());
      }
      if (typeof isBottomGradientEnabled === 'function') {
        const isGrad = isBottomGradientEnabled();
        container.classList.toggle("no-bottom-gradient", !isGrad);
        document.body.classList.toggle("media-bar-no-bottom-gradient", !isGrad);
      }
      return container;
    },

    /**
     * Creates a loading indicator
     * @returns {HTMLElement} Loading indicator element
     */
    createLoadingIndicator() {
      const loadingIndicator = this.createElement("div", {
        className: "slide-loading-indicator",
        innerHTML: `
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      `,
      });
      return loadingIndicator;
    },

    /**
     * Loads the YouTube IFrame API if not already loaded
     * @returns {Promise<void>}
     */
    loadYouTubeIframeAPI() {
      if (window.YT && window.YT.Player) {
        return Promise.resolve(window.YT);
      }

      if (STATE.slideshow.ytPromise) return STATE.slideshow.ytPromise;

      STATE.slideshow.ytPromise = new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve(window.YT);
          return;
        }

        let timeout;
        let settled = false;
        const previousReady = window.onYouTubeIframeAPIReady;
        const finish = (YT = null) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          if (!YT || !YT.Player) {
            // Reset cached promise so we can retry loading later
            STATE.slideshow.ytPromise = null;
            resolve(null);
          } else {
            resolve(YT);
          }
        };

        window.onYouTubeIframeAPIReady = () => {
          if (typeof previousReady === "function") {
            try { previousReady(); } catch (e) { }
          }
          finish(window.YT);
        };

        // Remove any existing script tag to force a clean reload
        const existingTag = document.querySelector('script[src*="youtube.com/iframe_api"]');
        if (existingTag) {
          existingTag.remove();
        }

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        tag.onerror = () => {
          console.warn("🎬 Media Bar:", "YouTube iframe API failed to load.");
          finish();
        };

        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }

        timeout = setTimeout(() => {
          console.warn("🎬 Media Bar:", "Timed out loading YouTube iframe API.");
          finish();
        }, 10000); // Safe 10s timeout
      });

      return STATE.slideshow.ytPromise;
    },

    /**
     * Opens a modal video player
     * @param {string} url - Video URL
     */
    openVideoModal(url) {
      const existingModal = document.getElementById('video-modal-overlay');
      if (existingModal) existingModal.remove();

      if (STATE.slideshow.slideInterval) {
        STATE.slideshow.slideInterval.stop();
      }
      STATE.slideshow.isPaused = true;

      const overlay = this.createElement('div', {
        id: 'video-modal-overlay'
      });

      const keydownHandler = (e) => {
        if (e.key === 'Escape' || e.key === 'Back' || e.key === 'GoBack' || e.keyCode === 27 || e.keyCode === 10009 || e.keyCode === 461) {
          closeModal();
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const closeModal = () => {
        document.removeEventListener('keydown', keydownHandler);
        overlay.remove();
        STATE.slideshow.isPaused = false;
        if (STATE.slideshow.slideInterval) {
          STATE.slideshow.slideInterval.start();
        }
      };

      document.addEventListener('keydown', keydownHandler);

      const closeButton = this.createElement('button', {
        className: 'modal-close-button',
        innerHTML: '<i class="material-icons">close</i>',
        onclick: closeModal
      });

      const contentContainer = this.createElement('div', {
        className: 'video-modal-content'
      });

      const videoId = ApiUtils.extractYouTubeId(url);
      const isYoutube = !!videoId;

      if (isYoutube && videoId) {
        const ytIframe = this.createElement('iframe', {
          id: 'modal-yt-player',
          src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&iv_load_policy=3&rel=0&playsinline=1`,
          allow: 'autoplay; encrypted-media',
          style: 'width: 100%; height: 100%; border: none;',
          referrerpolicy: 'strict-origin-when-cross-origin',
          allowfullscreen: 'true'
        });

        contentContainer.appendChild(ytIframe);
        overlay.append(closeButton, contentContainer);
        document.body.appendChild(overlay);
      } else {
        const video = this.createElement('video', {
          src: url,
          controls: true,
          autoplay: true,
          disablePictureInPicture: true,
          controlsList: 'nodownload noplaybackrate nopip',
          className: 'video-modal-player'
        });
        video.disablePictureInPicture = true;
        video.setAttribute('disablepictureinpicture', '');
        video.setAttribute('controlsList', 'nodownload noplaybackrate nopip');
        video.setAttribute('playsinline', '');
        contentContainer.appendChild(video);
        overlay.append(closeButton, contentContainer);
        document.body.appendChild(overlay);
      }

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      });
    },
  };

  /**
   * Localization utilities for fetching and using Jellyfin translations
   */
  const LocalizationUtils = {
    translations: {},
    locale: null,
    isLoading: {},
    cachedLocale: null,
    chunkUrlCache: {},

    /**
     * Gets the current locale from HTML tag, user preference, or server config
     * @returns {Promise<string>} Locale code (e.g., "de", "en-us")
     */
    async getCurrentLocale() {
      if (this.cachedLocale) {
        return this.cachedLocale;
      }

      let locale = null;

      // check <html lang="...">
      const langAttr = document.documentElement.getAttribute("lang");
      if (langAttr) {
        locale = langAttr.toLowerCase();
      }

      // Check localStorage (deviceId, userId, or generic language)
      if (!locale) {
        try {
          const userId = (window.ApiClient && typeof window.ApiClient.getCurrentUserId === 'function' ? window.ApiClient.getCurrentUserId() : null) || (STATE.jellyfinData ? STATE.jellyfinData.userId : null);
          if (userId && userId !== "Not Found") {
            const userKey = `${userId}-language`;
            const val = localStorage.getItem(userKey);
            if (val) locale = val.toLowerCase();
          }
          if (!locale && window.ApiClient && typeof window.ApiClient.deviceId === 'function') {
            const deviceId = window.ApiClient.deviceId();
            if (deviceId) {
              const deviceKey = `${deviceId}-language`;
              const val = localStorage.getItem(deviceKey);
              if (val) locale = val.toLowerCase();
            }
          }
          if (!locale) {
            const val = localStorage.getItem("language");
            if (val) locale = val.toLowerCase();
          }
        } catch (e) {
          console.warn("🎬 Media Bar:", "Could not access localStorage for language:", e);
        }
      }

      // Fallback to server metadata language preference
      if (!locale && isUserLoggedIn() && STATE.jellyfinData && STATE.jellyfinData.accessToken && STATE.jellyfinData.accessToken !== "Not Found") {
        try {
          const configUrl = `${STATE.jellyfinData.serverAddress}/System/Configuration`;
          const configResponse = await fetch(configUrl, {
            headers: ApiUtils.getAuthHeaders(),
          });
          if (configResponse.ok) {
            const configData = await configResponse.json();
            if (configData.PreferredMetadataLanguage) {
              locale = configData.PreferredMetadataLanguage.toLowerCase();
              if (configData.MetadataCountryCode) {
                locale = `${locale}-${configData.MetadataCountryCode.toLowerCase()}`;
              }
            }
          }
        } catch (error) {
          console.warn("🎬 Media Bar:", "Could not fetch server metadata language preference:", error);
        }
      }

      // Browser navigator language fallback
      if (!locale) {
        const navLang = navigator.language || navigator.userLanguage;
        locale = navLang ? navLang.toLowerCase() : "en-us";
      }

      // Convert 3-letter country codes to 2-letter if necessary
      if (locale.length === 3) {
        try {
          if (window.ApiClient && typeof window.ApiClient.getCountries === 'function') {
            const countriesData = await window.ApiClient.getCountries();
            const countryData = Object.values(countriesData).find(countryData => countryData.ThreeLetterISORegionName === locale.toUpperCase());
            if (countryData && countryData.TwoLetterISORegionName) {
              locale = countryData.TwoLetterISORegionName.toLowerCase();
            }
          }
        } catch (e) {
          console.warn("🎬 Media Bar:", "Could not fetch countries data from ApiClient:", e);
        }
      }

      this.cachedLocale = locale;
      return locale;
    },

    /**
     * Finds the translation chunk URL from performance entries or script tags
     * @param {string} locale - Locale code
     * @returns {string|null} URL to translation chunk or null
     */
    findTranslationChunkUrl(locale) {
      if (!locale) return null;
      const localeNormalized = locale.toLowerCase().replace('_', '-');
      const localePrefix = localeNormalized.split('-')[0];

      if (this.chunkUrlCache[localeNormalized]) {
        return this.chunkUrlCache[localeNormalized];
      }
      if (this.chunkUrlCache[localePrefix]) {
        return this.chunkUrlCache[localePrefix];
      }

      const checkUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const lower = url.toLowerCase();
        return (
          lower.includes(`${localeNormalized}-json`) ||
          lower.includes(`${localePrefix}-json`) ||
          lower.includes(`${localeNormalized}.json`) ||
          lower.includes(`${localePrefix}.json`)
        ) && lower.includes('.chunk.js');
      };

      if (window.performance && window.performance.getEntriesByType) {
        try {
          const resources = window.performance.getEntriesByType('resource');
          for (const resource of resources) {
            const url = resource.name || resource.url;
            if (checkUrl(url)) {
              this.chunkUrlCache[localeNormalized] = url;
              this.chunkUrlCache[localePrefix] = url;
              return url;
            }
          }
        } catch (e) {
          console.warn("🎬 Media Bar:", "Error checking performance entries:", e);
        }
      }

      // Fallback: check active script tags in DOM
      try {
        const scripts = document.querySelectorAll('script[src]');
        for (const script of scripts) {
          const src = script.getAttribute('src') || script.src;
          if (checkUrl(src)) {
            this.chunkUrlCache[localeNormalized] = src;
            this.chunkUrlCache[localePrefix] = src;
            return src;
          }
        }
      } catch (e) { }

      return null;
    },

    /**
     * Fetches and loads translations from the chunk JSON
     * @param {string} locale - Locale code
     * @returns {Promise<void>}
     */
    async loadTranslations(locale) {
      if (!locale) return;
      const localeNormalized = locale.toLowerCase().replace('_', '-');
      const localePrefix = localeNormalized.split('-')[0];

      if (this.translations[localeNormalized] && this.translations[localeNormalized].Play) return;
      if (this.translations[localePrefix] && this.translations[localePrefix].Play) return;

      if (this.isLoading[localeNormalized]) {
        await this.isLoading[localeNormalized];
        return;
      }

      const loadPromise = (async () => {
        try {
          const chunkUrl = this.findTranslationChunkUrl(localeNormalized);
          if (chunkUrl) {
            const response = await fetch(chunkUrl);
            if (response.ok) {
              const chunkText = await response.text();

              // 1. If chunk uses JSON.parse('...'), evaluate expression safely (works on Webpack 4 & 5)
              const parseIdx = chunkText.indexOf('JSON.parse(');
              if (parseIdx !== -1) {
                let endIdx = chunkText.lastIndexOf("}')");
                if (endIdx === -1) endIdx = chunkText.lastIndexOf('}")');
                if (endIdx !== -1) {
                  try {
                    const expr = chunkText.slice(parseIdx, endIdx + 3);
                    const parsed = (new Function('return ' + expr))();
                    if (parsed && typeof parsed === 'object') {
                      this.translations[localeNormalized] = parsed;
                      this.translations[localePrefix] = parsed;
                      return;
                    }
                  } catch (e) {
                    console.warn("🎬 Media Bar:", "Error evaluating chunk expression:", e);
                  }
                }
              }

              // 2. If chunk uses direct JSON object (e.g. module.exports = { ... })
              const jsonStart = chunkText.indexOf('{"');
              const jsonEnd = chunkText.lastIndexOf('"}') + 2;
              if (jsonStart !== -1 && jsonEnd > jsonStart) {
                try {
                  const jsonString = chunkText.substring(jsonStart, jsonEnd);
                  const parsed = JSON.parse(jsonString);
                  if (parsed && typeof parsed === 'object') {
                    this.translations[localeNormalized] = parsed;
                    this.translations[localePrefix] = parsed;
                    return;
                  }
                } catch (e) {
                  console.warn("🎬 Media Bar:", "Failed to parse JSON from chunk:", e);
                }
              }
            }
          }
        } catch (error) {
          console.error("🎬 Media Bar:", "Error loading translations:", error);
        } finally {
          delete this.isLoading[localeNormalized];
        }
      })();

      this.isLoading[localeNormalized] = loadPromise;
      await loadPromise;
    },

    /**
     * Gets a localized string (synchronous - translations must be loaded first)
     * @param {string} key - Localization key (e.g., "EndsAtValue", "Play")
     * @param {string} fallback - Fallback English string
     * @param {...any} args - Optional arguments for placeholders (e.g., {0}, {1})
     * @returns {string} Localized string or fallback
     */
    getLocalizedString(key, fallback, ...args) {
      const locale = this.cachedLocale || 'en-us';
      const localePrefix = locale.split('-')[0];
      let translated = (this.translations[locale] && this.translations[locale][key]) ||
        (this.translations[localePrefix] && this.translations[localePrefix][key]) ||
        fallback;

      if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
          translated = translated.replace(new RegExp(`\\{${i}\\}`, 'g'), args[i]);
        }
      }

      return translated;
    },

    getCustomLocalizedString(key, fallback, ...args) {
      let locale = this.cachedLocale || 'en';
      locale = locale.split('-')[0].toLowerCase();
      const dict = CLIENT_MENU_TRANSLATIONS[locale] || CLIENT_MENU_TRANSLATIONS['en'];
      let translated = (dict && dict[key]) || this.getLocalizedString(key, fallback);

      if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
          translated = translated.replace(new RegExp(`\\{${i}\\}`, 'g'), args[i]);
        }
      }

      return translated;
    }
  };

  /**
   * API utilities for fetching data from Jellyfin server
   */
  const ApiUtils = {
    /**
     * Fetches details for a specific item by ID
     * @param {string} itemId - Item ID
     * @returns {Promise<Object>} Item details
     */
    async fetchItemDetails(itemId) {
      try {
        if (STATE.slideshow.loadedItems[itemId]) {
          return STATE.slideshow.loadedItems[itemId];
        }

        const response = await fetch(
          // `${STATE.jellyfinData.serverAddress}/Items/${itemId}`,
          `${STATE.jellyfinData.serverAddress}/Items/${itemId}?UserId=${encodeURIComponent(STATE.jellyfinData.userId)}&Fields=Overview,RemoteTrailers,Genres,Studios,CommunityRating,CriticRating,OfficialRating,PremiereDate,ProductionYear,MediaSources,RunTimeTicks,LocalTrailerCount,ChildCount,RecursiveItemCount,BackdropImageTags,ParentBackdropImageTags,ProviderIds`,
          {
            headers: this.getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch item details: ${response.statusText}`);
        }

        const itemData = await response.json();

        // If Season or Episode, inherit missing metadata (Genres, Ratings, SeriesName, Logo) from parent Series
        if ((itemData.Type === "Season" || itemData.Type === "Episode") && itemData.SeriesId) {
          try {
            const parentSeries = await this.fetchItemDetails(itemData.SeriesId);
            if (parentSeries) {
              if (!itemData.Studios?.length) itemData.Studios = parentSeries.Studios;
              itemData.ReviewProviderIds = parentSeries.ProviderIds;
              if ((!itemData.Genres || itemData.Genres.length === 0) && parentSeries.Genres) {
                itemData.Genres = parentSeries.Genres;
              }
              if (itemData.CommunityRating === undefined && parentSeries.CommunityRating !== undefined) {
                itemData.CommunityRating = parentSeries.CommunityRating;
              }
              if (itemData.CriticRating === undefined && parentSeries.CriticRating !== undefined) {
                itemData.CriticRating = parentSeries.CriticRating;
              }
              if (itemData.OfficialRating === undefined && parentSeries.OfficialRating !== undefined) {
                itemData.OfficialRating = parentSeries.OfficialRating;
              }
              if (!itemData.PremiereDate && parentSeries.PremiereDate) {
                itemData.PremiereDate = parentSeries.PremiereDate;
              }
              if (!itemData.ProductionYear && parentSeries.ProductionYear) {
                itemData.ProductionYear = parentSeries.ProductionYear;
              }
              if (!itemData.SeriesName && parentSeries.Name) {
                itemData.SeriesName = parentSeries.Name;
              }
              if (!itemData.ParentLogoImageTag && parentSeries.ImageTags && parentSeries.ImageTags.Logo) {
                itemData.ParentLogoImageTag = parentSeries.ImageTags.Logo;
                itemData.ParentLogoItemId = parentSeries.Id;
              }
              if ((!itemData.ParentBackdropImageTags || itemData.ParentBackdropImageTags.length === 0) && parentSeries.BackdropImageTags) {
                itemData.ParentBackdropImageTags = parentSeries.BackdropImageTags;
                itemData.ParentBackdropItemId = parentSeries.Id;
              }
            }
          } catch (e) {
            console.warn("🎬 Media Bar:", `Could not fetch parent series ${itemData.SeriesId} for metadata inheritance:`, e);
          }
        }

        STATE.slideshow.loadedItems[itemId] = itemData;

        const cacheKeys = Object.keys(STATE.slideshow.loadedItems);
        if (cacheKeys.length >= CONFIG.maxCachedItems) {
          delete STATE.slideshow.loadedItems[cacheKeys[0]];
        }

        return itemData;
      } catch (error) {
        console.error("🎬 Media Bar:", `Error fetching details for item ${itemId}:`, error);
        return null;
      }
    },

    async fetchLibraryIds() {
      if (STATE.slideshow.libraryIds) return STATE.slideshow.libraryIds;

      try {
        const viewsUrl = `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Views`;
        const response = await fetch(viewsUrl, { headers: this.getAuthHeaders() });
        if (!response.ok) throw new Error("Failed to fetch views");
        const data = await response.json();
        const views = data.Items || [];

        const map = {};
        const types = {};
        views.forEach(view => {
          if (view.Name && view.Id) {
            map[view.Name.toLowerCase().trim()] = view.Id;
            map[view.Id] = view.Id;
            if (view.CollectionType) {
              types[view.Id] = view.CollectionType.toLowerCase().trim();
            }
          }
        });

        STATE.slideshow.libraryIds = map;
        STATE.slideshow.libraryTypes = types;
        return map;
      } catch (e) {
        console.error("🎬 Media Bar:", "Error fetching user views for library filtering:", e);
        return null;
      }
    },

    async resolveItemLibraryId(item) {
      if (!item || !item.Id) return null;

      if (item.MediaBarLibraryId) return item.MediaBarLibraryId;

      try {
        const libraryMap = await this.fetchLibraryIds() || {};
        const libraryIds = [...new Set(Object.values(libraryMap))];

        if (item.ParentId && libraryIds.includes(item.ParentId)) {
          item.MediaBarLibraryId = item.ParentId;
          return item.MediaBarLibraryId;
        }

        const ancestorsUrl = `${STATE.jellyfinData.serverAddress}/Items/${item.Id}/Ancestors`;
        const response = await fetch(ancestorsUrl, { headers: this.getAuthHeaders() });
        if (!response.ok) {
          throw new Error(`Failed to fetch ancestors: ${response.statusText}`);
        }

        const ancestors = await response.json();
        const libraryAncestor = (ancestors || []).find(ancestor => libraryIds.includes(ancestor.Id));

        if (libraryAncestor) {
          item.MediaBarLibraryId = libraryAncestor.Id;
          return item.MediaBarLibraryId;
        }

        console.warn(`🎬 Media Bar: Could not resolve top-level library for ${item.Id}`);
        return null;
      } catch (e) {
        console.warn(`🎬 Media Bar: Error resolving library for ${item.Id}:`, e);
        return null;
      }
    },
    async applyLibraryFilters(items) {
      if (!items || items.length === 0) return items;

      const clientExcludedStr = MediaBarEnhancedSettingsManager.getSetting("excludedLibraries", CONFIG.publishedExcludedLibraryIds || null) || '';
      const clientExcludedIds = clientExcludedStr.split(',').filter(id => id);

      const serverExcludedNames = CONFIG.excludedLibraries ? CONFIG.excludedLibraries.split(',').map(s => s.trim().toLowerCase()).filter(s => s) : [];

      let serverExcludedIds = [];

      if (serverExcludedNames.length > 0) {
        const libraryMap = await this.fetchLibraryIds() || {};
        serverExcludedIds = serverExcludedNames.map(name => libraryMap[name]).filter(id => id);
      }

      const allExcludedIds = [...new Set([...clientExcludedIds, ...serverExcludedIds])];

      let filteredItems = items;
      if (allExcludedIds.length > 0) {
        filteredItems = filteredItems.filter(item => !item.ParentId || !allExcludedIds.includes(item.ParentId));
      }

      return filteredItems;
    },

    /**
     * Fetches personalized recommendations from the server
     * @returns {Promise<Array>} Array of item IDs
     */
    async fetchRecommendationsFromServer() {
      try {
        if (
          !STATE.jellyfinData.accessToken ||
          STATE.jellyfinData.accessToken === "Not Found" ||
          !STATE.jellyfinData.serverAddress ||
          STATE.jellyfinData.serverAddress === "Not Found" ||
          !STATE.jellyfinData.userId
        ) {
          return [];
        }

        let itemTypes = [];
        if (CONFIG.maxMovies > 0) itemTypes.push("Movie");
        if (CONFIG.maxTvShows > 0) itemTypes.push("Series");
        if (itemTypes.length === 0) return [];

        const libraryMap = await this.fetchLibraryIds() || {};
        const allLibraryIds = [...new Set(Object.values(libraryMap))];
        const clientExcludedStr = MediaBarEnhancedSettingsManager.getSetting("excludedLibraries", CONFIG.publishedExcludedLibraryIds || null);
        let allExcludedIds = [];

        if (clientExcludedStr !== null) {
          allExcludedIds = clientExcludedStr.split(',').filter(id => id);
        } else {
          const serverExcludedNames = CONFIG.excludedLibraries ? CONFIG.excludedLibraries.split(',').map(s => s.trim().toLowerCase()).filter(s => s) : [];
          if (serverExcludedNames.length > 0) {
            allExcludedIds = serverExcludedNames.map(name => libraryMap[name]).filter(id => id);
          }
        }
        const includedIds = allLibraryIds.filter(id => !allExcludedIds.includes(id));
        const requireLogo = MediaBarEnhancedSettingsManager.getSetting('requireLogo', CONFIG.requireLogo);

        console.log("🎬 Media Bar:", `Fetching personalized suggestions for user ${STATE.jellyfinData.userId}...`);
        const recsLimit = Math.max((CONFIG.maxItems || 10) * 3, 30);
        let candidates = [];

        // A) Query /Movies/Recommendations (powers "Because you watched..." in Movie library)
        try {
          const moviesRecsUrl = `${STATE.jellyfinData.serverAddress}/Movies/Recommendations?userId=${STATE.jellyfinData.userId}&categoryLimit=6&itemLimit=10&fields=Id,Type,DateCreated,ImageTags,ParentLogoImageTag,ParentBackdropImageTags,BackdropImageTags,OfficialRating,ParentId,SeriesId`;
          const recsResp = await fetch(moviesRecsUrl, { headers: this.getAuthHeaders() });
          if (recsResp.ok) {
            const recGroups = await recsResp.json();
            if (Array.isArray(recGroups)) {
              recGroups.forEach(group => {
                if (Array.isArray(group.Items)) {
                  candidates.push(...group.Items);
                }
              });
            }
          }
        } catch (e) {
          console.warn("🎬 Media Bar:", "Error fetching /Movies/Recommendations:", e);
        }

        // B) Query /Users/{userId}/Suggestions (general suggestions endpoint)
        try {
          const userSugUrl = `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Suggestions?limit=${recsLimit}&fields=Id,Type,DateCreated,ImageTags,ParentLogoImageTag,ParentBackdropImageTags,BackdropImageTags,OfficialRating,ParentId,SeriesId`;
          const sugResp = await fetch(userSugUrl, { headers: this.getAuthHeaders() });
          if (sugResp.ok) {
            const sugData = await sugResp.json();
            if (Array.isArray(sugData.Items)) {
              candidates.push(...sugData.Items);
            }
          }
        } catch (e) {
          console.warn("🎬 Media Bar:", "Error fetching /Users/Suggestions:", e);
        }

        // C) Query /Items/{id}/Similar for the 3 most recently played items (Movie or TV)
        try {
          const playedUrl = `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Items?SortBy=DatePlayed&SortOrder=Descending&Limit=3&Filters=IsPlayed&Recursive=true&fields=Id`;
          const playedResp = await fetch(playedUrl, { headers: this.getAuthHeaders() });
          if (playedResp.ok) {
            const playedData = await playedResp.json();
            const playedItems = playedData.Items || [];
            const simPromises = playedItems.map(async (pItem) => {
              try {
                const simUrl = `${STATE.jellyfinData.serverAddress}/Items/${pItem.Id}/Similar?userId=${STATE.jellyfinData.userId}&limit=10&fields=Id,Type,DateCreated,ImageTags,ParentLogoImageTag,ParentBackdropImageTags,BackdropImageTags,OfficialRating,ParentId,SeriesId`;
                const simResp = await fetch(simUrl, { headers: this.getAuthHeaders() });
                if (simResp.ok) {
                  const simData = await simResp.json();
                  return simData.Items || (Array.isArray(simData) ? simData : []);
                }
              } catch (err) { }
              return [];
            });
            const simResults = await Promise.all(simPromises);
            simResults.forEach(simList => candidates.push(...simList));
          }
        } catch (e) {
          console.warn("🎬 Media Bar:", "Error fetching similar items for recently played:", e);
        }

        // Deduplicate candidates by Id
        const seenIds = new Set();
        candidates = candidates.filter(item => {
          if (!item || !item.Id || seenIds.has(item.Id)) return false;
          seenIds.add(item.Id);
          return true;
        });

        // Filter candidate item types
        candidates = candidates.filter(i => itemTypes.includes(i.Type));

        // Parental rating filter
        if (CONFIG.maxParentalRating) {
          candidates = candidates.filter(item => {
            if (!item.OfficialRating) return true;
            const ratingNum = parseInt(item.OfficialRating.replace(/\D/g, ''), 10);
            return isNaN(ratingNum) || ratingNum <= CONFIG.maxParentalRating;
          });
        }

        // Library inclusion / exclusion filter
        if (includedIds.length > 0 && includedIds.length < allLibraryIds.length) {
          candidates = candidates.filter(item => !item.ParentId || includedIds.includes(item.ParentId));
        } else if (allExcludedIds.length > 0) {
          candidates = candidates.filter(item => !item.ParentId || !allExcludedIds.includes(item.ParentId));
        }

        // Watched content filter
        if (!CONFIG.includeWatchedContent) {
          candidates = candidates.filter(item => !item.UserData || !item.UserData.Played);
        }

        // Require Title Logo filter
        if (requireLogo) {
          candidates = candidates.filter(item => (item.ImageTags && item.ImageTags.Logo) || item.ParentLogoImageTag);
        }

        if (candidates.length === 0) {
          console.log("🎬 Media Bar:", "No personalized suggestions matched filters.");
          return [];
        }

        if (CONFIG.sortBy === 'Random' || CONFIG.sortBy === 'Original') {
          candidates.sort(() => Math.random() - 0.5);
        }

        // Apply Content Limits (MaxMovies, MaxTvShows, MaxItems)
        let movieCount = 0;
        let showCount = 0;
        let keptItems = [];

        for (const item of candidates) {
          if ((movieCount + showCount) >= CONFIG.maxItems) break;
          if (item.Type === 'Movie') {
            if (movieCount < CONFIG.maxMovies) {
              movieCount++;
              keptItems.push(item);
            }
          } else if (item.Type === 'Series' || item.Type === 'Season' || item.Type === 'Episode') {
            if (showCount < CONFIG.maxTvShows) {
              showCount++;
              keptItems.push(item);
            }
          } else {
            keptItems.push(item);
          }
        }

        console.log("🎬 Media Bar:", `Loaded ${keptItems.length} personalized recommendations (Movies: ${movieCount}, Shows: ${showCount}).`);
        return keptItems.map(i => i.Id);
      } catch (error) {
        console.error("🎬 Media Bar:", "Error fetching recommendations:", error);
        return [];
      }
    },

    /**
     * Fetches random library items from the server
     * @returns {Promise<Array>} Array of item IDs
     */
    async fetchItemIdsFromServer() {
      try {
        if (
          !STATE.jellyfinData.accessToken ||
          STATE.jellyfinData.accessToken === "Not Found" ||
          !STATE.jellyfinData.serverAddress ||
          STATE.jellyfinData.serverAddress === "Not Found"
        ) {
          console.warn("🎬 Media Bar:", "Access token or server address not available.");
          return [];
        }

        let itemTypes = [];
        if (CONFIG.maxMovies > 0) itemTypes.push("Movie");
        if (CONFIG.maxTvShows > 0) itemTypes.push("Series");

        if (itemTypes.length === 0) {
          console.log("🎬 Media Bar:", "Both Max Movies and Max TV Shows are set to 0. No items to fetch.");
          return [];
        }

        let sortParams = `sortBy=${CONFIG.sortBy}`;

        if (CONFIG.sortBy === 'Random' || CONFIG.sortBy === 'Original') {
          sortParams = 'sortBy=Random';
        } else if (CONFIG.sortBy === 'RecentlyAddedWeighted') {
          sortParams = 'sortBy=DateCreated&sortOrder=Descending';
        } else {
          sortParams += `&sortOrder=${CONFIG.sortOrder}`;
        }

        // Filter by isPlayed=False unless IncludeWatchedContent is enabled
        const playedFilter = CONFIG.includeWatchedContent ? '' : '&isPlayed=False';

        let parentalFilter = '';
        if (CONFIG.maxParentalRating) {
          parentalFilter = `&MaxOfficialRating=${CONFIG.maxParentalRating}`;
        }

        let dateFilter = '';
        if (CONFIG.maxDaysRecent) {
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - CONFIG.maxDaysRecent);
          dateFilter = `&minDateLastSaved=${pastDate.toISOString()}`;
        }

        let releaseDateFilter = '';
        if (CONFIG.maxDaysRecentRelease) {
          const pastRelDate = new Date();
          pastRelDate.setDate(pastRelDate.getDate() - CONFIG.maxDaysRecentRelease);
          releaseDateFilter += `&minPremiereDate=${pastRelDate.toISOString()}`;
        }
        if (CONFIG.releaseYears) {
          const parsedYears = SlideUtils.parseYearExpression(CONFIG.releaseYears);
          if (parsedYears.years && parsedYears.years.length > 0) {
            releaseDateFilter += `&years=${[...new Set(parsedYears.years)].join(',')}`;
          }
          if (parsedYears.minPremiereDate) {
            releaseDateFilter += `&minPremiereDate=${encodeURIComponent(parsedYears.minPremiereDate)}`;
          }
          if (parsedYears.maxPremiereDate) {
            releaseDateFilter += `&maxPremiereDate=${encodeURIComponent(parsedYears.maxPremiereDate)}`;
          }
        }

        // Exclude seasonal content from random lists
        let excludeFilter = '';
        if (CONFIG.excludeSeasonalContent && CONFIG.seasonalSections) {
          try {
            const sections = JSON.parse(CONFIG.seasonalSections || "[]");
            let allExcludedIds = [];

            for (const section of sections) {
              if (section.MediaIds) {
                const idsInThisSection = section.MediaIds.split(/[\n,]/)
                  .map((line) => {
                    const urlMatch = line.match(/\[(.*?)\]/);
                    let id = line;
                    if (urlMatch) {
                      id = line.replace(/\[.*?\]/, '').trim();
                      const guidMatch = id.match(/([0-9a-f]{32})/i);
                      if (guidMatch) { id = guidMatch[1]; } else { id = id.split('|')[0].trim(); }
                    }
                    return id.trim();
                  })
                  .filter((id) => id && !id.match(/^(genre|genres|tag|tags|studio|studios|year|years|released?|person|persons|actor|actors|director|directors|rating|ratings|officialrating|minrating|communityrating|score|age|parental):/i));

                allExcludedIds.push(...idsInThisSection);
              }
            }

            if (allExcludedIds.length > 0) {
              excludeFilter = `&ExcludeItemIds=${allExcludedIds.join(',')}`;
            }
          } catch (e) {
            console.error("🎬 Media Bar:", "Error extracting seasonal IDs for exclusion:", e);
          }
        }

        const requireLogo = MediaBarEnhancedSettingsManager.getSetting('requireLogo', CONFIG.requireLogo);

        const fetchItems = async (currentDateFilter, parentId = '') => {
          const parentParam = parentId ? `&parentId=${parentId}` : '';
          const fetchLimit = (CONFIG.sortBy === 'RecentlyAddedWeighted')
            ? Math.max((CONFIG.maxItems || 10) * 8, 80)
            : Math.max((CONFIG.maxItems || 10) * 3, 30);

          let queryTypes = itemTypes;
          if (parentId && STATE.slideshow.libraryTypes && STATE.slideshow.libraryTypes[parentId]) {
            const colType = STATE.slideshow.libraryTypes[parentId];
            if (colType === 'movies' && itemTypes.includes('Movie')) {
              queryTypes = ['Movie'];
            } else if (colType === 'tvshows' && itemTypes.includes('Series')) {
              queryTypes = ['Series'];
            }
          }

          const url = `${STATE.jellyfinData.serverAddress}/Items?IncludeItemTypes=${queryTypes.join(",")}&Recursive=true&hasOverview=true&imageTypes=Logo,Backdrop&${sortParams}${playedFilter}${parentalFilter}${currentDateFilter}${releaseDateFilter}${excludeFilter}${parentParam}&enableUserData=true&EnableTotalRecordCount=false&Limit=${fetchLimit}&fields=Id,Type,DateCreated,PremiereDate,ProductionYear,ImageTags,ParentLogoImageTag,ParentBackdropItemId,SeriesId,Genres,Tags`;
          const resp = await fetch(url, { headers: this.getAuthHeaders() });
          return resp;
        };

        // Determine library inclusions/exclusions
        const libraryMap = await this.fetchLibraryIds() || {};
        const allLibraryIds = [...new Set(Object.values(libraryMap))];

        const clientExcludedStr = MediaBarEnhancedSettingsManager.getSetting("excludedLibraries", CONFIG.publishedExcludedLibraryIds || null);
        let allExcludedIds = [];

        if (clientExcludedStr !== null) {
          allExcludedIds = clientExcludedStr.split(',').filter(id => id);
        } else {
          const serverExcludedNames = CONFIG.excludedLibraries ? CONFIG.excludedLibraries.split(',').map(s => s.trim().toLowerCase()).filter(s => s) : [];
          if (serverExcludedNames.length > 0) {
            allExcludedIds = serverExcludedNames.map(name => libraryMap[name]).filter(id => id);
          }
        }
        const includedIds = allLibraryIds.filter(id => !allExcludedIds.includes(id));

        let items = [];

        if (allLibraryIds.length > 0 && includedIds.length === 0) {
          // All libraries excluded
          return [];
        } else if (includedIds.length > 0 && includedIds.length < allLibraryIds.length) {
          // Fetch from each included library in parallel
          const fetchPromises = includedIds.map(async (libId) => {
            try {
              const resp = await fetchItems(dateFilter, libId);
              if (resp.ok) {
                const data = await resp.json();
                return data.Items || [];
              }
            } catch (e) {
              console.error("🎬 Media Bar:", `Error fetching items for library ${libId}:`, e);
            }
            return [];
          });
          const results = await Promise.all(fetchPromises);
          results.forEach(resList => {
            items.push(...resList);
          });

          // Sort combined results client-side
          if (CONFIG.sortBy === 'Random' || CONFIG.sortBy === 'Original') {
            items.sort(() => Math.random() - 0.5);
          } else if (CONFIG.sortBy === 'DateCreated') {
            items.sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));
          } else {
            items.sort((a, b) => (a.SortName || '').localeCompare(b.SortName || ''));
          }

          // Exact DateCreated filter
          if (CONFIG.maxDaysRecent && dateFilter !== '') {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - CONFIG.maxDaysRecent);
            items = items.filter(item => {
              if (!item.DateCreated) return true;
              return new Date(item.DateCreated) >= pastDate;
            });
          }

          if (CONFIG.maxDaysRecentRelease && releaseDateFilter !== '') {
            const pastRelDate = new Date();
            pastRelDate.setDate(pastRelDate.getDate() - CONFIG.maxDaysRecentRelease);
            items = items.filter(item => {
              if (!item.PremiereDate) return false;
              return new Date(item.PremiereDate) >= pastRelDate;
            });
          }

          if (CONFIG.releaseYears && releaseDateFilter !== '') {
            const parsed = SlideUtils.parseYearExpression(CONFIG.releaseYears);
            if (parsed.years && parsed.years.length > 0) {
              const ySet = new Set(parsed.years);
              items = items.filter(item => {
                if (item.ProductionYear && ySet.has(item.ProductionYear)) return true;
                if (item.PremiereDate) {
                  const yr = new Date(item.PremiereDate).getFullYear();
                  if (ySet.has(yr)) return true;
                }
                return false;
              });
            }
            if (parsed.minPremiereDate) {
              const minD = new Date(parsed.minPremiereDate);
              items = items.filter(item => item.PremiereDate && new Date(item.PremiereDate) >= minD);
            }
            if (parsed.maxPremiereDate) {
              const maxD = new Date(parsed.maxPremiereDate);
              items = items.filter(item => item.PremiereDate && new Date(item.PremiereDate) <= maxD);
            }
          }

          // Fallback if no items in date range
          if (items.length === 0 && (dateFilter !== '' || releaseDateFilter !== '')) {
            console.warn("🎬 Media Bar:", "No items found in libraries with date/release filter. Falling back to no date limit.");
            const fallbackPromises = includedIds.map(async (libId) => {
              try {
                const resp = await fetchItems('', libId);
                if (resp.ok) {
                  const data = await resp.json();
                  return data.Items || [];
                }
              } catch (e) {
                console.error("🎬 Media Bar:", `Error fetching items fallback for library ${libId}:`, e);
              }
              return [];
            });
            const fallbackResults = await Promise.all(fallbackPromises);
            fallbackResults.forEach(resList => {
              items.push(...resList);
            });
            if (CONFIG.sortBy === 'Random' || CONFIG.sortBy === 'Original') {
              items.sort(() => Math.random() - 0.5);
            } else if (CONFIG.sortBy === 'DateCreated') {
              items.sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));
            } else {
              items.sort((a, b) => (a.SortName || '').localeCompare(b.SortName || ''));
            }
          }
        } else {
          // No library restrictions, query globally
          let response = await fetchItems(dateFilter);
          if (response.ok) {
            const data = await response.json();
            items = data.Items || [];
          }

          if (CONFIG.maxDaysRecent && dateFilter !== '') {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - CONFIG.maxDaysRecent);
            items = items.filter(item => {
              if (!item.DateCreated) return true;
              return new Date(item.DateCreated) >= pastDate;
            });
          }

          if (CONFIG.maxDaysRecentRelease && releaseDateFilter !== '') {
            const pastRelDate = new Date();
            pastRelDate.setDate(pastRelDate.getDate() - CONFIG.maxDaysRecentRelease);
            items = items.filter(item => {
              if (!item.PremiereDate) return false;
              return new Date(item.PremiereDate) >= pastRelDate;
            });
          }

          if (CONFIG.releaseYears && releaseDateFilter !== '') {
            const parsed = SlideUtils.parseYearExpression(CONFIG.releaseYears);
            if (parsed.years && parsed.years.length > 0) {
              const ySet = new Set(parsed.years);
              items = items.filter(item => {
                if (item.ProductionYear && ySet.has(item.ProductionYear)) return true;
                if (item.PremiereDate) {
                  const yr = new Date(item.PremiereDate).getFullYear();
                  if (ySet.has(yr)) return true;
                }
                return false;
              });
            }
            if (parsed.minPremiereDate) {
              const minD = new Date(parsed.minPremiereDate);
              items = items.filter(item => item.PremiereDate && new Date(item.PremiereDate) >= minD);
            }
            if (parsed.maxPremiereDate) {
              const maxD = new Date(parsed.maxPremiereDate);
              items = items.filter(item => item.PremiereDate && new Date(item.PremiereDate) <= maxD);
            }
          }

          if (items.length === 0 && (dateFilter !== '' || releaseDateFilter !== '')) {
            console.warn("🎬 Media Bar:", "No items found with date/release filter. Falling back to no date limit.");
            response = await fetchItems('');
            if (response.ok) {
              const data = await response.json();
              items = data.Items || [];
            }
          }
        }

        // Apply Require Logo filter if enabled
        if (requireLogo) {
          items = items.filter(item => (item.ImageTags && item.ImageTags.Logo) || item.ParentLogoImageTag);
        }

        // Apply Global Excluded Genres & Tags (Blacklist)
        const serverExcludedGenres = CONFIG.excludedGenres ? CONFIG.excludedGenres.split(',').map(g => g.trim().toLowerCase()).filter(Boolean) : [];
        if (serverExcludedGenres.length > 0) {
          items = items.filter(item => {
            if (!item.Genres || !Array.isArray(item.Genres) || item.Genres.length === 0) return true;
            return !item.Genres.some(g => serverExcludedGenres.includes(g.toLowerCase()));
          });
        }

        const serverExcludedTags = CONFIG.excludedTags ? CONFIG.excludedTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];
        if (serverExcludedTags.length > 0) {
          items = items.filter(item => {
            if (!item.Tags || !Array.isArray(item.Tags) || item.Tags.length === 0) return true;
            return !item.Tags.some(t => serverExcludedTags.includes(t.toLowerCase()));
          });
        }

        // Apply Content Limits (MaxMovies, MaxTvShows)
        let movieCount = 0;
        let showCount = 0;
        let keptItems = [];

        if (CONFIG.sortBy === 'RecentlyAddedWeighted') {
          const movieCandidates = items.filter(item => item.Type === 'Movie');
          const showCandidates = items.filter(item => item.Type !== 'Movie');

          const pickedMovies = SlideUtils.weightedRandomSample(movieCandidates, CONFIG.maxMovies);
          const pickedShows = SlideUtils.weightedRandomSample(showCandidates, CONFIG.maxTvShows);

          items = SlideUtils.shuffleArray([...pickedMovies, ...pickedShows]).slice(0, CONFIG.maxItems);
          movieCount = items.filter(i => i.Type === 'Movie').length;
          showCount = items.filter(i => i.Type !== 'Movie').length;
        } else {
          for (const item of items) {
            if ((movieCount + showCount) >= CONFIG.maxItems) {
              break;
            }
            if (item.Type === 'Movie') {
              if (movieCount < CONFIG.maxMovies) {
                movieCount++;
                keptItems.push(item);
              }
            } else if (item.Type === 'Series' || item.Type === 'Season' || item.Type === 'Episode') {
              if (showCount < CONFIG.maxTvShows) {
                showCount++;
                keptItems.push(item);
              }
            } else {
              keptItems.push(item);
            }
          }
          items = keptItems;

          // reshuffle if there are different max number for movies and TV
          if ((CONFIG.maxMovies != CONFIG.maxTvShows) && (CONFIG.sortBy === 'Random' || CONFIG.sortBy === 'Original')) {
            items.sort(() => Math.random() - 0.5);
          }
        }

        console.log("🎬 Media Bar:", `Successfully fetched ${items.length} random library items from server (Movies: ${movieCount}, Shows: ${showCount})`);
        return items.map((item) => item.Id);
      } catch (error) {
        console.error("🎬 Media Bar:", "Error fetching item IDs:", error);
        return [];
      }
    },

    /**
     * Fetches items filtered by genre, tag, year, and/or release date ranges
     * @param {string[]} genres - Genre names to filter by
     * @param {string[]} tags - Tag names to filter by
     * @param {number[]} years - Year numbers to filter by
     * @param {string|null} minPremiereDate - Earliest premiere date ISO string
     * Fetches items filtered by genre, tag, year, release date, studio, person, and/or rating
     * @param {string[]} genres - Genre names to filter by
     * @param {string[]} tags - Tag names to filter by
     * @param {number[]} years - Year numbers to filter by
     * @param {string|null} minPremiereDate - Earliest premiere date ISO string
     * @param {string|null} maxPremiereDate - Latest premiere date ISO string
     * @param {string[]} studios - Studio names to filter by
     * @param {string[]} persons - Person names (actors, directors, etc.) to filter by
     * @param {string[]} officialRatings - Official parental ratings (e.g. PG-13, R, 16) to filter by
     * @param {number|null} minCommunityRating - Minimum community rating (IMDb score)
     * @param {number|null} maxOfficialRating - Maximum parental rating limit
     * @returns {Promise<string[]>} Array of item IDs
     */
    async fetchItemsByGenresAndTags(
      genres = [],
      tags = [],
      years = [],
      minPremiereDate = null,
      maxPremiereDate = null,
      studios = [],
      persons = [],
      officialRatings = [],
      minCommunityRating = null,
      maxOfficialRating = null,
      excludedGenres = [],
      excludedTags = []
    ) {
      try {
        if (!STATE.jellyfinData.accessToken || STATE.jellyfinData.accessToken === "Not Found") {
          console.warn("🎬 Media Bar:", "Access token not available for filter fetch.");
          return [];
        }

        if (!STATE.jellyfinData.serverAddress || STATE.jellyfinData.serverAddress === "Not Found") {
          console.warn("🎬 Media Bar:", "Server address not available for filter fetch.");
          return [];
        }

        let itemTypes = [];
        if (CONFIG.maxMovies > 0) itemTypes.push("Movie");
        if (CONFIG.maxTvShows > 0) itemTypes.push("Series");

        if (itemTypes.length === 0) {
          console.log("🎬 Media Bar:", "Both Max Movies and Max TV Shows are set to 0. No items to fetch.");
          return [];
        }

        let genreParam = '';
        if (genres && genres.length > 0) {
          genreParam = `&genres=${genres.map(g => encodeURIComponent(g)).join('|')}`;
        }

        let tagParam = '';
        if (tags && tags.length > 0) {
          tagParam = `&tags=${tags.map(t => encodeURIComponent(t)).join('|')}`;
        }

        let yearParam = '';
        if (years && years.length > 0) {
          yearParam = `&years=${[...new Set(years)].join(',')}`;
        }

        let premiereDateParam = '';
        if (minPremiereDate) {
          premiereDateParam += `&minPremiereDate=${encodeURIComponent(minPremiereDate)}`;
        }
        if (maxPremiereDate) {
          premiereDateParam += `&maxPremiereDate=${encodeURIComponent(maxPremiereDate)}`;
        }

        let studioParam = '';
        if (studios && studios.length > 0) {
          studioParam = `&studios=${studios.map(s => encodeURIComponent(s)).join('|')}`;
        }

        let officialRatingParam = '';
        if (officialRatings && officialRatings.length > 0) {
          officialRatingParam = `&officialRatings=${officialRatings.map(r => encodeURIComponent(r)).join('|')}`;
        }

        let minCommunityRatingParam = '';
        if (minCommunityRating !== null && minCommunityRating !== undefined) {
          minCommunityRatingParam = `&minCommunityRating=${minCommunityRating}`;
        }

        // Apply same filters as fetchItemIdsFromServer
        let sortParams = `sortBy=${CONFIG.sortBy}`;
        if (CONFIG.sortBy === 'Random' || CONFIG.sortBy === 'Original') {
          sortParams = 'sortBy=Random';
        } else if (CONFIG.sortBy === 'RecentlyAddedWeighted') {
          sortParams = 'sortBy=DateCreated&sortOrder=Descending';
        } else {
          sortParams += `&sortOrder=${CONFIG.sortOrder}`;
        }

        const playedFilter = CONFIG.includeWatchedContent ? '' : '&isPlayed=False';

        let parentalFilter = '';
        const effectiveMaxParental = maxOfficialRating !== null
          ? (CONFIG.maxParentalRating ? Math.min(CONFIG.maxParentalRating, maxOfficialRating) : maxOfficialRating)
          : CONFIG.maxParentalRating;
        if (effectiveMaxParental) {
          parentalFilter = `&MaxOfficialRating=${effectiveMaxParental}`;
        }

        let dateFilter = '';
        if (CONFIG.maxDaysRecent) {
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - CONFIG.maxDaysRecent);
          dateFilter = `&minDateLastSaved=${pastDate.toISOString()}`;
        }

        // Exclude seasonal content from results
        let excludeFilter = '';
        if (CONFIG.excludeSeasonalContent && CONFIG.seasonalSections) {
          try {
            const sections = JSON.parse(CONFIG.seasonalSections || "[]");
            let allExcludedIds = [];
            for (const section of sections) {
              if (section.MediaIds) {
                const idsInThisSection = section.MediaIds.split(/[\n,]/)
                  .map((line) => {
                    const urlMatch = line.match(/\[(.*?)\]/);
                    let id = line;
                    if (urlMatch) {
                      id = line.replace(/\[.*?\]/, '').trim();
                      const guidMatch = id.match(/([0-9a-f]{32})/i);
                      if (guidMatch) { id = guidMatch[1]; } else { id = id.split('|')[0].trim(); }
                    }
                    return id.trim();
                  })
                  .filter((id) => id && !id.match(/^(genre|genres|tag|tags|studio|studios|year|years|released?|person|persons|actor|actors|director|directors|rating|ratings|officialrating|minrating|communityrating|score|age|parental):/i));
                allExcludedIds.push(...idsInThisSection);
              }
            }
            if (allExcludedIds.length > 0) {
              excludeFilter = `&ExcludeItemIds=${allExcludedIds.join(',')}`;
            }
          } catch (e) {
            console.error("🎬 Media Bar:", "Error extracting seasonal IDs for exclusion:", e);
          }
        }

        const filterSummary = [];
        if (genres && genres.length > 0) filterSummary.push(`genres: [${genres.join(', ')}]`);
        if (tags && tags.length > 0) filterSummary.push(`tags: [${tags.join(', ')}]`);
        if (studios && studios.length > 0) filterSummary.push(`studios: [${studios.join(', ')}]`);
        if (persons && persons.length > 0) filterSummary.push(`persons: [${persons.join(', ')}]`);
        if (officialRatings && officialRatings.length > 0) filterSummary.push(`ratings: [${officialRatings.join(', ')}]`);
        if (minCommunityRating !== null) filterSummary.push(`minScore: ${minCommunityRating}`);
        if (maxOfficialRating !== null) filterSummary.push(`maxAge: ${maxOfficialRating}`);
        if (years && years.length > 0) filterSummary.push(`years: [${years.join(', ')}]`);
        if (minPremiereDate) filterSummary.push(`minPremiereDate: ${minPremiereDate}`);
        if (maxPremiereDate) filterSummary.push(`maxPremiereDate: ${maxPremiereDate}`);
        if (excludedGenres && excludedGenres.length > 0) filterSummary.push(`excludedGenres: [${excludedGenres.join(', ')}]`);
        if (excludedTags && excludedTags.length > 0) filterSummary.push(`excludedTags: [${excludedTags.join(', ')}]`);

        console.log("🎬 Media Bar:", `Fetching items by filter (${filterSummary.join(', ')})...`);

        const fetchItemsByFilter = async (parentId = '', personName = '') => {
          const parentParam = parentId ? `&parentId=${parentId}` : '';
          const personParam = personName ? `&person=${encodeURIComponent(personName)}` : '';

          let queryTypes = itemTypes;
          if (parentId && STATE.slideshow.libraryTypes && STATE.slideshow.libraryTypes[parentId]) {
            const colType = STATE.slideshow.libraryTypes[parentId];
            if (colType === 'movies' && itemTypes.includes('Movie')) {
              queryTypes = ['Movie'];
            } else if (colType === 'tvshows' && itemTypes.includes('Series')) {
              queryTypes = ['Series'];
            }
          }

          const fetchLimit = (CONFIG.sortBy === 'RecentlyAddedWeighted')
            ? Math.max((CONFIG.maxItems || 10) * 8, 80)
            : CONFIG.maxItems;

          const url = `${STATE.jellyfinData.serverAddress}/Items?IncludeItemTypes=${queryTypes.join(",")}&Recursive=true&hasOverview=true&imageTypes=Logo,Backdrop&${sortParams}${playedFilter}${parentalFilter}${dateFilter}${excludeFilter}${genreParam}${tagParam}${yearParam}${premiereDateParam}${studioParam}${officialRatingParam}${minCommunityRatingParam}${personParam}${parentParam}&enableUserData=true&EnableTotalRecordCount=false&Limit=${fetchLimit}&fields=Id,DateCreated,PremiereDate,ProductionYear,Type,OfficialRating,CommunityRating,Studios,People,Genres,Tags`;
          const resp = await fetch(url, { headers: this.getAuthHeaders() });
          return resp;
        };

        const queryPersonList = (persons && persons.length > 0) ? persons : [''];
        const fetchItemsForParent = async (parentId = '') => {
          if (queryPersonList.length === 1) {
            try {
              const resp = await fetchItemsByFilter(parentId, queryPersonList[0]);
              if (resp.ok) {
                const data = await resp.json();
                return data.Items || [];
              }
            } catch (e) {
              console.error("🎬 Media Bar:", `Error fetching filtered items for parent ${parentId || 'root'}:`, e);
            }
            return [];
          } else {
            try {
              const responses = await Promise.all(
                queryPersonList.map(p => fetchItemsByFilter(parentId, p))
              );
              const combined = [];
              const seenIds = new Set();
              for (const resp of responses) {
                if (resp && resp.ok) {
                  const data = await resp.json();
                  (data.Items || []).forEach(item => {
                    if (!seenIds.has(item.Id)) {
                      seenIds.add(item.Id);
                      combined.push(item);
                    }
                  });
                }
              }
              return combined;
            } catch (e) {
              console.error("🎬 Media Bar:", `Error fetching multi-person items for parent ${parentId || 'root'}:`, e);
              return [];
            }
          }
        };

        const libraryMap = await this.fetchLibraryIds() || {};
        const allLibraryIds = [...new Set(Object.values(libraryMap))];

        const clientExcludedStr = MediaBarEnhancedSettingsManager.getSetting("excludedLibraries", CONFIG.publishedExcludedLibraryIds || null);
        let allExcludedIds = [];

        if (clientExcludedStr !== null) {
          allExcludedIds = clientExcludedStr.split(',').filter(id => id);
        } else {
          const serverExcludedNames = CONFIG.excludedLibraries ? CONFIG.excludedLibraries.split(',').map(s => s.trim().toLowerCase()).filter(s => s) : [];
          if (serverExcludedNames.length > 0) {
            allExcludedIds = serverExcludedNames.map(name => libraryMap[name]).filter(id => id);
          }
        }
        const includedIds = allLibraryIds.filter(id => !allExcludedIds.includes(id));

        let items = [];
        if (allLibraryIds.length > 0 && includedIds.length === 0) {
          return [];
        } else if (includedIds.length > 0 && includedIds.length < allLibraryIds.length) {
          const fetchPromises = includedIds.map(libId => fetchItemsForParent(libId));
          const results = await Promise.all(fetchPromises);
          const seenIds = new Set();
          results.forEach(resList => {
            resList.forEach(item => {
              if (!seenIds.has(item.Id)) {
                seenIds.add(item.Id);
                items.push(item);
              }
            });
          });
        } else {
          items = await fetchItemsForParent('');
        }

        // Sort combined results
        if (CONFIG.sortBy === 'Random' || CONFIG.sortBy === 'Original') {
          items.sort(() => Math.random() - 0.5);
        } else if (CONFIG.sortBy === 'DateCreated' || CONFIG.sortBy === 'RecentlyAddedWeighted') {
          items.sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));
        } else {
          items.sort((a, b) => (a.SortName || '').localeCompare(b.SortName || ''));
        }

        // Client-side verification / filtering for robustness
        if (CONFIG.maxDaysRecent && dateFilter !== '') {
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - CONFIG.maxDaysRecent);
          items = items.filter(item => {
            if (!item.DateCreated) return true;
            return new Date(item.DateCreated) >= pastDate;
          });
        }

        if (years && years.length > 0) {
          const ySet = new Set(years.map(y => parseInt(y, 10)));
          items = items.filter(item => {
            if (item.ProductionYear && ySet.has(item.ProductionYear)) return true;
            if (item.PremiereDate) {
              const yr = new Date(item.PremiereDate).getFullYear();
              if (ySet.has(yr)) return true;
            }
            return false;
          });
        }

        if (minPremiereDate) {
          const minD = new Date(minPremiereDate);
          items = items.filter(item => item.PremiereDate && new Date(item.PremiereDate) >= minD);
        }

        if (maxPremiereDate) {
          const maxD = new Date(maxPremiereDate);
          items = items.filter(item => item.PremiereDate && new Date(item.PremiereDate) <= maxD);
        }

        if (studios && studios.length > 0) {
          const sSet = new Set(studios.map(s => s.toLowerCase()));
          items = items.filter(item => {
            if (!item.Studios || !Array.isArray(item.Studios) || item.Studios.length === 0) return true;
            return item.Studios.some(s => sSet.has((s.Name || '').toLowerCase()));
          });
        }

        if (officialRatings && officialRatings.length > 0) {
          const rSet = new Set(officialRatings.map(r => r.toLowerCase()));
          items = items.filter(item => {
            if (!item.OfficialRating) return false;
            const rLower = item.OfficialRating.toLowerCase();
            return rSet.has(rLower) || officialRatings.some(r => {
              const target = r.toLowerCase();
              return rLower === target || rLower.endsWith('-' + target) || rLower.replace(/\D/g, '') === target.replace(/\D/g, '');
            });
          });
        }

        if (effectiveMaxParental) {
          items = items.filter(item => {
            if (!item.OfficialRating) return true;
            const ratingNum = parseInt(item.OfficialRating.replace(/\D/g, ''), 10);
            return isNaN(ratingNum) || ratingNum <= effectiveMaxParental;
          });
        }

        if (minCommunityRating !== null && minCommunityRating !== undefined) {
          items = items.filter(item => {
            if (typeof item.CommunityRating !== 'number') return false;
            return item.CommunityRating >= minCommunityRating;
          });
        }

        // Apply Excluded Genres (Blacklist)
        const serverExcludedGenres = CONFIG.excludedGenres ? CONFIG.excludedGenres.split(',').map(g => g.trim().toLowerCase()).filter(Boolean) : [];
        const effectiveExcludedGenres = [...new Set([...(excludedGenres || []).map(g => g.toLowerCase()), ...serverExcludedGenres])];
        if (effectiveExcludedGenres.length > 0) {
          const prevCount = items.length;
          items = items.filter(item => {
            if (!item.Genres || !Array.isArray(item.Genres) || item.Genres.length === 0) return true;
            return !item.Genres.some(g => effectiveExcludedGenres.includes(g.toLowerCase()));
          });
          if (items.length < prevCount) {
            console.log("🎬 Media Bar:", `Excluded ${prevCount - items.length} item(s) matching excluded genres: [${effectiveExcludedGenres.join(', ')}]`);
          }
        }

        // Apply Excluded Tags (Blacklist)
        const serverExcludedTags = CONFIG.excludedTags ? CONFIG.excludedTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];
        const effectiveExcludedTags = [...new Set([...(excludedTags || []).map(t => t.toLowerCase()), ...serverExcludedTags])];
        if (effectiveExcludedTags.length > 0) {
          const prevCount = items.length;
          items = items.filter(item => {
            if (!item.Tags || !Array.isArray(item.Tags) || item.Tags.length === 0) return true;
            return !item.Tags.some(t => effectiveExcludedTags.includes(t.toLowerCase()));
          });
          if (items.length < prevCount) {
            console.log("🎬 Media Bar:", `Excluded ${prevCount - items.length} item(s) matching excluded tags: [${effectiveExcludedTags.join(', ')}]`);
          }
        }

        if (CONFIG.sortBy === 'RecentlyAddedWeighted') {
          items = SlideUtils.weightedRandomSample(items, CONFIG.maxItems);
        }

        console.log("🎬 Media Bar:", `Found ${items.length} items matching filter rules`);

        return items.map(item => ({ Id: item.Id, Type: item.Type }));
      } catch (error) {
        console.error("🎬 Media Bar:", "Error fetching items by filter rules:", error);
        return [];
      }
    },
    /**
     * Get authentication headers for API requests
     * @returns {Object} Headers object
     */
    getAuthHeaders() {
      return {
        Authorization: `MediaBrowser Client="${STATE.jellyfinData.appName}", Device="${STATE.jellyfinData.deviceName}", DeviceId="${STATE.jellyfinData.deviceId}", Version="${STATE.jellyfinData.appVersion}", Token="${STATE.jellyfinData.accessToken}"`,
      };
    },

    /**
     * Send a command to play an item
     * @param {string} itemId - Item ID to play
     * @returns {Promise<boolean>} Success status
     */
    async playItem(itemId) {
      try {
        const sessionId = await this.getSessionId();
        if (!sessionId) {
          console.error("🎬 Media Bar:", "Session ID not found.");
          return false;
        }

        const playUrl = `${STATE.jellyfinData.serverAddress}/Sessions/${sessionId}/Playing?playCommand=PlayNow&itemIds=${itemId}`;
        const playResponse = await fetch(playUrl, {
          method: "POST",
          headers: this.getAuthHeaders(),
        });

        if (!playResponse.ok) {
          throw new Error(
            `Failed to send play command: ${playResponse.statusText}`
          );
        }

        console.log("🎬 Media Bar:", "Play command sent successfully to session:", sessionId);
        return true;
      } catch (error) {
        console.error("🎬 Media Bar:", "Error sending play command:", error);
        return false;
      }
    },

    /**
     * Gets current session ID
     * @returns {Promise<string|null>} Session ID or null
     */
    async getSessionId() {
      try {
        const response = await fetch(
          `${STATE.jellyfinData.serverAddress
          }/Sessions?deviceId=${encodeURIComponent(STATE.jellyfinData.deviceId)}`,
          {
            headers: this.getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch session data: ${response.statusText}`);
        }

        const sessions = await response.json();

        if (!sessions || sessions.length === 0) {
          console.warn("🎬 Media Bar:",
            "No sessions found for deviceId:",
            STATE.jellyfinData.deviceId
          );
          return null;
        }

        return sessions[0].Id;
      } catch (error) {
        console.error("🎬 Media Bar:", "Error fetching session data:", error);
        return null;
      }
    },

    //Favorites

    async toggleFavorite(itemId, button) {
      try {
        const userId = STATE.jellyfinData.userId;
        const isFavorite = button.classList.contains("favorited");

        const url = `${STATE.jellyfinData.serverAddress}/Users/${userId}/FavoriteItems/${itemId}`;
        const method = isFavorite ? "DELETE" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            ...ApiUtils.getAuthHeaders(),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to toggle favorite: ${response.statusText}`);
        }
        button.classList.toggle("favorited", !isFavorite);
      } catch (error) {
        console.error("🎬 Media Bar:", "Error toggling favorite:", error);
      }
    },

    /**
     * Fetches SponsorBlock segments for a YouTube video
     * @param {string} videoId - YouTube Video ID
     * @returns {Promise<Object>} Object containing segments, calculated start time and end time
     */
    getSponsorBlockTrailerEnd(segments, duration, startTime = 0) {
      if (!Array.isArray(segments) || !Number.isFinite(duration) || duration <= 0) return null;
      let end = duration;
      for (;;) {
        const preceding = segments.reduce((earliest, entry) => {
          const [from, to] = entry.segment || [];
          return Number.isFinite(from) && Number.isFinite(to) && from >= 0 && to > from &&
            from < end && to >= end - 2.5 && to <= duration + 2.5 ? Math.min(earliest, from) : earliest;
        }, end);
        if (preceding === end) break;
        end = preceding;
      }
      return end < duration && end - startTime >= 8 ? Math.floor(end) : null;
    },

    async fetchSponsorBlockData(videoId, retries = 3) {
      if (!CONFIG.useSponsorBlock || !videoId) return { segments: [], startTime: 0, endTime: null };

      // Return cached result if available
      if (!this._sponsorBlockCache) this._sponsorBlockCache = {};
      if (this._sponsorBlockCache[videoId]) {
        return this._sponsorBlockCache[videoId];
      }

      const categories = CONFIG.sponsorBlockCategories || "intro,outro,preview";
      const catArray = categories.split(',').map(c => c.trim()).filter(Boolean);
      if (MediaBarEnhancedSettingsManager.getSetting("skipTrailerPromos", CONFIG.skipTrailerPromos)) {
        for (const category of ["outro", "interaction", "selfpromo"]) {
          if (!catArray.includes(category)) catArray.push(category);
        }
      }
      const catParam = encodeURIComponent(JSON.stringify(catArray));
      const url = `https://sponsor.ajay.app/api/skipSegments?videoID=${videoId}&categories=${catParam}`;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
          const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

          const fetchOptions = controller ? { signal: controller.signal } : {};
          const response = await fetch(url, fetchOptions);
          if (timeoutId) clearTimeout(timeoutId);

          if (response.status === 404) {
            // Video has no SponsorBlock segments - cache negative result
            const result = { segments: [], startTime: 0, endTime: null };
            this._sponsorBlockCache[videoId] = result;
            return result;
          }

          if (!response.ok) {
            console.warn("🎬 Media Bar:", `SponsorBlock API returned HTTP ${response.status} (attempt ${attempt}/${retries})`);
            if (attempt < retries) {
              await new Promise(res => setTimeout(res, attempt * 400));
              continue;
            }
            // Do NOT cache 5xx / 429 server errors permanently
            return { segments: [], startTime: 0, endTime: null };
          }

          const segments = await response.json();

          // 1. Calculate combined start skip (chaining from 0)
          let startTime = 0;
          let changed = true;
          while (changed) {
            changed = false;
            for (const segment of segments) {
              if (Array.isArray(segment.segment)) {
                const segStart = segment.segment[0];
                const segEnd = segment.segment[1];
                if (segStart <= startTime + 1.5 && segEnd > startTime) {
                  startTime = segEnd;
                  changed = true;
                  break;
                }
              }
            }
          }

          const duration = segments.find(segment => Number.isFinite(segment.videoDuration) && segment.videoDuration > 0)?.videoDuration;
          const endTime = this.getSponsorBlockTrailerEnd(segments, duration, startTime);
          const result = { segments, startTime, endTime };
          this._sponsorBlockCache[videoId] = result;
          return result;
        } catch (error) {
          console.warn("🎬 Media Bar:", `SponsorBlock fetch attempt ${attempt}/${retries} failed for ${videoId}:`, error.name === 'AbortError' ? 'Timeout' : error.message);
          if (attempt < retries) {
            await new Promise(res => setTimeout(res, attempt * 400));
          }
        }
      }

      // If all retries failed due to network error/timeout, return empty without permanently caching
      return { segments: [], startTime: 0, endTime: null };
    },

    /**
     * Searches for a Collection or Playlist by name
     * @param {string} name - Name to search for
     * @returns {Promise<string|null>} ID of the first match or null
     */
    async findCollectionOrPlaylistByName(name) {
      try {
        const response = await fetch(
          `${STATE.jellyfinData.serverAddress}/Items?IncludeItemTypes=BoxSet,Playlist&Recursive=true&searchTerm=${encodeURIComponent(name)}&Limit=1&fields=Id&userId=${STATE.jellyfinData.userId}`,
          {
            headers: this.getAuthHeaders(),
          }
        );

        if (!response.ok) {
          console.warn("🎬 Media Bar:", `Failed to search for '${name}'`);
          return null;
        }

        const data = await response.json();
        if (data.Items && data.Items.length > 0) {
          return data.Items[0].Id;
        }
        return null;
      } catch (error) {
        console.error("🎬 Media Bar:", `Error searching for '${name}':`, error);
        return null;
      }
    },

    /**
     * Fetches items belonging to a collection (BoxSet), playlist, or folder
     * @param {string} collectionId - ID of the collection/playlist/folder
     * @param {string} [itemType='BoxSet'] - Type of item ('BoxSet', 'Playlist', 'Folder', etc.)
     * @returns {Promise<Array>} Array of item IDs
     */
    async fetchCollectionItems(collectionId, itemType = 'BoxSet') {
      try {
        let itemTypes = [];
        if (CONFIG.maxMovies > 0) itemTypes.push("Movie");
        if (CONFIG.maxTvShows > 0) itemTypes.push("Series");

        if (itemTypes.length === 0) {
          console.log("🎬 Media Bar:", "Both Max Movies and Max TV Shows are set to 0. No collection items to fetch.");
          return [];
        }

        // For BoxSets and Playlists, omit Recursive=true so Jellyfin preserves custom/original collection sort order
        const isFolder = itemType === 'Folder' || itemType === 'CollectionFolder' || itemType === 'UserView';
        const recursiveParam = isFolder ? "&Recursive=true" : "";

        const response = await fetch(
          `${STATE.jellyfinData.serverAddress}/Items?ParentId=${collectionId}${recursiveParam}&IncludeItemTypes=${itemTypes.join(",")}&fields=Id,Type,Genres,Tags,OfficialRating&userId=${STATE.jellyfinData.userId}`,
          {
            headers: this.getAuthHeaders(),
          }
        );

        if (!response.ok) {
          console.warn("🎬 Media Bar:", `Failed to fetch collection items for ${collectionId}`);
          return [];
        }

        const data = await response.json();
        const items = data.Items || [];
        console.log("🎬 Media Bar:", `Resolved collection ${collectionId} to ${items.length} items (isFolder=${isFolder})`);
        return items.map(i => ({ Id: i.Id, Type: i.Type, Genres: i.Genres || [], Tags: i.Tags || [], OfficialRating: i.OfficialRating }));
      } catch (error) {
        console.error("🎬 Media Bar:", `Error fetching collection items for ${collectionId}:`, error);
        return [];
      }
    },

    /**
     * Extracts YouTube Video ID from any YouTube URL (watch, embed, short links)
     * @param {string|Object} url - YouTube URL or trailer object
     * @returns {string|null} 11-character YouTube video ID or null
     */
    extractYouTubeId(url) {
      if (!url) return null;
      try {
        const urlToCheck = typeof url === 'object' && url.url ? url.url : url;
        const urlObj = new URL(urlToCheck);
        const host = urlObj.hostname.replace(/^www\./, "");

        const isYouTubeHost = /^(?:youtu\.be|(?:m\.)?youtube\.com|youtube-nocookie\.com)$/.test(host);
        if (!isYouTubeHost) {
          return null; // Silent return for non-YouTube URLs (local trailers, mp4 streams, etc.)
        }

        let videoId = null;
        if (host === "youtu.be") {
          const pathId = urlObj.pathname.split("/")[1] || urlObj.pathname.substring(1);
          videoId = pathId ? pathId.split("?")[0] : null;
        } else if ((host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") && urlObj.pathname.startsWith("/embed/")) {
          videoId = urlObj.pathname.split("/")[2] || null;
        } else {
          videoId = urlObj.searchParams.get("v") || null;
        }

        if (!videoId) {
          console.warn("🎬 Media Bar:", "Could not extract YouTube Video ID from YouTube URL:", urlToCheck);
        }
        return /^[\w-]{11}$/.test(videoId || "") ? videoId : null;
      } catch (e) { }
      return null;
    },

    /**
     * Ranks and selects the best remote trailer URL from item.RemoteTrailers
     * @param {Array} remoteTrailers - RemoteTrailers array from item
     * @returns {string|null} Best trailer URL or null
     */
    selectBestRemoteTrailer(remoteTrailers) {
      if (!Array.isArray(remoteTrailers) || remoteTrailers.length === 0) {
        return null;
      }

      const alternateCutTerms = [
        "sign language", "asl trailer", "audio description",
        "audio described", "described audio", "vertical"
      ];

      const rankName = (name) => {
        const text = (name || "").toLowerCase();
        const isAlternateCut = alternateCutTerms.some((term) => text.includes(term));

        let rank;
        if (text.includes("official trailer")) rank = 5;
        else if (text.includes("final trailer") || text.includes("main trailer")) rank = 4;
        else if (text.includes("trailer")) rank = 3;
        else if (text.includes("teaser")) rank = 2;
        else rank = 1;

        return isAlternateCut ? rank - 0.5 : rank;
      };

      let best = null;

      for (const trailer of remoteTrailers) {
        if (!trailer || !trailer.Url) continue;

        const videoId = this.extractYouTubeId(trailer.Url);
        if (!videoId) continue;

        const rank = rankName(trailer.Name);
        if (!best || rank > best.rank) {
          best = { url: trailer.Url, rank };
        }
      }

      return best ? best.url : remoteTrailers[0].Url;
    },

    /**
     * Fetches the first local trailer for an item
     * @param {Object|string} itemOrId - Item object or ID
     * @returns {Promise<Object|null>} Trailer data object {id, url} or null
     */
    async fetchLocalTrailer(itemOrId) {
      try {
        const item = typeof itemOrId === 'object' ? itemOrId : null;
        const itemId = item ? item.Id : itemOrId;
        const seriesId = item ? item.SeriesId : null;
        const seasonId = item ? item.SeasonId : null;
        const itemType = item ? item.Type : null;

        let trailers = null;

        // 1. If Episode: check Season first (if seasonId exists), then Series
        if (itemType === 'Episode') {
          if (seasonId) {
            const response = await fetch(
              `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Items/${seasonId}/LocalTrailers`,
              { headers: this.getAuthHeaders() }
            );
            if (response.ok) {
              trailers = await response.json();
              if (trailers && trailers.length > 0) {
                console.log("🎬 Media Bar:", `Found local trailer on season fallback (${seasonId}) for episode ${itemId}`);
              }
            }
          }
          if ((!trailers || trailers.length === 0) && seriesId) {
            const response = await fetch(
              `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Items/${seriesId}/LocalTrailers`,
              { headers: this.getAuthHeaders() }
            );
            if (response.ok) {
              trailers = await response.json();
              if (trailers && trailers.length > 0) {
                console.log("🎬 Media Bar:", `Found local trailer on series fallback (${seriesId}) for episode ${itemId}`);
              }
            }
          }
        }
        // 2. If Season: check Season first, then Series
        else if (itemType === 'Season') {
          let response = await fetch(
            `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Items/${itemId}/LocalTrailers`,
            { headers: this.getAuthHeaders() }
          );
          trailers = response.ok ? await response.json() : null;

          if ((!trailers || trailers.length === 0) && seriesId) {
            response = await fetch(
              `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Items/${seriesId}/LocalTrailers`,
              { headers: this.getAuthHeaders() }
            );
            if (response.ok) {
              trailers = await response.json();
              if (trailers && trailers.length > 0) {
                console.log("🎬 Media Bar:", `Found local trailer on series fallback (${seriesId}) for season ${itemId}`);
              }
            }
          }
        }
        // 3. For Series or Movie: check primary item ID directly
        else {
          let response = await fetch(
            `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Items/${itemId}/LocalTrailers`,
            { headers: this.getAuthHeaders() }
          );
          trailers = response.ok ? await response.json() : null;

          // If Series has no direct local trailer, check child Seasons of the Series (Season 1, Season 2, etc.)
          if ((!trailers || trailers.length === 0) && itemType === 'Series') {
            try {
              const seasonsResp = await fetch(
                `${STATE.jellyfinData.serverAddress}/Shows/${itemId}/Seasons?userId=${STATE.jellyfinData.userId}`,
                { headers: this.getAuthHeaders() }
              );
              if (seasonsResp.ok) {
                const seasonsData = await seasonsResp.json();
                const seasons = (seasonsData.Items || []).sort((a, b) => (a.IndexNumber ?? 0) - (b.IndexNumber ?? 0));
                for (const season of seasons) {
                  const seasonTrailersResp = await fetch(
                    `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Items/${season.Id}/LocalTrailers`,
                    { headers: this.getAuthHeaders() }
                  );
                  if (seasonTrailersResp.ok) {
                    const seasonTrailers = await seasonTrailersResp.json();
                    if (seasonTrailers && seasonTrailers.length > 0) {
                      console.log("🎬 Media Bar:", `Found local trailer in season folder ${season.Name || season.Id} for series ${itemId}`);
                      trailers = trailers ? trailers.concat(seasonTrailers) : seasonTrailers;
                      if (!CONFIG.randomizeLocalTrailers) {
                        break; // Stop after finding the first available season's trailer (e.g. Season 1)
                      }
                    }
                  }
                }
              }
            } catch (e) {
              console.warn("🎬 Media Bar:", `Could not fetch season trailers fallback for series ${itemId}:`, e);
            }
          }

          if ((!trailers || trailers.length === 0) && (seasonId || seriesId)) {
            const fallbackId = seasonId || seriesId;
            const fbResp = await fetch(
              `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Items/${fallbackId}/LocalTrailers`,
              { headers: this.getAuthHeaders() }
            );
            if (fbResp.ok) {
              trailers = await fbResp.json();
            }
          }
        }

        if (trailers && trailers.length > 0) {
          let trailer;
          if (CONFIG.randomizeLocalTrailers && trailers.length > 1) {
            const randomIndex = Math.floor(Math.random() * trailers.length);
            trailer = trailers[randomIndex];
            console.log("🎬 Media Bar:", `Using random local trailer (${randomIndex + 1}/${trailers.length}) for ${itemId}: ${trailer.Name}`);
          } else {
            trailer = trailers[0];
          }

          const mediaSourceId = trailer.MediaSources && trailer.MediaSources[0] ? trailer.MediaSources[0].Id : trailer.Id;

          return {
            id: trailer.Id,
            url: `${STATE.jellyfinData.serverAddress}/Videos/${trailer.Id}/stream.mp4?mediaSourceId=${mediaSourceId}&api_key=${STATE.jellyfinData.accessToken}&static=true`
          };
        }
        return null;
      } catch (error) {
        console.error("🎬 Media Bar:", `Error fetching local trailer for ${itemOrId}:`, error);
        return null;
      }
    },

    /**
     * Fetches theme videos for an item
     * @param {string} itemId - Item ID
     * @returns {Promise<Object|null>} Theme video data object {id, url} or null
     */
    async fetchThemeVideos(itemId) {
      try {
        const response = await fetch(
          `${STATE.jellyfinData.serverAddress}/Items/${itemId}/ThemeVideos?userId=${STATE.jellyfinData.userId}`,
          { headers: this.getAuthHeaders() }
        );

        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data) ? data : (data.Items || []);

          if (items.length > 0) {
            let video;
            if (CONFIG.randomizeThemeVideos && items.length > 1) {
              const randomIndex = Math.floor(Math.random() * items.length);
              video = items[randomIndex];
              console.log("🎬 Media Bar:", `Found Theme Video (Random ${randomIndex + 1}/${items.length}) via ThemeVideos endpoint: ${video.Name} (${video.Id})`);
            } else {
              video = items[0];
              console.log("🎬 Media Bar:", `Found Theme Video (First) via ThemeVideos endpoint: ${video.Name} (${video.Id})`);
            }

            return {
              id: video.Id,
              url: `${STATE.jellyfinData.serverAddress}/Videos/${video.Id}/stream.mp4?api_key=${STATE.jellyfinData.accessToken}&static=true`
            };
          }
        }
        return null;
      } catch (error) {
        console.error("🎬 Media Bar:", `Error fetching theme videos for ${itemId}:`, error);
        return null;
      }
    }
  };

  /**
   * Class for managing slide timing
   */
  class SlideTimer {
    /**
     * Creates a new slide timer
     * @param {Function} callback - Function to call on interval
     * @param {number} interval - Interval in milliseconds
     */
    constructor(callback, interval) {
      this.callback = callback;
      this.interval = interval;
      this.timerId = null;
      this.startedAt = null;
      this.remaining = interval;
      this.isPaused = false;
      this.start();
    }

    /**
     * Stops the timer
     * @returns {SlideTimer} This instance for chaining
     */
    stop() {
      if (this.timerId) {
        clearInterval(this.timerId);
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      this.isPaused = false;
      this.remaining = this.interval;
      return this;
    }

    /**
     * Starts the timer
     * @returns {SlideTimer} This instance for chaining
     */
    start() {
      if (!this.timerId) {
        this.startedAt = Date.now();
        this.remaining = this.interval;
        this.isPaused = false;
        this.timerId = setInterval(() => {
          this.startedAt = Date.now();
          this.remaining = this.interval;
          this.callback();
        }, this.interval);
      }
      return this;
    }

    /**
     * Pauses the timer preserving remaining duration
     * @returns {SlideTimer} This instance for chaining
     */
    pause() {
      if (this.timerId && !this.isPaused) {
        clearInterval(this.timerId);
        clearTimeout(this.timerId);
        this.timerId = null;
        this.isPaused = true;
        const elapsed = Date.now() - (this.startedAt || Date.now());
        this.remaining = Math.max(0, this.remaining - elapsed);
      }
      return this;
    }

    /**
     * Resumes the paused timer with remaining duration
     * @returns {SlideTimer} This instance for chaining
     */
    resume() {
      if (this.isPaused && !this.timerId) {
        this.isPaused = false;
        this.startedAt = Date.now();
        const timeoutDuration = this.remaining > 0 ? this.remaining : this.interval;
        this.timerId = setTimeout(() => {
          this.timerId = null;
          this.callback();
          this.start();
        }, timeoutDuration);
      }
      return this;
    }

    /**
     * Restarts the timer
     * @returns {SlideTimer} This instance for chaining
     */
    restart() {
      return this.stop().start();
    }

    /**
     * Immediately triggers next slide and restarts timer
     * @returns {SlideTimer} This instance for chaining
     */
    next() {
      if (typeof SlideshowManager !== 'undefined' && SlideshowManager.nextSlide) {
        SlideshowManager.nextSlide();
      } else if (typeof this.callback === 'function') {
        this.callback();
      }
      return this.restart();
    }
  }

  /**
   * Observer for handling slideshow visibility based on current page
   */
  const VisibilityObserver = {
    wasVisible: false,
    wasRemotePlaying: false,
    _historyWrapped: false,
    checkRemotePlaybackActive() {
      // 1. Check Jellyfin's PlaybackManager if accessible
      try {
        if (window.playbackManager && typeof window.playbackManager.isPlaying === 'function') {
          if (window.playbackManager.isPlaying()) {
            const isLocal = typeof window.playbackManager.isPlayingLocally === 'function' ? window.playbackManager.isPlayingLocally() : false;
            if (!isLocal) return true;
          }
        }
      } catch (e) { }

      // 2. Check persistent nowPlayingBar (present when casting / remote playing e.g. MPV Shim, or playing audio)
      const nowPlayingBar = document.querySelector('.nowPlayingBar:not(.hide), .nowPlayingBarContainer:not(.hide)');
      if (nowPlayingBar) {
        const playPauseBtn = nowPlayingBar.querySelector('.btnPlayPause, [data-action="pause"], [data-action="playPause"]');
        if (playPauseBtn) {
          const text = (playPauseBtn.textContent || '').trim().toLowerCase();
          const html = (playPauseBtn.innerHTML || '').toLowerCase();
          const action = (playPauseBtn.getAttribute('data-action') || '').toLowerCase();
          if (text === 'pause' || html.includes('pause') || action === 'pause') {
            return true;
          }
        } else {
          return true;
        }
      }

      // 3. Remote Control page / OSD
      if (document.querySelector('.remoteControlView:not(.hide), .remoteControlContainer:not(.hide), #remoteControlPage:not(.hide)')) {
        return true;
      }

      return false;
    },
    updateVisibility() {
      if (document.hidden || STATE.slideshow.isSuspended) return;
      const videoPlayer = document.querySelector('.videoPlayerContainer');
      const trailerPlayer = document.querySelector('.youtubePlayerContainer');
      const isVideoPlayerActive = (videoPlayer && !videoPlayer.classList.contains('hide')) ||
        (trailerPlayer && !trailerPlayer.classList.contains('hide')) ||
        document.querySelector('#videoOsdPage:not(.hide)') ||
        document.body.classList.contains('is-videoplayer');

      const container = document.getElementById("slides-container");

      // If a full screen video player is active, hide slideshow and stop playback
      if (isVideoPlayerActive) {
        if (container) {
          // Only touch the DOM when something actually changes. The observer below watches
          // class attribute mutations on the whole body subtree, and classList.add() queues a
          // mutation record even when the class is already present, so unconditional writes here
          // re-trigger this callback forever and freeze the page as soon as the player opens.
          if (container.style.display !== "none") container.style.display = "none";
          if (container.style.visibility !== "hidden") container.style.visibility = "hidden";
          if (container.style.pointerEvents !== "none") container.style.pointerEvents = "none";
          container.classList.toggle("media-bar-hidden", true);
        }
        if (STATE.slideshow.slideInterval) {
          STATE.slideshow.slideInterval.stop();
        }
        SlideshowManager.stopAllPlayback();
        this.wasVisible = false; // Reset so returning to home correctly restarts the slideshow!
        PageBackdrop.clear();
        return;
      }

      if (!container) return;

      const currentHash = (window.location.hash || "").toLowerCase();
      const isHome = (currentHash === "#/home.html" || currentHash === "#/home" || currentHash === "#!/home.html" || currentHash === "#!/home") &&
        !document.body.classList.contains("dashboardDocument");

      const activeTab = document.querySelector(".emby-tab-button-active");
      const isVisible = isHome && activeTab && activeTab.getAttribute("data-index") === "0";

      const targetDisplay = isVisible ? "block" : "none";
      const targetVisibility = isVisible ? "visible" : "hidden";
      const targetPointerEvents = isVisible ? "auto" : "none";

      if (container.style.display !== targetDisplay) container.style.display = targetDisplay;
      if (container.style.visibility !== targetVisibility) container.style.visibility = targetVisibility;
      if (container.style.pointerEvents !== targetPointerEvents) container.style.pointerEvents = targetPointerEvents;
      container.classList.toggle("media-bar-hidden", !isVisible);

      if (container.parentNode !== document.body) {
        document.body.appendChild(container);
      }

      const pauseOnExternal = MediaBarEnhancedSettingsManager.getSetting('pauseOnExternalPlayback', CONFIG.pauseOnExternalPlayback);
      const isRemotePlaying = pauseOnExternal && this.checkRemotePlaybackActive();

      if (isVisible && !this.wasVisible) {
        if (isTvMode()) {
          const isReturningFromDetails = STATE.slideshow.wasOnDetailsPage;
          const wasHomeClicked = STATE.slideshow.wasHomeButtonClicked;
          STATE.slideshow.wasOnDetailsPage = false;
          STATE.slideshow.wasHomeButtonClicked = false;

          // Focus Media Bar on initial startup, fresh home load, or when Home button was clicked.
          // Do not focus Media Bar when backing out from a details page via back remote/arrow.
          if (!isReturningFromDetails || wasHomeClicked) {
            setTimeout(() => {
              if (container && container.style.display !== 'none') {
                container.focus({ preventScroll: true });
              }
            }, 300);
          }
        }

        STATE.slideshow.isTransitioning = false;

        this.wasRemotePlaying = isRemotePlaying;
        if (isRemotePlaying) {
          if (STATE.slideshow.slideInterval) {
            STATE.slideshow.slideInterval.stop();
          }
          SlideshowManager.stopAllPlayback();
        } else {
          if (STATE.slideshow.hasInitialized && STATE.slideshow.itemIds.length > 0) {
            SlideshowManager.updateCurrentSlide(STATE.slideshow.currentSlideIndex);
          } else if (STATE.slideshow.slideInterval && !STATE.slideshow.isPaused) {
            SlideshowManager.resumeActivePlayback();
          }
          if (STATE.slideshow.slideInterval && !STATE.slideshow.isPaused) {
            STATE.slideshow.slideInterval.start();
          }
        }
      } else if (isVisible && this.wasVisible) {
        // Page was already visible; pause slideshow and trailers when casting starts, resume when cast stops
        if (isRemotePlaying && !this.wasRemotePlaying) {
          this.wasRemotePlaying = true;
          if (STATE.slideshow.slideInterval) {
            STATE.slideshow.slideInterval.stop();
          }
          SlideshowManager.stopAllPlayback();
        } else if (!isRemotePlaying && this.wasRemotePlaying) {
          this.wasRemotePlaying = false;
          if (!STATE.slideshow.isPaused) {
            if (STATE.slideshow.slideInterval) {
              STATE.slideshow.slideInterval.start();
            }
            SlideshowManager.resumeActivePlayback();
          }
        }
      } else if (!isVisible) {
        if (this.wasVisible) {
          STATE.slideshow.isTransitioning = false;
          // Track if user left home screen for a details page (TV mode only)
          if (isTvMode()) {
            const currentHash = window.location.hash || "";
            STATE.slideshow.wasOnDetailsPage = currentHash.includes("details") || currentHash.includes("item");
          }

          if (STATE.slideshow.slideInterval) {
            STATE.slideshow.slideInterval.stop();
          }
          SlideshowManager.stopAllPlayback();

          // Free memory: destroy players and slides
          if (STATE.slideshow.videoPlayers) {
            Object.values(STATE.slideshow.videoPlayers).forEach((player) => {
              if (player) {
                if (typeof player.destroy === "function") {
                  try { player.destroy(); } catch (e) { }
                } else if (player.tagName === 'VIDEO') {
                  try { player.removeAttribute('src'); player.load(); player.remove(); } catch (e) { }
                }
              }
            });
            STATE.slideshow.videoPlayers = {};
          }
          container.querySelectorAll(".slide").forEach((slide) => slide.remove());
          STATE.slideshow.createdSlides = {};
          STATE.slideshow.hasTrailer = {};
        }

        PageBackdrop.clear();
      }

      this.wasVisible = isVisible;
    },

    /**
     * Initializes visibility observer
     */
    init() {
      // Intercept SPA routing (pushState and replaceState) so router changes immediately trigger visibility update
      if (!this._historyWrapped && window.history) {
        ['pushState', 'replaceState'].forEach((fn) => {
          const orig = window.history[fn];
          if (orig) {
            window.history[fn] = function (...args) {
              const res = orig.apply(this, args);
              try { VisibilityObserver.updateVisibility(); } catch (e) { }
              return res;
            };
          }
        });
        this._historyWrapped = true;
      }

      let visibilityFrame = 0;
      const observer = new MutationObserver((mutations) => {
        // Mutations inside the slides container are plugin content (slides, backdrops,
        // our own show/hide writes) and never change what updateVisibility() looks at,
        // so skip them. Reacting to our own hide() writes here is what caused the freeze.
        const container = document.getElementById("slides-container");
        if (container && mutations.every((m) => m.target === container || container.contains(m.target))) return;
        if (!document.hidden && !visibilityFrame) {
          visibilityFrame = requestAnimationFrame(() => {
            visibilityFrame = 0;
            this.updateVisibility();
          });
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });

      ['click', 'hashchange', 'popstate', 'viewshow', 'pageshow'].forEach((evt) => {
        window.addEventListener(evt, () => this.updateVisibility());
      });

      // Listen to PlaybackManager events if exposed
      try {
        if (window.Events && window.playbackManager) {
          ['playbackstart', 'playbackstop', 'playstatechange', 'statechange'].forEach((evt) => {
            window.Events.on(window.playbackManager, evt, () => {
              try { VisibilityObserver.updateVisibility(); } catch (e) { }
            });
          });
        }
      } catch (e) { }

      this.updateVisibility();
    },
  };

  /**
   * Mirrors the featured slide into Jellyfin's own page backdrop layer, so the
   * background behind the home page follows whatever the slideshow is showing
   * instead of staying on unrelated library art.
   *
   * Reuses the exact backdrop URL the active slide already requested, so the
   * browser serves it from cache and no extra image is fetched.
   *
   * Only active while the slideshow is visible and if Jellyfin backdrops are enabled.
   * Disabled by default (default off). Enable with CONFIG.syncPageBackdrop.
   */
  const PageBackdrop = {
    LAYER_CLASS: "slideshow-page-backdrop",
    observer: null,
    currentItemId: null,

    getOrCreateContainer() {
      let container = document.querySelector(".backdropContainer");
      if (!container) {
        container = SlideUtils.createElement("div", {
          className: "backdropContainer",
        });
        document.body.insertBefore(container, document.body.firstChild);
      }
      return container;
    },

    startObserver() {
      if (this.observer) return;

      const bgContainer = document.querySelector(".backgroundContainer");
      if (!bgContainer) return;

      this.observer = new MutationObserver(() => {
        // If our backdrop layer is active, ensure backgroundContainer retains withBackdrop
        const hasOurLayer = document.querySelector(`.${this.LAYER_CLASS}`);
        if (hasOurLayer && bgContainer && !bgContainer.classList.contains("withBackdrop")) {
          bgContainer.classList.add("withBackdrop");
        }
      });

      this.observer.observe(bgContainer, { attributes: true, attributeFilter: ["class"] });
    },

    stopObserver() {
      if (!this.observer) return;
      this.observer.disconnect();
      this.observer = null;
    },

    update(itemId) {
      const isSyncEnabled = MediaBarEnhancedSettingsManager.getSetting('syncPageBackdrop', CONFIG.syncPageBackdrop);
      const isHome = (window.location.hash === "#/home.html" || window.location.hash === "#/home");
      if (!isSyncEnabled || !isHome) {
        this.clear();
        return;
      }

      const item = STATE.slideshow.loadedItems[itemId];
      if (!item) return;

      const backdropIndex = item._selectedBackdropIndex !== undefined ? item._selectedBackdropIndex : 0;
      const src = SlideCreator.buildImageUrl(
        item,
        "Backdrop",
        backdropIndex,
        STATE.jellyfinData.serverAddress,
        60
      );
      if (!src) return;
      if (this.currentItemId === itemId) return;

      const container = this.getOrCreateContainer();
      const duration = CONFIG.fadeTransitionDuration || 500;
      const existingLayers = Array.from(container.querySelectorAll(`.${this.LAYER_CLASS}`));
      const newBg = `url("${src.replace(/"/g, "%22")}")`;

      // Create new layer on top using Jellyfin's native backdropImage classes
      const newLayer = SlideUtils.createElement("div", {
        className: `backdropImage displayingBackdropImage ${this.LAYER_CLASS}`,
        style: {
          backgroundImage: newBg,
          opacity: "0",
          transition: `opacity ${duration}ms ease-in-out`,
        },
      });
      newLayer.setAttribute("data-url", src);

      container.appendChild(newLayer);

      // Force reflow and trigger opacity fade-in
      void newLayer.offsetWidth;
      newLayer.style.opacity = "1";
      this.currentItemId = itemId;

      // Clean up previous layers after crossfade completes
      setTimeout(() => {
        existingLayers.forEach((oldLayer) => {
          if (oldLayer && oldLayer.isConnected) {
            oldLayer.remove();
          }
        });
      }, duration + 50);

      const bgContainer = document.querySelector(".backgroundContainer");
      if (bgContainer) {
        bgContainer.classList.add("withBackdrop");
      }

      this.startObserver();
    },

    clear() {
      this.stopObserver();
      this.currentItemId = null;

      const layers = document.querySelectorAll(`.${this.LAYER_CLASS}`);
      layers.forEach((layer) => layer.remove());
    },
  };

  /**
   * Slideshow UI creation and management
   */
  const SlideCreator = {
    /**
     * Builds a tag-based image URL for cache-friendly image requests
     * @param {Object} item - Item data containing ImageTags
     * @param {string} imageType - Image type (Backdrop, Logo, Primary, etc.)
     * @param {number} [index] - Image index (for Backdrop, Primary, etc.)
     * @param {string} serverAddress - Server address
     * @param {number} [quality] - Image quality (0-100). If tag is available, both tag and quality are used.
     * @returns {string} Image URL with tag parameter (and quality if tag available), or quality-only fallback
     */
    buildImageUrl(item, imageType, index, serverAddress, quality) {
      let itemId = item.Id;
      let tag = null;

      // Handle Backdrop images
      if (imageType === "Backdrop") {
        // Check BackdropImageTags array first
        if (item.BackdropImageTags && Array.isArray(item.BackdropImageTags) && item.BackdropImageTags.length > 0) {
          const backdropIndex = index !== undefined ? index : 0;
          if (backdropIndex < item.BackdropImageTags.length) {
            tag = item.BackdropImageTags[backdropIndex];
          }
        }
        // Fallback to ImageTags.Backdrop if BackdropImageTags not available
        if (!tag && item.ImageTags && item.ImageTags.Backdrop) {
          tag = item.ImageTags.Backdrop;
        }
        // Parent Backdrop Fallback (for Season or Episode inheriting from Series)
        if (!tag) {
          if (item.ParentBackdropImageTags && Array.isArray(item.ParentBackdropImageTags) && item.ParentBackdropImageTags.length > 0) {
            const backdropIndex = index !== undefined ? index : 0;
            if (backdropIndex < item.ParentBackdropImageTags.length) {
              tag = item.ParentBackdropImageTags[backdropIndex];
            }
          }
          if (tag) {
            itemId = item.ParentBackdropItemId || item.SeriesId || itemId;
          } else if (item.SeriesId) {
            itemId = item.SeriesId;
          }
        }
      } else {
        // For other image types (Logo, Primary, etc.), use ImageTags
        if (item.ImageTags && item.ImageTags[imageType]) {
          tag = item.ImageTags[imageType];
        } else if (imageType === "Logo" && item.ParentLogoImageTag) {
          tag = item.ParentLogoImageTag;
          if (item.ParentLogoItemId) {
            itemId = item.ParentLogoItemId;
          } else if (item.SeriesId) {
            itemId = item.SeriesId;
          }
        }
      }

      // Build base URL path
      let baseUrl;
      if (imageType === "Backdrop") {
        const effectiveIndex = tag ? (index !== undefined ? index : 0) : 0;
        baseUrl = `${serverAddress}/Items/${itemId}/Images/${imageType}/${effectiveIndex}`;
      } else if (index !== undefined) {
        baseUrl = `${serverAddress}/Items/${itemId}/Images/${imageType}/${index}`;
      } else {
        baseUrl = `${serverAddress}/Items/${itemId}/Images/${imageType}`;
      }

      // Build URL with tag and quality if tag is available, otherwise quality-only fallback
      if (tag) {
        // Use both tag and quality for cacheable, quality-controlled images
        const qualityParam = quality !== undefined ? `&quality=${quality}` : '';
        return `${baseUrl}?tag=${tag}${qualityParam}`;
      } else {
        // Fallback to quality-only URL if no tag is available
        const qualityParam = quality !== undefined ? quality : 90;
        return `${baseUrl}?quality=${qualityParam}`;
      }
    },

    /**
     * Creates a slide element for an item
     * @param {Object} item - Item data
     * @param {string} title - Title type (Movie/TV Show)
     * @returns {HTMLElement} Slide element
     */
    createSlideElement(item, title) {
      if (!item || !item.Id) {
        console.error("🎬 Media Bar:", "Invalid item data:", item);
        return null;
      }

      const itemId = item.Id;
      const serverAddress = STATE.jellyfinData.serverAddress;

      const slide = SlideUtils.createElement("div", {
        className: "slide",
        tabIndex: 0,
        "data-item-id": itemId,
        "data-scroll-mode-x": "custom",
        "data-scroll-mode-y": "custom",
        onclick: (e) => {
          // Prevent navigation if clicking on buttons, links, or arrows
          if (e.target.closest('button, a, .arrow, .media-bar-reviews')) return;

          // On desktop/tablets, detail navigation is handled strictly by the details button.
          // Full slide clicking is only enabled for compact mobile modes (16:9 and 4:3) where the details button is hidden.
          const isMobileLayout = document.body.classList.contains("media-bar-mobile-16-9") ||
            document.body.classList.contains("media-bar-mobile-4-3");
          if (!isMobileLayout) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }

          e.preventDefault();
          e.stopPropagation();
          this.openDetails(itemId);
        }
      });

      let videoBackdrop;
      let backdrop;
      let isVideo = false;
      let trailerUrl = null;

      const onlyLocal = MediaBarEnhancedSettingsManager.getSetting('onlyLocalTrailers', CONFIG.onlyLocalTrailers);

      // Client Setting Overrides
      const enableVideo = MediaBarEnhancedSettingsManager.getSetting('videoBackdrops', CONFIG.enableVideoBackdrop);
      const showTrailerBtnCheck = MediaBarEnhancedSettingsManager.getSetting('trailerButton', CONFIG.showTrailerButton);
      const isRandomBackdrop = MediaBarEnhancedSettingsManager.getSetting('randomizeBackdrops', CONFIG.randomizeBackdrops);

      let totalBackdrops = 0;
      if (item.BackdropImageTags && Array.isArray(item.BackdropImageTags) && item.BackdropImageTags.length > 0) {
        totalBackdrops = item.BackdropImageTags.length;
      } else if (item.ParentBackdropImageTags && Array.isArray(item.ParentBackdropImageTags) && item.ParentBackdropImageTags.length > 0) {
        totalBackdrops = item.ParentBackdropImageTags.length;
      }

      let backdropIndex = 0;
      if (isRandomBackdrop && totalBackdrops > 1) {
        backdropIndex = Math.floor(Math.random() * totalBackdrops);
      }
      item._selectedBackdropIndex = backdropIndex;
      slide.dataset.backdropIndex = backdropIndex;
      const needsTrailerUrl = enableVideo || showTrailerBtnCheck;

      // 1. Check for Remote/Local Trailers (skip entirely if neither video backdrops
      // nor the trailer button are enabled, nothing would ever use trailerUrl)
      // Priority: Custom Config URL > (PreferLocal -> Local) > Metadata RemoteTrailer
      if (needsTrailerUrl) {
        const videoId = MediaBarEnhancedSettingsManager.getPublishedPreference("trailers", "publishedTrailers", {})[itemId];
        if (/^[a-f\d]{32}$/i.test(videoId || "")) {
          trailerUrl = {
            id: videoId,
            url: `${STATE.jellyfinData.serverAddress}/Videos/${videoId}/stream.mp4?api_key=${STATE.jellyfinData.accessToken}&static=true`
          };
        } else if (!onlyLocal && /^[\w-]{11}$/.test(videoId || "")) {
          trailerUrl = `https://www.youtube.com/watch?v=${videoId}`;
        } else if (STATE.slideshow.customTrailerUrls && STATE.slideshow.customTrailerUrls[itemId]) {
          const customValue = STATE.slideshow.customTrailerUrls[itemId];

          // Check if the custom value is a Jellyfin Item ID (GUID)
          const guidMatch = customValue.match(/^([0-9a-f]{32})$/i);

          if (guidMatch) {
            const videoId = guidMatch[1];
            console.log("🎬 Media Bar:", `Using custom local video ID for ${itemId}: ${videoId}`);

            trailerUrl = {
              id: videoId,
              url: `${STATE.jellyfinData.serverAddress}/Videos/${videoId}/stream.mp4?api_key=${STATE.jellyfinData.accessToken}&static=true`
            };
          } else {
            // Assume it's a standard URL (YouTube, etc.)
            trailerUrl = customValue;
            console.log("🎬 Media Bar:", `Using custom trailer URL for ${itemId}: ${trailerUrl}`);
          }
        }
        // 1b. Check Theme Video if preferred (Local Backdrop)
        else if (CONFIG.preferLocalBackdrops && item.themeVideoUrl) {
          trailerUrl = item.themeVideoUrl;
          console.log("🎬 Media Bar:", `Using theme video (local backdrop) for ${itemId}: ${trailerUrl.url || trailerUrl}`);
        }
        // 1c. Check Local Trailer if preferred or restricted to only local
        else if ((CONFIG.preferLocalTrailers || onlyLocal) && item.localTrailerUrl) {
          trailerUrl = item.localTrailerUrl;
          console.log("🎬 Media Bar:", `Using local trailer for ${itemId}: ${trailerUrl.url || trailerUrl}`);
        }
        // 1d. Fallback to Remote Trailer (only if not restricted to only local)
        else if (!onlyLocal && item.RemoteTrailers && item.RemoteTrailers.length > 0) {
          trailerUrl = ApiUtils.selectBestRemoteTrailer(item.RemoteTrailers);
          console.log("🎬 Media Bar:", `Using remote trailer for ${itemId}: ${trailerUrl}`);
        }
        // 1e. Final Fallback to Local Trailer (even if not preferred)
        else if (item.localTrailerUrl) {
          trailerUrl = item.localTrailerUrl;
          console.log("🎬 Media Bar:", `Using local trailer fallback for ${itemId}: ${trailerUrl.url || trailerUrl}`);
        }
      }

      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      const enableMobileVideo = MediaBarEnhancedSettingsManager.getSetting('mobileVideo', CONFIG.enableMobileVideo);

      const rawTrailerLibs = (CONFIG.trailerEnabledLibraries || '').trim();
      const trailerEnabledLibraryIds = rawTrailerLibs
        .split(',')
        .map(id => id.trim())
        .filter(id => id);

      const libraryAllowsTrailer = rawTrailerLibs === ''
        ? true
        : rawTrailerLibs.toLowerCase() === 'none'
          ? false
          : (!!item.MediaBarLibraryId && trailerEnabledLibraryIds.includes(item.MediaBarLibraryId));

      const safeFraming = MediaBarEnhancedSettingsManager.getSetting("safeTrailerFraming", CONFIG.safeTrailerFraming);
      slide.classList.toggle("marquee-compact-trailer", MediaBarEnhancedSettingsManager.getSetting("compactTrailerDetails", CONFIG.compactTrailerDetails));
      slide.classList.toggle("marquee-trailer-studio-color", !CONFIG.keepStudioLogosMonochrome && MediaBarEnhancedSettingsManager.getSetting("studioColorDuringTrailers", CONFIG.studioColorDuringTrailers));
      const splitTrailer = MediaBarEnhancedSettingsManager.getSetting("splitScreenTrailer", CONFIG.enableSplitScreenTrailer);
      const forceYouTubeInset = MediaBarEnhancedSettingsManager.getSetting("youtubeInset", CONFIG.youtubeInset);
      const youtubeId = ApiUtils.extractYouTubeId(trailerUrl);
      if (youtubeId) SlideUtils.applyTrailerStudioLogoSettings(slide, youtubeId);
      const rememberedInset = youtubeId && MediaBarEnhancedSettingsManager.readPersonal("youtubeLowQuality", []).includes(youtubeId);
      const youtubeInset = !!youtubeId && (forceYouTubeInset || (safeFraming && (!splitTrailer || rememberedInset)));
      const editorialTrailer = isEditorialTrailerEnabled();
      const fullWidthVideo = CONFIG.fullWidthVideo && !youtubeInset && !editorialTrailer && !(youtubeId && splitTrailer);
      if (editorialTrailer) {
        slide.classList.add("media-bar-editorial-trailer");
        if (splitTrailer) slide.classList.add("marquee-split-trailer");
        if (splitTrailer && MediaBarEnhancedSettingsManager.getSetting("edgeTrailer", CONFIG.edgeTrailer)) slide.classList.add("marquee-edge-trailer");
      }
      if (youtubeInset) slide.classList.add("media-bar-youtube-inset");

      const shouldPlayVideo = enableVideo && libraryAllowsTrailer && (!isMobile || enableMobileVideo) && !(MediaBarEnhancedSettingsManager.getSetting('pauseOnExternalPlayback', CONFIG.pauseOnExternalPlayback) && VisibilityObserver.checkRemotePlaybackActive());

      if (trailerUrl && shouldPlayVideo) {
        STATE.slideshow.hasTrailer = STATE.slideshow.hasTrailer || {};
        STATE.slideshow.hasTrailer[itemId] = true;
        let videoId = ApiUtils.extractYouTubeId(trailerUrl);
        let isYoutube = !!videoId;

        const limitVideos = isLowPowerDevice() || isIOSDevice();
        const itemIndex = STATE.slideshow.itemIds ? STATE.slideshow.itemIds.indexOf(itemId) : -1;
        const isActiveSlide = itemIndex !== -1 && itemIndex === STATE.slideshow.currentSlideIndex;
        // Limit YouTube iframe bulk creation on low power devices OR iOS (which kills the WebProcess on OOM)
        const shouldCreateVideo = !limitVideos || isActiveSlide;

        if (isYoutube && videoId && shouldCreateVideo) {
          const adaptiveFraming = safeFraming && !forceYouTubeInset && splitTrailer;
          const frameQuality = adaptiveFraming ? this.createYouTubeFramingController(slide, itemId, videoId) : null;
          if (frameQuality) slide.addEventListener("marquee-trailer-reset", frameQuality.reset);
          isVideo = true;
          // Create container for YouTube API
          const videoClass = fullWidthVideo ? "video-backdrop-full" : "video-backdrop-default";

          // Create a wrapper for opacity transition
          videoBackdrop = SlideUtils.createElement("div", {
            className: `backdrop video-backdrop ${videoClass}`,
            style: "opacity: 0; transition: opacity 1.2s ease-in-out;" // Start interrupted/transparent
          });

          // Create an iframe upfront
          const ytPlayerIframe = SlideUtils.createElement("iframe", {
            id: `youtube-player-${itemId}`,
            src: `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&controls=0&disablekb=1&fs=0&playsinline=1&iv_load_policy=3&rel=0&origin=${encodeURIComponent(window.location.origin)}`,
            style: "width: 100%; height: 100%; border: none; pointer-events: none;",
            allow: "autoplay; encrypted-media",
            referrerpolicy: "strict-origin-when-cross-origin",
            allowfullscreen: "true"
          });

          videoBackdrop.dataset.marqueeTrailerId = videoId;
          const layer = SlideUtils.createElement("div", { className: "marquee-trailer-crop-layer" });
          layer.appendChild(ytPlayerIframe);
          videoBackdrop.appendChild(layer);
          SlideUtils.applyTrailerCrop(videoBackdrop);

          // Load YouTube API and fetch SponsorBlock data concurrently
          Promise.all([
            SlideUtils.loadYouTubeIframeAPI(),
            ApiUtils.fetchSponsorBlockData(videoId)
          ]).then(([yt, segments]) => {
            if (!yt || !yt.Player) {
              console.warn("🎬 Media Bar:", "YouTube API not available, skipping player initialization");
              return;
            }
            const playerVars = {
              autoplay: 0,
              mute: STATE.slideshow.isMuted ? 1 : 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              rel: 0,
              loop: 0,
              playsinline: 1,
              origin: window.location.origin,
              enablejsapi: 1
            };

            // Apply SponsorBlock start/end times
            if (segments.startTime > 0) {
              playerVars.start = Math.ceil(segments.startTime);
              console.info("🎬 Media Bar:", `SponsorBlock start skip calculated for video ${videoId}: starting at ${playerVars.start}s`);
            }

            // Skip the configured intro offset, unless SponsorBlock already skips further
            const startOffset = getTrailerStartOffsetSeconds();
            if (startOffset > 0 && Math.ceil(startOffset) > (playerVars.start || 0)) {
              playerVars.start = Math.ceil(startOffset);
              console.info("🎬 Media Bar:", `Trailer start offset applied for video ${videoId}: starting at ${playerVars.start}s`);
            }
            if (segments.endTime) {
              playerVars.end = Math.floor(segments.endTime);
              console.info("🎬 Media Bar:", `SponsorBlock end skip calculated for video ${videoId}: ending at ${playerVars.end}s`);
            }

            STATE.slideshow.videoPlayers[itemId] = new YT.Player(ytPlayerIframe, {
              playerVars: playerVars,
              events: {
                'onReady': (event) => {
                  const duration = event.target.getDuration();
                  let endTime = playerVars.end || undefined;

                  if (duration > 0) {
                    endTime = ApiUtils.getSponsorBlockTrailerEnd(segments.segments, duration, playerVars.start || 0) ?? undefined;
                  }

                  const endOffset = getTrailerEndOffsetSeconds();
                  if (duration && endOffset > 0 && duration > endOffset) {
                    const offsetEnd = Math.floor(duration - endOffset);
                    if (endTime === undefined || offsetEnd < endTime) {
                      endTime = offsetEnd;
                      console.info("🎬 Media Bar:", `Trailer end offset applied for video ${videoId}: ending at ${endTime}s`);
                    }
                  }

                  // Store start/end time, videoId, and segments for later use
                  event.target._startTime = playerVars.start || 0;
                  event.target._endTime = endTime;
                  event.target._videoId = videoId;
                  event.target._sponsorSegments = segments.segments || [];

                  // Store reference to wrapper for fading
                  event.target._wrapperDiv = videoBackdrop;

                  if (STATE.slideshow.isMuted) {
                    event.target.mute();
                  } else {
                    event.target.unMute();
                    event.target.setVolume(getEffectiveTrailerVolume());
                  }

                  try {
                    if (typeof event.target.unloadModule === 'function') {
                      event.target.unloadModule("captions");
                      event.target.unloadModule("cc");
                    }
                  } catch (e) { }

                  const slide = document.querySelector(`.slide[data-item-id="${itemId}"]`);
                  const isVideoPlayerOpen = document.querySelector('.videoPlayerContainer') || document.querySelector('.youtubePlayerContainer');

                  if (slide && slide.classList.contains('active') && STATE.slideshow.playSignals[itemId] === true && !document.hidden && (!isVideoPlayerOpen || isVideoPlayerOpen.classList.contains('hide'))) {
                    if (typeof event.target.loadVideoById === 'function') {
                      const loadObj = {
                        videoId: videoId,
                        startSeconds: pickRandomTrailerStartSeconds(event.target._startTime || 0, event.target._endTime, true, itemId)
                      };
                      if (endTime !== undefined && endTime > 0) loadObj.endSeconds = endTime;
                      event.target.loadVideoById(loadObj);
                    } else {
                      event.target.playVideo();
                    }
                    const timeoutId = setTimeout(() => {
                      const isVideoPlayerOpenNow = document.querySelector('.videoPlayerContainer') || document.querySelector('.youtubePlayerContainer');
                      if (document.hidden || (isVideoPlayerOpenNow && !isVideoPlayerOpenNow.classList.contains('hide')) || !slide.classList.contains('active')) {
                        try {
                          event.target.stopVideo();
                        } catch (e) { }
                        return;
                      }

                      if (event.target.getPlayerState() !== YT.PlayerState.PLAYING &&
                        event.target.getPlayerState() !== YT.PlayerState.BUFFERING) {
                        console.warn("🎬 Media Bar:", `Autoplay blocked for ${itemId}, attempting muted fallback`);
                        event.target.mute();
                        if (typeof event.target.loadVideoById === 'function') {
                          const loadObj = {
                            videoId: videoId,
                            startSeconds: pickRandomTrailerStartSeconds(event.target._startTime || 0, event.target._endTime, true, itemId)
                          };
                          if (endTime !== undefined && endTime > 0) loadObj.endSeconds = endTime;
                          event.target.loadVideoById(loadObj);
                        } else {
                          event.target.playVideo();
                        }
                      }
                    }, 2000);

                    if (!STATE.slideshow.autoplayTimeouts) STATE.slideshow.autoplayTimeouts = [];
                    STATE.slideshow.autoplayTimeouts.push(timeoutId);
                  }
                },
                'onPlaybackQualityChange': (event) => frameQuality?.report(event.data),
                'onStateChange': (event) => {
                  frameQuality?.setPlaying(event.data === YT.PlayerState.PLAYING);
                  if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.UNSTARTED) frameQuality?.reset();
                  const slide = document.querySelector(`.slide[data-item-id="${itemId}"]`);
                  const isActive = slide && slide.classList.contains('active');

                  if (event.data === YT.PlayerState.PLAYING) {
                    const playAllowed = STATE.slideshow.playSignals[itemId] === true;

                    if (!isActive) {
                      if (event.target._wrapperDiv) {
                        event.target._wrapperDiv.style.transition = "none";
                        event.target._wrapperDiv.style.opacity = "0";
                      }
                      if (typeof event.target.stopVideo === 'function') event.target.stopVideo();
                      return;
                    }

                    if (!playAllowed || STATE.slideshow.isPaused || STATE.slideshow.isSuspended || document.hidden) {
                      // Active slide but play signal not yet issued
                      event.target.pauseVideo();
                      return;
                    }

                    try {
                      if (typeof event.target.unloadModule === 'function') {
                        event.target.unloadModule("captions");
                        event.target.unloadModule("cc");
                      }
                    } catch (e) { }

                    // Fade in when legitimately playing
                    if (event.target._wrapperDiv) {
                      event.target._wrapperDiv.style.transition = "opacity 1.2s ease-in-out";
                      event.target._wrapperDiv.style.opacity = "1";
                    }
                    if (slide) slide.classList.add('with-video');
                    STATE.slideshow.isVideoPlaying = true;
                    if (slide?.closest("#slides-container")?.matches(":hover")) onMediaBarHoverAudioEnter();
                    if (getEffectiveWaitForTrailer() && STATE.slideshow.slideInterval) {
                      STATE.slideshow.slideInterval.stop();
                    }

                    const dur = typeof event.target.getDuration === 'function' ? event.target.getDuration() : 0;
                    if (dur > 5 && getEffectiveRandomTrailerStart() && isActive) {
                      if (!event.target._endTime) {
                        const endOffset = getTrailerEndOffsetSeconds();
                        event.target._endTime = (endOffset > 0 && dur > endOffset) ? (dur - endOffset) : dur;
                      }
                      if (!event.target._hasSeekedRandomStart) {
                        event.target._hasSeekedRandomStart = true;
                        const targetStart = pickRandomTrailerStartSeconds(event.target._startTime || 0, event.target._endTime, false, itemId);
                        if (targetStart > 2 && Math.abs((event.target.getCurrentTime() || 0) - targetStart) > 4) {
                          console.log("🎬 Media Bar:", `Seeking YouTube trailer ${itemId} to random start position: ${targetStart.toFixed(1)}s (duration: ${dur.toFixed(1)}s)`);
                          try {
                            event.target.seekTo(targetStart, true);
                          } catch (e) { }
                        }
                      }
                    }

                    // Start progress tracking loop for active YouTube trailer
                    if (typeof SlideshowManager !== 'undefined') {
                      SlideshowManager.startYouTubeProgressLoop(event.target);
                    }
                  } else if (event.data === YT.PlayerState.ENDED) {
                    if (slide) slide.classList.remove('with-video');
                    if (isActive) {
                      STATE.slideshow.isVideoPlaying = false;
                      if (typeof SlideshowManager !== 'undefined') {
                        SlideshowManager.stopYouTubeProgressLoop();
                      }
                      if (SlideshowManager.returnToKeyArt(slide, event.target._wrapperDiv, itemId)) return;
                      if (event.target._wrapperDiv) {
                        event.target._wrapperDiv.style.transition = "none";
                        event.target._wrapperDiv.style.opacity = "0";
                      }
                      if (STATE.slideshow.slideInterval) {
                        STATE.slideshow.slideInterval.next();
                      } else if (typeof SlideshowManager !== 'undefined' && SlideshowManager.nextSlide) {
                        SlideshowManager.nextSlide();
                      }
                    }
                  } else {
                    if (isActive && STATE.slideshow.editingTrailer && event.data === YT.PlayerState.PAUSED) {
                      STATE.slideshow.isVideoPlaying = false;
                      SlideshowManager.stopYouTubeProgressLoop();
                      return;
                    }
                    if (slide && event.data !== YT.PlayerState.BUFFERING) {
                      slide.classList.remove('with-video');
                    }
                    if (isActive) {
                      STATE.slideshow.isVideoPlaying = false;
                      if (typeof SlideshowManager !== 'undefined') {
                        SlideshowManager.stopYouTubeProgressLoop();
                      }
                      if (event.target._wrapperDiv) {
                        event.target._wrapperDiv.style.transition = "opacity 0.5s ease-in-out";
                        event.target._wrapperDiv.style.opacity = "0";
                      }
                    }
                  }
                },
                'onError': (event) => {
                  console.warn("🎬 Media Bar:", `YouTube player error ${event.data} for video ${videoId}`);
                  const slide = document.querySelector(`.slide[data-item-id="${itemId}"]`);
                  const isActive = slide && slide.classList.contains('active');
                  if (isActive) {
                    STATE.slideshow.isVideoPlaying = false;
                    // Fallback to normal slideshow interval on error
                    if (STATE.slideshow.slideInterval && !STATE.slideshow.isPaused) {
                      STATE.slideshow.slideInterval.start();
                    }
                  }
                }
              }
            });
          });

          // 2. Check for local video trailers in MediaSources if yt is not available
        } else if (!isYoutube && shouldCreateVideo) {
          isVideo = true;

          const videoSrc = (typeof trailerUrl === 'object' ? trailerUrl.url : trailerUrl);
          const videoClass = fullWidthVideo ? "video-backdrop-full" : "video-backdrop-default";
          const videoAttributes = {
            className: `backdrop video-backdrop ${videoClass}`,
            preload: "none",
            disablePictureInPicture: true,
            controlsList: "nodownload noplaybackrate nopip",
            "data-src": videoSrc,
            style: "pointer-events: none; opacity: 0; transition: opacity 1.2s ease-in-out;"
          };

          videoAttributes.muted = "";
          videoAttributes.playsinline = "";

          videoBackdrop = SlideUtils.createElement("video", videoAttributes);
          videoBackdrop.disablePictureInPicture = true;
          videoBackdrop.setAttribute('disablepictureinpicture', '');
          if (MediaBarEnhancedSettingsManager.getSetting("fillTrailerHeight", CONFIG.fillTrailerHeight)) videoBackdrop.classList.add("marquee-fill-height");
          videoBackdrop.setAttribute('controlsList', 'nodownload noplaybackrate nopip');
          videoBackdrop.volume = getEffectiveTrailerVolume() / 100;

          STATE.slideshow.videoPlayers[itemId] = videoBackdrop;

          const localId = SlideUtils.getLocalTrailerId(trailerUrl);
          SlideUtils.applyTrailerStudioLogoSettings(slide, localId);
          if (localId) {
            videoBackdrop.dataset.marqueeTrailerId = localId;
            SlideUtils.applyTrailerCrop(videoBackdrop);
          }
          if (SlideUtils.getConfiguredTrailerCrop(localId) === undefined &&
              editorialTrailer && MediaBarEnhancedSettingsManager.getSetting("cropLocalTrailers", CONFIG.cropLocalTrailers)) {
            SlideUtils.watchLocalLetterbox(videoBackdrop);
          }

          if (safeFraming) {
            slide.classList.add("marquee-safe-inset");
            videoBackdrop.addEventListener("loadedmetadata", () => {
              slide.classList.toggle("marquee-safe-inset", videoBackdrop.videoHeight < 720);
            });
          }
          const showVideoPlayback = (video) => {
            const slide = document.querySelector(`.slide[data-item-id="${itemId}"]`);
            if (!slide || !slide.classList.contains('active')) return;
            if (STATE.slideshow.playSignals && STATE.slideshow.playSignals[itemId] === false) return;

            video.style.transition = "opacity 1.2s ease-in-out";
            video.style.opacity = "1";
            slide.classList.add('with-video');
            STATE.slideshow.isVideoPlaying = true;

            if (getEffectiveWaitForTrailer() && STATE.slideshow.slideInterval) {
              STATE.slideshow.slideInterval.stop();
            }
          };

          videoBackdrop.addEventListener('play', (event) => {
            const slide = document.querySelector(`.slide[data-item-id="${itemId}"]`);
            if (!slide || !slide.classList.contains('active')) {
              console.log("🎬 Media Bar:", `Local video ${itemId} started playing but slide is not active, pausing.`);
              event.target.pause();
              try {
                if (event.target.currentTime > 0) {
                  event.target.currentTime = 0;
                }
              } catch (e) { }
              return;
            }

            if (STATE.slideshow.playSignals && STATE.slideshow.playSignals[itemId] === false) {
              event.target.pause();
              return;
            }

            showVideoPlayback(event.target);
          });

          videoBackdrop.addEventListener('playing', (event) => {
            showVideoPlayback(event.target);
            if (videoBackdrop.closest('#slides-container')?.matches(':hover')) onMediaBarHoverAudioEnter();
          });

          videoBackdrop.addEventListener('ended', (event) => {
            const slide = event.target.closest('.slide');
            if (slide) slide.classList.remove('with-video');
            if (slide && slide.classList.contains('active')) {
              STATE.slideshow.isVideoPlaying = false;
              if (SlideshowManager.returnToKeyArt(slide, event.target, itemId)) return;
              if (STATE.slideshow.slideInterval) {
                STATE.slideshow.slideInterval.next();
              } else {
                SlideshowManager.nextSlide();
              }
            }
          });

          videoBackdrop.addEventListener('pause', (event) => {
            const slide = event.target.closest('.slide');
            if (slide && event.target.currentTime === 0) {
              slide.classList.remove('with-video');
            }
            if (slide && slide.classList.contains('active')) {
              STATE.slideshow.isVideoPlaying = false;
            }
          });

          videoBackdrop.addEventListener('timeupdate', (event) => {
            const video = event.target;
            const slide = video.closest('.slide');
            if (!slide || !slide.classList.contains('active')) return;

            // Ensure video backdrop is visible if actively playing
            if (!video.paused && video.currentTime > 0 && video.style.opacity !== "1") {
              showVideoPlayback(video);
            }

            if (!getEffectiveWaitForTrailer()) return;

            if (video.duration && video.duration > 0) {
              const startOffset = video._startOffset || 0;
              const endOffset = getTrailerEndOffsetSeconds();
              const effectiveEnd = (endOffset > 0 && video.duration > endOffset) ? (video.duration - endOffset) : video.duration;

              if (video.currentTime >= effectiveEnd - 0.25) {
                video.pause();
                STATE.slideshow.isVideoPlaying = false;
                if (SlideshowManager.returnToKeyArt(slide, video, itemId)) return;
                if (!STATE.slideshow.isPaused && STATE.slideshow.slideInterval) {
                  STATE.slideshow.slideInterval.next();
                } else if (!STATE.slideshow.isPaused && typeof SlideshowManager !== 'undefined' && SlideshowManager.nextSlide) {
                  SlideshowManager.nextSlide();
                }
                return;
              }

              const playableDuration = Math.max(0.1, effectiveEnd - startOffset);
              const elapsed = Math.max(0, video.currentTime - startOffset);
              const progress = Math.max(0, Math.min(1, elapsed / playableDuration));
              const fill = document.querySelector('.media-bar-progress-fill');
              if (fill) {
                const bar = fill.closest('.media-bar-progress-bar');
                if (bar) {
                  bar.classList.remove('animating');
                  fill.style.animation = 'none';
                  const isReverse = bar.classList.contains('reverse-progress');
                  const displayProgress = isReverse ? (1 - progress) : progress;
                  fill.style.transform = `scaleX(${displayProgress})`;
                }
              }
            }
          });

          videoBackdrop.addEventListener('error', (event) => {
            console.warn("🎬 Media Bar:", `Local video error for item ${itemId}`);
            STATE.slideshow.isVideoPlaying = false;
            const slide = event.target.closest('.slide');
            if (slide && slide.classList.contains('active')) {
              // Re-enable normal slideshow timing if video fails
              if (STATE.slideshow.slideInterval && !STATE.slideshow.isPaused) {
                STATE.slideshow.slideInterval.start();
              }
            }
          });
        }
      }

      // Always create a static backdrop image (to show while video loads or if no video)
      backdrop = SlideUtils.createElement("img", {
        className: "backdrop high-quality",
        src: this.buildImageUrl(item, "Backdrop", backdropIndex, serverAddress, 60),
        alt: LocalizationUtils.getLocalizedString('Backdrop', 'Backdrop'),
        loading: "eager",
      });

      // If video, static backdrop should be strictly a background (no animation)
      if (isVideo) {
        backdrop.style.animation = "none";
        backdrop.style.transition = "none";
      }

      const backdropOverlay = SlideUtils.createElement("div", {
        className: "backdrop-overlay",
      });

      const backdropContainer = SlideUtils.createElement("div", {
        className: "backdrop-container" + (isVideo && fullWidthVideo ? " full-width-video" : ""),
      });

      backdropContainer.append(backdrop, backdropOverlay);

      // If video exists, append on top of static backdrop
      if (isVideo && videoBackdrop) {
        backdropContainer.appendChild(videoBackdrop);
      }

      const hasLogo = !!(
        (item.ImageTags && item.ImageTags.Logo) ||
        item.ParentLogoImageTag
      );

      const detailsPath = this.getDetailsPath(itemId);
      const logoContainer = SlideUtils.createElement("a", {
        className: "logo-container media-bar-logo-link",
        href: `#${detailsPath}`,
        tabIndex: -1,
        "aria-label": item.Name,
        onclick: (e) => {
          if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          e.stopPropagation();
          this.openDetails(itemId);
        },
      });

      // Helper to create the title fallback only when needed (optimization)
      const createTitleFallback = () => {
        let titleText = item.Name || "";
        if ((item.Type === "Season" || item.Type === "Episode") && item.SeriesName) {
          titleText = `${item.SeriesName} - ${item.Name}`;
        }
        // Break the title into a new line after a colon or hyphen/dash if followed by a space
        let formattedTitle = titleText
          .replace(/:\s+/g, ':<br>')
          .replace(/\s+-\s+/g, ' -<br>')
          .replace(/\s+–\s+/g, ' –<br>');

        let fallbackFontSize = "3rem";
        if (titleText.length <= 12) {
          fallbackFontSize = "6rem";
        } else if (titleText.length <= 25) {
          fallbackFontSize = "4rem";
        } else if (titleText.length >= 45) {
          fallbackFontSize = "2.5rem";
        }

        return SlideUtils.createElement("div", {
          className: "logo-title-fallback",
          style: `font-size: ${fallbackFontSize};`,
          innerHTML: formattedTitle
        });
      };

      if (hasLogo) {
        const logo = SlideUtils.createElement("img", {
          className: "logo high-quality",
          src: this.buildImageUrl(item, "Logo", undefined, serverAddress, 40),
          alt: item.Name,
          loading: "eager",
          draggable: "false",
        });
        logo.onerror = () => {
          logo.remove();
          logoContainer.appendChild(createTitleFallback());
        };
        logoContainer.appendChild(logo);
      } else {
        logoContainer.appendChild(createTitleFallback());
      }

      const featuredContent = SlideUtils.createElement(
        "div",
        {
          className: "featured-content",
        },
        title
      );

      let plot = SlideUtils.summarizeOverview(
        item.Overview,
        Math.min(CONFIG.maxPlotLength, 210),
        document.documentElement.lang || navigator.language
      );
      if (plot && item.Type === "Season" && item.IndexNumber != null) {
        const prefix = LocalizationUtils.getCustomLocalizedString('seasonPrefix', 'Season {0}: ', item.IndexNumber);
        plot = prefix + plot;
      } else if (plot && item.Type === "Episode") {
        if (item.ParentIndexNumber != null && item.IndexNumber != null) {
          const prefix = LocalizationUtils.getCustomLocalizedString('seasonEpisodePrefix', 'Season {0}, Episode {1}: ', item.ParentIndexNumber, item.IndexNumber);
          plot = prefix + plot;
        } else if (item.IndexNumber != null) {
          const prefix = LocalizationUtils.getCustomLocalizedString('episodePrefix', 'Episode {0}: ', item.IndexNumber);
          plot = prefix + plot;
        }
      }

      const gradientOverlay = SlideUtils.createElement("div", {
        className: "gradient-overlay" + (isVideo && fullWidthVideo ? " full-width-video" : ""),
      });

      const editorial = SlideUtils.createElement("div", { className: "media-bar-editorial" });
      const branding = SlideUtils.createElement("div", { className: "marquee-title-branding" });
      branding.appendChild(logoContainer);
      const studios = this.createStudioLogos(item);
      if (studios) {
        const studioRow = SlideUtils.createElement("div", { className: "marquee-studio-row" });
        studioRow.appendChild(studios);
        branding.appendChild(studioRow);
      }
      editorial.appendChild(branding);

      const metadata = this.createEditorialMetadata(item);
      if (metadata.childElementCount) {
        const infoContainer = SlideUtils.createElement("div", { className: "info-container" });
        infoContainer.appendChild(metadata);
        editorial.appendChild(infoContainer);
      }

      if (plot) {
        const plotContainer = SlideUtils.createElement("div", {
          className: "plot-container" + (CONFIG.constrainPlotWidth ? " constrained-plot" : ""),
        });
        plotContainer.appendChild(SlideUtils.createElement("div", { className: "plot" }, plot));
        editorial.appendChild(plotContainer);
      }

      slide.append(backdropContainer, gradientOverlay, featuredContent, editorial);

      if (!MediaBarEnhancedSettingsManager.getSetting('hideSlideActionButtons', CONFIG.hideSlideActionButtons)) {
        const buttonContainer = SlideUtils.createElement("div", { className: "button-container" });
        buttonContainer.append(this.createDetailButton(itemId), this.createPlayButton(itemId));
        if (trailerUrl && !isVideo && showTrailerBtnCheck) {
          buttonContainer.appendChild(this.createTrailerButton(trailerUrl));
        }
        buttonContainer.appendChild(this.createFavoriteButton(item));
        editorial.appendChild(buttonContainer);
      }

      return slide;
    },

    createYouTubeFramingController(slide, itemId, videoId) {
      const lowLevels = new Set(["small", "medium", "large"]);
      const settings = MediaBarEnhancedSettingsManager;
      const inset = "media-bar-youtube-inset";
      let low = false;
      let playing = false;
      let timer;
      const cancel = () => {
        clearTimeout(timer);
        timer = undefined;
      };
      const eligible = () => playing && low && !document.hidden && slide.isConnected &&
        slide.classList.contains("active") && STATE.slideshow.playSignals[itemId] === true;
      const consider = () => {
        if (!eligible() || slide.classList.contains(inset)) return cancel();
        if (timer !== undefined) return;
        timer = setTimeout(() => {
          cancel();
          if (!eligible()) return;
          slide.classList.add(inset);
          try {
            const saved = settings.readPersonal("youtubeLowQuality", []);
            settings.writePersonal("youtubeLowQuality", [videoId, ...saved.filter(id => id !== videoId)].slice(0, 250));
          } catch { /* The current slide still uses the inset. */ }
        }, 4500);
      };
      return {
        report(value) {
          if (!slide.classList.contains("active")) return;
          low = lowLevels.has(value);
          consider();
        },
        setPlaying(value) {
          playing = value;
          consider();
        },
        reset() {
          cancel();
          playing = false;
          low = false;
        },
      };
    },

    createReviewSummary(item) {
      const audience = item.CommunityRating;
      const critics = item.CriticRating;
      const hasAudience = Number.isFinite(audience) && audience >= 0 && audience <= 10;
      const hasCritics = Number.isFinite(critics) && critics >= 0 && critics <= 100;
      const imdb = (item.ReviewProviderIds || item.ProviderIds)?.Imdb;
      if (!hasAudience && !hasCritics && !imdb) return null;

      const wrapper = SlideUtils.createElement("div", { className: "media-bar-reviews" });
      const details = SlideUtils.createElement("details");
      const summary = SlideUtils.createElement("summary", { tabIndex: "-1" });
      details.appendChild(summary);
      const panel = SlideUtils.createElement("div", { className: "media-bar-review-panel" });
      panel.appendChild(SlideUtils.createElement("strong", {}, "Reception"));
      const scoreText = value => value.toFixed(1) + "/10";
      if (hasAudience) panel.appendChild(SlideUtils.createElement("div", {}, "Jellyfin audience " + scoreText(audience)));
      const criticText = "Critics " + Math.round(critics) + "%";
      if (hasCritics) panel.appendChild(SlideUtils.createElement("div", {}, criticText + " approval · Jellyfin"));

      const render = trakt => {
        const hasTrakt = Number.isFinite(trakt) && trakt >= 0 && trakt <= 10;
        const score = hasAudience && hasTrakt ? (audience + trakt) / 2 : hasAudience ? audience : trakt;
        summary.textContent = Number.isFinite(score) ? "Audience " + scoreText(score) : hasCritics ? criticText : "Reception";
        summary.style.setProperty("--marquee-score", (Number.isFinite(score) ? score * 10 : hasCritics ? critics : 0) + "%");
      };
      render();
      if (imdb) {
        let started = false;
        wrapper.addEventListener("marquee-review-activate", async () => {
          if (started) return;
          started = true;
          const query = new URLSearchParams({ type: item.Type === "Movie" ? "movie" : "tv", imdb });
          try {
            const response = await fetch(`${STATE.jellyfinData.serverAddress}/MediaBarEnhanced/Reviews?${query}`, { headers: ApiUtils.getAuthHeaders() });
            if (!response.ok) throw Error("Score request failed");
            const { trakt } = await response.json();
            if (Number.isFinite(trakt) && trakt >= 0 && trakt <= 10) {
              render(trakt);
              panel.appendChild(SlideUtils.createElement("div", {}, "Trakt audience " + scoreText(trakt)));
              if (hasAudience) panel.appendChild(SlideUtils.createElement("small", {}, "Audience score is the average of Jellyfin and Trakt."));
            } else if (!hasAudience && !hasCritics) {
              wrapper.hidden = true;
            }
          } catch {
            started = false;
          }
        });
      }
      wrapper.append(details, panel);
      return wrapper;
    },

    createEditorialMetadata(item) {
      const metadata = SlideUtils.createElement("div", { className: "misc-info editorial-metadata" });
      const append = (text, className = "") => {
        metadata.appendChild(SlideUtils.createElement("span", { className }, String(text)));
      };

      const year = item.ProductionYear || Number(item.PremiereDate?.slice(0, 4));
      if (year > 0) append(year);

      if (Array.isArray(item.Genres) && item.Genres.length) {
        append(item.Genres.slice(0, 2).join(" / "), "editorial-genres");
      }

      const childCount = item.ChildCount ?? item.RecursiveItemCount;
      if (childCount != null && ["Season", "Series", "BoxSet", "Playlist"].includes(item.Type)) {
        if (item.Type === "Season") {
          const episodeText = childCount <= 1
            ? (LocalizationUtils.getCustomLocalizedString('episodeLabel', null) || LocalizationUtils.getLocalizedString('Episode', 'Episode'))
            : (LocalizationUtils.getCustomLocalizedString('episodesLabel', null) || LocalizationUtils.getLocalizedString('TypeOptionPluralEpisode', LocalizationUtils.getLocalizedString('Episodes', 'Episodes')));
          append(`${childCount} ${episodeText}`);
        } else if (item.Type === "Series") {
          const seasonText = childCount <= 1
            ? (LocalizationUtils.getCustomLocalizedString('seasonLabel', null) || LocalizationUtils.getLocalizedString('Season', 'Season'))
            : (LocalizationUtils.getCustomLocalizedString('seasonsLabel', null) || LocalizationUtils.getLocalizedString('TypeOptionPluralSeason', LocalizationUtils.getLocalizedString('Seasons', 'Seasons')));
          append(`${childCount} ${seasonText}`);
        } else if (item.Type === "BoxSet" || item.Type === "Playlist") {
          const itemText = childCount <= 1
            ? LocalizationUtils.getLocalizedString('Item', 'Item')
            : LocalizationUtils.getLocalizedString('HeaderItems', LocalizationUtils.getLocalizedString('Items', 'Items'));
          append(`${childCount} ${itemText}`);
        }
      } else if (item.RunTimeTicks > 0) {
        const runtime = Math.round(item.RunTimeTicks / 600000000);
        append(new Intl.NumberFormat(document.documentElement.lang || undefined, {
          style: "unit", unit: "minute", unitDisplay: "short",
        }).format(runtime));
      }

      if (item.OfficialRating) append(item.OfficialRating);
      if (MediaBarEnhancedSettingsManager.getSetting("showReviewScores", CONFIG.showReviewScores)) {
        const reviews = this.createReviewSummary(item);
        if (reviews) metadata.appendChild(reviews);
      }
      return metadata;
    },

    createStudioLogos(item) {
      if (item.Studios?.length && CONFIG.showProviderLogo) {
        const studios = SlideUtils.createElement("div", { className: "media-bar-studio-logos", "aria-label": "Studios" });
        const seen = new Set();
        for (const studio of item.Studios) {
          const id = String(studio.Id || "").replace(/-/g, "").toLowerCase();
          const key = id || studio.Name?.toLowerCase();
          if (!key || seen.has(key)) continue;
          seen.add(key);
          const name = studio.Name || "Studio";
          const canOpen = /^[a-f\d]{32}$/.test(id);
          const entry = SlideUtils.createElement(canOpen ? "a" : "span", {
            className: "media-bar-studio-entry", title: name,
            ...(canOpen ? {
              href: `#${this.getDetailsPath(id)}`,
              tabIndex: "-1",
              "aria-label": `Browse ${name}`,
              onclick: (event) => {
                if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                event.stopPropagation();
                this.openDetails(id);
              },
            } : {}),
          }, name);

          if (canOpen) {
            const server = STATE.jellyfinData.serverAddress;
            const custom = STATE.studioLogos?.[id];
            const base = `${server}/Items/${id}/Images`;
            const sources = [
              ...(custom?.hasImage ? [`${server}/MediaBarEnhanced/StudioLogos/${id}`] : []),
              base + "/Logo?maxWidth=384",
              base + "/Primary?maxWidth=384",
            ];
            const logo = SlideUtils.createElement("img", {
              className: "media-bar-provider-logo", alt: name, style: { height: `${custom?.height || 24}px` },
            });
            logo.onload = () => {
              const art = SlideUtils.createElement("span", { className: "marquee-studio-art" });
              if (custom?.monochromeInCompact) art.classList.add("marquee-studio-compact-monochrome");
              art.appendChild(logo);
              entry.replaceChildren(art);
              if (CONFIG.keepStudioLogosMonochrome || (CONFIG.grayscaleStudioLogos && !custom?.keepColor)) {
                art.classList.add("marquee-studio-grayscale");
              } else if (CONFIG.recolorStudioLogos && !custom?.keepColor && CSS.supports("mask-image", 'url("x")')) {
                art.style.setProperty("--studio-logo-mask", "url(" + JSON.stringify(logo.src) + ")");
                art.classList.add("marquee-studio-monochrome");
                try {
                  const sample = document.createElement("canvas");
                  sample.width = sample.height = 32;
                  const context = sample.getContext("2d", { willReadFrequently: true });
                  context.drawImage(logo, 0, 0, 32, 32);
                  const pixels = context.getImageData(0, 0, 32, 32).data;
                  let min = 255, max = 0;
                  for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i + 3] < 220) continue;
                    const tone = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
                    min = Math.min(min, tone);
                    max = Math.max(max, tone);
                  }
                  if (max - min > 30) art.classList.add("marquee-studio-tonal");
                } catch { /* Use a solid tint if the artwork cannot be sampled. */ }
              }
            };
            logo.onerror = () => { if (sources.length) logo.src = sources.shift(); };
            logo.src = sources.shift();
          }
          studios.appendChild(entry);
        }
        if (studios.childElementCount) return studios;
      }
      return null;
    },

    /**
     * Creates a play button for an item
     * @param {string} itemId - Item ID
     * @returns {HTMLElement} Play button element
     */
    createPlayButton(itemId) {
      const playText = LocalizationUtils.getLocalizedString('Play', 'Play');
      return SlideUtils.createElement("button", {
        className: "detailButton btnPlay play-button",
        innerHTML: `
      <span class="play-text">${playText}</span>
    `,
        tabIndex: "0",
        onclick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("🎬 Media Bar: Play button clicked for", itemId);
          ApiUtils.playItem(itemId);
        },
      });
    },

    getDetailsPath(itemId) {
      const params = new URLSearchParams({ id: itemId, serverId: STATE.jellyfinData.serverId });
      return `/details?${params}`;
    },

    openDetails(itemId) {
      const path = this.getDetailsPath(itemId);
      if (window.Emby?.Page) {
        window.Emby.Page.show(path);
      } else {
        window.location.hash = path;
      }
    },

    /**
     * Creates a detail button for an item
     * @param {string} itemId - Item ID
     * @returns {HTMLElement} Detail button element
     */
    createDetailButton(itemId) {
      return SlideUtils.createElement("button", {
        className: "detailButton detail-button",
        tabIndex: "0",
        onclick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.openDetails(itemId);
        },
      });
    },

    /**
     * Creates a favorite button for an item
     * @param {string} itemId - Item ID
     * @returns {HTMLElement} Favorite button element
     */

    createFavoriteButton(item) {
      const isFavorite = item.UserData && item.UserData.IsFavorite === true;

      const button = SlideUtils.createElement("button", {
        className: `favorite-button ${isFavorite ? "favorited" : ""}`,
        tabIndex: "0",
        onclick: async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await ApiUtils.toggleFavorite(item.Id, button);
        },
      });

      return button;
    },

    /**
     * Creates a trailer button
     * @param {string|Object} trailerInfo - Trailer URL string or object {id, url}
     * @returns {HTMLElement} Trailer button element
     */
    createTrailerButton(trailerInfo) {
      const trailerText = LocalizationUtils.getLocalizedString('Trailer', 'Trailer');

      let url = trailerInfo;
      let localTrailerId = null;

      if (typeof trailerInfo === 'object' && trailerInfo !== null) {
        url = trailerInfo.url;
        localTrailerId = trailerInfo.id;
      }

      return SlideUtils.createElement("button", {
        className: "detailButton trailer-button",
        innerHTML: `<span class="material-icons">movie</span> <span class="trailer-text">${trailerText}</span>`,
        tabIndex: "0",
        onclick: (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (localTrailerId) {
            // Play local trailer using native player
            ApiUtils.playItem(localTrailerId);
          } else {
            SlideUtils.openVideoModal(url);
          }
        },
      });
    },


    /**
     * Creates a placeholder slide for loading
     * @param {string} itemId - Item ID to load
     * @returns {HTMLElement} Placeholder slide element
     */
    createLoadingPlaceholder(itemId) {
      const placeholder = SlideUtils.createElement("a", {
        className: "slide placeholder",
        "data-item-id": itemId,
        style: {
          display: "none",
          opacity: "0",
          transition: `opacity ${CONFIG.fadeTransitionDuration}ms ease-in-out`,
        },
      });

      const loadingIndicator = SlideUtils.createLoadingIndicator();
      placeholder.appendChild(loadingIndicator);

      return placeholder;
    },

    slideCreationPromises: {},

    /**
     * Creates a slide for an item and adds it to the container
     * @param {string} itemId - Item ID
     * @param {boolean} forceRecreate - Force recreation of the slide
     * @returns {Promise<HTMLElement>} Created slide element
     */
    async createSlideForItemId(itemId, forceRecreate = false) {
      if (!itemId) return null;

      const container = SlideUtils.getOrCreateSlidesContainer();

      if (!forceRecreate) {
        if (STATE.slideshow.createdSlides[itemId]) {
          const existing = container.querySelector(`.slide[data-item-id="${itemId}"]`);
          if (existing) return existing;
        }
        const existingInDom = container.querySelector(`.slide[data-item-id="${itemId}"]`);
        if (existingInDom) {
          STATE.slideshow.createdSlides[itemId] = true;
          return existingInDom;
        }
        if (this.slideCreationPromises[itemId]) {
          return this.slideCreationPromises[itemId];
        }
      }

      const creationPromise = (async () => {
        try {
          const item = await ApiUtils.fetchItemDetails(itemId);
          if (!item) {
            console.warn("🎬 Media Bar:", `Failed to load details for item ${itemId}, skipping slide creation`);
            return null;
          }

          // Resolve the item's top-level Jellyfin library for per-library trailer rules
          item.MediaBarLibraryId = await ApiUtils.resolveItemLibraryId(item);

          // Trailer/theme-video data is only ever consumed for video backdrops or the trailer button popup
          // skip all of these lookups when both are disabled.
          const enableVideo = MediaBarEnhancedSettingsManager.getSetting('videoBackdrops', CONFIG.enableVideoBackdrop);
          const showTrailerBtn = !MediaBarEnhancedSettingsManager.getSetting('hideSlideActionButtons', CONFIG.hideSlideActionButtons) &&
            MediaBarEnhancedSettingsManager.getSetting('trailerButton', CONFIG.showTrailerButton);
          const needsTrailerData = enableVideo || showTrailerBtn;
          // Pre-fetch local trailer URL if needed
          const onlyLocal = MediaBarEnhancedSettingsManager.getSetting('onlyLocalTrailers', CONFIG.onlyLocalTrailers);
          const canHaveLocalTrailer = (item.LocalTrailerCount && item.LocalTrailerCount > 0) ||
            item.Type === 'Series' || item.Type === 'Season' || item.Type === 'Episode';
          if (needsTrailerData && (CONFIG.preferLocalTrailers || onlyLocal || canHaveLocalTrailer)) {
            item.localTrailerUrl = await ApiUtils.fetchLocalTrailer(item);
          }

          // Pre-fetch theme video URL if needed
          if (needsTrailerData && CONFIG.preferLocalBackdrops) {
            item.themeVideoUrl = await ApiUtils.fetchThemeVideos(itemId);
          }

          // Pre-fetch SponsorBlock data early for remote YouTube trailers
          if (needsTrailerData && CONFIG.useSponsorBlock && !onlyLocal && item.RemoteTrailers && item.RemoteTrailers.length > 0) {
            const ytId = ApiUtils.extractYouTubeId(item.RemoteTrailers[0].Url);
            if (ytId) {
              ApiUtils.fetchSponsorBlockData(ytId); // Trigger background pre-fetch into cache
            }
          }

          // Check again if slide was created while waiting for async fetches
          const existingSlide = container.querySelector(`.slide[data-item-id="${itemId}"]`);
          if (existingSlide && !forceRecreate) {
            STATE.slideshow.createdSlides[itemId] = true;
            return existingSlide;
          }

          const slideElement = this.createSlideElement(
            item,
            item.Type === "Movie" ? "Movie" : "TV Show"
          );

          if (existingSlide) {
            // Clean up old player if any
            if (STATE.slideshow.videoPlayers && STATE.slideshow.videoPlayers[itemId]) {
              const oldPlayer = STATE.slideshow.videoPlayers[itemId];
              try {
                if (typeof oldPlayer.destroy === 'function') oldPlayer.destroy();
                else if (oldPlayer.tagName === 'VIDEO') { oldPlayer.pause(); oldPlayer.removeAttribute('src'); oldPlayer.load(); }
              } catch (e) { }
              delete STATE.slideshow.videoPlayers[itemId];
            }
            existingSlide.replaceWith(slideElement);
          } else {
            container.appendChild(slideElement);
          }

          STATE.slideshow.createdSlides[itemId] = true;

          return slideElement;
        } catch (error) {
          console.error("🎬 Media Bar:", "Error creating slide for item:", error, itemId);
          return null;
        } finally {
          delete this.slideCreationPromises[itemId];
        }
      })();

      this.slideCreationPromises[itemId] = creationPromise;
      return creationPromise;
    },
  };

  /**
   * Manages slideshow functionality
   */
  const SlideshowManager = {
    youtubeProgressInterval: null,

    startYouTubeProgressLoop(player) {
      if (this.youtubeProgressInterval) {
        clearInterval(this.youtubeProgressInterval);
      }

      if (!getEffectiveWaitForTrailer()) {
        return;
      }

      const update = () => {
        try {
          if (!player || typeof player.getCurrentTime !== 'function' || typeof player.getDuration !== 'function') return;

          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();

          if (!duration) return;

          // Apply SponsorBlock start/end boundaries if present
          const startTime = player._startTime || 0;
          const endTime = player._endTime || duration;
          const totalDuration = endTime - startTime;

          if (totalDuration <= 0) return;

          if (endTime && currentTime >= endTime - 0.3) {
            this.stopYouTubeProgressLoop();
            if (typeof player.pauseVideo === 'function') {
              try { player.pauseVideo(); } catch (e) { }
            }
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
              STATE.slideshow.isVideoPlaying = false;
              if (player._wrapperDiv) {
                player._wrapperDiv.style.transition = "none";
                player._wrapperDiv.style.opacity = "0";
              }
              if (STATE.slideshow.slideInterval) {
                STATE.slideshow.slideInterval.next();
              } else {
                SlideshowManager.nextSlide();
              }
            }
            return;
          }

          const currentProgress = currentTime - startTime;
          const progressFraction = Math.max(0, Math.min(1, currentProgress / totalDuration));

          const fill = document.querySelector('.media-bar-progress-fill');
          if (fill) {
            const bar = fill.closest('.media-bar-progress-bar');
            if (bar) {
              bar.classList.remove('animating');
              const isReverse = bar.classList.contains('reverse-progress');
              const displayProgress = isReverse ? (1 - progressFraction) : progressFraction;
              fill.style.transform = `scaleX(${displayProgress})`;
            }
          }
        } catch (e) {
          console.error("🎬 Media Bar:", "Error in YouTube progress loop:", e);
        }
      };

      update();
      this.youtubeProgressInterval = setInterval(update, 100);
    },

    stopYouTubeProgressLoop() {
      if (this.youtubeProgressInterval) {
        clearInterval(this.youtubeProgressInterval);
        this.youtubeProgressInterval = null;
      }
    },

    createPaginationDots() {
      const showDots = MediaBarEnhancedSettingsManager.getSetting('showPaginationDots', CONFIG.showPaginationDots);
      let dotsContainer = document.querySelector(".dots-container");
      if (!showDots) {
        if (dotsContainer) dotsContainer.remove();
        return;
      }
      if (!dotsContainer) {
        dotsContainer = document.createElement("div");
        dotsContainer.className = "dots-container";
        document.getElementById("slides-container").appendChild(dotsContainer);
      } else {
        dotsContainer.innerHTML = "";
      }

      const totalItems = STATE.slideshow.totalItems || 0;

      // dynamically lower the max dots threshold on small screens
      let effectiveMaxDots = CONFIG.maxPaginationDots;
      if (window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches) {
        const availableWidth = window.innerWidth * 0.9;
        const dotWidth = 18; // approximate width per dot
        // reserve extra room when the active dot is stretched to hold the progress bar or pill style
        const showProgress = MediaBarEnhancedSettingsManager.getSetting('showProgressBar', CONFIG.showProgressBar);
        const progressInIndicator = showProgress && MediaBarEnhancedSettingsManager.getSetting('progressBarLocation', CONFIG.progressBarLocation) === 'Inside';
        const isPill = MediaBarEnhancedSettingsManager.getSetting('dotStyle', CONFIG.dotStyle) === 'Pill';
        const extraRoom = (progressInIndicator || isPill) ? 3 : 1;
        const fittingDots = Math.floor(availableWidth / dotWidth) - extraRoom;
        effectiveMaxDots = Math.min(effectiveMaxDots, fittingDots);
      }

      const forceCounter = MediaBarEnhancedSettingsManager.getSetting('forceSlideCounter', CONFIG.forceSlideCounter);

      // Switch to counter style if too many items or if forced
      if (totalItems > effectiveMaxDots || forceCounter) {
        document.body.classList.add("media-bar-has-counter");
        const slidesContainer = document.getElementById("slides-container");
        if (slidesContainer) slidesContainer.classList.add("has-counter");

        const counter = document.createElement("span");
        counter.className = "slide-counter";
        counter.id = "slide-counter";
        dotsContainer.appendChild(counter);
      } else {
        document.body.classList.remove("media-bar-has-counter");
        const slidesContainer = document.getElementById("slides-container");
        if (slidesContainer) slidesContainer.classList.remove("has-counter");

        // Create dots for all items
        for (let i = 0; i < totalItems; i++) {
          const dot = document.createElement("span");
          dot.className = "dot";
          dot.setAttribute("data-index", i);
          dotsContainer.appendChild(dot);
        }
      }

      this.updateDots();
    },

    /**
     * Updates active dot based on current slide
     * Maps current slide to one of the 5 dots
     */
    updateDots() {
      const currentIndex = STATE.slideshow.currentSlideIndex;
      const totalItems = STATE.slideshow.totalItems || 0;

      // Handle Large List Counter
      const counter = document.getElementById("slide-counter");
      if (counter) {
        let textSpan = counter.querySelector('.slide-counter-text');
        if (!textSpan) {
          textSpan = document.createElement('span');
          textSpan.className = 'slide-counter-text';
          counter.appendChild(textSpan);
        }
        textSpan.textContent = `${currentIndex + 1} / ${totalItems}`;
      } else {
        // Handle Dots
        const container = SlideUtils.getOrCreateSlidesContainer();
        const dots = container.querySelectorAll(".dot");

        // Fallback if dots exist but totalItems matched counter mode
        if (dots.length > 0) {
          dots.forEach((dot, index) => {
            if (index === currentIndex) {
              dot.classList.add("active");
            } else {
              dot.classList.remove("active");
            }
          });
        }
      }

      const dotsContainer = document.querySelector(".dots-container");
      if (dotsContainer) {
        const isProgressInside = MediaBarEnhancedSettingsManager.getSetting('showProgressBar', CONFIG.showProgressBar) &&
          (MediaBarEnhancedSettingsManager.getSetting('progressBarLocation', CONFIG.progressBarLocation) === 'Inside');
        dotsContainer.classList.toggle('progress-inside', isProgressInside);

        const dotStyle = MediaBarEnhancedSettingsManager.getSetting('dotStyle', CONFIG.dotStyle) || 'Round';
        dotsContainer.classList.toggle('dots-style-pill', dotStyle === 'Pill' || isProgressInside);
      }
    },

    /**
     * Updates current slide to the specified index
     * @param {number} index - Slide index to display
     */

    returnToKeyArt(slide, video, itemId) {
      if (!slide?.classList.contains("media-bar-editorial-trailer")) return false;
      if (slide.classList.contains("trailer-finished")) return true;

      slide.classList.add("trailer-finished");
      STATE.slideshow.playSignals[itemId] = false;
      STATE.slideshow.currentPlayVideoLogic = null;
      if (video) {
        video.style.transition = "opacity 0.8s ease";
        video.style.opacity = "0";
      }
      STATE.slideshow.slideInterval?.stop();
      clearTimeout(STATE.slideshow.backdropVideoTimeout);
      STATE.slideshow.backdropVideoTimeout = setTimeout(() => {
        if (!slide.classList.contains("active") || STATE.slideshow.isPaused || document.hidden) return;
        this.nextSlide();
      }, 1200);
      return true;
    },

    async updateCurrentSlide(index) {
      if (STATE.slideshow.isTransitioning || STATE.slideshow.isSuspended || STATE.slideshow.editingTrailer || document.hidden) {
        return;
      }

      STATE.slideshow.isTransitioning = true;

      if (STATE.slideshow.failsafeTimeout) {
        clearTimeout(STATE.slideshow.failsafeTimeout);
        STATE.slideshow.failsafeTimeout = null;
      }
      STATE.slideshow.isVideoPlaying = false;

      // Stop current YouTube progress tracking
      if (typeof this.stopYouTubeProgressLoop === 'function') {
        this.stopYouTubeProgressLoop();
      }

      if (STATE.slideshow.backdropVideoTimeout) {
        clearTimeout(STATE.slideshow.backdropVideoTimeout);
        STATE.slideshow.backdropVideoTimeout = null;
      }

      let previousVisibleSlide;
      try {
        const container = SlideUtils.getOrCreateSlidesContainer();
        if (typeof isSplitScreenTrailerEnabled === 'function') {
          container.classList.toggle("split-screen-trailer", isSplitScreenTrailerEnabled());
        }
        const totalItems = STATE.slideshow.totalItems;

        index = Math.max(0, Math.min(index, totalItems - 1));
        const currentItemId = STATE.slideshow.itemIds[index];

        STATE.slideshow.currentSlideIndex = index;

        let currentSlide = document.querySelector(
          `.slide[data-item-id="${currentItemId}"]`
        );

        // Detect if a slide button or container is currently focused in TV mode
        let focusedButtonSelector = null;
        const activeEl = document.activeElement;
        if (activeEl?.matches('.media-bar-logo-link') && container.contains(activeEl)) {
          focusedButtonSelector = '.media-bar-logo-link';
        } else if (activeEl && container.contains(activeEl) && activeEl.tagName === 'BUTTON') {
          if (activeEl.classList.contains('play-button')) focusedButtonSelector = '.play-button';
          else if (activeEl.classList.contains('detail-button')) focusedButtonSelector = '.detail-button';
          else if (activeEl.classList.contains('favorite-button')) focusedButtonSelector = '.favorite-button';
          else if (activeEl.classList.contains('trailer-button')) focusedButtonSelector = '.trailer-button';
          else focusedButtonSelector = 'button';
        }

        // pruning for iOS/LowPower
        const limitVideos = isLowPowerDevice() || isIOSDevice();

        // Destroy old video to free up the hardware decoder before allocating new one.
        if (limitVideos) {
          const currentActiveSlide = container.querySelectorAll(".slide.active");
          currentActiveSlide.forEach(activeSlide => {
            const oldVideoItemId = activeSlide.dataset.itemId;
            if (oldVideoItemId && STATE.slideshow.hasTrailer && STATE.slideshow.hasTrailer[oldVideoItemId] === true && oldVideoItemId !== currentItemId) {
              const oldVideo = activeSlide.querySelector('.video-backdrop');
              if (oldVideo) {
                if (oldVideo.tagName === 'VIDEO') {
                  oldVideo.pause();
                  if (oldVideo.src) {
                    oldVideo.removeAttribute('src');
                    oldVideo.load(); // Force decoder release
                  }
                }
                oldVideo.remove();
                console.log("🎬 Media Bar:", "Pruned hidden slide video strictly before new allocation to bypass Apple/Low Power Device limits");
                if (STATE.slideshow.videoPlayers && STATE.slideshow.videoPlayers[oldVideoItemId]) {
                  delete STATE.slideshow.videoPlayers[oldVideoItemId];
                }
              }
            }
          });
        }

        // JIT recreating video to bypass OOM limitations on low-end devices
        if (limitVideos && currentSlide && STATE.slideshow.hasTrailer && STATE.slideshow.hasTrailer[currentItemId] === true) {
          const hasVideo = currentSlide.querySelector('.video-backdrop');
          if (!hasVideo) {
            console.log("🎬 Media Bar:", "JIT recreating slide to embed video on constrained device");
            const newSlide = await SlideCreator.createSlideForItemId(currentItemId, true);
            if (currentSlide && newSlide && currentSlide !== newSlide && currentSlide.parentNode) {
              currentSlide.replaceWith(newSlide);
            }
            currentSlide = newSlide;
            this.upgradeSlideImageQuality(currentSlide);
          }
        }

        if (!currentSlide) {
          currentSlide = await SlideCreator.createSlideForItemId(currentItemId);

          if (!currentSlide) {
            console.error("🎬 Media Bar:", `Failed to create slide for item ${currentItemId}`);
            STATE.slideshow.isTransitioning = false;
            setTimeout(() => this.nextSlide(), 500);
            return;
          }

          this.upgradeSlideImageQuality(currentSlide);
        }

        previousVisibleSlide = container.querySelector(".slide.active");
        if (previousVisibleSlide) {
          previousVisibleSlide.classList.remove("active");
          previousVisibleSlide.dispatchEvent(new Event("marquee-trailer-reset"));
          previousVisibleSlide.querySelector(".media-bar-logo-link")?.setAttribute("tabindex", "-1");
          previousVisibleSlide.querySelectorAll("a.media-bar-studio-entry").forEach(link => { link.tabIndex = -1; });
          const reviews = previousVisibleSlide.querySelector(".media-bar-reviews details");
          if (reviews) {
            reviews.open = false;
            reviews.querySelector("summary").tabIndex = -1;
          }
        }

        void currentSlide.offsetWidth;
        currentSlide.classList.add("active");
        currentSlide.querySelector(".media-bar-reviews")?.dispatchEvent(new Event("marquee-review-activate"));
        currentSlide.querySelector(".media-bar-logo-link")?.setAttribute("tabindex", "0");
        currentSlide.querySelectorAll("a.media-bar-studio-entry").forEach(link => { link.tabIndex = 0; });
        currentSlide.querySelector(".media-bar-reviews summary")?.setAttribute("tabindex", "0");
        STATE.slideshow.playSignals[currentItemId] = false;
        PageBackdrop.update(currentItemId);

        // Restore focus to equivalent button or container on the new active slide
        if (focusedButtonSelector && currentSlide) {
          setTimeout(() => {
            const btnToFocus = currentSlide.querySelector(focusedButtonSelector) || currentSlide.querySelector('.button-container button');
            if (btnToFocus) {
              btnToFocus.focus({ preventScroll: true });
            }
          }, 50);
        }

        // Manage Video Playback: Stop others, Play current
        // 1. Stop all other YouTube players and local video elements, release connections
        setTimeout(() => {
          if (STATE.slideshow.videoPlayers) {
            Object.keys(STATE.slideshow.videoPlayers).forEach(id => {
              if (id !== currentItemId) {
                const p = STATE.slideshow.videoPlayers[id];
                if (!p) return;
                if (typeof p.stopVideo === 'function') {
                  if (p._wrapperDiv) {
                    p._wrapperDiv.style.transition = "none";
                    p._wrapperDiv.style.opacity = "0";
                  }
                  p.stopVideo();
                } else if (typeof p.pauseVideo === 'function') {
                  p.pauseVideo();
                }
                // HTML5 <video> element (local trailers), release HTTP connection
                if (p instanceof HTMLVideoElement) {
                  p.pause();
                  p.muted = true;
                  try {
                    if (p.currentTime > 0) {
                      p.currentTime = 0;
                    }
                  } catch (e) { }
                  // Save src to data-src and release the HTTP streaming connection
                  if (p.src && !p.getAttribute('data-src')) {
                    p.setAttribute('data-src', p.src);
                  }
                  p.removeAttribute('src');
                  p.load();
                }
              }
            });
          }
        }, CONFIG.fadeTransitionDuration);

        // 2. Pause all other HTML5 videos e.g. local trailers
        container.querySelectorAll('video').forEach(video => {
          if (!video.closest(`.slide[data-item-id="${currentItemId}"]`)) {
            video.pause();
          }
        });
        container.querySelectorAll('.slide').forEach(s => {
          if (s !== currentSlide) s.classList.remove('with-video');
        });

        // 3. Play and Reset current video
        const videoBackdrop = currentSlide.querySelector('.video-backdrop');
        currentSlide.classList.remove("trailer-finished");
        const backdropDelay = currentSlide.classList.contains("media-bar-editorial-trailer")
          ? Math.max(1500, CONFIG.backdropVideoDelay) : CONFIG.backdropVideoDelay;

        // Hide video to prevent flash of paused iframe when revisiting slides
        if (videoBackdrop) {
          videoBackdrop.style.transition = "none";
          videoBackdrop.style.opacity = "0";
          // Force layout reflow to apply the instant opacity jump
          void videoBackdrop.offsetWidth;
          videoBackdrop.style.transition = "opacity 1.2s ease-in-out";
        }

        // Auto-unpause when a video slide becomes active
        if (videoBackdrop && STATE.slideshow.isPaused) {
          STATE.slideshow.isPaused = false;
          const pauseButton = document.querySelector('.pause-button');
          if (pauseButton) {
            pauseButton.innerHTML = '<i class="material-icons">pause</i>';
            const pauseLabel = LocalizationUtils.getLocalizedString('ButtonPause', 'Pause');
            pauseButton.setAttribute("aria-label", pauseLabel);
            pauseButton.setAttribute("title", pauseLabel);
          }
        }

        // Update mute button visibility
        const muteButton = document.querySelector('.mute-button');
        if (muteButton) {
          const hasVideo = !!videoBackdrop;
          muteButton.style.display = hasVideo ? 'flex' : 'none';
          if (hasVideo) {
            const isMuted = !!STATE.slideshow.isMuted;
            const vol = getEffectiveTrailerVolume();
            let iconName = 'volume_up';
            if (isMuted || vol === 0) {
              iconName = 'volume_off';
            } else if (vol <= 50) {
              iconName = 'volume_down';
            }
            const iconEl = muteButton.querySelector('.mute-icon') || muteButton.querySelector('i');
            if (iconEl) {
              iconEl.textContent = iconName;
            }
            muteButton.classList.toggle('is-muted', isMuted);
            const slider = muteButton.querySelector('.media-bar-volume-slider');
            if (slider) {
              const displayVol = isMuted ? 0 : vol;
              slider.value = displayVol;
              slider.title = `${displayVol}%`;
              slider.style.setProperty('--volume-percent', `${displayVol}%`);
            }
          }
        }

        if (videoBackdrop) {
          // preload logic
          if (videoBackdrop.tagName === 'VIDEO') {
            // Restore src from data-src if it was deactivated to release connections
            const lazySrc = videoBackdrop.getAttribute('data-src');
            if (lazySrc && !videoBackdrop.src) {
              videoBackdrop.src = lazySrc;
              videoBackdrop.load(); // Force pre-buffering
            } else {
              try {
                if (videoBackdrop.currentTime > 0) {
                  videoBackdrop.currentTime = 0;
                }
              } catch (e) { }
            }

            videoBackdrop.muted = STATE.slideshow.isMuted;
            if (!STATE.slideshow.isMuted) {
              videoBackdrop.volume = getEffectiveTrailerVolume() / 100;
            }
          } else if (STATE.slideshow.videoPlayers && STATE.slideshow.videoPlayers[currentItemId]) {
            const player = STATE.slideshow.videoPlayers[currentItemId];
            // If delay > 0, buffer the video silently using cueVideoById. If 0, skip and load directly later.
            if (backdropDelay > 0) {
              if (player && typeof player.cueVideoById === 'function' && player._videoId) {
                // Use cueVideoById to buffer video without auto-playing it
                const cueObj = {
                  videoId: player._videoId,
                  startSeconds: pickRandomTrailerStartSeconds(player._startTime || 0, player._endTime, true, currentItemId)
                };
                if (player._endTime !== undefined && player._endTime > 0) cueObj.endSeconds = player._endTime;
                player.cueVideoById(cueObj);

                if (STATE.slideshow.isMuted) {
                  player.mute();
                } else {
                  player.unMute();
                  player.setVolume(getEffectiveTrailerVolume());
                }
              } else if (player && typeof player.seekTo === 'function') {
                const startTime = pickRandomTrailerStartSeconds(player._startTime || 0, player._endTime, true, currentItemId);
                player.seekTo(startTime);
              }
            }
          }

          // play logic
          const playVideoLogic = () => {
            if (!currentSlide.classList.contains('active')) return;

            STATE.slideshow.playSignals[currentItemId] = true;

            if (document.hidden || STATE.slideshow.isSuspended) {
              console.log("🎬 Media Bar:", "Tab is inactive, deferring video playback.");
              return;
            }

            if (videoBackdrop.tagName === 'VIDEO') {
              applyHtml5TrailerStartOffset(videoBackdrop, currentItemId, false);
              videoBackdrop.play().catch(e => {
                // Ignore intentional aborts when sliding away quickly
                if (e.name === 'AbortError') return;
                if (!STATE.slideshow.isMuted) {
                  console.warn("🎬 Media Bar:", `Autoplay blocked for ${currentItemId}, attempting immediate muted fallback`);
                  videoBackdrop.muted = true;
                  videoBackdrop.play().catch(err => {
                    if (err.name !== 'AbortError') {
                      console.error("🎬 Media Bar:", "Muted fallback failed", err);
                      if (STATE.slideshow.slideInterval && !STATE.slideshow.isPaused) {
                        STATE.slideshow.slideInterval.start();
                      }
                    }
                  });
                } else {
                  console.error("🎬 Media Bar:", "Playback failed despite being muted", e);
                  if (STATE.slideshow.slideInterval && !STATE.slideshow.isPaused) {
                    STATE.slideshow.slideInterval.start();
                  }
                }
              });
            } else if (STATE.slideshow.videoPlayers && STATE.slideshow.videoPlayers[currentItemId]) {
              const player = STATE.slideshow.videoPlayers[currentItemId];

              if (backdropDelay === 0 && player && typeof player.loadVideoById === 'function' && player._videoId) {
                // Zero delay: Natively load and play immediately to preserve Autoplay tokens
                const loadObj = {
                  videoId: player._videoId,
                  startSeconds: pickRandomTrailerStartSeconds(player._startTime || 0, player._endTime, true, currentItemId)
                };
                if (player._endTime !== undefined && player._endTime > 0) loadObj.endSeconds = player._endTime;
                player.loadVideoById(loadObj);

                if (STATE.slideshow.isMuted) {
                  player.mute();
                } else {
                  player.unMute();
                  player.setVolume(getEffectiveTrailerVolume());
                }
              } else if (player && typeof player.playVideo === 'function') {
                // Delayed: Use playVideo on the buffered cue
                player.playVideo();
              }

              if (!STATE.slideshow.isMuted) {
                // Check if playback successfully started, otherwise fallback to muted
                setTimeout(() => {
                  if (!currentSlide.classList.contains('active')) return;
                  if (player.getPlayerState &&
                    player.getPlayerState() !== YT.PlayerState.PLAYING &&
                    player.getPlayerState() !== YT.PlayerState.BUFFERING) {
                    console.log("🎬 Media Bar:", "YouTube didn't start playback, retrying muted...");
                    player.mute();
                    if (typeof player.loadVideoById === 'function' && player._videoId) {
                      const loadObj = {
                        videoId: player._videoId,
                        startSeconds: pickRandomTrailerStartSeconds(player._startTime || 0, player._endTime, false, currentItemId)
                      };
                      if (player._endTime !== undefined && player._endTime > 0) loadObj.endSeconds = player._endTime;
                      player.loadVideoById(loadObj);
                    } else {
                      player.playVideo();
                    }
                  }
                }, 1000);
              }
            }
          };

          if (backdropDelay > 0) {
            STATE.slideshow.currentPlayVideoLogic = playVideoLogic;
            STATE.slideshow.backdropVideoTimeout = setTimeout(playVideoLogic, backdropDelay);
          } else {
            playVideoLogic();
          }
        }

        const enableAnimations = MediaBarEnhancedSettingsManager.getSetting('slideAnimations', CONFIG.slideAnimationEnabled);

        if (enableAnimations) {
          const backdrop = currentSlide.querySelector(".backdrop");
          if (backdrop && !backdrop.classList.contains("video-backdrop")) {
            backdrop.classList.add("animate");
          }
          const logo = currentSlide.querySelector(".logo");
          if (logo) logo.classList.add("animate");
        }

        if (index === 0 || !previousVisibleSlide) {
          const dotsContainer = container.querySelector(".dots-container");
          if (dotsContainer) {
            dotsContainer.style.opacity = "1";
          }
        }

        setTimeout(() => {
          const allSlides = container.querySelectorAll(".slide");
          allSlides.forEach((slide) => {
            if (slide !== currentSlide) {
              slide.classList.remove("active");
            }
          });
        }, CONFIG.fadeTransitionDuration);

        // Only restart interval if we are NOT waiting for a video to end
        const activeVideo = currentSlide.querySelector('.video-backdrop, iframe, video');
        const hasVideo = !!activeVideo;

        this.preloadAdjacentSlides(index);
        this.updateDots();
        this.updateProgressBar(hasVideo, index);

        if (STATE.slideshow.slideInterval && !STATE.slideshow.isPaused) {
          if (getEffectiveWaitForTrailer() && hasVideo) {
            STATE.slideshow.slideInterval.stop();
            // Start 5-second autoplay failsafe
            STATE.slideshow.failsafeTimeout = setTimeout(() => {
              if (!STATE.slideshow.isVideoPlaying && !STATE.slideshow.isPaused && currentSlide.classList.contains('active')) {
                console.warn("🎬 Media Bar:", `Failsafe triggered for item ${currentItemId}: Video did not start playing. Resuming standard slideshow.`);
                if (STATE.slideshow.slideInterval) {
                  STATE.slideshow.slideInterval.start();
                }
                // Also trigger CSS-based progress bar animation as fallback
                const fill = document.querySelector('.media-bar-progress-fill');
                if (fill) {
                  const bar = fill.closest('.media-bar-progress-bar');
                  if (bar) {
                    fill.style.transform = '';
                    fill.style.animation = '';
                    fill.style.animationDuration = `${CONFIG.shuffleInterval}ms`;
                    bar.classList.add('animating');
                  }
                }
              }
            }, 5000);
          } else {
            STATE.slideshow.slideInterval.restart();
          }
        }

        this.pruneSlideCache();
      } catch (error) {
        console.error("🎬 Media Bar:", "Error updating current slide:", error);
      } finally {
        setTimeout(() => {
          STATE.slideshow.isTransitioning = false;

          if (previousVisibleSlide) {
            const enableAnimations = MediaBarEnhancedSettingsManager.getSetting('slideAnimations', CONFIG.slideAnimationEnabled) && !isLowPowerDevice();
            if (enableAnimations) {
              const prevBackdrop = previousVisibleSlide.querySelector(".backdrop");
              const prevLogo = previousVisibleSlide.querySelector(".logo");
              if (prevBackdrop) prevBackdrop.classList.remove("animate");
              if (prevLogo) prevLogo.classList.remove("animate");
            }
          }
        }, CONFIG.fadeTransitionDuration);
      }
    },

    updateProgressBar(hasVideo, index) {
      const showProgress = MediaBarEnhancedSettingsManager.getSetting('showProgressBar', CONFIG.showProgressBar);
      let progressBar = document.querySelector('.media-bar-progress-bar');

      if (!showProgress) {
        if (progressBar) progressBar.remove();
        return;
      }

      const locationSetting = MediaBarEnhancedSettingsManager.getSetting('progressBarLocation', CONFIG.progressBarLocation) || 'Dots';
      const dotsContainer = document.querySelector('.dots-container');

      let parentContainer;
      let positionClass;

      if (locationSetting === 'Navbar') {
        parentContainer = document.getElementById('slides-container');
        positionClass = 'progress-bar-navbar';
      } else if (locationSetting === 'Inside') {
        const counter = document.getElementById('slide-counter');
        if (counter) {
          parentContainer = counter;
          positionClass = 'progress-bar-inside';
        } else if (dotsContainer) {
          parentContainer = dotsContainer.querySelector('.dot.active');
          positionClass = 'progress-bar-inside';
        }
      } else { // 'Dots'
        if (dotsContainer) {
          parentContainer = dotsContainer;
          positionClass = 'progress-bar-dots';
        } else {
          parentContainer = document.getElementById('slides-container');
          positionClass = 'progress-bar-bottom';
        }
      }

      if (!parentContainer) return;

      const needsCreation = !progressBar || progressBar.parentNode !== parentContainer || !progressBar.classList.contains(positionClass);
      if (needsCreation) {
        if (progressBar) progressBar.remove();
        progressBar = document.createElement('div');
        progressBar.className = `media-bar-progress-bar ${positionClass}`;
        const fill = document.createElement('div');
        fill.className = 'media-bar-progress-fill';
        progressBar.appendChild(fill);
        parentContainer.appendChild(progressBar);
      }

      // Determine reverse status based on slide index and settings
      const useYoYo = MediaBarEnhancedSettingsManager.getSetting('yoYoProgressBar', CONFIG.yoYoProgressBar);
      const isReverse = (useYoYo && index) ? (index % 2 === 1) : false;

      // Reset animation state
      progressBar.classList.remove('animating', 'paused', 'reverse-progress');
      if (isReverse) {
        progressBar.classList.add('reverse-progress');
      }

      const fill = progressBar.querySelector('.media-bar-progress-fill');
      if (fill) {
        fill.style.animation = 'none';
        fill.style.transform = ''; // Clear inline transform leftover from manual video progress updates!
      }
      void progressBar.offsetWidth; // force reflow

      // If we have a video and are waiting for it to end, the timer is stopped.
      // So we do not animate the progress bar via CSS keyframes (we will update it manually).
      const waitForTrailer = getEffectiveWaitForTrailer();
      if (hasVideo && waitForTrailer) {
        return;
      }

      // Start keyframe animation
      if (fill) {
        fill.style.animation = '';
        fill.style.animationDuration = `${CONFIG.shuffleInterval}ms`;
      }
      progressBar.classList.add('animating');

      const slidesContainer = document.getElementById("slides-container");
      if (slidesContainer) {
        if (STATE.slideshow.isPaused) {
          slidesContainer.classList.add("slideshow-paused");
        } else {
          slidesContainer.classList.remove("slideshow-paused");
        }
      }

      if (STATE.slideshow.isPaused) {
        progressBar.classList.add('paused');
      }
    },

    /**
     * Upgrades the image quality for all images in a slide
     * @param {HTMLElement} slide - The slide element containing images to upgrade
     */

    upgradeSlideImageQuality(slide) {
      if (!slide) return;

      const images = slide.querySelectorAll("img.low-quality");
      images.forEach((img) => {
        const highQualityUrl = img.getAttribute("data-high-quality");

        // Prevent duplicate requests if already using high quality
        if (highQualityUrl && img.src !== highQualityUrl) {
          addThrottledRequest(highQualityUrl, () => {
            img.src = highQualityUrl;
            img.classList.remove("low-quality");
            img.classList.add("high-quality");
          });
        }
      });
    },

    /**
     * Preloads adjacent slides for smoother transitions
     * @param {number} currentIndex - Current slide index
     */
    async preloadAdjacentSlides(currentIndex) {
      const totalItems = STATE.slideshow.totalItems;
      let preloadCount = Math.min(Math.max(CONFIG.preloadCount || 1, 1), 5);
      if (isLowPowerDevice() || isIOSDevice()) preloadCount = 1; // Strict limit for TVs & Apple iOS/iPadOS devices

      const preloadedIds = new Set();

      // Preload next slides
      for (let i = 1; i <= preloadCount; i++) {
        const nextIndex = (currentIndex + i) % totalItems;
        if (nextIndex === currentIndex) break;

        const itemId = STATE.slideshow.itemIds[nextIndex];
        if (!preloadedIds.has(itemId)) {
          preloadedIds.add(itemId);
          SlideCreator.createSlideForItemId(itemId);
        }
      }

      // Preload previous slides
      for (let i = 1; i <= preloadCount; i++) {
        const prevIndex = (currentIndex - i + totalItems) % totalItems;
        if (prevIndex === currentIndex) break;

        const prevItemId = STATE.slideshow.itemIds[prevIndex];
        if (!preloadedIds.has(prevItemId)) {
          preloadedIds.add(prevItemId);
          SlideCreator.createSlideForItemId(prevItemId);
        }
      }
    },

    nextSlide() {
      const currentIndex = STATE.slideshow.currentSlideIndex;
      const totalItems = STATE.slideshow.totalItems;

      const nextIndex = (currentIndex + 1) % totalItems;

      this.updateCurrentSlide(nextIndex);
    },

    prevSlide() {
      const currentIndex = STATE.slideshow.currentSlideIndex;
      const totalItems = STATE.slideshow.totalItems;

      const prevIndex = (currentIndex - 1 + totalItems) % totalItems;

      this.updateCurrentSlide(prevIndex);
    },

    /**
     * Prunes the slide cache to prevent memory bloat
     * Removes slides that are outside the viewing range
     */
    pruneSlideCache() {
      const currentIndex = STATE.slideshow.currentSlideIndex;
      const keepRange = CONFIG.preloadCount + 1;
      let prunedAny = false;

      Object.keys(STATE.slideshow.createdSlides).forEach((itemId) => {
        const index = STATE.slideshow.itemIds.indexOf(itemId);
        if (index === -1) return;

        const totalItems = STATE.slideshow.itemIds.length;
        let distance = Math.abs(index - currentIndex);

        // Always calculate circular distance for slideshow
        distance = Math.min(distance, totalItems - distance);

        if (distance > keepRange) {
          // Destroy video player if exists
          if (STATE.slideshow.videoPlayers[itemId]) {
            const player = STATE.slideshow.videoPlayers[itemId];
            if (typeof player.destroy === 'function') {
              // YouTube player
              player.destroy();
            } else if (player instanceof HTMLVideoElement) {
              // HTML5 video, release HTTP streaming connection
              player.pause();
              // Save src to data-src and release the HTTP streaming connection
              if (player.src && !player.getAttribute('data-src')) {
                player.setAttribute('data-src', player.src);
              }
              player.removeAttribute('src');
              player.load();
            }
            delete STATE.slideshow.videoPlayers[itemId];
          }

          delete STATE.slideshow.loadedItems[itemId];

          const slides = document.querySelectorAll(
            `.slide[data-item-id="${itemId}"]`
          );
          slides.forEach(s => s.remove());

          delete STATE.slideshow.createdSlides[itemId];
          prunedAny = true;

          console.log("🎬 Media Bar:", `Pruned slide ${itemId} at distance ${distance} from view`);
        }
      });

      if (prunedAny) {
        if (isTvMode()) {
          const container = document.getElementById("slides-container");
          // Only maintain focus if focus was ALREADY on the media bar container
          if (container && container.style.display !== 'none' && (container.contains(document.activeElement) || document.activeElement === container)) {
            setTimeout(() => {
              if (container && container.style.display !== 'none' && (container.contains(document.activeElement) || document.activeElement === container)) {
                container.focus({ preventScroll: true });
              }
            }, 0);
          }
        }
      }
    },

    showOsdToast(iconName, text) {
      const container = document.getElementById('slides-container');
      if (!container) return;

      let toast = container.querySelector('.media-bar-osd-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'media-bar-osd-toast';
        toast.style.cssText = 'position: absolute !important; top: 7.5rem !important; right: 1rem !important; z-index: 9999 !important; background: rgba(0, 0, 0, 0.75) !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; color: #ffffff !important; padding: 10px 18px !important; border-radius: 24px !important; font-size: 1.1rem !important; font-weight: 500 !important; display: flex !important; align-items: center !important; gap: 10px !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; pointer-events: none !important; transition: opacity 0.3s ease, transform 0.3s ease !important; opacity: 0; transform: translateY(-10px);';
        container.appendChild(toast);
      }

      toast.innerHTML = `<i class="material-icons" style="font-size: 22px !important; color: #00a4dc !important;">${iconName}</i> <span>${text}</span>`;
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';

      if (this._osdToastTimer) clearTimeout(this._osdToastTimer);
      this._osdToastTimer = setTimeout(() => {
        if (toast) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(-10px)';
        }
      }, 1600);
    },

    toggleMute() {
      STATE.slideshow.volumeFadeToken++;
      STATE.slideshow.hoverAudioEngaged = false;
      STATE.slideshow.isMuted = !STATE.slideshow.isMuted;
      const isUnmuting = !STATE.slideshow.isMuted;
      const muteButton = document.querySelector('.mute-button');

      if (isUnmuting && getEffectiveTrailerVolume() === 0) {
        STATE.slideshow.sessionTrailerVolume = getEffectiveTrailerVolume();
      }

      const updateIcon = () => {
        if (!muteButton) return;
        const isMuted = STATE.slideshow.isMuted;
        const vol = getEffectiveTrailerVolume();
        let iconName = 'volume_up';
        if (isMuted || vol === 0) {
          iconName = 'volume_off';
        } else if (vol <= 50) {
          iconName = 'volume_down';
        }
        const iconEl = muteButton.querySelector('.mute-icon') || muteButton.querySelector('i');
        if (iconEl) {
          iconEl.textContent = iconName;
        }
        if (isMuted) {
          muteButton.classList.add('is-muted');
        } else {
          muteButton.classList.remove('is-muted');
        }
        const slider = muteButton.querySelector('.media-bar-volume-slider');
        if (slider) {
          const displayVol = isMuted ? 0 : vol;
          slider.value = displayVol;
          slider.title = `${displayVol}%`;
          slider.style.setProperty('--volume-percent', `${displayVol}%`);
        }
        const label = isMuted ? 'Unmute' : 'Mute';
        muteButton.setAttribute("aria-label", LocalizationUtils.getLocalizedString(label, label));
        muteButton.setAttribute("title", LocalizationUtils.getLocalizedString(label, label));
      };

      const currentItemId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
      const player = STATE.slideshow.videoPlayers ? STATE.slideshow.videoPlayers[currentItemId] : null;

      if (currentItemId) {
        const currentSlide = document.querySelector(`.slide[data-item-id="${currentItemId}"]`);
        const video = currentSlide ? currentSlide.querySelector('video') : null;

        if (video) {
          video.muted = STATE.slideshow.isMuted;
          if (!STATE.slideshow.isMuted) {
            video.volume = getEffectiveTrailerVolume() / 100;
          }

          if (!STATE.slideshow.isPaused && isUnmuting) video.play().catch(error => {
            if (error.name === 'AbortError') return;
            console.warn("🎬 Media Bar:", "Unmuted play blocked, reverting to muted...");
            STATE.slideshow.isMuted = true;
            video.muted = true;
            video.play().catch(err => { if (err.name !== 'AbortError') console.warn(err); });
            updateIcon();
          });
        }

        if (player && typeof player.playVideo === 'function') {
          if (STATE.slideshow.isMuted) {
            player.mute();
          } else {
            player.unMute();
            player.setVolume(getEffectiveTrailerVolume());
          }

          if (isUnmuting && !STATE.slideshow.isPaused) player.playVideo();
          if (isUnmuting && !STATE.slideshow.isPaused) {
            setTimeout(() => {
              const state = player.getPlayerState();
              if (state === 2 && !STATE.slideshow.isPaused && !STATE.slideshow.isMuted) {
                console.log("🎬 Media Bar:", "Video was paused after unmute...");
                STATE.slideshow.isMuted = true;
                player.mute();
                player.playVideo();
                updateIcon();
              }
            }, 300);
          }
        }
      }

      updateIcon();
    },

    togglePause(keepTrailerFrame = false) {
      if (STATE.slideshow.editingTrailer && !keepTrailerFrame) return;
      STATE.slideshow.isPaused = !STATE.slideshow.isPaused;
      const canResume = !STATE.slideshow.isSuspended && !document.hidden;
      const pauseButton = document.querySelector('.pause-button');
      if (STATE.slideshow.isPaused && STATE.slideshow.hoverAudioEngaged) onMediaBarHoverAudioLeave();

      // Handle current video playback
      const currentItemId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
      const currentSlide = document.querySelector(`.slide[data-item-id="${currentItemId}"]`);

      if (currentSlide) {
        // Try YouTube player
        const ytPlayer = STATE.slideshow.videoPlayers[currentItemId];
        if (ytPlayer && typeof ytPlayer.getPlayerState === 'function') {
          if (STATE.slideshow.isPaused) {
            if (typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
            if (!keepTrailerFrame && ytPlayer._wrapperDiv) {
              ytPlayer._wrapperDiv.style.transition = "opacity 0.5s ease-in-out";
              ytPlayer._wrapperDiv.style.opacity = "0";
            }
          } else if (canResume) {
            if (typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo();
            if (ytPlayer._wrapperDiv) {
              ytPlayer._wrapperDiv.style.transition = "opacity 0.5s ease-in-out";
              ytPlayer._wrapperDiv.style.opacity = "1";
            }
          }
        }

        // Try HTML5 video
        const html5Video = currentSlide.querySelector('video');
        if (html5Video) {
          if (STATE.slideshow.isPaused) {
            html5Video.pause();
            if (!keepTrailerFrame) {
              html5Video.style.transition = "opacity 0.5s ease-in-out";
              html5Video.style.opacity = "0";
            }
          } else if (canResume) {
            html5Video.play().catch(() => {});
            html5Video.style.transition = "opacity 0.5s ease-in-out";
            html5Video.style.opacity = "1";
          }
        }
      }

      // If paused, clear any video-hovered state immediately
      if (STATE.slideshow.isPaused) {
        document.querySelectorAll('.slide.video-hovered').forEach(s => s.classList.remove('video-hovered'));
      }

      // Pause/Resume Progress Bar
      const progressBar = document.querySelector('.media-bar-progress-bar');
      if (progressBar) {
        if (STATE.slideshow.isPaused) {
          progressBar.classList.add('paused');
        } else {
          progressBar.classList.remove('paused');
        }
      }

      // Pause/Resume static backdrop Ken Burns zoom animations
      const slidesContainer = document.getElementById("slides-container");
      if (slidesContainer) {
        if (STATE.slideshow.isPaused) {
          slidesContainer.classList.add("slideshow-paused");
        } else {
          slidesContainer.classList.remove("slideshow-paused");
        }
      }

      if (STATE.slideshow.isPaused) {
        STATE.slideshow.slideInterval?.stop();
        pauseButton.innerHTML = '<i class="material-icons">play_arrow</i>';
        const playLabel = LocalizationUtils.getLocalizedString('Play', 'Play');
        pauseButton.setAttribute("aria-label", playLabel);
        pauseButton.setAttribute("title", playLabel);
      } else {
        // Only restart interval if we are NOT waiting for a video to end
        const currentItemId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
        const currentSlide = document.querySelector(`.slide[data-item-id="${currentItemId}"]`);
        const hasVideo = currentSlide && currentSlide.querySelector('.video-backdrop');

        if (canResume && (!getEffectiveWaitForTrailer() || !hasVideo)) {
          STATE.slideshow.slideInterval?.start();
        }

        pauseButton.innerHTML = '<i class="material-icons">pause</i>';
        const pauseLabel = LocalizationUtils.getLocalizedString('ButtonPause', 'Pause');
        pauseButton.setAttribute("aria-label", pauseLabel);
        pauseButton.setAttribute("title", pauseLabel);
      }
    },

    /**
     * Stops all video playback (YouTube and HTML5)
     * Used when navigating away from the home screen
     */
    stopAllPlayback(retain = null) {
      // Stop YouTube progress loop
      if (typeof this.stopYouTubeProgressLoop === 'function') {
        this.stopYouTubeProgressLoop();
      }

      // Clear any pending autoplay timeouts
      if (STATE.slideshow.autoplayTimeouts) {
        STATE.slideshow.autoplayTimeouts.forEach(id => clearTimeout(id));
        STATE.slideshow.autoplayTimeouts = [];
      }

      // 1. Stop all YouTube players
      if (STATE.slideshow.videoPlayers) {
        Object.values(STATE.slideshow.videoPlayers).forEach(player => {
          try {
            if (player && player === retain) {
              player.pauseVideo();
              return;
            }
            if (player) {
              if (typeof player.stopVideo === 'function') {
                player.stopVideo();
              } else if (typeof player.pauseVideo === 'function') {
                player.pauseVideo();
              }
              if (player._wrapperDiv) {
                player._wrapperDiv.style.transition = "opacity 0.3s ease-in-out";
                player._wrapperDiv.style.opacity = "0";
              }
            }
            if (typeof player?.clearVideo === 'function') {
              player.clearVideo();
            }
          } catch (e) {
            console.warn("🎬 Media Bar:", "Error pausing/stopping YouTube player:", e);
          }
        });
      }

      // 2. Stop and mute all HTML5 videos, release connections
      const container = document.getElementById("slides-container");
      if (container) {
        container.querySelectorAll('video').forEach(video => {
          try {
            video.pause();
            if (video === retain) return;
            video.muted = true;
            try {
              if (video.currentTime > 0) {
                video.currentTime = 0;
              }
            } catch (e) { }
            // Save src and release HTTP streaming connection
            if (video.src && !video.getAttribute('data-src')) {
              video.setAttribute('data-src', video.src);
            }
            video.removeAttribute('src');
            video.load();
          } catch (e) {
            console.warn("🎬 Media Bar:", "Error stopping HTML5 video:", e);
          }
        });
      }
    },

    /**
     * Resumes playback for the active slide if not globally paused
     */
    resumeActivePlayback() {
      if (STATE.slideshow.isPaused || (MediaBarEnhancedSettingsManager.getSetting('pauseOnExternalPlayback', CONFIG.pauseOnExternalPlayback) && VisibilityObserver.checkRemotePlaybackActive())) return;

      const currentItemId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
      if (!currentItemId) return;

      const currentSlide = document.querySelector(`.slide[data-item-id="${currentItemId}"]`);
      if (!currentSlide || (currentSlide.classList.contains('media-bar-editorial-trailer') && !STATE.slideshow.playSignals[currentItemId])) return;

      // YouTube player: just resume, don't reload
      const ytPlayer = (STATE.slideshow.videoPlayers && STATE.slideshow.videoPlayers[currentItemId]) ? STATE.slideshow.videoPlayers[currentItemId] : undefined;
      if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        if (STATE.slideshow.isMuted) {
          if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
        } else {
          if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
          if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(getEffectiveTrailerVolume());
        }
        ytPlayer.playVideo();
        if (ytPlayer._wrapperDiv) {
          ytPlayer._wrapperDiv.style.transition = "opacity 1.2s ease-in-out";
          ytPlayer._wrapperDiv.style.opacity = "1";
        }
        STATE.slideshow.isVideoPlaying = true;
        return;
      }

      // HTML5 video: restore src if needed, then resume
      const html5Video = currentSlide.querySelector('video.video-backdrop');
      if (html5Video) {
        // Restore src from data-src if it was cleared to release connections
        const lazySrc = html5Video.getAttribute('data-src');
        if (lazySrc && !html5Video.src) {
          html5Video.src = lazySrc;
        }
        html5Video.muted = STATE.slideshow.isMuted;
        if (!STATE.slideshow.isMuted) html5Video.volume = getEffectiveTrailerVolume() / 100;
        html5Video.play().then(() => {
          html5Video.style.transition = "opacity 1.2s ease-in-out";
          html5Video.style.opacity = "1";
          STATE.slideshow.isVideoPlaying = true;
        }).catch(e => {
          if (e.name !== 'AbortError') console.warn("🎬 Media Bar:", "Error resuming HTML5 video:", e);
        });
      }
    },

    /**
     * Initializes touch events for swiping
     */
    initTouchEvents() {
      const container = SlideUtils.getOrCreateSlidesContainer();
      let touchStartX = 0;
      let touchEndX = 0;

      container.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );

      container.addEventListener(
        "touchend",
        (e) => {
          touchEndX = e.changedTouches[0].screenX;
          this.handleSwipe(touchStartX, touchEndX);
        },
        { passive: true }
      );
    },

    /**
     * Handles swipe gestures
     * @param {number} startX - Starting X position
     * @param {number} endX - Ending X position
     */
    handleSwipe(startX, endX) {
      const diff = endX - startX;

      if (Math.abs(diff) < CONFIG.minSwipeDistance) {
        return;
      }

      if (diff > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    },

    /**
     * TV Spatial Navigation Engine
     */
    TvNavigationEngine: {
      getContainer() {
        return document.getElementById('slides-container');
      },

      getActiveSlideButtons() {
        const container = this.getContainer();
        if (!container) return [];
        const activeSlide = container.querySelector('.slide.active');
        if (!activeSlide) return [];
        return Array.from(activeSlide.querySelectorAll('.media-bar-logo-link, a.media-bar-studio-entry, .button-container button, .pause-button, .mute-button'))
          .filter(b => b.offsetWidth > 0 && b.offsetHeight > 0 && window.getComputedStyle(b).display !== 'none');
      },

      isNavbarFocused(activeElement) {
        return !!(activeElement && activeElement.closest && (
          activeElement.closest('.skinHeader, .appHeader, .sectionTabs, .emby-tabs, .headerRight') ||
          activeElement.classList.contains('emby-tab-button')
        ));
      },

      isTopDashboardElement(activeElement) {
        const container = this.getContainer();
        if (!activeElement || !container || container.contains(activeElement)) return false;

        const section = activeElement.closest('.homeSectionsContainer, .sections, #indexPage, .page');
        if (!section) return false;

        const activeRect = activeElement.getBoundingClientRect();
        // Look for any focusable element inside section that is vertically ABOVE activeElement
        const cardsAbove = Array.from(section.querySelectorAll('button, a, [tabindex="0"], .card')).filter(el => {
          if (el === activeElement || el.contains(activeElement) || activeElement.contains(el)) return false;
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          const rect = el.getBoundingClientRect();
          return rect.height > 0 && rect.bottom < activeRect.top - 15;
        });

        return cardsAbove.length === 0;
      },

      focusFirstSlideButton() {
        const buttons = this.getActiveSlideButtons();
        if (buttons.length > 0) {
          buttons[0].focus();
          return true;
        }
        return false;
      },

      focusSectionBelow() {
        const container = this.getContainer();
        if (!container) return false;

        const candidateSelectors = [
          '.homeSectionsContainer button, .homeSectionsContainer a, .homeSectionsContainer [tabindex="0"]',
          '.sections button, .sections a, .sections [tabindex="0"]',
          '.emby-scroller button, .emby-scroller a, .emby-scroller [tabindex="0"]',
          '.card button, .card a, .card[tabindex="0"]',
          '#indexPage button, #indexPage a, #indexPage [tabindex="0"]'
        ];

        for (const selector of candidateSelectors) {
          const elements = Array.from(document.querySelectorAll(selector)).filter(el => {
            if (container.contains(el)) return false;
            const rect = el.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.top >= containerRect.bottom - 80 && style.display !== 'none' && style.visibility !== 'hidden';
          });
          if (elements.length > 0) {
            elements[0].focus();
            return true;
          }
        }
        return false;
      },

      focusNavbarAbove() {
        const candidateSelectors = [
          '.emby-tab-button-active',
          '.emby-tab-button',
          '.headerUserButton',
          '[class*="headerUserButton"]',
          '.headerButton',
          'button[class*="Header"]',
          '.media-bar-settings-button',
          '#searchButton',
          '#settingsButton'
        ];

        for (const selector of candidateSelectors) {
          const elements = Array.from(document.querySelectorAll(selector)).filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
          });
          if (elements.length > 0) {
            elements[0].focus();
            return true;
          }
        }
        return false;
      },

      handleTvKey(e, activeElement) {
        const container = this.getContainer();
        if (!container || container.style.display === 'none') return false;

        const isInsideContainer = container.contains(activeElement);
        const isContainerFocused = activeElement === container;
        const isButtonFocused = isInsideContainer && activeElement.tagName === 'BUTTON';

        switch (e.key) {
          case "ArrowRight":
            if (isButtonFocused) {
              const buttons = this.getActiveSlideButtons();
              const idx = buttons.indexOf(activeElement);
              if (idx !== -1 && idx < buttons.length - 1) {
                buttons[idx + 1].focus();
              }
              return true;
            }
            break;

          case "ArrowLeft":
            if (isButtonFocused) {
              const buttons = this.getActiveSlideButtons();
              const idx = buttons.indexOf(activeElement);
              if (idx > 0) {
                buttons[idx - 1].focus();
              }
              return true;
            }
            break;

          case "ArrowDown":
            if (this.isNavbarFocused(activeElement)) {
              container.focus({ preventScroll: true });
              return true;
            }
            if (isContainerFocused) {
              if (!this.focusFirstSlideButton()) {
                this.focusSectionBelow();
              }
              return true;
            }
            if (isButtonFocused) {
              this.focusSectionBelow();
              return true;
            }
            break;

          case "ArrowUp":
            if (isButtonFocused) {
              container.focus({ preventScroll: true });
              return true;
            }
            if (isContainerFocused) {
              this.focusNavbarAbove();
              return true;
            }
            if (this.isTopDashboardElement(activeElement)) {
              if (!this.focusFirstSlideButton()) {
                container.focus({ preventScroll: true });
              }
              return true;
            }
            break;
        }

        return false;
      }
    },

    /**
     * Initializes keyboard event listeners
     */
    initKeyboardEvents() {
      if (!CONFIG.enableKeyboardControls) return;

      // Auto-scroll focused element into view for TV mode & keyboard navigation
      document.addEventListener('focusin', (e) => {
        if (!isTvMode()) {
          return;
        }

        const container = document.getElementById('slides-container');
        if (container) {
          if (document.activeElement === container || container.contains(document.activeElement)) {
            container.classList.add('is-tv-focused');
          } else {
            container.classList.remove('is-tv-focused');
          }

          if (document.activeElement === container) {
            container.classList.add('is-container-focused');
          } else {
            container.classList.remove('is-container-focused');
          }
        }

        const el = e.target;
        if (!el || el === document.body || el === document.documentElement) return;
        if (el === container || (container && container.contains(el))) {
          if (window.scrollY !== 0) {
            window.scrollTo(window.scrollX, 0);
          }
          return;
        }

        try {
          const rect = el.getBoundingClientRect();
          const viewHeight = window.innerHeight || document.documentElement.clientHeight;
          // If element is below or above the visible viewport, scroll it into view
          if (rect.bottom > viewHeight - 20 || rect.top < 80) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          }
        } catch (err) { }
      });

      // Listen for Home button clicks (navbar/sidebar house icon) or Home key press to redirect focus to Media Bar (TV mode only)
      document.addEventListener("click", (e) => {
        if (!isTvMode()) return;
        const homeBtn = e.target.closest('a[href*="home"], .btnHeaderHome, [data-action="home"], .headerHomeButton, .navMenuOption[href*="home"]');
        if (homeBtn) {
          STATE.slideshow.wasHomeButtonClicked = true;
          STATE.slideshow.wasOnDetailsPage = false;
        }
      }, true);

      document.addEventListener("keydown", (e) => {
        if (!isTvMode()) return;
        if (e.key === "Home") {
          STATE.slideshow.wasHomeButtonClicked = true;
          STATE.slideshow.wasOnDetailsPage = false;
        }
      }, true);

      document.addEventListener("keydown", (e) => {
        const container = this.TvNavigationEngine.getContainer();
        if (!container || container.style.display === "none") {
          return;
        }

        const activeElement = document.activeElement;
        const isTv = isTvMode();

        // Check for Input Fields (always ignore typing)
        const isInputElement = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);
        if (isInputElement) return;

        // Check active video players (ignore if video is playing/overlay is open)
        const videoPlayer = document.querySelector('.videoPlayerContainer');
        const trailerPlayer = document.querySelector('.youtubePlayerContainer');
        const isVideoOpen = (videoPlayer && !videoPlayer.classList.contains('hide')) || (trailerPlayer && !trailerPlayer.classList.contains('hide'));
        if (isVideoOpen) return;

        // 1. Try TV D-pad navigation first
        if (isTv && this.TvNavigationEngine.handleTvKey(e, activeElement)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 2. TV Remote Control & Desktop shortcuts
        const isBodyFocused = activeElement === document.body;
        const isContainerFocused = activeElement === container;
        const isInsideContainer = container ? container.contains(activeElement) : false;
        const isHomeView = window.location.hash === '#/home.html' || window.location.hash === '#/home' || !window.location.hash;
        const canControlSlideshow = isContainerFocused || isInsideContainer || isBodyFocused || (isTv && isHomeView);

        const key = e.key || "";
        const code = e.code || "";
        const keyCode = e.keyCode || e.which || 0;

        // Remote / Keyboard Mute Key Detection
        const isMuteKey = key === "AudioVolumeMute" || key === "VolumeMute" || key === "Mute" || key === "m" || key === "M" || code === "VolumeMute" || code === "KeyM" || keyCode === 173 || keyCode === 449;

        // Remote / Keyboard Play & Pause Key Detection
        const isPlayPauseKey = key === "MediaPlayPause" || key === "MediaPlay" || key === "MediaPause" || key === "Play" || key === "Pause" || key === "p" || key === "P" || key === " " || code === "MediaPlayPause" || code === "MediaPlay" || code === "MediaPause" || code === "KeyP" || code === "Space" || keyCode === 179 || keyCode === 415 || keyCode === 19;

        if (isMuteKey && canControlSlideshow) {
          SlideshowManager.toggleMute();
          SlideshowManager.showOsdToast(
            STATE.slideshow.isMuted ? 'volume_off' : 'volume_up',
            STATE.slideshow.isMuted
              ? LocalizationUtils.getCustomLocalizedString('toastMuted', 'Muted')
              : LocalizationUtils.getCustomLocalizedString('toastUnmuted', 'Audio On')
          );
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        if (isPlayPauseKey && canControlSlideshow) {
          SlideshowManager.togglePause();
          SlideshowManager.showOsdToast(
            STATE.slideshow.isPaused ? 'pause' : 'play_arrow',
            STATE.slideshow.isPaused
              ? LocalizationUtils.getCustomLocalizedString('toastPaused', 'Slideshow Paused')
              : LocalizationUtils.getCustomLocalizedString('toastResumed', 'Slideshow Resumed')
          );
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        const isInteractiveElement = activeElement && activeElement !== document.body && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.isContentEditable ||
          activeElement.closest('.dialogContainer, .media-bar-settings-modal, .media-bar-trailer-popup, .actionSheet')
        );

        const isShelfFocused = isTv && activeElement && activeElement.closest('.homeSectionsContainer, .sections, .emby-scroller, .card');
        const isNavbarFocused = isTv && this.TvNavigationEngine.isNavbarFocused(activeElement);

        const canNavigateSlides = isContainerFocused || isInsideContainer || isBodyFocused || (
          isHomeView && !isInteractiveElement && (!isTv || (!isShelfFocused && !isNavbarFocused))
        );

        switch (e.key) {
          case "ArrowRight":
            if (canNavigateSlides) {
              SlideshowManager.nextSlide();
              e.preventDefault();
            }
            break;

          case "ArrowLeft":
            if (canNavigateSlides) {
              SlideshowManager.prevSlide();
              e.preventDefault();
            }
            break;

          case "Enter":
            if (isContainerFocused) {
              const currentItemId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
              if (currentItemId) {
                if (window.Emby && window.Emby.Page) {
                  Emby.Page.show(
                    `/details?id=${currentItemId}&serverId=${STATE.jellyfinData.serverId}`
                  );
                } else {
                  window.location.href = `#/details?id=${currentItemId}&serverId=${STATE.jellyfinData.serverId}`;
                }
              }
              e.preventDefault();
            }
            break;
        }
      });

      const container = SlideUtils.getOrCreateSlidesContainer();

      container.addEventListener("focus", () => {
        STATE.slideshow.containerFocused = true;
      });

      container.addEventListener("blur", () => {
        STATE.slideshow.containerFocused = false;
      });
    },

    /**
     * Parses a string containing IDs, genre/tag/year/studio/person/rating filters, and custom video backdrops.
     * Supports special prefixes in the ID field:
     *  - genre:Action / genres:Action,Comedy      --> filter by genre
     *  - tag:Halloween / tags:Christmas           --> filter by tag
     *  - studio:Pixar / studios:Marvel Studios    --> filter by studio
     *  - person:Tom Hanks / actor:Brad Pitt / director:Nolan --> filter by person/cast/crew
     *  - year:2024 / years:2000-2010 / years:2000s / years:2020+ --> filter by year/range
     *  - released:90d                             --> filter by release recency
     *  - rating:PG-13 / rating:16                 --> filter by official/parental rating
     *  - rating:>=7.5 / rating:8+ / minrating:7   --> filter by minimum community rating
     *  - rating:<=12                              --> filter by maximum parental rating
     *
     * @returns {{ ids: string[], genres: string[], tags: string[], studios: string[], persons: string[], years: number[], officialRatings: string[], minPremiereDate: string|null, maxPremiereDate: string|null, minCommunityRating: number|null, maxOfficialRating: number|null }}
     */
    parseIdsString(idsString) {
      if (!idsString) return {
        ids: [],
        genres: [],
        tags: [],
        studios: [],
        persons: [],
        years: [],
        officialRatings: [],
        minPremiereDate: null,
        maxPremiereDate: null,
        minCommunityRating: null,
        maxOfficialRating: null
      };

      const ids = [];
      const genres = [];
      const excludedGenres = [];
      const tags = [];
      const excludedTags = [];
      const studios = [];
      const persons = [];
      const years = [];
      const officialRatings = [];
      let minPremiereDate = null;
      let maxPremiereDate = null;
      let minCommunityRating = null;
      let maxOfficialRating = null;

      const processSingleId = (raw) => {
        if (!raw) return;
        const urlMatch = raw.match(/\[(.*?)\]/);
        let id = raw;
        if (urlMatch) {
          const url = urlMatch[1];
          id = raw.replace(/\[.*?\]/, '').trim();
          const guidMatch = id.match(/([0-9a-f]{32})/i);
          if (guidMatch) {
            id = guidMatch[1];
          } else {
            id = id.split('|')[0].trim();
          }
          STATE.slideshow.customTrailerUrls[id] = url;
        }
        if (id.trim()) {
          ids.push(id.trim());
        }
      };

      idsString
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line)
        .forEach((line) => {
          // Check for negative genre prefix: -genre:, !genre:, exclude_genre:, exclude-genre:
          const excludedGenrePrefixMatch = line.match(/^(?:[-!]genres?|exclude[-_]genres?):\s*(.+)$/i);
          if (excludedGenrePrefixMatch) {
            excludedGenrePrefixMatch[1].split(/[,|]/).forEach(g => {
              const val = g.trim().replace(/^[-!]/, '').trim();
              if (val) excludedGenres.push(val);
            });
            return;
          }

          // Check for genre prefix (may contain positive genres or inline negative like -Horror or !Thriller)
          const genreMatch = line.match(/^genres?:\s*(.+)$/i);
          if (genreMatch) {
            genreMatch[1].split(/[,|]/).forEach(g => {
              const val = g.trim();
              if (!val) return;
              if (val.startsWith('-') || val.startsWith('!')) {
                const clean = val.replace(/^[-!]/, '').trim();
                if (clean) excludedGenres.push(clean);
              } else {
                genres.push(val);
              }
            });
            return;
          }

          // Check for negative tag prefix: -tag:, !tag:, exclude_tag:, exclude-tag:
          const excludedTagPrefixMatch = line.match(/^(?:[-!]tags?|exclude[-_]tags?):\s*(.+)$/i);
          if (excludedTagPrefixMatch) {
            excludedTagPrefixMatch[1].split(/[,|]/).forEach(t => {
              const val = t.trim().replace(/^[-!]/, '').trim();
              if (val) excludedTags.push(val);
            });
            return;
          }

          // Check for tag prefix (may contain positive tags or inline negative like -gore or !nsfw)
          const tagMatch = line.match(/^tags?:\s*(.+)$/i);
          if (tagMatch) {
            tagMatch[1].split(/[,|]/).forEach(t => {
              const val = t.trim();
              if (!val) return;
              if (val.startsWith('-') || val.startsWith('!')) {
                const clean = val.replace(/^[-!]/, '').trim();
                if (clean) excludedTags.push(clean);
              } else {
                tags.push(val);
              }
            });
            return;
          }

          // Check for studio prefix
          const studioMatch = line.match(/^studios?:\s*(.+)$/i);
          if (studioMatch) {
            studioMatch[1].split(/[,|]/).forEach(s => {
              const val = s.trim();
              if (val) studios.push(val);
            });
            return;
          }

          // Check for person prefix (actor, director, person)
          const personMatch = line.match(/^(?:persons?|actors?|directors?):\s*(.+)$/i);
          if (personMatch) {
            personMatch[1].split(/[,|]/).forEach(p => {
              const val = p.trim();
              if (val) persons.push(val);
            });
            return;
          }

          // Check for year / years prefix (e.g. year:2024, years:2000-2010, years:2000s, years:2020+)
          const yearMatch = line.match(/^years?:\s*(.+)$/i);
          if (yearMatch) {
            const parsed = SlideUtils.parseYearExpression(yearMatch[1].trim());
            if (parsed.years && parsed.years.length > 0) {
              years.push(...parsed.years);
            }
            if (parsed.minPremiereDate) {
              if (!minPremiereDate || new Date(parsed.minPremiereDate) < new Date(minPremiereDate)) {
                minPremiereDate = parsed.minPremiereDate;
              }
            }
            if (parsed.maxPremiereDate) {
              if (!maxPremiereDate || new Date(parsed.maxPremiereDate) > new Date(maxPremiereDate)) {
                maxPremiereDate = parsed.maxPremiereDate;
              }
            }
            return;
          }

          // Check for release / released prefix (e.g. release:90d or released:30)
          const releaseMatch = line.match(/^released?:\s*(\d+)\s*d?$/i);
          if (releaseMatch) {
            const days = parseInt(releaseMatch[1], 10);
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - days);
            const iso = pastDate.toISOString();
            if (!minPremiereDate || new Date(iso) > new Date(minPremiereDate)) {
              minPremiereDate = iso;
            }
            return;
          }

          // Check for rating / ratings / officialrating / minrating / score / age prefix
          const ratingMatch = line.match(/^(?:ratings?|officialratings?|minratings?|communityratings?|score|age|parental):\s*(.+)$/i);
          if (ratingMatch) {
            const prefix = line.split(':')[0].toLowerCase().trim();
            const parsed = SlideUtils.parseRatingExpression(ratingMatch[1].trim(), prefix);
            if (parsed.officialRatings && parsed.officialRatings.length > 0) {
              officialRatings.push(...parsed.officialRatings);
            }
            if (parsed.minCommunityRating !== null) {
              if (minCommunityRating === null || parsed.minCommunityRating > minCommunityRating) {
                minCommunityRating = parsed.minCommunityRating;
              }
            }
            if (parsed.maxOfficialRating !== null) {
              if (maxOfficialRating === null || parsed.maxOfficialRating < maxOfficialRating) {
                maxOfficialRating = parsed.maxOfficialRating;
              }
            }
            return;
          }

          // Non-filter line: can be multiple comma-separated IDs or a single ID with trailer
          if (!line.includes('[') && line.includes(',')) {
            line.split(',').forEach(sub => processSingleId(sub.trim()));
            return;
          }

          processSingleId(line);
        });

      return {
        ids,
        genres: [...new Set(genres)],
        excludedGenres: [...new Set(excludedGenres)],
        tags: [...new Set(tags)],
        excludedTags: [...new Set(excludedTags)],
        studios: [...new Set(studios)],
        persons: [...new Set(persons)],
        years: [...new Set(years)],
        officialRatings: [...new Set(officialRatings)],
        minPremiereDate,
        maxPremiereDate,
        minCommunityRating,
        maxOfficialRating
      };
    },

    parseCustomIds() {
      const activePlaylist = MediaBarEnhancedSettingsManager.getSetting("activePlaylist", CONFIG.activePlaylist);

      const emptyFilters = () => ({
        ids: [],
        genres: [],
        excludedGenres: [],
        tags: [],
        excludedTags: [],
        studios: [],
        persons: [],
        years: [],
        officialRatings: [],
        minPremiereDate: null,
        maxPremiereDate: null,
        minCommunityRating: null,
        maxOfficialRating: null
      });

      if (activePlaylist === 'Library') {
        return emptyFilters();
      } else if (activePlaylist && activePlaylist.startsWith('Playlist:')) {
        const playlistName = activePlaylist.replace('Playlist:', '');
        try {
          const playlists = JSON.parse(CONFIG.customPlaylists || "[]");
          const found = playlists.find(p => p.Name === playlistName);
          if (found) {
            return this.parseIdsString(found.MediaIds);
          }
          console.warn("🎬 Media Bar:", `Custom playlist "${playlistName}" not found in config, falling back to default.`);
        } catch (e) {
          console.error("🎬 Media Bar:", "Error parsing custom playlists for override:", e);
        }
      }

      let idsString = CONFIG.customMediaIds;
      let usingSeasonal = false;

      if (CONFIG.enableSeasonalContent) {
        try {
          const sections = JSON.parse(CONFIG.seasonalSections || "[]");
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1; // 1-12
          const currentDay = currentDate.getDate(); // 1-31

          for (const section of sections) {
            const startDay = parseInt(section.StartDay);
            const startMonth = parseInt(section.StartMonth);
            const endDay = parseInt(section.EndDay);
            const endMonth = parseInt(section.EndMonth);

            let isInRange = false;

            if (startMonth === endMonth) {
              if (currentMonth === startMonth && currentDay >= startDay && currentDay <= endDay) {
                isInRange = true;
              }
            } else if (startMonth < endMonth) {
              // Normal range
              if (
                (currentMonth > startMonth && currentMonth < endMonth) ||
                (currentMonth === startMonth && currentDay >= startDay) ||
                (currentMonth === endMonth && currentDay <= endDay)
              ) {
                isInRange = true;
              }
            } else {
              // Wrap around year
              if (
                (currentMonth > startMonth || currentMonth < endMonth) ||
                (currentMonth === startMonth && currentDay >= startDay) ||
                (currentMonth === endMonth && currentDay <= endDay)
              ) {
                isInRange = true;
              }
            }

            if (isInRange) {
              console.log("🎬 Media Bar:", `Seasonal match found: ${section.Name}`);
              idsString = section.MediaIds;
              usingSeasonal = true;
              break; // Use first matching season
            }
          }
        } catch (e) {
          console.error("🎬 Media Bar:", "Error parsing seasonal sections in JS:", e);
        }
      }

      // If NOT using seasonal content (disabled or no match),
      // Custom IDs are disabled, return empty to skip to random
      if (!usingSeasonal && !CONFIG.enableCustomMediaIds) {
        return emptyFilters();
      }

      // Parse the resulting string (either seasonal or default)
      const result = this.parseIdsString(idsString);

      if (result.genres.length > 0) {
        console.log("🎬 Media Bar:", `Parsed ${result.genres.length} genre filter(s): ${result.genres.join(', ')}`);
      }
      if (result.excludedGenres && result.excludedGenres.length > 0) {
        console.log("🎬 Media Bar:", `Parsed ${result.excludedGenres.length} excluded genre filter(s): ${result.excludedGenres.join(', ')}`);
      }
      if (result.tags.length > 0) {
        console.log("🎬 Media Bar:", `Parsed ${result.tags.length} tag filter(s): ${result.tags.join(', ')}`);
      }
      if (result.excludedTags && result.excludedTags.length > 0) {
        console.log("🎬 Media Bar:", `Parsed ${result.excludedTags.length} excluded tag filter(s): ${result.excludedTags.join(', ')}`);
      }
      if (result.studios && result.studios.length > 0) {
        console.log("🎬 Media Bar:", `Parsed ${result.studios.length} studio filter(s): ${result.studios.join(', ')}`);
      }
      if (result.persons && result.persons.length > 0) {
        console.log("🎬 Media Bar:", `Parsed ${result.persons.length} person filter(s): ${result.persons.join(', ')}`);
      }
      if (result.officialRatings && result.officialRatings.length > 0) {
        console.log("🎬 Media Bar:", `Parsed ${result.officialRatings.length} official rating filter(s): ${result.officialRatings.join(', ')}`);
      }
      if (result.minCommunityRating !== null) {
        console.log("🎬 Media Bar:", `Parsed min community rating filter: ${result.minCommunityRating}`);
      }
      if (result.maxOfficialRating !== null) {
        console.log("🎬 Media Bar:", `Parsed max official rating filter: ${result.maxOfficialRating}`);
      }
      if (result.years.length > 0) {
        console.log("🎬 Media Bar:", `Parsed ${result.years.length} year filter(s): ${result.years.join(', ')}`);
      }
      if (result.minPremiereDate || result.maxPremiereDate) {
        console.log("🎬 Media Bar:", `Parsed release date filter(s): min=${result.minPremiereDate || 'none'}, max=${result.maxPremiereDate || 'none'}`);
      }

      return result;
    },

    /**
     * Resolves a list of IDs, expanding collections (BoxSets) into their children
     * @param {string[]} rawIds - List of input IDs
     * @returns {Promise<string[]>} Flattened list of item IDs
     */
    async resolveCollectionsAndItems(rawIds) {
      const finalIds = [];
      const guidRegex = /^([0-9a-f]{32})$/i;

      for (const rawId of rawIds) {
        try {
          let id = rawId;

          // If not a valid GUID, check if it starts with one (comments) or treat as a name
          if (!guidRegex.test(rawId)) {
            const guidMatch = rawId.match(/^([0-9a-f]{32})(?:[^0-9a-f]|$)/i);

            if (guidMatch) {
              id = guidMatch[1];
            } else {
              console.log("🎬 Media Bar:", `Input '${rawId}' is not a GUID, searching for Collection/Playlist by name...`);
              const resolvedId = await ApiUtils.findCollectionOrPlaylistByName(rawId);

              if (resolvedId) {
                console.log("🎬 Media Bar:", `Resolved name '${rawId}' to ID: ${resolvedId}`);
                id = resolvedId;
              } else {
                console.warn("🎬 Media Bar:", `Could not find Collection or Playlist with name: '${rawId}'`);
                continue; // Skip if resolution failed
              }
            }
          }

          const item = await ApiUtils.fetchItemDetails(id);
          if (item && (item.Type === 'BoxSet' || item.Type === 'Playlist' || item.Type === 'CollectionFolder' || item.Type === 'Folder' || item.Type === 'UserView')) {
            console.log("🎬 Media Bar:", `Found Collection/Playlist/Folder: ${id} (${item.Type}), fetching children...`);
            const children = await ApiUtils.fetchCollectionItems(id, item.Type);
            finalIds.push(...children);
          } else if (item) {
            finalIds.push({ Id: item.Id, Type: item.Type, Genres: item.Genres || [], Tags: item.Tags || [], OfficialRating: item.OfficialRating });
          }
        } catch (e) {
          console.warn("🎬 Media Bar:", `Error resolving item ${rawId}:`, e);
        }
      }
      return finalIds;
    },

    /**
     * Loads slideshow data and initializes the slideshow
     */
    async selectDailyLineup(ids) {
      if (!ids.length) return [];
      const now = new Date();
      const day = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-");
      const settings = MediaBarEnhancedSettingsManager;
      const cached = settings.readPersonal("daily", null);
      if (cached?.day === day && Array.isArray(cached.ids)) {
        const available = await Promise.all(cached.ids.map(id => ApiUtils.fetchItemDetails(id)));
        if (available.every(Boolean)) return cached.ids;
      }

      const pool = SlideUtils.shuffleArray(ids.slice()).slice(0, 24);
      const items = (await Promise.all(pool.map(id => ApiUtils.fetchItemDetails(id)))).filter(Boolean);
      await ApiUtils.fetchLibraryIds();
      await Promise.all(items.map(item => ApiUtils.resolveItemLibraryId(item)));
      const picks = SlideUtils.pickDailyItems(items);
      if (picks.length) settings.writePersonal("daily", { day, ids: picks });
      return picks;
    },

    async loadSlideshowData() {
      try {
        STATE.slideshow.isLoading = true;
        let itemIds = [];

        const activePlaylist = MediaBarEnhancedSettingsManager.getSetting("activePlaylist", CONFIG.activePlaylist);
        const isClientRecsExplicit = MediaBarEnhancedSettingsManager.getSetting('useRecommendations', CONFIG.useRecommendations) === true;

        // Priority 1: Forced Playlist from Client Menu
        if (activePlaylist && activePlaylist.startsWith('Playlist:')) {
          const playlistName = activePlaylist.replace('Playlist:', '');
          try {
            const playlists = JSON.parse(CONFIG.customPlaylists || "[]");
            const found = playlists.find(p => p.Name === playlistName);
            if (found) {
              console.log("🎬 Media Bar:", `Using client-forced playlist: ${playlistName}`);
              const parsed = this.parseIdsString(found.MediaIds);
              const hasFilterRules = (parsed.genres && parsed.genres.length > 0) ||
                (parsed.excludedGenres && parsed.excludedGenres.length > 0) ||
                (parsed.tags && parsed.tags.length > 0) ||
                (parsed.excludedTags && parsed.excludedTags.length > 0) ||
                (parsed.studios && parsed.studios.length > 0) ||
                (parsed.persons && parsed.persons.length > 0) ||
                (parsed.officialRatings && parsed.officialRatings.length > 0) ||
                parsed.minCommunityRating !== null ||
                parsed.maxOfficialRating !== null ||
                (parsed.years && parsed.years.length > 0) ||
                !!parsed.minPremiereDate ||
                !!parsed.maxPremiereDate;

              let resolvedItems = [];
              if (parsed.ids.length > 0) {
                resolvedItems = await this.resolveCollectionsAndItems(parsed.ids);
              }
              if (hasFilterRules) {
                const filterItems = await ApiUtils.fetchItemsByGenresAndTags(
                  parsed.genres,
                  parsed.tags,
                  parsed.years,
                  parsed.minPremiereDate,
                  parsed.maxPremiereDate,
                  parsed.studios,
                  parsed.persons,
                  parsed.officialRatings,
                  parsed.minCommunityRating,
                  parsed.maxOfficialRating,
                  parsed.excludedGenres,
                  parsed.excludedTags
                );
                const existingIds = new Set(resolvedItems.map(i => i.Id));
                for (const item of filterItems) {
                  if (!existingIds.has(item.Id)) {
                    resolvedItems.push(item);
                    existingIds.add(item.Id);
                  }
                }
              }

              // Apply negative filters to all resolved items (including explicit IDs/BoxSets)
              const serverExcludedGenres = CONFIG.excludedGenres ? CONFIG.excludedGenres.split(',').map(g => g.trim().toLowerCase()).filter(Boolean) : [];
              const allExcludedGenres = [...new Set([...(parsed.excludedGenres || []).map(g => g.toLowerCase()), ...serverExcludedGenres])];
              if (allExcludedGenres.length > 0) {
                resolvedItems = resolvedItems.filter(item => {
                  if (!item.Genres || !Array.isArray(item.Genres) || item.Genres.length === 0) return true;
                  return !item.Genres.some(g => allExcludedGenres.includes(g.toLowerCase()));
                });
              }
              const serverExcludedTags = CONFIG.excludedTags ? CONFIG.excludedTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];
              const allExcludedTags = [...new Set([...(parsed.excludedTags || []).map(t => t.toLowerCase()), ...serverExcludedTags])];
              if (allExcludedTags.length > 0) {
                resolvedItems = resolvedItems.filter(item => {
                  if (!item.Tags || !Array.isArray(item.Tags) || item.Tags.length === 0) return true;
                  return !item.Tags.some(t => allExcludedTags.includes(t.toLowerCase()));
                });
              }

              if (CONFIG.maxParentalRating) {
                resolvedItems = resolvedItems.filter(item => {
                  if (!item.OfficialRating) return true;
                  const ratingNum = parseInt(item.OfficialRating.replace(/\D/g, ''), 10);
                  return isNaN(ratingNum) || ratingNum <= CONFIG.maxParentalRating;
                });
              }

              if (resolvedItems.length > 0) {
                itemIds = resolvedItems.map(i => i.Id);
              }
            }
          } catch (e) {
            console.error("🎬 Media Bar:", "Error parsing client playlist:", e);
          }
        }

        // Priority 2: Client Explicit Personalized Recommendations Override
        if (itemIds.length === 0 && activePlaylist !== 'Library' && isClientRecsExplicit) {
          console.log("🎬 Media Bar:", "Client explicitly enabled personalized recommendations, querying recommendations...");
          itemIds = await ApiUtils.fetchRecommendationsFromServer();
          if (itemIds.length === 0) {
            console.log("🎬 Media Bar:", "No client recommendations found for user, continuing content priority chain...");
          }
        }

        // Priority 3: Seasonal Content & Priority 4: Custom Media IDs from Configuration
        if (itemIds.length === 0 && activePlaylist !== 'Library') {
          if (CONFIG.enableCustomMediaIds || CONFIG.enableSeasonalContent) {
            const parsed = this.parseCustomIds();
            const hasFilterRules = (parsed.genres && parsed.genres.length > 0) ||
              (parsed.excludedGenres && parsed.excludedGenres.length > 0) ||
              (parsed.tags && parsed.tags.length > 0) ||
              (parsed.excludedTags && parsed.excludedTags.length > 0) ||
              (parsed.studios && parsed.studios.length > 0) ||
              (parsed.persons && parsed.persons.length > 0) ||
              (parsed.officialRatings && parsed.officialRatings.length > 0) ||
              parsed.minCommunityRating !== null ||
              parsed.maxOfficialRating !== null ||
              (parsed.years && parsed.years.length > 0) ||
              !!parsed.minPremiereDate ||
              !!parsed.maxPremiereDate;
            const hasIds = parsed.ids.length > 0;

            if (hasIds || hasFilterRules) {
              console.log("🎬 Media Bar:", "Using Custom Media IDs / Seasonal content from configuration");
              let resolvedItems = [];

              // Resolve explicit IDs (GUIDs, collection names, etc.)
              if (hasIds) {
                resolvedItems = await this.resolveCollectionsAndItems(parsed.ids);
              }

              // Fetch items matching genre/tag/year/release filters from the API
              if (hasFilterRules) {
                const filterItems = await ApiUtils.fetchItemsByGenresAndTags(
                  parsed.genres,
                  parsed.tags,
                  parsed.years,
                  parsed.minPremiereDate,
                  parsed.maxPremiereDate,
                  parsed.studios,
                  parsed.persons,
                  parsed.officialRatings,
                  parsed.minCommunityRating,
                  parsed.maxOfficialRating,
                  parsed.excludedGenres,
                  parsed.excludedTags
                );

                if (filterItems.length > 0) {
                  // Merge with explicit IDs, deduplicating by Id
                  const existingIds = new Set(resolvedItems.map(i => i.Id));
                  for (const item of filterItems) {
                    if (!existingIds.has(item.Id)) {
                      resolvedItems.push(item);
                      existingIds.add(item.Id);
                    }
                  }
                  console.log("🎬 Media Bar:", `Merged ${filterItems.length} filtered items with ${hasIds ? parsed.ids.length : 0} explicit IDs → ${resolvedItems.length} total unique items`);
                }
              }

              // Apply negative filters to all resolved items (including explicit IDs/BoxSets)
              const serverExcludedGenres = CONFIG.excludedGenres ? CONFIG.excludedGenres.split(',').map(g => g.trim().toLowerCase()).filter(Boolean) : [];
              const allExcludedGenres = [...new Set([...(parsed.excludedGenres || []).map(g => g.toLowerCase()), ...serverExcludedGenres])];
              if (allExcludedGenres.length > 0) {
                resolvedItems = resolvedItems.filter(item => {
                  if (!item.Genres || !Array.isArray(item.Genres) || item.Genres.length === 0) return true;
                  return !item.Genres.some(g => allExcludedGenres.includes(g.toLowerCase()));
                });
              }
              const serverExcludedTags = CONFIG.excludedTags ? CONFIG.excludedTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];
              const allExcludedTags = [...new Set([...(parsed.excludedTags || []).map(t => t.toLowerCase()), ...serverExcludedTags])];
              if (allExcludedTags.length > 0) {
                resolvedItems = resolvedItems.filter(item => {
                  if (!item.Tags || !Array.isArray(item.Tags) || item.Tags.length === 0) return true;
                  return !item.Tags.some(t => allExcludedTags.includes(t.toLowerCase()));
                });
              }

              if (CONFIG.maxParentalRating) {
                resolvedItems = resolvedItems.filter(item => {
                  if (!item.OfficialRating) return true;
                  const ratingNum = parseInt(item.OfficialRating.replace(/\D/g, ''), 10);
                  return isNaN(ratingNum) || ratingNum <= CONFIG.maxParentalRating;
                });
              }

              // Apply max items limit to custom IDs if enabled
              if (CONFIG.applyLimitsToCustomIds) {
                let movieCount = 0;
                let showCount = 0;
                let keptItems = [];

                for (const item of resolvedItems) {
                  if (keptItems.length >= CONFIG.maxItems) break;

                  if (item.Type === 'Movie') {
                    if (movieCount < CONFIG.maxMovies) {
                      movieCount++;
                      keptItems.push(item);
                    }
                  } else if (item.Type === 'Series' || item.Type === 'Season' || item.Type === 'Episode') {
                    // Count Seasons/Episodes as TV Shows
                    if (showCount < CONFIG.maxTvShows) {
                      showCount++;
                      keptItems.push(item);
                    }
                  } else {
                    // Other types: count towards total only
                    keptItems.push(item);
                  }
                }
                itemIds = keptItems.map(i => i.Id);
                console.log("🎬 Media Bar:", `Applied limits to custom IDs: ${itemIds.length} items (Movies: ${movieCount}, Shows: ${showCount})`);
              } else {
                // Even if applyLimitsToCustomIds is false, filter out items whose max count is 0
                resolvedItems = resolvedItems.filter(item => {
                  if (item.Type === 'Movie' && CONFIG.maxMovies === 0) return false;
                  if ((item.Type === 'Series' || item.Type === 'Season' || item.Type === 'Episode') && CONFIG.maxTvShows === 0) return false;
                  return true;
                });
                itemIds = resolvedItems.map(i => i.Id);
              }
            }
          }
        }

        // Priority 5: Server Default Personalized Recommendations
        if (itemIds.length === 0 && activePlaylist !== 'Library' && CONFIG.useRecommendations) {
          console.log("🎬 Media Bar:", "Server default recommendations enabled, querying recommendations...");
          itemIds = await ApiUtils.fetchRecommendationsFromServer();
          if (itemIds.length === 0) {
            console.log("🎬 Media Bar:", "No server recommendations found for user, continuing to random library items...");
          }
        }

        // Priority 6: Random Library Items (Fallback)
        if (itemIds.length === 0) {
          console.log("🎬 Media Bar:", "Fetching random library items from server...");
          itemIds = await ApiUtils.fetchItemIdsFromServer();
        } else if (CONFIG.sortBy !== 'Original' && CONFIG.sortBy !== 'Random') {
          // Client-side sort for custom/seasonal/playlist items
          console.log("🎬 Media Bar:", `Sorting ${itemIds.length} custom items by ${CONFIG.sortBy} ${CONFIG.sortOrder}`);
          const itemsWithDetails = [];
          for (const id of itemIds) {
            const item = await ApiUtils.fetchItemDetails(id);
            if (item) itemsWithDetails.push(item);
          }

          const sortedItems = SlideUtils.sortItems(itemsWithDetails, CONFIG.sortBy, CONFIG.sortOrder);
          itemIds = sortedItems.map(i => i.Id);
        }

        // Shuffle once at the end if Random sorting is selected
        if (CONFIG.sortBy === 'Random') {
          itemIds = SlideUtils.shuffleArray(itemIds);
        }

        // Ensure strict uniqueness across all itemIds
        itemIds = [...new Set(itemIds.filter(Boolean))];

        const lineup = MediaBarEnhancedSettingsManager.getPublishedPreference("lineup", "publishedLineup", []);
        if (lineup.length) {
          const details = await Promise.all(lineup.map(id => ApiUtils.fetchItemDetails(id)));
          const available = details.filter(Boolean).map(item => item.Id);
          itemIds = CONFIG.shufflePublishedLineup ? SlideUtils.shuffleArray(available) : available;
        }
        if (MediaBarEnhancedSettingsManager.getSetting("dailyFive", CONFIG.dailyFive)) {
          itemIds = await this.selectDailyLineup(itemIds);
        }

        STATE.slideshow.itemIds = itemIds;
        STATE.slideshow.totalItems = itemIds.length;

        this.createPaginationDots();

        // Apply transition effect and duration class to container
        const transitionEffect = MediaBarEnhancedSettingsManager.getSetting('transitionEffect', CONFIG.transitionEffect) || 'Fade';
        const containerEl = document.getElementById("slides-container");
        if (containerEl) {
          containerEl.className = containerEl.className.split(' ').filter(c => !c.startsWith('transition-effect-')).join(' ');
          containerEl.classList.add(`transition-effect-${transitionEffect.toLowerCase()}`);
          containerEl.style.setProperty('--transition-duration', `${CONFIG.fadeTransitionDuration || 500}ms`);
        }

        let initialSlide = 0;
        try {
          const key = "marquee-return-" + STATE.jellyfinData.userId;
          const editedId = sessionStorage.getItem(key);
          sessionStorage.removeItem(key);
          const index = editedId ? itemIds.indexOf(editedId) : -1;
          if (index >= 0) initialSlide = index;
        } catch { /* Session storage may be unavailable. */ }
        await this.updateCurrentSlide(initialSlide);

        STATE.slideshow.slideInterval = new SlideTimer(() => {
          if (document.hidden || STATE.slideshow.isSuspended) return;
          if (STATE.slideshow.isPaused) return;

          if (getEffectiveWaitForTrailer()) {
            const activeSlide = document.querySelector('.slide.active');
            const video = activeSlide ? activeSlide.querySelector('.video-backdrop') : null;
            const isVideoPlaying = video && (
              (video.tagName === 'VIDEO' && !video.paused) ||
              (video.tagName === 'DIV' && STATE.slideshow.isVideoPlaying)
            );
            if (isVideoPlaying) return;
          }

          this.nextSlide();
        }, CONFIG.shuffleInterval);

        // Check if we should wait for trailer
        const waitForTrailer = getEffectiveWaitForTrailer();

        if (waitForTrailer && STATE.slideshow.slideInterval) {
          const activeSlide = document.querySelector('.slide.active');
          const video = activeSlide ? activeSlide.querySelector('.video-backdrop') : null;
          const isVideoPlaying = video && (
            (video.tagName === 'VIDEO' && !video.paused) ||
            (video.tagName === 'DIV' && STATE.slideshow.isVideoPlaying)
          );
          if (isVideoPlaying) {
            STATE.slideshow.slideInterval.stop();
          }
        }
      } catch (error) {
        console.error("🎬 Media Bar:", "Error loading slideshow data:", error);
      } finally {
        STATE.slideshow.isLoading = false;
        STATE.slideshow.initialLoadComplete = true;
      }
    },
  };

  /**
   * Initializes arrow navigation elements
   */
  const initArrowNavigation = () => {
    const container = SlideUtils.getOrCreateSlidesContainer();

    const leftArrow = SlideUtils.createElement("div", {
      className: "arrow left-arrow",
      innerHTML: '<i class="material-icons">chevron_left</i>',
      tabIndex: "0",
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        SlideshowManager.prevSlide();
      },
      style: {
        opacity: "0",
        transition: "opacity 0.3s ease",
        display: "none",
      },
    });

    const rightArrow = SlideUtils.createElement("div", {
      className: "arrow right-arrow",
      innerHTML: '<i class="material-icons">chevron_right</i>',
      tabIndex: "0",
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        SlideshowManager.nextSlide();
      },
      style: {
        opacity: "0",
        transition: "opacity 0.3s ease",
        display: "none",
      },
    });

    const pauseButton = SlideUtils.createElement("button", {
      type: "button",
      className: "pause-button",
      innerHTML: '<i class="material-icons">pause</i>',
      tabIndex: "0",
      "aria-label": LocalizationUtils.getLocalizedString('ButtonPause', 'Pause'),
      title: LocalizationUtils.getLocalizedString('ButtonPause', 'Pause'),
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        SlideshowManager.togglePause();
      }
    });

    // Prevent touch events from bubbling to container
    pauseButton.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });
    pauseButton.addEventListener("touchend", (e) => e.stopPropagation(), { passive: true });
    pauseButton.addEventListener("mousedown", (e) => e.stopPropagation());

    const initialVol = getEffectiveTrailerVolume();
    const isInitiallyMuted = !!STATE.slideshow.isMuted;
    const displayInitialVol = isInitiallyMuted ? 0 : initialVol;
    const initialIcon = isInitiallyMuted || initialVol === 0 ? 'volume_off' : (initialVol <= 50 ? 'volume_down' : 'volume_up');
    const muteLabel = LocalizationUtils.getLocalizedString(isInitiallyMuted ? 'Unmute' : 'Mute', isInitiallyMuted ? 'Unmute' : 'Mute');

    const muteButton = SlideUtils.createElement("div", {
      role: "button",
      className: `mute-button ${isInitiallyMuted ? 'is-muted' : ''}`,
      innerHTML: `<i class="material-icons mute-icon">${initialIcon}</i>`,
      tabIndex: "0",
      "aria-label": muteLabel,
      title: muteLabel,
      style: { display: "none" },
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only toggle mute if clicking the icon button, not inside the volume slider box
        if (e.target && e.target.closest && e.target.closest('.media-bar-volume-wrap')) {
          return;
        }
        SlideshowManager.toggleMute();
      }
    });

    muteButton.addEventListener("keydown", event => {
      if (event.target !== muteButton || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      event.stopPropagation();
      SlideshowManager.toggleMute();
    });
    const muteIcon = muteButton.querySelector('.mute-icon');

    const volumeWrap = SlideUtils.createElement("div", {
      className: "media-bar-volume-wrap"
    });
    const volumeSlider = SlideUtils.createElement("input", {
      type: "range",
      className: "media-bar-volume-slider",
      min: "0",
      max: "100",
      step: "1",
      value: String(displayInitialVol),
      title: `${displayInitialVol}%`,
      "aria-label": "Trailer Volume",
      style: {
        "--volume-percent": `${displayInitialVol}%`
      }
    });

    // Clicking directly on the slider handles its own native change
    volumeSlider.addEventListener("click", (e) => e.stopPropagation());

    // Clicking anywhere in the pill capsule jumps directly to that percentage
    volumeWrap.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = volumeSlider.getBoundingClientRect();
      if (rect.width > 0) {
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        const newVol = Math.round(ratio * 100);
        volumeSlider.value = String(newVol);
        volumeSlider.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    // Prevent mouse/touch events from bubbling out of the capsule to muteButton or container
    ["mousedown", "touchstart", "touchmove", "touchend"].forEach((event) => {
      volumeWrap.addEventListener(event, (e) => e.stopPropagation(), { passive: event.startsWith("touch") });
    });

    volumeSlider.addEventListener("input", (e) => {
      e.stopPropagation();
      STATE.slideshow.volumeFadeToken++;
      STATE.slideshow.hoverAudioEngaged = false;
      let newVol = parseInt(e.target.value, 10);
      if (newVol < 4) {
        newVol = 0;
        volumeSlider.value = "0";
      }
      volumeSlider.title = `${newVol}%`;
      volumeSlider.style.setProperty('--volume-percent', `${newVol}%`);

      if (newVol > 0 && STATE.slideshow.isMuted) {
        STATE.slideshow.isMuted = false;
        muteButton.classList.remove('is-muted');
        const activeLabel = LocalizationUtils.getLocalizedString('Mute', 'Mute');
        muteButton.setAttribute("aria-label", activeLabel);
        muteButton.setAttribute("title", activeLabel);
      } else if (newVol === 0 && !STATE.slideshow.isMuted) {
        STATE.slideshow.isMuted = true;
        muteButton.classList.add('is-muted');
        const activeLabel = LocalizationUtils.getLocalizedString('Unmute', 'Unmute');
        muteButton.setAttribute("aria-label", activeLabel);
        muteButton.setAttribute("title", activeLabel);
      }

      if (newVol > 0) {
        STATE.slideshow.sessionTrailerVolume = newVol;
      }

      const currentItemId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
      if (currentItemId) {
        const currentSlide = document.querySelector(`.slide[data-item-id="${currentItemId}"]`);
        const video = currentSlide ? currentSlide.querySelector('video') : null;
        if (video) {
          video.muted = STATE.slideshow.isMuted;
          if (!STATE.slideshow.isMuted) {
            video.volume = newVol / 100;
          }
        }
        const player = STATE.slideshow.videoPlayers ? STATE.slideshow.videoPlayers[currentItemId] : null;
        if (player) {
          if (STATE.slideshow.isMuted) {
            if (typeof player.mute === 'function') player.mute();
          } else {
            if (typeof player.unMute === 'function') player.unMute();
            if (typeof player.setVolume === 'function') player.setVolume(newVol);
          }
        }
      }

      let dynamicIcon = 'volume_up';
      if (STATE.slideshow.isMuted || newVol === 0) {
        dynamicIcon = 'volume_off';
      } else if (newVol <= 50) {
        dynamicIcon = 'volume_down';
      }
      if (muteIcon) {
        muteIcon.textContent = dynamicIcon;
      }
    });

    volumeWrap.appendChild(volumeSlider);
    muteButton.appendChild(volumeWrap);

    // Prevent desktop mouse events from bubbling to container
    muteButton.addEventListener("mousedown", (e) => e.stopPropagation());

    document.querySelector(".marquee-transport-overlay")?.dispose?.();
    const transport = SlideUtils.createElement("div", {
      className: "marquee-transport-overlay", role: "group", "aria-label": "Marquee playback",
    });
    transport.hidden = true;
    transport.append(muteButton, pauseButton);
    document.body.appendChild(transport);
    const listeners = new AbortController();
    let frame = 0;
    const position = () => {
      frame = 0;
      if (!container.isConnected) { transport.dispose(); return; }
      const rect = container.getBoundingClientRect();
      const counter = container.querySelector("#slide-counter");
      const count = counter?.getBoundingClientRect();
      const besideCount = count?.width > 0 && getComputedStyle(counter).visibility !== "hidden";
      const center = besideCount ? (count.top + count.bottom) / 2 : rect.top + rect.height * 0.79;
      transport.hidden = !rect.height || center < 68 || center > Math.min(rect.bottom, window.innerHeight - 24);
      if (!transport.hidden) {
        const accent = getComputedStyle(container).getPropertyValue("--accent").trim();
        const channels = accent.split(/[\s,]+/);
        const functionName = channels[1]?.endsWith("%") && !channels[0]?.endsWith("%") ? "hsl" : "rgb";
        const candidates = accent ? [accent, functionName + "(" + accent + ")"] : [];
        const color = candidates.find(value => CSS.supports("color", value));
        if (color) transport.style.setProperty("--marquee-resolved-accent", color);
        else transport.style.removeProperty("--marquee-resolved-accent");
        transport.style.top = center + "px";
        transport.style.setProperty("--marquee-control-height", (besideCount ? count.height : 36) + "px");
        transport.style.right = Math.max(12, window.innerWidth - (besideCount ? count.left : rect.right) + 12) + "px";
      }
    };
    const queuePosition = () => { if (!frame) frame = requestAnimationFrame(position); };
    const visibility = new MutationObserver(queuePosition);
    visibility.observe(container, { attributes: true, attributeFilter: ["style", "class"], childList: true });
    visibility.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    visibility.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
    transport.addEventListener("pointerenter", queuePosition, { signal: listeners.signal });
    let transportFadeTimer = 0;
    const revealTransport = () => transport.classList.remove("marquee-transport-idle");
    const scheduleTransportFade = () => {
      revealTransport();
      clearTimeout(transportFadeTimer);
      transportFadeTimer = setTimeout(() => transport.classList.add("marquee-transport-idle"), 1800);
    };
    for (const eventName of ["click", "input", "change", "pointerup"]) {
      transport.addEventListener(eventName, scheduleTransportFade, { signal: listeners.signal });
    }
    transport.addEventListener("focusin", revealTransport, { signal: listeners.signal });
    transport.addEventListener("pointermove", event => {
      if (event.pointerType !== "touch") revealTransport();
    }, { passive: true, signal: listeners.signal });
    const size = new ResizeObserver(queuePosition);
    size.observe(container);
    container.addEventListener("pointermove", event => {
      const video = container.querySelector(".slide.active .video-backdrop");
      const bounds = video?.getBoundingClientRect();
      const overVideo = event.pointerType !== "touch" && bounds &&
        Number(getComputedStyle(video).opacity) > 0 &&
        event.clientX >= bounds.left && event.clientX <= bounds.right &&
        event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (overVideo) revealTransport();
      transport.classList.toggle("marquee-trailer-hover", Boolean(overVideo));
    }, { passive: true, signal: listeners.signal });
    container.addEventListener("pointerleave", () => transport.classList.remove("marquee-trailer-hover"),
      { signal: listeners.signal });
    window.addEventListener("scroll", queuePosition, { capture: true, passive: true, signal: listeners.signal });
    window.addEventListener("resize", queuePosition, { passive: true, signal: listeners.signal });
    transport.dispose = () => {
      clearTimeout(transportFadeTimer);
      listeners.abort();
      visibility.disconnect();
      size.disconnect();
      cancelAnimationFrame(frame);
      transport.remove();
    };
    queuePosition();
    container.append(leftArrow, rightArrow);

    const showArrows = () => {
      if (CONFIG.hideArrowsOnMobile && window.matchMedia("only screen and (max-width: 768px)").matches) {
        return; // disable arrow display on mobile
      }

      leftArrow.style.display = "block";
      rightArrow.style.display = "block";

      void leftArrow.offsetWidth;
      void rightArrow.offsetWidth;

      leftArrow.style.opacity = "1";
      rightArrow.style.opacity = "1";
    };

    const hideArrows = () => {
      leftArrow.style.opacity = "0";
      rightArrow.style.opacity = "0";

      setTimeout(() => {
        if (leftArrow.style.opacity === "0") {
          leftArrow.style.display = "none";
          rightArrow.style.display = "none";
        }
      }, 300);
    };

    const isTv = isTvMode();
    const alwaysShow = CONFIG.alwaysShowArrows || isTv;

    if (alwaysShow) {
      showArrows();
    } else {
      container.addEventListener("mouseenter", showArrows);
      container.addEventListener("mouseleave", hideArrows);
    }

    container.addEventListener("mouseenter", onMediaBarHoverAudioEnter);
    container.addEventListener("mouseleave", onMediaBarHoverAudioLeave);

    const onHoverPauseEnter = () => {
      if (typeof isPauseOnHoverEnabled === 'function' && isPauseOnHoverEnabled() && STATE.slideshow.slideInterval) {
        STATE.slideshow.slideInterval.pause();
        const pb = document.querySelector('.media-bar-progress-bar');
        if (pb) pb.classList.add('paused');
      }
    };

    const onHoverPauseLeave = () => {
      if (typeof isPauseOnHoverEnabled === 'function' && isPauseOnHoverEnabled() && STATE.slideshow.slideInterval) {
        STATE.slideshow.slideInterval.resume();
        const pb = document.querySelector('.media-bar-progress-bar');
        if (pb) pb.classList.remove('paused');
      }
    };

    let videoHoverPaused = false;

    container.addEventListener("mouseover", (e) => {
      const videoBackdrop = e.target.closest(".video-backdrop");
      if (videoBackdrop) {
        const slide = videoBackdrop.closest(".slide");
        if (slide) {
          slide.classList.add("video-hovered");
        }
        if (STATE.slideshow.slideInterval && !isPauseOnHoverEnabled() && !videoHoverPaused) {
          STATE.slideshow.slideInterval.pause();
          videoHoverPaused = true;
          const pb = document.querySelector(".media-bar-progress-bar");
          if (pb) pb.classList.add("paused");
        }
      }
    });

    container.addEventListener("mouseout", (e) => {
      const videoBackdrop = e.target.closest(".video-backdrop");
      const relatedVideo = e.relatedTarget instanceof Element && e.relatedTarget.closest(".video-backdrop");
      if (videoBackdrop && !relatedVideo) {
        const slide = videoBackdrop.closest(".slide");
        if (slide) {
          slide.classList.remove("video-hovered");
        }
        if (videoHoverPaused && STATE.slideshow.slideInterval) {
          STATE.slideshow.slideInterval.resume();
          videoHoverPaused = false;
          const pb = document.querySelector(".media-bar-progress-bar");
          if (pb) pb.classList.remove("paused");
        }
      }
    });

    container.addEventListener("mouseleave", () => {
      if (videoHoverPaused && STATE.slideshow.slideInterval) {
        STATE.slideshow.slideInterval.resume();
        videoHoverPaused = false;
        const pb = document.querySelector(".media-bar-progress-bar");
        if (pb) pb.classList.remove("paused");
      }
    });

    container.addEventListener("mouseenter", onHoverPauseEnter);
    container.addEventListener("mouseleave", onHoverPauseLeave);

    let arrowTimeout;
    container.addEventListener(
      "touchstart",
      () => {
        if (arrowTimeout) {
          clearTimeout(arrowTimeout);
        }

        showArrows();

        arrowTimeout = setTimeout(hideArrows, 2000);
      },
      { passive: true }
    );
  };

  const MediaBarEnhancedSettingsManager = {
    initialized: false,

    init() {
      if (this.initialized) return;
      if (!CONFIG.enableClientSideSettings) return;

      this.initialized = true;
      this.injectSettingsIcon();
      console.log("🎬 Media Bar:", "Client-Side Settings Manager initialized.");
    },

    settingDrafts: new Map(),
    trailerDrafts: new Map(),

    getSetting(key, defaultValue) {
      return this.settingDrafts.get(key) ?? defaultValue;
    },

    setSetting(key, value) {
      if (CONFIG.enableClientSideSettings) this.settingDrafts.set(key, value);
    },

    personalKey(key) {
      const { serverId, userId } = STATE.jellyfinData;
      return `mediaBarEnhancedUser-${serverId}-${userId}-${key}`;
    },

    readPersonal(key, fallback) {
      try { return JSON.parse(localStorage.getItem(this.personalKey(key))) ?? fallback; }
      catch { return fallback; }
    },

    getPublishedPreference(key, configKey, fallback) {
      let published = fallback;
      try { published = JSON.parse(CONFIG[configKey]) ?? fallback; } catch { /* Use defaults. */ }
      return this.trailerDrafts.get(key) ?? published;
    },

    async publishSettings(switches) {
      const api = window.ApiClient;
      const pluginId = "d7e11d57-819b-4bdd-a88d-53c5f5560225";
      const config = await api.getPluginConfiguration(pluginId);
      const aliases = {
        enabled: "IsEnabled", slideAnimations: "SlideAnimationEnabled",
        videoBackdrops: "EnableVideoBackdrop", splitScreenTrailer: "EnableSplitScreenTrailer",
        trailerButton: "ShowTrailerButton", mobileVideo: "EnableMobileVideo",
        waitForTrailer: "WaitForTrailerToEnd", randomTrailerStart: "RandomTrailerStartOffset",
        mobileMode: "MobileCompactMode", menuLocation: "ClientMenuLocation",
        menuLocationMobile: "ClientMenuLocationMobile", youtubeInset: "YoutubeInset",
        excludedLibraries: "PublishedExcludedLibraryIds"
      };
      const fields = [...switches.map(setting => setting.key), "mobileMode", "menuLocation",
        "menuLocationMobile", "activePlaylist", "dotStyle", "transitionEffect",
        "defaultTrailerVolume", "progressBarLocation", "excludedLibraries",
        "popupColorScheme", "shufflePublishedLineup", "savedLineups"];
      for (const key of fields) {
        const value = this.getSetting(key, null);
        if (value === null) continue;
        const name = aliases[key] || key[0].toUpperCase() + key.slice(1);
        config[name] = key === "defaultTrailerVolume" ? Number(value) : value;
      }
      for (const [key, name] of Object.entries({
        lineup: "PublishedLineup", trailers: "PublishedTrailers", trailerCrops: "PublishedTrailerFraming"
      })) {
        const value = this.trailerDrafts.get(key);
        if (value !== undefined) config[name] = JSON.stringify(value);
      }
      await api.updatePluginConfiguration(pluginId, config);
    },

    writePersonal(key, value) {
      localStorage.setItem(this.personalKey(key), JSON.stringify(value));
    },


    async showTrailerPicker(trailers, itemId) {
      this.trailerWidthPreviewCleanup?.();
      const el = (tag, attrs, content) => SlideUtils.createElement(tag, attrs, content);
      if (!itemId) {
        trailers.replaceChildren(el("p", {}, "No title is playing in Marquee."));
        return;
      }
      const status = el("div", { role: "status" });
      const button = (label, fn, primary = false) => el("button", {
        type: "button",
        className: "media-bar-btn mb-current-trailer-action" + (primary ? " media-bar-btn-submit" : ""),
        onclick: fn,
      }, label);
      trailers.replaceChildren(el("h4", {}, "YouTube trailers"), el("div", {}, "Loading…"));
      const request = trailers.lastChild;
      const item = await ApiUtils.fetchItemDetails(itemId);
      if (!request.parentNode) return;
      const choices = this.getPublishedPreference("trailers", "publishedTrailers", {});
      trailers.replaceChildren(el("h4", {}, item ? `Trailers · ${item.Name}` : "YouTube trailers"));
      if (!item) {
        trailers.append(el("div", {}, "Item unavailable."));
        return;
      }
      const choice = el("select", { "aria-label": "YouTube trailer" });
      choice.append(el("option", { value: "" }, "Automatic"));
      const seen = new Set();
      for (const remote of item.RemoteTrailers || []) {
        const id = ApiUtils.extractYouTubeId(remote?.Url);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        choice.append(el("option", { value: id }, remote.Name || `Trailer ${seen.size}`));
      }
      if (choices[itemId] && !seen.has(choices[itemId])) {
        choice.append(el("option", { value: choices[itemId] }, choices[itemId].length === 32 ? "Saved local trailer" : "Saved YouTube trailer"));
      }
      choice.value = choices[itemId] || "";
      const crop = el("select", { "aria-label": "Trailer framing" });
      crop.append(
        el("option", { value: "" }, "Use default framing"),
        el("option", { value: "original" }, "Fit trailer"),
        el("option", { value: "wide" }, "Widescreen"),
        el("option", { value: "fill" }, "Fill banner height")
      );
      const editorPanel = el("div", { className: "marquee-popup-crop" });
      trailers.append(choice, status, editorPanel);
      status.textContent = "Loading trailer editor…";
      try {
          const api = window.ApiClient;
          const { setupTrailerCropEditor } = await import(api.getUrl("MediaBarEnhanced/Resources/trailerCropEditor.js"));
          if (!editorPanel.isConnected) return;
          editorPanel.innerHTML = `<fieldset id="marqueeCropEditor">
  <legend>Trailer preview</legend>
  <input type="hidden" id="TrailerCropSettings" value="{}" />
  <label>Trailer <input type="text" data-crop-source placeholder="YouTube URL or local trailer item ID" /></label>
  <button type="button" data-crop-load>Preview trailer</button>
  <div data-framing-slot></div>
  <div data-crop-preview style="max-width: 640px; position: relative; overflow: hidden; aspect-ratio: 16 / 9"></div>
  <details>
  <summary>Crop</summary>
  <label>Crop from each edge <input type="range" min="0" max="30" step="0.1" value="0" data-crop-slider /></label>
  <output data-crop-value>0%</output>
  <div class="mb-editor-row">
    <button type="button" data-crop-apply hidden disabled>Stage crop</button>
    <button type="button" data-crop-reset disabled>Clear crop</button>
  </div>
  <p data-crop-status role="status"></p>
  </details>
  <details>
  <summary>Layout and studio logo</summary>
  <fieldset data-studio-settings disabled>
    <legend>Trailer layout</legend>
    <label>Trailer width (%) <input type="number" min="10" max="100" step="1" placeholder="Automatic" data-trailer-width /></label>
    <p class="marquee-width-preview-label" data-width-preview-label role="status"></p>
    <div class="marquee-placement-fields">
      <label>Move left (%) <input type="number" min="-30" max="30" step="1" placeholder="0" data-trailer-left /></label>
      <label>Move down (%) <input type="number" min="-30" max="30" step="1" placeholder="0" data-trailer-down /></label>
      <label>Left fade span (%) <input type="number" min="0" max="100" step="1" placeholder="Default" data-trailer-fade /></label>
      <label>Top fade span (%) <input type="number" min="0" max="100" step="1" placeholder="0" data-trailer-top-fade /></label>
      <label>Bottom fade span (%) <input type="number" min="0" max="100" step="1" placeholder="0" data-trailer-bottom-fade /></label>
      <label>Right fade span (%) <input type="number" min="0" max="100" step="1" placeholder="0" data-trailer-right-fade /></label>
      <label>Fade midpoint (%) <input type="number" min="5" max="95" step="1" placeholder="50" data-trailer-fade-midpoint /></label>
    </div>
    <label><input type="checkbox" checked data-trailer-dim /> Dim video while the trailer plays</label>
    <p class="marquee-width-preview-label">Clear width to use the site default. Offsets are relative to the trailer frame. Fade span sets the distance. A lower midpoint makes the picture become opaque sooner.</p>
    <label><input type="checkbox" data-studio-visible checked /> Show studio logo or name in minimized view</label>
    <label>Scale (%) <input type="number" min="50" max="250" step="1" value="175" required data-studio-scale /></label>
    <label>Studio horizontal offset (%) <input type="number" min="-100" max="100" step="1" placeholder="0" data-studio-x /></label>
    <label>Studio vertical offset (%) <input type="number" min="-100" max="100" step="1" placeholder="0" data-studio-y /></label>
    <div class="marquee-studio-preview" aria-label="Minimized studio preview" data-studio-preview></div>
  </fieldset>
  </details>
</fieldset>`;
          const editor = editorPanel.firstElementChild;
          editor.querySelector("[data-framing-slot]").append(crop);
          let useAutomatic = !choice.value;
          editor.querySelector("[data-crop-source]").addEventListener("input", () => {
            choice.value = "";
            useAutomatic = false;
          });
          editor.querySelector("[data-crop-reset]").addEventListener("click", () => {
            editor.querySelector("[data-crop-status]").textContent = "Crop cleared in preview. Save trailer setup to apply.";
          });
          const cropSlider = editor.querySelector("[data-crop-slider]");
          editor.querySelector("#TrailerCropSettings").value = CONFIG.trailerCropSettings;
          const pluginId = "d7e11d57-819b-4bdd-a88d-53c5f5560225";
          const studioSettings = editor.querySelector("[data-studio-settings]");
          const visible = studioSettings.querySelector("[data-studio-visible]");
          const scale = studioSettings.querySelector("[data-studio-scale]");
          const studioX = studioSettings.querySelector("[data-studio-x]");
          const studioY = studioSettings.querySelector("[data-studio-y]");
          const studioPreview = studioSettings.querySelector("[data-studio-preview]");
          const studioArt = SlideCreator.createStudioLogos(item);
          studioArt?.querySelectorAll('a').forEach(link => link.removeAttribute('href'));
          studioPreview.append(studioArt || el("span", {}, (item.Studios || []).map(studio => studio.Name).filter(Boolean).join(" · ")));
          const readStudio = () => ({
            visible: visible.checked, scale: scale.valueAsNumber,
            studioX: studioX.valueAsNumber || 0, studioY: studioY.valueAsNumber || 0
          });
          const dim = studioSettings.querySelector("[data-trailer-dim]");
          const placementInputs = Object.fromEntries([
            ["width", "width"], ["left", "left"], ["down", "down"], ["fade", "fade"],
            ["topFade", "top-fade"], ["bottomFade", "bottom-fade"], ["rightFade", "right-fade"], ["fadeMidpoint", "fade-midpoint"]
          ].map(([key, attr]) => [key, studioSettings.querySelector("[data-trailer-" + attr + "]")]));
          let widthEdited = false;
          const readPlacement = () => ({
            ...Object.fromEntries(Object.entries(placementInputs).map(([key, input]) =>
              [key, (key !== "width" || widthEdited) && Number.isFinite(input.valueAsNumber)
                ? input.valueAsNumber : null])),
            dim: dim.checked
          });
          const fields = [...Object.values(placementInputs), studioX, studioY];
          const ranges = Object.entries(placementInputs).map(([key, input]) => {
            const range = el("input", { type: "range", min: input.min, max: input.max, step: input.step,
              className: "marquee-placement-range", "aria-label": input.closest("label").textContent.trim() });
            input.closest("label").after(range);
            range.addEventListener("input", () => {
              input.value = range.value;
              input.dispatchEvent(new Event("input"));
            });
            return { key, input, range };
          });
          let studioTrailerId;
          let previewSlide;
          let previewId;
          const restoreTrailerWidth = () => {
            if (previewSlide?.isConnected) {
              previewSlide.classList.remove("marquee-preview-compact-studio");
              SlideUtils.applyTrailerStudioLogoSettings(previewSlide, previewId);
            }
            previewSlide = previewId = null;
          };
          this.trailerWidthPreviewCleanup = restoreTrailerWidth;
          const showWidthPreview = () => {
            if (!studioTrailerId || !fields.every(input => input.validity.valid)) return;
            restoreTrailerWidth();
            const placement = readPlacement();
            const studio = readStudio();
            SlideUtils.setTrailerStudioAppearance(studioPreview, studio);
            const percent = placementInputs.width.valueAsNumber || CONFIG.trailerWidthPercent;
            for (const { key, input, range } of ranges) {
              const fallback = key === "width" ? percent || Number(range.min) : key === "fade" ? 12 : key === "fadeMidpoint" ? 50 : 0;
              range.value = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : fallback;
              const position = (range.valueAsNumber - Number(range.min)) / (Number(range.max) - Number(range.min));
              range.style.setProperty("--marquee-range-fill", position * 100 + "%");
            }
            studioSettings.querySelector("[data-width-preview-label]").textContent = percent
              ? percent + "% from the right" + (widthEdited ? "" : " (inherited)")
              : "Automatic width";
            const slide = document.querySelector("#slides-container .slide.active");
            const backdrop = slide?.querySelector(".video-backdrop[data-marquee-trailer-id]");
            if (backdrop?.dataset.marqueeTrailerId === studioTrailerId) {
              previewSlide = slide;
              previewId = studioTrailerId;
              SlideUtils.setTrailerPlacement(slide, placement);
              slide.classList.add("marquee-preview-compact-studio");
              SlideUtils.setTrailerStudioAppearance(slide, studio);
            }
          };
          fields.forEach(input => input.addEventListener("input", () => {
            if (input === placementInputs.width) widthEdited = true;
            showWidthPreview();
          }));
          visible.addEventListener("change", () => {
            scale.disabled = !visible.checked;
            showWidthPreview();
          });
          scale.addEventListener("input", showWidthPreview);
          dim.addEventListener("change", showWidthPreview);
          const openTrailer = setupTrailerCropEditor(editor, null, id => {
            restoreTrailerWidth();
            studioTrailerId = id;
            studioSettings.disabled = !id;
            crop.value = this.getPublishedPreference("trailerCrops", "publishedTrailerFraming", {})[id] || "";
            const settings = SlideUtils.getTrailerStudioLogoSettings(id);
            visible.checked = settings.visible !== false;
            dim.checked = settings.dim !== false;
            scale.value = settings.scale ?? 175;
            studioX.value = settings.studioX ?? "";
            studioY.value = settings.studioY ?? "";
            for (const [key, input] of Object.entries(placementInputs)) input.value = settings[key] ?? "";
            const banner = document.querySelector("#slides-container .slide.active");
            const backdrop = banner?.querySelector(".video-backdrop[data-marquee-trailer-id]");
            const measuredWidth = id && backdrop?.dataset.marqueeTrailerId === id && banner.clientWidth
              ? Math.round(100 * backdrop.offsetWidth / banner.clientWidth) : 0;
            const effectiveWidth = settings.width || CONFIG.trailerWidthPercent || measuredWidth;
            placementInputs.width.value = effectiveWidth >= 10 && effectiveWidth <= 100 ? effectiveWidth : "";
            widthEdited = Number.isFinite(settings.width);
            scale.disabled = !visible.checked;
            showWidthPreview();
          });
          const slide = document.getElementById("slides-container")?.querySelector(".slide.active");
          const active = slide?.dataset.itemId === itemId ? slide : null;
          const localUrl = active?.querySelector("video.video-backdrop")?.getAttribute("data-src");
          const localId = SlideUtils.getLocalTrailerId(localUrl);
          const playingId = ApiUtils.extractYouTubeId(active?.querySelector(".video-backdrop iframe")?.src);
          const activeId = active?.querySelector("[data-marquee-trailer-id]")?.dataset.marqueeTrailerId;
          let previewRequest = 0;
          const sourceInput = editor.querySelector("[data-crop-source]");
          sourceInput.addEventListener("input", () => { previewRequest++; });
          const previewSelection = async () => {
            const request = ++previewRequest;
            const onlyLocal = this.getSetting("onlyLocalTrailers", CONFIG.onlyLocalTrailers);
            const configured = STATE.slideshow.customTrailerUrls?.[itemId];
            const configuredId = /^[a-f\d]{32}$/i.test(configured || "") ? configured
              : SlideUtils.getLocalTrailerId(configured) || ApiUtils.extractYouTubeId(configured);
            let id = choice.value || activeId || localId || playingId || configuredId;
            if (onlyLocal && id?.length === 11) id = null;
            if (!id && (onlyLocal || CONFIG.preferLocalTrailers || !seen.size)) {
              status.textContent = "Finding a local trailer…";
              id = SlideUtils.getLocalTrailerId(await ApiUtils.fetchLocalTrailer(item));
            }
            if (request !== previewRequest || !editor.isConnected) return;
            if (!id && !onlyLocal) id = seen.values().next().value;
            openTrailer(id, true);
            status.textContent = id ? "" : "No trailer found. Enter a trailer URL or local ID.";
          };
          choice.addEventListener("change", () => {
            useAutomatic = !choice.value;
            previewSelection();
          });
          previewSelection();
          const saveButton = button("Save trailer setup", async () => {
            const id = studioTrailerId;
            if (!id || !scale.reportValidity() || !fields.every(input => input.reportValidity())) {
              if (!id) status.textContent = "Preview a trailer before saving.";
              return;
            }
            if (id.length === 11 && this.getSetting("onlyLocalTrailers", CONFIG.onlyLocalTrailers)) {
              status.textContent = "Turn off Local Trailers Only to use a YouTube trailer.";
              return;
            }
            saveButton.disabled = true;
            try {
              const config = await api.getPluginConfiguration(pluginId);
              const patch = (key, entry, value) => {
                let map;
                try { map = JSON.parse(config[key]) || {}; } catch { map = {}; }
                if (value === undefined) delete map[entry];
                else map[entry] = value;
                config[key] = JSON.stringify(map);
              };
              const amount = Number(cropSlider.value);
              const cropChanged = amount !== (SlideUtils.getConfiguredTrailerCrop(id) ?? 0);
              patch("PublishedTrailers", itemId, useAutomatic && !cropChanged ? undefined : id);
              patch("TrailerCropSettings", id, amount > 0 ? amount : undefined);
              patch("PublishedTrailerFraming", id, crop.value || undefined);
              patch("TrailerStudioLogoSettings", id, { ...readStudio(), ...readPlacement() });
              await api.updatePluginConfiguration(pluginId, config);
              try { sessionStorage.setItem("marquee-return-" + STATE.jellyfinData.userId, itemId); }
              catch { /* Reload still applies the saved changes. */ }
              location.reload();
            } catch {
              status.textContent = "Could not save trailer setup. Try again.";
            } finally {
              saveButton.disabled = false;
            }
          }, true);
          trailers.append(status, saveButton);
      } catch {
        status.textContent = "Could not load the trailer editor.";
      }
    },


    setupLineupEditor(editor, showTrailer, save) {
      const el = (tag, attrs, content) => SlideUtils.createElement(tag, attrs, content);
      const names = new Map();
      const published = this.getPublishedPreference("lineup", "publishedLineup", []);
      const displayed = STATE.slideshow.itemIds.slice();
      let automatic = !published.length;
      let lineup = automatic ? displayed.slice() : published.slice();
      let presets;
      try { presets = JSON.parse(this.getSetting("savedLineups", CONFIG.savedLineups)); }
      catch { presets = []; }
      if (!Array.isArray(presets)) presets = [];
      const picks = el("div", { className: "mb-editor-stack" });
      const results = el("div", { className: "mb-editor-stack marquee-lineup-results" });
      const query = el("input", { type: "search", placeholder: "Find a movie or series", "aria-label": "Find a movie or series" });
      const button = (label, fn, title = label) => el("button", {
        type: "button", className: "media-bar-btn", title, "aria-label": title, onclick: fn
      }, label);
      const shuffle = el("input", { type: "checkbox" });
      shuffle.checked = this.getSetting("shufflePublishedLineup", CONFIG.shufflePublishedLineup);
      const shuffleLabel = el("label", {}, "Shuffle on playback");
      shuffleLabel.prepend(shuffle);
      const playlist = el("select", { "aria-label": "Saved lineup playlist" });
      const name = el("input", { type: "text", placeholder: "Playlist name", maxlength: "80", "aria-label": "Playlist name" });
      const status = el("p", { role: "status" });
      const refreshPlaylists = () => {
        playlist.replaceChildren(el("option", { value: "" }, "Load saved lineup…"));
        presets.forEach((entry, index) => playlist.append(el("option", { value: String(index) }, entry.name)));
      };
      const rows = () => {
        picks.replaceChildren();
        if (!lineup.length) picks.append(el("p", {}, automatic
          ? "Automatic picks will load on Home after applying."
          : "Add a title to this lineup."));
        lineup.forEach((id, index) => {
          const label = names.get(id) || "Loading title…";
          const move = delta => {
            const target = index + delta;
            if (target < 0 || target >= lineup.length) return;
            [lineup[index], lineup[target]] = [lineup[target], lineup[index]];
            automatic = false;
            rows();
            picks.children[target]?.querySelector(delta < 0 ? "[data-up]" : "[data-down]")?.focus();
          };
          const row = el("div", { className: "mb-editor-row marquee-lineup-item" });
          const up = button("↑", () => move(-1), "Move up: " + label);
          const down = button("↓", () => move(1), "Move down: " + label);
          up.dataset.up = down.dataset.down = "";
          up.disabled = index === 0;
          down.disabled = index === lineup.length - 1;
          const remove = button("delete", () => { lineup.splice(index, 1); automatic = false; rows(); }, "Remove " + label);
          remove.classList.add("material-icons");
          row.append(el("span", {}, label), button("Trailers", () => showTrailer(id)));
          row.append(up, down, remove);
          picks.append(row);
        });
      };
      const loadNames = async () => {
        await Promise.all(lineup.filter(id => !names.has(id)).map(async id => {
          const item = await ApiUtils.fetchItemDetails(id);
          names.set(id, item?.Name || "Unavailable title");
        }));
        rows();
      };
      playlist.addEventListener("change", () => {
        if (!playlist.value) return;
        const entry = presets[Number(playlist.value)];
        lineup = entry.ids.slice();
        automatic = false;
        shuffle.checked = !!entry.shuffle;
        name.value = entry.name;
        rows();
        loadNames();
      });
      const savePlaylist = button("Save lineup playlist", async () => {
        const title = name.value.trim();
        if (!title || !lineup.length) {
          status.textContent = "Enter a playlist name and add at least one title.";
          return;
        }
        const index = presets.findIndex(entry => entry.name.toLowerCase() === title.toLowerCase());
        const entry = { name: title, ids: lineup.slice(), shuffle: shuffle.checked };
        if (index < 0) presets.push(entry);
        else presets[index] = entry;
        this.setSetting("savedLineups", JSON.stringify(presets));
        await save();
      });
      let sequence = 0;
      let timer;
      const add = item => {
        if (!lineup.includes(item.Id)) {
          lineup.push(item.Id);
          automatic = false;
        }
        query.value = "";
        sequence++;
        results.replaceChildren();
        rows();
        query.focus();
      };
      const search = async (confirmFirst = false) => {
        const term = query.value.trim();
        const request = ++sequence;
        results.replaceChildren();
        if (!term) return;
        try {
          const { serverAddress, userId } = STATE.jellyfinData;
          const params = new URLSearchParams({ UserId: userId, SearchTerm: term, Recursive: "true",
            IncludeItemTypes: "Movie,Series", Limit: "15", EnableTotalRecordCount: "false" });
          if (CONFIG.maxParentalRating) params.set("MaxOfficialRating", CONFIG.maxParentalRating);
          const response = await fetch(serverAddress + "/Items?" + params, { headers: ApiUtils.getAuthHeaders() });
          if (!response.ok) throw Error(response.status);
          const { Items = [] } = await response.json();
          if (request !== sequence || !editor.isConnected) return;
          const choices = Items.filter(item => !lineup.includes(item.Id));
          for (const item of choices) names.set(item.Id, [item.Name, item.ProductionYear, item.Type].filter(Boolean).join(" · "));
          if (confirmFirst && choices.length) { add(choices[0]); return; }
          if (!choices.length) results.append(el("p", {}, "No additional matches."));
          for (const item of choices) results.append(button(names.get(item.Id), () => add(item), "Add " + names.get(item.Id)));
        } catch {
          if (request === sequence) results.replaceChildren(el("p", {}, "Search failed. Try again."));
        }
      };
      query.addEventListener("input", () => {
        clearTimeout(timer);
        sequence++;
        results.replaceChildren();
        timer = setTimeout(search, 220);
      });
      query.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        event.stopPropagation();
        clearTimeout(timer);
        search(true);
      });
      const actions = el("div", { className: "mb-editor-row" });
      actions.append(
        button("Use automatic lineup", () => { automatic = true; lineup = []; rows(); }),
        button("Apply lineup", async () => {
          if (!automatic && !lineup.length) {
            status.textContent = "Add a title or choose Use automatic lineup.";
            return;
          }
          this.trailerDrafts.set("lineup", automatic ? [] : lineup.slice());
          this.setSetting("shufflePublishedLineup", shuffle.checked);
          this.writePersonal("daily", null);
          await save();
        })
      );
      const playlistRow = el("div", { className: "mb-editor-row" });
      playlistRow.append(playlist, name, savePlaylist);
      editor.append(query, results, picks, shuffleLabel, actions, playlistRow, status);
      refreshPlaylists();
      rows();
      loadNames();
    },

    createIcon() {
      const button = document.createElement('button');
      button.type = 'button';

      const isV12Active = isV12();

      if (isV12Active) {
        button.className = 'MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeLarge headerButton media-bar-settings-button';
      } else {
        button.className = 'headerSyncButton syncButton headerButton headerButtonRight paper-icon-button-light media-bar-settings-button';
      }

      button.title = 'Marquee Settings';
      button.setAttribute('aria-label', button.title);
      button.appendChild(SlideUtils.createElement('span', { className: 'media-bar-navbar-mark', 'aria-hidden': 'true' }));
      button.style.verticalAlign = 'middle';

      button.addEventListener('click', (e) => {
        this.toggleSettingsPopup(button);
      });

      return button;
    },

    injectSettingsIcon() {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia("only screen and (max-width: 768px)").matches;
      const menuLocation = isMobile
        ? this.getSetting('menuLocationMobile', CONFIG.clientMenuLocationMobile)
        : this.getSetting('menuLocation', CONFIG.clientMenuLocation);
      let debounceTimer = null;

      const tryInject = () => {
        const header = document.querySelector('.skinHeader')
          || document.querySelector('[class*="skinHeader"]')
          || document.querySelector('.appHeader')
          || document.querySelector('[class*="appHeader"]')
          || document.querySelector('header');

        let targetButton = document.querySelector('[aria-controls="app-sync-play-menu"]');

        if (!targetButton && header) {
          targetButton = header.querySelector('.headerUserButton')
            || header.querySelector('[class*="headerUserButton"]')
            || header.querySelector('.btnMyUser')
            || header.querySelector('[class*="btnMyUser"]')
            || header.querySelector('.headerButtonRight')
            || header.querySelector('[class*="headerButtonRight"]');
          if (!targetButton) {
            const candidates = Array.from(header.querySelectorAll('button, a, [role="button"]')).filter(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden';
            });
            if (candidates.length > 0) {
              targetButton = candidates[candidates.length - 1];
            }
          }
        }

        const headerRight = targetButton?.parentNode
          || document.querySelector('.headerRight')
          || document.querySelector('[class*="headerRight"]')
          || document.querySelector('.headerButtonRight')?.parentNode
          || document.querySelector('[class*="headerButtonRight"]')?.parentNode;

        const shouldInjectNavbar = menuLocation === 'Navbar' || menuLocation === 'Navbar+Sidebar' || menuLocation === 'Navbar+UserMenu' || menuLocation === 'All' || menuLocation === 'Both';
        const shouldInjectSidebar = menuLocation === 'Sidebar' || menuLocation === 'Navbar+Sidebar' || menuLocation === 'All' || menuLocation === 'Both';
        const shouldInjectUserMenu = menuLocation === 'UserMenu' || menuLocation === 'Navbar+UserMenu' || menuLocation === 'All' || menuLocation === 'Both';

        // 1. Inject to Navbar if "Navbar", "Both" or "All"
        if (shouldInjectNavbar) {
          if (headerRight && !headerRight.querySelector('.media-bar-settings-button')) {
            const icon = this.createIcon();
            const isV12Active = isV12();
            if (isV12Active && targetButton && targetButton.parentNode === headerRight) {
              headerRight.insertBefore(icon, targetButton);
            } else {
              headerRight.prepend(icon);
            }
          }
        }

        // 2. Inject to Sidebar Drawer
        if (shouldInjectSidebar) {
          // 10.11.x Sidebar Drawer (targets .customMenuOptions / .sidebarLinks, which only exist in main user drawer like alt.js)
          const container = document.querySelector('.mainDrawer .customMenuOptions, .mainDrawer .sidebarLinks, .mainDrawer-scrollContainer .sidebarLinks');
          if (container && !container.querySelector('.media-bar-sidebar-settings-link')) {
            if (container.classList.contains('customMenuOptions')) {
              container.style.display = 'block';
            }

            let headerEl = container.querySelector('.media-bar-sidebar-header');
            if (!headerEl && (container.classList.contains('customMenuOptions') || container.classList.contains('sidebarLinks'))) {
              headerEl = document.createElement('h3');
              headerEl.className = 'sidebarHeader media-bar-sidebar-header';
              headerEl.textContent = 'Media Bar';
            }

            const link = document.createElement('a');
            link.className = 'sidebarLink navMenuOption media-bar-sidebar-settings-link lnkMediaFolder';
            link.href = '#';
            link.setAttribute('is', 'emby-linkbutton');

            // Add logo icon
            const logoImg = document.createElement('img');
            logoImg.className = 'sidebarLinkIcon navMenuOptionIcon';
            logoImg.src = `${STATE.jellyfinData.serverAddress}/MediaBarEnhanced/Resources/assets/marquee-mark.svg`;
            logoImg.draggable = false;
            Object.assign(logoImg.style, {
              width: '24px',
              height: '24px',
              verticalAlign: 'middle',
              marginRight: '1.2em',
              pointerEvents: 'none'
            });

            // Add text
            const textSpan = document.createElement('span');
            textSpan.className = 'sidebarLinkText navMenuOptionText';
            let locale = LocalizationUtils.cachedLocale || 'en';
            locale = locale.split('-')[0].toLowerCase();
            const t = CLIENT_MENU_TRANSLATIONS[locale] ? CLIENT_MENU_TRANSLATIONS[locale] : CLIENT_MENU_TRANSLATIONS['en'];
            textSpan.textContent = t.title;

            link.appendChild(logoImg);
            link.appendChild(textSpan);

            link.addEventListener('click', (e) => {
              e.preventDefault();
              this.toggleSettingsPopup(link);
            });

            const seasonalHeader = container.querySelector('.seasonal-sidebar-header');
            if (seasonalHeader) {
              container.insertBefore(headerEl, seasonalHeader);
              container.insertBefore(link, seasonalHeader);
            } else {
              container.appendChild(headerEl);
              container.appendChild(link);
            }
          }

          // Jellyfin v12 MUI Drawer
          const isDashboard = window.location.href.includes('dashboard') || document.body.classList.contains('dashboardDocument');
          const muiDrawer = document.querySelector('.MuiDrawer-paper');
          if (muiDrawer && !isDashboard && !muiDrawer.querySelector('.media-bar-sidebar-settings-link')) {
            let locale = LocalizationUtils.cachedLocale || 'en';
            locale = locale.split('-')[0].toLowerCase();
            const t = CLIENT_MENU_TRANSLATIONS[locale] ? CLIENT_MENU_TRANSLATIONS[locale] : CLIENT_MENU_TRANSLATIONS['en'];

            const muiList = muiDrawer.querySelector('ul.MuiList-root, .MuiList-root');
            if (muiList) {
              const header = document.createElement('div');
              header.className = 'media-bar-sidebar-header';
              header.style.padding = '16px 16px 8px 16px';
              header.style.fontWeight = '500';
              header.style.fontSize = '0.85rem';
              header.style.letterSpacing = '0.04em';
              header.style.opacity = '0.7';
              header.textContent = 'Media Bar';

              const li = document.createElement('li');
              li.className = 'MuiListItem-root media-bar-sidebar-settings-link';
              li.style.listStyle = 'none';
              li.innerHTML = `
                <a class="MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters" href="#" style="width: 100%; display: flex; align-items: center; text-decoration: none; color: inherit; padding: 8px 16px;">
                  <div class="MuiListItemIcon-root" style="min-width: 36px; display: inline-flex; align-items: center;">
                    <img src="${STATE.jellyfinData.serverAddress}/MediaBarEnhanced/Resources/assets/marquee-mark.svg" style="width: 20px; height: 20px; vertical-align: middle; pointer-events: none;" />
                  </div>
                  <div class="MuiListItemText-root">
                    <span class="MuiTypography-root MuiTypography-body1">${t.title}</span>
                  </div>
                </a>
              `;

              li.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSettingsPopup(li);
              });

              const seasonalItem = muiList.querySelector('.seasonal-sidebar-header, .seasonal-sidebar-settings-link');
              if (seasonalItem) {
                muiList.insertBefore(header, seasonalItem);
                muiList.insertBefore(li, seasonalItem);
              } else {
                muiList.appendChild(header);
                muiList.appendChild(li);
              }
            }
          }
        }

        // 3. Inject to User Profile Menu
        if (shouldInjectUserMenu) {
          let locale = LocalizationUtils.cachedLocale || 'en';
          locale = locale.split('-')[0].toLowerCase();
          const t = CLIENT_MENU_TRANSLATIONS[locale] ? CLIENT_MENU_TRANSLATIONS[locale] : CLIENT_MENU_TRANSLATIONS['en'];

          // A) 10.11.x Sidebar Drawer
          const drawerUserOptions = document.querySelector('.mainDrawer .userMenuOptions, .mainDrawer-scrollContainer .userMenuOptions');
          if (drawerUserOptions && !drawerUserOptions.querySelector('.media-bar-usermenu-drawer-link')) {
            const link = document.createElement('a');
            link.className = 'sidebarLink navMenuOption media-bar-usermenu-drawer-link lnkMediaFolder';
            link.href = '#';
            link.setAttribute('is', 'emby-linkbutton');

            const logoImg = document.createElement('img');
            logoImg.className = 'sidebarLinkIcon navMenuOptionIcon';
            logoImg.src = `${STATE.jellyfinData.serverAddress}/MediaBarEnhanced/Resources/assets/marquee-mark.svg`;
            logoImg.draggable = false;
            Object.assign(logoImg.style, {
              width: '24px',
              height: '24px',
              verticalAlign: 'middle',
              marginRight: '1.2em',
              pointerEvents: 'none'
            });

            const textSpan = document.createElement('span');
            textSpan.className = 'sidebarLinkText navMenuOptionText';
            textSpan.textContent = t.title;

            link.appendChild(logoImg);
            link.appendChild(textSpan);

            link.addEventListener('click', (e) => {
              e.preventDefault();
              this.toggleSettingsPopup(link);
            });

            const btnSettings = drawerUserOptions.querySelector('.btnSettings, [data-itemid="settings"]');
            const btnLogout = drawerUserOptions.querySelector('.btnLogout, [data-itemid="logout"]');
            if (btnSettings && btnSettings.nextSibling) {
              drawerUserOptions.insertBefore(link, btnSettings.nextSibling);
            } else if (btnLogout) {
              drawerUserOptions.insertBefore(link, btnLogout);
            } else {
              drawerUserOptions.appendChild(link);
            }
          }

          // B) Profile Picture Popup Menu (MUI <Menu id="app-user-menu">, Popovers, Modals)
          const isElementHidden = (el) => {
            if (!el) return true;
            if (el.getAttribute('aria-hidden') === 'true') return true;
            if (el.classList?.contains('MuiModal-hidden')) return true;
            const popover = el.closest('#app-user-menu, .MuiPopover-root, .MuiModal-root, [role="presentation"]');
            if (popover) {
              if (popover.getAttribute('aria-hidden') === 'true') return true;
              if (popover.classList?.contains('MuiModal-hidden')) return true;
              const pStyle = window.getComputedStyle(popover);
              if (pStyle.display === 'none' || pStyle.visibility === 'hidden' || pStyle.opacity === '0') return true;
            }
            const style = window.getComputedStyle(el);
            return style.display === 'none' || style.visibility === 'hidden';
          };

          const userMenuCandidates = Array.from(document.querySelectorAll('#app-user-menu, #app-user-menu .MuiMenu-list, #app-user-menu ul, .MuiMenu-paper .MuiMenu-list, .MuiMenu-paper ul, .MuiPopover-paper ul, .MuiModal-root ul, div[role="presentation"] ul, [role="menu"]'))
            .filter(menu => !menu.closest('.MuiDrawer-root, .MuiDrawer-paper, .mainDrawer, .navDrawer'));

          let muiUserMenu = userMenuCandidates.find(menu => {
            if (isElementHidden(menu)) return false;
            if (menu.closest('.MuiDrawer-root, .MuiDrawer-paper, .mainDrawer, .navDrawer')) return false;
            if (menu.id === 'app-user-menu' || menu.closest('#app-user-menu')) return true;
            const items = Array.from(menu.children);
            return items.some(item => {
              if (item.classList?.contains('media-bar-sidebar-settings-link') || item.classList?.contains('media-bar-usermenu-item') || item.classList?.contains('seasonal-sidebar-settings-link') || item.classList?.contains('seasonal-usermenu-item')) return false;
              const href = (item.getAttribute('href') || item.querySelector('a')?.getAttribute('href') || '').toLowerCase();
              const txt = (item.textContent || '').toLowerCase();
              const action = (item.getAttribute('data-action') || '').toLowerCase();
              return href.includes('mypreferences') || action.includes('mypreferences') || txt.includes('einstellungen') || txt.includes('settings') || item.classList.contains('btnLogout') || item.classList.contains('btnSettings');
            });
          });

          if (muiUserMenu && muiUserMenu.tagName !== 'UL' && muiUserMenu.querySelector('ul')) {
            muiUserMenu = muiUserMenu.querySelector('ul');
          }

          if (muiUserMenu && !muiUserMenu.querySelector('.media-bar-usermenu-item')) {
            const li = document.createElement('li');
            li.className = 'MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters media-bar-usermenu-item';
            li.setAttribute('role', 'menuitem');
            li.setAttribute('tabindex', '-1');
            li.style.cssText = 'display: flex !important; align-items: center !important; width: 100% !important; box-sizing: border-box !important; padding: 6px 16px !important; cursor: pointer !important; white-space: nowrap !important; min-height: 36px !important; margin: 0 !important;';

            li.innerHTML = `
              <div class="MuiListItemIcon-root" style="min-width: 36px !important; width: 36px !important; display: inline-flex !important; align-items: center !important; justify-content: flex-start !important; flex-shrink: 0 !important; margin-right: 0 !important;">
                <img src="${STATE.jellyfinData.serverAddress}/MediaBarEnhanced/Resources/assets/marquee-mark.svg" style="width: 20px !important; height: 20px !important; object-fit: contain !important; vertical-align: middle !important; pointer-events: none !important; margin: 0 !important;" />
              </div>
              <div class="MuiListItemText-root" style="flex: 1 1 auto !important; margin: 0 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;">
                <span class="MuiTypography-root MuiTypography-body1" style="white-space: nowrap !important; font-size: 1rem !important; line-height: 1.5 !important; color: inherit !important; display: block !important;">${t.title}</span>
              </div>
            `;

            li.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              this.toggleSettingsPopup(li);
            });

            // Position directly under Settings / mypreferences item
            const settingsItem = Array.from(muiUserMenu.children).find(el => {
              if (el.classList?.contains('media-bar-sidebar-settings-link') || el.classList?.contains('media-bar-usermenu-item') || el.classList?.contains('seasonal-sidebar-settings-link') || el.classList?.contains('seasonal-usermenu-item')) return false;
              const txt = (el.textContent || '').toLowerCase();
              const href = (el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || '').toLowerCase();
              const action = (el.getAttribute('data-action') || '').toLowerCase();
              return href.includes('mypreferences') || action.includes('mypreferences') || txt.includes('settings') || txt.includes('einstellungen');
            });

            if (settingsItem) {
              if (settingsItem.nextSibling) {
                muiUserMenu.insertBefore(li, settingsItem.nextSibling);
              } else {
                muiUserMenu.appendChild(li);
              }
            } else {
              muiUserMenu.appendChild(li);
            }
          }

          // C) 10.11.x MyPreferences Menu Page
          const prefMenuSection = document.querySelector('#myPreferencesMenuPage:not(.hide) .verticalSection, .myPreferencesMenuPage:not(.hide) .verticalSection');
          if (prefMenuSection && !prefMenuSection.querySelector('.media-bar-prefpage-link')) {
            const link = document.createElement('a');
            link.id = 'mediaBarUserPrefsLink';
            link.setAttribute('is', 'emby-linkbutton');
            link.setAttribute('data-ripple', 'false');
            link.href = '#';
            link.className = 'listItem-border emby-button media-bar-prefpage-link';
            link.style.display = 'block';
            link.style.padding = '0';
            link.style.margin = '0';

            link.innerHTML = `
              <div class="listItem" style="height: 53px; min-height: 53px; box-sizing: border-box;">
                <img src="${STATE.jellyfinData.serverAddress}/MediaBarEnhanced/Resources/assets/marquee-mark.svg" class="listItemIcon listItemIcon-transparent" style="width: 24px; height: 24px; vertical-align: middle; pointer-events: none;" />
                <div class="listItemBody">
                  <div class="listItemBodyText">${t.title}</div>
                </div>
              </div>
            `;

            link.addEventListener('click', (e) => {
              e.preventDefault();
              this.toggleSettingsPopup(link);
            });

            // Insert into upper section (like Jellyfin Enhanced)
            prefMenuSection.appendChild(link);
          }
        }

        // 4. Ensure Media Bar settings button is always immediately to the left of Seasonals settings button
        if (headerRight) {
          const mbBtn = headerRight.querySelector('.media-bar-settings-button');
          const seasBtn = headerRight.querySelector('.seasonal-settings-button');
          if (mbBtn && seasBtn && mbBtn.nextElementSibling !== seasBtn) {
            seasBtn.parentNode.insertBefore(mbBtn, seasBtn);
          }
        }
      };

      const observer = new MutationObserver((mutations) => {
        if (document.hidden || STATE.slideshow.isSuspended) return;
        const container = document.getElementById("slides-container");
        if (container && mutations.every(record => container.contains(record.target))) return;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(tryInject, 100);
      });
      window.addEventListener("focus", tryInject);

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'class', 'style']
      });

      const handleUserAvatarTrigger = (e) => {
        if (e.target && e.target.closest('button, a, [role="button"], .mainDrawerButton, [class*="mainDrawerButton"], .barsMenuButton, .headerUserButton, [class*="headerUserButton"], .btnMyUser, [class*="btnMyUser"], [aria-label*="UserMenu"], [aria-label*="Profile"], [aria-label*="Profil"], [aria-label*="Benutzer"], [aria-controls="app-user-menu"], .headerUserButtonImage, [class*="headerUserButtonImage"], [class*="UserAvatar"], .MuiAvatar-root, .MuiAvatar-img')) {
          setTimeout(tryInject, 20);
          setTimeout(tryInject, 100);
          setTimeout(tryInject, 250);
          setTimeout(tryInject, 500);
        }
      };

      document.addEventListener('click', handleUserAvatarTrigger, true);
      document.addEventListener('touchstart', handleUserAvatarTrigger, { passive: true, capture: true });

      // Initial injection attempt without waiting for mutations
      tryInject();
    },

    createPopup(anchorElement) {
      this.closePopup(false);

      // Only the Navbar header icon opens as a dropdown; ALL other buttons open as a centered modal!
      const isNavbarButton = anchorElement && anchorElement.classList.contains('media-bar-settings-button');
      const isModal = !isNavbarButton;

      let overlay = null;
      if (isModal) {
        overlay = document.createElement('div');
        overlay.className = 'media-bar-modal-overlay';
        document.body.appendChild(overlay);
      }

      const popup = document.createElement('div');
      popup.className = `media-bar-settings-popup dialog ${isModal ? 'media-bar-modal' : 'media-bar-dropdown'}`;

      if (!isModal) {
        const rect = anchorElement.getBoundingClientRect();
        let rightPos = window.innerWidth - rect.right;
        if (window.innerWidth < 450 || (window.innerWidth - rightPos) < 260) {
          popup.style.right = '1rem';
          popup.style.left = 'auto';
        } else {
          popup.style.right = `${rightPos}px`;
          popup.style.left = 'auto';
        }
        popup.style.top = `${rect.bottom + 10}px`;
      }

      let locale = LocalizationUtils.cachedLocale || 'en';
      locale = locale.split('-')[0].toLowerCase();
      const t = CLIENT_MENU_TRANSLATIONS[locale] ? CLIENT_MENU_TRANSLATIONS[locale] : CLIENT_MENU_TRANSLATIONS['en'];

      const generalSettings = [
        { key: "showReviewScores", label: "Review Scores", description: "Show available audience and critic scores.", default: CONFIG.showReviewScores },
        { key: "dailyFive", label: "Daily Five", description: "Show up to five mixed picks per day.", default: CONFIG.dailyFive },
        { key: 'hideSlideActionButtons', label: t.hideSlideActionButtonsLabel, description: t.hideSlideActionButtonsDesc, default: CONFIG.hideSlideActionButtons },
        { key: 'enabled', label: t.enabledLabel, description: t.enabledDesc, default: true },
        { key: 'useRecommendations', label: t.useRecommendationsLabel || 'Personalized Recommendations', description: t.useRecommendationsDesc || 'Show recommendations based on your watch history.', default: false },
        { key: 'requireLogo', label: t.requireLogoLabel || 'Require Title Logo', description: t.requireLogoDesc || 'Only include items that have a title logo.', default: CONFIG.requireLogo },
        { key: 'slideAnimations', label: t.slideAnimationsLabel, description: t.slideAnimationsDesc, default: CONFIG.slideAnimationEnabled },
        { key: 'showProgressBar', label: t.showProgressBarLabel || 'Show Progress Bar', description: t.showProgressBarDesc || 'Display timing progress line.', default: CONFIG.showProgressBar },
        { key: 'yoYoProgressBar', label: t.yoYoProgressBarLabel || 'Yo-Yo Progress Bar', description: t.yoYoProgressBarDesc || 'Empty progress bar from left to right on alternating slides instead of resetting.', default: CONFIG.yoYoProgressBar },
        { key: 'showPaginationDots', label: t.showPaginationDotsLabel || 'Show Pagination Dots / Counter', description: t.showPaginationDotsDesc || 'Display the navigation dots or numeric slide counter at the bottom.', default: CONFIG.showPaginationDots },
        { key: 'forceSlideCounter', label: t.forceSlideCounterLabel || 'Always Use Slide Counter', description: t.forceSlideCounterDesc || 'Force numeric slide counter instead of pagination dots.', default: CONFIG.forceSlideCounter },
      ];
      const trailerSettings = [
        { key: "safeTrailerFraming", label: "Use a smaller player for low-resolution trailers", description: "Keep lower-quality trailers in an inset. YouTube starts wide in split-screen and remembers sustained SD playback.", default: CONFIG.safeTrailerFraming },
        { key: "compactTrailerDetails", label: "Minimize details during trailers", description: "Center and enlarge the studio logo while fading out the details.", default: CONFIG.compactTrailerDetails },
        { key: "studioColorDuringTrailers", label: "Studio Logo Color During Trailers", description: "Fade tinted and grayscale studio logos into their original colors during playback.", default: CONFIG.studioColorDuringTrailers },
        { key: "fillTrailerHeight", label: "Fill banner height", description: "Enlarge the trailer. Split-screen preserves the width of the shot.", default: CONFIG.fillTrailerHeight },
        { key: "edgeTrailer", label: "Align trailer to the right edge", description: "Blend video from the right edge into the artwork.", default: CONFIG.edgeTrailer },
        { key: "cropLocalTrailers", label: "Crop Local Black Bars", description: "Detect stable horizontal bars in local editorial trailers.", default: CONFIG.cropLocalTrailers },
        { key: "skipTrailerPromos", label: "Skip Trailer Promos", description: "Use SponsorBlock to skip tagged calls to subscribe or watch next at either end.", default: CONFIG.skipTrailerPromos },
        { key: "editorialTrailers", label: "Editorial Trailers", description: "Reveal trailers alongside the still and return to it afterward.", default: CONFIG.editorialTrailers },
        { key: "youtubeInset", label: "YouTube Inset", description: "Play YouTube in a smaller frame over the still.", default: CONFIG.youtubeInset },
        { key: 'videoBackdrops', label: t.videoBackdropsLabel, description: t.videoBackdropsDesc, default: CONFIG.enableVideoBackdrop },
        { key: 'splitScreenTrailer', label: t.splitScreenTrailerLabel || 'Split-Screen Trailer View', description: t.splitScreenTrailerDesc || 'Play trailers in split-screen layout on the right with poster/info on the left.', default: CONFIG.enableSplitScreenTrailer },
        { key: 'pauseOnHover', label: t.pauseOnHoverLabel || 'Pause Slideshow On Hover', description: t.pauseOnHoverDesc || 'Pause slide rotation while the mouse cursor is over the media bar.', default: CONFIG.pauseOnHover },
        { key: 'pauseOnExternalPlayback', label: t.pauseOnExternalPlaybackLabel || 'Pause on External Playback', description: t.pauseOnExternalPlaybackDesc || 'Pause slideshow and trailers when casting or playing media externally (e.g. MPV Shim, Chromecast).', default: CONFIG.pauseOnExternalPlayback },
        { key: 'onlyLocalTrailers', label: t.onlyLocalTrailersLabel || 'Only Play Local Trailers', description: t.onlyLocalTrailersDesc || 'Do not play remote (YouTube) trailers.', default: CONFIG.onlyLocalTrailers },
        { key: 'trailerButton', label: t.trailerButtonLabel, description: t.trailerButtonDesc, default: CONFIG.showTrailerButton },
        { key: 'mobileVideo', label: t.mobileVideoLabel, description: t.mobileVideoDesc, default: CONFIG.enableMobileVideo },
        { key: 'waitForTrailer', label: t.waitForTrailerLabel, description: t.waitForTrailerDesc, default: CONFIG.waitForTrailerToEnd },
        { key: 'randomTrailerStart', label: t.randomTrailerStartLabel || 'Random Trailer Start Position', description: t.randomTrailerStartDesc || 'Start each backdrop trailer at a random time instead of the beginning.', default: CONFIG.randomTrailerStartOffset },
        { key: 'hoverAudioFade', label: t.hoverAudioFadeLabel || 'Hover Audio Fade', description: t.hoverAudioFadeDesc || 'While muted, hover the media bar to fade sound in; leave to fade out.', default: CONFIG.hoverAudioFade },
      ];
      const layoutSettings = [
        { key: 'randomizeBackdrops', label: t.randomizeBackdropsLabel || 'Randomize Background Image', description: t.randomizeBackdropsDesc || 'Selects a random backdrop image instead of always the first one when multiple are available.', default: CONFIG.randomizeBackdrops },
        { key: 'syncPageBackdrop', label: t.syncPageBackdropLabel || 'Sync Page Backdrop', description: t.syncPageBackdropDesc || 'Mirrors the featured slide background image into Jellyfin\'s page background.', default: CONFIG.syncPageBackdrop },
        { key: 'enableBottomGradient', label: t.enableBottomGradientLabel || 'Enable Bottom Gradient', description: t.enableBottomGradientDesc || 'Smoothly fade the bottom edge of the media bar into Jellyfin\'s content (turn off for custom themes/skins).', default: CONFIG.enableBottomGradient !== false },
      ];

      let html = `
    <div class="media-bar-settings-header">
        <img src="${STATE.jellyfinData.serverAddress}/MediaBarEnhanced/Resources/assets/marquee-mark.svg" draggable="false" class="media-bar-settings-logo" />
        <h3 class="media-bar-settings-title">${t.title}</h3>
    </div>

    <div class="media-bar-client-tabs">
        <button type="button" class="media-bar-client-tab active" data-tab="mb-client-tab-general" tabindex="0">
            <svg style="width: 18px; height: 18px; fill: currentColor; flex-shrink: 0;" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
            <span>${t.groupGeneral}</span>
        </button>
        <button type="button" class="media-bar-client-tab" data-tab="mb-client-tab-trailers" tabindex="0">
            <svg style="width: 18px; height: 18px; fill: currentColor; flex-shrink: 0;" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
            <span>${t.groupTrailers}</span>
        </button>
        <button type="button" class="media-bar-client-tab" data-tab="mb-client-tab-current-trailer" tabindex="0">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v10h16V7H4zm6 1.5 5.5 3.5-5.5 3.5v-7z"/></svg>
            <span>Current Trailer</span>
        </button>
        <button type="button" class="media-bar-client-tab" data-tab="mb-client-tab-layout" tabindex="0">
            <svg style="width: 18px; height: 18px; fill: currentColor; flex-shrink: 0;" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 6h8v2H8zm-4 4h16v2H4zm3 4h10v2H7z"/></svg>
            <span>${t.groupLayout}</span>
        </button>
        <button type="button" class="media-bar-client-tab" data-tab="mb-client-tab-lineup" tabindex="0">
            <svg viewBox="0 0 24 24" aria-hidden="true" style="width: 18px; height: 18px; fill: currentColor; flex-shrink: 0;"><path d="M3 5h3v3H3zm5 .5h13v2H8zM3 10.5h3v3H3zm5 .5h13v2H8zM3 16h3v3H3zm5 .5h13v2H8z"/></svg>
            <span>${t.groupLineup}</span>
        </button>
        <button type="button" class="media-bar-client-tab" data-tab="mb-client-tab-libraries" tabindex="0">
            <svg style="width: 18px; height: 18px; fill: currentColor; flex-shrink: 0;" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0-2-.9-2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
            <span>${t.groupLibraries || 'Libraries'}</span>
        </button>
    </div>

    <div class="media-bar-settings-body">
        <!-- GENERAL TAB -->
        <div id="mb-client-tab-general" class="media-bar-client-tab-content">
    `;

      generalSettings.forEach(setting => {
        const isChecked = this.getSetting(setting.key, setting.default);
        html += `
      <div class="media-bar-toggle-container">
          <div class="media-bar-toggle-info">
              <span class="media-bar-toggle-label">${setting.label}</span>
              <span class="media-bar-toggle-desc">${setting.description}</span>
          </div>
          <label class="media-bar-switch" tabindex="0">
              <input id="mb-setting-${setting.key}" type="checkbox" ${isChecked ? 'checked' : ''} />
              <span class="media-bar-slider"></span>
          </label>
      </div>
      `;
      });

      const activePlaylistVal = this.getSetting("activePlaylist", CONFIG.activePlaylist);
      let playlistsOptions = `<option value="Default" ${activePlaylistVal === 'Default' ? 'selected' : ''}>Server or seasonal lineup</option>`;
      playlistsOptions += `<option value="Library" ${activePlaylistVal === 'Library' ? 'selected' : ''}>Random library selection</option>`;

      try {
        const playlists = JSON.parse(CONFIG.customPlaylists || "[]");
        playlists.forEach(pl => {
          if (pl.Name) {
            const plVal = `Playlist:${pl.Name}`;
            playlistsOptions += `<option value="${plVal}" ${activePlaylistVal === plVal ? 'selected' : ''}>Configured playlist: ${pl.Name}</option>`;
          }
        });
      } catch (e) {
        console.error("Error parsing playlists for client settings menu dropdown:", e);
      }

      html += `
    <div class="media-bar-select-container" id="mb-progressBarLocationContainer" style="margin-top: 0.5em; transition: opacity 0.2s ease;">
        <div class="media-bar-select-info">
            <span class="media-bar-select-label">${t.progressBarLocationLabel || 'Progress Bar Location'}</span>
            <span class="media-bar-select-desc">${t.progressBarLocationDesc || 'Select where to render the slide progress bar.'}</span>
        </div>
        <select id="mb-setting-progressBarLocation" class="media-bar-select" tabindex="0">
            <option value="Dots" ${this.getSetting('progressBarLocation', CONFIG.progressBarLocation) === 'Dots' ? 'selected' : ''}>${t.progressBarLocationDots || 'Under Dots/Counter'}</option>
            <option value="Inside" ${this.getSetting('progressBarLocation', CONFIG.progressBarLocation) === 'Inside' ? 'selected' : ''}>${t.progressBarLocationInside || 'Inside Active Dot / Counter'}</option>
            <option value="Navbar" ${this.getSetting('progressBarLocation', CONFIG.progressBarLocation) === 'Navbar' ? 'selected' : ''}>${t.progressBarLocationNavbar || 'Top (Under Header)'}</option>
        </select>
    </div>

    <div class="media-bar-select-container" id="mb-dotStyleContainer" style="margin-top: 0.5em; transition: opacity 0.2s ease;">
        <div class="media-bar-select-info">
            <span class="media-bar-select-label">${t.dotStyleLabel || 'Dot Style'}</span>
            <span class="media-bar-select-desc">${t.dotStyleDesc || 'Choose active dot shape.'}</span>
        </div>
        <select id="mb-setting-dotStyle" class="media-bar-select" tabindex="0">
            <option value="Round" ${this.getSetting('dotStyle', CONFIG.dotStyle) === 'Round' ? 'selected' : ''}>${t.optionDotStyleRound || 'Round (Classic)'}</option>
            <option value="Pill" ${this.getSetting('dotStyle', CONFIG.dotStyle) === 'Pill' ? 'selected' : ''}>${t.optionDotStylePill || 'Pill / Capsule'}</option>
        </select>
    </div>

    <div class="media-bar-select-container" style="margin-top: 0.5em;">
        <div class="media-bar-select-info">
            <span class="media-bar-select-label">${t.activePlaylistLabel || 'Active Playlist'}</span>
            <span class="media-bar-select-desc">${t.activePlaylistDesc || 'Select which custom playlist to display.'}</span>
        </div>
        <select id="mb-setting-activePlaylist" class="media-bar-select" tabindex="0">
            ${playlistsOptions}
        </select>
    </div>
        </div>

        <!-- TRAILERS TAB -->
        <div id="mb-client-tab-trailers" class="media-bar-client-tab-content" style="display: none;">
    `;

      trailerSettings.forEach(setting => {
        const isChecked = this.getSetting(setting.key, setting.default);
        html += `
      <div class="media-bar-toggle-container">
          <div class="media-bar-toggle-info">
              <span class="media-bar-toggle-label">${setting.label}</span>
              <span class="media-bar-toggle-desc">${setting.description}</span>
          </div>
          <label class="media-bar-switch" tabindex="0">
              <input id="mb-setting-${setting.key}" type="checkbox" ${isChecked ? 'checked' : ''} />
              <span class="media-bar-slider"></span>
          </label>
      </div>
      `;
      });

      const defaultVolumeVal = parseInt(this.getSetting('defaultTrailerVolume', CONFIG.defaultTrailerVolume), 10);
      html += `
    <div class="media-bar-select-container">
        <div class="media-bar-select-info">
            <span class="media-bar-select-label">${t.defaultTrailerVolumeLabel}</span>
            <span class="media-bar-select-desc">${t.defaultTrailerVolumeDesc}</span>
        </div>
        <div class="media-bar-volume-setting-row">
            <input type="range" id="mb-setting-defaultTrailerVolume" class="media-bar-volume-modal-slider" min="0" max="100" step="1" value="${defaultVolumeVal}" style="--volume-percent: ${defaultVolumeVal}%;" tabindex="0" />
            <span id="mb-setting-defaultTrailerVolume-badge" class="media-bar-volume-badge">${defaultVolumeVal}%</span>
        </div>
    </div>
        </div>

        <!-- LAYOUT TAB -->
        <div id="mb-client-tab-layout" class="media-bar-client-tab-content" style="display: none;">
    `;

      const mobileModeVal = this.getSetting('mobileMode', CONFIG.mobileCompactMode);
      html += `
    <div class="media-bar-select-container">
        <div class="media-bar-select-info">
            <span class="media-bar-select-label">${t.mobileModeLabel}</span>
            <span class="media-bar-select-desc">${t.mobileModeDesc}</span>
        </div>
        <select id="mb-setting-mobileMode" class="media-bar-select" tabindex="0">
            <option value="Original" ${mobileModeVal === 'Original' ? 'selected' : ''}>${t.optionMobileModeOriginal || 'Original (65vh)'}</option>
            <option value="16:9" ${mobileModeVal === '16:9' ? 'selected' : ''}>${t.optionMobileMode16_9 || '16:9 (Compact)'}</option>
            <option value="4:3" ${mobileModeVal === '4:3' ? 'selected' : ''}>${t.optionMobileMode4_3 || '4:3 (Classic)'}</option>
        </select>
    </div>
    `;

      const menuLocationVal = this.getSetting('menuLocation', CONFIG.clientMenuLocation);
      html += `
    <div class="media-bar-select-container">
        <div class="media-bar-select-info">
            <span class="media-bar-select-label">${t.clientMenuLocationLabel}</span>
            <span class="media-bar-select-desc">${t.clientMenuLocationDesc}</span>
        </div>
        <select id="mb-setting-menuLocation" class="media-bar-select" tabindex="0">
            <option value="Navbar" ${menuLocationVal === 'Navbar' ? 'selected' : ''}>${t.optionMenuLocationNavbar || 'Navbar'}</option>
            <option value="Sidebar" ${menuLocationVal === 'Sidebar' ? 'selected' : ''}>${t.optionMenuLocationSidebar || 'Sidebar'}</option>
            <option value="UserMenu" ${menuLocationVal === 'UserMenu' ? 'selected' : ''}>${t.optionMenuLocationUserMenu || 'User Menu'}</option>
            <option value="Navbar+Sidebar" ${menuLocationVal === 'Navbar+Sidebar' ? 'selected' : ''}>Navbar + Sidebar</option>
            <option value="Navbar+UserMenu" ${menuLocationVal === 'Navbar+UserMenu' ? 'selected' : ''}>Navbar + User Menu</option>
            <option value="All" ${menuLocationVal === 'All' || menuLocationVal === 'Both' ? 'selected' : ''}>${t.optionMenuLocationAll || 'All Locations (Everywhere)'}</option>
        </select>
    </div>
    `;

      const menuLocationMobileVal = this.getSetting('menuLocationMobile', CONFIG.clientMenuLocationMobile);
      html += `
    <div class="media-bar-select-container">
        <div class="media-bar-select-info">
            <span class="media-bar-select-label">${t.clientMenuLocationMobileLabel}</span>
            <span class="media-bar-select-desc">${t.clientMenuLocationMobileDesc}</span>
        </div>
        <select id="mb-setting-menuLocationMobile" class="media-bar-select" tabindex="0">
            <option value="Navbar" ${menuLocationMobileVal === 'Navbar' ? 'selected' : ''}>${t.optionMenuLocationNavbar || 'Navbar'}</option>
            <option value="Sidebar" ${menuLocationMobileVal === 'Sidebar' ? 'selected' : ''}>${t.optionMenuLocationSidebar || 'Sidebar'}</option>
            <option value="UserMenu" ${menuLocationMobileVal === 'UserMenu' ? 'selected' : ''}>${t.optionMenuLocationUserMenu || 'User Menu'}</option>
            <option value="Navbar+Sidebar" ${menuLocationMobileVal === 'Navbar+Sidebar' ? 'selected' : ''}>Navbar + Sidebar</option>
            <option value="Navbar+UserMenu" ${menuLocationMobileVal === 'Navbar+UserMenu' ? 'selected' : ''}>Navbar + User Menu</option>
            <option value="All" ${menuLocationMobileVal === 'All' || menuLocationMobileVal === 'Both' ? 'selected' : ''}>${t.optionMenuLocationAll || 'All Locations (Everywhere)'}</option>
        </select>
    </div>
    `;

      const transitionEffectVal = this.getSetting('transitionEffect', CONFIG.transitionEffect);
      html += `
    <div class="media-bar-select-container" style="margin-top: 0.5em;">
        <div class="media-bar-select-info">
            <span class="media-bar-select-label">${t.transitionEffectLabel || 'Transition Effect'}</span>
            <span class="media-bar-select-desc">${t.transitionEffectDesc || 'Select the transition style between slides.'}</span>
        </div>
        <select id="mb-setting-transitionEffect" class="media-bar-select" tabindex="0">
            <option value="Fade" ${transitionEffectVal === 'Fade' ? 'selected' : ''}>${t.optionTransitionFade || 'Crossfade'}</option>
            <option value="SlideLeft" ${transitionEffectVal === 'SlideLeft' ? 'selected' : ''}>${t.optionTransitionSlideLeft || 'Slide Left'}</option>
            <option value="SlideRight" ${transitionEffectVal === 'SlideRight' ? 'selected' : ''}>${t.optionTransitionSlideRight || 'Slide Right'}</option>
            <option value="SlideUp" ${transitionEffectVal === 'SlideUp' ? 'selected' : ''}>${t.optionTransitionSlideUp || 'Slide Up'}</option>
            <option value="SlideDown" ${transitionEffectVal === 'SlideDown' ? 'selected' : ''}>${t.optionTransitionSlideDown || 'Slide Down'}</option>
            <option value="ZoomIn" ${transitionEffectVal === 'ZoomIn' ? 'selected' : ''}>${t.optionTransitionZoomIn || 'Zoom In'}</option>
            <option value="ZoomOut" ${transitionEffectVal === 'ZoomOut' ? 'selected' : ''}>${t.optionTransitionZoomOut || 'Zoom Out'}</option>
        </select>
    </div>

    <div class="media-bar-toggle-container" style="margin-top: 0.5em;">
        <div class="media-bar-toggle-info">
            <span class="media-bar-toggle-label">${t.randomizeBackdropsLabel || 'Randomize Background Image'}</span>
            <span class="media-bar-toggle-desc">${t.randomizeBackdropsDesc || 'Selects a random backdrop image instead of always the first one when multiple are available.'}</span>
        </div>
        <label class="media-bar-switch" tabindex="0">
            <input id="mb-setting-randomizeBackdrops" type="checkbox" ${this.getSetting('randomizeBackdrops', CONFIG.randomizeBackdrops) ? 'checked' : ''} />
            <span class="media-bar-slider"></span>
        </label>
    </div>

    <div class="media-bar-toggle-container" style="margin-top: 0.5em;">
        <div class="media-bar-toggle-info">
            <span class="media-bar-toggle-label">${t.syncPageBackdropLabel || 'Sync Page Backdrop'}</span>
            <span class="media-bar-toggle-desc">${t.syncPageBackdropDesc || 'Mirrors the featured slide background image into Jellyfin\'s page background.'}</span>
        </div>
        <label class="media-bar-switch" tabindex="0">
            <input id="mb-setting-syncPageBackdrop" type="checkbox" ${this.getSetting('syncPageBackdrop', CONFIG.syncPageBackdrop) ? 'checked' : ''} />
            <span class="media-bar-slider"></span>
        </label>
    </div>

    <div class="media-bar-toggle-container" style="margin-top: 0.5em;">
        <div class="media-bar-toggle-info">
            <span class="media-bar-toggle-label">${t.enableBottomGradientLabel || 'Enable Bottom Gradient'}</span>
            <span class="media-bar-toggle-desc">${t.enableBottomGradientDesc || 'Smoothly fade the bottom edge of the media bar into Jellyfin\'s content (turn off for custom themes/skins).'}</span>
        </div>
        <label class="media-bar-switch" tabindex="0">
            <input id="mb-setting-enableBottomGradient" type="checkbox" ${this.getSetting('enableBottomGradient', CONFIG.enableBottomGradient !== false) ? 'checked' : ''} />
            <span class="media-bar-slider"></span>
        </label>
    </div>
        </div>

        <div id="mb-client-tab-current-trailer" class="media-bar-client-tab-content mb-editor-stack" style="display: none"></div>
        <div id="mb-client-tab-lineup" class="media-bar-client-tab-content" style="display: none"></div>

        <!-- LIBRARIES TAB -->
        <div id="mb-client-tab-libraries" class="media-bar-client-tab-content" style="display: none; flex-direction: column; gap: 0.5rem; max-height: 250px; overflow-y: auto; padding: 0.5rem; width: 100%; box-sizing: border-box;">
            <div class="media-bar-loading-libraries" style="text-align: center; color: var(--text-muted); padding: 1rem;">Loading libraries...</div>
        </div>
    </div> <!-- .media-bar-settings-body -->

    <div class="media-bar-settings-buttons">
        <label class="marquee-scheme-picker">Popup colors
          <select id="mb-popup-scheme">
            <option value="default">Marquee</option>
            <option value="lavender">Pastel lavender</option>
            <option value="peach">Pastel peach</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="monochrome">Metadata monochrome</option>
            <option value="latte">Coffee latte</option>
            <option value="sakura">Sakura</option>
            <option value="forest">Forest</option>
            <option value="ocean">Deep ocean</option>
            <option value="amber">Amber dusk</option>
            <option value="slate">Slate blue</option>
            <option value="orchid">Orchid</option>
            <option value="mint">Mint</option>
          </select>
        </label>
        <button type="button" class="media-bar-btn media-bar-btn-cancel" id="mb-settings-reset" title="${t.resetTitle}" tabindex="0">
            <span>Discard changes</span>
        </button>
        <button type="button" class="media-bar-btn media-bar-btn-submit" id="mb-settings-save" tabindex="0">
            <span>Save for everyone</span>
        </button>
    </div>
    <div>
        <span role="status" id="mb-settings-publish-status"></span>
    </div>
    <div class="media-bar-settings-footer">
        <a href="#/configurationpage?name=Media%20Bar%20Enhanced" class="media-bar-github-link media-bar-dashboard-link" hidden>
            <span class="material-icons" aria-hidden="true">settings</span>
            <span>Plugin Settings Page</span>
        </a>
        <span id="mb-settings-version">Version ${STATE.jellyfinData.pluginVersion || 'N/A'}</span>
        <a href="https://github.com/yo-less/jellyfin-plugin-marquee" target="_blank" rel="noopener noreferrer" class="media-bar-github-link">
            <svg style="width:14px; height:14px; fill:currentColor;" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            <span>GitHub</span>
        </a>
    </div>
    `;

      popup.innerHTML = html;

      // Close button for mobile & TV accessibility
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'media-bar-settings-close-button';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.setAttribute('tabindex', '0');
      closeBtn.innerHTML = '<svg style="width: 16px; height: 16px; fill: currentColor;" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>';
      closeBtn.addEventListener('click', () => {
        closePopupFunc();
      });
      popup.appendChild(closeBtn);

      // Keyboard switch toggle support for TV remotes
      popup.querySelectorAll('.media-bar-switch').forEach(label => {
        label.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter' || e.keyCode === 32 || e.keyCode === 13) {
            const input = label.querySelector('input[type="checkbox"]');
            if (input) {
              input.checked = !input.checked;
              input.dispatchEvent(new Event('change', { bubbles: true }));
              e.preventDefault();
              e.stopPropagation();
            }
          }
        });
      });

      // Prevent clicks inside popup from bubbling up to document click handlers
      popup.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Client tab switcher
      let resumeAfterTrailerEdit = false;
      const endTrailerEdit = () => {
        if (!STATE.slideshow.editingTrailer) return;
        STATE.slideshow.editingTrailer = false;
        document.getElementById("slides-container")?.classList.remove("marquee-editing-trailer");
        if (resumeAfterTrailerEdit && STATE.slideshow.isPaused) SlideshowManager.togglePause();
        resumeAfterTrailerEdit = false;
      };
      const tabButtons = popup.querySelectorAll('.media-bar-client-tab');
      tabButtons.forEach(tBtn => {
        tBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          tabButtons.forEach(b => b.classList.remove('active'));
          tBtn.classList.add('active');

          popup.querySelectorAll('.media-bar-client-tab-content').forEach(c => c.style.display = 'none');
          popup.querySelector('.mb-current-trailer-preview')?.replaceChildren();
          const targetId = tBtn.getAttribute('data-tab');
          if (targetId === "mb-client-tab-current-trailer" && !STATE.slideshow.editingTrailer) {
            resumeAfterTrailerEdit = !STATE.slideshow.isPaused;
            STATE.slideshow.editingTrailer = true;
            document.getElementById("slides-container")?.classList.add("marquee-editing-trailer");
            if (resumeAfterTrailerEdit) SlideshowManager.togglePause(true);
          } else if (targetId !== "mb-client-tab-current-trailer") {
            this.trailerWidthPreviewCleanup?.();
            endTrailerEdit();
          }
          const targetContent = popup.querySelector(`#${targetId}`);
          if (targetContent) {
            targetContent.style.display = 'flex';
          }
        });
      });

      const closePopupFunc = (restoreFocus = true) => {
        if (this.popupCleanup === closePopupFunc) this.popupCleanup = null;
        this.trailerWidthPreviewCleanup?.();
        this.trailerWidthPreviewCleanup = null;
        endTrailerEdit();
        popup.remove();
        if (overlay) overlay.remove();
        document.removeEventListener('click', closeHandler);
        document.removeEventListener('focusin', popupFocusListener);
        document.removeEventListener('keydown', keydownCloseHandler);
        if (restoreFocus !== false && anchorElement?.isConnected && typeof anchorElement.focus === 'function') {
          anchorElement.focus();
        }
      };

      const popupFocusListener = (e) => {
        if (!isModal && document.body.contains(popup) && !popup.contains(e.target) && e.target !== anchorElement && (!anchorElement || !anchorElement.contains(e.target))) {
          closePopupFunc();
        }
      };
      setTimeout(() => {
        if (popup.isConnected) document.addEventListener('focusin', popupFocusListener);
      }, 150);

      if (isTvMode()) {
        popup.classList.add('media-bar-tv-mode');

        // Set initial focus to the first active tab in TV mode
        setTimeout(() => {
          const activeTab = popup.querySelector('.media-bar-client-tab.active');
          if (activeTab) activeTab.focus();
        }, 50);

        // Full D-pad arrow key navigation inside popup (TV mode only)
        popup.addEventListener('keydown', (e) => {
          const active = document.activeElement;
          if (!active || !popup.contains(active)) return;

          const activeTabContent = popup.querySelector('.media-bar-client-tab-content:not([style*="display: none"])');
          const focusableInTab = activeTabContent ? Array.from(activeTabContent.querySelectorAll('.media-bar-switch, .media-bar-select, select, input, button')).filter(el => {
            const style = window.getComputedStyle(el);
            return el.offsetWidth > 0 && el.offsetHeight > 0 && style.display !== 'none' && style.visibility !== 'hidden';
          }) : [];

          const tabButtons = Array.from(popup.querySelectorAll('.media-bar-client-tab'));
          const actionButtons = Array.from(popup.querySelectorAll('.media-bar-settings-buttons button, .media-bar-settings-close-button'));

          if (active.classList.contains('media-bar-client-tab')) {
            const idx = tabButtons.indexOf(active);
            if (e.key === 'ArrowRight' && idx < tabButtons.length - 1) {
              tabButtons[idx + 1].focus();
              tabButtons[idx + 1].click();
              e.preventDefault();
              e.stopPropagation();
            } else if (e.key === 'ArrowLeft' && idx > 0) {
              tabButtons[idx - 1].focus();
              tabButtons[idx - 1].click();
              e.preventDefault();
              e.stopPropagation();
            } else if ((e.key === 'ArrowLeft' && idx === 0) || e.key === 'ArrowUp') {
              // Going Left on the 1st tab or Up on any tab closes the modal!
              closePopupFunc();
              e.preventDefault();
              e.stopPropagation();
            } else if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
              // Pressing Enter confirms the tab selection and enters the settings inside
              active.click();
              if (focusableInTab.length > 0) {
                focusableInTab[0].focus();
                e.preventDefault();
                e.stopPropagation();
              }
            } else if (e.key === 'ArrowDown') {
              if (focusableInTab.length > 0) {
                focusableInTab[0].focus();
                e.preventDefault();
                e.stopPropagation();
              } else if (actionButtons.length > 0) {
                actionButtons[0].focus();
                e.preventDefault();
                e.stopPropagation();
              }
            }
          } else if (focusableInTab.includes(active)) {
            const idx = focusableInTab.indexOf(active);

            if (active.tagName === 'SELECT' || active.classList.contains('media-bar-select')) {
              if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
                try {
                  if (typeof active.showPicker === 'function') {
                    active.showPicker();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                } catch (err) { }
              }
            }

            if (e.key === 'ArrowDown') {
              if (idx < focusableInTab.length - 1) {
                focusableInTab[idx + 1].focus();
                e.preventDefault();
                e.stopPropagation();
              } else if (actionButtons.length > 0) {
                actionButtons[0].focus();
                e.preventDefault();
                e.stopPropagation();
              }
            } else if (e.key === 'ArrowUp') {
              if (idx > 0) {
                focusableInTab[idx - 1].focus();
                e.preventDefault();
                e.stopPropagation();
              } else {
                const currentTabBtn = popup.querySelector('.media-bar-client-tab.active');
                if (currentTabBtn) currentTabBtn.focus();
                e.preventDefault();
                e.stopPropagation();
              }
            }
          } else if (actionButtons.includes(active)) {
            const idx = actionButtons.indexOf(active);
            if (e.key === 'ArrowRight' && idx < actionButtons.length - 1) {
              actionButtons[idx + 1].focus();
              e.preventDefault();
              e.stopPropagation();
            } else if (e.key === 'ArrowLeft' && idx > 0) {
              actionButtons[idx - 1].focus();
              e.preventDefault();
              e.stopPropagation();
            } else if (e.key === 'ArrowUp') {
              const currentTabBtn = popup.querySelector('.media-bar-client-tab.active');
              if (currentTabBtn) currentTabBtn.focus();
              e.preventDefault();
              e.stopPropagation();
            } else if (e.key === 'ArrowDown') {
              // Pressing Down Arrow from action buttons closes popup!
              closePopupFunc();
            }
          }
        });
      }

      // Add Listeners
      const scheme = popup.querySelector("#mb-popup-scheme");
      const applyScheme = () => {
        popup.dataset.scheme = scheme.value;
        const metadata = document.querySelector("#slides-container .slide.active .editorial-metadata");
        if (metadata) popup.style.setProperty("--marquee-metadata-accent", getComputedStyle(metadata).color);
      };
      scheme.value = this.getSetting("popupColorScheme", CONFIG.popupColorScheme);
      if (!scheme.value) scheme.value = "default";
      applyScheme();
      scheme.addEventListener("change", () => { this.setSetting("popupColorScheme", scheme.value); applyScheme(); });
      const allSwitches = [...generalSettings, ...trailerSettings, ...layoutSettings];
      allSwitches.forEach(setting => {
        const checkbox = popup.querySelector(`#mb-setting-${setting.key}`);
        if (checkbox) {
          checkbox.addEventListener('change', (e) => {
            this.setSetting(setting.key, e.target.checked);
            if (setting.key === 'pauseOnExternalPlayback') {
              if (typeof VisibilityObserver !== 'undefined') {
                VisibilityObserver.updateVisibility();
              }
            }
            if (setting.key === 'splitScreenTrailer') {
              const cont = document.getElementById('slides-container');
              if (cont) cont.classList.toggle('split-screen-trailer', isSplitScreenTrailerEnabled());
            }
            if (setting.key === 'showPaginationDots' || setting.key === 'forceSlideCounter') {
              if (typeof SlideshowManager !== 'undefined') {
                SlideshowManager.createPaginationDots();
              }
            }
          });
        }
      });

      const mobileModeSelect = popup.querySelector('#mb-setting-mobileMode');
      mobileModeSelect.addEventListener('change', (e) => {
        this.setSetting('mobileMode', e.target.value);
      });

      const menuLocationSelect = popup.querySelector('#mb-setting-menuLocation');
      menuLocationSelect.addEventListener('change', (e) => {
        this.setSetting('menuLocation', e.target.value);
      });

      const menuLocationMobileSelect = popup.querySelector('#mb-setting-menuLocationMobile');
      menuLocationMobileSelect.addEventListener('change', (e) => {
        this.setSetting('menuLocationMobile', e.target.value);
      });

      const activePlaylistSelect = popup.querySelector('#mb-setting-activePlaylist');
      if (activePlaylistSelect) {
        activePlaylistSelect.addEventListener('change', (e) => {
          this.setSetting('activePlaylist', e.target.value);
        });
      }

      const dotStyleSelect = popup.querySelector('#mb-setting-dotStyle');
      if (dotStyleSelect) {
        dotStyleSelect.addEventListener('change', (e) => {
          this.setSetting('dotStyle', e.target.value);
          if (typeof SlideshowManager !== 'undefined') {
            SlideshowManager.updateDots();
            SlideshowManager.updateProgressBar(STATE.slideshow.isVideoPlaying, STATE.slideshow.currentSlideIndex);
          }
        });
      }

      const transitionEffectSelect = popup.querySelector('#mb-setting-transitionEffect');
      if (transitionEffectSelect) {
        transitionEffectSelect.addEventListener('change', (e) => {
          this.setSetting('transitionEffect', e.target.value);
        });
      }

      const defaultVolumeSlider = popup.querySelector('#mb-setting-defaultTrailerVolume');
      const defaultVolumeBadge = popup.querySelector('#mb-setting-defaultTrailerVolume-badge');
      if (defaultVolumeSlider) {
        defaultVolumeSlider.addEventListener('input', (e) => {
          let val = parseInt(e.target.value, 10);
          if (val < 4) {
            val = 0;
            defaultVolumeSlider.value = "0";
          }
          defaultVolumeSlider.style.setProperty('--volume-percent', `${val}%`);
          if (defaultVolumeBadge) {
            defaultVolumeBadge.textContent = `${val}%`;
          }
          if (val > 0) {
            this.setSetting('defaultTrailerVolume', val);
          }

          // Trigger media bar slider directly to update video volume, player, and icon without duplicated code
          const barSlider = document.querySelector('.media-bar-volume-slider');
          if (barSlider) {
            barSlider.value = String(val);
            barSlider.dispatchEvent(new Event('input'));
          }
        });
      }

      const progressBarLocationSelect = popup.querySelector('#mb-setting-progressBarLocation');
      if (progressBarLocationSelect) {
        progressBarLocationSelect.addEventListener('change', (e) => {
          this.setSetting('progressBarLocation', e.target.value);
          if (typeof SlideshowManager !== 'undefined') {
            SlideshowManager.updateDots();
            SlideshowManager.updateProgressBar(STATE.slideshow.isVideoPlaying, STATE.slideshow.currentSlideIndex);
          }
        });
      }

      const updateClientDependencies = () => {
        const showProgressBarCb = popup.querySelector('#mb-setting-showProgressBar');
        const progressLocContainer = popup.querySelector('#mb-progressBarLocationContainer');
        const yoYoContainer = popup.querySelector('#mb-setting-yoYoProgressBar')?.closest('.media-bar-toggle-container');
        if (showProgressBarCb) {
          const isProg = showProgressBarCb.checked;
          if (progressLocContainer) {
            progressLocContainer.style.opacity = isProg ? '1' : '0.4';
            progressLocContainer.style.pointerEvents = isProg ? 'auto' : 'none';
          }
          if (yoYoContainer) {
            yoYoContainer.style.opacity = isProg ? '1' : '0.4';
            yoYoContainer.style.pointerEvents = isProg ? 'auto' : 'none';
          }
        }

        const showDotsCb = popup.querySelector('#mb-setting-showPaginationDots');
        const forceCounterContainer = popup.querySelector('#mb-setting-forceSlideCounter')?.closest('.media-bar-toggle-container');
        const dotStyleContainer = popup.querySelector('#mb-dotStyleContainer');
        if (showDotsCb) {
          const isDots = showDotsCb.checked;
          if (forceCounterContainer) {
            forceCounterContainer.style.opacity = isDots ? '1' : '0.4';
            forceCounterContainer.style.pointerEvents = isDots ? 'auto' : 'none';
          }
          if (dotStyleContainer) {
            dotStyleContainer.style.opacity = isDots ? '1' : '0.4';
            dotStyleContainer.style.pointerEvents = isDots ? 'auto' : 'none';
          }
        }
      };

      updateClientDependencies();

      const showProgressBarCb = popup.querySelector('#mb-setting-showProgressBar');
      if (showProgressBarCb) {
        showProgressBarCb.addEventListener('change', () => {
          updateClientDependencies();
          if (typeof SlideshowManager !== 'undefined') {
            SlideshowManager.updateDots();
            SlideshowManager.updateProgressBar(STATE.slideshow.isVideoPlaying, STATE.slideshow.currentSlideIndex);
          }
        });
      }

      const showPaginationDotsCb = popup.querySelector('#mb-setting-showPaginationDots');
      if (showPaginationDotsCb) {
        showPaginationDotsCb.addEventListener('change', updateClientDependencies);
      }

      // Reload Handler
      let savingPopupSettings = false;
      const savePopupSettings = async () => {
        if (savingPopupSettings) return;
        savingPopupSettings = true;
        try {
          await this.publishSettings(allSwitches);
          location.reload();
        } catch {
          popup.querySelector("#mb-settings-publish-status").textContent =
            "Could not save settings to the server. Your changes are still open here. Try saving again.";
        } finally {
          savingPopupSettings = false;
        }
      };
      popup.querySelector('#mb-settings-save').addEventListener('click', savePopupSettings);

      // Reset Handler
      popup.querySelector('#mb-settings-reset').addEventListener('click', () => {
        if (confirm("Discard unsaved Marquee changes?")) {
          this.settingDrafts.clear();
          this.trailerDrafts.clear();
          location.reload();
        }
      });



      const keydownCloseHandler = (e) => {
        if (e.key === 'Escape' || e.key === 'Back' || e.key === 'GoBack' || e.keyCode === 27 || e.keyCode === 10009 || e.keyCode === 461) {
          closePopupFunc();
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const closeHandler = (e) => {
        if (!isModal && !popup.contains(e.target) && e.target !== anchorElement && (!anchorElement || !anchorElement.contains(e.target))) {
          closePopupFunc();
        }
      };
      setTimeout(() => {
        document.addEventListener('click', closeHandler);
        document.addEventListener('keydown', keydownCloseHandler);
      }, 150);

      if (overlay) {
        overlay.addEventListener('click', closePopupFunc);
      }

      // Fetch and render libraries tab
      const renderLibrariesTab = async () => {
        const container = popup.querySelector('#mb-client-tab-libraries');
        if (!container) return;

        try {
          const viewsUrl = `${STATE.jellyfinData.serverAddress}/Users/${STATE.jellyfinData.userId}/Views`;
          const viewsResponse = await fetch(viewsUrl, { headers: ApiUtils.getAuthHeaders() });
          if (!viewsResponse.ok) throw new Error("Failed to fetch views");
          const viewsData = await viewsResponse.json();
          const views = viewsData.Items || [];

          // Read currently excluded library IDs from localStorage, or default to server-side exclusions
          const clientExcludedStr = this.getSetting("excludedLibraries", CONFIG.publishedExcludedLibraryIds || null);
          let excludedIds = [];

          if (clientExcludedStr !== null) {
            excludedIds = clientExcludedStr.split(',').filter(id => id);
          } else {
            // First run or after reset: default to server-side exclusions
            const serverExcludedNames = CONFIG.excludedLibraries ? CONFIG.excludedLibraries.split(',').map(s => s.trim().toLowerCase()).filter(s => s) : [];
            const libraryMap = await ApiUtils.fetchLibraryIds() || {};
            excludedIds = serverExcludedNames.map(name => libraryMap[name]).filter(id => id);
          }

          let listHtml = `
          <div style="color: #bbbbbb; font-size: 0.82rem; line-height: 1.45; margin-bottom: 0.8rem; padding: 0.2rem 0.4rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.6rem;">
              ${t.libraryFilterHint || 'Note: These filters only apply when fetching random or recent items. Checked libraries are included; unchecked libraries are excluded.'}
          </div>
          `;

          views.forEach(view => {
            const isChecked = !excludedIds.includes(view.Id);
            listHtml += `
            <div class="media-bar-toggle-container" style="padding: 0.25rem 0;">
                <div class="media-bar-toggle-info">
                    <span class="media-bar-toggle-label">${view.Name}</span>
                </div>
                <label class="media-bar-switch">
                    <input class="mb-library-checkbox" data-id="${view.Id}" type="checkbox" ${isChecked ? 'checked' : ''} />
                    <span class="media-bar-slider"></span>
                </label>
            </div>
            `;
          });

          if (views.length === 0) {
            container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 1rem;">No libraries found.</div>';
          } else {
            container.innerHTML = listHtml;

            container.querySelectorAll('.mb-library-checkbox').forEach(cb => {
              cb.addEventListener('change', () => {
                const libraryId = cb.getAttribute('data-id');
                const currentExcludedStr = this.getSetting("excludedLibraries", excludedIds.join(","));
                let currentExcluded = currentExcludedStr.split(',').filter(id => id);

                if (cb.checked) {
                  currentExcluded = currentExcluded.filter(id => id !== libraryId);
                } else {
                  if (!currentExcluded.includes(libraryId)) {
                    currentExcluded.push(libraryId);
                  }
                }

                this.setSetting("excludedLibraries", currentExcluded.join(","));
              });
            });
          }
        } catch (e) {
          console.error("Error rendering libraries in client settings:", e);
          container.innerHTML = '<div style="color: var(--text-danger); text-align: center; padding: 1rem;">Failed to load libraries.</div>';
        }
      };

      renderLibrariesTab();
      const trailerTab = popup.querySelector('[data-tab="mb-client-tab-current-trailer"]');
      const trailerPanel = popup.querySelector('#mb-client-tab-current-trailer');
      const currentTrailerId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
      let lineupTrailerId;
      trailerTab.addEventListener('click', () => {
        this.showTrailerPicker(trailerPanel, lineupTrailerId || currentTrailerId);
        lineupTrailerId = null;
      });
      popup.querySelector('[data-tab="mb-client-tab-lineup"]').addEventListener('click', () => {
        const editor = popup.querySelector('#mb-client-tab-lineup');
        if (!editor.childElementCount) this.setupLineupEditor(editor, itemId => {
          lineupTrailerId = itemId;
          trailerTab.click();
          trailerTab.focus();
        }, savePopupSettings);
      });

      this.popupCleanup = closePopupFunc;
      document.body.appendChild(popup);

      const dashboardLink = popup.querySelector(".media-bar-dashboard-link");
      Promise.resolve(window.ApiClient?.getCurrentUser?.()).then(user => {
        if (user?.Policy?.IsAdministrator && popup.isConnected) {
          dashboardLink.hidden = false;
          dashboardLink.addEventListener("click", closePopupFunc);
        }
      }).catch(() => {});
    },

    closePopup(restoreFocus = true) {
      this.popupCleanup?.(restoreFocus);
      document.querySelectorAll(".media-bar-settings-popup, .media-bar-modal-overlay").forEach(element => element.remove());
    },

    toggleSettingsPopup(anchorElement) {
      if (document.querySelector('.media-bar-settings-popup')) {
        this.closePopup();
      } else {
        this.createPopup(anchorElement);
      }
    }
  };

  /**
   * Returns the effective trailer volume (0-100), respecting client-side overrides.
   * @returns {number} Volume level 0-100
   */

  ['click', 'keydown', 'pointerdown', 'touchstart'].forEach(evt => {
    try {
      window.addEventListener(evt, () => {
        STATE.slideshow.hasUserInteracted = true;
        if (evt === 'click' && document.querySelector('#slides-container:hover')) {
          queueMicrotask(onMediaBarHoverAudioEnter);
        }
      }, { capture: true, passive: true });
    } catch (e) { }
  });

  function hasUserGesture() {
    return !!STATE.slideshow.hasUserInteracted;
  }

  function isHoverAudioFadeEnabled() {
    const v = MediaBarEnhancedSettingsManager.getSetting('hoverAudioFade', CONFIG.hoverAudioFade);
    return v === true || v === 'true' || v === 1 || v === '1';
  }

  function getHoverAudioFadeMs() {
    const n = parseInt(
      MediaBarEnhancedSettingsManager.getSetting('hoverAudioFadeMs', CONFIG.hoverAudioFadeMs),
      10
    );
    if (isNaN(n)) return 400;
    return Math.max(50, Math.min(3000, n));
  }

  /**
   * Get current slide HTML5 video and/or YouTube player, if any.
   */
  function getCurrentTrailerPlayback() {
    const currentItemId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
    if (!currentItemId) return { itemId: null, video: null, yt: null };
    const currentSlide = document.querySelector(`.slide[data-item-id="${currentItemId}"]`);
    const video = currentSlide ? currentSlide.querySelector('video') : null;
    const yt =
      STATE.slideshow.videoPlayers && STATE.slideshow.videoPlayers[currentItemId]
        ? STATE.slideshow.videoPlayers[currentItemId]
        : null;
    return { itemId: currentItemId, video, yt };
  }

  /**
   * Animate trailer volume to target (0-1 for HTML5, 0-100 for YT).
   * When fading in from muted default, temporarily unmutes without flipping
   * the mute button / isMuted state unless permanently unmuted.
   */
  function fadeTrailerVolume(toAudible, onDone) {
    const duration = getHoverAudioFadeMs();
    const token = ++STATE.slideshow.volumeFadeToken;
    const targetPct = toAudible ? getEffectiveTrailerVolume() : 0;
    const { video, yt } = getCurrentTrailerPlayback();

    const startHtml5 = video ? (video.muted ? 0 : (typeof video.volume === 'number' ? video.volume : 0)) : 0;
    const endHtml5 = targetPct / 100;
    let startYt = 0;
    try {
      if (yt && typeof yt.getVolume === 'function') startYt = yt.getVolume();
    } catch (e) { startYt = toAudible ? 0 : targetPct; }
    const endYt = targetPct;

    if (toAudible) {
      STATE.slideshow.hoverAudioEngaged = true;
      if (video) {
        try {
          video.muted = false;
          video.volume = startHtml5;
          setTimeout(() => {
            if (video.paused && token === STATE.slideshow.volumeFadeToken && !STATE.slideshow.isPaused) {
              console.warn("🎬 Media Bar:", "Browser blocked unmuted hover audio, reverting to muted...");
              video.muted = true;
              video.play().catch(() => { });
            }
          }, 50);
        } catch (e) { }
      }
      if (yt && typeof yt.unMute === 'function') {
        try {
          yt.unMute();
          if (typeof yt.setVolume === 'function') yt.setVolume(startYt);
          setTimeout(() => {
            if (typeof yt.getPlayerState === 'function' && yt.getPlayerState() === 2 && token === STATE.slideshow.volumeFadeToken && !STATE.slideshow.isPaused) {
              console.warn("🎬 Media Bar:", "YouTube blocked unmuted hover audio, reverting to muted...");
              if (typeof yt.mute === 'function') yt.mute();
              if (typeof yt.playVideo === 'function') yt.playVideo();
            }
          }, 150);
        } catch (e) { }
      }
    }

    const t0 = performance.now();
    const step = (now) => {
      if (token !== STATE.slideshow.volumeFadeToken) return;
      const u = duration <= 0 ? 1 : Math.min(1, (now - t0) / duration);
      // ease in-out
      const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const vHtml5 = startHtml5 + (endHtml5 - startHtml5) * e;
      const vYt = startYt + (endYt - startYt) * e;
      if (video) {
        try {
          video.volume = Math.max(0, Math.min(1, vHtml5));
          if (!toAudible && u >= 1) {
            video.muted = true;
            video.volume = 0;
          }
        } catch (e) { }
      }
      if (yt && typeof yt.setVolume === 'function') {
        try {
          yt.setVolume(Math.max(0, Math.min(100, Math.round(vYt))));
          if (!toAudible && u >= 1 && typeof yt.mute === 'function') {
            yt.mute();
          }
        } catch (e) { }
      }
      if (u < 1) {
        requestAnimationFrame(step);
      } else {
        if (!toAudible) {
          STATE.slideshow.hoverAudioEngaged = false;
        }
        if (typeof onDone === 'function') onDone();
      }
    };
    requestAnimationFrame(step);
  }

  function onMediaBarHoverAudioEnter() {
    if (!isHoverAudioFadeEnabled()) return;
    if (STATE.slideshow.isPaused) return;
    if (!STATE.slideshow.isMuted) return;
    if (!hasUserGesture()) return;

    const { itemId, video, yt } = getCurrentTrailerPlayback();
    const isPlaying = (video && !video.paused) || (yt && typeof yt.getPlayerState === 'function' && yt.getPlayerState() === 1);
    if (!isPlaying || (STATE.slideshow.hoverAudioEngaged && STATE.slideshow.hoverAudioItemId === itemId)) return;

    STATE.slideshow.hoverAudioItemId = itemId;
    fadeTrailerVolume(true);
  }

  function onMediaBarHoverAudioLeave() {
    if (!isHoverAudioFadeEnabled()) return;
    if (!STATE.slideshow.isMuted) return;
    if (!STATE.slideshow.hoverAudioEngaged) return;
    fadeTrailerVolume(false);
  }

  /**
   * Returns how much of the beginning of a trailer should be skipped.
   * @returns {number} Offset in seconds, 0 when the feature is disabled
   */
  function getTrailerStartOffsetSeconds() {
    const settingVal = MediaBarEnhancedSettingsManager.getSetting('trailerStartOffset', CONFIG.trailerStartOffset);
    const offsetMs = parseInt(settingVal, 10);
    return (offsetMs && offsetMs > 0) ? offsetMs / 1000 : 0;
  }

  function getTrailerEndOffsetSeconds() {
    const settingVal = MediaBarEnhancedSettingsManager.getSetting('trailerEndOffset', CONFIG.trailerEndOffset);
    const offsetMs = parseInt(settingVal, 10);
    return (offsetMs && offsetMs > 0) ? offsetMs / 1000 : 0;
  }

  /**
   * Rewinds a local trailer video to its configured start offset.
   * Falls back to the very beginning when the offset would land past the end
   * of the video, which would otherwise finish playback instantly.
   * @param {HTMLVideoElement} video The local trailer video element
   */
  function resetLocalVideoToStart(video) {
    const offset = getTrailerStartOffsetSeconds();
    const target = (video.duration && offset >= video.duration) ? 0 : offset;
    video._startOffset = target;
    try {
      if (Math.abs((video.currentTime || 0) - target) > 0.4) {
        video.currentTime = target;
      }
    } catch (e) { }
  }

  /**
   * Returns the effective value for waiting for trailer to end, respecting client-side overrides.
   * @returns {boolean} Whether to wait for the trailer to end
   */
  function getEffectiveRandomTrailerStart() {
    if (getEffectiveWaitForTrailer()) {
      return false;
    }
    const val = MediaBarEnhancedSettingsManager.getSetting('randomTrailerStartOffset', CONFIG.randomTrailerStartOffset);
    return val === true || val === 'true' || val === 1 || val === '1';
  }

  /**
   * Clamp a percent-like value into 0..100.
   * @param {*} v
   * @param {number} fallback
   * @returns {number}
   */
  function clampTrailerStartPercent(v, fallback) {
    const n = Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, Math.min(100, n));
  }

  /**
   * Pick a start time (seconds) within [rangeStart, rangeEnd] for backdrop trailers.
   * When random start is disabled, returns rangeStart (usually 0 or SponsorBlock start).
   * Leaves a short residual tail so a brief slide dwell still has motion.
   *
   * @param {number} rangeStart
   * @param {number} rangeEnd
   * @param {boolean} forceNew - re-roll even if this item already has a cached offset
   * @param {string} [itemId]
   * @returns {number}
   */
  function pickRandomTrailerStartSeconds(rangeStart, rangeEnd, forceNew, itemId) {
    const fixedOffset = getTrailerStartOffsetSeconds();
    let baseStart = Math.max(0, Number(rangeStart) || 0);
    let end = Number(rangeEnd);

    if ((!Number.isFinite(end) || end <= 0) && itemId) {
      if (STATE.slideshow.videoPlayers && STATE.slideshow.videoPlayers[itemId]) {
        const yt = STATE.slideshow.videoPlayers[itemId];
        if (yt && typeof yt.getDuration === 'function') {
          const d = yt.getDuration();
          if (d && Number.isFinite(d) && d > 0) {
            end = d;
            const endOffset = getTrailerEndOffsetSeconds();
            if (endOffset > 0 && end > endOffset) {
              end = end - endOffset;
            }
          }
        }
      }
      if (!Number.isFinite(end) || end <= 0) {
        const currentSlide = document.querySelector(`.slide[data-item-id="${itemId}"]`);
        const video = currentSlide ? currentSlide.querySelector('video') : null;
        if (video && video.duration && Number.isFinite(video.duration) && video.duration > 0) {
          end = video.duration;
          const endOffset = getTrailerEndOffsetSeconds();
          if (endOffset > 0 && end > endOffset) {
            end = end - endOffset;
          }
        }
      }
    }

    // Apply fixed offset if configured and valid for this trailer
    if (fixedOffset > 0 && (!Number.isFinite(end) || fixedOffset < end)) {
      baseStart = Math.max(baseStart, fixedOffset);
    }

    if (!getEffectiveRandomTrailerStart()) {
      return baseStart;
    }

    if (!Number.isFinite(end) || end <= baseStart + 0.25) {
      return baseStart;
    }

    const span = end - baseStart;
    const minClip = Math.min(5, Math.max(1, span * 0.15));
    const usableEnd = Math.max(baseStart, end - minClip);
    const usableSpan = usableEnd - baseStart;
    if (usableSpan <= 0.5) {
      return baseStart;
    }

    const minSetting = MediaBarEnhancedSettingsManager.getSetting('randomTrailerStartMinPercent', CONFIG.randomTrailerStartMinPercent);
    const maxSetting = MediaBarEnhancedSettingsManager.getSetting('randomTrailerStartMaxPercent', CONFIG.randomTrailerStartMaxPercent);

    let minP = clampTrailerStartPercent(minSetting, 10) / 100;
    let maxP = clampTrailerStartPercent(maxSetting, 75) / 100;
    if (minP > maxP) {
      const tmp = minP;
      minP = maxP;
      maxP = tmp;
    }

    const lo = baseStart + usableSpan * minP;
    const hi = baseStart + usableSpan * maxP;
    if (hi <= lo + 0.05) {
      return lo;
    }

    if (!STATE.slideshow.trailerStartByItem) {
      STATE.slideshow.trailerStartByItem = {};
    }

    if (!forceNew && itemId && STATE.slideshow.trailerStartByItem[itemId] != null && STATE.slideshow.trailerStartByItem[itemId] > 0) {
      return STATE.slideshow.trailerStartByItem[itemId];
    }

    const t = lo + Math.random() * (hi - lo);
    if (itemId && usableSpan > 5) {
      STATE.slideshow.trailerStartByItem[itemId] = t;
    }
    return t;
  }

  /**
   * Apply start offset to an HTML5 video element once duration is known.
   * @param {HTMLVideoElement} video
   * @param {string} itemId
   * @param {boolean} forceNew
   */
  function applyHtml5TrailerStartOffset(video, itemId, forceNew) {
    if (!video || video.tagName !== 'VIDEO') return;
    const run = () => {
      try {
        const duration = video.duration;
        if (!duration || !Number.isFinite(duration) || duration < 1) return;
        const t = pickRandomTrailerStartSeconds(0, duration, forceNew, itemId);
        video._startOffset = t;
        if (Math.abs((video.currentTime || 0) - t) > 0.4) {
          video.currentTime = t;
        }
      } catch (e) { /* ignore seek races */ }
    };

    if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
      run();
    } else {
      const onMeta = () => {
        video.removeEventListener('loadedmetadata', onMeta);
        run();
      };
      video.addEventListener('loadedmetadata', onMeta);
    }
  }

  function getEffectiveTrailerVolume() {
    const value = STATE.slideshow.sessionTrailerVolume ??
      MediaBarEnhancedSettingsManager.getSetting("defaultTrailerVolume", CONFIG.defaultTrailerVolume);
    const volume = parseInt(value, 10);
    return Number.isFinite(volume) ? volume : 40;
  }

  /**
   * Returns the effective value for waiting for trailer to end, respecting client-side overrides.
   * @returns {boolean} Whether to wait for the trailer to end
   */
  function getEffectiveWaitForTrailer() {
    return MediaBarEnhancedSettingsManager.getSetting('waitForTrailer', CONFIG.waitForTrailerToEnd);
  }

  /**
   * Returns whether split-screen trailer layout is enabled.
   * @returns {boolean} Whether split-screen trailer view is active
   */
  function isEditorialTrailerEnabled() {
    return MediaBarEnhancedSettingsManager.getSetting("editorialTrailers", CONFIG.editorialTrailers);
  }

  function isSplitScreenTrailerEnabled() {
    return !isEditorialTrailerEnabled() && MediaBarEnhancedSettingsManager.getSetting('splitScreenTrailer', CONFIG.enableSplitScreenTrailer);
  }

  /**
   * Returns whether bottom fade gradient is enabled.
   * @returns {boolean} Whether bottom fade gradient is active
   */
  function isBottomGradientEnabled() {
    return MediaBarEnhancedSettingsManager.getSetting('enableBottomGradient', CONFIG.enableBottomGradient !== false);
  }

  /**
   * Returns whether pausing the slideshow on mouse hover is enabled.
   * @returns {boolean} Whether pause on hover is active
   */
  function isPauseOnHoverEnabled() {
    return MediaBarEnhancedSettingsManager.getSetting('pauseOnHover', CONFIG.pauseOnHover);
  }

  /**
   * Initialize page visibility handling to pause when tab is inactive
   */
  const initPageVisibilityHandler = () => {
    if (initPageVisibilityHandler.bound) return;
    initPageVisibilityHandler.bound = true;
    let blurTimer;
    let interruptedSlide;

    const suspend = () => {
      if (STATE.slideshow.isSuspended) return;
      STATE.slideshow.isSuspended = true;
      MediaBarEnhancedSettingsManager.closePopup(false);
      STATE.slideshow.slideInterval?.stop();
      clearTimeout(STATE.slideshow.backdropVideoTimeout);
      STATE.slideshow.currentPlayVideoLogic = null;
      const itemId = STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex];
      const activeSlide = document.querySelector("#slides-container .slide.active");
      const player = STATE.slideshow.videoPlayers?.[itemId];
      const video = activeSlide?.querySelector("video.video-backdrop");
      const playerState = player?.getPlayerState?.();
      const playingYouTube = playerState === 1 || playerState === 3;
      const retain = !STATE.slideshow.isPaused && activeSlide?.dataset.itemId === itemId
        ? (playingYouTube ? player : video && !video.paused && !video.ended ? video : null)
        : null;
      interruptedSlide = retain ? activeSlide : null;
      if (!retain) STATE.slideshow.playSignals = {};
      SlideshowManager.stopAllPlayback(retain);
      STATE.slideshow.isVideoPlaying = false;
      document.documentElement.classList.add("marquee-suspended");
    };

    const resume = () => {
      clearTimeout(blurTimer);
      if (document.hidden || !STATE.slideshow.isSuspended) return;
      STATE.slideshow.isSuspended = false;
      document.documentElement.classList.remove("marquee-suspended");
      VisibilityObserver.updateVisibility();
      const slide = interruptedSlide;
      interruptedSlide = null;
      if (!VisibilityObserver.wasVisible || VisibilityObserver.wasRemotePlaying || STATE.slideshow.isPaused) return;
      if (slide?.isConnected && slide.classList.contains("active") &&
          slide.dataset.itemId === STATE.slideshow.itemIds[STATE.slideshow.currentSlideIndex]) {
        SlideshowManager.resumeActivePlayback();
        if (!getEffectiveWaitForTrailer()) STATE.slideshow.slideInterval?.start();
        return;
      }
      if (!STATE.slideshow.isTransitioning && STATE.slideshow.itemIds.length) {
        SlideshowManager.updateCurrentSlide(STATE.slideshow.currentSlideIndex);
      }
      STATE.slideshow.slideInterval?.start();
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) suspend();
      else resume();
    });
    window.addEventListener("blur", () => {
      clearTimeout(blurTimer);
      blurTimer = setTimeout(() => {
        if (!document.hasFocus()) suspend();
      }, 15000);
    });
    window.addEventListener("focus", resume);
    window.addEventListener("pagehide", suspend);
    window.addEventListener("pageshow", resume);
    if (document.hidden) suspend();
  };

  /**
   * Initialize the slideshow
   */
  const slidesInit = async () => {
    if (STATE.slideshow.hasInitialized) {
      console.log("🎬 Media Bar:", "Slideshow already initialized, skipping");
      return;
    }

    const mobileMode = MediaBarEnhancedSettingsManager.getSetting('mobileMode', CONFIG.mobileCompactMode);

    document.body.classList.remove('media-bar-mobile-16-9', 'media-bar-mobile-4-3');
    if (mobileMode === '16:9') {
      document.body.classList.add('media-bar-mobile-16-9');
    } else if (mobileMode === '4:3') {
      document.body.classList.add('media-bar-mobile-4-3');
    }

    const renderCustomOverlay = () => {
      let activeOverlayText = CONFIG.customOverlayText;
      let activeOverlayImage = CONFIG.customOverlayImageUrl;
      let isSeasonOverride = false;

      if (CONFIG.enableSeasonalContent && CONFIG.seasonalSections) {
        try {
          const sections = JSON.parse(CONFIG.seasonalSections || "[]");
          const now = new Date();
          const currentMonth = now.getMonth() + 1;
          const currentDay = now.getDate();

          for (const section of sections) {
            const startMonth = parseInt(section.StartMonth);
            const startDay = parseInt(section.StartDay);
            const endMonth = parseInt(section.EndMonth);
            const endDay = parseInt(section.EndDay);

            let isActive = false;
            if (startMonth === endMonth) {
              if (currentMonth === startMonth && currentDay >= startDay && currentDay <= endDay) {
                isActive = true;
              }
            } else if (startMonth < endMonth) {
              if (currentMonth > startMonth && currentMonth < endMonth) {
                isActive = true;
              } else if (currentMonth === startMonth && currentDay >= startDay) {
                isActive = true;
              } else if (currentMonth === endMonth && currentDay <= endDay) {
                isActive = true;
              }
            } else { // Wraps around year
              if (currentMonth > startMonth || currentMonth < endMonth) {
                isActive = true;
              } else if (currentMonth === startMonth && currentDay >= startDay) {
                isActive = true;
              } else if (currentMonth === endMonth && currentDay <= endDay) {
                isActive = true;
              }
            }

            if (isActive) {
              if (section.OverlayText || section.OverlayImageUrl) {
                isSeasonOverride = true;
                // Season fully overrides global overlay, even if empty
                activeOverlayImage = section.OverlayImageUrl || null;
                activeOverlayText = section.OverlayText || null;
              }
              break;
            }
          }
        } catch (e) {
          console.error("🎬 Media Bar:", "Error parsing seasonal sections for overlay:", e);
        }
      }

      if (!CONFIG.enableCustomOverlay && !isSeasonOverride) {
        return;
      }

      if (!activeOverlayText && !activeOverlayImage) return;

      const overlayContainer = document.createElement("div");
      overlayContainer.className = "custom-overlay-container";

      const overlayPriority = CONFIG.customOverlayPriority || "Image";
      const showImage = activeOverlayImage && (overlayPriority === "Image" || !activeOverlayText);
      const showText = activeOverlayText && (!showImage);

      if (showImage) {
        const img = document.createElement("img");
        const imgStyle = CONFIG.customOverlayImageStyle || "None";
        img.className = `custom-overlay-image custom-overlay-img-${imgStyle}`;

        // If activeOverlayImage starts with /, adjust for base URL
        if (activeOverlayImage.startsWith('/') && !activeOverlayImage.startsWith('//')) {
          img.src = `${STATE.jellyfinData.serverAddress}${activeOverlayImage}`;
        } else {
          img.src = activeOverlayImage;
        }

        overlayContainer.appendChild(img);
      } else if (showText) {
        const p = document.createElement("p");
        p.className = `custom-overlay-text custom-overlay-style-${CONFIG.customOverlayStyle || 'Shadowed'}`;
        p.textContent = activeOverlayText;
        overlayContainer.appendChild(p);
      }

      const slidesContainer = document.getElementById("slides-container");
      if (slidesContainer) {
        const posX = CONFIG.customOverlayPositionX || 0;
        const posY = CONFIG.customOverlayPositionY || 0;
        const scaleValue = (CONFIG.customOverlayScale !== undefined ? CONFIG.customOverlayScale : 100) / 100;

        overlayContainer.style.setProperty('--overlay-x', `${posX}vw`);
        overlayContainer.style.setProperty('--overlay-y', `${posY}vh`);
        overlayContainer.style.setProperty('--overlay-scale', scaleValue);

        slidesContainer.appendChild(overlayContainer);
      }
    };

    if (CONFIG.enableClientSideSettings) {
      MediaBarEnhancedSettingsManager.init();
      const isClientSideEnabled = MediaBarEnhancedSettingsManager.getSetting('enabled', true);
      if (!isClientSideEnabled) {
        console.log("🎬 Media Bar:", "Disabled by client-side setting.");
        const homeSections = document.querySelector('.homeSectionsContainer');
        if (homeSections) {
          homeSections.style.top = '0';
          homeSections.style.marginTop = '0';
        }
        let container = document.getElementById('slides-container');
        if (container) {
          container.style.display = 'none';
        } else {
          // Create dummy container so loading screen's interval can trigger its own cleanup
          container = document.createElement('div');
          container.id = 'slides-container';
          container.style.display = 'none';
          document.body.appendChild(container);
        }

        return;
      }
    }

    STATE.slideshow.hasInitialized = true;

    /**
     * Initialize IntersectionObserver for lazy loading images
     */
    const initLazyLoading = () => {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const image = entry.target;
              const highQualityUrl = image.getAttribute("data-high-quality");

              if (
                highQualityUrl &&
                image.closest(".slide").style.opacity === "1"
              ) {
                requestQueue.push({
                  url: highQualityUrl,
                  callback: () => {
                    image.src = highQualityUrl;
                    image.classList.remove("low-quality");
                    image.classList.add("high-quality");
                  },
                });

                if (requestQueue.length === 1) {
                  processNextRequest();
                }
              }

              observer.unobserve(image);
            }
          });
        },
        {
          rootMargin: "50px",
          threshold: 0.1,
        }
      );

      const observeSlideImages = () => {
        const slidesContainer = SlideUtils.getOrCreateSlidesContainer();
        const slides = slidesContainer.querySelectorAll(".slide");
        slides.forEach((slide) => {
          const images = slide.querySelectorAll("img.low-quality");
          images.forEach((image) => {
            imageObserver.observe(image);
          });
        });
      };

      const slideObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes) {
            mutation.addedNodes.forEach((node) => {
              if (node.classList && node.classList.contains("slide")) {
                const images = node.querySelectorAll("img.low-quality");
                images.forEach((image) => {
                  imageObserver.observe(image);
                });
              }
            });
          }
        });
      });

      const container = SlideUtils.getOrCreateSlidesContainer();
      slideObserver.observe(container, { childList: true });

      observeSlideImages();

      return imageObserver;
    };

    const lazyLoadObserver = initLazyLoading();

    try {
      console.log("🎬 Media Bar:", "Initializing Enhanced Jellyfin Slideshow");

      VisibilityObserver.init();

      initArrowNavigation();

      renderCustomOverlay();

      await SlideshowManager.loadSlideshowData();

      SlideshowManager.initTouchEvents();

      SlideshowManager.initKeyboardEvents();

      initPageVisibilityHandler();

      console.log("🎬 Media Bar:", "Enhanced Jellyfin Slideshow initialized successfully");
    } catch (error) {
      console.error("🎬 Media Bar:", "Error initializing slideshow:", error);
      STATE.slideshow.hasInitialized = false;
      STATE.slideshow.initialLoadComplete = true;
    }
  };

  window.mediaBarEnhanced = {
    CONFIG,
    STATE,
    SlideUtils,
    ApiUtils,
    SlideCreator,
    SlideshowManager,
    VisibilityObserver,
    initSlideshowData: () => {
      SlideshowManager.loadSlideshowData();
    },
    nextSlide: () => {
      SlideshowManager.nextSlide();
    },
    prevSlide: () => {
      SlideshowManager.prevSlide();
    },
  };

  initLoadingScreen();

  fetchPluginConfig().then(() => {
    startLoginStatusWatcher();
  });
})();