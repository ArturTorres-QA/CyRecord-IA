# 📋 Documentação Técnica - CyRecord v1.3.0

## 🏗️ Arquitetura Geral

### Estrutura de Arquivos

```
CyRecord/
├── manifest.json              # Configuração da extensão (Manifest V3)
├── background.js              # Service Worker + Integração Google Gemini API
├── content.js                 # Script de gravação básica
├── injectPanel.js             # Interface principal com todas as funcionalidades
├── ai-selector-module.js      # Sistema de seletores baseado em regras
├── sandbox.html               # Ambiente isolado para processamento
├── sandbox.js                 # Lógica do ambiente isolado
├── config.js                  # Configuração da API do Google Gemini (opcional)
└── icons/                     # Ícones da extensão
```

### Manifest V3 - Principais Configurações

```json
{
  "manifest_version": 3,
  "name": "CyRecord - Artur QA",
  "version": "1.3.0",
  "description": "Grava ações e gera comandos Cypress com IA para seletores.",
  "permissions": [
    "scripting",
    "activeTab", 
    "tabs",
    "downloads"
  ],
  "host_permissions": [
    "<all_urls>",
    "https://*.googleapis.com/"
  ]
}
```

**Permissões Explicadas:**
- `scripting`: Injeção de scripts nas páginas
- `activeTab`: Acesso à aba ativa
- `tabs`: Gerenciamento de abas
- `downloads`: Exportação de arquivos
- `host_permissions`: API do Google Gemini

---

## 🧠 Sistema de Seletores (Algoritmo de Regras)

### Estrutura do Algoritmo

O sistema usa um **algoritmo de pontuação** baseado em regras predefinidas:

```javascript
// Estrutura principal do algoritmo de seletores
function getSelectorForAssertion(element) {
  const selectorCandidates = [];
  
  // 1. Coleta todos os candidatos possíveis
  collectSelectorCandidates(element, selectorCandidates);
  
  // 2. Filtra elementos da própria extensão
  filterExtensionElements(selectorCandidates);
  
  // 3. Ordena por pontuação
  selectorCandidates.sort((a, b) => b.score - a.score);
  
  // 4. Retorna o melhor candidato
  return selectorCandidates[0];
}
```

### Critérios de Pontuação

| Critério | Pontuação | Razão |
|----------|-----------|-------|
| `data-cy` | 100 | Melhor prática para testes |
| `id` | 95 | Identificador único |
| `data-testid` | 90 | Atributo específico para testes |
| `data-test` | 90 | Atributo específico para testes |
| `data-automation` | 90 | Atributo específico para automação |
| `data-qa` | 90 | Atributo específico para QA |
| `name` | 85 | Importante para formulários |
| Classes específicas | 80 | Classes não genéricas |
| `type` | 75 | Tipo de input |
| `role` | 75 | Papel semântico |
| `placeholder` | 70 | Texto placeholder |
| `title` | 65 | Atributo title |
| `alt` | 65 | Texto alternativo |
| Seletor hierárquico | 60-70 | Posição relativa |
| Texto único | 60 | Para elementos pequenos |
| Combinação de atributos | 55 | Múltiplos atributos |
| Apenas tag | 40 | Último recurso |

### Filtros de Exclusão

```javascript
// Sistema de exclusão da própria extensão
function isExtensionElement(element) {
  const extensionSelectors = [
    '#cypress-recorder-panel',
    '.cypress-recorder-menu',
    '.cypress-recorder-modal',
    '.cypress-recorder-action-menu',
    '.selector-alternatives-modal'
  ];
  
  return extensionSelectors.some(selector => 
    element.closest(selector)
  );
}
```

### Algoritmo de Pontuação Detalhado

