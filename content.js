// Array para armazenar as ações gravadas durante a sessão de gravação
let actions = [];
// Flag para controlar se a gravação está ativa ou não
let isRecording = false;

// Função para registrar uma ação do usuário (clique ou input)
function recordAction(actionType, selector, value = '', useContains = false, containsText = '') {
  // Se não estiver gravando, ignora a ação
  if (!isRecording) return;
  // Adiciona a ação ao array de ações
  actions.push({ actionType, selector, value, useContains, containsText });
  // Gera o código Cypress baseado nas ações gravadas
  const code = generateCypressCode(actions);
  // Envia o código atualizado para o popup da extensão
  chrome.runtime.sendMessage({ type: "updateCode", code });
}

// Listener para capturar eventos de clique em qualquer elemento da página
document.addEventListener('click', function (event) {
  // Gera um seletor único para o elemento clicado
  const selectorInfo = getSelector(event.target);
  // Registra a ação de clique
  recordAction('click', selectorInfo.selector, '', selectorInfo.useContains, selectorInfo.containsText);
}, true); // true = captura na fase de captura (bubble)

// Listener para capturar eventos de input em campos de texto
document.addEventListener('input', function (event) {
  // Gera um seletor único para o elemento de input
  const selectorInfo = getSelector(event.target);
  // Obtém o valor digitado no campo
  const value = event.target.value;
  // Registra a ação de input com o valor
  recordAction('input', selectorInfo.selector, value, selectorInfo.useContains, selectorInfo.containsText);
}, true); // true = captura na fase de captura (bubble)

// Função para gerar um seletor CSS único para um elemento
function getSelector(element) {
  // Prioriza data-cy se disponível (melhor prática para testes)
  if (element.getAttribute('data-cy')) {
    return {
      selector: `[data-cy="${element.getAttribute('data-cy')}"]`,
      useContains: false,
      containsText: ''
    };
  }
  
  // Prioriza ID se disponível (mais específico)
  if (element.id) {
    return {
      selector: `#${element.id}`,
      useContains: false,
      containsText: ''
    };
  }
  
  // Usa o atributo name se disponível
  if (element.name) {
    return {
      selector: `[name="${element.name}"]`,
      useContains: false,
      containsText: ''
    };
  }
  
  // Verifica se deve usar contains baseado no texto do elemento
  const text = element.textContent?.trim();
  if (text && text.length > 0 && text.length < 50 && !element.className) {
    // Se tem texto visível e não tem classes específicas, usa contains
    return {
      selector: '',
      useContains: true,
      containsText: text
    };
  }
  
  // Usa classes CSS se disponíveis
  if (element.className) {
    return {
      selector: '.' + element.className.trim().split(/\s+/).join('.'),
      useContains: false,
      containsText: ''
    };
  }
  
  // Fallback: usa apenas o nome da tag
  return {
    selector: element.tagName.toLowerCase(),
    useContains: false,
    containsText: ''
  };
}

// Função para converter as ações gravadas em código Cypress
function generateCypressCode(actions) {
  return actions.map(action => {
    // Gera código Cypress para ação de clique
    if (action.actionType === 'click') {
      if (action.useContains) {
        return `cy.contains('${action.containsText}').should('be.visible').click();`;
      } else {
        return `cy.get('${action.selector}').click();`;
      }
    } 
    // Gera código Cypress para ação de input
    else if (action.actionType === 'input') {
      if (action.useContains) {
        return `cy.contains('${action.containsText}').should('be.visible').type('${action.value}');`;
      } else {
        return `cy.get('${action.selector}').type('${action.value}');`;
      }
    }
    return '';
  }).join('\n'); // Junta todas as linhas de código com quebra de linha
}

// Listener para mensagens vindas do popup da extensão
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Inicia a gravação: limpa o array de ações e ativa a flag
  if (request.action === 'startRecording') {
    actions = [];
    isRecording = true;
  }
  // Para a gravação: desativa a flag
  if (request.action === 'stopRecording') {
    isRecording = false;
  }
  // Gera e retorna o código Cypress quando solicitado
  if (request.action === 'generateCypressCode') {
    isRecording = false; // Para a gravação
    const code = generateCypressCode(actions);
    sendResponse({ code: code });
  }
});