// Dados dos anúncios com produtos para o loading
const loadingAds = [
  {
    id: '1',
    name: 'Flores Premium',
    category: 'Floricultura',
    products: [
      {
        name: 'Buquê Premium',
        description: 'Rosas brancas importadas com acabamento em cetim',
        price: 'R$ 280',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Arranjo Mesa',
        description: 'Decoração completa para mesa dos convidados',
        price: 'R$ 120',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Decoração Altar',
        description: 'Kit completo para cerimônia religiosa',
        price: 'R$ 850',
        image: '/placeholder.svg?height=200&width=200',
      },
    ],
    gradient: 'linear-gradient(135deg, #ff6b9d, #c44569)',
    whatsapp: '5511999991234',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Doces Elite',
    category: 'Confeitaria',
    products: [
      {
        name: 'Bem Casados',
        description: '100 unidades gourmet com recheios especiais',
        price: 'R$ 320',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Mesa de Doces',
        description: 'Montagem completa com 15 tipos diferentes',
        price: 'R$ 680',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Brigadeiros Premium',
        description: '50 unidades com cobertura belga',
        price: 'R$ 180',
        image: '/placeholder.svg?height=200&width=200',
      },
    ],
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    whatsapp: '5521988885678',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Studio Pro',
    category: 'Fotografia',
    products: [
      {
        name: 'Ensaio Pré-Wedding',
        description: '2 horas de sessão + 50 fotos editadas',
        price: 'R$ 1.200',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Cobertura Completa',
        description: 'Cerimônia + festa com 2 fotógrafos',
        price: 'R$ 2.800',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Book Individual',
        description: 'Sessão personalizada + álbum digital',
        price: 'R$ 450',
        image: '/placeholder.svg?height=200&width=200',
      },
    ],
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    whatsapp: '5531977779012',
    rating: 5.0,
  },
  {
    id: '4',
    name: 'Buffet Requinte',
    category: 'Gastronomia',
    products: [
      {
        name: 'Jantar Completo',
        description: 'Menu executivo para 100 pessoas',
        price: 'R$ 4.500',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Coquetel Recepção',
        description: 'Finger foods e bebidas premium',
        price: 'R$ 1.800',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Brunch Especial',
        description: 'Mesa completa estilo americano',
        price: 'R$ 2.200',
        image: '/placeholder.svg?height=200&width=200',
      },
    ],
    gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    whatsapp: '5511888887777',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Música & Som',
    category: 'Entretenimento',
    products: [
      {
        name: 'DJ + Sonorização',
        description: 'Equipamento completo + DJ profissional',
        price: 'R$ 1.500',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Banda Ao Vivo',
        description: 'Trio acústico para cerimônia',
        price: 'R$ 2.200',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Iluminação Cênica',
        description: 'Kit completo de luzes LED',
        price: 'R$ 800',
        image: '/placeholder.svg?height=200&width=200',
      },
    ],
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    whatsapp: '5511888889999',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Decoração Luxo',
    category: 'Decoração',
    products: [
      {
        name: 'Cenário Completo',
        description: 'Decoração temática personalizada',
        price: 'R$ 3.200',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Mesa dos Noivos',
        description: 'Decoração exclusiva mesa principal',
        price: 'R$ 650',
        image: '/placeholder.svg?height=200&width=200',
      },
      {
        name: 'Entrada Cerimonial',
        description: 'Arco decorativo + tapete personalizado',
        price: 'R$ 1.100',
        image: '/placeholder.svg?height=200&width=200',
      },
    ],
    gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    whatsapp: '5521999887766',
    rating: 4.9,
  },
];

let adRotationInterval: NodeJS.Timeout | null = null;

// Função para escolher aleatoriamente se mostra anúncio ou não
function shouldShowAd(): boolean {
  return Math.random() > 0.3; // 70% chance de mostrar anúncio
}

