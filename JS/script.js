import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";

const generateBtn = document.getElementById("generateBtn");
const userInput = document.getElementById("userInput");
const langSelect = document.getElementById("lang-select");
const outputDiv = document.getElementById("output");
const loader = document.getElementById("loader");
const btnText = document.getElementById("btn-text");
const placeholderText = document.getElementById("placeholder-text");
const errorMessage = document.getElementById("error-message");
// Chat section removed - using mobile chat instead
const modal = document.getElementById("details-modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");
const historyPanel = document.getElementById("history-panel");
const newChatBtn = document.getElementById("new-chat-btn");
const historyList = document.getElementById("history-list");

// API Settings Elements
const apiSettingsBtn = document.getElementById("api-settings-btn");
const apiModal = document.getElementById("api-modal");
const closeApiModal = document.getElementById("close-api-modal");
const apiKeyInput = document.getElementById("api-key-input");
const toggleApiVisibility = document.getElementById("toggle-api-visibility");
const apiStatus = document.getElementById("api-status");
const saveApiKey = document.getElementById("save-api-key");
const testApiKey = document.getElementById("test-api-key");

// Mobile Elements
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileChatToggle = document.getElementById("mobile-chat-toggle");
const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
const mobileChatOverlay = document.getElementById("mobile-chat-overlay");
const mobileMenu = document.getElementById("mobile-menu");
const mobileChat = document.getElementById("mobile-chat");
const closeMobileMenu = document.getElementById("close-mobile-menu");
const closeMobileChat = document.getElementById("close-mobile-chat");
const mobileNewChat = document.getElementById("mobile-new-chat");
const mobileApiSettings = document.getElementById("mobile-api-settings");
const mobileHistoryList = document.getElementById("mobile-history-list");
const mobileChatMessages = document.getElementById("mobile-chat-messages");
const mobileChatInput = document.getElementById("mobile-chat-input");
const mobileSendBtn = document.getElementById("mobile-send-btn");

let sessions = [];
let activeSessionId = null;
let mermaidContext = "";
let conversationHistory = [];
let detailsMap = new Map();
let panZoomInstance = null;

// API Key Management
const getApiKey = () => {
  return localStorage.getItem("gemini_api_key") || "";
};

const saveApiKeyToStorage = (apiKey) => {
  localStorage.setItem("gemini_api_key", apiKey);
};

const loadApiKeyFromStorage = () => {
  const savedKey = getApiKey();
  if (savedKey) {
    apiKeyInput.value = savedKey;
    updateApiStatus("Saxlanılmış API açarı yükləndi", "success");
  } else {
    updateApiStatus("API açarı tapılmadı", "warning");
  }
};

const updateApiStatus = (message, type = "info") => {
  apiStatus.textContent = message;
  apiStatus.className = `text-xs ${
    type === "success"
      ? "text-green-400"
      : type === "error"
      ? "text-red-400"
      : type === "warning"
      ? "text-yellow-400"
      : "text-[--text-secondary]"
  }`;
};

