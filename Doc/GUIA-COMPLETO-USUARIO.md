# 📖 Guia Completo do Usuário - CyRecord v1.3.0

> **🎯 Grave ações do usuário e gere testes Cypress automaticamente com sistema inteligente de seletores e Assistente de IA!**

## 🚀 Bem-vindo ao CyRecord!

O CyRecord é uma extensão para Google Chrome que torna a criação de testes automatizados **super fácil**! Você simplesmente navega pelo seu site normalmente e o CyRecord grava tudo automaticamente, gerando código Cypress pronto para usar.

**O diferencial**: Sistema inteligente que escolhe os melhores seletores + Assistente de IA que entende comandos em português!

**Nova versão v1.3.0**: Interface otimizada com painel maior (600x800px) e melhor experiência do usuário!

---

## 📋 Índice

1. [🛠️ Instalação](#-instalação)
2. [🎬 Primeira Gravação](#-primeira-gravação)
3. [🤖 Assistente de IA (Novo!)](#-assistente-de-ia-novo)
4. [🎯 Ações Manuais](#-ações-manuais)
5. [📊 Sistema de Seletores](#-sistema-de-seletores)
6. [🖥️ Interface Otimizada](#-interface-otimizada)
7. [🔧 Funcionalidades Avançadas](#-funcionalidades-avançadas)
8. [💡 Dicas e Truques](#-dicas-e-truques)
9. [🆘 Solução de Problemas](#-solução-de-problemas)

---

## 🛠️ Instalação

### Passo 1: Download
1. Baixe os arquivos da extensão CyRecord
2. Extraia para uma pasta no seu computador

### Passo 2: Instalar no Chrome
1. Abra o Google Chrome
2. Digite `chrome://extensions/` na barra de endereços
3. Ative o **"Modo desenvolvedor"** (canto superior direito)
4. Clique em **"Carregar sem compactação"**
5. Selecione a pasta onde extraiu o CyRecord
6. Pronto! O ícone 🎯 aparecerá na barra de ferramentas

### Passo 3: Configuração da IA (Opcional)
Para usar o Assistente de IA:

1. **Obtenha uma chave da API Google Gemini**:
   - Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Crie uma conta ou faça login
   - Gere uma nova API Key

2. **Configure no CyRecord**:
   - Crie um arquivo `config.js` na pasta da extensão
   - Adicione: `const GOOGLE_API_KEY = 'sua-chave-aqui';`
   - **Importante**: Nunca compartilhe sua chave!

3. **Sem configuração**: A extensão funciona normalmente, apenas o Assistente de IA ficará indisponível

---

## 🎬 Primeira Gravação

### Passo a Passo Básico:

1. **Abra o site** que você quer testar
2. **Clique no ícone 🎯** do CyRecord na barra de ferramentas
3. **Clique em "Iniciar Gravação"** - o painel aparecerá no canto da tela
4. **Navegue normalmente** pelo site (clique em botões, preencha campos, etc.)
5. **Todas as ações são gravadas automaticamente!** ✨
6. **Clique em "Parar Gravação"** quando terminar
8. **Preencha os campos personalizados** (funcionalidade, cenário, URL)
9. **Digite um nome** para o arquivo
10. **Clique em "Exportar Código Cypress"**
11. **Pronto!** Seu arquivo `.cy.js` foi baixado

### Exemplo Visual:
```
🎯 [Iniciar Gravação] → Navegar no site → [Parar Gravação] → [Exportar]
```

**O que é gravado automaticamente:**
- ✅ Cliques em botões, links, etc.
- ✅ Digitação em campos de texto
- ✅ Seleção em dropdowns
- ✅ Navegação entre páginas

---

## 🤖 Assistente de IA (Novo!)

### O que é?
O Assistente de IA do CyRecord usa **Google Gemini** para entender comandos em **linguagem natural** e convertê-los automaticamente em ações de teste!

### Como Usar:

1. **Localize a seção "🤖 Assistente de IA (Beta)"** no painel
2. **Digite comandos em português** na caixa de texto
3. **Clique em "Gerar Código a partir do Texto"**
4. **Aguarde o processamento** (alguns segundos)
5. **As ações são adicionadas automaticamente** à sua lista!

### Exemplos de Comandos:

#### ✅ Comandos Simples:
```
✅ "Clique no botão entrar"
✅ "Digite admin no campo usuário"  
✅ "Preencha 123 na senha"
✅ "Limpe o campo email"
```

#### ✅ Comandos Compostos:
```
✅ "Clique em login, digite admin no usuário e 123 na senha"
✅ "Preencha joão no nome e teste@email.com no email"
✅ "Clique no botão cadastrar e verifique se aparece sucesso"
```

#### ✅ Comandos Brasileiros:
```
✅ "Clique no campo nome completo e informe João Silva"
✅ "No celular digite 11999887766"
✅ "Preencha 05707001 no CEP"
✅ "Digite 123 na residência"
```

#### ✅ Comandos com Verificações:
```
✅ "Verifique se o botão continuar está habilitado"
✅ "Confirme se aparece bem-vindo na tela"
✅ "Verifique se o campo nome está visível"
✅ "Clique em login e veja se aparece erro"
```

### Como a IA Funciona:

1. **Processa seu texto** usando Google Gemini
2. **Identifica ações** (clicar, digitar, limpar)
3. **Identifica verificações** (visível, habilitado, texto, etc.)
4. **Encontra elementos** na página automaticamente
5. **Usa o sistema inteligente** para escolher o melhor seletor
6. **Adiciona à lista** como se você tivesse gravado manualmente

### Dicas para Melhores Resultados:

#### ✅ Faça:
- Use termos claros: "botão login", "campo email"
- Seja específico: "digite admin no usuário"
- Use português natural: "preencha", "clique", "digite"
- Inclua verificações: "verifique se", "confirme se"

#### ❌ Evite:
- Comandos vagos: "clique aí", "digite algo"
- Elementos inexistentes: "botão que não existe"
- Comandos muito complexos em uma linha

### Status e Feedback:
- 🤖 **Azul**: Processando comando...
- ✅ **Verde**: Comandos processados com sucesso!
- ❌ **Vermelho**: Erro ao processar
- 🔍 **Laranja**: Elemento não encontrado

---

## 🎯 Ações Manuais

### Menu de Contexto
Além da gravação automática e do Assistente de IA, você pode adicionar ações específicas:

**Como acessar:**
1. **Clique com o botão direito** em qualquer elemento da página
2. **Escolha uma opção** do menu "🎯 Ações e Asserções"

### Ações Disponíveis:

#### **⌨️ Digitar texto**
- **Quando usar**: Para adicionar digitação específica
- **Como**: Clique direito → "⌨️ Digitar texto" → Digite o conteúdo
- **Resultado**: `cy.get('seletor').type('seu texto');`

#### **🖱️ Clicar no elemento**
- **Quando usar**: Para adicionar clique específico
- **Como**: Clique direito → "🖱️ Clicar no elemento"
- **Resultado**: `cy.get('seletor').click();`

#### **🗑️ Limpar campo**
- **Quando usar**: Para limpar conteúdo de campos
- **Como**: Clique direito → "🗑️ Limpar campo"
- **Resultado**: `cy.get('seletor').clear();`

### Asserções Disponíveis:

#### **Asserções Básicas:**
- **👁️ Deve estar visível**: Verifica se elemento aparece na tela
- **✅ Deve existir**: Verifica se elemento existe no DOM
- **❌ Não deve existir**: Verifica se elemento NÃO existe
- **🚫 Deve estar desabilitado**: Verifica se está desabilitado
- **✅ Deve estar habilitado**: Verifica se está habilitado

#### **Asserções Avançadas:**
- **📝 Deve ter texto exato**: Verifica texto específico
- **🔍 Deve conter texto**: Verifica se contém determinado texto
- **🔗 Deve ter valor**: Verifica valor de campo

### Exemplo Prático:
```
1. Clique direito no campo email
2. Escolha "⌨️ Digitar texto" 
3. Digite "teste@exemplo.com"
4. Clique direito no botão
5. Escolha "👁️ Deve estar visível"

Resultado:
cy.get('#email').type('teste@exemplo.com');
cy.get('#botao').should('be.visible');
```

---

## 📊 Sistema de Seletores

### Como Funciona
O CyRecord usa um **sistema inteligente** que escolhe automaticamente o melhor seletor para cada elemento:

### Critérios de Pontuação:
- **data-cy** (100 pontos) - Melhor prática para testes
- **ID único** (95 pontos) - Identificador único
- **Atributos de teste** (90 pontos) - data-testid, data-test, etc.
- **Classes específicas** (80 pontos) - Classes não genéricas
- **Atributos semânticos** (75 pontos) - name, type, role
- **Texto único** (60 pontos) - Para elementos pequenos
- **Hierarquia DOM** (50-70 pontos) - Posição relativa

### Visualização da Qualidade:
- 🟢 **Verde (80-100)**: Alta qualidade, muito estável
- 🟠 **Laranja (60-79)**: Qualidade média, pode quebrar
- 🔴 **Vermelho (0-59)**: Baixa qualidade, evite usar

### Alternativas de Seletores:
1. **Clique em "Ver alternativas"** no menu de contexto
2. **Veja todas as opções** disponíveis
3. **Compare as pontuações** de cada alternativa
4. **Escolha a melhor** para seu caso
5. **O código é atualizado** automaticamente

---

## 🖥️ Interface Otimizada

### Painel Principal
O painel do CyRecord foi redesenhado para oferecer uma melhor experiência:

#### **Tamanho e Posicionamento:**
- **Tamanho inicial**: 600x800px (maior para exibir todo o conteúdo)
- **Posição padrão**: Canto inferior direito
- **Redimensionável**: Arraste as bordas para ajustar
- **Arrastável**: Clique e arraste o cabeçalho para mover

#### **Controles de Interface:**
- **🔄 Maximizar/Restaurar**: Botão no cabeçalho ou duplo clique
- **📏 Redimensionamento**: Handles em todas as bordas
- **❌ Fechar**: Botão X no cabeçalho
- **ℹ️ Informações**: Ícone de informação com tooltip

#### **Seções do Painel:**
1. **Cabeçalho**: Título, controles e informações
2. **Status da Gravação**: Botões iniciar/parar/reiniciar
3. **🤖 Assistente de IA**: Comandos em linguagem natural
4. **Campos Personalizados**: Funcionalidade, cenário, URL
5. **Área de Código**: Visualização do código gerado
6. **Exportação**: Nome do arquivo e botão de download

### Funcionalidades de Interface:

#### **Redimensionamento Inteligente:**
- **Mínimo**: 300x400px (garante funcionalidade)
- **Máximo**: 90% da tela (não sobrepõe conteúdo)
- **Proporcional**: Mantém proporções ao redimensionar
- **Snap**: Ajusta automaticamente aos limites da tela

#### **Posicionamento Flexível:**
- **Arrastar**: Clique no cabeçalho e arraste
- **Limites**: Não sai da área visível da tela
- **Restaurar**: Volta à posição padrão ao reiniciar
- **Persistência**: Mantém posição durante a sessão

#### **Feedback Visual:**
- **Hover**: Elementos destacam ao passar o mouse
- **Estados**: Cores diferentes para diferentes estados
- **Loading**: Indicadores visuais durante processamento
- **Erro**: Mensagens claras em caso de problemas

---

## 🔧 Funcionalidades Avançadas

### Campos Personalizados
Ao exportar o código, você pode preencher informações adicionais:

#### **Funcionalidade:**
- **O que é**: Nome da funcionalidade sendo testada
- **Exemplo**: "Login", "Cadastro", "Carrinho"
- **Uso**: Organização e documentação dos testes

#### **Nome do Cenário:**
- **O que é**: Descrição específica do cenário
- **Exemplo**: "Usuário faz login com sucesso"
- **Uso**: Identificação clara do teste

#### **URL:**
- **O que é**: Endereço da página testada
- **Exemplo**: "https://meusite.com/login"
- **Uso**: Referência para execução dos testes

### Reiniciar Gravação
- **Quando usar**: Quer começar uma nova gravação sem fechar o painel
- **Como**: Clique em "Reiniciar Gravação" durante a gravação
- **Resultado**: Limpa todas as ações e inicia nova gravação

### Sandbox de IA
- **O que é**: Ambiente isolado para processamento seguro
- **Vantagens**: Não interfere com a página principal
- **Segurança**: Comunicação via postMessage
- **Performance**: Processamento otimizado

---

## 💡 Dicas e Truques

### Para Melhores Seletores:

#### ✅ Use data-cy:
```html
<!-- Excelente para testes -->
<button data-cy="submit-button">Enviar</button>
```

#### ✅ IDs únicos:
```html
<!-- Muito estável -->
<input id="email" type="email" />
```

#### ✅ Classes específicas:
```html
<!-- Evite classes genéricas como 'btn' -->
<button class="login-submit-button">Entrar</button>
```

### Para Comandos de IA:

#### ✅ Seja específico:
```
✅ "Digite admin no campo usuário"
❌ "Digite algo no campo"
```

#### ✅ Use termos brasileiros:
```
✅ "Preencha o nome completo"
✅ "Digite no celular"
✅ "Informe o CEP"
```

#### ✅ Combine ações e verificações:
```
✅ "Clique em login e verifique se aparece bem-vindo"
✅ "Preencha dados e confirme se o botão está habilitado"
```

### Para Interface:

#### ✅ Aproveite o redimensionamento:
- Aumente o painel para ver mais código
- Redimensione conforme necessário
- Use maximizar para tela cheia

#### ✅ Organize o fluxo:
1. Use IA para comandos complexos
2. Grave ações simples automaticamente
3. Adicione verificações manuais
4. Preencha campos personalizados
5. Exporte o código final

---

## 🆘 Solução de Problemas

### Problemas Comuns:

#### **IA não funciona:**
- **Causa**: API Key não configurada
- **Solução**: Configure o arquivo `config.js`
- **Alternativa**: Use gravação manual

#### **Seletores quebram:**
- **Causa**: Elementos mudaram na página
- **Solução**: Use data-cy para maior estabilidade
- **Alternativa**: Verifique alternativas de seletores

#### **Painel não aparece:**
- **Causa**: Script não foi injetado
- **Solução**: Recarregue a página e tente novamente
- **Alternativa**: Verifique se a extensão está ativa

#### **Código não é gerado:**
- **Causa**: Nenhuma ação foi gravada
- **Solução**: Inicie a gravação e faça algumas ações
- **Alternativa**: Use o Assistente de IA

### Performance:

#### **Painel lento:**
- **Causa**: Muitas ações gravadas
- **Solução**: Reinicie a gravação periodicamente
- **Alternativa**: Use IA para comandos complexos

#### **IA demora:**
- **Causa**: Conexão lenta ou API sobrecarregada
- **Solução**: Aguarde alguns segundos
- **Alternativa**: Use gravação manual

### Compatibilidade:

#### **Site não funciona:**
- **Causa**: Site com proteções especiais
- **Solução**: Teste em outro site
- **Alternativa**: Use modo de desenvolvedor

#### **Chrome atualizado:**
- **Causa**: Extensão pode precisar de atualização
- **Solução**: Reinstale a extensão
- **Alternativa**: Verifique se há nova versão

---

## 🎯 Próximos Passos

### Aprenda Mais:
1. **Leia o [Guia Rápido](GUIA-RAPIDO.md)** para referência
2. **Veja o [Exemplo Prático](EXEMPLO-PRATICO.md)** para tutorial completo
3. **Explore as [Melhorias da IA](MELHORIAS-IA-VERIFICACOES.md)** para funcionalidades avançadas

### Práticas Recomendadas:
1. **Use data-cy** sempre que possível
2. **Combine IA + gravação** para melhor resultado
3. **Teste os seletores** antes de usar em produção
4. **Mantenha os testes atualizados** conforme o site evolui

### Recursos Adicionais:
- **Documentação técnica**: [explicacao-tecnica.md](../explicacao-tecnica.md)
- **Transparência**: [TRANSPARENCIA-TECNICA.md](../TRANSPARENCIA-TECNICA.md)
- **Manifest**: [manifest-documentation.md](../manifest-documentation.md)

---

**🎯 CyRecord - Transformando suas ações em testes Cypress de forma inteligente e eficiente!**

**Versão atual**: v1.3.0  
**Última atualização**: Interface otimizada com painel maior e melhor experiência do usuário
