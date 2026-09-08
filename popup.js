// --- Translations ---
const translations = {
  en: {
    title: "Post Cleaner",
    modeCondition: "Delete by condition",
    modeAll: "Delete all",
    dryRun: "Dry Run (Highlight only, don't delete)",
    selectType: "Select type to delete",
    replies: "Replies",
    likes: "Likes",
    likesTooltip: "Unliking is partially supported. Requires you to be on the 'Likes' tab.",
    keywords: "Keywords",
    keywordsPlaceholder: "Enter keywords separated by commas",
    limit: "Limit to delete (Leave empty for unlimited)",
    limitPlaceholder: "E.g.: 100",
    dateFrom: "From",
    dateTo: "To",
    startBtn: "Start Cleaning",
    stopBtn: "Stop",
    // Status messages
    errorNotOnX: "Please open x.com to use the extension.",
    errorReload: "Error: Reload the X page and try again.",
    dryRunStarted: "Dry run started...",
    cleaningStarted: "Cleaning started...",
    stoppedByUser: "Stopped by user."
  },
  es: {
    title: "Limpiador de Posts",
    modeCondition: "Eliminar por condición",
    modeAll: "Eliminar todo",
    dryRun: "Simulación (Solo resaltar, no borrar)",
    selectType: "Selecciona el tipo a eliminar",
    replies: "Respuestas",
    likes: "Me gusta",
    likesTooltip: "Quitar likes es parcialmente soportado. Requiere estar en la pestaña 'Me gusta'.",
    keywords: "Palabras clave",
    keywordsPlaceholder: "Introduce palabras clave separadas por comas",
    limit: "Límite a eliminar (Dejar vacío para ilimitado)",
    limitPlaceholder: "Ej: 100",
    dateFrom: "Desde",
    dateTo: "Hasta",
    startBtn: "Iniciar Limpieza",
    stopBtn: "Detener",
    // Status messages
    errorNotOnX: "Por favor, abre x.com para usar la extensión.",
    errorReload: "Error: Recarga la página de X e intenta de nuevo.",
    dryRunStarted: "Simulación iniciada...",
    cleaningStarted: "Limpieza iniciada...",
    stoppedByUser: "Detenido por el usuario."
  }
};

let currentLang = 'en';

