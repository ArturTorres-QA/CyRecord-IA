# 🎯 Exemplo Prático - CyRecord v3

> **Tutorial passo a passo: Como criar um teste de cadastro de usuário completo usando todas as funcionalidades do CyRecord**

## 📋 O que vamos criar

Vamos gravar um teste completo de **cadastro de usuário** em um formulário web, combinando:
- **🎬 Gravação automática** (navegação)
- **🤖 Assistente de IA** (preenchimento de campos)
- **🎯 Ações manuais** (verificações e asserções)

**Resultado final**: Teste Cypress robusto e completo!

---

## 🏗️ Preparação

### Cenário do Teste:
Vamos testar um formulário de cadastro com os campos:
- Nome completo
- Email
- Celular
- CEP
- Número da residência
- Botão "Cadastrar"

### Antes de começar:
1. ✅ CyRecord instalado e funcionando
2. ✅ Página de teste aberta no navegador
3. ✅ *(Opcional)* API Google Gemini configurada para IA

---

## 🎬 Passo 1: Gravação Automática (Navegação)

### O que vamos gravar automaticamente:
- Navegação até a página de cadastro
- Alguns cliques básicos

### Como fazer:

1. **Abra a página** do seu site
2. **Clique no ícone 🎯** do CyRecord
3. **Clique em "Iniciar Gravação"**
   
   ✨ *O painel aparece no canto da tela*

4. **Navegue até o formulário**:
   - Clique no menu "Usuários"
   - Clique em "Novo Cadastro"
   - *(Essas ações são gravadas automaticamente!)*

### O que aconteceu:
```javascript
// Código gerado automaticamente
cy.get('#menu-usuarios').click();
cy.get('#btn-novo-cadastro').click();
```

**Vantagem**: Navegação complexa gravada sem esforço!

---

## 🤖 Passo 2: Assistente de IA (Preenchimento)

### O que vamos fazer com IA:
Usar comandos em português para preencher o formulário

### Como usar:

1. **Localize a seção "🤖 Assistente de IA (Beta)"** no painel

2. **Digite o comando completo**:
   ```
   Clique no campo nome completo e informe João Silva, 
   digite joao@email.com no campo email,
   no celular informe 11999887766,
   preencha 05707001 no CEP,
   digite 123 no número da residência
   ```

3. **Clique em "Gerar Código a partir do Texto"**

4. **Aguarde o processamento** (alguns segundos)
   - Status: 🤖 "Processando comando..."
   - Status: ✅ "Comandos processados com sucesso!"

### O que aconteceu:

**IA processou e gerou**:
```javascript
// Código gerado pela IA
cy.get('#nomeCompleto').type('João Silva');
cy.get('#email').type('joao@email.com');
cy.get('#celular').type('11999887766');
cy.get('#cep').type('05707001');
cy.get('#numero').type('123');
```

**Vantagens**:
- ✅ Comando em português natural
- ✅ Encontrou elementos automaticamente
- ✅ Gerou código Cypress válido
- ✅ Sistema inteligente escolheu melhores seletores

---

## 🎯 Passo 3: Ações Manuais (Validações)

### O que vamos adicionar manualmente:
- Verificações e asserções para tornar o teste mais robusto

### Como fazer:

1. **Clique direito no botão "Cadastrar"**
   - Menu "🎯 Ações e Asserções" aparece

2. **Escolha "👁️ Deve estar visível"**
   - Verifica se o botão está visível
   - Sistema mostra: "Usa ID único (95 pontos)"

3. **Clique direito no botão novamente**
4. **Escolha "🖱️ Clicar no elemento"**
   - Adiciona clique manual

5. **Clique direito em uma área da página onde aparece mensagem de sucesso**
6. **Escolha "🔍 Deve conter texto"**
7. **Digite**: "Usuário cadastrado com sucesso"

