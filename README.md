# CyRecord 🎯

**Grave ações do usuário e gere testes Cypress automaticamente com sistema inteligente de seletores e Assistente de IA!**

## 🚀 **VERSÃO ATUAL** - v1.3.0 com Interface Otimizada! 

**Novidades desta versão:**
- ✅ **Interface redesenhada** com painel maior (600x800px) para melhor visualização
- ✅ **Sistema de redimensionamento** nativo do painel
- ✅ **Assistente de IA completo** com Google Gemini
- ✅ **Sistema inteligente de seletores** com pontuação de qualidade
- ✅ **Menu de ações e asserções** via botão direito
- ✅ **Exportação de código** com campos personalizados
- ✅ **Sandbox de IA** para processamento seguro

**Exemplo**: "Clique em login e verifique se o botão continuar está habilitado"
**Resultado**: Código Cypress completo com ações E verificações!

> 📖 **[Veja todos os exemplos aqui](Doc/MELHORIAS-IA-VERIFICACOES.md)**  
> 🎯 **[Melhorias de Precisão](Doc/MELHORIAS-PRECISAO-IA.md)** - Como a IA foi otimizada

## 📚 Documentação Completa 

### 🆕 Para Usuários (Recomendado)
- **[📖 Guia Completo do Usuário](Doc/GUIA-COMPLETO-USUARIO.md)** - Documentação detalhada e amigável
- **[⚡ Guia Rápido](Doc/GUIA-RAPIDO.md)** - Referência rápida para consulta
- **[🎯 Exemplo Prático](Doc/EXEMPLO-PRATICO.md)** - Tutorial passo a passo
- **[🤖 Melhorias da IA](Doc/MELHORIAS-IA-VERIFICACOES.md)** - Novas funcionalidades completas
- **[🎯 Precisão da IA](Doc/MELHORIAS-PRECISAO-IA.md)** - Otimizações de precisão

### 🔧 Para Desenvolvedores
- **[📋 Documentação Técnica](explicacao-tecnica.md)** - Detalhes técnicos e arquitetura
- **[📄 Manifest](manifest-documentation.md)** - Documentação do manifest
- **[🔍 Transparência Técnica](TRANSPARENCIA-TECNICA.md)** - Como o sistema de seletores realmente funciona

---

## 🚀 O que é o CyRecord?

O CyRecord é uma extensão para o Google Chrome que grava automaticamente suas ações em uma página web (cliques, digitação, etc.) e gera comandos Cypress prontos para uso em testes automatizados. 

**Destaque especial**: O CyRecord usa um sistema inteligente de regras para escolher o melhor seletor possível para cada elemento, garantindo testes mais robustos e estáveis!

## ✨ Funcionalidades Principais

### 🎬 Gravação Automática
- **Cliques**: Captura cliques em qualquer elemento da página
- **Inputs**: Registra digitação em campos de texto
- **Ações Manuais**: Adicione ações específicas via botão direito

### 🤖 Assistente de IA Generativa ⭐ COMPLETO ⭐
O CyRecord inclui um assistente avançado powered by **Google Gemini** que permite:

- **Comandos em linguagem natural**: "Clique em login e verifique se o botão está habilitado"
- **TODAS as verificações**: habilitado, visível, texto, existência, valores, etc.
- **Geração automática**: Converte texto em ações E verificações Cypress
- **Busca inteligente**: Encontra elementos automaticamente na página
- **Integração total**: Ações e verificações geradas são adicionadas ao código final

### 🧠 Sistema Inteligente de Seletores
O CyRecord implementa um sistema baseado em regras para escolher o melhor seletor baseado em um sistema de pontuação com múltiplos critérios:

- **data-cy** (100 pontos) - Melhor prática para testes
- **ID** (95 pontos) - Identificador único
- **Atributos de teste** (90 pontos) - data-testid, data-test, etc.
- **Classes CSS específicas** (80 pontos) - Classes não genéricas
- **E muito mais...**

### 🎯 Menu de Ações e Asserções Inteligente
Quando você clica com o botão direito para adicionar uma ação ou asserção:

#### **Ações Disponíveis:**
- **⌨️ Digitar texto** - Insere texto em qualquer campo
- **🖱️ Clicar no elemento** - Adiciona clique manual
- **🗑️ Limpar campo** - Remove conteúdo de campos

#### **Asserções Disponíveis:**
- **Básicas**: Visível, existir, habilitado, etc.
- **Avançadas**: Texto específico, valor, atributo, etc.

Cada opção mostra:
1. **Pontuação de qualidade** do seletor (0-100)
2. **Explicação detalhada** de por que aquele seletor foi escolhido
3. **Botão "Ver alternativas"** para escolher entre diferentes opções

