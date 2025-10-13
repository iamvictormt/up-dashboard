export function showGlobalBlocker() {
  if (typeof window === 'undefined') return;

  // Bloqueio global
  let blocker = document.getElementById('global-bee-loader');
  if (!blocker) {
    blocker = document.createElement('div');
    blocker.id = 'global-bee-loader';
    blocker.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, rgba(108,33,68,0.95), rgba(139,69,19,0.9));
      backdrop-filter: blur(10px);
      z-index: 999999;
      cursor: wait;
      pointer-events: all;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Container
    const container = document.createElement('div');
    container.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `;

    // Mensagens
    const messages = [
      'Tenha paciência...',
      'Estamos preparando tudo!',
      'A abelhinha está trabalhando...',
      'Quase lá, aguente firme!',
      'A magia está acontecendo...',
    ];

    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 120px;
      color: white;
      font-size: 18px;
      font-weight: 600;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
      pointer-events: none;
    `;

    container.appendChild(messageEl);

    // Partículas de vento
    const windContainer = document.createElement('canvas');
    windContainer.width = window.innerWidth;
    windContainer.height = window.innerHeight;
    windContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    `;
    const ctx = windContainer.getContext('2d')!;
    const particles: { x: number; y: number; alpha: number; size: number; speedX: number; speedY: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        alpha: 0.1 + Math.random() * 0.3,
        size: 2 + Math.random() * 3,
        speedX: -0.3 + Math.random() * 0.6,
        speedY: -0.5 + Math.random() * 0.5,
      });
    }

    function animateWind() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animateWind);
    }
    animateWind();
    container.appendChild(windContainer);

    // Abelha
    const bee = document.createElement('img');
    bee.src = '/logo-abelha.png';
    bee.alt = 'Abelha';
    bee.style.cssText = `
      position: absolute;
      max-width: 80px;
      max-height: 80px;
      width: auto;
      height: auto;
      left: calc(50% - 40px);
      bottom: 0;
      transition: transform 0.1s linear;
      pointer-events: none;
    `;

    container.appendChild(bee);

    // Variáveis do voo
    let posX = window.innerWidth / 2 - 40;
    let posY = -100;
    const minY = 50;
    const maxY = window.innerHeight - 200;
    let targetX = posX;
    let targetY = 150 + Math.random() * 100;
    const speed = 0.03;

    let currentMessage = '';

    function moveBee() {
      const dx = targetX - posX;
      const dy = targetY - posY;
      posX += dx * speed;
      posY += dy * speed;

      bee.style.left = `${posX}px`;
      bee.style.bottom = `${posY}px`;
      bee.style.transform = `rotate(${Math.sin(Date.now() / 200) * 10}deg)`;

      // Alvo aleatório
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        targetX = 50 + Math.random() * (window.innerWidth - 100);
        targetY = minY + Math.random() * (maxY - minY);

        // Nova mensagem
        let newMsg = messages[Math.floor(Math.random() * messages.length)];
        while (newMsg === currentMessage) {
          newMsg = messages[Math.floor(Math.random() * messages.length)];
        }
        currentMessage = newMsg;
        messageEl.textContent = currentMessage;
      }

      requestAnimationFrame(moveBee);
    }

    moveBee();

    blocker.appendChild(container);
    document.body.appendChild(blocker);

    // Desativar scroll
    document.body.style.overflow = 'hidden';
  }
}

export function hideGlobalBlocker(pendingRequests: number) {
  const blocker = document.getElementById('global-bee-loader');
  if (blocker && pendingRequests === 0) {
    blocker.style.transition = 'all 0.4s ease';
    blocker.style.opacity = '0';
    blocker.style.transform = 'scale(0.95)';
    document.body.style.overflow = '';
    setTimeout(() => blocker.remove(), 400);
  }
}
