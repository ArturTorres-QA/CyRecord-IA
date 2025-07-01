// Verifica se o painel já foi injetado para evitar duplicação
if (!window.cypressRecorderPanelInjected) {
    // Marca que o painel foi injetado
    window.cypressRecorderPanelInjected = true;
  
    // --- INÍCIO DA INTEGRAÇÃO DA SANDBOX DE IA ---

    let aiSandbox;
    let isAiReady = false;
    const requestPromises = new Map();
    let requestIdCounter = 0;

    function createAiSandbox() {
      aiSandbox = document.createElement('iframe');
      aiSandbox.src = chrome.runtime.getURL('sandbox.html');
      aiSandbox.style.display = 'none';
      document.body.appendChild(aiSandbox);

      window.addEventListener('message', (event) => {
        // Ignora mensagens que não sejam da sandbox
        if (event.source !== aiSandbox.contentWindow) {
          return;
        }
        
        const { type, payload } = event.data;

        if (type === 'AI_READY') {
          isAiReady = true;
          console.log('✅ Sandbox de IA confirmou que está pronta.');
        } else if (type === 'GET_SELECTOR_RESPONSE') {
          const { requestId, strategy } = payload;
          const promise = requestPromises.get(requestId);
          if (promise) {
            promise.resolve(strategy);
            requestPromises.delete(requestId);
          }
        }
      });
    }
    
    /**
     * Envia uma requisição para a sandbox da IA e retorna uma promessa com o resultado.
     * @param {any} elementFeatures - As características do elemento a serem enviadas.
     * @returns {Promise<string>}
     */
    function getSelectorFromAI(elementFeatures) {
      return new Promise((resolve, reject) => {
        if (!isAiReady) {
          return reject(new Error('A sandbox da IA não está pronta.'));
        }

        const requestId = requestIdCounter++;
        requestPromises.set(requestId, { resolve, reject });
        
        aiSandbox.contentWindow.postMessage({
          type: 'GET_SELECTOR_REQUEST',
          payload: {
            elementFeatures,
            requestId,
          }
        }, '*');

        // Timeout para o caso de a sandbox não responder
        setTimeout(() => {
          if (requestPromises.has(requestId)) {
            reject(new Error(`A requisição para a IA (ID: ${requestId}) expirou.`));
            requestPromises.delete(requestId);
          }
        }, 5000); // Timeout de 5 segundos
      });
    }

    // --- FIM DA INTEGRAÇÃO DA SANDBOX DE IA ---
  
    // Cria a sandbox logo no início
    createAiSandbox();
  
    // Novas cores específicas
    const green = '#4CAF50'; // iniciar gravação
    const blue = '#142B43'; // reiniciar gravação, título
    const red = '#E53935'; // parar gravação
    const lightGray = '#F5F5F5'; // fundo principal
  
    // Nova paleta azul/rosé
    const rose = '#D7B0A6'; // botão principal, destaques
    const beigeRose = '#D6C3BC'; // botão reiniciar
    const offWhite = '#F7F0EA'; // fundo principal
  
    // Cria o elemento principal do painel
    const panel = document.createElement('div');
    panel.id = 'cypress-recorder-panel';
    // Estilização do painel: posição fixa no canto inferior direito
    panel.style.position = 'fixed';
    panel.style.bottom = '10px';
    panel.style.right = '10px';
    panel.style.width = '600px';
    panel.style.height = '800px';
    panel.style.minWidth = '300px';
    panel.style.minHeight = '400px';
    panel.style.maxWidth = '90vw';
    panel.style.maxHeight = '90vh';
    panel.style.background = lightGray;
    panel.style.color = blue;
    panel.style.fontFamily = "'Roboto', Arial, sans-serif";
    panel.style.fontSize = '14px';
    panel.style.zIndex = '999999'; // Garante que fique acima de outros elementos
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column'; // Layout vertical
    panel.style.overflow = 'hidden';
    panel.style.resize = 'both'; // Permite redimensionamento nativo
    panel.style.border = '2px solid ' + blue;
  
    // Cria o cabeçalho do painel
    const header = document.createElement('div');
    header.style.padding = '14px 18px';
    header.style.background = blue;
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.overflow = 'visible';
  
    // Ícone de informação no canto esquerdo
    const infoIcon = document.createElement('span');
    infoIcon.textContent = '🛈';
    infoIcon.style.fontSize = '20px';
    infoIcon.style.cursor = 'pointer';
    infoIcon.style.position = 'relative';
    infoIcon.style.marginRight = '14px';
    infoIcon.style.color = '#fff';
    // Tooltip customizado
    const tooltip = document.createElement('div');
    tooltip.textContent = 'CyRecord é uma extensão para o navegador Google Chrome que grava automaticamente as ações do usuário em uma página web (como cliques e digitação em campos) e gera, a partir disso, comandos prontos para serem usados em testes automatizados com o framework Cypress.';
    tooltip.style.position = 'absolute';
    tooltip.style.top = '120%';
    tooltip.style.left = '0';
    tooltip.style.transform = 'none';
    tooltip.style.background = '#fff';
    tooltip.style.color = blue;
    tooltip.style.border = 'none';
    tooltip.style.padding = '7px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '11px';
    tooltip.style.fontFamily = "'Roboto', Arial, sans-serif";
    tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    tooltip.style.whiteSpace = 'normal';
    tooltip.style.textAlign = 'left';
    tooltip.style.zIndex = '1000000';
    tooltip.style.display = 'none';
    tooltip.style.maxWidth = '260px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.lineHeight = '1.4';
    // Seta do tooltip
    const tooltipArrow = document.createElement('div');
    tooltipArrow.style.position = 'absolute';
    tooltipArrow.style.top = '-7px';
    tooltipArrow.style.left = '16px';
    tooltipArrow.style.transform = 'none';
    tooltipArrow.style.width = '0';
    tooltipArrow.style.height = '0';
    tooltipArrow.style.borderLeft = '7px solid transparent';
    tooltipArrow.style.borderRight = '7px solid transparent';
    tooltipArrow.style.borderBottom = '7px solid #fff';
    tooltip.appendChild(tooltipArrow);
    infoIcon.appendChild(tooltip);
    infoIcon.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
    });
    infoIcon.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
    header.appendChild(infoIcon);
  
    // Container para título
    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.alignItems = 'center';
    // Título
    const title = document.createElement('div');
    title.textContent = 'CyRecord';
    title.style.fontWeight = 'bold';
    title.style.color = '#fff';
    title.style.fontFamily = "'Roboto', Arial, sans-serif";
    titleContainer.appendChild(title);
    header.appendChild(titleContainer);
  
    // Container para botões do header
    const headerButtons = document.createElement('div');
    headerButtons.style.display = 'flex';
    headerButtons.style.alignItems = 'center';
    headerButtons.style.gap = '8px';
    
    // Botão minimizar/expandir
    const btnToggleSize = document.createElement('button');
    btnToggleSize.textContent = '⬜'; // Símbolo maximizar
    btnToggleSize.style.fontSize = '16px';
    btnToggleSize.style.background = 'transparent';
    btnToggleSize.style.color = '#fff';
    btnToggleSize.style.border = '1px solid rgba(255,255,255,0.3)';
    btnToggleSize.style.borderRadius = '3px';
    btnToggleSize.style.cursor = 'pointer';
    btnToggleSize.style.padding = '4px 6px';
    btnToggleSize.style.fontFamily = "'Roboto', Arial, sans-serif";
    btnToggleSize.title = 'Maximizar/Restaurar';
    headerButtons.appendChild(btnToggleSize);
    
    // Cria o botão "Fechar" painel
    const btnClose = document.createElement('button');
    btnClose.textContent = '×'; // Símbolo X
    btnClose.style.fontSize = '22px';
    btnClose.style.background = 'transparent';
    btnClose.style.color = '#fff';
    btnClose.style.border = 'none';
    btnClose.style.cursor = 'pointer';
    btnClose.style.fontFamily = "'Roboto', Arial, sans-serif";
    headerButtons.appendChild(btnClose);
    
    header.appendChild(headerButtons);
  
    // Status da gravação
    const statusDiv = document.createElement('div');
    statusDiv.style.display = 'flex';
    statusDiv.style.justifyContent = 'center';
    statusDiv.style.alignItems = 'center';
    statusDiv.style.padding = '18px 0 10px 0';
    statusDiv.style.background = 'transparent';
    statusDiv.style.gap = '16px';
  
    // Botão iniciar/parar gravação
    const btnStartStop = document.createElement('button');
    btnStartStop.textContent = 'Iniciar Gravação';
    btnStartStop.style.background = green;
    btnStartStop.style.color = '#fff';
    btnStartStop.style.fontWeight = 'bold';
    btnStartStop.style.fontSize = '18px';
    btnStartStop.style.border = 'none';
    btnStartStop.style.borderRadius = '6px';
    btnStartStop.style.padding = '12px 32px';
    btnStartStop.style.cursor = 'pointer';
    btnStartStop.style.transition = 'background 0.2s';
    btnStartStop.style.fontFamily = "'Roboto', Arial, sans-serif";
    statusDiv.appendChild(btnStartStop);
  
    // Botão reiniciar gravação (criado mas só exibido durante gravação)
    const btnRestart = document.createElement('button');
    btnRestart.textContent = 'Reiniciar Gravação';
    btnRestart.style.background = beigeRose;
    btnRestart.style.color = blue;
    btnRestart.style.fontWeight = 'bold';
    btnRestart.style.fontSize = '18px';
    btnRestart.style.border = 'none';
    btnRestart.style.borderRadius = '6px';
    btnRestart.style.padding = '12px 32px';
    btnRestart.style.cursor = 'pointer';
    btnRestart.style.fontFamily = "'Roboto', Arial, sans-serif";
    btnRestart.style.display = 'none';
    statusDiv.appendChild(btnRestart);
    panel.appendChild(header);
    panel.appendChild(statusDiv);
  
    // --- SEÇÃO DE IA GENERATIVA ---
    const nlpSection = document.createElement('div');
    nlpSection.style.padding = '10px 18px';
    nlpSection.style.borderBottom = `1px solid #ddd`;

    const nlpTitle = document.createElement('div');
    nlpTitle.textContent = '🤖 Assistente de Testes com IA (Beta)';
    nlpTitle.style.fontWeight = 'bold';
    nlpTitle.style.color = blue;
    nlpSection.appendChild(nlpTitle);

    const nlpTextarea = document.createElement('textarea');
    nlpTextarea.id = 'nlp-input';
    nlpTextarea.placeholder = 'Ex: Clique em Login, digite "admin" no campo de usuário e veja se o texto "Bem-vindo" aparece.';
    nlpTextarea.style.width = '100%';
    nlpTextarea.style.height = '80px';
    nlpTextarea.style.marginTop = '8px';
    nlpTextarea.style.padding = '8px';
    nlpTextarea.style.boxSizing = 'border-box';
    nlpSection.appendChild(nlpTextarea);

    const nlpButton = document.createElement('button');
    nlpButton.id = 'nlp-generate';
    nlpButton.textContent = 'Gerar Código a partir do Texto';
    nlpButton.style.width = '100%';
    nlpButton.style.marginTop = '8px';
    nlpButton.style.padding = '10px';
    nlpButton.style.background = blue;
    nlpButton.style.color = 'white';
    nlpButton.style.border = 'none';
    nlpButton.style.borderRadius = '4px';
    nlpButton.style.cursor = 'pointer';
    nlpSection.appendChild(nlpButton);

    panel.appendChild(nlpSection);
    // --- FIM DA SEÇÃO ---

    nlpButton.addEventListener('click', handleNlpGenerate);

    // Função para mostrar mensagens de status para o usuário
    function updateStatus(message, color = 'black') {
        // Remove status anterior se existir
        const existingStatus = document.getElementById('nlp-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Cria elemento de status
        const statusDiv = document.createElement('div');
        statusDiv.id = 'nlp-status';
        statusDiv.textContent = message;
        statusDiv.style.marginTop = '8px';
        statusDiv.style.padding = '8px';
        statusDiv.style.borderRadius = '4px';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.fontWeight = 'bold';
        statusDiv.style.textAlign = 'center';
        statusDiv.style.transition = 'all 0.3s ease';
        
        // Define cor baseada no parâmetro
        if (color === 'green' || color === '#4CAF50') {
            statusDiv.style.background = '#E8F5E8';
            statusDiv.style.color = '#2E7D2E';
            statusDiv.style.border = '1px solid #4CAF50';
        } else if (color === 'red' || color === '#E53935') {
            statusDiv.style.background = '#FFEBEE';
            statusDiv.style.color = '#C62828';
            statusDiv.style.border = '1px solid #E53935';
        } else if (color === 'orange' || color === '#FF9800') {
            statusDiv.style.background = '#FFF3E0';
            statusDiv.style.color = '#EF6C00';
            statusDiv.style.border = '1px solid #FF9800';
        } else if (color === blue) {
            statusDiv.style.background = '#E3F2FD';
            statusDiv.style.color = blue;
            statusDiv.style.border = `1px solid ${blue}`;
        } else {
            statusDiv.style.background = '#F5F5F5';
            statusDiv.style.color = color;
            statusDiv.style.border = '1px solid #DDD';
        }
        
        // Adiciona após o botão de geração
        nlpButton.parentNode.insertBefore(statusDiv, nlpButton.nextSibling);
        
        // Remove automaticamente após 10 segundos (exceto para mensagens de processo)
        if (!message.includes('pensando') && !message.includes('Processando')) {
            setTimeout(() => {
                if (statusDiv && statusDiv.parentNode) {
                    statusDiv.style.opacity = '0';
                    setTimeout(() => {
                        if (statusDiv && statusDiv.parentNode) {
                            statusDiv.remove();
                        }
                    }, 300);
                }
            }, 10000);
        }
    }

    // --- LÓGICA DE GERAÇÃO NLP ---
    async function handleNlpGenerate() {
        const text = nlpTextarea.value.trim();
        if (!text) {
            updateStatus('Por favor, digite um comando de texto.', 'orange');
            return;
        }

        updateStatus('🤖 A IA está pensando... Por favor, aguarde.', blue);
        nlpButton.disabled = true;
        nlpButton.style.opacity = '0.7';
        
        chrome.runtime.sendMessage({ action: "generateCodeFromNLP", text: text }, async (response) => {
            if (response.success) {
                const steps = response.steps;
                updateStatus(`IA gerou ${steps.length} comando(s). Executando...`, blue);
                
                let processedCount = 0;
                // Processa cada passo recebido da IA
                for (const step of steps) {
                    await processNlpStep(step);
                    processedCount++;
                    updateStatus(`Processando... ${processedCount}/${steps.length} comando(s)`, blue);
                }
                updateStatus(`✅ Concluído! ${steps.length} comando(s) adicionado(s) ao código.`, 'green');

            } else {
                console.error("Erro da API:", response.error);
                updateStatus(`❌ Erro da IA: ${response.error}`, 'red');
            }

            nlpButton.disabled = false;
            nlpButton.style.opacity = '1';
        });
    }

    async function processNlpStep(step) {
        const element = findElementByText(step.target);
        if (!element) {
            updateStatus(`⚠️ Elemento "${step.target}" não encontrado na página.`, 'orange');
            console.log(`[CyRecord Debug] Não encontrou elemento para "${step.target}"`);
            return;
        }
        
        console.log(`[CyRecord Debug] Encontrou elemento para "${step.target}":`, element, `ID: ${element.id}`, `Class: ${element.className}`, `Tag: ${element.tagName}`);
        
        const selectorInfo = await getSelector(element);
        
        // Processa diferentes tipos de ações
        switch (step.action) {
            case 'click':
                // Adiciona ação de clique ao array de ações
                actions.push({
                    actionType: 'manualClick',
                    selector: selectorInfo.selector,
                    useContains: selectorInfo.useContains,
                    containsText: selectorInfo.containsText
                });
                break;

            case 'type':
                // Adiciona ação de digitação ao array de ações
                actions.push({
                    actionType: 'type',
                    selector: selectorInfo.selector,
                    useContains: selectorInfo.useContains,
                    containsText: selectorInfo.containsText,
                    value: step.value
                });
                break;

            case 'clear':
                // Adiciona ação de limpar campo ao array de ações
                actions.push({
                    actionType: 'clear',
                    selector: selectorInfo.selector,
                    useContains: selectorInfo.useContains,
                    containsText: selectorInfo.containsText
                });
                break;

            case 'assertVisible':
                // Adiciona verificação de visibilidade
                actions.push({
                    actionType: 'assert',
                    selector: selectorInfo.selector,
                    useContains: selectorInfo.useContains,
                    containsText: selectorInfo.containsText,
                    assertType: 'be.visible',
                    expectedValue: ''
                });
                break;

            case 'assertExists':
                // Adiciona verificação de existência
                actions.push({
                    actionType: 'assert',
                    selector: selectorInfo.selector,
                    useContains: selectorInfo.useContains,
                    containsText: selectorInfo.containsText,
                    assertType: 'exist',
                    expectedValue: ''
                });
                break;

            case 'assertNotExists':
                // Adiciona verificação de não existência
                actions.push({
                    actionType: 'assert',
                    selector: selectorInfo.selector,
                    useContains: selectorInfo.useContains,
                    containsText: selectorInfo.containsText,
                    assertType: 'not.exist',
                    expectedValue: ''
                });
                break;

            case 'assertDisabled':
                // Para botões específicos, prioriza cy.contains() se for um elemento interativo
                const isButtonElementDisabled = ['BUTTON', 'INPUT', 'A'].includes(element.tagName) || 
                                               element.getAttribute('role') === 'button' ||
                                               element.onclick !== null;
                
                actions.push({
                    actionType: 'assert',
                    selector: isButtonElementDisabled && element.textContent?.trim() ? '' : selectorInfo.selector,
                    useContains: isButtonElementDisabled && element.textContent?.trim() ? true : selectorInfo.useContains,
                    containsText: isButtonElementDisabled && element.textContent?.trim() ? element.textContent.trim() : selectorInfo.containsText,
                    assertType: 'be.disabled',
                    expectedValue: ''
                });
                break;

            case 'assertEnabled':
                // Para botões específicos, prioriza cy.contains() se for um elemento interativo
                const isButtonElement = ['BUTTON', 'INPUT', 'A'].includes(element.tagName) || 
                                      element.getAttribute('role') === 'button' ||
                                      element.onclick !== null;
                
                actions.push({
                    actionType: 'assert',
                    selector: isButtonElement && element.textContent?.trim() ? '' : selectorInfo.selector,
                    useContains: isButtonElement && element.textContent?.trim() ? true : selectorInfo.useContains,
                    containsText: isButtonElement && element.textContent?.trim() ? element.textContent.trim() : selectorInfo.containsText,
                    assertType: 'be.enabled',
                    expectedValue: ''
                });
                break;

            case 'assertText':
                // Para verificações de texto, se não foi especificado um valor, usa o próprio texto do elemento
                const textValue = step.value || (element.textContent?.trim() || step.target);
                
                // Para textos longos (mais de 20 caracteres), sempre usa cy.contains()
                const isLongText = step.target.length > 20;
                
                actions.push({
                    actionType: 'assert',
                    selector: isLongText ? '' : selectorInfo.selector,
                    useContains: isLongText ? true : selectorInfo.useContains,
                    containsText: isLongText ? step.target : selectorInfo.containsText,
                    assertType: step.value ? 'contain.text' : 'be.visible',
                    expectedValue: step.value || ''
                });
                break;

            case 'assertExactText':
                // Adiciona verificação de texto exato
                actions.push({
                    actionType: 'assert',
                    selector: selectorInfo.selector,
                    useContains: selectorInfo.useContains,
                    containsText: selectorInfo.containsText,
                    assertType: 'have.text',
                    expectedValue: step.value || step.target
                });
                break;

            case 'assertValue':
                // Adiciona verificação de valor
                actions.push({
                    actionType: 'assert',
                    selector: selectorInfo.selector,
                    useContains: selectorInfo.useContains,
                    containsText: selectorInfo.containsText,
                    assertType: 'have.value',
                    expectedValue: step.value || ''
                });
                break;

            default:
                updateStatus(`⚠️ Ação "${step.action}" não reconhecida.`, 'orange');
                console.log(`[CyRecord Debug] Ação não reconhecida: ${step.action}`);
                return;
        }
        
        // Atualiza a interface após adicionar a ação
        updateOutput();
    }

    function findElementByText(text) {
        const normalizedText = text.toLowerCase().trim();
        console.log(`[CyRecord Debug] Procurando elemento com texto: "${text}" (normalizado: "${normalizedText}")`);
        
        // Função auxiliar para excluir elementos da própria extensão
        const isExtensionElement = (element) => {
            if (!element) return false;
            // Verifica se o elemento está dentro do painel da extensão
            const extensionPanel = document.getElementById('cypress-recorder-panel');
            const assertionMenu = document.getElementById('cypress-assertion-menu');
            const alternativesModal = document.getElementById('selector-alternatives-modal');
            
            return (extensionPanel && extensionPanel.contains(element)) ||
                   (assertionMenu && assertionMenu.contains(element)) ||
                   (alternativesModal && alternativesModal.contains(element)) ||
                   element.closest('#cypress-recorder-panel') ||
                   element.closest('#cypress-assertion-menu') ||
                   element.closest('#selector-alternatives-modal');
        };
        
        // Verifica se é visível
        const isVisible = (element) => {
            if (!element) return false;
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        };
        
        // Mapeamento de termos comuns para tipos de campo e botões
        const fieldMappings = {
            'nome': ['nome', 'name', 'first name', 'nome completo', 'fullname'],
            'celular': ['celular', 'telefone', 'phone', 'mobile', 'cel', 'fone'],
            'cep': ['cep', 'código postal', 'postal code', 'zip'],
            'numero': ['número', 'numero', 'number', 'num', 'residencia', 'residência'],
            'endereco': ['endereço', 'endereco', 'address', 'rua'],
            'email': ['email', 'e-mail', 'mail'],
            'senha': ['senha', 'password', 'pass'],
            'continuar': ['continuar', 'prosseguir', 'próximo', 'avançar', 'seguir'],
            'voltar': ['voltar', 'anterior', 'retornar'],
            'cancelar': ['cancelar', 'sair', 'fechar'],
            'confirmar': ['confirmar', 'ok', 'sim', 'aceitar'],
            'login': ['login', 'entrar', 'acessar', 'sign in'],
            'cadastrar': ['cadastrar', 'registrar', 'criar conta', 'sign up'],
            'bem-vindo': ['bem-vindo', 'bemvindo', 'welcome', 'boas-vindas'],
            'erro': ['erro', 'error', 'falha', 'inválido'],
            'sucesso': ['sucesso', 'success', 'concluído', 'finalizado'],
            'total': ['total', 'valor total', 'preço', 'price', 'valor', 'value', 'custo'],
            'oferta': ['oferta', 'promoção', 'promocao', 'desconto', 'mega', 'plano'],
            'valor': ['valor', 'preço', 'price', 'total', 'custo', 'r$']
        };

        // 1. Busca exata por texto em botões e elementos clicáveis
        let element = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a, [role="button"]'))
            .filter(el => !isExtensionElement(el) && isVisible(el))
            .find(el => el.textContent?.trim().toLowerCase() === normalizedText || 
                       el.value?.toLowerCase() === normalizedText ||
                       el.getAttribute('aria-label')?.toLowerCase() === normalizedText);
        if (element) return element;

        // 2. Busca por texto que contém a palavra em elementos interativos
        element = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a, [role="button"], div[onclick], span[onclick]'))
            .filter(el => !isExtensionElement(el) && isVisible(el))
            .find(el => el.textContent?.trim().toLowerCase().includes(normalizedText) || 
                       el.value?.toLowerCase().includes(normalizedText) ||
                       el.getAttribute('aria-label')?.toLowerCase().includes(normalizedText));
        if (element) return element;

        // 3. Busca por mapeamentos conhecidos em campos de input
        for (const [key, variations] of Object.entries(fieldMappings)) {
            for (const variation of variations) {
                if (normalizedText.includes(variation)) {
                    element = document.querySelector(`input[id*="${variation}" i], textarea[id*="${variation}" i], select[id*="${variation}" i]`);
                    if (element && !isExtensionElement(element) && isVisible(element)) return element;
                }
            }
        }

        // 4. Busca por placeholder ou name attribute
        for (const [key, variations] of Object.entries(fieldMappings)) {
            for (const variation of variations) {
                if (normalizedText.includes(variation)) {
                    element = document.querySelector(`input[placeholder*="${variation}" i], input[name*="${variation}" i], textarea[placeholder*="${variation}" i], textarea[name*="${variation}" i]`);
                    if (element && !isExtensionElement(element) && isVisible(element)) return element;
                }
            }
        }

        // 5. Busca por placeholder/name direto com o texto fornecido
        element = document.querySelector(`input[placeholder*="${normalizedText}" i], input[name*="${normalizedText}" i], textarea[placeholder*="${normalizedText}" i], textarea[name*="${normalizedText}" i]`);
        if (element && !isExtensionElement(element) && isVisible(element)) return element;

        // 6. Busca por ID direto
        element = document.querySelector(`input[id*="${normalizedText}" i], textarea[id*="${normalizedText}" i], select[id*="${normalizedText}" i], button[id*="${normalizedText}" i]`);
        if (element && !isExtensionElement(element) && isVisible(element)) return element;

        // 7. Busca por labels associados
        const labels = Array.from(document.querySelectorAll('label')).filter(label => !isExtensionElement(label) && isVisible(label));
        for (const label of labels) {
            const labelText = label.textContent.trim().toLowerCase();
            if (labelText.includes(normalizedText) || 
                Object.values(fieldMappings).flat().some(term => labelText.includes(term) && normalizedText.includes(term))) {
                
                // Procura input associado por 'for' ou dentro do label
                if (label.getAttribute('for')) {
                    element = document.getElementById(label.getAttribute('for'));
                    if (element && !isExtensionElement(element) && isVisible(element)) return element;
                }
                element = label.querySelector('input, textarea, select, button');
                if (element && !isExtensionElement(element) && isVisible(element)) return element;
            }
        }

        // 8. Busca por texto em elementos com texto visível (para verificações)
        const textElements = Array.from(document.querySelectorAll('div, span, p, h1, h2, h3, h4, h5, h6, td, th, li, strong, em, b, i, section, article'))
            .filter(el => !isExtensionElement(el) && isVisible(el) && el.textContent?.trim());
            
        // Busca por texto exato primeiro (prioridade alta)
        element = textElements.find(el => {
            const elementText = el.textContent.trim();
            return elementText === text; // Busca exata com case-sensitive primeiro
        });
        if (element) return element;
        
        // Busca por texto que contém a frase completa (case-insensitive)
        element = textElements.find(el => {
            const elementText = el.textContent.trim().toLowerCase();
            return elementText.includes(normalizedText) && elementText.length < 500; // Evita elementos muito grandes
        });
        if (element) return element;
        
        // Busca específica para valores monetários (R$, $, etc.)
        if (normalizedText.includes('r$') || normalizedText.includes('$') || 
            normalizedText.includes('total') || normalizedText.includes('valor') || 
            normalizedText.includes('preço') || normalizedText.includes('price')) {
            
            // Primeiro tenta encontrar elemento que contenha especificamente o valor
            if (normalizedText.includes('r$') || normalizedText.includes('$')) {
                element = textElements.find(el => {
                    const elementText = el.textContent.trim().toLowerCase();
                    return elementText.includes('r$') || elementText.includes('$');
                });
                if (element) return element;
            }
            
            // Depois busca por elementos com classes/ids que indiquem valor/preço/total
            element = document.querySelector('[class*="value"], [class*="price"], [class*="total"], [class*="valor"], [class*="preco"], [id*="value"], [id*="price"], [id*="total"], [id*="valor"], [id*="preco"]');
            if (element && !isExtensionElement(element) && isVisible(element)) return element;
        }
        
        // Busca por elementos que contenham palavras-chave importantes
        const keywordSearch = textElements.find(el => {
            const elementText = el.textContent.trim().toLowerCase();
            // Para termos conhecidos do mapeamento
            return Object.values(fieldMappings).flat().some(term => 
                elementText.includes(term) && normalizedText.includes(term)
            );
        });
        if (keywordSearch) return keywordSearch;

        // 9. Busca por inputs próximos a textos que contenham a palavra
        const allElements = Array.from(document.querySelectorAll('*:not(script):not(style)'))
            .filter(el => !isExtensionElement(el) && isVisible(el));
            
        for (const el of allElements) {
            if (el.textContent && el.textContent.trim().toLowerCase().includes(normalizedText)) {
                // Procura input próximo (irmão ou filho)
                let nearbyInput = el.querySelector('input, textarea, select, button');
                if (nearbyInput && !isExtensionElement(nearbyInput) && isVisible(nearbyInput)) return nearbyInput;
                
                nearbyInput = el.nextElementSibling;
                if (nearbyInput && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(nearbyInput.tagName) && 
                    !isExtensionElement(nearbyInput) && isVisible(nearbyInput)) {
                    return nearbyInput;
                }
                
                // Se o próprio elemento é um input/button/elemento interativo
                if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(el.tagName)) {
                    return el;
                }
            }
        }

        // 10. Fallback: busca qualquer elemento visível que contenha o texto
        return allElements.find(el => el.textContent && el.textContent.trim().toLowerCase().includes(normalizedText));
    }

    // --- FIM DA LÓGICA ---

    // ====== NOVOS CAMPOS PARA CYPRESS ======
    const customFieldsDiv = document.createElement('div');
    customFieldsDiv.style.display = 'flex';
    customFieldsDiv.style.flexDirection = 'column';
    customFieldsDiv.style.gap = '8px';
    customFieldsDiv.style.padding = '18px 18px 0 18px';

    // Campo Nome da Funcionalidade
    const funcionalidadeLabel = document.createElement('label');
    funcionalidadeLabel.textContent = 'Nome da funcionalidade:';
    funcionalidadeLabel.style.fontWeight = 'bold';
    funcionalidadeLabel.style.color = blue;
    funcionalidadeLabel.style.fontSize = '13px';
    funcionalidadeLabel.style.fontFamily = "'Roboto', Arial, sans-serif";
    customFieldsDiv.appendChild(funcionalidadeLabel);

    const funcionalidadeInput = document.createElement('input');
    funcionalidadeInput.type = 'text';
    funcionalidadeInput.placeholder = 'Ex: Login, Cadastro, Carrinho...';
    funcionalidadeInput.style.width = '100%';
    funcionalidadeInput.style.padding = '8px 10px';
    funcionalidadeInput.style.border = `1px solid ${blue}`;
    funcionalidadeInput.style.borderRadius = '4px';
    funcionalidadeInput.style.fontSize = '13px';
    funcionalidadeInput.style.fontFamily = "'Roboto', Arial, sans-serif";
    funcionalidadeInput.style.boxSizing = 'border-box';
    customFieldsDiv.appendChild(funcionalidadeInput);

    // Criação dos elementos de mensagem de erro para cada campo obrigatório
    const funcionalidadeError = document.createElement('div');
    funcionalidadeError.textContent = 'campo obrigatório';
    funcionalidadeError.style.color = 'red';
    funcionalidadeError.style.fontSize = '12px';
    funcionalidadeError.style.display = 'none';
    customFieldsDiv.appendChild(funcionalidadeError);

    // Campo Nome do Cenário
    const cenarioLabel = document.createElement('label');
    cenarioLabel.textContent = 'Nome do cenário:';
    cenarioLabel.style.fontWeight = 'bold';
    cenarioLabel.style.color = blue;
    cenarioLabel.style.fontSize = '13px';
    cenarioLabel.style.fontFamily = "'Roboto', Arial, sans-serif";
    customFieldsDiv.appendChild(cenarioLabel);

    const cenarioInput = document.createElement('input');
    cenarioInput.type = 'text';
    cenarioInput.placeholder = 'Ex: Usuário faz login com sucesso';
    cenarioInput.style.width = '100%';
    cenarioInput.style.padding = '8px 10px';
    cenarioInput.style.border = `1px solid ${blue}`;
    cenarioInput.style.borderRadius = '4px';
    cenarioInput.style.fontSize = '13px';
    cenarioInput.style.fontFamily = "'Roboto', Arial, sans-serif";
    cenarioInput.style.boxSizing = 'border-box';
    customFieldsDiv.appendChild(cenarioInput);

    // Criação dos elementos de mensagem de erro para cada campo obrigatório
    const cenarioError = document.createElement('div');
    cenarioError.textContent = 'campo obrigatório';
    cenarioError.style.color = 'red';
    cenarioError.style.fontSize = '12px';
    cenarioError.style.display = 'none';
    customFieldsDiv.appendChild(cenarioError);

    // Campo URL
    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'URL:';
    urlLabel.style.fontWeight = 'bold';
    urlLabel.style.color = blue;
    urlLabel.style.fontSize = '13px';
    urlLabel.style.fontFamily = "'Roboto', Arial, sans-serif";
    customFieldsDiv.appendChild(urlLabel);

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Ex: https://meusite.com/login';
    urlInput.style.width = '100%';
    urlInput.style.padding = '8px 10px';
    urlInput.style.border = `1px solid ${blue}`;
    urlInput.style.borderRadius = '4px';
    urlInput.style.fontSize = '13px';
    urlInput.style.fontFamily = "'Roboto', Arial, sans-serif";
    urlInput.style.boxSizing = 'border-box';
    customFieldsDiv.appendChild(urlInput);

    // Criação dos elementos de mensagem de erro para cada campo obrigatório
    const urlError = document.createElement('div');
    urlError.textContent = 'campo obrigatório';
    urlError.style.color = 'red';
    urlError.style.fontSize = '12px';
    urlError.style.display = 'none';
    customFieldsDiv.appendChild(urlError);

    // Adiciona os campos personalizados ao painel, logo antes da área de exportação de código
    panel.appendChild(customFieldsDiv);

    // ====== FIM DOS NOVOS CAMPOS ======

    // ...
    // Remover a criação da seção de ações realizadas (stepsDiv e seus filhos)
    // ...
    // (Remover todo o bloco que cria stepsDiv, stepsTitle, assertionTip, resizeTip, stepsList e panel.appendChild(stepsDiv))
    // ...
    // O restante do código permanece igual

    // Área de exportação de código
    const exportDiv = document.createElement('div');
    exportDiv.style.background = '#fff';
    exportDiv.style.padding = '12px 18px 18px 18px';
    exportDiv.style.borderTop = `2px solid ${rose}`;
    exportDiv.style.display = 'flex';
    exportDiv.style.flexDirection = 'column';
    exportDiv.style.gap = '8px';
  
    const exportLabel = document.createElement('div');
    exportLabel.textContent = 'Código Cypress gerado';
    exportLabel.style.fontWeight = 'bold';
    exportLabel.style.color = blue;
    exportLabel.style.fontFamily = "'Roboto', Arial, sans-serif";
    exportDiv.appendChild(exportLabel);
  
    const textarea = document.createElement('textarea');
    textarea.readOnly = true;
    textarea.style.width = '100%';
    textarea.style.height = '160px';
    textarea.style.background = lightGray;
    textarea.style.color = blue;
    textarea.style.border = `1px solid ${blue}`;
    textarea.style.borderRadius = '5px';
    textarea.style.padding = '8px';
    textarea.style.fontFamily = "'Roboto', Arial, sans-serif";
    textarea.style.fontSize = '13px';
    textarea.style.resize = 'none';
    exportDiv.appendChild(textarea);
  
    // Campo de nome do arquivo
    const filenameDiv = document.createElement('div');
    filenameDiv.style.display = 'flex';
    filenameDiv.style.flexDirection = 'column';
    filenameDiv.style.gap = '4px';
    filenameDiv.style.marginTop = '8px';

    const filenameLabel = document.createElement('label');
    filenameLabel.textContent = 'Nome do arquivo:';
    filenameLabel.style.fontWeight = 'bold';
    filenameLabel.style.color = blue;
    filenameLabel.style.fontSize = '13px';
    filenameLabel.style.fontFamily = "'Roboto', Arial, sans-serif";
    filenameDiv.appendChild(filenameLabel);

    const filenameInput = document.createElement('input');
    filenameInput.type = 'text';
    filenameInput.placeholder = 'Digite o nome do arquivo (ex: login-test)';
    filenameInput.style.width = '100%';
    filenameInput.style.padding = '8px 10px';
    filenameInput.style.border = `1px solid ${blue}`;
    filenameInput.style.borderRadius = '4px';
    filenameInput.style.fontSize = '13px';
    filenameInput.style.fontFamily = "'Roboto', Arial, sans-serif";
    filenameInput.style.boxSizing = 'border-box';
    
    // Listener para pressionar Enter no campo de nome do arquivo
    filenameInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !btnDownload.disabled) {
        downloadCode();
      }
    });
    
    filenameDiv.appendChild(filenameInput);

    const filenameHint = document.createElement('small');
    filenameHint.textContent = 'Quando exportar código, será gerado um arquivo .js com o nome informado';
    filenameHint.style.color = '#666';
    filenameHint.style.fontSize = '11px';
    filenameHint.style.fontStyle = 'italic';
    filenameDiv.appendChild(filenameHint);

    exportDiv.appendChild(filenameDiv);

    const btnDownload = document.createElement('button');
    btnDownload.textContent = 'Exportar Código Cypress';
    btnDownload.style.background = blue;
    btnDownload.style.color = '#fff';
    btnDownload.style.fontWeight = 'bold';
    btnDownload.style.fontSize = '15px';
    btnDownload.style.border = 'none';
    btnDownload.style.borderRadius = '6px';
    btnDownload.style.padding = '10px 24px';
    btnDownload.style.cursor = 'pointer';
    btnDownload.style.marginTop = '8px';
    btnDownload.style.fontFamily = "'Roboto', Arial, sans-serif";
    btnDownload.disabled = true;
    exportDiv.appendChild(btnDownload);
    panel.appendChild(exportDiv);
    
    // Indicador de redimensionamento no canto inferior direito
    const resizeIndicator = document.createElement('div');
    resizeIndicator.style.position = 'absolute';
    resizeIndicator.style.bottom = '2px';
    resizeIndicator.style.right = '2px';
    resizeIndicator.style.width = '12px';
    resizeIndicator.style.height = '12px';
    resizeIndicator.style.background = `linear-gradient(
      -45deg, 
      transparent 0%, transparent 30%, 
      ${blue} 30%, ${blue} 40%, 
      transparent 40%, transparent 60%, 
      ${blue} 60%, ${blue} 70%, 
      transparent 70%
    )`;
    resizeIndicator.style.cursor = 'se-resize';
    resizeIndicator.style.opacity = '0.6';
    resizeIndicator.style.transition = 'opacity 0.2s';
    resizeIndicator.className = 'resize-handle resize-bottom-right';
    resizeIndicator.addEventListener('mouseenter', () => {
      resizeIndicator.style.opacity = '1';
    });
    resizeIndicator.addEventListener('mouseleave', () => {
      resizeIndicator.style.opacity = '0.6';
    });
    panel.appendChild(resizeIndicator);
  
    // Cria handles de redimensionamento
    const resizeHandles = [
      { position: 'top', cursor: 'n-resize' },
      { position: 'right', cursor: 'e-resize' },
      { position: 'bottom', cursor: 's-resize' },
      { position: 'left', cursor: 'w-resize' },
      { position: 'top-left', cursor: 'nw-resize' },
      { position: 'top-right', cursor: 'ne-resize' },
      { position: 'bottom-left', cursor: 'sw-resize' },
      { position: 'bottom-right', cursor: 'se-resize' }
    ];
    
    resizeHandles.forEach(handle => {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = `resize-handle resize-${handle.position}`;
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.background = 'transparent';
      resizeHandle.style.cursor = handle.cursor;
      resizeHandle.style.zIndex = '1000000';
      resizeHandle.style.transition = 'background-color 0.2s';
      
      // Define posição e tamanho baseado no tipo de handle
      if (handle.position.includes('top')) {
        resizeHandle.style.top = '-5px';
        resizeHandle.style.height = '10px';
      }
      if (handle.position.includes('bottom')) {
        resizeHandle.style.bottom = '-5px';
        resizeHandle.style.height = '10px';
      }
      if (handle.position.includes('left')) {
        resizeHandle.style.left = '-5px';
        resizeHandle.style.width = '10px';
      }
      if (handle.position.includes('right')) {
        resizeHandle.style.right = '-5px';
        resizeHandle.style.width = '10px';
      }
      
      // Define dimensões para bordas simples
      if (handle.position === 'top' || handle.position === 'bottom') {
        resizeHandle.style.left = '10px';
        resizeHandle.style.right = '10px';
      }
      if (handle.position === 'left' || handle.position === 'right') {
        resizeHandle.style.top = '10px';
        resizeHandle.style.bottom = '10px';
      }
      
      // Define dimensões para cantos
      if (handle.position.includes('-')) {
        resizeHandle.style.width = '20px';
        resizeHandle.style.height = '20px';
      }
      
      // Adiciona feedback visual ao hover
      resizeHandle.addEventListener('mouseenter', () => {
        resizeHandle.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
      });
      
      resizeHandle.addEventListener('mouseleave', () => {
        resizeHandle.style.backgroundColor = 'transparent';
      });
      
      panel.appendChild(resizeHandle);
    });
    
    // Adiciona o painel ao corpo da página
    document.body.appendChild(panel);
  
    // Inicializa posição para arrastar corretamente
    panel.style.left = '';
    panel.style.top = '';
    panel.style.right = '10px';
    panel.style.bottom = '10px';
    panel.style.width = '600px';
    panel.style.height = '800px';
  
    // Variáveis para controle de redimensionamento e arrasto
    let isDragging = false, isResizing = false, resizeDirection = '';
    let offsetX = 0, offsetY = 0;
    let originalSize = { width: 600, height: 800, left: null, top: null, right: '10px', bottom: '10px' };
    let isMaximized = false;
    
    // Torna o painel arrastável pelo header
    header.style.cursor = 'move';
    header.addEventListener('mousedown', function(e) {
      // Só permite arrastar se não estiver clicando nos botões
      if (e.target === btnClose || e.target === btnToggleSize) return;
      
      isDragging = true;
      // Sempre converte para left/top ao arrastar
      const rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.right = '';
      panel.style.bottom = '';
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.body.style.userSelect = 'none';
    });
    
    // Duplo clique no header para maximizar/restaurar
    header.addEventListener('dblclick', function(e) {
      // Só funciona se não clicar nos botões
      if (e.target === btnClose || e.target === btnToggleSize) return;
      toggleMaximize();
    });
    
    // Funcionalidade de redimensionamento
    panel.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('resize-handle')) {
        isResizing = true;
        resizeDirection = e.target.className.split(' ')[1].replace('resize-', '');
        
        // Converte para posicionamento absoluto se necessário
        const rect = panel.getBoundingClientRect();
        if (panel.style.right || panel.style.bottom) {
          panel.style.left = rect.left + 'px';
          panel.style.top = rect.top + 'px';
          panel.style.right = '';
          panel.style.bottom = '';
        }
        
        panel.style.width = rect.width + 'px';
        panel.style.height = rect.height + 'px';
        
        document.body.style.userSelect = 'none';
        e.preventDefault();
        e.stopPropagation();
      }
    });
    
    // Eventos de movimento e soltura para arrastar e redimensionar
    document.addEventListener('mousemove', function(e) {
      if (isDragging && !isMaximized) {
        // Limita o painel para não sair da tela
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;
        newLeft = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, newTop));
        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
      } else if (isResizing && !isMaximized) {
        const rect = panel.getBoundingClientRect();
        const minWidth = parseInt(panel.style.minWidth) || 300;
        const minHeight = parseInt(panel.style.minHeight) || 400;
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        
        let newWidth = rect.width;
        let newHeight = rect.height;
        let newLeft = rect.left;
        let newTop = rect.top;
        
        // Calcula novas dimensões baseado na direção do resize
        if (resizeDirection.includes('right')) {
          newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left));
        }
        if (resizeDirection.includes('left')) {
          const newLeftPos = Math.max(0, e.clientX);
          newWidth = Math.max(minWidth, rect.right - newLeftPos);
          if (newWidth > minWidth) newLeft = newLeftPos;
        }
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
        }
        if (resizeDirection.includes('top')) {
          const newTopPos = Math.max(0, e.clientY);
          newHeight = Math.max(minHeight, rect.bottom - newTopPos);
          if (newHeight > minHeight) newTop = newTopPos;
        }
        
        // Aplica as novas dimensões
        panel.style.width = newWidth + 'px';
        panel.style.height = newHeight + 'px';
        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
      }
    });
    
    document.addEventListener('mouseup', function() {
      isDragging = false;
      isResizing = false;
      resizeDirection = '';
      document.body.style.userSelect = '';
    });
  
    // Variáveis para controlar o estado da gravação
    let actions = []; // Array para armazenar as ações gravadas
    let isRecording = false; // Flag para controlar se está gravando
  
    // Variáveis para controlar inputs consecutivos
    let inputTimeout; // Timeout para agrupar inputs
    let lastInputSelector = null; // Último seletor de input usado
  
    // --- DECLARAÇÕES DE VARIÁVEIS E FUNÇÕES RESTAURADAS ---
    let assertMenu = null;
    let closeMenuTimeout = null;

    // Função que extrai as características de um elemento para a IA.
    function extractElementFeaturesForAI(element) {
      let depth = 0;
      let parent = element.parentElement;
      while (parent) {
          depth++;
          parent = parent.parentElement;
      }
      return {
          tagName: element.tagName.toLowerCase(),
          id: element.id || '',
          className: element.className || '',
          name: element.getAttribute('name') || '',
          dataCy: element.getAttribute('data-cy') || '',
          text: (element.textContent || '').trim().substring(0, 100),
          depth: depth,
          childrenCount: element.children.length,
          hasParentId: !!(element.parentElement && element.parentElement.id),
      };
    }

    function getSelectorFromStrategy(element, strategy) {
      switch (strategy) {
        case 'id':
          return element.id ? `#${element.id}` : null;
        case 'data-cy':
          return element.hasAttribute('data-cy') ? `[data-cy="${element.getAttribute('data-cy')}"]` : null;
        case 'name':
          return element.hasAttribute('name') ? `[name="${element.getAttribute('name')}"]` : null;
        case 'class':
          const specificClasses = (element.className || '').trim().split(/\s+/).filter(c => c && c.length > 2);
          return specificClasses.length > 0 ? `.${specificClasses.join('.')}` : null;
        case 'tag_and_text':
          const text = (element.textContent || '').trim();
          return text ? `${element.tagName.toLowerCase()}:contains("${text}")` : null;
        case 'full_path':
          return getFullPathSelector(element);
        default:
          return null;
      }
    }

    function generateCypressCode(actions) {
      // Pré-processamento para remover ações redundantes
      const filtered = [];
      for (let i = 0; i < actions.length; i++) {
        const curr = actions[i];
        const next = actions[i + 1];
        // 1. Remove clique seguido de type('on') no mesmo elemento
        if (
          (curr.actionType === 'click' || curr.actionType === 'manualClick') &&
          next &&
          (next.actionType === 'type' || next.actionType === 'input') &&
          curr.selector === next.selector &&
          curr.useContains === next.useContains &&
          curr.containsText === next.containsText
        ) {
          continue; // Pula o clique
        }
        // 2. Remove clique seguido de qualquer assert no mesmo elemento/texto
        if (
          (curr.actionType === 'click' || curr.actionType === 'manualClick') &&
          next &&
          next.actionType === 'assert' &&
          curr.useContains === next.useContains &&
          curr.selector === next.selector &&
          curr.containsText === next.containsText
        ) {
          continue; // Pula o clique
        }
        // 3. Remove comandos duplicados consecutivos
        const prev = filtered[filtered.length - 1];
        if (
          prev &&
          prev.actionType === curr.actionType &&
          prev.selector === curr.selector &&
          prev.useContains === curr.useContains &&
          prev.containsText === curr.containsText &&
          ((curr.actionType === 'type' || curr.actionType === 'input') ? prev.value === curr.value : true) &&
          ((curr.actionType === 'assert') ? prev.assertType === curr.assertType && prev.expectedValue === curr.expectedValue : true)
        ) {
          continue; // Pula duplicado
        }
        filtered.push(curr);
      }
      // Geração do código Cypress (igual ao original)
      return filtered.map(action => {
        if (action.actionType === 'click') {
          if (action.useContains) {
            return `cy.contains('${action.containsText.replace(/'/g, "\\'")}').click();`;
          } else {
            return `cy.get('${action.selector}').click();`;
          }
        }
        else if (action.actionType === 'input') {
          if (action.useContains) {
            return `cy.contains('${action.containsText.replace(/'/g, "\\'")}').type('${action.value.replace(/'/g, "\\'")}');`;
          } else {
            return `cy.get('${action.selector}').type('${action.value.replace(/'/g, "\\'")}');`;
          }
        }
        else if (action.actionType === 'type') {
          const selector = action.useContains ?
            `cy.contains('${action.containsText.replace(/'/g, "\\'")}')` :
            `cy.get('${action.selector}')`;
          return `${selector}.type('${action.value.replace(/'/g, "\\'")}');`;
        }
        else if (action.actionType === 'clear') {
          const selector = action.useContains ?
            `cy.contains('${action.containsText.replace(/'/g, "\\'")}')` :
            `cy.get('${action.selector}')`;
          return `${selector}.clear();`;
        }
        else if (action.actionType === 'manualClick') {
          const selector = action.useContains ?
            `cy.contains('${action.containsText.replace(/'/g, "\\'")}')` :
            `cy.get('${action.selector}')`;
          return `${selector}.click();`;
        }
        else if (action.actionType === 'assert') {
          const selector = action.useContains ?
            `cy.contains('${action.containsText.replace(/'/g, "\\'")}')` :
            `cy.get('${action.selector}')`;
          switch (action.assertType) {
            case 'be.visible':
              return `${selector}.should('be.visible');`;
            case 'have.text':
              return `${selector}.should('have.text', '${action.expectedValue.replace(/'/g, "\\'")}');`;
            case 'contain.text':
              return `${selector}.should('contain.text', '${action.expectedValue.replace(/'/g, "\\'")}');`;
            case 'have.class':
              return `${selector}.should('have.class', '${action.expectedValue.replace(/'/g, "\\'")}');`;
            case 'have.attr':
              return `${selector}.should('have.attr', '${action.attrName}', '${action.expectedValue.replace(/'/g, "\\'")}');`;
            case 'have.value':
              return `${selector}.should('have.value', '${action.expectedValue.replace(/'/g, "\\'")}');`;
            case 'exist':
              return `${selector}.should('exist');`;
            case 'not.exist':
              return `${selector}.should('not.exist');`;
            case 'be.disabled':
              return `${selector}.should('be.disabled');`;
            case 'be.enabled':
              return `${selector}.should('be.enabled');`;
            default:
              return `// Asserção não suportada: ${action.assertType}`;
          }
        }
      }).filter(Boolean).join('\n');
    }

    // --- FIM DA RESTAURAÇÃO ---

    // Função para gerar seletor específico para asserções
    function getSelectorForAssertion(element, returnAll = false) {
      const selectorCandidates = [];
      const testAttrs = ['data-cy', 'data-testid', 'data-test'];
      for (const attr of testAttrs) {
        if (element.hasAttribute(attr)) {
          selectorCandidates.push({ selector: `[${attr}="${element.getAttribute(attr)}"]`, useContains: false, score: 100, reason: `Atributo de teste '${attr}'` });
        }
      }
      if (element.id) {
        selectorCandidates.push({ selector: `#${element.id}`, useContains: false, score: 95, reason: 'ID' });
      }
      if (element.name) {
        selectorCandidates.push({ selector: `[name="${element.name}"]`, useContains: false, score: 85, reason: 'Atributo Name' });
      }
      const text = (element.textContent || '').trim();
      if (text && text.length < 50) {
        selectorCandidates.push({ selector: element.tagName.toLowerCase(), useContains: true, containsText: text, score: 60, reason: 'Tag com Texto' });
      }
      selectorCandidates.push({ selector: getFullPathSelector(element), useContains: false, score: 20, reason: 'Caminho Completo' });

      const validCandidates = selectorCandidates.filter(c => {
        if (c.useContains) return true;
        try { return document.querySelectorAll(c.selector).length === 1; } catch (e) { return false; }
      });

      if (returnAll) return validCandidates;
      return validCandidates[0] || selectorCandidates.pop();
    }
    
    // Função para gerar um seletor CSS único para um elemento, agora usando a IA
    async function getSelector(element) {
      if (!isAiReady) {
        console.warn("IA não pronta, usando seletor de fallback.");
        return { selector: getFullPathSelector(element), useContains: false, containsText: '' };
      }
      try {
        const features = extractElementFeaturesForAI(element);
        const strategy = await getSelectorFromAI(features);
        
        let selectorInfo = getSelectorForAssertion(element); // Pega o melhor seletor padrão

        // Se a estratégia da IA for válida, use-a.
        const aiSelector = getSelectorFromStrategy(element, strategy);
        if (aiSelector) {
            // Valida o seletor da IA
            let isValid = false;
            if (strategy === 'tag_and_text') {
                isValid = true; // Confia no cy.contains
            } else {
                try {
                   isValid = document.querySelectorAll(aiSelector).length === 1;
                } catch (e) { isValid = false; }
            }
            if(isValid) {
                 selectorInfo = {
                    selector: strategy === 'tag_and_text' ? element.tagName.toLowerCase() : aiSelector,
                    useContains: strategy === 'tag_and_text',
                    containsText: strategy === 'tag_and_text' ? (element.textContent || '').trim() : ''
                 }
            }
        }
        
        return selectorInfo;

      } catch (error) {
        console.error("Erro ao obter seletor da IA, usando fallback:", error);
        return getSelectorForAssertion(element);
      }
    }

    // Função para gerar o caminho completo de um seletor (garante unicidade)
    function getFullPathSelector(el) {
      if (!(el instanceof Element)) return;
      const path = [];
      let current = el;
      while (current && current.nodeType === Node.ELEMENT_NODE) {
        let selector = current.nodeName.toLowerCase();
        if (current.id) {
          selector = '#' + current.id;
          path.unshift(selector);
          break; // Para se encontrar um ID
        }
        
        const parent = current.parentNode;
        if (!parent || parent.nodeType !== Node.ELEMENT_NODE) {
          path.unshift(selector);
          break;
        }

        // Verifica irmãos com a mesma tag
        const siblings = Array.from(parent.children).filter(child => child.nodeName === current.nodeName);
        
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          selector += `:nth-of-type(${index})`;
        }
        
        path.unshift(selector);
        current = parent;
      }
      return path.join(' > ');
    }

    // Função para mostrar menu de asserções
    async function showAssertMenu(event, selectorInfoOverride = null) {
      event.preventDefault();
      event.stopPropagation();
      
      // Remove menu existente se houver
      if (assertMenu) {
        assertMenu.remove();
      }
      
      currentAssertElement = event.target;
      // AWAIT REMOVIDO AQUI, A FUNÇÃO AGORA É SÍNCRONA
      const selectorInfo = selectorInfoOverride || getSelectorForAssertion(currentAssertElement);
      
      console.log('🎯 Menu de asserção aberto para elemento:', {
        element: currentAssertElement,
        selectorInfo: selectorInfo
      });
      
      // Cria o menu de asserções
      assertMenu = document.createElement('div');
      assertMenu.id = 'cypress-assertion-menu';
      assertMenu.className = 'cypress-assertion-menu';
      assertMenu.style.position = 'fixed';
      assertMenu.style.background = '#fff';
      assertMenu.style.border = `2px solid ${blue}`;
      assertMenu.style.borderRadius = '8px';
      assertMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      assertMenu.style.zIndex = '1000001';
      assertMenu.style.padding = '8px';
      assertMenu.style.fontFamily = "'Roboto', Arial, sans-serif";
      assertMenu.style.fontSize = '13px';
      assertMenu.style.minWidth = '200px';
      
      // Posiciona o menu próximo ao cursor
      assertMenu.style.left = Math.min(event.clientX, window.innerWidth - 220) + 'px';
      assertMenu.style.top = Math.min(event.clientY, window.innerHeight - 300) + 'px';
      
      // Título do menu
      const title = document.createElement('div');
      title.textContent = '🎯 Ações e Asserções';
      title.style.fontWeight = 'bold';
      title.style.color = blue;
      title.style.marginBottom = '4px';
      title.style.padding = '4px 0';
      assertMenu.appendChild(title);
      
      // Mostra o elemento selecionado
      const elementInfo = document.createElement('div');
      elementInfo.style.fontSize = '11px';
      elementInfo.style.color = '#666';
      elementInfo.style.padding = '6px 8px';
      elementInfo.style.borderBottom = `1px solid #eee`;
      elementInfo.style.marginBottom = '8px';
      elementInfo.style.wordBreak = 'break-all';
      elementInfo.style.background = '#f8f9fa';
      elementInfo.style.borderRadius = '4px';
      
      // Determina a cor da qualidade do seletor
      let qualityColor = '#E53935'; // Vermelho (baixa qualidade)
      let qualityText = 'Baixa';
      if (selectorInfo.score >= 80) {
        qualityColor = '#4CAF50'; // Verde (alta qualidade)
        qualityText = 'Alta';
      } else if (selectorInfo.score >= 60) {
        qualityColor = '#FF9800'; // Laranja (média qualidade)
        qualityText = 'Média';
      }
      
      if (selectorInfo.useContains) {
        elementInfo.innerHTML = `
          <div style="font-weight: bold; color: ${blue};">🎯 Elemento Selecionado:</div>
          <div style="margin-top: 2px;">📝 Texto: "${selectorInfo.containsText}"</div>
          <div style="margin-top: 2px; font-style: italic;">Código: cy.contains('${selectorInfo.containsText}')</div>
          <div style="margin-top: 4px; padding: 2px 6px; background: ${qualityColor}; color: white; border-radius: 3px; display: inline-block; font-size: 10px;">
            🧠 Qualidade: ${qualityText} (${selectorInfo.score}/100)
          </div>
          <div style="margin-top: 2px; font-size: 10px; color: #888;">💡 ${selectorInfo.reason}</div>
        `;
      } else {
        elementInfo.innerHTML = `
          <div style="font-weight: bold; color: ${blue};">🎯 Elemento Selecionado:</div>
          <div style="margin-top: 2px;">🔍 Seletor: ${selectorInfo.selector}</div>
          <div style="margin-top: 2px; font-style: italic;">Código: cy.get('${selectorInfo.selector}')</div>
          <div style="margin-top: 4px; padding: 2px 6px; background: ${qualityColor}; color: white; border-radius: 3px; display: inline-block; font-size: 10px;">
            🧠 Qualidade: ${qualityText} (${selectorInfo.score}/100)
          </div>
          <div style="margin-top: 2px; font-size: 10px; color: #888;">💡 ${selectorInfo.reason}</div>
        `;
      }
      
      assertMenu.appendChild(elementInfo);
      
      // Botão para ver alternativas de seletores
      const alternativesBtn = document.createElement('div');
      alternativesBtn.innerHTML = '🔍 Ver alternativas de seletor';
      alternativesBtn.style.padding = '6px 12px';
      alternativesBtn.style.cursor = 'pointer';
      alternativesBtn.style.borderRadius = '4px';
      alternativesBtn.style.margin = '4px 0';
      alternativesBtn.style.transition = 'background 0.2s';
      alternativesBtn.style.fontSize = '12px';
      alternativesBtn.style.color = blue;
      alternativesBtn.style.border = `1px solid ${blue}`;
      alternativesBtn.style.textAlign = 'center';
      
      alternativesBtn.addEventListener('mouseenter', () => {
        alternativesBtn.style.background = '#f0f0f0';
      });
      
      alternativesBtn.addEventListener('mouseleave', () => {
        alternativesBtn.style.background = 'transparent';
      });
      
      alternativesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSelectorAlternatives(currentAssertElement, event);
      });
      
      assertMenu.appendChild(alternativesBtn);
      
      // Separador
      const separator = document.createElement('div');
      separator.textContent = '─────────────────────';
      separator.style.padding = '4px 0';
      separator.style.textAlign = 'center';
      separator.style.color = '#ccc';
      separator.style.fontSize = '10px';
      separator.style.cursor = 'default';
      separator.style.userSelect = 'none';
      assertMenu.appendChild(separator);
      
      // Opções de asserção
      const assertOptions = [
        // Ações
        { text: '⌨️ Digitar texto', type: 'type', needsValue: true, isAction: true },
        { text: '🖱️ Clicar no elemento', type: 'manualClick', isAction: true },
        { text: '🗑️ Limpar campo', type: 'clear', isAction: true },
        // Separador
        { text: '─────────────────────', type: 'separator' },
        // Opções básicas
        { text: '👁️ Deve estar visível', type: 'be.visible' },
        { text: '✅ Deve existir', type: 'exist' },
        { text: '❌ Não deve existir', type: 'not.exist' },
        { text: '🚫 Deve estar desabilitado', type: 'be.disabled' },
        { text: '✅ Deve estar habilitado', type: 'be.enabled' },
        // Separador
        { text: '─────────────────────', type: 'separator' },
        // Opções avançadas
        { text: '📝 Deve ter texto exato', type: 'have.text', needsValue: true },
        { text: '🔍 Deve conter texto', type: 'contain.text', needsValue: true },
        { text: '🔗 Deve ter valor', type: 'have.value', needsValue: true },
      ];
      
      assertOptions.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.textContent = option.text;
        
        if (option.type === 'separator') {
          // Estilo para separador
          optionDiv.style.padding = '4px 0';
          optionDiv.style.textAlign = 'center';
          optionDiv.style.color = '#ccc';
          optionDiv.style.fontSize = '10px';
          optionDiv.style.cursor = 'default';
          optionDiv.style.userSelect = 'none';
        } else {
          // Estilo para opções normais
          optionDiv.style.padding = '8px 12px';
          optionDiv.style.cursor = 'pointer';
          optionDiv.style.borderRadius = '4px';
          optionDiv.style.margin = '2px 0';
          optionDiv.style.transition = 'background 0.2s';
          
          optionDiv.addEventListener('mouseenter', () => {
            optionDiv.style.background = '#f0f0f0';
          });
          
          optionDiv.addEventListener('mouseleave', () => {
            optionDiv.style.background = 'transparent';
          });
          
          optionDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handleAssertionClick(option, selectorInfo);
          });
        }
        
        assertMenu.appendChild(optionDiv);
      });
      
      // Adiciona o menu ao corpo da página para medir suas dimensões
      assertMenu.style.visibility = 'hidden';
      document.body.appendChild(assertMenu);
      
      const menuWidth = assertMenu.offsetWidth;
      const menuHeight = assertMenu.offsetHeight;
      
      // Calcula a posição para garantir que o menu fique dentro da tela
      let left = event.clientX;
      if (left + menuWidth > window.innerWidth - 10) {
        left = window.innerWidth - menuWidth - 10;
      }
      
      let top = event.clientY;
      if (top + menuHeight > window.innerHeight - 10) {
        top = window.innerHeight - menuHeight - 10;
      }
      
      // Garante que não saia da tela pela esquerda ou topo
      left = Math.max(10, left);
      top = Math.max(10, top);

      // Aplica a posição calculada e torna o menu visível
      assertMenu.style.left = `${left}px`;
      assertMenu.style.top = `${top}px`;
      assertMenu.style.visibility = 'visible';
      
      // Remove o menu ao clicar fora
      if (closeMenuTimeout) {
        clearTimeout(closeMenuTimeout);
      }
      closeMenuTimeout = setTimeout(() => {
        document.addEventListener('click', () => closeAssertMenu(true), { once: true });
      }, 100);
    }
    
    // Função para fechar o menu de asserções
    function closeAssertMenu(clearElement = false) {
      if (closeMenuTimeout) {
        clearTimeout(closeMenuTimeout);
        closeMenuTimeout = null;
      }

      if (assertMenu) {
        assertMenu.remove();
        assertMenu = null;
        if (clearElement) {
          currentAssertElement = null;
        }
      }
    }
    
    // Função para mostrar alternativas de seletores
    function showSelectorAlternatives(element, originalEvent) {
      // Fecha o menu atual
      closeAssertMenu();
      
      // Gera todas as alternativas de seletores (AGORA FUNCIONA)
      const uniqueCandidates = getSelectorForAssertion(element, true);
      
      // Cria o modal de alternativas
      const modal = document.createElement('div');
      modal.id = 'selector-alternatives-modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.background = 'rgba(0,0,0,0.5)';
      modal.style.zIndex = '1000002';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      
      const modalContent = document.createElement('div');
      modalContent.style.background = '#fff';
      modalContent.style.borderRadius = '8px';
      modalContent.style.padding = '20px';
      modalContent.style.maxWidth = '600px';
      modalContent.style.maxHeight = '80vh';
      modalContent.style.overflowY = 'auto';
      modalContent.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
      
      // Título
      const title = document.createElement('h3');
      title.textContent = '🧠 Alternativas de Seletor';
      title.style.color = blue;
      title.style.marginBottom = '15px';
      title.style.fontFamily = "'Roboto', Arial, sans-serif";
      modalContent.appendChild(title);
      
      // Lista de alternativas
      uniqueCandidates.forEach((candidate, index) => {
        const candidateDiv = document.createElement('div');
        candidateDiv.style.border = '1px solid #ddd';
        candidateDiv.style.borderRadius = '6px';
        candidateDiv.style.padding = '12px';
        candidateDiv.style.marginBottom = '8px';
        candidateDiv.style.cursor = 'pointer';
        candidateDiv.style.transition = 'all 0.2s';
        
        // Cor baseada na pontuação
        let qualityColor = '#E53935';
        if (candidate.score >= 80) {
          qualityColor = '#4CAF50';
        } else if (candidate.score >= 60) {
          qualityColor = '#FF9800';
        }
        
        candidateDiv.style.borderLeft = `4px solid ${qualityColor}`;
        
        candidateDiv.addEventListener('mouseenter', () => {
          candidateDiv.style.background = '#f8f9fa';
        });
        
        candidateDiv.addEventListener('mouseleave', () => {
          candidateDiv.style.background = 'transparent';
        });
        
        candidateDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Atualiza o seletor atual e reabre o menu de asserções
          const chosenSelectorInfo = candidate;
          modal.remove();

          const newEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
            clientX: originalEvent.clientX,
            clientY: originalEvent.clientY,
            target: element
          };
          
          showAssertMenu(newEvent, chosenSelectorInfo);
        });
        
        // Conteúdo do candidato
        const selectorText = candidate.useContains 
          ? `cy.contains('${candidate.containsText}')`
          : `cy.get('${candidate.selector}')`;
        
        candidateDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <div style="font-weight: bold; font-family: monospace; font-size: 13px;">${selectorText}</div>
            <div style="padding: 2px 6px; background: ${qualityColor}; color: white; border-radius: 3px; font-size: 11px;">
              ${candidate.score}/100
            </div>
          </div>
          <div style="font-size: 12px; color: #666;">${candidate.reason}</div>
        `;
        
        modalContent.appendChild(candidateDiv);
      });
      
      // Botão fechar
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Fechar';
      closeBtn.style.marginTop = '15px';
      closeBtn.style.padding = '8px 16px';
      closeBtn.style.background = blue;
      closeBtn.style.color = '#fff';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '4px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontFamily = "'Roboto', Arial, sans-serif";
      
      closeBtn.addEventListener('click', () => {
        modal.remove();
      });
      
      modalContent.appendChild(closeBtn);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Fecha ao clicar fora
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
    
    // Função para lidar com clique nas opções de asserção e ações
    function handleAssertionClick(option, selectorInfo) {
      const targetElement = currentAssertElement; // Salva o elemento para o highlight

      // Fecha o menu para evitar conflitos
      closeAssertMenu();
      
      // Função para ações (type, click, clear)
      const performAction = (actionData) => {
        const finalAction = {
          actionType: option.type, // 'type', 'click', 'clear'
          selector: selectorInfo.selector,
          useContains: selectorInfo.useContains,
          containsText: selectorInfo.containsText,
          value: actionData.value || ''
        };
  
        console.log('➕ Adicionando ação:', finalAction);
          
        actions.push(finalAction);
        updateOutput();
        validateGeneratedCode();
        highlightElement(targetElement, option.type === 'type' ? 'texto será digitado!' : 'ação adicionada!');
      };
  
      // Função para asserções
      const performAssertion = (assertData) => {
        const finalAction = {
          actionType: 'assert',
          selector: selectorInfo.selector,
          useContains: selectorInfo.useContains,
          containsText: selectorInfo.containsText,
          assertType: option.type,
          attrName: assertData.attrName || null,
          expectedValue: assertData.expectedValue || ''
        };
  
        console.log('➕ Adicionando asserção:', finalAction);
          
        actions.push(finalAction);
        updateOutput();
        validateGeneratedCode();
        highlightElement(targetElement, 'asserção adicionada!');
              };
  
        // Verifica se é uma ação ao invés de asserção
        if (option.isAction) {
          if (option.type === 'type') {
            // Ação de digitar texto
            let defaultValue = '';
            if (targetElement.value) {
              defaultValue = targetElement.value;
            } else if (targetElement.placeholder) {
              defaultValue = targetElement.placeholder;
            }
            
            const textToType = prompt('Digite o texto que será inserido no campo:', defaultValue);
            if (textToType !== null) {
              performAction({ value: textToType });
            }
                     } else if (option.type === 'manualClick') {
             // Ação de clicar
             performAction({});
           } else if (option.type === 'clear') {
            // Ação de limpar campo
            performAction({});
          }
        } else if (option.needsAttr) {
          // Caso especial para atributos
          const attrName = prompt('Digite o nome do atributo (ex: id, href, data-test):');
          if (attrName !== null && attrName.trim()) {
            const attrValue = prompt(`Digite o valor esperado para o atributo "${attrName}":`, 
              targetElement.getAttribute(attrName) || '');
            if (attrValue !== null) {
              performAssertion({ attrName: attrName.trim(), expectedValue: attrValue });
            }
          }
        } else if (option.needsValue) {
          // Opções que precisam de um valor
          let defaultValue = '';
          if (option.type === 'have.text') {
            defaultValue = targetElement.textContent?.trim() || '';
          } else if (option.type === 'contain.text') {
            const fullText = targetElement.textContent?.trim() || '';
            defaultValue = fullText.length > 20 ? fullText.substring(0, 20) + '...' : fullText;
          } else if (option.type === 'have.class') {
            defaultValue = targetElement.className?.split(' ')[0] || '';
          } else if (option.type === 'have.value') {
            defaultValue = targetElement.value || targetElement.getAttribute('value') || '';
          }
            
          const value = prompt(`Digite o valor esperado para "${option.text}":`, defaultValue);
          if (value !== null) {
            performAssertion({ expectedValue: value });
          }
        } else {
          // Asserções simples que não precisam de valor (ex: 'be.visible')
          performAssertion({});
        }
    }
    
    // Função para atualizar a lista de passos
    function updateStepsList() {
      stepsList.innerHTML = '';
      if (actions.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma ação realizada.';
        li.style.color = blue;
        stepsList.appendChild(li);
        return;
      }
      actions.forEach((action, idx) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.marginBottom = '4px';
        let icon = '';
        let desc = '';
        if (action.actionType === 'click') {
          icon = `🖱️`;
          desc = action.useContains ? `Click (auto) em "${action.containsText}"` : `Click (auto) em ${action.selector}`;
        } else if (action.actionType === 'input') {
          icon = `⌨️`;
          desc = action.useContains ? `Input em "${action.containsText}"` : `Input em ${action.selector}`;
          desc += `: "${action.value}"`;
        } else if (action.actionType === 'type') {
          icon = `⌨️`;
          const target = action.useContains ? `"${action.containsText}"` : action.selector;
          desc = `Digite "${action.value}" em ${target}`;
        } else if (action.actionType === 'clear') {
          icon = `🗑️`;
          const target = action.useContains ? `"${action.containsText}"` : action.selector;
          desc = `Limpar campo ${target}`;
        } else if (action.actionType === 'manualClick') {
          icon = `🖱️`;
          const target = action.useContains ? `"${action.containsText}"` : action.selector;
          desc = `Click (manual) em ${target}`;
        } else if (action.actionType === 'assert') {
          icon = `🔍`;
          const target = action.useContains ? `"${action.containsText}"` : action.selector;
          desc = `Assert ${target}: ${action.assertType}`;
          if (action.attrName) {
            desc += ` [${action.attrName}]`;
          }
          if (action.expectedValue) {
            desc += ` = "${action.expectedValue}"`;
          }
        }
        li.innerHTML = `<span style="font-size:18px;margin-right:8px;color:${rose}">${icon}</span> <span style="color:${blue}">${desc}</span>`;
        stepsList.appendChild(li);
      });
    }
  
    // Função para atualizar o conteúdo da área de texto e lista de passos
    function updateOutput() {
      textarea.value = generateCypressCode(actions) || '// Nenhuma código gerado.';
      // updateStepsList(); // Removido pois a lista não existe mais
      btnDownload.disabled = textarea.value.trim() === '' || textarea.value.includes('// Nenhuma código gerado.') || isRecording;
    }
  
    // Adiciona listener de clique para gravar ações
    document.addEventListener('click', recordClick, { capture: true });

    // Adiciona listener de clique direito para mostrar o menu de asserções
    document.addEventListener('contextmenu', (event) => {
      // Ignora cliques dentro da UI da extensão para permitir o menu de contexto padrão
      const path = event.composedPath();
      const isClickOnPanel = path.some(el =>
        el.id === 'cypress-recorder-panel' ||
        el.id === 'cypress-assertion-menu' ||
        el.id === 'selector-alternatives-modal'
      );

      if (!isClickOnPanel) {
        showAssertMenu(event);
      }
    }, { capture: true });

    // Função para gravar um clique
    async function recordClick(event) {
      if (event.button !== 0) return; // Só grava cliques com o botão esquerdo
      if (!isRecording) return;
      
      // Ignora cliques dentro do painel, menu de asserção ou modal de alternativas
      // usando o caminho do evento para ser robusto contra race conditions.
      const path = event.composedPath();
      const isClickOnPanel = path.some(el => el.id === 'cypress-recorder-panel');
      const isClickOnAssertMenu = path.some(el => el.id === 'cypress-assertion-menu');
      const isClickOnAlternativesModal = path.some(el => el.id === 'selector-alternatives-modal');

      if (isClickOnPanel || isClickOnAssertMenu || isClickOnAlternativesModal) {
        return;
      }
      
      // USA A NOVA FUNÇÃO ASSÍNCRONA
      const selectorInfo = await getSelector(event.target);
      const newAction = {
        actionType: 'click',
        selector: selectorInfo.selector,
        useContains: selectorInfo.useContains,
        containsText: selectorInfo.containsText
      };
      
      console.log('🖱️ Click gravado:', newAction);
      
      actions.push(newAction);
      updateOutput();
    }
    
    // Função para gravar um input
    async function recordInput(event) {
      // Ignora inputs dentro do nosso painel
      if (panel.contains(event.target)) {
        return;
      }
      
      if (!isRecording) return;
      
      // USA A NOVA FUNÇÃO ASSÍNCRONA
      const selectorInfo = await getSelector(event.target);
      const value = event.target.value;
      
      // Remove a última ação se for um input no mesmo elemento
      const lastAction = actions[actions.length - 1];
      if (lastAction && lastAction.actionType === 'input' && lastAction.selector === selectorInfo.selector) {
        actions.pop();
      }
      
      actions.push({
        actionType: 'input',
        selector: selectorInfo.selector,
        value: value,
        useContains: selectorInfo.useContains,
        containsText: selectorInfo.containsText
      });
      updateOutput();
    }
  
    // Função para reiniciar gravação
    function restartRecording() {
      actions = [];
      updateOutput();
      // Mantém a gravação ativa
    }
  
    // Atualizar botões conforme status
    function updateRecordingButtons() {
      if (isRecording) {
        btnStartStop.textContent = 'Parar Gravação';
        btnStartStop.style.background = red;
        btnStartStop.style.color = '#fff';
        btnStartStop.style.boxShadow = '0 2px 8px #E5393533';
        btnRestart.style.display = '';
        btnRestart.style.background = blue;
        btnRestart.style.color = '#fff';
      } else {
        btnStartStop.textContent = 'Iniciar Gravação';
        btnStartStop.style.background = green;
        btnStartStop.style.color = '#fff';
        btnStartStop.style.boxShadow = 'none';
        btnRestart.style.display = 'none';
        
        // Foca no campo de nome do arquivo quando parar a gravação
        if (actions.length > 0) {
          setTimeout(() => {
            filenameInput.focus();
          }, 100);
        }
      }
    }
  
    // Função para validar URL simples (começando com http:// ou https://)
    function isValidUrl(url) {
      return /^https?:\/\//.test(url.trim());
    }
  
    // ...
    // Validação visual ao tentar iniciar gravação
    function toggleRecording() {
      let hasError = false;
      // Funcionalidade
      if (!funcionalidadeInput.value.trim()) {
        funcionalidadeError.style.display = 'block';
        hasError = true;
      } else {
        funcionalidadeError.style.display = 'none';
      }
      // Cenário
      if (!cenarioInput.value.trim()) {
        cenarioError.style.display = 'block';
        hasError = true;
      } else {
        cenarioError.style.display = 'none';
      }
      // URL
      if (!urlInput.value.trim()) {
        urlError.textContent = 'campo obrigatório';
        urlError.style.display = 'block';
        hasError = true;
      } else if (!isValidUrl(urlInput.value)) {
        urlError.textContent = 'Informe uma URL válida';
        urlError.style.display = 'block';
        hasError = true;
      } else {
        urlError.style.display = 'none';
      }
      if (!isRecording && hasError) {
        return;
      }
      if (!isRecording) {
        actions = [];
        isRecording = true;
        document.addEventListener('click', recordClick, true);
        document.addEventListener('input', recordInput, true);
        document.addEventListener('contextmenu', recordClick, true);
      } else {
        isRecording = false;
        document.removeEventListener('click', recordClick, true);
        document.removeEventListener('input', recordInput, true);
        document.removeEventListener('contextmenu', recordClick, true);
        // Fecha menu de asserção se estiver aberto
        closeAssertMenu(true);
      }
      updateRecordingButtons();
      updateOutput();
    }
  
    // Esconde a mensagem de erro ao digitar
    urlInput.addEventListener('input', () => {
      if (!urlInput.value.trim()) {
        urlError.textContent = 'campo obrigatório';
        urlError.style.display = 'block';
      } else if (!isValidUrl(urlInput.value)) {
        urlError.textContent = 'Informe uma URL válida';
        urlError.style.display = 'block';
      } else {
        urlError.style.display = 'none';
      }
    });
  
    // Função para baixar o código gerado como arquivo
    function downloadCode() {
      console.log('Download iniciado');
      // Obtém os valores dos campos personalizados
      const nomeFuncionalidade = funcionalidadeInput.value.trim() || 'Funcionalidade';
      const nomeCenario = cenarioInput.value.trim() || 'Cenário de teste';
      let url = urlInput.value.trim() || 'https://example.com';
      // Se não começar com http, adiciona https://
      if (!/^https?:\/\//.test(url)) {
        url = 'https://' + url;
      }
      const code = textarea.value;

      // Verifica se há código para baixar
      if (!code || code.trim() === '' || code.includes('// Nenhuma código gerado.')) {
        alert('Não há código para exportar. Faça uma gravação primeiro!');
        return;
      }

      // Obtém o nome do arquivo definido pelo usuário
      const userFilename = filenameInput.value.trim();
      let filename = userFilename || 'cypress-tests';
      filename = filename.replace(/[<>:"/\\|?*]/g, '-');
      if (filename.endsWith('.js')) {
        filename = filename.slice(0, -3);
      }
      filename += '.js';

      // Monta o template do arquivo Cypress
      const finalCode =
  `describe('${nomeFuncionalidade}', () => {
    beforeEach(() => {
      cy.visit('${url}')
    })

    it('${nomeCenario}', () => {
${code.split('\n').map(line => '    ' + line).join('\n')}
    })
  })`;

      const blob = new Blob([finalCode], { type: 'text/javascript' });
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(urlBlob);

      // Feedback visual de sucesso
      const originalText = btnDownload.textContent;
      btnDownload.textContent = '✅ Baixado com sucesso!';
      btnDownload.style.background = green;
      setTimeout(() => {
        btnDownload.textContent = originalText;
        btnDownload.style.background = blue;
      }, 2000);
    }
  
    // Função para maximizar/restaurar painel
    function toggleMaximize() {
      const resizeHandles = panel.querySelectorAll('.resize-handle');
      
      if (isMaximized) {
        // Restaurar tamanho original
        panel.style.width = originalSize.width + 'px';
        panel.style.height = originalSize.height + 'px';
        panel.style.left = originalSize.left || '';
        panel.style.top = originalSize.top || '';
        panel.style.right = originalSize.right || '';
        panel.style.bottom = originalSize.bottom || '';
        btnToggleSize.textContent = '⬜';
        btnToggleSize.title = 'Maximizar';
        isMaximized = false;
        
        // Reativa redimensionamento
        panel.style.resize = 'both';
        resizeHandles.forEach(handle => {
          handle.style.display = 'block';
        });
      } else {
        // Salvar tamanho atual
        const rect = panel.getBoundingClientRect();
        originalSize = {
          width: rect.width,
          height: rect.height,
          left: panel.style.left || null,
          top: panel.style.top || null,
          right: panel.style.right || null,
          bottom: panel.style.bottom || null
        };
        
        // Maximizar
        panel.style.left = '5px';
        panel.style.top = '5px';
        panel.style.right = '5px';
        panel.style.bottom = '5px';
        panel.style.width = 'auto';
        panel.style.height = 'auto';
        btnToggleSize.textContent = '⬌';
        btnToggleSize.title = 'Restaurar';
        isMaximized = true;
        
        // Desativa redimensionamento quando maximizado
        panel.style.resize = 'none';
        resizeHandles.forEach(handle => {
          handle.style.display = 'none';
        });
      }
      
      console.log('🔄 Painel ' + (isMaximized ? 'maximizado' : 'restaurado'));
    }
    
    // Associa funções aos eventos dos botões
    btnStartStop.onclick = toggleRecording;
    btnDownload.onclick = downloadCode;
    btnToggleSize.onclick = toggleMaximize;
    btnClose.onclick = () => {
      isRecording = false;
      document.removeEventListener('click', recordClick, true);
      document.removeEventListener('input', recordInput, true);
      panel.remove(); // Remove o painel da página
      window.cypressRecorderPanelInjected = false; // Permite nova injeção
    };
    btnRestart.onclick = restartRecording;
  
    // Inicializa a interface
    updateOutput();
    updateRecordingButtons();

    // --- FUNÇÕES DE FEEDBACK VISUAL RESTAURADAS ---

    function highlightElement(element, text) {
      const rect = element.getBoundingClientRect();
      const highlight = document.createElement('div');
      highlight.style.position = 'fixed';
      highlight.style.left = `${rect.left}px`;
      highlight.style.top = `${rect.top}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      highlight.style.border = '2px solid #4CAF50';
      highlight.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
      highlight.style.zIndex = '9999998';
      highlight.style.pointerEvents = 'none';
      highlight.style.transition = 'opacity 0.5s ease-out';
      
      const label = document.createElement('div');
      label.textContent = text;
      label.style.position = 'absolute';
      label.style.top = '-24px';
      label.style.left = '0';
      label.style.background = '#4CAF50';
      label.style.color = 'white';
      label.style.padding = '2px 6px';
      label.style.borderRadius = '3px';
      label.style.fontSize = '12px';
      highlight.appendChild(label);

      document.body.appendChild(highlight);
      setTimeout(() => {
        highlight.style.opacity = '0';
        setTimeout(() => highlight.remove(), 500);
      }, 1000);
    }

    function validateGeneratedCode() {
      textarea.style.transition = 'box-shadow 0.2s ease-in-out';
      textarea.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.7)';
      setTimeout(() => {
        textarea.style.boxShadow = '';
      }, 500);
    }

    // --- FIM DA RESTAURAÇÃO ---

    // Esconde a mensagem de erro ao digitar
    funcionalidadeInput.addEventListener('input', () => {
      if (funcionalidadeInput.value.trim()) funcionalidadeError.style.display = 'none';
    });
    cenarioInput.addEventListener('input', () => {
      if (cenarioInput.value.trim()) cenarioError.style.display = 'none';
    });
    urlInput.addEventListener('input', () => {
      if (urlInput.value.trim()) urlError.style.display = 'none';
    });
  }
  