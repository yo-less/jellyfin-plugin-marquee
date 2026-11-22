export function setupTrailerCropEditor(editor, save, onTrailerChange) {
    if (!editor || editor.dataset.ready) return;
    editor.dataset.ready = 'true';
    const field = name => editor.querySelector('[data-crop-' + name + ']');
    const stored = editor.querySelector('#TrailerCropSettings');
    const preview = field('preview');
    const still = field('still');
    const source = field('source');
    const slider = field('slider');
    const capture = field('capture');
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
        const guide = still.querySelector('[data-guide]');
        if (guide) guide.style.inset = value + '% 0';
        sizePreview(value);
    };
    slider.addEventListener('input', sync);
    const clear = () => {
        id = media = null;
        onTrailerChange?.(null);
        preview.replaceChildren();
        preview.style.aspectRatio = '';
        still.replaceChildren();
        capture.disabled = field('apply').disabled = field('reset').disabled = true;
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
            media.src = 'https://www.youtube-nocookie.com/embed/' + id + '?playsinline=1&rel=0' + (autoplay ? '&autoplay=1&mute=1' : '');
        }
        preview.append(media);
        slider.value = read()[id] ?? 0;
        sync();
        capture.disabled = field('apply').disabled = field('reset').disabled = false;
        onTrailerChange?.(id);
    }
    field('load').addEventListener('click', () => loadPreview());

    function showStill(frame) {
        const width = frame.videoWidth || frame.naturalWidth;
        const height = frame.videoHeight || frame.naturalHeight;
        if (!width || !height) throw Error('No frame available');
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(width, 640);
        canvas.height = Math.round(canvas.width * height / width);
        canvas.style.cssText = 'width:100%;display:block';
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(frame, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const dark = y => {
            for (let x = 5; x < canvas.width - 5; x += 5) {
                const i = (y * canvas.width + x) * 4;
                if (Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) > 24) return false;
            }
            return true;
        };
        let top = 0, bottom = 0;
        const max = Math.floor(canvas.height * (Number(slider.max) / 100));
        while (top < max && dark(top)) top++;
        while (bottom < max && dark(canvas.height - 1 - bottom)) bottom++;
        const suggestion = top > 1 && bottom > 1 && top < max && bottom < max &&
            Math.abs(top - bottom) < canvas.height * 0.025 && !dark(Math.floor(canvas.height / 2));
        if (suggestion) {
            slider.value = Math.min(Number(slider.max), Math.ceil((Math.max(top, bottom) + 1) * 1000 / canvas.height) / 10);
        }
        const guide = document.createElement('div');
        guide.dataset.guide = '';
        guide.style.cssText = 'position:absolute;border-block:1px solid white;box-shadow:0 0 0 100vmax #0009;pointer-events:none';
        still.replaceChildren(canvas, guide);
        sync();
        status.textContent = suggestion ? 'Adjust the suggested crop, then select Set crop.' : 'Adjust the guide lines, then select Set crop.';
    }

    capture.addEventListener('click', async () => {
        const current = media;
        if (!current) return;
        capture.disabled = true;
        let stream;
        try {
            if (current.tagName === 'VIDEO') {
                current.pause();
                showStill(current);
            } else {
                if (!window.CropTarget || !navigator.mediaDevices?.getDisplayMedia) throw Error('Tab capture unavailable');
                sizePreview(0);
                stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false, preferCurrentTab: true });
                const track = stream.getVideoTracks()[0];
                if (current !== media || track?.getSettings().displaySurface !== 'browser' || !track.cropTo) throw Error('Choose this tab');
                await track.cropTo(await window.CropTarget.fromElement(preview));
                const frame = document.createElement('video');
                frame.muted = true;
                frame.srcObject = stream;
                await frame.play();
                if (current === media) showStill(frame);
            }
        } catch {
            if (current === media) status.textContent = current.tagName === 'VIDEO'
                ? 'Play the trailer to load a frame first.'
                : 'Share this Jellyfin tab or paste a screenshot of the uncropped trailer frame.';
        } finally {
            stream?.getTracks().forEach(track => track.stop());
            if (current === media) {
                capture.disabled = false;
                sync();
            }
        }
    });

    field('paste').addEventListener('paste', async event => {
        if (!id) return;
        const current = media;
        const file = Array.from(event.clipboardData?.files || []).find(file => file.type.startsWith('image/'));
        if (!file) return;
        event.preventDefault();
        const url = URL.createObjectURL(file);
        try {
            const image = new Image();
            image.src = url;
            await image.decode();
            if (current === media) showStill(image);
        } catch {
            if (current === media) status.textContent = 'Could not use the pasted image.';
        } finally {
            URL.revokeObjectURL(url);
        }
    });

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
