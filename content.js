// Guard against injecting the widget twice
if (window.__sanfoundryWidget) {
  chrome.runtime.sendMessage({ action: "getCount" }, (res) => {
    const el = document.getElementById("__sf-count");
    if (el) el.textContent = `${res?.count || 0} question(s) collected`;
  });
} else {
  window.__sanfoundryWidget = true;

  // ─── Widget HTML ──────────────────────────────────────────────────────────
  const widget = document.createElement("div");
  widget.id = "__sf-widget";
  widget.innerHTML = `
    <div id="__sf-header">
      <span id="__sf-title">📚 MCQ Scraper</span>
      <button id="__sf-minimize" title="Minimize">─</button>
    </div>
    <div id="__sf-body">
      <div id="__sf-count">0 question(s) collected</div>

      <div id="__sf-toggle-row">
        <span id="__sf-toggle-label">Manual</span>
        <div id="__sf-toggle" title="Toggle Auto / Manual">
          <div id="__sf-toggle-knob"></div>
        </div>
        <span id="__sf-toggle-label-right">Auto</span>
      </div>

      <button id="__sf-process">▶ Process This Page</button>
      <button id="__sf-undo" disabled>↩ Undo Last Page</button>
      <button id="__sf-download" disabled>⬇ Bulk Download</button>
      <div id="__sf-status"></div>
    </div>
  `;

  // ─── Styles ───────────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #__sf-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 224px;
      background: #1e1e2e;
      color: #cdd6f4;
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      font-family: 'Segoe UI', sans-serif;
      font-size: 13px;
      z-index: 2147483647;
      overflow: hidden;
    }
    #__sf-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #313244;
      padding: 9px 13px;
      cursor: move;
      user-select: none;
      border-radius: 14px 14px 0 0;
    }
    #__sf-title { font-weight: 700; font-size: 13px; }
    #__sf-minimize {
      background: none;
      border: none;
      color: #cdd6f4;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 0 2px;
    }
    #__sf-body {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    #__sf-widget.minimized #__sf-body { display: none; }
    #__sf-widget.minimized { border-radius: 14px; }

    /* ── Counter ── */
    #__sf-count {
      font-size: 12px;
      color: #a6e3a1;
      font-weight: 600;
      text-align: center;
    }

    /* ── Toggle row ── */
    #__sf-toggle-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    #__sf-toggle-label, #__sf-toggle-label-right {
      font-size: 11px;
      color: #6c7086;
      font-weight: 600;
      transition: color 0.3s;
      min-width: 38px;
    }
    #__sf-toggle-label       { text-align: right; }
    #__sf-toggle-label-right { text-align: left;  }

    /* active side glows */
    #__sf-widget.auto-mode  #__sf-toggle-label-right { color: #89dceb; }
    #__sf-widget.manual-mode #__sf-toggle-label      { color: #89b4fa; }

    #__sf-toggle {
      position: relative;
      width: 46px;
      height: 24px;
      background: #313244;
      border-radius: 999px;
      cursor: pointer;
      border: 2px solid #45475a;
      transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
      flex-shrink: 0;
    }
    #__sf-widget.auto-mode #__sf-toggle {
      background: #1e3a5f;
      border-color: #89dceb;
      box-shadow: 0 0 10px 2px rgba(137,220,235,0.35);
    }
    #__sf-widget.manual-mode #__sf-toggle {
      background: #1a2a4a;
      border-color: #89b4fa;
      box-shadow: 0 0 8px 1px rgba(137,180,250,0.25);
    }
    #__sf-toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #6c7086;
      transition: transform 0.3s cubic-bezier(.4,0,.2,1), background 0.3s;
    }
    #__sf-widget.auto-mode #__sf-toggle-knob {
      transform: translateX(22px);
      background: #89dceb;
    }
    #__sf-widget.manual-mode #__sf-toggle-knob {
      transform: translateX(0);
      background: #89b4fa;
    }

    /* ── Buttons ── */
    #__sf-widget button {
      width: 100%;
      padding: 8px;
      border: none;
      border-radius: 7px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
    }
    #__sf-widget button:active  { transform: scale(0.97); }
    #__sf-widget button:disabled { opacity: 0.35; cursor: not-allowed; }
    #__sf-process  { background: #89b4fa; color: #1e1e2e; }
    #__sf-undo     { background: #f38ba8; color: #1e1e2e; }
    #__sf-download { background: #a6e3a1; color: #1e1e2e; }

    /* hide manual button in auto mode */
    #__sf-widget.auto-mode #__sf-process { display: none; }

    /* ── Status ── */
    #__sf-status {
      font-size: 11px;
      color: #a6adc8;
      text-align: center;
      min-height: 14px;
      line-height: 1.4;
    }

    /* ── Auto-mode pulsing header accent ── */
    #__sf-widget.auto-mode #__sf-header {
      background: linear-gradient(90deg, #313244 60%, #1a3a4a);
      animation: __sf-pulse 2.5s ease-in-out infinite;
    }
    @keyframes __sf-pulse {
      0%,100% { box-shadow: inset 0 -1px 0 rgba(137,220,235,0.15); }
      50%      { box-shadow: inset 0 -1px 0 rgba(137,220,235,0.5);  }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(widget);

  // ─── Refs ─────────────────────────────────────────────────────────────────
  const processBtn   = document.getElementById("__sf-process");
  const undoBtn      = document.getElementById("__sf-undo");
  const downloadBtn  = document.getElementById("__sf-download");
  const countEl      = document.getElementById("__sf-count");
  const statusEl     = document.getElementById("__sf-status");
  const minimizeBtn  = document.getElementById("__sf-minimize");
  const toggleEl     = document.getElementById("__sf-toggle");

  // ─── State ────────────────────────────────────────────────────────────────
  let autoMode = false;  // starts OFF — user opts in

  function setMode(on) {
    autoMode = on;
    if (on) {
      widget.classList.add("auto-mode");
      widget.classList.remove("manual-mode");
      statusEl.textContent = "⚡ Auto mode on — processing…";
      setTimeout(() => runProcess(true), 800);
    } else {
      widget.classList.remove("auto-mode");
      widget.classList.add("manual-mode");
      statusEl.textContent = "🖐 Manual mode — click to process.";
    }
  }

  toggleEl.addEventListener("click", () => setMode(!autoMode));

  // ─── Count refresh ────────────────────────────────────────────────────────
  function refreshCount(cb) {
    chrome.runtime.sendMessage({ action: "getCount" }, (res) => {
      const n = res?.count   || 0;
      const b = res?.batches || 0;
      countEl.textContent   = `${n} question(s) collected`;
      downloadBtn.disabled  = n === 0;
      undoBtn.disabled      = b === 0;
      if (cb) cb(n);
    });
  }

  // ─── Scraper ──────────────────────────────────────────────────────────────
  function scrapePage() {
    const dataArray = [];
    let answerIndex = 0;

    const cleanID = (id) => id.replace(/\s+/g, "").replace(/\./g, "");
    const splitContent = (content) => {
      const a = content.split("\n");
      return { id: cleanID(a[0].slice(0, 2)), question: a[0].substr(3), options: a.slice(1, -1) };
    };

    const entry = document.getElementsByClassName("entry-content")[0];
    if (!entry) return null;

    const pTags = entry.getElementsByTagName("p");
    for (let i = 0; i < pTags.length; i++) {
      const c = pTags[i].textContent.trim();
      if (c && /^\d+\./.test(c)) dataArray.push(splitContent(c));
    }

    const dTags = entry.getElementsByClassName("collapseomatic_content");
    for (let i = 0; i < dTags.length; i++) {
      const c = dTags[i].textContent.trim();
      if (!c) continue;
      const q = dataArray[answerIndex];
      if (q) {
        const p = c.split("\n");
        q.answer      = p[0] ? p[0].substring(8)  : "";
        q.explanation = p[1] ? p[1].substring(13) : "";
        answerIndex++;
      }
    }
    return dataArray;
  }

  // ─── Run process (shared) ─────────────────────────────────────────────────
  function runProcess(auto = false) {
    processBtn.disabled = true;
    statusEl.textContent = auto ? "⚡ Auto-processing…" : "Scraping…";

    const data = scrapePage();

    if (!data || data.length === 0) {
      statusEl.textContent = "ℹ No MCQs found on this page.";
      processBtn.disabled = false;
      return;
    }

    chrome.runtime.sendMessage({ action: "appendData", data }, () => {
      refreshCount(() => {
        statusEl.textContent = `✔ ${auto ? "Auto-added" : "Added"} ${data.length} question(s).`;
        processBtn.disabled = false;
      });
    });
  }

  // ─── Buttons ──────────────────────────────────────────────────────────────
  processBtn.addEventListener("click", () => runProcess(false));

  undoBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "undoLast" }, (res) => {
      if (res?.success) {
        refreshCount();
        statusEl.textContent = `↩ Removed last ${res.removed} question(s).`;
      } else {
        statusEl.textContent = "⚠ Nothing to undo.";
      }
    });
  });

  downloadBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "bulkDownload" }, (res) => {
      if (res?.success) {
        countEl.textContent  = "0 question(s) collected";
        downloadBtn.disabled = true;
        undoBtn.disabled     = true;
        statusEl.textContent = "✔ Downloaded & cleared!";
      } else {
        statusEl.textContent = "⚠ Nothing to download yet.";
      }
    });
  });

  // ─── Minimize ─────────────────────────────────────────────────────────────
  minimizeBtn.addEventListener("click", () => {
    widget.classList.toggle("minimized");
    minimizeBtn.textContent = widget.classList.contains("minimized") ? "+" : "─";
  });

  // ─── Draggable ────────────────────────────────────────────────────────────
  const header = document.getElementById("__sf-header");
  let isDragging = false, startX, startY, origRight, origBottom;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX; startY = e.clientY;
    const r = widget.getBoundingClientRect();
    origRight  = window.innerWidth  - r.right;
    origBottom = window.innerHeight - r.bottom;
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    widget.style.right  = `${origRight  + (startX - e.clientX)}px`;
    widget.style.bottom = `${origBottom + (startY - e.clientY)}px`;
  });
  document.addEventListener("mouseup", () => { isDragging = false; });

  // ─── Init ─────────────────────────────────────────────────────────────────
  widget.classList.add("manual-mode");
  refreshCount();
  statusEl.textContent = "🖐 Manual mode — click to process.";
}