```javascript
function calculateScore(element, selectorType) {
  let score = 0;
  let explanation = '';
  
  // Verifica se é elemento da extensão
  if (isExtensionElement(element)) {
    return { score: 0, explanation: 'Elemento da extensão ignorado' };
  }
  
  // Aplica regras de pontuação
  switch (selectorType) {
    case 'data-cy':
      score = 100;
      explanation = 'Usa data-cy (melhor prática para testes)';
      break;
      
    case 'id':
      score = 95;
      // Verifica unicidade
      const elementsWithId = document.querySelectorAll(`#${element.id}`);
      if (elementsWithId.length > 1) score -= 20;
      explanation = `Usa ID único (${elementsWithId.length} elementos encontrados)`;
      break;
      
    // ... outros casos
  }
  
  return { score, explanation };
}
```

---

## 🤖 Assistente de IA Generativa

### Integração com Google Gemini

```javascript
// background.js - Integração com API
class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  }
  
  async processNaturalLanguage(text) {
    const prompt = this.buildPrompt(text);
    
    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    return await response.json();
  }
  
  buildPrompt(userInput) {
    return `
Converta comandos em português para ações de teste Cypress.

Comandos aceitos:
- "clique em [elemento]" → {"action": "click", "target": "[elemento]"}
- "digite [texto] em [campo]" → {"action": "type", "target": "[campo]", "value": "[texto]"}
- "limpe [campo]" → {"action": "clear", "target": "[campo]"}

Comando: ${userInput}

Responda apenas com JSON válido:
    `;
  }
}
```

### Processamento de Comandos

O sistema processa comandos em linguagem natural e os converte em ações estruturadas:

```javascript
// Exemplo de processamento
const userCommand = "Clique em login e digite admin no usuário";
const processedActions = [
  { action: "click", target: "login" },
  { action: "type", target: "usuário", value: "admin" }
];
```

### Busca Inteligente de Elementos

```javascript
function findElementByDescription(description) {
  const searchStrategies = [
    // 1. Busca por ID que contenha o termo
    () => document.querySelector(`[id*="${description}"]`),
    
    // 2. Busca por placeholder
    () => document.querySelector(`[placeholder*="${description}"]`),
    
    // 3. Busca por name
    () => document.querySelector(`[name*="${description}"]`),
    
    // 4. Busca por texto próximo
    () => findElementByNearbyText(description),
    
    // 5. Busca por label associado
    () => findElementByLabel(description)
  ];
  
  for (const strategy of searchStrategies) {
    const element = strategy();
    if (element) return element;
  }
  
  return null;
}
```

---

## 🖥️ Interface e UX

### Painel Principal (injectPanel.js)

#### **Configurações de Tamanho e Posição:**
```javascript
// Configurações iniciais do painel
panel.style.width = '600px';
panel.style.height = '800px';
panel.style.minWidth = '300px';
panel.style.minHeight = '400px';
panel.style.maxWidth = '90vw';
panel.style.maxHeight = '90vh';
```

#### **Sistema de Redimensionamento:**
```javascript
// Handles de redimensionamento em todas as bordas
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
```

#### **Sistema de Arrasto:**
```javascript
// Arrasto pelo cabeçalho
header.addEventListener('mousedown', function(e) {
  if (e.target === btnClose || e.target === btnToggleSize) return;
  
  isDragging = true;
  const rect = panel.getBoundingClientRect();
  panel.style.left = rect.left + 'px';
  panel.style.top = rect.top + 'px';
  panel.style.right = '';
  panel.style.bottom = '';
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
});
```

#### **Maximização/Restauração:**
```javascript
function toggleMaximize() {
  if (isMaximized) {
    // Restaurar tamanho original
    panel.style.width = originalSize.width + 'px';
    panel.style.height = originalSize.height + 'px';
    // ... restaurar posição
  } else {
    // Salvar tamanho atual
    originalSize = {
      width: rect.width,
      height: rect.height,
      // ... salvar posição
    };
    
    // Maximizar
    panel.style.left = '5px';
    panel.style.top = '5px';
    panel.style.right = '5px';
    panel.style.bottom = '5px';
    panel.style.width = 'auto';
    panel.style.height = 'auto';
  }
}
```

### Seções da Interface

#### **1. Cabeçalho:**
- Título "CyRecord"
- Ícone de informação com tooltip
- Botão maximizar/restaurar
- Botão fechar

#### **2. Status da Gravação:**
- Botão "Iniciar Gravação" (verde)
- Botão "Reiniciar Gravação" (rosa)
- Indicadores visuais de estado

#### **3. Assistente de IA:**
- Título "🤖 Assistente de Testes com IA (Beta)"
- Textarea para comandos
- Botão "Gerar Código a partir do Texto"

#### **4. Campos Personalizados:**
- Funcionalidade (ex: Login, Cadastro)
- Nome do cenário (ex: Usuário faz login)
- URL da página testada

#### **5. Área de Código:**
- Visualização em tempo real
- Syntax highlighting
- Scroll automático

#### **6. Exportação:**
- Campo para nome do arquivo
- Botão "Exportar Código Cypress"
- Feedback visual de sucesso

---

## 🔒 Sandbox de IA

### Arquitetura de Segurança

```javascript
// sandbox.html - Ambiente isolado
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <script src="lib/tf.min.js"></script>
    <script src="ai-selector-module.js"></script>
    <script src="sandbox.js"></script>
  </body>