const testApiConnection = async (apiKey) => {
  if (!apiKey || apiKey.trim() === "") {
    updateApiStatus("API açarı boşdur", "error");
    return false;
  }

  try {
    updateApiStatus("Test edilir...", "info");

    const testPayload = {
      contents: [
        {
          role: "user",
          parts: [{ text: "Salam, test mesajıdır." }],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
      }
    );

    if (response.ok) {
      const result = await response.json();
      if (result.candidates && result.candidates[0]) {
        updateApiStatus("✅ API açarı işləyir!", "success");
        return true;
      } else {
        updateApiStatus("API cavabı gözlənilməz format", "error");
        return false;
      }
    } else {
      const errorText = await response.text();
      if (response.status === 401) {
        updateApiStatus("❌ API açarı etibarsızdır", "error");
      } else if (response.status === 403) {
        updateApiStatus("❌ API açarına icazə yoxdur", "error");
      } else {
        updateApiStatus(`❌ API xətası: ${response.status}`, "error");
      }
      return false;
    }
  } catch (error) {
    console.error("API test error:", error);
    updateApiStatus("❌ Bağlantı xətası", "error");
    return false;
  }
};

// Mobile Functions
const toggleMobileMenu = () => {
  mobileMenuOverlay.classList.toggle("hidden");
  if (!mobileMenuOverlay.classList.contains("hidden")) {
    setTimeout(() => {
      mobileMenu.classList.remove("-translate-x-full");
    }, 10);
    updateMobileHistory();
  } else {
    mobileMenu.classList.add("-translate-x-full");
  }
};

const toggleMobileChat = () => {
  mobileChatOverlay.classList.toggle("hidden");
  if (!mobileChatOverlay.classList.contains("hidden")) {
    setTimeout(() => {
      mobileChat.classList.remove("translate-y-full");
    }, 10);
    syncMobileChatMessages();
  } else {
    mobileChat.classList.add("translate-y-full");
  }
};

const updateMobileHistory = () => {
  mobileHistoryList.innerHTML = "";
  sessions.forEach((session) => {
    const item = document.createElement("div");
    item.className = `p-2 rounded cursor-pointer hover:bg-[--surface-2] transition-colors text-sm ${
      session.id === activeSessionId ? "bg-[--surface-2]" : ""
    }`;
    item.textContent = session.title;
    item.addEventListener("click", async () => {
      await loadSession(session.id);
      toggleMobileMenu();
    });
    mobileHistoryList.appendChild(item);
  });
};

const syncMobileChatMessages = () => {
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  if (!activeSession) return;

  mobileChatMessages.innerHTML = "";

  // Use conversationHistory instead of chatHistory
  if (
    activeSession.conversationHistory &&
    activeSession.conversationHistory.length > 0
  ) {
    activeSession.conversationHistory.forEach((message) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `p-3 rounded-lg mb-2 ${
        message.role === "user"
          ? "bg-[--accent-color] text-[--accent-text] ml-4"
          : "bg-[--surface-2] mr-4"
      }`;

      // Get text content from message parts
      const content =
        message.parts && message.parts[0]
          ? message.parts[0].text
          : message.content || "";

      // Render markdown for AI responses, plain text for user messages
      if (message.role === "model" || message.role === "assistant") {
        try {
          messageDiv.innerHTML = marked.parse(content);
        } catch (error) {
          console.warn("Markdown parsing error:", error);
          messageDiv.textContent = content;
        }
      } else {
        messageDiv.textContent = content;
      }
      mobileChatMessages.appendChild(messageDiv);
    });
  } else {
    // Show placeholder if no messages
    const placeholderDiv = document.createElement("div");
    placeholderDiv.className = "p-4 text-center text-[--text-secondary]";
    placeholderDiv.textContent =
      "Hələ heç bir mesaj yoxdur. Blok-sxem yaradın və suallar verin.";
    mobileChatMessages.appendChild(placeholderDiv);
  }

  mobileChatMessages.scrollTop = mobileChatMessages.scrollHeight;
};

const sendMobileMessage = async () => {
  const message = mobileChatInput.value.trim();
  if (!message) return;

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  if (!activeSession) return;

  // Initialize conversationHistory if it doesn't exist
  if (!activeSession.conversationHistory) {
    activeSession.conversationHistory = [];
  }

  // Add user message in Gemini format
  activeSession.conversationHistory.push({
    role: "user",
    parts: [{ text: message }],
  });
  mobileChatInput.value = "";
  syncMobileChatMessages();

  try {
    // Create chat prompt with context
    const chatPrompt = `Sən, yeni başlayanlar üçün proqramlaşdırma müəllimisən. Vəzifən, aşağıda verilmiş blok-sxem konteksti haqqında istifadəçinin suallarını cavablandırmaqdır. İstifadəçi heç nə bilmir.
                VACİB QAYDALAR:
                1. Cavablarını formatlamaq üçün Markdown istifadə et. Məsələn, siyahılar üçün nömrəli və ya işarəli siyahılar, vacib sözlər üçün **qalın** yazı, kod nümunələri üçün isə \`inline kod\` və ya kod blokları (\`\`\`) istifadə et.
                2. Cavabların ultra-detallı və addım-addım olmalıdır. Ümumi danışma.
                3. Bir kod parçasını izah edərkən, hər bir sətrin, dəyişənin və funksiyanın mənasını açıqla.
                4. YALNIZ verilmiş blok-sxem və onunla əlaqəli proqramlaşdırma mövzuları haqqında danış. Kənar suallara cavab verməkdən imtina et və istifadəçini nəzakətlə mövzuya qaytar.

                Blok-sxem konteksti (istifadəçi görmür, yalnız sən kontekst üçün istifadə edirsən): \`\`\`mermaid\n${mermaidContext}\n\`\`\`.
                Detallar (istifadəçi görmür): ${JSON.stringify(
                  Array.from(detailsMap.entries())
                )}

                İstifadəçi sualı: ${message}`;

    const aiResponse = await callGemini(
      chatPrompt,
      activeSession.conversationHistory.slice(0, -1)
    );

    activeSession.conversationHistory.push({
      role: "model",
      parts: [{ text: aiResponse }],
    });
    syncMobileChatMessages();
    saveSessions();
  } catch (error) {
    console.error("Mobile chat error:", error);
    activeSession.conversationHistory.push({
      role: "model",
      parts: [{ text: "Xəta baş verdi. API açarınızı yoxlayın." }],
    });
    syncMobileChatMessages();
  }
};

