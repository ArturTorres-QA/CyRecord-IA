# ⚡ Guia Rápido - CyRecord v1.3.0

> **Referência rápida para usar o CyRecord - Grave ações e gere testes Cypress automaticamente!**

## 🚀 Início Rápido

### 1. Instalação
```bash
# 1. Baixe a extensão
# 2. Abra chrome://extensions/
# 3. Ative "Modo desenvolvedor"
# 4. Clique "Carregar sem compactação"
# 5. Selecione a pasta do CyRecord
```

### 2. Primeira Gravação
```
1. Clique no ícone 🎯
2. Clique "Iniciar Gravação"
3. Navegue pelo site normalmente
4. Clique "Parar Gravação"
5. Preencha campos personalizados
6. Clique "Exportar Código Cypress"
```

### 3. Configuração da IA (Opcional)
```javascript
// Crie arquivo config.js na pasta da extensão:
const GOOGLE_API_KEY = 'sua-chave-aqui';
```

---

## 🎯 Funcionalidades Principais

### 🎬 Gravação Automática
- **Cliques**: Capturados automaticamente
- **Inputs**: Digitação registrada
- **Navegação**: Entre páginas

### 🤖 Assistente de IA
- **Comandos naturais**: "Clique em login e digite admin"
- **Verificações**: "Verifique se o botão está habilitado"
- **Processamento**: Google Gemini API

### 🎯 Ações Manuais
- **Botão direito** → Menu de ações
- **Ações**: Digitar, Clicar, Limpar
- **Asserções**: Visível, Habilitado, Texto, etc.

### 📊 Sistema de Seletores
- **Pontuação**: 0-100 (qualidade do seletor)
- **Cores**: 🟢 Verde (alta), 🟠 Laranja (média), 🔴 Vermelho (baixa)
- **Alternativas**: "Ver alternativas" para outras opções

---

## 🖥️ Interface

### Painel Principal
- **Tamanho**: 600x800px (redimensionável)
- **Posição**: Canto inferior direito (arrastável)
- **Controles**: Maximizar, redimensionar, fechar

### Seções do Painel
1. **Cabeçalho**: Título e controles
2. **Status**: Iniciar/Parar/Reiniciar gravação
3. **🤖 IA**: Comandos em linguagem natural
4. **Campos**: Funcionalidade, cenário, URL
5. **Código**: Visualização em tempo real
6. **Exportação**: Nome do arquivo e download

---

## 🤖 Comandos de IA

### ✅ Comandos Simples
```
"Clique no botão entrar"
"Digite admin no campo usuário"
"Preencha 123 na senha"
"Limpe o campo email"
```

### ✅ Comandos Compostos
```
"Clique em login, digite admin no usuário e 123 na senha"
"Preencha joão no nome e teste@email.com no email"
```

### ✅ Comandos com Verificações
```
"Verifique se o botão continuar está habilitado"
"Confirme se aparece bem-vindo na tela"
"Verifique se o campo nome está visível"
```

### ✅ Comandos Brasileiros
```
"Preencha o nome completo"
"Digite no celular"
"Informe o CEP"
"Digite na residência"
```

---

## 🎯 Ações Manuais

### Menu de Contexto (Botão Direito)

#### **Ações Disponíveis:**
- **⌨️ Digitar texto** → `cy.get('selector').type('texto')`
- **🖱️ Clicar no elemento** → `cy.get('selector').click()`
- **🗑️ Limpar campo** → `cy.get('selector').clear()`

#### **Asserções Básicas:**
- **👁️ Deve estar visível** → `cy.get('selector').should('be.visible')`
- **✅ Deve existir** → `cy.get('selector').should('exist')`
- **❌ Não deve existir** → `cy.get('selector').should('not.exist')`
- **🚫 Deve estar desabilitado** → `cy.get('selector').should('be.disabled')`
- **✅ Deve estar habilitado** → `cy.get('selector').should('be.enabled')`

#### **Asserções Avançadas:**
- **📝 Deve ter texto exato** → `cy.get('selector').should('have.text', 'valor')`
- **🔍 Deve conter texto** → `cy.get('selector').should('contain.text', 'valor')`
- **🔗 Deve ter valor** → `cy.get('selector').should('have.value', 'valor')`

---

## 📊 Sistema de Seletores

### Critérios de Pontuação
| Critério | Pontos | Descrição |
|----------|--------|-----------|
| `data-cy` | 100 | Melhor prática para testes |
| `id` | 95 | Identificador único |
| `data-testid` | 90 | Atributo específico para testes |
| `name` | 85 | Importante para formulários |
| Classes específicas | 80 | Classes não genéricas |
| `type`, `role` | 75 | Atributos semânticos |
| Texto único | 60 | Para elementos pequenos |
| Hierarquia DOM | 50-70 | Posição relativa |

