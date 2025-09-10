document.getElementById("export").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: openChatEditor
    });
  });
});

function openChatEditor() {
  const chatContainer = document.querySelector("main");
  if (!chatContainer) {
    alert("Could not find the chat container.");
    return;
  }

  const clonedChat = chatContainer.cloneNode(true);
  clonedChat.querySelectorAll("button, svg, textarea, input, nav, header, footer").forEach(el => el.remove());

  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up blocked. Please allow pop-ups.");
    return;
  }

  win.document.write(`
    <html>
      <head>
        <title>Reader Mode</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Roboto+Slab:wght@400;600&family=Merriweather:wght@400;700&family=Source+Serif+Pro:wght@400;600&display=swap');

          :root {
            --bg: #ffffff;
            --fg: #111827;
            --card: #ffffff;
            --border: #e5e7eb;
            --muted: #6b7280;
          }
          body.paper {
            --bg: #fdfcf7;
            --fg: #1a1a1a;
            --card: #fefdf9;
            --border: #e0ddd5;
            --muted: #7a7a72;
          }
          body.dark {
            --bg: #111827;
            --fg: #f3f4f6;
            --card: #1f2937;
            --border: #374151;
            --muted: #9ca3af;
          }
          body.darkgrey {
            --bg: #1e1e1e;
            --fg: #e5e5e5;
            --card: #2a2a2a;
            --border: #3d3d3d;
            --muted: #9a9a9a;
          }

          html, body {
            margin: 0;
            padding: 0;
            max-width: 100%;
            overflow-x: hidden;
            font-family: Inter, sans-serif;
            background: var(--bg);
            color: var(--fg);
            line-height: 1.7;
          }

          /* Toolbar */
          .toolbar {
            display: flex;
            font-family: Inter, sans-serif !important;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            border-bottom: 1px solid var(--border);
            background: var(--card);
            position: sticky;
            top: 0;
            z-index: 10;
            font-weight: 400;
          }
          .toolbar-group {
            display: flex;
            gap: 12px;
            align-items: center;
            font-size: 14px;
            font-family: Inter, sans-serif !important;
            color: var(--muted);
          }
          .toolbar label {
            margin-right: 4px;
            font-size: 14px;
            color: var(--muted);
            font-family: Inter, sans-serif !important;
          }
          .toolbar select {
            font-family: Inter, sans-serif !important;
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid var(--border);
            background: var(--bg);
            color: var(--fg);
            font-size: 14px;
            cursor: pointer;
          }
          .toolbar button {
            font-family: Inter, sans-serif !important;
            padding: 6px 14px;
            border-radius: 6px;
            border: none;
            background: #111;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            font-weight: 400;
          }
          .toolbar button:hover {
            background: #000;
          }

          /* Centered card */
          .chat-wrapper {
            max-width: 760px;
            margin: 16px auto;
            padding: 20px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            box-sizing: border-box;
            overflow-x: auto; /* handles wide code blocks */
          }

          h1 { font-size: 2rem; font-weight: 700; margin: 24px 0 12px; }
          h2 { font-size: 1.5rem; font-weight: 600; margin: 20px 0 10px; }
          h3 { font-size: 1.25rem; font-weight: 600; margin: 16px 0 8px; }
          p { margin: 12px 0; }
          strong { font-weight: 700; }
          em { font-style: italic; }

          blockquote {
            padding: 12px 16px;
            margin: 16px 0;
            border-left: 4px solid var(--border);
            background: var(--card);
            font-style: italic;
            border-radius: 6px;
          }

          hr {
            border: none;
            border-top: 1px solid var(--border);
            margin: 24px 0;
            opacity: 0.4;
          }

          pre {
            margin: 16px 0;
            padding: 16px;
            border-radius: 6px;
            border: 1px solid var(--border);
            background: var(--card);
            overflow-x: auto;
          }
          code, pre code {
            font-family: 'Fira Code', monospace;
            font-size: 13px;
            color: var(--fg);
            white-space: pre-wrap;
            word-break: break-word;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            font-size: 14px;
          }
          th, td {
            border: 1px solid var(--border);
            padding: 10px 12px;
            text-align: left;
          }
          th {
            background: var(--card);
            font-weight: 600;
          }
          tr:nth-child(even) {
            background: color-mix(in srgb, var(--card) 70%, var(--bg));
          }

          /* Responsive */
          @media (max-width: 768px) {
            .toolbar {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            .chat-wrapper {
              margin: 8px;
              padding: 16px;
              width: auto;
            }
          }

          /* Print */
          @media print {
            body {
              background: #fff !important;
              color: #000 !important;
              
            }
            .toolbar { display: none !important; }
            .chat-wrapper {
              max-width: none !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
            h1,h2,h3,p,strong,em,code,pre,blockquote,table,th,td {
              color: #000 !important;
            }
            pre, code {
              background: #fff !important;
              border: 1px solid #000 !important;
            }
            table, th, td {
              border: 1px solid #000 !important;
            }
            blockquote {
              border-left: 4px solid #000 !important;
              background: #f9f9f9 !important;
            }
            hr {
              border-top: 1px solid #000 !important;
              opacity: 1 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="toolbar">
          <div class="toolbar-group">
            <label for="theme-select">Theme</label>
            <select id="theme-select">
              <option value="default">Light</option>
              <option value="paper">Paper</option>
              <option value="dark">Dark</option>
              <option value="darkgrey">Dark Grey</option>
            </select>
            <label for="font-select">Font</label>
            <select id="font-select">
              <option value="Inter, sans-serif">Inter (Sans)</option>
              <option value="Roboto Slab, serif">Roboto Slab (Serif)</option>
              <option value="Merriweather, serif">Merriweather (Serif)</option>
              <option value="Source Serif Pro, serif">Source Serif Pro (Serif)</option>
            </select>
          </div>
          <div class="toolbar-group">
            <button id="print-btn">Print</button>
          </div>
        </div>
        <div class="chat-wrapper" id="chat" contenteditable="true"></div>
      </body>
    </html>
  `);

  const wrapper = win.document.getElementById("chat");
  while (clonedChat.firstChild) wrapper.appendChild(clonedChat.firstChild);
  win.document.close();

  const themeSelect = win.document.getElementById("theme-select");
  themeSelect.addEventListener("change", () => {
    win.document.body.className = themeSelect.value === "default" ? "" : themeSelect.value;
  });

  const fontSelect = win.document.getElementById("font-select");
  fontSelect.addEventListener("change", () => {
    // Apply font only to chat, not toolbar
    const chat = win.document.getElementById("chat");
    chat.style.fontFamily = fontSelect.value;
  });

  const printBtn = win.document.getElementById("print-btn");
  printBtn.addEventListener("click", () => win.print());
}
