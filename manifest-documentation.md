# Documentação do manifest.json

Este arquivo configura a extensão "Artur QA" para o Chrome. Aqui está a explicação de cada seção:

## Configurações Básicas

- **manifest_version**: 3 - Versão do manifesto da extensão (Manifest V3 é a versão atual)
- **name**: "Artur QA" - Nome da extensão que aparece no Chrome
- **version**: "1.1" - Versão da extensão
- **description**: "Grava todas as ações e gera comandos Cypress ." - Descrição da extensão

## Permissões

- **scripting**: Permite injetar scripts nas páginas web
- **activeTab**: Acesso à aba ativa do navegador
- **tabs**: Acesso às abas do navegador

## Permissões de Host

- **host_permissions**: ["<all_urls>"] - Permite que a extensão funcione em qualquer site

## Service Worker

- **background**: Configuração do service worker em background
  - **service_worker**: "background.js" - Arquivo que roda em background

## Interface

- **action**: Configuração do ícone da extensão na barra de ferramentas
  - **default_title**: "Abrir painel de gravação" - Tooltip que aparece ao passar o mouse 