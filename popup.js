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
    status: document.getElementById('status')
  };

  let isRunning = false;

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
      elements.status.textContent = "Por favor, abre x.com para usar la extensión.";
      elements.status.style.color = "var(--danger-color)";
      return;
    }

    isRunning = true;
    updateUIState();
    elements.status.textContent = config.dryRun ? "Simulación iniciada..." : "Limpieza iniciada...";
    elements.status.style.color = "var(--text-primary)";

    chrome.tabs.sendMessage(tab.id, { action: "start", config }, (response) => {
      if (chrome.runtime.lastError) {
        elements.status.textContent = "Error: Recarga la página de X e intenta de nuevo.";
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
    elements.status.textContent = "Detenido por el usuario.";
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