// Initialize pan-zoom functionality
const initializePanZoom = () => {
  const svgElement = outputDiv.querySelector("svg");
  if (svgElement && !panZoomInstance) {
    try {
      // Hide placeholder text
      const placeholderText = document.getElementById("placeholder-text");
      if (placeholderText) {
        placeholderText.style.display = "none";
      }

      // Set SVG to fill container properly
      svgElement.style.position = "absolute";
      svgElement.style.top = "0";
      svgElement.style.left = "0";
      svgElement.style.width = "100%";
      svgElement.style.height = "100%";
      svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

      // Get original dimensions before removing attributes
      const originalWidth = svgElement.getAttribute("width");
      const originalHeight = svgElement.getAttribute("height");

      // Only remove attributes if they exist and are valid
      if (originalWidth && originalWidth !== "undefined") {
        svgElement.removeAttribute("width");
      }
      if (originalHeight && originalHeight !== "undefined") {
        svgElement.removeAttribute("height");
      }

      // Container height is now controlled by CSS (60vh, min 400px)
      // No need for dynamic height calculation

      // Check if mobile device
      const isMobile = window.innerWidth <= 768;

      panZoomInstance = svgPanZoom(svgElement, {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.3,
        maxZoom: 5,
        zoomScaleSensitivity: 0.3,
        panEnabled: true,
        dblClickZoomEnabled: !isMobile, // Disable double-click zoom on mobile
        mouseWheelZoomEnabled: !isMobile, // Disable mouse wheel zoom on mobile
        preventMouseEventsDefault: isMobile, // Prevent default on mobile to avoid conflicts
        eventsListenerElement: svgElement,
        beforePan: function () {
          outputDiv.classList.add("panning");
        },
        onPan: function () {
          outputDiv.classList.remove("panning");
        },
        onZoom: function (level) {
          // Prevent invalid zoom levels
          if (isNaN(level) || !isFinite(level) || level <= 0) {
            console.warn("Invalid zoom level detected:", level);
            return false;
          }
        },
      });

      // Set initial zoom to fill the container width/height better
      setTimeout(() => {
        if (panZoomInstance) {
          try {
            panZoomInstance.zoom(1.5); // Default zoom level
            panZoomInstance.center();
          } catch (error) {
            console.warn("Pan-zoom initial setup warning:", error);
            // Fallback: try with smaller zoom
            try {
              panZoomInstance.zoom(1.2);
              panZoomInstance.center();
            } catch (fallbackError) {
              console.warn("Pan-zoom fallback failed:", fallbackError);
            }
          }
        }
      }, 100);

      // Show canvas controls
      document.getElementById("canvas-controls").classList.remove("hidden");

      // Add click event listener for node details with mobile-specific handling
      const handleNodeClick = (e) => {
        // Prevent pan-zoom from interfering with node clicks
        e.stopPropagation();

        const clickedElement = e.target.closest("[data-id]");
        if (clickedElement) {
          const nodeId = clickedElement.getAttribute("data-id");

          // On mobile, add a small delay to ensure it's not part of a pan gesture
          if (isMobile) {
            setTimeout(() => {
              showDetails(nodeId);
            }, 50);
          } else {
            showDetails(nodeId);
          }
        }
      };

      svgElement.addEventListener("click", handleNodeClick);

      // For mobile, also handle touchend to ensure proper node interaction
      if (isMobile) {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };

        svgElement.addEventListener("touchstart", (e) => {
          touchStartTime = Date.now();
          if (e.touches.length === 1) {
            touchStartPos.x = e.touches[0].clientX;
            touchStartPos.y = e.touches[0].clientY;
          }
        });

        svgElement.addEventListener("touchend", (e) => {
          const touchDuration = Date.now() - touchStartTime;
          const touch = e.changedTouches[0];
          const touchEndPos = { x: touch.clientX, y: touch.clientY };
          const distance = Math.sqrt(
            Math.pow(touchEndPos.x - touchStartPos.x, 2) +
              Math.pow(touchEndPos.y - touchStartPos.y, 2)
          );

          // If it's a quick tap (< 300ms) and minimal movement (< 10px), treat as node click
          if (touchDuration < 300 && distance < 10) {
            const clickedElement = e.target.closest("[data-id]");
            if (clickedElement) {
              e.preventDefault();
              e.stopPropagation();
              const nodeId = clickedElement.getAttribute("data-id");
              showDetails(nodeId);
            }
          }
        });
      }
    } catch (error) {
      console.error("Pan-zoom initialization error:", error);
    }
  }
};

