const LOADER_ID = 'global-bee-loader';
const LOADER_STYLE_ID = 'global-bee-loader-style';
const SHOW_DELAY_MS = 20;
const HIDE_DELAY_MS = 140;

let showTimeout: ReturnType<typeof setTimeout> | null = null;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(LOADER_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = LOADER_STYLE_ID;
  style.textContent = `
    @keyframes up-loader-run {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(300%); }
    }

    @keyframes up-loader-pulse {
      0% { transform: scale(0.95); opacity: 0.7; }
      50% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.7; }
    }

    #${LOADER_ID} {
      position: fixed;
      inset: 0;
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 220ms ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #${LOADER_ID}[data-visible="true"] {
      opacity: 1;
    }

    #${LOADER_ID} .up-soft-veil {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(70,20,43,0.06), rgba(245,177,61,0.04));
    }

    #${LOADER_ID} .up-top-progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, rgba(70,20,43,0.2), rgba(245,177,61,0.28), rgba(70,20,43,0.2));
      overflow: hidden;
      box-shadow: 0 2px 14px rgba(70,20,43,0.2);
    }

    #${LOADER_ID} .up-top-progress::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 46%;
      height: 100%;
      background: linear-gradient(90deg, #46142b, #f5b13d, #d56235);
      border-radius: 9999px;
      animation: up-loader-run 820ms ease-in-out infinite;
    }

    #${LOADER_ID} .up-loader-chip {
      position: absolute;
      right: 18px;
      bottom: 18px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(70, 20, 43, 0.92);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.26);
      border-radius: 9999px;
      padding: 10px 14px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 12px 30px rgba(70, 20, 43, 0.28);
      backdrop-filter: blur(6px);
    }

    #${LOADER_ID} .up-loader-dot {
      width: 8px;
      height: 8px;
      border-radius: 9999px;
      background: #f5b13d;
      animation: up-loader-pulse 900ms ease-in-out infinite;
    }
  `;

  document.head.appendChild(style);
}

function ensureLoaderElement() {
  let blocker = document.getElementById(LOADER_ID);
  if (blocker) return blocker;

  blocker = document.createElement('div');
  blocker.id = LOADER_ID;
  blocker.innerHTML = `
    <div class="up-soft-veil"></div>
    <div class="up-top-progress"></div>
    <div class="up-loader-chip">
      <span class="up-loader-dot"></span>
      <span>Carregando</span>
    </div>
  `;

  document.body.appendChild(blocker);
  return blocker;
}

export function showGlobalBlocker() {
  if (typeof window === 'undefined') return;

  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  const blocker = document.getElementById(LOADER_ID);
  if (blocker?.getAttribute('data-visible') === 'true') return;
  if (showTimeout) return;

  showTimeout = setTimeout(() => {
    injectStyles();
    const createdBlocker = ensureLoaderElement();
    createdBlocker.setAttribute('data-visible', 'true');
    showTimeout = null;
  }, SHOW_DELAY_MS);
}

export function hideGlobalBlocker(pendingRequests: number) {
  if (pendingRequests > 0 || typeof window === 'undefined') return;

  if (showTimeout) {
    clearTimeout(showTimeout);
    showTimeout = null;
  }

  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }

  hideTimeout = setTimeout(() => {
    const blocker = document.getElementById(LOADER_ID);
    if (blocker) {
      blocker.setAttribute('data-visible', 'false');
    }
    hideTimeout = null;
  }, HIDE_DELAY_MS);
}