### 📊 Modal de Alternativas
Veja todas as opções de seletores disponíveis:
- **Pontuação de cada alternativa** (0-100)
- **Código Cypress gerado** para cada opção
- **Cores indicativas**: 🟢 Verde (alta qualidade), 🟠 Laranja (média), 🔴 Vermelho (baixa)

### 🖥️ Interface Otimizada
- **Painel redimensionável** (600x800px inicial)
- **Arrastar e soltar** para reposicionar
- **Maximizar/restaurar** com duplo clique
- **Handles de redimensionamento** em todas as bordas
- **Design responsivo** que se adapta ao conteúdo

## 🛠️ Como Usar

### 1. Instalação
1. Baixe os arquivos da extensão
2. Abra o Chrome e vá para `chrome://extensions/`
3. Ative o "Modo desenvolvedor"
4. Clique em "Carregar sem compactação" e selecione a pasta do CyRecord

### 2. Configuração da IA (Opcional)
Para usar o Assistente de IA:
1. Crie uma conta no [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Gere uma API Key
3. Crie um arquivo `config.js` na pasta da extensão com: `const GOOGLE_API_KEY = 'sua-chave-aqui';`

### 3. Gravação Automática
1. Clique no ícone da extensão na barra de ferramentas
2. Clique em "Iniciar Gravação"
3. Navegue pela página normalmente (cliques e digitação são gravados automaticamente)

### 4. Assistente de IA (Novo!)
1. No painel, digite comandos em linguagem natural
2. Exemplo: "Clique no botão entrar, digite admin no usuário e 123 na senha"
3. Clique em "Gerar Código a partir do Texto"
4. A IA processa e adiciona as ações automaticamente

### 5. Adicionando Ações e Asserções Manualmente
1. **Clique com o botão direito** em qualquer elemento
2. **Escolha uma ação**: Digitar texto, Clicar, Limpar campo
3. **Ou escolha uma asserção**: Deve estar visível, conter texto, etc.
4. **Veja a qualidade do seletor** escolhido pelo sistema
5. **Clique em "Ver alternativas"** se quiser outras opções

### 6. Gerando o Código
1. Clique em "Parar Gravação"
2. Preencha os campos personalizados (funcionalidade, cenário, URL)
3. Digite um nome para o arquivo
4. Clique em "Exportar Código Cypress"

## 🎯 Exemplos de Uso

### Exemplo 1: Gravação Automática + IA
```
1. Digite no assistente: "Preencha joão no nome e teste@email.com no email"
2. A IA gera automaticamente:
   cy.get('#nome').type('joão');
   cy.get('#email').type('teste@email.com');
```

### Exemplo 2: Elemento com data-cy
```html
<button data-cy="submit-button">Enviar</button>
```
**Sistema escolhe**: `[data-cy="submit-button"]` (100 pontos)
**Código gerado**: `cy.get('[data-cy="submit-button"]').click();`

### Exemplo 3: Ações Manuais via Botão Direito
```
1. Clique direito no campo → "⌨️ Digitar texto"
2. Digite "meu texto" → Adiciona: cy.get('#campo').type('meu texto');
3. Clique direito no botão → "👁️ Deve estar visível"
4. Adiciona: cy.get('#botao').should('be.visible');
```

## 🔧 Tipos de Ações e Asserções Suportadas

### Ações
- **⌨️ Digitar texto** - `cy.get('selector').type('texto')`
- **🖱️ Clicar no elemento** - `cy.get('selector').click()`
- **🗑️ Limpar campo** - `cy.get('selector').clear()`

### Asserções Básicas
- 👁️ **Deve estar visível** - `cy.get('selector').should('be.visible')`
- ✅ **Deve existir** - `cy.get('selector').should('exist')`
- ❌ **Não deve existir** - `cy.get('selector').should('not.exist')`
- 🚫 **Deve estar desabilitado** - `cy.get('selector').should('be.disabled')`
- ✅ **Deve estar habilitado** - `cy.get('selector').should('be.enabled')`

### Asserções Avançadas
- 📝 **Deve ter texto exato** - `cy.get('selector').should('have.text', 'valor')`
- 🔍 **Deve conter texto** - `cy.get('selector').should('contain.text', 'valor')`
- 🔗 **Deve ter valor** - `cy.get('selector').should('have.value', 'valor')`

## 🤖 Assistente de IA - Como Funciona

### Comandos Suportados ⭐ EXPANDIDO ⭐
- **"Clique em [elemento]"** → Gera ação de clique
- **"Digite [texto] em [campo]"** → Gera ação de digitação
- **"Verifique se [elemento] está habilitado"** → Gera verificação de estado
- **"Verifique se [elemento] está visível"** → Gera verificação de visibilidade
- **"Verifique se aparece [texto]"** → Gera verificação de texto
- **"Confirme se [elemento] existe"** → Gera verificação de existência

### Exemplos de Comandos ⭐ NOVOS ⭐
```
✅ "Clique no botão entrar"
✅ "Digite admin no campo usuário"
✅ "Preencha 123 na senha"
✅ "Verifique se aparece bem-vindo"
✅ "Verifique se o botão continuar está habilitado"
✅ "Confirme se o campo nome está visível"
✅ "Clique em login e veja se aparece erro"
✅ "Digite dados e verifique se o botão enviar está habilitado"
✅ "Clique em cadastrar, preencha dados e confirme se aparece sucesso"
```

### Busca Inteligente de Elementos
A IA procura elementos por:
1. **ID que contenha o termo** (ex: #nomeCompleto)
2. **Placeholder ou Name** (ex: placeholder="Nome")
3. **Labels associados** (ex: <label>Nome</label>)
4. **Proximidade de texto** (texto próximo ao campo)

## 🧠 Como o Sistema de Seletores Funciona

O sistema inteligente do CyRecord avalia múltiplos fatores para escolher o melhor seletor através de um algoritmo de pontuação:

### Critérios de Pontuação
- **data-cy** (100 pontos) - Melhor prática para testes
- **ID único** (95 pontos) - Identificador único
- **Atributos de teste** (90 pontos) - data-testid, data-test, etc.
- **Classes específicas** (80 pontos) - Classes não genéricas
- **Atributos semânticos** (75 pontos) - name, type, role
- **Texto único** (60 pontos) - Para elementos pequenos
- **Hierarquia DOM** (50-70 pontos) - Posição relativa

### Filtros Inteligentes
- **Exclui elementos da extensão** automaticamente
- **Verifica unicidade** dos seletores
- **Prioriza elementos visíveis** e interativos
- **Evita seletores frágeis** que podem quebrar

## 🏗️ Arquitetura Técnica

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

### Tecnologias Utilizadas
- **Manifest V3** - Padrão mais recente do Chrome
- **Google Gemini API** - IA generativa para comandos naturais
- **TensorFlow.js** - Processamento de IA local (sandbox)
- **CSS Grid/Flexbox** - Interface responsiva
- **JavaScript ES6+** - Código moderno e eficiente

## 🔒 Segurança e Privacidade

### Sandbox de IA
- **Processamento isolado** em iframe sandbox
- **Sem acesso direto** ao DOM da página principal
- **Comunicação segura** via postMessage
- **Timeout de segurança** para requisições

### Dados e Privacidade
- **Nenhum dado enviado** para servidores externos (exceto Google Gemini)
- **Processamento local** de seletores e ações
- **Sem telemetria** ou coleta de dados
- **Código aberto** para transparência total

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] **Suporte a mais frameworks** (Playwright, Selenium)
- [ ] **Gravação de vídeo** das ações
- [ ] **Templates de teste** personalizáveis
- [ ] **Integração com CI/CD** (GitHub Actions, Jenkins)
- [ ] **Relatórios de qualidade** dos seletores
- [ ] **Modo headless** para automação

### Melhorias Planejadas
- [ ] **Interface dark mode**
- [ ] **Atalhos de teclado**
- [ ] **Plugins para editores** (VS Code, IntelliJ)
- [ ] **API REST** para integração externa
- [ ] **Machine Learning** para seletores ainda mais inteligentes

## 🤝 Contribuindo

### Como Contribuir
1. **Fork** o repositório
2. **Crie uma branch** para sua feature
3. **Faça suas alterações** seguindo os padrões
4. **Teste** suas mudanças
5. **Abra um Pull Request**

### Padrões de Código
- **JavaScript ES6+** com async/await
- **CSS** com BEM methodology
- **Comentários** em português
- **Testes** para novas funcionalidades
- **Documentação** atualizada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Google Gemini** pela API de IA generativa
- **Cypress** pelo framework de testes
- **Comunidade open source** pelas contribuições
- **Usuários** pelos feedbacks e sugestões

---

## 📞 Suporte

### Problemas Comuns
- **IA não funciona**: Verifique se configurou a API Key
- **Seletores quebram**: Use data-cy ou ID para maior estabilidade
- **Painel não aparece**: Recarregue a página e tente novamente

### Contato
- **Issues**: Abra uma issue no GitHub
- **Documentação**: Consulte os guias na pasta `Doc/`
<<<<<<< HEAD
=======
- **Comunidade**: Participe das discussões
>>>>>>> 75db602 (projeto cyrecord)

---

**🎯 CyRecord - Tornando testes automatizados acessíveis para todos!**
