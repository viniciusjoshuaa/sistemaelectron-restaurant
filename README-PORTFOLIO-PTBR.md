# Restaurant Management Prototype (Protótipo de Sistema para Restaurantes)

> **Português (Brasil)**  
> Protótipo desktop para operação de restaurante, com foco em cadastro, produção, pedidos, cardápio digital, relatórios, precificação e integração com WhatsApp.

## Visão geral

Este projeto é um **protótipo funcional** de sistema para restaurantes, desenvolvido com **Electron + Node.js + HTML/CSS/JavaScript**, com persistência local em arquivos JSON.

O objetivo é demonstrar uma base realista para um sistema de operação de restaurante que possa evoluir para um produto comercial. O projeto reúne módulos para:

- gestão de clientes
- gestão de produtos e pratos
- controle de insumos e composição de receitas
- cardápio do dia
- pedidos locais e online
- tela de cozinha
- relatórios operacionais
- precificação de pratos
- geração de QR Code para cardápio online
- integração com impressora térmica
- fluxo de WhatsApp
- backup automático
- gestão visual de mesas
- modo noturno

## Stack técnica

### Base da aplicação
- **Electron** para a aplicação desktop
- **Node.js** para a camada principal e persistência local
- **HTML + CSS + JavaScript vanilla** para a interface
- **JSON files** como camada de armazenamento local

### Estrutura principal
- `main.js`: processo principal do Electron, registro de handlers IPC, backup, login, persistência, pedidos, cardápio, insumos, pratos e impressão
- `preload.js`: ponte segura entre frontend e processo principal
- `renderer.js`: scripts auxiliares de interface e renderização
- `server.js`: camada complementar para recursos online / integração de servidor
- `assets/style.css`: identidade visual global
- `assets/theme.js`: controle de modo claro/escuro
- `pages/*.html`: módulos operacionais do sistema
- `data/*.json`: persistência local
- `bot/whatsappManager.js`: gestão da sessão local do WhatsApp

## Arquitetura resumida

A aplicação usa uma arquitetura simples e adequada para prototipagem:

1. **Frontend em páginas HTML** para cada módulo operacional
2. **Camada de comunicação via IPC** entre interface e Electron
3. **Camada de persistência local** baseada em arquivos JSON
4. **Serviços locais** para impressão, backup, fluxo online e integrações

Essa abordagem facilita:
- implementação rápida
- testes locais
- baixa complexidade de infraestrutura
- demonstração de portfólio
- evolução gradual para banco de dados e API real

## Módulos disponíveis

### Operação e cadastro
- clientes
- produtos
- pratos
- insumos
- contas
- notas

### Fluxo de venda e produção
- pedidos
- pedidos do dia
- cozinha
- cardápio do dia
- cardápio web / QR Code
- mesas

### Gestão e apoio
- relatórios
- precificador
- configuração de impressora
- servidor online
- WhatsApp
- backup automático
- modo noturno

## Funcionalidades técnicas observadas no código

O projeto já possui, em sua base atual:

- criação da janela principal do Electron e carregamento do `index.html`
- rotina de backup automático em intervalo fixo e execução imediata na inicialização
- autenticação local com criação de usuário admin padrão
- CRUD local baseado em JSON para clientes, produtos, insumos, pratos e pedidos
- leitura e gravação do cardápio atual
- gestão de pedidos com status operacionais
- impressão de cupom com `electron-thermal-printer`
- geração/exportação de cardápio em arquivo texto
- relatórios baseados em período e itens vendidos
- tela de cozinha com filtros e ações por status

## Como instalar

### Pré-requisitos
- Node.js 18+ recomendado
- npm
- Windows recomendado para o fluxo atual de desktop local

### Passos
1. Clone o repositório:
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute em desenvolvimento:
   ```bash
   npm start
   ```
   ou o script equivalente definido no `package.json`.

> Observação: alguns recursos dependem de bibliotecas e configuração local específicas, como impressora térmica, QR Code e sessão do WhatsApp.

## Como utilizar

### Fluxo básico sugerido
1. Cadastre **insumos**
2. Cadastre **pratos** com sua composição
3. Configure **contas** e custos operacionais
4. Monte o **cardápio do dia**
5. Receba pedidos em **Pedidos**, **Cardápio Cliente**, **Cardápio Web** ou **Mesas**
6. Acompanhe a produção em **Cozinha**
7. Analise desempenho em **Relatórios**
8. Ajuste margens no **Precificador**