const createNewSession = async () => {
  const newSession = {
    id: `session_${Date.now()}`,
    title: "Yeni Söhbət",
    userInput: "",
    lang: "JavaScript",
    mermaidContext: "",
    detailsMap: [],
    conversationHistory: [],
    createdAt: new Date().toISOString(),
  };
  sessions.unshift(newSession);
  activeSessionId = newSession.id;
  saveSessions();
  await loadSession(activeSessionId);
  renderHistory();
};

const generateTitleFromInput = (input) => {
  if (!input || input.trim() === "") return "Yeni Söhbət";

  // Get first few words (up to 5 words or 40 characters)
  const words = input.trim().split(/\s+/);
  let title = words.slice(0, 5).join(" ");

  if (title.length > 40) {
    title = title.substring(0, 37) + "...";
  } else if (words.length > 5) {
    title += "...";
  }

  return title;
};

const deleteSession = async (sessionId) => {
  if (sessions.length <= 1) {
    alert("Son söhbəti silə bilməzsiniz!");
    return;
  }

  if (confirm("Bu söhbəti silmək istədiyinizə əminsiniz?")) {
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex !== -1) {
      sessions.splice(sessionIndex, 1);

      // If deleted session was active, switch to another session
      if (activeSessionId === sessionId) {
        activeSessionId = sessions[0].id;
        await loadSession(activeSessionId);
      }

      saveSessions();
      renderHistory();
    }
  }
};

const editSessionTitle = (sessionId) => {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return;

  const newTitle = prompt("Yeni başlıq daxil edin:", session.title);
  if (newTitle !== null && newTitle.trim() !== "") {
    session.title = newTitle.trim();
    saveSessions();
    renderHistory();
  }
};

const saveSessions = () => {
  localStorage.setItem("chatSessions", JSON.stringify(sessions));
  localStorage.setItem("activeSessionId", activeSessionId);
};

const loadSessions = () => {
  const savedSessions = localStorage.getItem("chatSessions");
  const savedActiveId = localStorage.getItem("activeSessionId");
  if (savedSessions) {
    sessions = JSON.parse(savedSessions);
    activeSessionId =
      savedActiveId || (sessions.length > 0 ? sessions[0].id : null);
  } else {
    createNewSession();
  }
};

const clearUI = () => {
  userInput.value = "";
  langSelect.value = "JavaScript";

  // Safe pan-zoom cleanup with error handling
  if (panZoomInstance) {
    try {
      panZoomInstance.destroy();
    } catch (error) {
      console.warn("Pan-zoom destroy error:", error);
      // Force cleanup even if destroy fails
    } finally {
      panZoomInstance = null;
    }
  }

  outputDiv.innerHTML = `<p id="placeholder-text">Blok-sxeminiz burada göstəriləcək.</p>`;
  errorMessage.classList.add("hidden");
  document.getElementById("canvas-controls").classList.add("hidden");
  mermaidContext = "";
  conversationHistory = [];
  detailsMap.clear();
};

