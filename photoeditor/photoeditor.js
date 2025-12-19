
    // --- State Management ---
    const canvas = document.getElementById('editorCanvas');
    const ctx = canvas.getContext('2d');
    const fileInput = document.getElementById('fileInput');
    const canvasWrapper = document.getElementById('canvasWrapper');
    const dropZone = document.body; // Whole body is drop zone

    // Controls
    const newCanvasBtn = document.getElementById('newCanvasBtn');
    const openImageBtn = document.getElementById('openImageBtn');
    const exportBtn = document.getElementById('exportBtn');
    const cancelNewCanvasBtn = document.getElementById('cancelNewCanvasBtn');
    const createCanvasBtn = document.getElementById('createCanvasBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const resetAdjustmentsControl = document.getElementById('reset-adj');
    const cropModeBtn = document.getElementById('btnCrop');
    const rotate90Btn = document.getElementById('rotate90Btn');
    const flipHBtn = document.getElementById('flipHBtn');
    const flipVBtn = document.getElementById('flipVBtn');
    const presetGrayscaleBtn = document.getElementById('presetGrayscaleBtn');
    const presetSepiaBtn = document.getElementById('presetSepiaBtn');
    const presetInvertBtn = document.getElementById('presetInvertBtn');
    const presetVintageBtn = document.getElementById('presetVintageBtn');
    const cancelCropBtn = document.getElementById('cancelCropBtn');
    const applyCropBtn = document.getElementById('applyCropBtn');
    const imageInfo = document.getElementById('imageInfo');
    const cropSizeBadge = document.getElementById('cropSizeBadge');
    const layersList = document.getElementById('layersList');
    const layerUpBtn = document.getElementById('layerUpBtn');
    const layerDownBtn = document.getElementById('layerDownBtn');
    const layerDeleteBtn = document.getElementById('layerDeleteBtn');
    const layerScaleInput = document.getElementById('layerScale');
    const layerScaleLabel = document.getElementById('layerScaleLabel');
    const layerFitBtn = document.getElementById('layerFitBtn');
    const addLayerBtn = document.getElementById('addLayerBtn');
    const addSmartLayerBtn = document.getElementById('addSmartLayerBtn');
    const layerOpacityInput = document.getElementById('layerOpacity');
    const layerOpacityLabel = document.getElementById('layerOpacityLabel');
    const layerBlurInput = document.getElementById('layerBlur');
    const layerBlurLabel = document.getElementById('layerBlurLabel');
    const layerShadowToggle = document.getElementById('layerShadowToggle');
    const layerShadowXInput = document.getElementById('layerShadowX');
    const layerShadowYInput = document.getElementById('layerShadowY');
    const layerShadowBlurInput = document.getElementById('layerShadowBlur');
    const layerShadowOpacityInput = document.getElementById('layerShadowOpacity');
    const layerShadowColorInput = document.getElementById('layerShadowColor');

    // State Variables
    let img = new Image(); // The source image (always unmodified pixels)
    let isImageLoaded = false;
    let rotation = 0;
    let flipH = 1;
    let flipV = 1;
    let customCanvasActive = true; // when true, keep canvas size on incoming images
    let useCanvasFit = true; // when true, scale image to cover canvas
    const fitMode = 'cover';

    // Layer model
    let layers = [];
    let activeLayerId = null;
    let layerDrag = { dragging: false, id: null, startX: 0, startY: 0 };

    // Filter Defaults
    const defaultFilters = {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        blur: 0,
        hue: 0
    };
    let filters = { ...defaultFilters };

    function cloneLayerEffects(base = defaultLayerEffects) {
        return {
            opacity: base.opacity,
            blur: base.blur,
            blendMode: base.blendMode,
            shadow: { ...base.shadow }
        };
    }

    function ensureLayerEffects(layer) {
        if (!layer.effects) layer.effects = cloneLayerEffects();
        if (!layer.effects.shadow) layer.effects.shadow = { ...defaultLayerEffects.shadow };
        if (layer.effects.shadow && !layer.effects.shadow.hex) layer.effects.shadow.hex = '#000000';
        return layer.effects;
    }

    function hexToRgba(hex, alpha = 1) {
        const sanitized = hex.replace('#', '');
        const bigint = parseInt(sanitized, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const defaultLayerEffects = {
        opacity: 1,
        blur: 0,
        blendMode: 'source-over',
        shadow: {
            enabled: false,
            x: 8,
            y: 8,
            blur: 20,
            opacity: 0.35,
            hex: '#000000',
            color: 'rgba(0,0,0,0.35)'
        }
    };

    function setImageInfoText(text) {
        if (!imageInfo) return;
        imageInfo.textContent = text;
    }

    function getDrawDimensions(sourceWidth = img.width, sourceHeight = img.height) {
        if (!sourceWidth || !sourceHeight) {
            return { drawW: canvas.width, drawH: canvas.height, scale: 1 };
        }

        if (!useCanvasFit) {
            return { drawW: sourceWidth, drawH: sourceHeight, scale: 1 };
        }

        const scale = fitMode === 'cover'
            ? Math.max(canvas.width / sourceWidth, canvas.height / sourceHeight)
            : Math.min(canvas.width / sourceWidth, canvas.height / sourceHeight);

        return { drawW: sourceWidth * scale, drawH: sourceHeight * scale, scale };
    }

    function describeFit(sourceWidth, sourceHeight) {
        if (!canvas.width || !canvas.height) return '';
        const { drawW, drawH, scale } = getDrawDimensions(sourceWidth, sourceHeight);
        if (useCanvasFit) {
            return `Image ${sourceWidth}x${sourceHeight} -> canvas ${canvas.width}x${canvas.height} (cover ${scale.toFixed(2)}x, draw ${Math.round(drawW)}x${Math.round(drawH)})`;
        }
        return `Image ${sourceWidth}x${sourceHeight} (canvas resized to image)`;
    }

    function createLayerFromImage(image, name = 'Layer') {
        const baseScale = Math.max(canvas.width / image.width, canvas.height / image.height) || 1;
        const layer = {
            id: crypto.randomUUID(),
            name: `${name} (${image.width}x${image.height})`,
            img: image,
            w: image.width,
            h: image.height,
            x: 0,
            y: 0,
            scale: baseScale,
            rotation: 0,
            visible: true,
            isSmart: false,
            effects: cloneLayerEffects()
        };
        return layer;
    }

    function setActiveLayer(id) {
        activeLayerId = id;
        updateLayerUI();
        syncLayerEffectsUI();
    }

    function updateLayerUI() {
        if (!layersList) return;
        layersList.innerHTML = '';
        layers.forEach(layer => {
            ensureLayerEffects(layer);
            const div = document.createElement('div');
            div.className = 'layer-item' + (layer.id === activeLayerId ? ' active' : '');
            div.dataset.id = layer.id;
            const smartMark = layer.isSmart ? ' • Smart' : '';
            div.innerHTML = `<span>${layer.name}${smartMark}</span><span>${Math.round(layer.scale * 100)}%</span>`;
            div.addEventListener('click', () => setActiveLayer(layer.id));
            layersList.appendChild(div);
        });

        const active = layers.find(l => l.id === activeLayerId);
        if (active && layerScaleInput && layerScaleLabel) {
            layerScaleInput.value = Math.round(active.scale * 100);
            layerScaleLabel.textContent = `${Math.round(active.scale * 100)}%`;
        }
    }

    function syncLayerEffectsUI() {
        const active = layers.find(l => l.id === activeLayerId);
        if (!active) return;
        const effects = ensureLayerEffects(active);
        if (layerOpacityInput && layerOpacityLabel) {
            layerOpacityInput.value = Math.round((effects.opacity ?? 1) * 100);
            layerOpacityLabel.textContent = `${Math.round((effects.opacity ?? 1) * 100)}%`;
        }
        if (layerBlurInput && layerBlurLabel) {
            layerBlurInput.value = effects.blur ?? 0;
            layerBlurLabel.textContent = `${effects.blur ?? 0}px`;
        }
        if (layerShadowToggle) layerShadowToggle.checked = !!effects.shadow.enabled;
        if (layerShadowXInput) layerShadowXInput.value = effects.shadow.x;
        if (layerShadowYInput) layerShadowYInput.value = effects.shadow.y;
        if (layerShadowBlurInput) layerShadowBlurInput.value = effects.shadow.blur;
        if (layerShadowOpacityInput) layerShadowOpacityInput.value = effects.shadow.opacity;
        if (layerShadowColorInput) layerShadowColorInput.value = effects.shadow.hex || '#000000';
    }

    function updateActiveLayerEffects(partial) {
        const active = layers.find(l => l.id === activeLayerId);
        if (!active) return;
        const effects = ensureLayerEffects(active);
        active.effects = { ...effects, ...partial };
        render();
        updateLayerUI();
    }

    function updateCropBadge() {
        if (!cropSizeBadge) return;
        const style = window.getComputedStyle(cropBox);
        const width = Math.max(0, Math.round(parseFloat(style.width)));
        const height = Math.max(0, Math.round(parseFloat(style.height)));
        cropSizeBadge.textContent = width && height ? `${width}px × ${height}px` : '';
    }

    // --- Initialization ---
    // Create a default empty canvas on load
    window.onload = () => {
        createBlankCanvas(800, 600, '#1e1e1e');
    };

    // --- UI Event Bindings ---
    newCanvasBtn.addEventListener('click', showModal);
    openImageBtn.addEventListener('click', () => fileInput.click());
    exportBtn.addEventListener('click', downloadImage);
    cancelNewCanvasBtn.addEventListener('click', closeModal);
    createCanvasBtn.addEventListener('click', createCustomCanvas);
    cropModeBtn.addEventListener('click', initCrop);
    cancelCropBtn.addEventListener('click', cancelCrop);
    applyCropBtn.addEventListener('click', applyCrop);
    resetAllBtn.addEventListener('click', resetAll);
    resetAdjustmentsControl.addEventListener('click', resetAdjustments);
    rotate90Btn.addEventListener('click', () => rotate(90));
    flipHBtn.addEventListener('click', () => flip('h'));
    flipVBtn.addEventListener('click', () => flip('v'));
    presetGrayscaleBtn.addEventListener('click', () => setPreset('grayscale'));
    presetSepiaBtn.addEventListener('click', () => setPreset('sepia'));
    presetInvertBtn.addEventListener('click', () => setPreset('invert'));
    presetVintageBtn.addEventListener('click', () => setPreset('vintage'));

    // --- Event Listeners: Drag & Drop ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropZone.addEventListener('dragenter', () => document.getElementById('dropOverlay').style.display = 'flex');
    dropZone.addEventListener('dragleave', (e) => {
        if(e.target === document.getElementById('dropOverlay')) {
            document.getElementById('dropOverlay').style.display = 'none';
        }
    });
    
    dropZone.addEventListener('drop', handleDrop);

    function handleDrop(e) {
        document.getElementById('dropOverlay').style.display = 'none';
        const dt = e.dataTransfer;
        const files = dt.files;
        if(files.length) handleFiles(files);
    }

    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Layer UI bindings
    layerUpBtn.addEventListener('click', () => moveLayer(1));
    layerDownBtn.addEventListener('click', () => moveLayer(-1));
    layerDeleteBtn.addEventListener('click', deleteActiveLayer);
    layerFitBtn.addEventListener('click', fitActiveLayer);
    layerScaleInput.addEventListener('input', () => {
        const active = layers.find(l => l.id === activeLayerId);
        if (!active) return;
        active.scale = layerScaleInput.value / 100;
        layerScaleLabel.textContent = `${layerScaleInput.value}%`;
        render();
        updateLayerUI();
    });

    if (addLayerBtn) addLayerBtn.addEventListener('click', addEmptyLayer);
    if (addSmartLayerBtn) addSmartLayerBtn.addEventListener('click', addSmartLayer);

    if (layerOpacityInput) layerOpacityInput.addEventListener('input', () => {
        const active = layers.find(l => l.id === activeLayerId);
        if (!active) return;
        const effects = ensureLayerEffects(active);
        effects.opacity = layerOpacityInput.value / 100;
        layerOpacityLabel.textContent = `${layerOpacityInput.value}%`;
        render();
    });

    if (layerBlurInput) layerBlurInput.addEventListener('input', () => {
        const active = layers.find(l => l.id === activeLayerId);
        if (!active) return;
        const effects = ensureLayerEffects(active);
        effects.blur = parseInt(layerBlurInput.value, 10) || 0;
        layerBlurLabel.textContent = `${effects.blur}px`;
        render();
    });

    if (layerShadowToggle) layerShadowToggle.addEventListener('change', () => updateShadowFromUI());
    if (layerShadowXInput) layerShadowXInput.addEventListener('input', () => updateShadowFromUI());
    if (layerShadowYInput) layerShadowYInput.addEventListener('input', () => updateShadowFromUI());
    if (layerShadowBlurInput) layerShadowBlurInput.addEventListener('input', () => updateShadowFromUI());
    if (layerShadowOpacityInput) layerShadowOpacityInput.addEventListener('input', () => updateShadowFromUI());
    if (layerShadowColorInput) layerShadowColorInput.addEventListener('input', () => updateShadowFromUI());

    function handleFiles(files) {
        const file = files[0];
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const incoming = new Image();
            incoming.onload = () => {
                const shouldFitToCanvas = customCanvasActive && canvas.width && canvas.height;

                if (!shouldFitToCanvas && layers.length === 0) {
                    canvas.width = incoming.width;
                    canvas.height = incoming.height;
                    useCanvasFit = false;
                }

                const layer = createLayerFromImage(incoming, 'Layer');
                layers.push(layer);
                setActiveLayer(layer.id);
                isImageLoaded = true;
                setImageInfoText(describeFit(incoming.width, incoming.height));
                updateLayerUI();
                render();

                // After placing the first image, leave canvas sizing to user unless they create a new canvas
                customCanvasActive = false;
            };
            incoming.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function addEmptyLayer() {
        const w = canvas.width || 800;
        const h = canvas.height || 600;
        const temp = document.createElement('canvas');
        temp.width = w;
        temp.height = h;
        const imgEl = new Image();
        imgEl.onload = () => {
            const layer = createLayerFromImage(imgEl, 'Empty Layer');
            layer.isSmart = false;
            layer.effects = cloneLayerEffects();
            layers.push(layer);
            setActiveLayer(layer.id);
            updateLayerUI();
            render();
        };
        imgEl.src = temp.toDataURL();
    }

    function addSmartLayer() {
        const source = layers.find(l => l.id === activeLayerId) || layers[0];
        if (!source) return;
        const imgEl = new Image();
        imgEl.onload = () => {
            const layer = createLayerFromImage(imgEl, `${source.name} (Smart)`);
            layer.isSmart = true;
            layer.effects = cloneLayerEffects(source.effects || defaultLayerEffects);
            layer.w = source.w;
            layer.h = source.h;
            layer.x = source.x;
            layer.y = source.y;
            layer.scale = source.scale;
            layer.rotation = source.rotation;
            layers.push(layer);
            setActiveLayer(layer.id);
            updateLayerUI();
            render();
        };
        imgEl.src = source.img.src;
    }

    function updateShadowFromUI() {
        const active = layers.find(l => l.id === activeLayerId);
        if (!active) return;
        const effects = ensureLayerEffects(active);
        const shadow = effects.shadow;
        if (layerShadowToggle) shadow.enabled = layerShadowToggle.checked;
        if (layerShadowXInput) shadow.x = parseFloat(layerShadowXInput.value) || 0;
        if (layerShadowYInput) shadow.y = parseFloat(layerShadowYInput.value) || 0;
        if (layerShadowBlurInput) shadow.blur = parseFloat(layerShadowBlurInput.value) || 0;
        if (layerShadowOpacityInput) shadow.opacity = parseFloat(layerShadowOpacityInput.value) || 0;
        if (layerShadowColorInput) shadow.hex = layerShadowColorInput.value || '#000000';
        shadow.color = hexToRgba(shadow.hex, shadow.opacity);
        render();
        updateLayerUI();
    }

    // --- Core Rendering Engine ---
    function render() {
        if (!canvas.width) return;

        // Update UI Text values
        updateUIValues();

        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();

        // 1. Move to center
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // 2. Apply Transforms (Rotate & Flip)
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(flipH, flipV);

        // 3. Apply Filters using standard Canvas Filter API
        const filterString = `
            brightness(${filters.brightness}%) 
            contrast(${filters.contrast}%) 
            saturate(${filters.saturate}%) 
            blur(${filters.blur}px) 
            hue-rotate(${filters.hue}deg)
        `;
        const baseFilter = filterString.replace(/\s+/g, ' ').trim();

        // 4. Draw Layers (centered)
        if (layers.length) {
            layers.forEach(layer => {
                if (!layer.visible) return;
                ctx.save();
                const effects = ensureLayerEffects(layer);
                const layerBlur = effects.blur || 0;
                ctx.filter = layerBlur ? `${baseFilter} blur(${layerBlur}px)` : baseFilter;
                ctx.globalAlpha = effects.opacity ?? 1;
                ctx.globalCompositeOperation = effects.blendMode || 'source-over';
                if (effects.shadow && effects.shadow.enabled) {
                    ctx.shadowColor = effects.shadow.color || hexToRgba(effects.shadow.hex, effects.shadow.opacity);
                    ctx.shadowOffsetX = effects.shadow.x;
                    ctx.shadowOffsetY = effects.shadow.y;
                    ctx.shadowBlur = effects.shadow.blur;
                } else {
                    ctx.shadowColor = 'transparent';
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 0;
                }
                ctx.translate(layer.x, layer.y);
                ctx.rotate(layer.rotation);
                const drawW = layer.w * layer.scale;
                const drawH = layer.h * layer.scale;
                ctx.drawImage(layer.img, -drawW / 2, -drawH / 2, drawW, drawH);
                ctx.restore();
            });
        } else {
            // Fallback to blank canvas render
            ctx.filter = baseFilter;
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = img.src || '#ffffff';
            ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
        }

        ctx.restore();
    }

    function updateUIValues() {
        document.getElementById('val-brightness').innerText = filters.brightness + '%';
        document.getElementById('val-contrast').innerText = filters.contrast + '%';
        document.getElementById('val-saturate').innerText = filters.saturate + '%';
        document.getElementById('val-blur').innerText = filters.blur + 'px';
        document.getElementById('val-hue').innerText = filters.hue + 'deg';
    }

    // --- Inputs Handling ---
    function updateFiltersFromInputs() {
        filters.brightness = document.getElementById('brightness').value;
        filters.contrast = document.getElementById('contrast').value;
        filters.saturate = document.getElementById('saturate').value;
        filters.blur = document.getElementById('blur').value;
        filters.hue = document.getElementById('hue-rotate').value;
        render();
    }

    // Bind inputs so slider movements keep filters in sync
    ['brightness', 'contrast', 'saturate', 'blur', 'hue-rotate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateFiltersFromInputs);
    });

    // --- Transforms ---
    function rotate(deg) {
        rotation = (rotation + deg) % 360;
        render();
    }
    
    function flip(dir) {
        if(dir === 'h') flipH *= -1;
        if(dir === 'v') flipV *= -1;
        render();
    }

    // --- Presets ---
    function setPreset(type) {
        resetAdjustments(); // Reset sliders first
        switch(type) {
            case 'grayscale': filters.saturate = 0; break;
            case 'sepia': filters.sepia = 100; /* simplified logic for this demo, usually involves hue */ filters.brightness = 90; filters.contrast = 90; filters.hue = 40; filters.saturate = 50; break; 
            case 'invert': filters.invert = 100; /* native invert not in my list, abusing hue for demo */ filters.hue = 180; filters.contrast = 150; break;
            case 'vintage': filters.sepia = 50; filters.contrast = 120; filters.saturate = 60; filters.brightness = 110; break;
        }
        // Sync sliders
        document.getElementById('saturate').value = filters.saturate;
        document.getElementById('contrast').value = filters.contrast;
        document.getElementById('brightness').value = filters.brightness;
        document.getElementById('hue-rotate').value = filters.hue;
        render();
    }

    function resetAdjustments() {
        filters = { ...defaultFilters };
        document.getElementById('brightness').value = 100;
        document.getElementById('contrast').value = 100;
        document.getElementById('saturate').value = 100;
        document.getElementById('blur').value = 0;
        document.getElementById('hue-rotate').value = 0;
        render();
    }

    function resetAllState() {
        rotation = 0;
        flipH = 1;
        flipV = 1;
        resetAdjustments();
        layers.forEach(layer => { if (!layer.isBackground) { layer.x = 0; layer.y = 0; layer.rotation = 0; } });
    }

    function resetAll() {
        resetAllState();
        render();
    }

    // --- Custom Canvas Logic ---
    function showModal() { document.getElementById('newProjectModal').style.display = 'flex'; }
    function closeModal() { document.getElementById('newProjectModal').style.display = 'none'; }

    function createCustomCanvas() {
        const w = parseInt(document.getElementById('newWidth').value);
        const h = parseInt(document.getElementById('newHeight').value);
        const color = document.getElementById('newColor').value;
        createBlankCanvas(w, h, color);
        closeModal();
    }

    function createBlankCanvas(w, h, color) {
        canvas.width = w;
        canvas.height = h;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tCtx = tempCanvas.getContext('2d');
        tCtx.fillStyle = color;
        tCtx.fillRect(0,0,w,h);
        
        const bgImg = new Image();
        bgImg.onload = () => {
            layers = [{
                id: crypto.randomUUID(),
                name: 'Background',
                img: bgImg,
                w,
                h,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                visible: true,
                isBackground: true,
                isSmart: false,
                effects: cloneLayerEffects()
            }];
            activeLayerId = layers[0].id;
            isImageLoaded = true;
            resetAllState();
            customCanvasActive = true;
            useCanvasFit = true;
            setImageInfoText(`Canvas ${w}x${h} (blank)`);
            updateLayerUI();
            syncLayerEffectsUI();
            render();
        };
        bgImg.src = tempCanvas.toDataURL();
    }

    // --- CROP FUNCTIONALITY ---
    let cropBox = document.getElementById('cropBox');
    let isCropping = false;
    let isDragging = false;
    let currentHandle = null;
    let startX, startY;
    let cropRect = { x: 0, y: 0, w: 0, h: 0 };

    function initCrop() {
        if(!isImageLoaded && !canvas.width) return;
        
        isCropping = true;
        document.getElementById('btnCrop').classList.add('active');
        
        // Initial crop box size (90% of canvas)
        const margin = 20;
        cropBox.style.display = 'block';
        cropBox.style.left = margin + 'px';
        cropBox.style.top = margin + 'px';
        cropBox.style.width = (canvas.width - margin*2) + 'px';
        cropBox.style.height = (canvas.height - margin*2) + 'px';
        updateCropBadge();
    }

    function cancelCrop() {
        isCropping = false;
        cropBox.style.display = 'none';
        document.getElementById('btnCrop').classList.remove('active');
        if (cropSizeBadge) cropSizeBadge.textContent = '';
    }

    // Crop Interactions
    cropBox.addEventListener('mousedown', (e) => {
        if(e.target.classList.contains('crop-handle')) {
            isDragging = true;
            currentHandle = e.target.dataset.handle;
            startX = e.clientX;
            startY = e.clientY;
        } else if (e.target === cropBox) {
            isDragging = true;
            currentHandle = 'move';
            startX = e.clientX;
            startY = e.clientY;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        const style = window.getComputedStyle(cropBox);
        let left = parseInt(style.left);
        let top = parseInt(style.top);
        let width = parseInt(style.width);
        let height = parseInt(style.height);

        if(currentHandle === 'move') {
            cropBox.style.left = (left + dx) + 'px';
            cropBox.style.top = (top + dy) + 'px';
        } else {
            // Simple resizing logic (could be more robust)
            if(currentHandle.includes('r')) width += dx;
            if(currentHandle.includes('l')) { left += dx; width -= dx; }
            if(currentHandle.includes('b')) height += dy;
            if(currentHandle.includes('t')) { top += dy; height -= dy; }
            
            // Apply minimum constraints
            if(width > 50) {
                cropBox.style.width = width + 'px';
                if(currentHandle.includes('l')) cropBox.style.left = left + 'px';
            }
            if(height > 50) {
                cropBox.style.height = height + 'px';
                if(currentHandle.includes('t')) cropBox.style.top = top + 'px';
            }
        }

        startX = e.clientX;
        startY = e.clientY;
        updateCropBadge();
    });

    window.addEventListener('mouseup', () => { isDragging = false; currentHandle = null; });

    // --- Layer Dragging ---
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - canvas.width / 2;
        const y = e.clientY - rect.top - canvas.height / 2;

        // pick topmost layer under pointer
        for (let i = layers.length - 1; i >= 0; i--) {
            const layer = layers[i];
            const drawW = layer.w * layer.scale;
            const drawH = layer.h * layer.scale;
            const left = layer.x - drawW / 2;
            const right = layer.x + drawW / 2;
            const top = layer.y - drawH / 2;
            const bottom = layer.y + drawH / 2;
            if (x >= left && x <= right && y >= top && y <= bottom) {
                setActiveLayer(layer.id);
                layerDrag = { dragging: true, id: layer.id, startX: x, startY: y };
                break;
            }
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!layerDrag.dragging) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - canvas.width / 2;
        const y = e.clientY - rect.top - canvas.height / 2;
        const dx = x - layerDrag.startX;
        const dy = y - layerDrag.startY;
        const layer = layers.find(l => l.id === layerDrag.id);
        if (layer) {
            layer.x += dx;
            layer.y += dy;
            layerDrag.startX = x;
            layerDrag.startY = y;
            render();
        }
    });

    window.addEventListener('mouseup', () => {
        layerDrag.dragging = false;
        layerDrag.id = null;
    });

    function applyCrop() {
        // 1. Create a temporary canvas to flatten the current look
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tCtx = tempCanvas.getContext('2d');

        // Draw the current state (filters + rotation) onto temp
        tCtx.save();
        tCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tCtx.rotate(rotation * Math.PI / 180);
        tCtx.scale(flipH, flipV);
        tCtx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg)`;
        if (layers.length) {
            layers.forEach(layer => {
                if (!layer.visible) return;
                tCtx.save();
                tCtx.translate(layer.x, layer.y);
                tCtx.rotate(layer.rotation);
                const drawW = layer.w * layer.scale;
                const drawH = layer.h * layer.scale;
                tCtx.drawImage(layer.img, -drawW / 2, -drawH / 2, drawW, drawH);
                tCtx.restore();
            });
        }
        tCtx.restore();

        // 2. Calculate crop coordinates relative to the Canvas element
        // Note: cropBox coords are CSS coords (pixels on screen).
        // Since canvas uses object-fit or max-width, displayed size != internal resolution.
        // HOWEVER, in this simplified code, the canvas scales naturally. 
        // We need to assume the DOM element size == internal size for this V2 logic to remain simple 
        // or we use getBoundingClientRect logic.
        
        // For robustness in this implementation, we are assuming 1:1 display to data mapping in the editor view
        // (canvas max-width: 100% handles the shrinking, but `cropBox` is absolute).
        
        const box = cropBox;
        const cx = parseInt(box.style.left);
        const cy = parseInt(box.style.top);
        const cw = parseInt(box.style.width);
        const ch = parseInt(box.style.height);

        // 3. Extract data from the temp canvas
        const croppedData = tCtx.getImageData(cx, cy, cw, ch);

        // 4. Update the source Image object
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = cw;
        finalCanvas.height = ch;
        finalCanvas.getContext('2d').putImageData(croppedData, 0, 0);

        const flattened = new Image();
        flattened.onload = () => {
            // 5. Reset UI
            canvas.width = cw;
            canvas.height = ch;
            layers = [createLayerFromImage(flattened, 'Cropped')];
            activeLayerId = layers[0].id;
            isImageLoaded = true;
            customCanvasActive = false;
            useCanvasFit = false;

            // Important: Reset filters/rotation because we "baked" them into the crop
            resetAllState();
            cancelCrop();
            setImageInfoText(`Cropped to ${cw}x${ch}`);
            updateLayerUI();
            syncLayerEffectsUI();
            render();
        };
        flattened.src = finalCanvas.toDataURL();
    }

    // --- Download ---
    function downloadImage() {
        // We must draw the current state to a fresh canvas to catch filters
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tCtx = tempCanvas.getContext('2d');

        // Replicate render logic
        tCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tCtx.rotate(rotation * Math.PI / 180);
        tCtx.scale(flipH, flipV);
        tCtx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg)`;
        if (layers.length) {
            layers.forEach(layer => {
                if (!layer.visible) return;
                tCtx.save();
                tCtx.translate(layer.x, layer.y);
                tCtx.rotate(layer.rotation);
                const drawW = layer.w * layer.scale;
                const drawH = layer.h * layer.scale;
                tCtx.drawImage(layer.img, -drawW / 2, -drawH / 2, drawW, drawH);
                tCtx.restore();
            });
        }

        const link = document.createElement('a');
        link.download = 'edited-image.jpg';
        link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
        link.click();
    }

    // --- Layer helpers ---
    function moveLayer(direction) {
        const idx = layers.findIndex(l => l.id === activeLayerId);
        if (idx === -1) return;
        const target = idx + direction;
        if (target < 0 || target >= layers.length) return;
        const [layer] = layers.splice(idx, 1);
        layers.splice(target, 0, layer);
        updateLayerUI();
        render();
    }

    function deleteActiveLayer() {
        if (layers.length <= 1) return; // keep at least background
        const idx = layers.findIndex(l => l.id === activeLayerId);
        if (idx === -1) return;
        layers.splice(idx, 1);
        activeLayerId = layers[layers.length - 1].id;
        updateLayerUI();
        render();
    }

    function fitActiveLayer() {
        const layer = layers.find(l => l.id === activeLayerId);
        if (!layer) return;
        const scale = Math.max(canvas.width / layer.w, canvas.height / layer.h) || 1;
        layer.scale = scale;
        layer.x = 0;
        layer.y = 0;
        updateLayerUI();
        render();
    }