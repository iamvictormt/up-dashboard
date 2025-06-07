export function showGlobalBlocker() {
  if (typeof window === 'undefined') return;

  let blocker = document.getElementById('global-blocker');
  if (!blocker) {
    blocker = document.createElement('div');
    blocker.id = 'global-blocker';
    blocker.style.position = 'fixed';
    blocker.style.top = '0';
    blocker.style.left = '0';
    blocker.style.width = '100vw';
    blocker.style.height = '100vh';
    blocker.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    blocker.style.zIndex = '9999';
    blocker.style.cursor = 'wait';
    blocker.style.pointerEvents = 'all';
    blocker.style.display = 'flex';
    blocker.style.flexDirection = 'column';
    blocker.style.alignItems = 'center';
    blocker.style.justifyContent = 'center';
    blocker.style.fontFamily = 'sans-serif';
    blocker.style.color = '#fff';
    blocker.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.6)';

    const spinner = document.createElement('div');
    spinner.id = 'global-spinner';
    spinner.style.border = '6px solid #f3f3f3';
    spinner.style.borderTop = '6px solid #46142b';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '60px';
    spinner.style.height = '60px';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.marginBottom = '16px';

    const loadingText = document.createElement('div');
    loadingText.innerHTML = `
  Carregando<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span>
`;
    loadingText.style.fontSize = '24px';
    loadingText.style.fontWeight = 'bold';
    loadingText.style.display = 'flex';
    loadingText.style.gap = '2px';
    loadingText.style.alignItems = 'center';

    const styleId = 'global-spinner-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes blink {
      0% { opacity: 0; }
      20% { opacity: 0; }
      40% { opacity: 1; }
      60% { opacity: 0; }
      100% { opacity: 0; }
    }

    .dot-1 {
      animation: blink 1.5s infinite;
      animation-delay: 0s;
    }

    .dot-2 {
      animation: blink 1.5s infinite;
      animation-delay: 0.2s;
    }

    .dot-3 {
      animation: blink 1.5s infinite;
      animation-delay: 0.4s;
    }
  `;
      document.head.appendChild(style);
    }

    blocker.appendChild(spinner);
    blocker.appendChild(loadingText);
    document.body.appendChild(blocker);
  }
}

export function hideGlobalBlocker(pendingRequests: number) {
  const blocker = document.getElementById('global-blocker');
  if (blocker && pendingRequests === 0) {
    blocker.remove();
  }
}