const loadSession = async (sessionId) => {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    console.error(`Session with ID ${sessionId} not found.`);
    createNewSession();
    return;
  }

  activeSessionId = sessionId;
  clearUI();

  userInput.value = session.userInput || "";
  langSelect.value = session.lang || "JavaScript";
  mermaidContext = session.mermaidContext || "";
  detailsMap = new Map(session.detailsMap || []);
  conversationHistory = session.conversationHistory || [];

  if (session.mermaidContext) {
    await restoreState();
  }

  renderHistory();
  updateMobileHistory();
  saveSessions();
};

const renderHistory = () => {
  historyList.innerHTML = "";
  sessions.forEach((session) => {
    const li = document.createElement("li");
    li.className = `group relative p-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm ${
      session.id === activeSessionId ? "bg-gray-700 font-semibold" : ""
    }`;
    li.setAttribute("data-session-id", session.id);

    // Create title container
    const titleContainer = document.createElement("div");
    titleContainer.className = "flex items-center justify-between";

    // Create title span
    const titleSpan = document.createElement("span");
    titleSpan.className = "truncate cursor-pointer flex-grow";
    titleSpan.textContent = session.title;
    titleSpan.addEventListener("click", async () => {
      await loadSession(session.id);
    });

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className =
      "hidden group-hover:flex items-center gap-1 ml-2";

    // Create edit button
    const editBtn = document.createElement("button");
    editBtn.className = "p-1 rounded hover:bg-gray-600 transition-colors";
    editBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          `;
    editBtn.title = "Başlığı düzəlt";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editSessionTitle(session.id);
    });

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "p-1 rounded hover:bg-red-600 transition-colors";
    deleteBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          `;
    deleteBtn.title = "Söhbəti sil";
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteSession(session.id);
    });

    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);

    titleContainer.appendChild(titleSpan);
    titleContainer.appendChild(buttonsContainer);
    li.appendChild(titleContainer);

    historyList.appendChild(li);
  });
};

const updateCurrentSession = (data) => {
  const sessionIndex = sessions.findIndex((s) => s.id === activeSessionId);
  if (sessionIndex !== -1) {
    sessions[sessionIndex] = { ...sessions[sessionIndex], ...data };
    if (data.userInput && sessions[sessionIndex].title === "Yeni Söhbət") {
      sessions[sessionIndex].title = generateTitleFromInput(data.userInput);
    }
    saveSessions();
    renderHistory();
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  loadSessions();
  loadApiKeyFromStorage();
  if (sessions.length === 0) {
    await createNewSession();
  } else {
    await loadSession(activeSessionId);
  }
});

newChatBtn.addEventListener("click", createNewSession);

userInput.addEventListener("input", () => {
  updateCurrentSession({ userInput: userInput.value });
});

langSelect.addEventListener("change", () => {
  updateCurrentSession({ lang: langSelect.value });
});

const restoreState = async () => {
  if (!mermaidContext) return;

  try {
    placeholderText.classList.add("hidden");
    errorMessage.classList.add("hidden");

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      themeVariables: {
        background: "#111111",
        primaryColor: "#222222",
        primaryTextColor: "#ffffff",
        lineColor: "#666666",
        textColor: "#ffffff",
      },
    });

    const { svg, bindFunctions } = await mermaid.render(
      "graphDiv",
      mermaidContext
    );
    outputDiv.innerHTML = svg;
    if (bindFunctions) {
      bindFunctions(outputDiv);
    }

    detailsMap.forEach((value, key) => {
      const nodeElements = outputDiv.querySelectorAll(
        `#${CSS.escape(key)}, .node[id$="-${key}"]`
      );
      nodeElements.forEach((nodeElement) => {
        if (nodeElement) {
          nodeElement.setAttribute("data-id", key);
        }
      });
    });

    // Initialize pan-zoom functionality
    initializePanZoom();

    // Chat functionality moved to mobile chat overlay
  } catch (error) {
    console.error("Error restoring state:", error);
    errorMessage.textContent =
      "Yadda saxlanılmış vəziyyəti bərpa etmək mümkün olmadı.";
    errorMessage.classList.remove("hidden");
  }
};

