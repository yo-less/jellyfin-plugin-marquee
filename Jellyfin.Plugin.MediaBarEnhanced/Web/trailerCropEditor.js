export function setupTrailerCropEditor(editor, save, onTrailerChange) {
    if (!editor || editor.dataset.ready) return;
    editor.dataset.ready = 'true';
    const field = name => editor.querySelector('[data-crop-' + name + ']');
    const stored = editor.querySelector('#TrailerCropSettings');
    const preview = field('preview');
    const source = field('source');
    const slider = field('slider');
    const status = field('status');
    let id, media;
    const read = () => {
        try { return JSON.parse(stored.value) || {}; } catch { return {}; }
    };
    const sizePreview = value => {
        if (!media) return;
        const remaining = 1 - 2 * value / 100;
        const local = media.tagName === 'VIDEO';
        const ratio = local && media.videoHeight ? media.videoWidth / media.videoHeight : 16 / 9;
        preview.style.aspectRatio = String(ratio / remaining);
        if (local) {
            media.style.setProperty('object-view-box', 'inset(' + value + '% 0)');
            media.style.objectFit = 'contain';
        } else {
            media.style.height = 100 / remaining + '%';
            media.style.transform = 'translateY(-' + value + '%)';
        }
    };
    const sync = () => {
        const value = Number(slider.value);
        field('value').textContent = value.toFixed(1) + '%';
        sizePreview(value);
    };
    slider.addEventListener('input', sync);
    const clear = () => {
        id = media = null;
        onTrailerChange?.(null);
        preview.replaceChildren();
        preview.style.aspectRatio = '';
        field('apply').disabled = field('reset').disabled = true;
        status.textContent = '';
    };
    source.addEventListener('input', clear);
    function loadPreview(autoplay = false) {
        clear();
        const input = source.value.trim();
        const normalized = input.replace(/-/g, "");
        const value = /^[0-9a-f]{32}$/i.test(normalized) ? normalized : input;
        const local = /^[0-9a-f]{32}$/i.test(value);
        if (local) {
            id = value.toLowerCase();
        } else {
            try {
                const url = new URL(value);
                if (url.hostname === 'youtu.be') id = url.pathname.split('/')[1];
                if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
                    id = url.searchParams.get('v') || /^\/(?:embed|shorts)\/([\w-]{11})/.exec(url.pathname)?.[1];
                }
            } catch { id = value; }
            if (!/^[\w-]{11}$/.test(id || '')) {
                id = null;
                status.textContent = 'Enter a YouTube link or a local trailer item ID.';
                return;
            }
        }
        media = document.createElement(local ? 'video' : 'iframe');
        Object.assign(media.style, { width: '100%', height: '100%', border: '0', display: 'block' });
        if (local) {
            media.controls = true;
            media.loop = true;
            media.playsInline = true;
            media.muted = autoplay;
            media.autoplay = autoplay;
            media.preload = 'metadata';
            media.addEventListener('loadedmetadata', event => {
                if (event.currentTarget === media) sync();
            });
            media.src = ApiClient.getUrl('Videos/' + id + '/stream.mp4', {
                static: true, api_key: ApiClient.accessToken()
            });
        } else {
            media.title = 'Trailer preview';
            media.allow = 'autoplay; encrypted-media';
            media.referrerPolicy = 'strict-origin-when-cross-origin';
            media.src = 'https://www.youtube-nocookie.com/embed/' + id + '?playsinline=1&rel=0&loop=1&playlist=' + id + (autoplay ? '&autoplay=1&mute=1' : '');
        }
        preview.append(media);
        slider.value = read()[id] ?? 0;
        sync();
        field('apply').disabled = field('reset').disabled = false;
        onTrailerChange?.(id);
    }
    field('load').addEventListener('click', () => loadPreview(true));

    async function stageCrop(remove) {
        if (!id) return;
        const crops = read();
        if (remove) delete crops[id];
        else crops[id] = Number(slider.value);
        const value = JSON.stringify(crops);
        if (save) {
            const current = id;
            field('apply').disabled = field('reset').disabled = true;
            try {
                stored.value = await save(current, remove ? undefined : crops[current]);
                if (current !== id) return;
                status.textContent = remove ? 'Crop cleared for everyone.' : 'Crop saved for everyone.';
            } catch {
                if (current === id) status.textContent = 'Could not save the crop. Try again.';
                return;
            } finally {
                if (current === id) field('apply').disabled = field('reset').disabled = false;
            }
        } else {
            stored.value = value;
            status.textContent = remove ? 'Crop cleared. Save Marquee settings to apply.' : 'Crop set. Save Marquee settings to apply.';
        }
        if (remove) slider.value = 0;
        sync();
    }
    field('apply').addEventListener('click', () => stageCrop(false));
    field('reset').addEventListener('click', () => stageCrop(true));
    return (value, autoplay = false) => {
        source.value = value || '';
        if (value) loadPreview(autoplay);
        else clear();
    };
}
