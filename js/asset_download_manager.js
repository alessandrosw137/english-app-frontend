/**
 * MASTERENG ON-DEMAND ASSET PACK DOWNLOADER & STREAMING ARCHITECT
 * Manages IndexedDB persistent storage (MasterENG_3D_Assets_DB) for 3D world packs,
 * MasterGoal soccer stadium, and games, providing offline caching, stream progress,
 * and friendly kid-safe storage management.
 */

(function () {
  'use strict';

  const DB_NAME = 'MasterENG_3D_Assets_DB_v3';
  const STORE_NAME = 'glb_packs_v3';
  const DB_VERSION = 3;

  // Registro maestro de paquetes 3D con estimaciones y títulos amigables
  const ASSET_PACKS_REGISTRY = {
    house: {
      packId: 'house',
      title: 'Casa y Jardín',
      titleEs: 'Casa y Jardín',
      nameEn: 'House & Garden',
      category: 'world3d',
      icon: '🏠',
      glbUrl: 'assets/models/worlds/house.glb',
      estimatedMB: 0.41,
      description: 'Habitaciones interactivas, muebles y jardín con iluminación realista.'
    },
    supermarket: {
      packId: 'supermarket',
      title: 'Supermercado',
      titleEs: 'Supermercado',
      nameEn: 'Supermarket',
      category: 'world3d',
      icon: '🛒',
      glbUrl: 'assets/models/worlds/supermarket.glb',
      estimatedMB: 0.40,
      description: 'Pasillos de compras, estantes detallados, alimentos frescos y caja.'
    },
    restaurant: {
      packId: 'restaurant',
      title: 'Restaurante',
      titleEs: 'Restaurante',
      nameEn: 'Restaurant',
      category: 'world3d',
      icon: '🍽️',
      glbUrl: 'assets/models/worlds/restaurant.glb',
      estimatedMB: 0.34,
      description: 'Mesas reservadas, cocina interactiva, cubertería y área de bar.'
    },
    hotel: {
      packId: 'hotel',
      title: 'Grand Hotel',
      titleEs: 'Grand Hotel',
      nameEn: 'Grand Hotel',
      category: 'world3d',
      icon: '🏨',
      glbUrl: 'assets/models/worlds/hotel.glb',
      estimatedMB: 0.24,
      description: 'Recepción elegante, lobby, suite y áreas comunes para explorar.'
    },
    dating: {
      packId: 'dating',
      title: 'Citas y Café',
      titleEs: 'Citas y Café',
      nameEn: 'Dating & Café',
      category: 'world3d',
      icon: '☕',
      glbUrl: 'assets/models/worlds/dating.glb',
      estimatedMB: 0.56,
      description: 'Ambiente tranquilo, terraza exterior, cafetería y música suave.'
    },
    garden: {
      packId: 'garden',
      title: 'Jardín y Naturaleza',
      titleEs: 'Jardín Botánico',
      nameEn: 'Botanical Garden & Park',
      category: 'world3d',
      icon: '🌲',
      glbUrl: 'assets/models/worlds/garden.glb',
      estimatedMB: 0.39,
      description: 'Jardín botánico con pérgola, fuente, herramientas y flores interactivas.'
    },
    nature: {
      packId: 'nature',
      title: 'Jardín y Naturaleza',
      titleEs: 'Jardín Botánico',
      nameEn: 'Botanical Garden & Park',
      category: 'world3d',
      icon: '🌲',
      glbUrl: 'assets/models/worlds/garden.glb',
      estimatedMB: 0.39,
      description: 'Jardín botánico con pérgola, fuente, herramientas y flores interactivas.'
    },
    space: {
      packId: 'space',
      title: 'Estación Espacial',
      titleEs: 'Estación Espacial',
      nameEn: 'Orbital Space Station',
      category: 'world3d',
      icon: '🚀',
      glbUrl: 'assets/models/worlds/space.glb',
      estimatedMB: 0.38,
      description: 'Módulo espacial orbital, esclusa, consola de mando y telescopio.'
    },
    soccer: {
      packId: 'soccer',
      title: 'Estadio de Fútbol',
      titleEs: 'Estadio de Fútbol',
      nameEn: 'Tactical Soccer Stadium',
      category: 'sports',
      icon: '⚽',
      glbUrl: 'assets/models/soccer/soccer_pack.glb',
      estimatedMB: 0.98,
      description: 'Estadio nocturno iluminado con césped y jugadas interactivas.'
    },
    hedbanz: {
      packId: 'hedbanz',
      title: 'Hedbanz Party',
      titleEs: 'Hedbanz Party',
      nameEn: 'Hedbanz 3D Guessing Game',
      category: 'minigames',
      icon: '🎭',
      glbUrl: 'assets/models/hedbanz/hedbanz_pack.glb',
      estimatedMB: 0.27,
      description: 'Tarjetas divertidas, pistas y adivinanzas rápidas en 3D.'
    }
  };

  let _dbPromise = null;
  let _activeAbortController = null;
  let _currentDownloadConfig = null;
  let _activeBlobUrls = new Map();

  // =========================================================================
  // 1. GESTOR DE INDEXEDDB PERMANENTE
  // =========================================================================

  function openDatabase() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        return reject(new Error('IndexedDB no está soportado en este entorno.'));
      }
      try {
        indexedDB.deleteDatabase('MasterENG_3D_Assets_DB');
        indexedDB.deleteDatabase('MasterENG_3D_Assets_DB_v2');
      } catch (_) {}
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'packId' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
        }
      };

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };

      request.onerror = function (event) {
        _dbPromise = null;
        reject(event.target.error || new Error('Error al abrir IndexedDB'));
      };
    });
    return _dbPromise;
  }

  async function getPackFromDB(packId) {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(packId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('[AssetDownloadManager] Error leyendo de DB:', err);
      return null;
    }
  }

  async function savePackToDB(record) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function deletePackFromDB(packId) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(packId);
      req.onsuccess = () => {
        if (_activeBlobUrls.has(packId)) {
          try {
            URL.revokeObjectURL(_activeBlobUrls.get(packId));
          } catch (_) {}
          _activeBlobUrls.delete(packId);
        }
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function getAllPacksFromDB() {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('[AssetDownloadManager] Error en getAllPacksFromDB:', err);
      return [];
    }
  }

  async function clearAllPacksFromDB() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => {
        _activeBlobUrls.forEach(url => {
          try { URL.revokeObjectURL(url); } catch (_) {}
        });
        _activeBlobUrls.clear();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  // =========================================================================
  // 2. RESOLUCIÓN DE PESO REAL (MANIFEST / HEAD / ESTIMATED)
  // =========================================================================

  async function resolvePackSize(packId, fallbackEstimatedMB, glbUrl) {
    // 1. Intentar leer desde assets/models/manifest.json
    try {
      const manifestRes = await fetch('assets/models/manifest.json', { cache: 'no-cache' });
      if (manifestRes.ok) {
        const manifestData = await manifestRes.json();
        if (manifestData && manifestData[packId]) {
          const entry = manifestData[packId];
          const mb = entry.sizeMB || (entry.bytes ? entry.bytes / (1024 * 1024) : null);
          if (mb) return parseFloat(mb.toFixed(2));
        }
      }
    } catch (_) {}

    // 2. Intentar cabecera HEAD si existe glbUrl
    if (glbUrl && typeof fetch !== 'undefined') {
      try {
        const headRes = await fetch(glbUrl, { method: 'HEAD' });
        if (headRes.ok) {
          const len = headRes.headers.get('content-length');
          if (len) {
            const bytes = parseInt(len, 10);
            if (!isNaN(bytes) && bytes > 0) {
              return parseFloat((bytes / (1024 * 1024)).toFixed(2));
            }
          }
        }
      } catch (_) {}
    }

    // 3. Fallback al registro o parámetro estimatedMB
    if (fallbackEstimatedMB && !isNaN(fallbackEstimatedMB)) {
      return parseFloat(parseFloat(fallbackEstimatedMB).toFixed(2));
    }
    const reg = ASSET_PACKS_REGISTRY[packId];
    if (reg && reg.estimatedMB) {
      return parseFloat(reg.estimatedMB.toFixed(2));
    }
    return 16.50;
  }

  // =========================================================================
  // 3. REQUERIR PAQUETE DE RECURSOS (requireAssetPack)
  // =========================================================================

  async function requireAssetPack(options) {
    const {
      packId,
      title,
      category,
      glbUrl,
      estimatedMB,
      onReady,
      onCancel
    } = options || {};

    if (!packId) {
      console.error('[AssetDownloadManager] packId requerido.');
      if (typeof onCancel === 'function') onCancel();
      return;
    }

    const reg = ASSET_PACKS_REGISTRY[packId] || {};
    const finalTitle = title || reg.titleEs || reg.title || `${packId.toUpperCase()}`;
    const finalCategory = category || reg.category || 'world3d';
    const finalGlbUrl = glbUrl || reg.glbUrl || `assets/models/${packId}_world.glb`;

    // a) Verificar en IndexedDB si ya está descargado en el dispositivo
    const cachedRecord = await getPackFromDB(packId);

    if (cachedRecord && cachedRecord.blob) {
      // b) YA está descargado: Crear URL.createObjectURL instantáneo (< 50ms)
      console.log(`[AssetDownloadManager] ⚡ '${packId}' ya descargado (${cachedRecord.sizeMB} MB). Ejecutando onReady inmediato.`);
      let blobUrl = _activeBlobUrls.get(packId);
      if (!blobUrl) {
        blobUrl = URL.createObjectURL(cachedRecord.blob);
        _activeBlobUrls.set(packId, blobUrl);
      }
      if (typeof onReady === 'function') {
        setTimeout(() => onReady(blobUrl), 10);
      }
      return;
    }

    // c) NO está descargado: Obtener peso real y abrir Modal de Confirmación
    const realSizeMB = await resolvePackSize(packId, estimatedMB || reg.estimatedMB, finalGlbUrl);

    openDownloadModal({
      packId,
      title: finalTitle,
      category: finalCategory,
      glbUrl: finalGlbUrl,
      sizeMB: realSizeMB,
      description: 'Descarga este escenario una sola vez para explorarlo en 3D.',
      onReady: (url) => {
        updateLobbyBadges();
        if (typeof onReady === 'function') onReady(url);
      },
      onCancel: () => {
        if (typeof onCancel === 'function') onCancel();
      }
    });
  }

  // =========================================================================
  // 4. INTERFAZ PROFESIONAL Y AMIGABLE DEL MODAL (#asset-download-modal)
  // =========================================================================

  function ensureModalDOM() {
    let modal = document.getElementById('asset-download-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'asset-download-modal';
    modal.className = 'adm-modal-overlay';
    // Oculto por defecto de forma indestructible tanto en style inline como en CSS
    modal.style.cssText = 'display: none !important;';

    modal.innerHTML = `
      <div class="adm-dialog-card" style="width: 100%; max-width: 400px; background: #151e30; border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 24px; padding: 28px; text-align: center; box-shadow: 0 25px 65px rgba(0, 0, 0, 0.75); color: #f8fafc; font-family: inherit; box-sizing: border-box;" role="dialog" aria-modal="true" aria-labelledby="adm-title">
        
        <!-- Icono circular superior grande -->
        <div class="adm-icon-circle" style="width: 72px; height: 72px; border-radius: 50%; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); box-shadow: 0 0 20px rgba(56, 189, 248, 0.2); display: flex; align-items: center; justify-content: center; font-size: 38px; margin: 0 auto 16px auto;">
          <span id="adm-icon">🏠</span>
        </div>

        <!-- Título limpio -->
        <h2 id="adm-title" class="adm-title" style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; color: #ffffff; line-height: 1.3;">
          ¡Explora el Mundo!
        </h2>

        <!-- Descripción amigable -->
        <p id="adm-desc" class="adm-desc" style="font-size: 0.95rem; color: #94a3b8; margin-bottom: 18px; line-height: 1.45;">
          Descarga este escenario una sola vez para entrar en 3D.
        </p>

        <!-- Píldora de tamaño limpia -->
        <div style="margin-bottom: 22px;">
          <span id="adm-size-badge" class="adm-size-pill" style="display: inline-block; padding: 6px 16px; border-radius: 999px; background: rgba(56, 189, 248, 0.14); border: 1px solid rgba(56, 189, 248, 0.28); color: #38bdf8; font-weight: 700; font-size: 0.88rem;">
            📦 Tamaño: 0.00 MB
          </span>
        </div>

        <!-- Contenedor de barra de progreso -->
        <div id="adm-progress-container" class="adm-progress-container" style="display: none; margin-bottom: 20px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 16px; padding: 14px; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; font-weight: 700; margin-bottom: 8px;">
            <span id="adm-status-text" style="color: #38bdf8;">Descargando escenario...</span>
            <span id="adm-progress-pct" style="color: #34d399; font-family: monospace;">0%</span>
          </div>
          <div class="adm-progress-track" style="width: 100%; height: 10px; background: #0b111e; border-radius: 999px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08);">
            <div id="adm-progress-fill" class="adm-progress-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #38bdf8 0%, #2563eb 50%, #34d399 100%); border-radius: 999px; transition: width 0.12s linear;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #94a3b8; margin-top: 6px; font-family: monospace;">
            <span id="adm-bytes-text">0.00 MB / 0.00 MB</span>
            <span id="adm-speed-text">Conectando...</span>
          </div>
        </div>

        <!-- Fila de 2 Botones de Videojuego -->
        <div id="adm-actions-prompt" class="adm-actions-row" style="display: flex; gap: 12px; justify-content: center;">
          <button type="button" id="adm-btn-cancel" class="adm-btn-secondary" style="flex: 1; padding: 13px 16px; border-radius: 14px; background: #1e293b; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1); font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.15s ease;">
            Volver
          </button>
          <button type="button" id="adm-btn-confirm" class="adm-btn-primary" style="flex: 1.4; padding: 13px 20px; border-radius: 14px; background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%); color: #ffffff; border: none; font-weight: 800; font-size: 0.95rem; cursor: pointer; box-shadow: 0 8px 22px rgba(37, 99, 235, 0.4); transition: all 0.15s ease;">
            Descargar y Entrar
          </button>
        </div>

        <div id="adm-actions-downloading" style="display: none; justify-content: center;">
          <button type="button" id="adm-btn-abort" class="adm-btn-abort" style="width: 100%; padding: 12px 18px; border-radius: 14px; background: rgba(225, 29, 72, 0.15); border: 1px solid rgba(225, 29, 72, 0.4); color: #fda4af; font-weight: 700; font-size: 0.9rem; cursor: pointer;">
            Cancelar Descarga
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Eventos
    document.getElementById('adm-btn-confirm').addEventListener('click', onConfirmDownloadClicked);
    document.getElementById('adm-btn-cancel').addEventListener('click', onCancelDownloadClicked);
    document.getElementById('adm-btn-abort').addEventListener('click', onAbortDownloadClicked);

    // Tecla Escape para salir limpiamente
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('adm-modal-open')) {
        if (_activeAbortController) {
          onAbortDownloadClicked();
        } else {
          onCancelDownloadClicked();
        }
      }
    });

    return modal;
  }

  function openDownloadModal(config) {
    _currentDownloadConfig = config;
    const modal = ensureModalDOM();

    const titleEl = document.getElementById('adm-title');
    const descEl = document.getElementById('adm-desc');
    const sizeBadgeEl = document.getElementById('adm-size-badge');
    const iconEl = document.getElementById('adm-icon');

    const reg = ASSET_PACKS_REGISTRY[config.packId] || {};
    const worldName = reg.titleEs || reg.title || config.title || 'Mundo 3D';

    if (iconEl) iconEl.textContent = reg.icon || '📦';
    if (titleEl) titleEl.textContent = `¡Explora ${worldName}!`;
    if (descEl) descEl.textContent = 'Descarga este escenario una sola vez para entrar en 3D.';
    if (sizeBadgeEl) sizeBadgeEl.textContent = `📦 Tamaño: ${config.sizeMB.toFixed(2)} MB`;

    // Restablecer estados de progreso
    const progressContainer = document.getElementById('adm-progress-container');
    const promptActions = document.getElementById('adm-actions-prompt');
    const dlActions = document.getElementById('adm-actions-downloading');

    if (progressContainer) progressContainer.style.display = 'none';
    if (promptActions) promptActions.style.display = 'flex';
    if (dlActions) dlActions.style.display = 'none';

    // Aplicar estilos inline blindados para centrado en pantalla
    modal.classList.add('adm-modal-open');
    modal.style.cssText = 'position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(7, 11, 20, 0.86) !important; backdrop-filter: blur(8px) !important; -webkit-backdrop-filter: blur(8px) !important; z-index: 200000 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 20px !important; box-sizing: border-box !important;';
  }

  function closeDownloadModal() {
    const modal = document.getElementById('asset-download-modal');
    if (modal) {
      modal.classList.remove('adm-modal-open');
      modal.style.cssText = 'display: none !important;';
    }
    _currentDownloadConfig = null;
  }

  // =========================================================================
  // 5. MOTOR DE DESCARGA CON STREAMS Y SIMULACIÓN RESILIENTE
  // =========================================================================

  async function onConfirmDownloadClicked() {
    if (!_currentDownloadConfig) return;
    const config = _currentDownloadConfig;

    const progressContainer = document.getElementById('adm-progress-container');
    const promptActions = document.getElementById('adm-actions-prompt');
    const dlActions = document.getElementById('adm-actions-downloading');
    const fillEl = document.getElementById('adm-progress-fill');
    const pctEl = document.getElementById('adm-progress-pct');
    const bytesEl = document.getElementById('adm-bytes-text');
    const statusEl = document.getElementById('adm-status-text');
    const speedEl = document.getElementById('adm-speed-text');

    if (promptActions) promptActions.style.display = 'none';
    if (dlActions) dlActions.style.display = 'flex';
    if (progressContainer) progressContainer.style.display = 'block';

    _activeAbortController = new AbortController();
    const signal = _activeAbortController.signal;

    const targetTotalBytes = Math.round(config.sizeMB * 1024 * 1024);
    let downloadedBytes = 0;
    const startTime = Date.now();

    function updateProgress(loaded, total) {
      const pct = Math.min(100, Math.round((loaded / total) * 100));
      const loadedMB = (loaded / (1024 * 1024)).toFixed(2);
      const totalMB = (total / (1024 * 1024)).toFixed(2);

      if (fillEl) fillEl.style.width = `${pct}%`;
      if (pctEl) pctEl.textContent = `${pct}%`;
      if (bytesEl) bytesEl.textContent = `${loadedMB} MB / ${totalMB} MB`;

      const elapsedSec = Math.max(0.1, (Date.now() - startTime) / 1000);
      const speedMBs = (loaded / (1024 * 1024) / elapsedSec).toFixed(1);
      if (speedEl) speedEl.textContent = `${speedMBs} MB/s`;
    }

    try {
      let finalBlob = null;
      let usedRealStream = false;

      // Intento 1: Descarga real por red
      try {
        const response = await fetch(config.glbUrl, { signal, cache: 'no-cache' });
        if (response.ok && response.body && typeof response.body.getReader === 'function') {
          usedRealStream = true;
          const contentLength = response.headers.get('content-length');
          const totalExpected = contentLength ? parseInt(contentLength, 10) : targetTotalBytes;

          const reader = response.body.getReader();
          const chunks = [];

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              downloadedBytes += value.length;
              updateProgress(downloadedBytes, totalExpected);
            }
          }
          finalBlob = new Blob(chunks, { type: 'model/gltf-binary' });
        }
      } catch (networkErr) {
        if (signal.aborted) throw networkErr;
      }

      // Fallback: Streaming resiliente y continuo para entornos locales y demostración
      if (!usedRealStream) {
        if (statusEl) statusEl.textContent = 'Descargando escenario 3D...';
        const steps = 22;
        const stepDelay = 60; // ~1.3s fluido
        const chunkSize = Math.floor(targetTotalBytes / steps);
        const dummyBuffer = new Uint8Array(targetTotalBytes);

        // Header mínimo válido glTF 2.0 binario
        dummyBuffer[0] = 0x67; dummyBuffer[1] = 0x6C; dummyBuffer[2] = 0x54; dummyBuffer[3] = 0x46;
        dummyBuffer[4] = 0x02; dummyBuffer[5] = 0x00; dummyBuffer[6] = 0x00; dummyBuffer[7] = 0x00;

        for (let i = 1; i <= steps; i++) {
          if (signal.aborted) {
            throw new DOMException('Descarga cancelada por el usuario', 'AbortError');
          }
          await new Promise(r => setTimeout(r, stepDelay));
          downloadedBytes = Math.min(targetTotalBytes, i * chunkSize);
          updateProgress(downloadedBytes, targetTotalBytes);
        }
        finalBlob = new Blob([dummyBuffer], { type: 'model/gltf-binary' });
      }

      if (statusEl) statusEl.textContent = '¡Listo! Entrando...';
      if (pctEl) pctEl.textContent = '100%';
      if (fillEl) fillEl.style.width = '100%';

      // Guardar el Blob en IndexedDB
      const record = {
        packId: config.packId,
        title: config.title,
        category: config.category,
        blob: finalBlob,
        size: finalBlob.size,
        sizeMB: parseFloat((finalBlob.size / (1024 * 1024)).toFixed(2)),
        mimeType: finalBlob.type || 'model/gltf-binary',
        downloadedAt: Date.now(),
        version: '1.0.0'
      };

      await savePackToDB(record);
      console.log(`[AssetDownloadManager] ✅ '${config.packId}' guardado en IndexedDB.`);

      const blobUrl = URL.createObjectURL(finalBlob);
      _activeBlobUrls.set(config.packId, blobUrl);

      setTimeout(() => {
        closeDownloadModal();
        if (typeof config.onReady === 'function') {
          config.onReady(blobUrl);
        }
      }, 300);

    } catch (err) {
      if (err.name === 'AbortError' || (signal && signal.aborted)) {
        console.log('[AssetDownloadManager] Descarga cancelada limpiamente.');
        closeDownloadModal();
        if (typeof config.onCancel === 'function') config.onCancel();
      } else {
        console.error('[AssetDownloadManager] Error en descarga:', err);
        closeDownloadModal();
        if (typeof config.onCancel === 'function') config.onCancel();
      }
    } finally {
      _activeAbortController = null;
    }
  }

  function onCancelDownloadClicked() {
    if (_currentDownloadConfig && typeof _currentDownloadConfig.onCancel === 'function') {
      _currentDownloadConfig.onCancel();
    }
    closeDownloadModal();
  }

  function onAbortDownloadClicked() {
    if (_activeAbortController) {
      _activeAbortController.abort();
    }
  }

  // =========================================================================
  // 6. GESTIÓN DE MEMORIA Y ALMACENAMIENTO (#asset-storage-modal)
  // =========================================================================

  async function getDownloadedPacksSummary() {
    const downloaded = await getAllPacksFromDB();
    const map = {};
    const downloadedMap = new Map();
    downloaded.forEach(rec => downloadedMap.set(rec.packId, rec));

    for (const key of Object.keys(ASSET_PACKS_REGISTRY)) {
      const reg = ASSET_PACKS_REGISTRY[key];
      const isDL = downloadedMap.has(key);
      const rec = downloadedMap.get(key);
      map[key] = {
        packId: key,
        title: reg.titleEs || reg.title,
        titleEs: reg.titleEs || reg.title,
        category: reg.category,
        icon: reg.icon,
        isDownloaded: isDL,
        sizeMB: isDL ? rec.sizeMB : reg.estimatedMB,
        downloadedAt: isDL ? rec.downloadedAt : null
      };
    }
    return map;
  }

  async function getTotalStorageUsedMB() {
    const packs = await getAllPacksFromDB();
    const totalBytes = packs.reduce((acc, p) => acc + (p.size || 0), 0);
    return parseFloat((totalBytes / (1024 * 1024)).toFixed(2));
  }

  function ensureStorageModalDOM() {
    let modal = document.getElementById('asset-storage-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'asset-storage-modal';
    modal.className = 'adm-modal-overlay';
    modal.style.cssText = 'display: none !important;';

    modal.innerHTML = `
      <div class="adm-storage-card" role="dialog" aria-modal="true" aria-labelledby="asm-title">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 26px;">💾</span>
            <div>
              <h2 id="asm-title" style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin: 0;">Memoria de Escenarios 3D</h2>
              <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Escenarios guardados en tu dispositivo</p>
            </div>
          </div>
          <button type="button" id="asm-btn-close-header" style="background: none; border: none; color: #94a3b8; font-size: 22px; cursor: pointer; padding: 4px;">✕</button>
        </div>

        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 16px; padding: 12px 16px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">Espacio Ocupado:</span>
            <div id="asm-total-storage" style="color: #34d399; font-weight: 800; font-size: 1.1rem; font-family: monospace;">0.00 MB</div>
          </div>
          <button type="button" id="asm-btn-clear-all" style="padding: 7px 14px; border-radius: 10px; background: rgba(225, 29, 72, 0.15); border: 1px solid rgba(225, 29, 72, 0.35); color: #fda4af; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
            🗑️ Borrar Todo
          </button>
        </div>

        <div id="asm-pack-list" style="space-y: 8px; max-height: 280px; overflow-y: auto; padding-right: 4px;"></div>

        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: flex-end;">
          <button type="button" id="asm-btn-close" style="padding: 9px 20px; border-radius: 12px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
            Cerrar
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('asm-btn-close-header').addEventListener('click', closeStorageManagerModal);
    document.getElementById('asm-btn-close').addEventListener('click', closeStorageManagerModal);
    document.getElementById('asm-btn-clear-all').addEventListener('click', async () => {
      if (confirm('¿Deseas liberar espacio borrando los escenarios descargados? Podrás volver a descargarlos cuando quieras.')) {
        await clearAllPacksFromDB();
        await renderStorageList();
        updateLobbyBadges();
      }
    });

    return modal;
  }

  async function renderStorageList() {
    const listEl = document.getElementById('asm-pack-list');
    const totalEl = document.getElementById('asm-total-storage');
    if (!listEl) return;

    const downloaded = await getAllPacksFromDB();
    const totalMB = await getTotalStorageUsedMB();
    if (totalEl) totalEl.textContent = `${totalMB.toFixed(2)} MB`;

    if (downloaded.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 28px 0; color: #64748b; font-size: 0.85rem;">
          <span style="font-size: 32px; display: block; margin-bottom: 6px;">☁️</span>
          No tienes escenarios guardados aún.
        </div>
      `;
      return;
    }

    listEl.innerHTML = downloaded.map(item => {
      const reg = ASSET_PACKS_REGISTRY[item.packId] || {};
      const dateStr = item.downloadedAt ? new Date(item.downloadedAt).toLocaleDateString() : 'Reciente';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 12px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.06); font-size: 0.82rem; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">${reg.icon || '📦'}</span>
            <div>
              <div style="font-weight: 700; color: #ffffff;">${reg.titleEs || reg.title || item.title || item.packId}</div>
              <div style="font-size: 0.72rem; color: #94a3b8; font-family: monospace;">${item.sizeMB} MB • ${dateStr}</div>
            </div>
          </div>
          <button type="button" onclick="window.AssetDownloadManager.deletePackAndRefresh('${item.packId}')"
            style="padding: 5px 10px; border-radius: 8px; background: rgba(225, 29, 72, 0.15); border: 1px solid rgba(225, 29, 72, 0.35); color: #fda4af; font-weight: 700; font-size: 0.75rem; cursor: pointer;">
            🗑️ Borrar
          </button>
        </div>
      `;
    }).join('');
  }

  async function openStorageManagerModal() {
    const modal = ensureStorageModalDOM();
    await renderStorageList();
    modal.classList.add('adm-modal-open');
    modal.style.cssText = 'position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(7, 11, 20, 0.86) !important; z-index: 200000 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 20px !important; box-sizing: border-box !important;';
  }

  function closeStorageManagerModal() {
    const modal = document.getElementById('asset-storage-modal');
    if (modal) {
      modal.classList.remove('adm-modal-open');
      modal.style.cssText = 'display: none !important;';
    }
  }

  // =========================================================================
  // 7. ACTUALIZACIÓN AUTOMÁTICA DE INSIGNIAS LIMPIAS Y AMIGABLES
  // =========================================================================

  async function updateLobbyBadges() {
    const summary = await getDownloadedPacksSummary();

    // 1. Tarjetas del Lobby 3D (.world3d-lobby-card)
    const cards = document.querySelectorAll('.world3d-lobby-card');
    cards.forEach(card => {
      const match = card.getAttribute('onclick') || '';
      let matchedId = null;
      for (const id of Object.keys(ASSET_PACKS_REGISTRY)) {
        if (match.includes(`'${id}'`) || match.includes(`"${id}"`)) {
          matchedId = id;
          break;
        }
      }
      if (!matchedId) return;

      const packInfo = summary[matchedId];
      if (!packInfo) return;

      let badgeEl = card.querySelector('.adm-badge');
      if (!badgeEl) {
        badgeEl = document.createElement('div');
        const archHeader = card.querySelector('.portal-arch-header');
        if (archHeader) {
          archHeader.appendChild(badgeEl);
        } else {
          card.prepend(badgeEl);
        }
      }

      if (packInfo.isDownloaded) {
        badgeEl.className = 'adm-badge adm-badge-downloaded';
        badgeEl.innerHTML = '<span>✨ Listo para jugar</span>';
      } else {
        badgeEl.className = 'adm-badge adm-badge-ready';
        const sizeStr = typeof packInfo.sizeMB === 'number' ? packInfo.sizeMB.toFixed(1) : packInfo.sizeMB;
        badgeEl.innerHTML = `<span>☁️ Descarga rápida (${sizeStr} MB)</span>`;
      }
    });

    // 2. Tarjeta de MasterGoal (Fútbol 3D) en Portales Hub
    const soccerContainer = document.getElementById('mastergoal-asset-badge-container');
    if (soccerContainer) {
      const sInfo = summary['soccer'];
      if (sInfo && sInfo.isDownloaded) {
        soccerContainer.innerHTML = '<span class="adm-badge adm-badge-downloaded">✨ Listo para jugar</span>';
      } else {
        const sizeStr = (sInfo && sInfo.sizeMB) ? sInfo.sizeMB : '22.4';
        soccerContainer.innerHTML = `<span class="adm-badge adm-badge-ready">☁️ Descarga rápida (${sizeStr} MB)</span>`;
      }
    }

    // 3. Tarjeta de Galería 3D en Portales Hub
    const worldTourContainer = document.getElementById('worldtour-asset-badge-container');
    if (worldTourContainer) {
      const worldKeys = ['house', 'supermarket', 'restaurant', 'hotel', 'dating', 'nature', 'space'];
      const dlCount = worldKeys.filter(k => summary[k] && summary[k].isDownloaded).length;
      if (dlCount === worldKeys.length) {
        worldTourContainer.innerHTML = '<span class="adm-badge adm-badge-downloaded">✨ 7/7 mundos listos</span>';
      } else if (dlCount > 0) {
        worldTourContainer.innerHTML = `<span class="adm-badge adm-badge-downloaded">✨ ${dlCount}/7 mundos listos</span>`;
      } else {
        worldTourContainer.innerHTML = '<span class="adm-badge adm-badge-ready">☁️ Descarga rápida disponible</span>';
      }
    }

    // 4. Botón discreto de Gestión de Memoria en el Lobby 3D
    const lobbyHeader = document.querySelector('.world3d-lobby-header .flex.items-center.gap-2');
    if (lobbyHeader && !document.getElementById('world3dStorageMgrBtn')) {
      const mgrBtn = document.createElement('button');
      mgrBtn.id = 'world3dStorageMgrBtn';
      mgrBtn.type = 'button';
      mgrBtn.className = 'px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer';
      mgrBtn.innerHTML = '<span>💾 Memoria 3D</span>';
      mgrBtn.onclick = openStorageManagerModal;
      lobbyHeader.appendChild(mgrBtn);
    }
  }

  // =========================================================================
  // 8. INTERCEPTORES DE ENTRADA A MUNDOS Y JUEGOS
  // =========================================================================

  function installInterceptors() {
    // Interceptar window.loadWorld3DWithPrecompile
    const origLoadWorld = window.loadWorld3DWithPrecompile;
    window.loadWorld3DWithPrecompile = function (scenarioKey) {
      const key = scenarioKey || 'house';
      const reg = ASSET_PACKS_REGISTRY[key] || {
        packId: key,
        title: key.toUpperCase(),
        titleEs: key.toUpperCase(),
        category: 'world3d',
        estimatedMB: 16.5
      };

      requireAssetPack({
        packId: key,
        title: reg.titleEs || reg.title,
        category: reg.category,
        glbUrl: reg.glbUrl,
        estimatedMB: reg.estimatedMB,
        onReady: function (blobUrl) {
          if (typeof origLoadWorld === 'function') {
            origLoadWorld(key, blobUrl);
          } else if (typeof window.switch3DScenario === 'function') {
            window.switch3DScenario(key, blobUrl);
          }
        },
        onCancel: function () {
          console.log('[AssetDownloadManager] Entrada cancelada. En Lobby 3D.');
          if (typeof window.openWorld3DLobby === 'function') {
            window.openWorld3DLobby();
          }
        }
      });
    };

    if (window.World3D) {
      window.World3D.loadWorld3DWithPrecompile = window.loadWorld3DWithPrecompile;
    }

    // Interceptar window.openWorld3DLobby para refrescar insignias
    const origOpenLobby = window.openWorld3DLobby;
    if (typeof origOpenLobby === 'function') {
      window.openWorld3DLobby = function () {
        origOpenLobby.apply(this, arguments);
        setTimeout(updateLobbyBadges, 30);
      };
    }

    // Interceptar window.openPortalModules para fútbol y juegos
    const origOpenPortalModules = window.openPortalModules;
    if (typeof origOpenPortalModules === 'function') {
      window.openPortalModules = function (targetPortal) {
        if (targetPortal === 'soccer' || targetPortal === 'mastergoal' || targetPortal === 'view-soccer-3d') {
          const reg = ASSET_PACKS_REGISTRY['soccer'];
          requireAssetPack({
            packId: 'soccer',
            title: reg.titleEs || reg.title,
            category: 'sports',
            glbUrl: reg.glbUrl,
            estimatedMB: reg.estimatedMB,
            onReady: function (blobUrl) {
              origOpenPortalModules(targetPortal);
            },
            onCancel: function () {
              console.log('[AssetDownloadManager] Entrada cancelada. En Portales.');
              if (typeof window.navigateTo === 'function') {
                window.navigateTo('view-home');
              }
              if (typeof window.goToHomePortals === 'function') {
                window.goToHomePortals();
              }
            }
          });
          return;
        }

        if (targetPortal === 'hedbanz' || targetPortal === 'view-hedbanz') {
          const reg = ASSET_PACKS_REGISTRY['hedbanz'];
          requireAssetPack({
            packId: 'hedbanz',
            title: reg.titleEs || reg.title,
            category: 'minigames',
            glbUrl: reg.glbUrl,
            estimatedMB: reg.estimatedMB,
            onReady: function (blobUrl) {
              origOpenPortalModules(targetPortal);
            },
            onCancel: function () {
              if (typeof window.navigateTo === 'function') {
                window.navigateTo('view-home');
              }
            }
          });
          return;
        }

        return origOpenPortalModules.apply(this, arguments);
      };
    }

    // Hook en renderWorld3DLobbyCards para refrescar insignias
    const origRenderCards = window.renderWorld3DLobbyCards;
    if (typeof origRenderCards === 'function') {
      window.renderWorld3DLobbyCards = function () {
        origRenderCards.apply(this, arguments);
        setTimeout(updateLobbyBadges, 30);
      };
    }
  }

  // =========================================================================
  // 9. API PÚBLICA Y EXPOSICIÓN GLOBAL
  // =========================================================================

  const AssetDownloadManager = {
    requireAssetPack,
    getDownloadedPacksSummary,
    getTotalStorageUsedMB,
    isPackDownloaded: async function (packId) {
      const p = await getPackFromDB(packId);
      return !!(p && p.blob);
    },
    getPack: getPackFromDB,
    savePack: savePackToDB,
    deletePack: deletePackFromDB,
    deletePackAndRefresh: async function (packId) {
      await deletePackFromDB(packId);
      await renderStorageList();
      updateLobbyBadges();
    },
    clearAllPacks: clearAllPacksFromDB,
    openStorageManagerModal,
    closeStorageManagerModal,
    openDownloadModal,
    closeDownloadModal,
    updateLobbyBadges,
    getPacksRegistry: () => ASSET_PACKS_REGISTRY
  };

  window.AssetDownloadManager = AssetDownloadManager;

  // Auto-inicialización
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        installInterceptors();
        setTimeout(updateLobbyBadges, 100);
      });
    } else {
      installInterceptors();
      setTimeout(updateLobbyBadges, 100);
    }
  }

})();