window.showDetails = (nodeId) => {
  if (detailsMap.has(nodeId)) {
    const detailText = detailsMap.get(nodeId);
    const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
    const title = nodeElement
      ? nodeElement.textContent || "Addımın İzahı"
      : "Addımın İzahı";

    modalTitle.textContent = title;
    modalContent.innerHTML = marked.parse(
      detailText
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
          return `\n\`\`\`${lang || ""}\n${code.trim()}\n\`\`\``;
        })
        .replace(/\n/g, "\n\n")
    );

    modal.classList.remove("hidden");
  } else {
    console.warn(`No details found for node ID: ${nodeId}`);
    modalTitle.textContent = "Məlumat Tapılmadı";
    modalContent.innerHTML = `<p>Bu blok üçün ətraflı məlumat tapılmadı.</p>`;
    modal.classList.remove("hidden");
  }
};

const generateFlowchart = async () => {
  const prompt = userInput.value.trim();
  const selectedLang = langSelect.value;
  if (!prompt) {
    errorMessage.textContent = "Zəhmət olmasa, bir təsvir daxil edin.";
    errorMessage.classList.remove("hidden");
    placeholderText.classList.add("hidden");
    return;
  }

  loader.classList.remove("hidden");
  btnText.textContent = "Generasiya edilir...";
  generateBtn.disabled = true;
  outputDiv.innerHTML = "";
  errorMessage.classList.add("hidden");
  placeholderText.classList.add("hidden");
  // Chat section removed - using mobile chat instead

  const systemPrompt = `
                Sən, yeni başlayanlar üçün proqramlaşdırma müəllimisən. Vəzifən, istifadəçi tələbini analiz edərək, seçilmiş proqramlaşdırma dilində ultra-detallı, interaktiv blok-sxem yaratmaqdır.
                SEÇİLMİŞ PROQRAMLAŞDIRMA DİLİ: ${selectedLang}

                ƏSAS TƏLİMATLAR:
                1.  İKİLİ FORMATDA ÇIXIŞ: Hər bir addım üçün iki hissə yaratmalısan: qısa başliq və detallı izah.
                2.  QISA BAŞLIQ: Blok-sxemin özündə görünəcək çox qısa, bir neçə sözlük mətn.
                3.  DETALLI İZAH: İstifadəçi bloka klikləyəndə popup-da görünəcək ətraflı izah. Bu izah addımın nə üçün lazım olduğunu, texniki detallarını və seçilmiş dildə kod nümunəsini ehtiva etməlidir. Kodu \`\`\`${selectedLang.toLowerCase()}__NL__...__NL__\`\`\` bloku içinə al.
                4.  XÜSUSİ FORMAT (ÇOX VACİB): Hər bir bloku bu formatda yarat: NodeID["Qısa Başlıq"]. Sonra, ayrıca olaraq, komment şəklində detallı izahı əlavə et: %% NodeID:::DETALLI İZAH BURADA. Mütləq ':::' separatordan istifadə et. Yeni sətirlər üçün real yeni sətir (\n) yerinə __NL__ xüsusi mətnindən istifadə et. Kommentlər (%%) MÜTLƏQ öz ayrıca sətrində olmalıdır.
                5.  İNTERAKTİVLİK: Hər node üçün 'click NodeID call showDetails("NodeID")' direktivini əlavə et. Bu, MÜTLƏQ hər bir node üçün edilməlidir.
                6.  MİNİMUM BLOK SAYI: Yaranan qrafik minimum 50 blokdan ibarət olmalıdır.
                7.  SADƏCƏ MERMAID KODU ÇIXAR: Çıxışda əlavə mətn və ya \`\`\`mermaid bloku olmasın. Yalnız 'graph TD;' ilə başlayan saf Mermaid kodu olsun.

                NÜMUNƏ ÇIXIŞ:
                graph TD;
                %% A1:::Bu addım proqramın başlanğıc nöqtəsini bildirir. Heç bir kod tələb olunmur.
                %% B1:::Bu addımda istifadəçidən məlumat almaq üçün lazım olan 'mysql.connector' kitabxanasını idxal edirik.__NL__\`\`\`python__NL__import mysql.connector__NL__\`\`\`
                A1(("Başlanğıc")) --> B1["Kitabxananı İdxal Et"];
                click A1 call showDetails("A1")
                click B1 call showDetails("B1")
            `;

  try {
    let rawMermaidCode = await callGemini(systemPrompt, [
      {
        role: "user",
        parts: [{ text: `İstifadəçi təsviri budur: "${prompt}"` }],
      },
    ]);

    rawMermaidCode = rawMermaidCode
      .replace(/^```mermaid\s*/, "")
      .replace(/```\s*$/, "")
      .trim();

    detailsMap.clear();
    const lines = rawMermaidCode.split("\n");
    let graphTdFound = false;

    const processedLines = lines
      .map((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("graph TD;")) {
          if (!graphTdFound) {
            graphTdFound = true;
            return "graph TD;";
          }
          return null;
        }
        if (trimmedLine.startsWith("%%")) {
          const parts = line.replace("%%", "").split(":::");
          if (parts.length > 1) {
            const id = parts[0].trim();
            const detail = parts
              .slice(1)
              .join(":::")
              .replace(/__NL__/g, "\n");
            detailsMap.set(id, detail);
          }
          return null;
        }
        const commentIndex = line.indexOf("%%");
        return commentIndex > -1
          ? line.substring(0, commentIndex).trim()
          : line;
      })
      .filter((line) => line !== null && line.trim() !== "");

    let cleanMermaidCode = processedLines.join("\n");
    if (!cleanMermaidCode.trim().startsWith("graph TD;")) {
      cleanMermaidCode = "graph TD;\n" + cleanMermaidCode;
    }

    mermaidContext = cleanMermaidCode;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      themeVariables: {
        background: "#111111",
        primaryColor: "#222222",
        primaryTextColor: "#ffffff",
        lineColor: "#666666",
        textColor: "#ffffff",
      },
    });

    const { svg, bindFunctions } = await mermaid.render(
      "graphDiv",
      mermaidContext
    );
    outputDiv.innerHTML = svg;
    if (bindFunctions) {
      bindFunctions(outputDiv);
    }

    detailsMap.forEach((value, key) => {
      const nodeElements = outputDiv.querySelectorAll(
        `#${CSS.escape(key)}, .node[id$="-${key}"]`
      );
      nodeElements.forEach((nodeElement) => {
        if (nodeElement) {
          nodeElement.setAttribute("data-id", key);
        }
      });
    });

    // Initialize pan-zoom functionality
    initializePanZoom();

    conversationHistory = [];
    // Chat functionality moved to mobile chat overlay

    // Save state to current session
    updateCurrentSession({
      mermaidContext: mermaidContext,
      detailsMap: Array.from(detailsMap.entries()),
      conversationHistory: conversationHistory,
      userInput: prompt,
    });
  } catch (error) {
    console.error("Flowchart Error:", error);
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
    placeholderText.classList.remove("hidden");
  } finally {
    loader.classList.add("hidden");
    btnText.textContent = "Generasiya et";
    generateBtn.disabled = false;
  }
};