### O que foi adicionado:
```javascript
// Ações manuais adicionadas
cy.get('#btn-cadastrar').should('be.visible');
cy.get('#btn-cadastrar').click();
cy.get('.mensagem-sucesso').should('contain.text', 'Usuário cadastrado com sucesso');
```

---

## 📊 Passo 4: Revisão do Sistema de Seletores

### Analisando a qualidade:

Na lista de ações, você vê:

1. **🖱️ Menu Usuários** (95 pontos) - Usa ID único
2. **🖱️ Botão Novo** (100 pontos) - Usa data-cy
3. **⌨️ Nome Completo** (95 pontos) - Usa ID único
4. **⌨️ Email** (90 pontos) - Usa data-testid
5. **⌨️ Celular** (85 pontos) - Usa name
6. **⌨️ CEP** (95 pontos) - Usa ID único
7. **⌨️ Número** (85 pontos) - Usa name
8. **👁️ Botão Cadastrar** (95 pontos) - Usa ID único
9. **🖱️ Clique Cadastrar** (95 pontos) - Usa ID único
10. **🔍 Mensagem Sucesso** (80 pontos) - Usa classe específica

### Ver alternativas:

1. **Clique "Ver alternativas"** no campo Email
2. **Modal abre** mostrando:
   ```
   🟢 [data-testid="email-input"] (90 pontos)
   🟡 #email (95 pontos) - Melhor opção!
   🟠 input[type="email"] (70 pontos)
   🔴 div:nth-child(3) > input (40 pontos)
   ```

3. **Mantenha a melhor opção** ou escolha outra

---

## 🔧 Passo 5: Código Final Gerado

### Visualizando o resultado:

O painel mostra o código completo:

```javascript
// Ação 1: Navegação para menu (gravação automática)
cy.get('#menu-usuarios').click();

// Ação 2: Botão novo cadastro (gravação automática)  
cy.get('[data-cy="btn-novo-usuario"]').click();

// Ação 3: Preenchimento nome (IA)
cy.get('#nomeCompleto').type('João Silva');

// Ação 4: Preenchimento email (IA)
cy.get('[data-testid="email-input"]').type('joao@email.com');

// Ação 5: Preenchimento celular (IA)
cy.get('[name="celular"]').type('11999887766');

// Ação 6: Preenchimento CEP (IA)
cy.get('#cep').type('05707001');

// Ação 7: Preenchimento número (IA)
cy.get('[name="numero"]').type('123');

// Ação 8: Verificação botão visível (manual)
cy.get('#btn-cadastrar').should('be.visible');

// Ação 9: Clique no botão (manual)
cy.get('#btn-cadastrar').click();

// Ação 10: Verificação sucesso (manual)
cy.get('.alert-success').should('contain.text', 'Usuário cadastrado com sucesso');
```

---

## 📁 Passo 6: Exportação

### Finalizando o teste:

1. **Clique em "Parar Gravação"**
2. **Digite nome do arquivo**: "cadastro-usuario-completo"
3. **Clique em "Exportar Código Cypress"**

### Arquivo gerado (cadastro-usuario-completo.cy.js):

```javascript
describe('Teste gerado pelo CyRecord', () => {
  it('cadastro-usuario-completo', () => {
    // Acesse a página antes de executar os testes
    // cy.visit('URL_DA_PAGINA');
    
    // Ação 1: Usa ID único
    cy.get('#menu-usuarios').click();
    
    // Ação 2: Usa data-cy (melhor prática)
    cy.get('[data-cy="btn-novo-usuario"]').click();
    
    // Ação 3: Usa ID único
    cy.get('#nomeCompleto').type('João Silva');
    
    // Ação 4: Usa data-testid
    cy.get('[data-testid="email-input"]').type('joao@email.com');
    
    // Ação 5: Usa name
    cy.get('[name="celular"]').type('11999887766');
    
    // Ação 6: Usa ID único
    cy.get('#cep').type('05707001');
    
    // Ação 7: Usa name
    cy.get('[name="numero"]').type('123');
    
    // Ação 8: Usa ID único
    cy.get('#btn-cadastrar').should('be.visible');
    
    // Ação 9: Usa ID único
    cy.get('#btn-cadastrar').click();
    
    // Ação 10: Usa classe específica
    cy.get('.alert-success').should('contain.text', 'Usuário cadastrado com sucesso');
  });
});
```