// Função para escolher fornecedor e produto aleatórios
function getRandomAdAndProduct() {
  const randomAd = loadingAds[Math.floor(Math.random() * loadingAds.length)];
  const randomProduct = randomAd.products[Math.floor(Math.random() * randomAd.products.length)];
  return { ad: randomAd, product: randomProduct };
}

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
      overflow: hidden !important;
      background: linear-gradient(135deg, rgba(108, 33, 68, 0.95), rgba(139, 69, 19, 0.9));
      backdrop-filter: blur(10px);
      z-index: 9999;
      cursor: wait;
      pointer-events: all;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      animation: fadeIn 0.3s ease-out;
    `;

    // Container principal responsivo
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 500px;
      width: 100%;
      animation: slideUp 0.5s ease-out;
      
      @media (max-width: 768px) {
        max-width: 350px;
      }
    `;

    // Header com loading
    const headerSection = document.createElement('div');
    headerSection.style.cssText = `
      text-align: center;
      margin-bottom: 32px;
      color: white;
    `;

    // Loading com spinner
    const loadingSection = document.createElement('div');
    loadingSection.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    `;

    // Spinner elegante
    const spinnerContainer = document.createElement('div');
    spinnerContainer.style.cssText = `
      position: relative;
      width: 60px;
      height: 60px;
    `;

    const outerSpinner = document.createElement('div');
    outerSpinner.style.cssText = `
      position: absolute;
      width: 60px;
      height: 60px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top: 3px solid #F5B13D;
      border-radius: 50%;
      animation: spin 1.2s linear infinite;
    `;

    // Spinner pequeno integrado
    const miniSpinner = document.createElement("div")
    miniSpinner.style.cssText = `
      width: 30px;
      height: 30px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid #F5B13D;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `

    const loadingText = document.createElement("span")
    loadingText.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: white;
    `
    loadingText.textContent = "Carregando sua página..."

    loadingSection.appendChild(miniSpinner)
    loadingSection.appendChild(loadingText)
    headerSection.appendChild(loadingSection);

    // Decidir se mostra anúncio
    const showAd = shouldShowAd();
    let adContainer: HTMLElement | null = null;

    if (showAd) {
      // Explicação dos anúncios
      const adExplanation = document.createElement('p');
      adExplanation.style.cssText = `
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin: 14px 0 0 0;
        line-height: 1.4;
        text-align: center;
      `;
      adExplanation.innerHTML = `
      Enquanto isso, conheça nossos <strong>parceiros patrocinadores</strong><br>
      que tornam nossa plataforma gratuita para você! 💝
    `;
      headerSection.appendChild(adExplanation);

      // Container do anúncio
      adContainer = document.createElement('div');
      adContainer.id = 'loading-ad-container';
      adContainer.style.cssText = `
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 0;
        width: 100%;
        max-width: 480px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
        cursor: default;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        animation: slideInUp 0.6s ease-out 0.5s both;
        margin-top: 14px;
        
        @media (max-width: 768px) {
          max-width: 320px;
        }
      `;

      // Hover effects
      adContainer.addEventListener('mouseenter', () => {
        adContainer.style.transform = 'translateY(-4px) scale(1.01)';
        adContainer.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.4)';
      });

      adContainer.addEventListener('mouseleave', () => {
        adContainer.style.transform = 'translateY(0) scale(1)';
        adContainer.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
      });

      // Função para criar o conteúdo do anúncio
      function createAdContent() {
        const { ad, product } = getRandomAdAndProduct();

        return `
          <!-- Header da loja -->
          <div style="
            background: #46142b;
            padding: 20px 24px 16px 24px;
            position: relative;
            overflow: hidden;
          ">
            <!-- Label anúncio -->
            <div style="
              position: absolute;
              top: 12px;
              right: 12px;
              background: rgba(0, 0, 0, 0.6);
              color: white;
              font-size: 10px;
              font-weight: 600;
              padding: 4px 8px;
              border-radius: 12px;
              backdrop-filter: blur(10px);
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">Anúncio</div>

            <!-- Info da loja -->
            <div style="position: relative; z-index: 2;">
              <h3 style="
                color: white;
                font-size: 20px;
                font-weight: 700;
                margin: 0 0 4px 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              ">${ad.name}</h3>
              
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
              ">
                <span style="
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 13px;
                  font-weight: 500;
                ">${ad.category}</span>
                
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  background: rgba(255, 255, 255, 0.2);
                  padding: 4px 8px;
                  border-radius: 12px;
                  backdrop-filter: blur(10px);
                ">
                  <span style="color: #fbbf24; font-size: 12px;">★</span>
                  <span style="color: white; font-size: 12px; font-weight: 600;">${ad.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Produto -->
          <div style="padding: 24px;">
            <!-- Imagem do produto -->
            <div style="
              width: 100%;
              height: 200px;
              border-radius: 16px;
              overflow: hidden;
              margin-bottom: 20px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
              
              @media (max-width: 768px) {
                height: 160px;
              }
            ">
              <img 
                src="${product.image}" 
                alt="${product.name}"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  transition: transform 0.3s ease;
                "
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
              />
            </div>

            <!-- Info do produto -->
            <div style="margin-bottom: 24px;">
              <h4 style="
                color: #1e293b;
                font-size: 18px;
                font-weight: 700;
                margin: 0 0 8px 0;
                line-height: 1.3;
                
                @media (max-width: 768px) {
                  font-size: 16px;
                }
              ">${product.name}</h4>
              
              <p style="
                color: #64748b;
                font-size: 14px;
                margin: 0 0 12px 0;
                line-height: 1.4;
                
                @media (max-width: 768px) {
                  font-size: 13px;
                }
              ">${product.description}</p>
              
              <div style="
                color: #059669;
                font-size: 24px;
                font-weight: 800;
                
                @media (max-width: 768px) {
                  font-size: 20px;
                }
              ">${product.price}</div>
            </div>

            <!-- Botão WhatsApp -->
            <button onclick="openAdWhatsApp('${ad.whatsapp}', '${ad.name}', '${product.name}')" style="
              width: 100%;
              background: linear-gradient(135deg, #25d366, #128c7e);
              color: white;
              border: none;
              padding: 16px;
              border-radius: 16px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 8px 24px rgba(37, 211, 102, 0.3);
              position: relative;
              overflow: hidden;
              
              @media (max-width: 768px) {
                padding: 14px;
                font-size: 15px;
              }
            " onmouseover="
              this.style.transform='translateY(-2px)';
              this.style.boxShadow='0 12px 32px rgba(37, 211, 102, 0.4)';
            " onmouseout="
              this.style.transform='translateY(0)';
              this.style.boxShadow='0 8px 24px rgba(37, 211, 102, 0.3)';
            ">
              <span style="font-size: 18px;">💬</span>
              <span>Conversar no WhatsApp</span>
            </button>

            <!-- Footer -->
            <div style="
              text-align: center;
              margin-top: 10px;
              padding-top: 10px;
            ">
              <div style="
                color: #64748b;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.4;
              ">
                <span style="color: #10b981;">✓</span> Parceiro verificado
              </div>
            </div>
          </div>
        `;
      }

      // Inicializar com conteúdo aleatório
      adContainer.innerHTML = createAdContent();

      // Rotacionar a cada 10 minutos com novo conteúdo aleatório
      adRotationInterval = setInterval(() => {
        // Animação de saída
        adContainer!.style.opacity = '0';
        adContainer!.style.transform = 'translateY(20px) scale(0.95)';

        setTimeout(() => {
          adContainer!.innerHTML = createAdContent();
          // Animação de entrada
          adContainer!.style.opacity = '1';
          adContainer!.style.transform = 'translateY(0) scale(1)';
        }, 300);
      }, 600000); // 10 minutos
    }

    // Adicionar estilos CSS
    const styleId = 'global-loading-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @media (max-width: 768px) {
          #loading-ad-container {
            max-width: 320px !important;
          }
        }

        @media (max-width: 480px) {
          #loading-ad-container {
            max-width: 300px !important;
            margin: 0 10px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    // Função global para WhatsApp
    (window as any).openAdWhatsApp = (whatsapp: string, storeName: string, productName: string) => {
      const message = `Olá! Vi o produto "${productName}" da ${storeName} na Love Decoration e gostaria de mais informações.`;
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Montar a estrutura
    container.appendChild(headerSection);
    if (adContainer) {
      container.appendChild(adContainer);
    }
    blocker.appendChild(container);
    document.body.appendChild(blocker);
  }
}

export function hideGlobalBlocker(pendingRequests: number) {
  const blocker = document.getElementById('global-blocker');
  if (blocker && pendingRequests === 0) {
    // Limpar intervalo
    if (adRotationInterval) {
      clearInterval(adRotationInterval);
      adRotationInterval = null;
    }

    // Animação de saída
    blocker.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    blocker.style.opacity = '0';
    blocker.style.transform = 'scale(0.95)';

    setTimeout(() => {
      blocker.remove();
    }, 400);
  }
}