### Visualização da Qualidade
- 🟢 **Verde (80-100)**: Alta qualidade, muito estável
- 🟠 **Laranja (60-79)**: Qualidade média, pode quebrar
- 🔴 **Vermelho (0-59)**: Baixa qualidade, evite usar

### Alternativas de Seletores
1. Clique "Ver alternativas" no menu
2. Compare pontuações
3. Escolha a melhor opção
4. Código atualiza automaticamente

---

## 🔧 Campos Personalizados

### Exportação de Código
Ao exportar, preencha:

#### **Funcionalidade:**
- **Exemplo**: "Login", "Cadastro", "Carrinho"
- **Uso**: Organização dos testes

#### **Nome do Cenário:**
- **Exemplo**: "Usuário faz login com sucesso"
- **Uso**: Identificação do teste

#### **URL:**
- **Exemplo**: "https://meusite.com/login"
- **Uso**: Referência para execução

---

## 💡 Dicas Rápidas

### Para Melhores Seletores
```html
<!-- ✅ Excelente -->
<button data-cy="submit-button">Enviar</button>

<!-- ✅ Muito bom -->
<input id="email" type="email" />

<!-- ✅ Bom -->
<button class="login-submit-button">Entrar</button>

<!-- ❌ Evite -->
<button class="btn">Enviar</button>
```

### Para Comandos de IA
```
✅ "Digite admin no campo usuário"
❌ "Digite algo no campo"

✅ "Preencha o nome completo"
✅ "Digite no celular"
✅ "Informe o CEP"
```

### Para Interface
- **Redimensione** o painel conforme necessário
- **Arraste** para reposicionar
- **Maximize** para tela cheia
- **Use duplo clique** no cabeçalho para maximizar

---

## 🆘 Solução de Problemas

### Problemas Comuns

#### **IA não funciona**
- **Causa**: API Key não configurada
- **Solução**: Configure `config.js`
- **Alternativa**: Use gravação manual

#### **Seletores quebram**
- **Causa**: Elementos mudaram na página
- **Solução**: Use `data-cy`
- **Alternativa**: Verifique alternativas

#### **Painel não aparece**
- **Causa**: Script não injetado
- **Solução**: Recarregue a página
- **Alternativa**: Verifique extensão ativa

#### **Código não gerado**
- **Causa**: Nenhuma ação gravada
- **Solução**: Inicie gravação
- **Alternativa**: Use IA

### Performance
- **Painel lento**: Reinicie gravação
- **IA demora**: Aguarde ou use gravação manual
- **Muitas ações**: Use IA para comandos complexos

---

## 🎯 Fluxo Recomendado

### 1. Planejamento
```
1. Defina o cenário de teste
2. Identifique elementos importantes
3. Planeje ações e verificações
```

### 2. Execução
```
1. Inicie gravação automática
2. Use IA para comandos complexos
3. Adicione verificações manuais
4. Preencha campos personalizados
5. Exporte o código
```

### 3. Validação
```
1. Execute o teste no Cypress
2. Verifique se os seletores funcionam
3. Ajuste conforme necessário
4. Integre ao pipeline de testes
```

---

## 📚 Recursos

### Documentação Completa
- **[Guia Completo](GUIA-COMPLETO-USUARIO.md)** - Tutorial detalhado
- **[Exemplo Prático](EXEMPLO-PRATICO.md)** - Caso de uso real
- **[Melhorias da IA](MELHORIAS-IA-VERIFICACOES.md)** - Funcionalidades avançadas

### Documentação Técnica
- **[Explicação Técnica](../explicacao-tecnica.md)** - Arquitetura e detalhes
- **[Transparência](../TRANSPARENCIA-TECNICA.md)** - Como funciona
- **[Manifest](../manifest-documentation.md)** - Configuração

### Links Úteis
- **[Google AI Studio](https://aistudio.google.com/app/apikey)** - API Key
- **[Documentação Cypress](https://docs.cypress.io/)** - Framework
- **[Chrome Extensions](chrome://extensions/)** - Gerenciamento

---

## 🚀 Versão Atual

**CyRecord v1.3.0**
- ✅ Interface otimizada (600x800px)
- ✅ Sistema de redimensionamento
- ✅ Assistente de IA completo
- ✅ Sistema inteligente de seletores
- ✅ Menu de ações e asserções
- ✅ Exportação com campos personalizados
- ✅ Sandbox de IA segura

---

**🎯 CyRecord - Transformando ações em testes Cypress de forma inteligente!** 