function t(key) {
  return translations[currentLang][key] || translations['en'][key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  // Update titles (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });

  // Update language toggle button to show the OTHER language
  document.getElementById('langLabel').textContent = lang === 'en' ? 'ES' : 'EN';

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Save preference
  chrome.storage.local.set({ xCleanerLang: lang });
}

// --- Main Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    deleteAllToggle: document.getElementById('deleteAllToggle'),
    modeLabelCondition: document.getElementById('modeLabel'),
    modeLabelAll: document.querySelectorAll('.mode-label')[1],
    dryRunToggle: document.getElementById('dryRunToggle'),
    typePosts: document.getElementById('typePosts'),
    typeReposts: document.getElementById('typeReposts'),
    typeReplies: document.getElementById('typeReplies'),
    typeLikes: document.getElementById('typeLikes'),
    keywords: document.getElementById('keywords'),
    limit: document.getElementById('limit'),
    dateFrom: document.getElementById('dateFrom'),
    dateTo: document.getElementById('dateTo'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    status: document.getElementById('status'),
    langToggle: document.getElementById('langToggle')
  };

  let isRunning = false;

  // --- Language Toggle ---
  elements.langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    applyLanguage(newLang);
  });

  // Detect browser language and load saved preference
  chrome.storage.local.get(['xCleanerLang'], (result) => {
    if (result.xCleanerLang) {
      applyLanguage(result.xCleanerLang);
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
      applyLanguage(browserLang);
    }
  });

  // Toggle Mode UI
  elements.deleteAllToggle.addEventListener('change', (e) => {
    const isAll = e.target.checked;
    elements.modeLabelCondition.classList.toggle('active', !isAll);
    elements.modeLabelAll.classList.toggle('active', isAll);
    
    // Disable condition inputs if "Delete All" is checked
    const disabled = isAll;
    elements.typePosts.disabled = disabled;
    elements.typeReposts.disabled = disabled;
    elements.typeReplies.disabled = disabled;
    elements.typeLikes.disabled = disabled;
    elements.keywords.disabled = disabled;
    elements.dateFrom.disabled = disabled;
    elements.dateTo.disabled = disabled;
    // We intentionally do NOT disable the limit field, so users can limit "Delete All" as well.
  });

  // Load saved state
  chrome.storage.local.get(['xCleanerConfig'], (result) => {
    if (result.xCleanerConfig) {
      const config = result.xCleanerConfig;
      elements.deleteAllToggle.checked = config.deleteAll || false;
      elements.dryRunToggle.checked = config.dryRun !== false; // Default true
      elements.typePosts.checked = config.typePosts !== false;
      elements.typeReposts.checked = config.typeReposts || false;
      elements.typeReplies.checked = config.typeReplies || false;
      elements.typeLikes.checked = config.typeLikes || false;
      elements.keywords.value = config.keywords || '';
      elements.limit.value = config.limit || '';
      elements.dateFrom.value = config.dateFrom || '';
      elements.dateTo.value = config.dateTo || '';
      
      // trigger change to update UI
      elements.deleteAllToggle.dispatchEvent(new Event('change'));
    }
  });

  const saveConfig = () => {
    const config = {
      deleteAll: elements.deleteAllToggle.checked,
      dryRun: elements.dryRunToggle.checked,
      typePosts: elements.typePosts.checked,
      typeReposts: elements.typeReposts.checked,
      typeReplies: elements.typeReplies.checked,
      typeLikes: elements.typeLikes.checked,
      keywords: elements.keywords.value,
      limit: parseInt(elements.limit.value) || 0,
      dateFrom: elements.dateFrom.value,
      dateTo: elements.dateTo.value
    };
    chrome.storage.local.set({ xCleanerConfig: config });
    return config;
  };

  elements.startBtn.addEventListener('click', async () => {
    const config = saveConfig();
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes("x.com") && !tab.url.includes("twitter.com")) {
      elements.status.textContent = t('errorNotOnX');
      elements.status.style.color = "var(--danger-color)";
      return;
    }

    isRunning = true;
    updateUIState();
    elements.status.textContent = config.dryRun ? t('dryRunStarted') : t('cleaningStarted');
    elements.status.style.color = "var(--text-primary)";

    chrome.tabs.sendMessage(tab.id, { action: "start", config }, (response) => {
      if (chrome.runtime.lastError) {
        elements.status.textContent = t('errorReload');
        isRunning = false;
        updateUIState();
      }
    });
  });

  elements.stopBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "stop" });
    
    isRunning = false;
    updateUIState();
    elements.status.textContent = t('stoppedByUser');
  });

  // Listen for status updates from content script
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "statusUpdate") {
      elements.status.textContent = request.message;
      if (request.finished) {
        isRunning = false;
        updateUIState();
      }
    }
  });

  function updateUIState() {
    elements.startBtn.disabled = isRunning;
    elements.stopBtn.disabled = !isRunning;
    elements.deleteAllToggle.disabled = isRunning;
    elements.dryRunToggle.disabled = isRunning;
    elements.limit.disabled = isRunning;
    if(!elements.deleteAllToggle.checked) {
       elements.keywords.disabled = isRunning;
       elements.dateFrom.disabled = isRunning;
       elements.dateTo.disabled = isRunning;
       // checkboxes...
       elements.typePosts.disabled = isRunning;
       elements.typeReposts.disabled = isRunning;
       elements.typeReplies.disabled = isRunning;
       elements.typeLikes.disabled = isRunning;
    }
  }
});