</html>
```

### Comunicação Segura

```javascript
// Comunicação via postMessage
window.addEventListener('message', async (event) => {
  const { type, payload } = event.data;
  
  if (type === 'GET_SELECTOR_REQUEST') {
    const strategy = await aiSelectorFinder.predictBestStrategy(payload.elementFeatures);
    
    event.source.postMessage({
      type: 'GET_SELECTOR_RESPONSE',
      payload: {
        strategy: strategy,
        requestId: payload.requestId,
      }
    }, event.origin);
  }
});
```

### Timeout de Segurança

```javascript
// Timeout para requisições da IA
setTimeout(() => {
  if (requestPromises.has(requestId)) {
    reject(new Error(`A requisição para a IA (ID: ${requestId}) expirou.`));
    requestPromises.delete(requestId);
  }
}, 5000); // 5 segundos
```

---

## 📊 Sistema de Gravação

### Captura de Eventos

```javascript
// content.js - Captura de eventos
document.addEventListener('click', function (event) {
  const selectorInfo = getSelector(event.target);
  recordAction('click', selectorInfo.selector, '', selectorInfo.useContains, selectorInfo.containsText);
}, true);

document.addEventListener('input', function (event) {
  const selectorInfo = getSelector(event.target);
  const value = event.target.value;
  recordAction('input', selectorInfo.selector, value, selectorInfo.useContains, selectorInfo.containsText);
}, true);
```

### Geração de Código Cypress

```javascript
function generateCypressCode(actions) {
  return actions.map(action => {
    if (action.actionType === 'click') {
      if (action.useContains) {
        return `cy.contains('${action.containsText}').should('be.visible').click();`;
      } else {
        return `cy.get('${action.selector}').click();`;
      }
    } else if (action.actionType === 'input') {
      if (action.useContains) {
        return `cy.contains('${action.containsText}').should('be.visible').type('${action.value}');`;
      } else {
        return `cy.get('${action.selector}').type('${action.value}');`;
      }
    }
    return '';
  }).join('\n');
}
```

---

## 🎯 Menu de Ações e Asserções

### Estrutura do Menu

```javascript
function showAssertMenu(event, selectorInfoOverride = null) {
  // Cria o menu de asserções
  assertMenu = document.createElement('div');
  assertMenu.id = 'cypress-assertion-menu';
  assertMenu.className = 'cypress-assertion-menu';
  
  // Posicionamento próximo ao cursor
  assertMenu.style.left = Math.min(event.clientX, window.innerWidth - 220) + 'px';
  assertMenu.style.top = Math.min(event.clientY, window.innerHeight - 300) + 'px';
}
```

### Opções de Ações

```javascript
const actionOptions = [
  { text: '⌨️ Digitar texto', type: 'action', action: 'type' },
  { text: '🖱️ Clicar no elemento', type: 'action', action: 'click' },
  { text: '🗑️ Limpar campo', type: 'action', action: 'clear' },
  { text: '---', type: 'separator' }
];
```

### Opções de Asserções

```javascript
const assertionOptions = [
  { text: '👁️ Deve estar visível', type: 'assertion', assertion: 'be.visible' },
  { text: '✅ Deve existir', type: 'assertion', assertion: 'exist' },
  { text: '❌ Não deve existir', type: 'assertion', assertion: 'not.exist' },
  { text: '🚫 Deve estar desabilitado', type: 'assertion', assertion: 'be.disabled' },
  { text: '✅ Deve estar habilitado', type: 'assertion', assertion: 'be.enabled' },
  { text: '📝 Deve ter texto exato', type: 'assertion', assertion: 'have.text' },
  { text: '🔍 Deve conter texto', type: 'assertion', assertion: 'contain.text' },
  { text: '🔗 Deve ter valor', type: 'assertion', assertion: 'have.value' }
];
```

### Modal de Alternativas

```javascript
function showSelectorAlternatives(element, originalEvent) {
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
}
```

---

## 📁 Exportação de Código

### Estrutura do Arquivo Gerado

```javascript
function downloadCode() {
  const code = generateCompleteTestCode();
  const filename = `${filenameInput.value}.cy.js`;
  
  const blob = new Blob([code], { type: 'application/javascript' });
  const urlBlob = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = urlBlob;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(urlBlob);
}
```

### Template do Código Cypress

```javascript
function generateCompleteTestCode() {
  return `/**
 * Teste gerado automaticamente pelo CyRecord v1.3.0
 * Funcionalidade: ${funcionalidadeInput.value}
 * Cenário: ${cenarioInput.value}
 * URL: ${urlInput.value}
 * Data: ${new Date().toLocaleDateString('pt-BR')}
 */

describe('${funcionalidadeInput.value}', () => {
  it('${cenarioInput.value}', () => {
    cy.visit('${urlInput.value}');
    
    ${actions.map(action => generateCypressAction(action)).join('\n    ')}
  });
});`;
}
```

---

## 🔧 Configuração e Personalização

### Arquivo de Configuração

```javascript
// config.js (opcional)
const GOOGLE_API_KEY = 'sua-chave-aqui';

