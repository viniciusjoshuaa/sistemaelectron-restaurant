# Manual do Usuário — Protótipo de Sistema para Restaurantes

## Objetivo

Este manual explica como instalar, iniciar e utilizar o protótipo do sistema em um cenário de operação de restaurante.

## Instalação

### Requisitos
- Node.js instalado
- npm instalado
- sistema operacional com suporte ao Electron

### Passos
1. Baixe ou clone o projeto.
2. Abra a pasta do projeto no terminal.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie a aplicação:
   ```bash
   npm start
   ```

## Primeiro acesso

Ao iniciar o sistema, a base local pode criar um usuário administrador padrão.

### Credenciais padrão
- **Usuário:** `admin`
- **Senha:** `admin`

> Recomendação: em uma evolução do sistema, altere esse comportamento para um fluxo de credenciais seguras.

## Tela inicial

Na tela inicial, o usuário pode navegar pelos módulos do sistema. O painel central foi pensado para concentrar os principais atalhos operacionais.

### Ações principais
- acessar cadastro de clientes
- acessar produtos, pratos e insumos
- abrir pedidos e cozinha
- publicar cardápio do dia
- abrir relatórios
- abrir precificador
- abrir WhatsApp
- abrir mesas
- alternar modo noturno no canto superior direito

## Como cadastrar dados básicos

### 1. Insumos
Cadastre todos os ingredientes e itens de base usados no restaurante.

Exemplos:
- arroz
- feijão
- carne
- temperos
- embalagem

### 2. Pratos
Cadastre os pratos e relacione seus ingredientes/insumos.

Objetivo:
- formar a ficha técnica básica
- calcular custo do prato
- usar o prato em cardápio e pedidos

### 3. Clientes
Cadastre clientes recorrentes para facilitar pedidos e histórico.

### 4. Contas
Cadastre despesas mensais e custos operacionais que serão usados no precificador.

## Como montar o cardápio do dia

1. Acesse **Cardápio do Dia**.
2. Selecione os pratos que estarão disponíveis.
3. Salve o cardápio.
4. O sistema poderá usar esse cardápio nas telas de pedido e no cardápio web.

## Como registrar pedidos

### Pedido local
1. Abra a tela de **Pedidos**.
2. Selecione cliente ou preencha os dados necessários.
3. Adicione os itens do pedido.
4. Salve o pedido.
5. O pedido ficará disponível para acompanhamento operacional.

### Pedido pelo cardápio cliente / cardápio web
1. Publique o cardápio atual.
2. Gere ou disponibilize o acesso online / QR Code.
3. O cliente seleciona os itens.
4. O pedido entra no fluxo do sistema conforme a implementação ativa.

## Como usar a tela de cozinha

A tela **Cozinha** foi feita para acompanhamento da produção.

### O que o usuário pode fazer
- visualizar pedidos pendentes
- filtrar por status
- ver detalhes do pedido
- imprimir cupom
- marcar pedido como pronto
- cancelar pedido

## Como usar o precificador

O **Precificador** ajuda a sugerir um valor final por prato com base em:
- custo do prato
- contas fixas / operacionais
- expectativa de pedidos no mês

### Fluxo sugerido
1. Garanta que pratos e contas já estejam cadastrados.
2. Abra o **Precificador**.
3. Escolha um prato.
4. Informe a estimativa de pedidos por mês.
5. Clique em calcular.
6. Analise o valor sugerido.

## Como usar a tela de mesas

A tela **Mesas** foi criada para operação de salão.

### Funcionamento
- 20 mesas pré-definidas
- status visual por cor
- clique em uma mesa para abrir o detalhamento
- seleção de cliente
- seleção de produtos/pratos
- registro de pedidos por mesa

### Status das mesas
- **Cinza:** sem informação / neutra
- **Verde:** disponível
- **Vermelho:** ocupada

## Como usar o WhatsApp

A tela **WhatsApp** deve ser tratada como área de configuração e demonstração do fluxo de atendimento.

### Cenários possíveis
- sessão local via WhatsApp Web
- integração oficial via API da Meta

### Importante
Para uso oficial em produção, a integração depende de:
- conta Business configurada
- número ativo
- token válido
- webhook público
- adequação às políticas da plataforma

## Impressora térmica

A configuração de impressão depende do ambiente local e da compatibilidade com a impressora instalada.

### Recomendações
- testar pela tela de configuração
- validar conexão USB/rede
- verificar drivers e permissões

## Backups

O sistema possui rotina de backup automático baseada em arquivos locais.

### Boa prática
- manter cópia externa dos arquivos importantes
- revisar periodicamente a pasta de backup
- não depender apenas do disco local

## Modo noturno

O sistema possui alternância de tema.

### Como usar
- clique no toggle no canto superior direito da tela inicial
- a preferência fica salva localmente
- as demais páginas passam a seguir o tema salvo

## Manutenção operacional recomendada

### Diariamente
- revisar cardápio do dia
- verificar pedidos pendentes
- validar funcionamento da cozinha
- testar fluxo do WhatsApp, se estiver em uso

### Semanalmente
- revisar relatórios
- validar cadastros inconsistentes
- conferir backups

### Mensalmente
- revisar contas
- recalcular preços no precificador
- atualizar pratos, estoque e fluxos de atendimento

## Limitações atuais do protótipo

- persistência local em JSON
- autenticação simples
- ausência de banco relacional
- integração externa ainda em nível de protótipo
- necessidade de endurecimento para produção real

## Sugestões para evolução futura

### Técnicas
- banco de dados
- autenticação forte
- logs de auditoria
- testes automatizados
- API separada

### Funcionais
- estoque com baixa automática
- reservas
- fechamento de caixa
- pagamentos
- delivery
- CRM e fidelidade

## Suporte interno

Para manutenção do projeto, recomenda-se que qualquer alteração em:
- páginas HTML
- estrutura dos arquivos JSON
- handlers do Electron
- integrações externas

seja documentada no README técnico do repositório.
