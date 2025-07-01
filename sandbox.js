// sandbox.js
// Este script roda dentro da página de sandbox, com permissões mais relaxadas.

let aiSelectorFinder;

function initializeAI() {
  if (typeof AISelectorFinder !== 'undefined') {
    aiSelectorFinder = new AISelectorFinder();
    console.log('🤖 Sandbox de IA inicializado e pronto.');
    // Informa ao painel que a sandbox está pronta.
    window.parent.postMessage({ type: 'AI_READY' }, '*');
  } else {
    console.error('AISelectorFinder não foi encontrado. O script não foi carregado corretamente?');
  }
}

// Listener para mensagens vindas do painel principal (injectPanel.js)
window.addEventListener('message', async (event) => {
  // Não processa as próprias mensagens
  if (event.source === window) {
    return;
  }

  const { type, payload } = event.data;

  if (type === 'GET_SELECTOR_REQUEST') {
    if (!aiSelectorFinder) {
      console.error('IA não está pronta para processar a solicitação.');
      return;
    }
    
    // Pede à IA para prever a MELHOR ESTRATÉGIA
    const strategy = await aiSelectorFinder.predictBestStrategy(payload.elementFeatures);

    // Envia a ESTRATÉGIA de volta para o painel
    event.source.postMessage({
      type: 'GET_SELECTOR_RESPONSE',
      payload: {
        strategy: strategy, // Envia o nome da estratégia (ex: 'id')
        requestId: payload.requestId,
      }
    }, event.origin);
  }
});

initializeAI(); 