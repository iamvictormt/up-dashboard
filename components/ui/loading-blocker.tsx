export function showGlobalBlocker() {
  if (typeof window === 'undefined') return;

  let blocker = document.getElementById('global-blocker');
  if (!blocker) {
    blocker = document.createElement('div');
    blocker.id = 'global-blocker';
    blocker.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, rgba(108,33,68,0.95), rgba(139,69,19,0.9));
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      overflow: hidden;
      cursor: wait;
    `;

    const container = document.createElement('div');
    container.style.cssText = `position: relative; width: 100%; height: 100%;`;

    // ================= Abelha =================
    const bee = document.createElement('img');
    bee.src = '/logo-abelha.png';
    bee.alt = 'Abelha';
    bee.style.cssText = `
      position: absolute;
      width: 80px;
      height: 80px;
      object-fit: contain;
      transition: transform 0.3s linear;
      filter: drop-shadow(0 0 15px rgba(255, 223, 125, 0.7));
    `;

    container.appendChild(bee);
    blocker.appendChild(container);
    document.body.appendChild(blocker);

    // ================= Frases da abelha =================
    const phrases = [
      "Calma, estamos carregando… 🐝",
      "Quase lá! 😄",
      "Um pouquinho de paciência…",
      "Aguenta firme, está chegando!",
      "Respira fundo, só mais um instante!"
    ];

    const beePhrase = document.createElement('div');
    beePhrase.style.cssText = `
      position: absolute;
      max-width: 200px;
      padding: 10px 16px;
      background: rgba(255,255,255,0.9);
      color: #46142b;
      font-weight: 600;
      border-radius: 16px;
      font-size: 14px;
      white-space: normal;
      pointer-events: none;
      opacity: 0;
      text-align: center;
      transition: opacity 0.5s, transform 0.3s;
      z-index: 10;
    `;
    container.appendChild(beePhrase);

    // ================= Posição inicial =================
    let posX = window.innerWidth / 2 - 40;
    let posY = window.innerHeight;
    let targetX = posX;
    let targetY = posY - 200 - Math.random() * 200; 
    let speed = 0.5 + Math.random() * 0.5; // mais devagar
    let angle = 0;

    // Controle de frase
    let showingPhrase = false;

    function showRandomPhrase() {
      if (showingPhrase) return;
      showingPhrase = true;

      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      beePhrase.textContent = phrase;
      beePhrase.style.opacity = '1';
      beePhrase.style.transform = `translateY(-10px)`; // leve movimento para cima

      setTimeout(() => {
        beePhrase.style.opacity = '0';
        beePhrase.style.transform = `translateY(0px)`; // volta suavemente
        showingPhrase = false;
      }, 2500);
    }

    function moveBee() {
      const dx = targetX - posX;
      const dy = targetY - posY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        targetX = 50 + Math.random() * (window.innerWidth - 100);
        targetY = 50 + Math.random() * (window.innerHeight - 100);
      }

      angle += 0.03; // suaviza o movimento
      posX += (dx / distance) * speed + Math.cos(angle) * 1.5;
      posY += (dy / distance) * speed + Math.sin(angle) * 1.5;

      const rotation = Math.sin(angle) * 15;
      bee.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;

      // Frase acompanhando abelha
      beePhrase.style.left = `${posX + 40 - beePhrase.offsetWidth / 2}px`;
      beePhrase.style.top = `${posY - 60}px`;

      // Mostrar frase ocasionalmente, mas mais suave
      if (Math.random() < 0.003) {
        showRandomPhrase();
      }

      requestAnimationFrame(moveBee);
    }

    moveBee();
  }
}


export function hideGlobalBlocker(pendingRequests: number) {
  const blocker = document.getElementById('global-blocker');
  if (blocker && pendingRequests === 0) {
    blocker.style.transition = 'all 0.4s ease';
    blocker.style.opacity = '0';
    blocker.style.transform = 'scale(0.95)';
    setTimeout(() => blocker.remove(), 400);
  }
}