---

## 🎯 Análise do Resultado

### O que conseguimos:

✅ **Teste completo** de cadastro de usuário
✅ **Navegação automática** (cliques complexos gravados)
✅ **Preenchimento inteligente** via IA em português
✅ **Validações robustas** adicionadas manualmente
✅ **Seletores de alta qualidade** (média de 90+ pontos)
✅ **Código limpo e mantível**

### Vantagens do CyRecord v3:

1. **🎬 Gravação automática**: Capturou navegação complexa
2. **🤖 IA generativa**: Entendeu comando em português e encontrou campos
3. **🎯 Ações manuais**: Permitiu adicionar verificações específicas
4. **📊 Sistema inteligente**: Escolheu melhores seletores automaticamente
5. **🔍 Transparência**: Mostrou pontuação e alternativas

---

## 🚀 Próximos Passos

### Executando o teste:

1. **Ajuste a URL**:
   ```javascript
   cy.visit('https://seusite.com/cadastro');
   ```

2. **Execute no Cypress**:
   ```bash
   npx cypress open
   ```

3. **Rode o teste** e veja funcionando!

### Melhorias possíveis:

1. **Adicionar waits** se necessário:
   ```javascript
   cy.get('#btn-cadastrar').should('be.visible').click();
   cy.wait(2000); // Aguarda processamento
   ```

2. **Parametrizar dados**:
   ```javascript
   const userData = {
     nome: 'João Silva',
     email: 'joao@email.com',
     celular: '11999887766'
   };
   
   cy.get('#nomeCompleto').type(userData.nome);
   ```

3. **Adicionar cleanup**:
   ```javascript
   afterEach(() => {
     // Limpar dados de teste criados
   });
   ```

---

## 💡 Dicas do Exemplo

### ✅ O que funcionou bem:

- **Comando de IA claro**: Usou termos específicos dos campos
- **Combinação de métodos**: Gravação + IA + Manual
- **Seletores diversos**: Sistema escolheu diferentes estratégias
- **Verificações importantes**: Incluiu validações de sucesso

### 🔄 Melhorias possíveis:

- **Mais asserções**: Verificar se campos foram preenchidos
- **Tratamento de erro**: Validar mensagens de erro
- **Dados dinâmicos**: Usar dados diferentes a cada execução

### 🎯 Lições aprendidas:

1. **IA é ótima para formulários**: Comanda em português funcionou perfeitamente
2. **Gravação automática poupa tempo**: Navegação complexa sem esforço
3. **Ações manuais são essenciais**: Para verificações específicas
4. **Sistema de seletores é transparente**: Sempre mostra o porquê das escolhas

---

## 🎉 Resultado Final

**Em menos de 5 minutos**, criamos um teste Cypress completo e robusto que:

- ✅ Navega pela aplicação
- ✅ Preenche formulário complexo
- ✅ Valida o resultado
- ✅ Usa seletores de alta qualidade
- ✅ É fácil de manter e entender

**Código gerado**: 10 ações, 9 seletores únicos, qualidade média de 90+ pontos

---

## 🔗 Recursos Adicionais

- **[📖 Guia Completo](GUIA-COMPLETO-USUARIO.md)** - Para funcionalidades avançadas
- **[⚡ Guia Rápido](GUIA-RAPIDO.md)** - Para referência rápida
- **[🔧 Documentação Técnica](../explicacao-tecnica.md)** - Para desenvolvedores
- **[🔍 Transparência](../TRANSPARENCIA-TECNICA.md)** - Como o sistema funciona

---

**🎯 Parabéns! Você criou seu primeiro teste completo com CyRecord v3!**

*Agora você pode aplicar essas técnicas em qualquer aplicação web.* 