// Configurações adicionais podem ser adicionadas aqui
const CONFIG = {
  defaultTimeout: 5000,
  maxActions: 100,
  enableDebug: false
};
```

### Personalização de Cores

```javascript
// Cores da interface
const green = '#4CAF50'; // iniciar gravação
const blue = '#142B43'; // reiniciar gravação, título
const red = '#E53935'; // parar gravação
const lightGray = '#F5F5F5'; // fundo principal
const rose = '#D7B0A6'; // botão principal, destaques
const beigeRose = '#D6C3BC'; // botão reiniciar
const offWhite = '#F7F0EA'; // fundo principal
```

---

## 🚀 Performance e Otimização

### Lazy Loading

```javascript
// Carregamento sob demanda da IA
let aiSelectorFinder = null;

function initializeAI() {
  if (!aiSelectorFinder) {
    aiSelectorFinder = new AISelectorFinder();
  }
}
```

### Debouncing de Eventos

```javascript
// Evita processamento excessivo
let inputTimeout;
let lastInputSelector = null;

function recordInput(event) {
  clearTimeout(inputTimeout);
  
  inputTimeout = setTimeout(() => {
    // Processa o input
    const selectorInfo = getSelector(event.target);
    recordAction('input', selectorInfo.selector, event.target.value);
  }, 300);
}
```

### Memoização de Seletores

```javascript
// Cache de seletores para melhor performance
const selectorCache = new Map();

function getCachedSelector(element) {
  const key = element.outerHTML;
  if (selectorCache.has(key)) {
    return selectorCache.get(key);
  }
  
  const selector = calculateSelector(element);
  selectorCache.set(key, selector);
  return selector;
}
```

---

## 🔍 Debugging e Logs

### Sistema de Logs

```javascript
// Logs estruturados para debugging
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[CyRecord ${level.toUpperCase()}] ${timestamp}: ${message}`;
  
  console.log(logMessage);
  
  // Envia para o painel se necessário
  if (window.cypressRecorderPanel) {
    window.cypressRecorderPanel.log(message, level);
  }
}
```

### Debug Mode

```javascript
// Modo debug para desenvolvimento
const DEBUG_MODE = false;

function debugLog(message) {
  if (DEBUG_MODE) {
    console.log(`[CyRecord DEBUG] ${message}`);
  }
}
```

---

## 📈 Métricas e Analytics

### Coleta de Métricas

```javascript
// Métricas de uso (sem dados pessoais)
const metrics = {
  actionsRecorded: 0,
  aiCommandsProcessed: 0,
  selectorsGenerated: 0,
  codeExported: 0,
  sessionDuration: 0
};

function trackMetric(metricName) {
  metrics[metricName]++;
  // Métricas são mantidas apenas localmente
}
```

---

## 🔮 Roadmap Técnico

### Próximas Funcionalidades

#### **v1.4.0 - Melhorias de IA**
- [ ] Machine Learning para seletores
- [ ] Análise de padrões de uso
- [ ] Sugestões inteligentes

#### **v1.5.0 - Integração Avançada**
- [ ] API REST para integração externa
- [ ] Plugins para editores (VS Code, IntelliJ)
- [ ] Integração com CI/CD

#### **v2.0.0 - Multi-framework**
- [ ] Suporte a Playwright
- [ ] Suporte a Selenium
- [ ] Templates personalizáveis

### Melhorias de Performance

- [ ] Web Workers para processamento pesado
- [ ] Virtualização de listas grandes
- [ ] Otimização de memória
- [ ] Cache inteligente

### Segurança

- [ ] Sandbox mais restritivo
- [ ] Validação de entrada mais rigorosa
- [ ] Auditoria de segurança
- [ ] Criptografia de dados sensíveis

---

## 📚 Recursos e Referências

### Documentação Externa

- **[Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)**
- **[Google Gemini API](https://ai.google.dev/docs)**
- **[Cypress Documentation](https://docs.cypress.io/)**
- **[TensorFlow.js](https://www.tensorflow.org/js)**

### Padrões e Boas Práticas

- **[Web Extension Best Practices](https://extensionworkshop.com/documentation/develop/best-practices-for-maintaining-your-webextension/)**
- **[Chrome Extension Security](https://developer.chrome.com/docs/extensions/mv3/security/)**
- **[Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)**

---

**🎯 CyRecord v1.3.0 - Documentação técnica completa e atualizada**

**Última atualização**: Interface otimizada com painel maior (600x800px) e melhor experiência do usuário 