## Organização de dados

A versão atual usa persistência em JSON. Isso torna o projeto simples de executar, mas também traz limites importantes.

### Vantagens
- fácil de entender
- fácil de portar
- ótimo para protótipo
- sem necessidade de banco externo

### Limitações
- risco de concorrência de escrita
- menor escalabilidade
- auditoria limitada
- segurança básica
- dificuldade de uso multiusuário real

## Manutenção recomendada

### Curto prazo
- padronizar nomes de handlers IPC
- eliminar duplicações de lógica entre páginas
- revisar fluxos com variáveis globais/locales
- centralizar tema, navegação e componentes de UI
- documentar contratos de dados JSON

### Médio prazo
- migrar JSON para SQLite ou PostgreSQL
- introduzir camada de serviços e repositórios
- criar validação de dados com schema
- hash de senha e autenticação mais segura
- logs estruturados e trilha de auditoria
- testes automatizados de fluxo crítico

### Longo prazo
- dividir frontend e backend
- expor API REST ou GraphQL
- adicionar autenticação por perfis
- sincronização em rede/local cloud
- suporte multiunidade / multiloja
- observabilidade e monitoramento

## Escalabilidade

Para transformar este protótipo em um produto mais robusto, o caminho mais natural seria:

1. **Persistência**: migrar para banco relacional
2. **Backend**: separar a regra de negócio em API própria
3. **Autenticação**: implantar controle de acesso por função
4. **Integrações**: formalizar WhatsApp, pagamentos, delivery e fiscal
5. **Deploy**: preparar versões desktop e web
6. **Operação**: adicionar logs, backup versionado e recuperação

## Sugestões de implementações futuras

### Técnicas
- SQLite para ambiente local single-store
- PostgreSQL para ambiente multiusuário
- Prisma ou Knex como camada de acesso a dados
- testes com Playwright/Vitest/Jest
- CI/CD para build e release
- empacotamento com Electron Builder
- controle de erros com Sentry-like
- feature flags para módulos experimentais

### Funcionais para restaurantes
- ficha técnica mais avançada por prato
- controle de estoque com baixa automática
- CMV e margem por período
- mapa de salão com reservas
- impressão por setor (bar/cozinha/caixa)
- fechamento de caixa
- comandas parciais
- pagamentos integrados
- delivery próprio
- integração com marketplaces
- fidelidade / CRM
- promoções por horário
- controle de produção e perdas
- painel gerencial com KPIs

## WhatsApp: estado atual do protótipo

O projeto possui uma base de integração com WhatsApp, mas ela deve ser tratada como **protótipo**.

Há dois caminhos possíveis:

### 1) Sessão local via WhatsApp Web
Boa para demonstração e operação local, mas depende do ambiente local, sessão ativa e compatibilidade da biblioteca.

### 2) Integração oficial via WhatsApp Business Platform / Cloud API
Mais robusta, porém exige:
- conta Meta Business
- número habilitado
- token permanente
- webhook público HTTPS
- cumprimento das políticas da plataforma

## Pontos de atenção conhecidos

- O projeto ainda mistura responsabilidades entre páginas, handlers e scripts auxiliares.
- Algumas telas embutem estilos e lógicas localmente.
- O precificador original tinha inconsistência no carregamento de variáveis locais/globais.
- A persistência em JSON é suficiente para protótipo, mas não para operação complexa e concorrente.

## Para manter este projeto saudável

- manter a pasta `data/` versionada apenas quando necessário para seed de exemplo
- ignorar dados sensíveis reais no Git
- separar dados de demonstração dos dados operacionais
- revisar dependências periodicamente
- documentar toda nova página, handler e formato JSON criado
- evitar lógica crítica espalhada em múltiplas páginas

## Estrutura sugerida do repositório

```text
project-root/
├─ assets/
├─ bot/
├─ data/
├─ pages/
├─ main.js
├─ preload.js
├─ renderer.js
├─ server.js
├─ package.json
├─ README.md
├─ README-PORTFOLIO-PTBR.md
├─ README-PORTFOLIO-EN.md
├─ MANUAL-USUARIO-PTBR.md
└─ MANUAL-USER-EN.md
```

## Licença e finalidade

Este projeto é apresentado como **protótipo de portfólio** e base de estudo/evolução. Antes de uso comercial em produção, recomenda-se revisão arquitetural, endurecimento de segurança, padronização de dados e formalização das integrações externas.
