// Importa a chave de API do arquivo de configuração.
try {
  importScripts('config.js');
} catch (e) {
  console.error("Erro: O arquivo 'config.js' com a GOOGLE_API_KEY não foi encontrado.", e);
}

// Este listener é acionado quando o ícone da extensão é clicado na barra do navegador
chrome.action.onClicked.addListener((tab) => {
  // Injeta o script 'injectPanel.js' na aba atual, que cuidará de criar o painel e a sandbox da IA.
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['injectPanel.js']
  });
});

// Listener para mensagens do painel (injectPanel.js).
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateCodeFromNLP") {
    const userText = request.text;

    // Verifica se a chave de API está disponível.
    if (typeof GOOGLE_API_KEY === 'undefined' || !GOOGLE_API_KEY) {
      sendResponse({ success: false, error: "A chave de API do Google não foi configurada." });
      return false; // Não retorna uma promessa se a chave não existir.
    }

    callGeminiAPI(userText)
      .then(steps => {
        sendResponse({ success: true, steps: steps });
      })
      .catch(error => {
        console.error("Erro ao chamar a API Gemini:", error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Indica que a resposta será enviada de forma assíncrona.
  }
});

// Função que faz a chamada para a API do Google Gemini.
async function callGeminiAPI(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`;
  
  const prompt = `
    Converta comandos em ações JSON para automação web. Responda APENAS com array JSON limpo.

    AÇÕES DISPONÍVEIS:
    - "type": Digite texto em um campo
    - "click": Clique em um elemento
    - "clear": Limpe o conteúdo de um campo
    - "assertVisible": Verificar se elemento está visível
    - "assertExists": Verificar se elemento existe
    - "assertNotExists": Verificar se elemento não existe
    - "assertDisabled": Verificar se elemento está desabilitado
    - "assertEnabled": Verificar se elemento está habilitado
    - "assertText": Verificar se elemento contém texto específico
    - "assertExactText": Verificar se elemento tem texto exato
    - "assertValue": Verificar valor de um campo

    Para campos brasileiros, use termos EXATOS:
    - "nome completo" ou "nome" → nome
    - "celular" ou "telefone" → celular  
    - "cep" → cep
    - "número da residência" ou "numero" → numero
    - "endereço" → endereco
    - "email" → email
    - "continuar" ou "prosseguir" → continuar
    - "voltar" → voltar
    - "cancelar" → cancelar
    - "confirmar" ou "ok" → confirmar
    - "login" ou "entrar" → login
    - "cadastrar" → cadastrar

    Para verificações:
    - "verificar se X está visível" → {"action":"assertVisible","target":"X"}
    - "verificar se X existe" → {"action":"assertExists","target":"X"}
    - "verificar se X está habilitado" → {"action":"assertEnabled","target":"X"}
    - "verificar se X está desabilitado" → {"action":"assertDisabled","target":"X"}
    - "verificar se X contém Y" → {"action":"assertText","target":"X","value":"Y"}
    - "verificar se aparece Y" → {"action":"assertText","target":"Y","value":""}

    REGRAS ESPECIAIS:
    - Para TEXTOS LONGOS (promoções, ofertas): use o texto COMPLETO como target
    - Para VALORES MONETÁRIOS: use "total" ou "valor" como target, não o valor específico
    - Para BOTÕES específicos: use o nome EXATO do botão como target

    EXEMPLOS:
    Comando: "Digite joão no campo nome e clique em continuar"
    Resposta: [{"action":"type","target":"nome","value":"joão"},{"action":"click","target":"continuar"}]

    Comando: "Clique em login e veja se aparece bem-vindo"
    Resposta: [{"action":"click","target":"login"},{"action":"assertText","target":"bem-vindo","value":""}]

    Comando: "Verifique se o botão continuar está habilitado"
    Resposta: [{"action":"assertEnabled","target":"continuar"}]

    Comando: "Verifique se o texto 'Oferta especial por tempo limitado' está visível"
    Resposta: [{"action":"assertText","target":"Oferta especial por tempo limitado","value":""}]

    Comando: "Verifique se o total está exibindo R$100,00"
    Resposta: [{"action":"assertText","target":"total","value":"R$100,00"}]

    Comando: "${text}"
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`A chamada para a API falhou com status ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const jsonString = data.candidates[0].content.parts[0].text;
  const cleanedJsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedJsonString);
}