// Chat functionality moved to mobile chat overlay

const callGemini = async (systemText, history = []) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "API açarı tapılmadı. Zəhmət olmasa API Tənzimləmələrindən API açarınızı əlavə edin."
    );
  }

  let contents = [...history, { role: "user", parts: [{ text: systemText }] }];
  const payload = { contents };
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `API Xətası: ${response.status} ${response.statusText}.`;
    if (response.status === 401) {
      errorMessage =
        "API Xətası: 401 (İcazə Yoxdur). Bu, proqramın Gemini API ilə əlaqə qurmaq üçün icazəsi olmadığını göstərir. Təqdim edilən API açarı etibarsız və ya səhv ola bilər.";
    }
    if (errorBody) {
      errorMessage += ` Server cavabı: ${errorBody}`;
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  if (
    result.candidates &&
    result.candidates[0].content &&
    result.candidates[0].content.parts
  ) {
    return result.candidates[0].content.parts[0].text;
  } else {
    let errorText = "API cavabında gözlənilməz format və ya məzmun bloklanıb.";
    if (result.promptFeedback && result.promptFeedback.blockReason) {
      errorText = `Sorğu bloklandı. Səbəb: ${result.promptFeedback.blockReason}`;
    }
    throw new Error(errorText);
  }
};

// Chat functionality moved to mobile chat overlay

// Event Listeners
generateBtn.addEventListener("click", generateFlowchart);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    generateFlowchart();
  }
});
// Chat event listeners removed - using mobile chat instead
modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Canvas control event listeners
document.getElementById("zoom-in").addEventListener("click", () => {
  if (panZoomInstance) {
    try {
      panZoomInstance.zoomIn();
    } catch (error) {
      console.warn("Zoom in error:", error);
    }
  }
});

document.getElementById("zoom-out").addEventListener("click", () => {
  if (panZoomInstance) {
    try {
      panZoomInstance.zoomOut();
    } catch (error) {
      console.warn("Zoom out error:", error);
    }
  }
});

document.getElementById("reset-pan").addEventListener("click", () => {
  if (panZoomInstance) {
    try {
      panZoomInstance.resetZoom();
      panZoomInstance.center();
      panZoomInstance.fit();
    } catch (error) {
      console.warn("Reset pan error:", error);
      // Try to reinitialize if reset fails
      try {
        panZoomInstance.destroy();
        panZoomInstance = null;
        initializePanZoom();
      } catch (reinitError) {
        console.warn("Reinitialize error:", reinitError);
      }
    }
  }
});

// API Settings Event Listeners
apiSettingsBtn.addEventListener("click", () => {
  apiModal.classList.remove("hidden");
  loadApiKeyFromStorage();
});

closeApiModal.addEventListener("click", () => {
  apiModal.classList.add("hidden");
});

apiModal.addEventListener("click", (e) => {
  if (e.target === apiModal) {
    apiModal.classList.add("hidden");
  }
});

toggleApiVisibility.addEventListener("click", () => {
  if (apiKeyInput.type === "password") {
    apiKeyInput.type = "text";
    toggleApiVisibility.textContent = "Gizlət";
  } else {
    apiKeyInput.type = "password";
    toggleApiVisibility.textContent = "Göstər";
  }
});

saveApiKey.addEventListener("click", () => {
  const apiKey = apiKeyInput.value.trim();
  if (apiKey) {
    saveApiKeyToStorage(apiKey);
    updateApiStatus("✅ API açarı saxlanıldı", "success");
    setTimeout(() => {
      apiModal.classList.add("hidden");
    }, 1000);
  } else {
    updateApiStatus("❌ API açarı boşdur", "error");
  }
});

testApiKey.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  await testApiConnection(apiKey);
});

// Enter key support for API key input
apiKeyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    saveApiKey.click();
  }
});

// Mobile Event Listeners
mobileMenuToggle.addEventListener("click", toggleMobileMenu);
mobileChatToggle.addEventListener("click", toggleMobileChat);
closeMobileMenu.addEventListener("click", toggleMobileMenu);
closeMobileChat.addEventListener("click", toggleMobileChat);

// Close mobile overlays when clicking outside
mobileMenuOverlay.addEventListener("click", (e) => {
  if (e.target === mobileMenuOverlay) {
    toggleMobileMenu();
  }
});

mobileChatOverlay.addEventListener("click", (e) => {
  if (e.target === mobileChatOverlay) {
    toggleMobileChat();
  }
});

// Mobile menu actions
mobileNewChat.addEventListener("click", () => {
  createNewSession();
  toggleMobileMenu();
});

mobileApiSettings.addEventListener("click", () => {
  apiModal.classList.remove("hidden");
  loadApiKeyFromStorage();
  toggleMobileMenu();
});

// Mobile chat functionality
mobileSendBtn.addEventListener("click", sendMobileMessage);

mobileChatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMobileMessage();
  }
});

// Touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
  if (!e.changedTouches[0]) return;

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Swipe right to open menu (only on mobile)
  if (window.innerWidth < 768 && deltaX > 100 && Math.abs(deltaY) < 100) {
    if (mobileMenuOverlay.classList.contains("hidden")) {
      toggleMobileMenu();
    }
  }

  // Swipe left to close menu
  if (window.innerWidth < 768 && deltaX < -100 && Math.abs(deltaY) < 100) {
    if (!mobileMenuOverlay.classList.contains("hidden")) {
      toggleMobileMenu();
    }
  }

  // Swipe up to open chat
  if (window.innerWidth < 768 && deltaY < -100 && Math.abs(deltaX) < 100) {
    if (mobileChatOverlay.classList.contains("hidden")) {
      toggleMobileChat();
    }
  }

  // Swipe down to close chat
  if (window.innerWidth < 768 && deltaY > 100 && Math.abs(deltaX) < 100) {
    if (!mobileChatOverlay.classList.contains("hidden")) {
      toggleMobileChat();
    }
  }
});
