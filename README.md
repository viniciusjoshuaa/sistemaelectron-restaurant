# Mandir • Sistema de Operação para Restaurante

Aplicação desktop construída com Electron para centralizar a rotina operacional de restaurante em um único painel. O sistema reúne cadastro técnico de pratos, controle de insumos, precificação, gestão de mesas, acompanhamento de pedidos e visão de cozinha, reduzindo troca de contexto entre telas separadas.

## Visão geral

O produto foi estruturado para apoiar o fluxo diário do salão e da produção:

- painel inicial com acesso rápido às áreas principais
- cadastro de clientes para atendimento recorrente
- controle de insumos com base de custo técnico
- cadastro de pratos com ingredientes, custo e margem
- precificador com rateio de contas e valor sugerido
- gestão de mesas com mapa visual e pedido por mesa
- acompanhamento operacional de pedidos e cozinha

## Stack

- Electron
- HTML, CSS e JavaScript
- Persistência local em JSON
- Integração preparada para rotinas de WhatsApp e servidor local

## Demonstração visual

### Painel inicial
![Painel inicial](docs/screenshots/01-dashboard-real.png)

### Clientes
![Clientes](docs/screenshots/02-clientes-real.png)

### Insumos
![Insumos](docs/screenshots/03-insumos-real.png)

### Cadastro de pratos
![Cadastro de pratos](docs/screenshots/04-pratos-real.png)

### Precificador
![Precificador](docs/screenshots/05-precificador-real.png)

### Gestão de mesas
![Gestão de mesas](docs/screenshots/06-mesas-real.png)

### Cozinha
![Cozinha](docs/screenshots/08-cozinha-real.png)

## Fluxos cobertos

### Cadastro técnico de pratos
A tela de pratos permite montar a ficha técnica com ingredientes, quantidades e unidade de medida. O custo é calculado a partir dos insumos cadastrados e o preço sugerido é atualizado conforme a margem aplicada.

### Precificação operacional
O precificador reaproveita os pratos cadastrados e combina custo técnico com rateio de contas mensais, entregando um valor de venda sugerido por item.

### Operação de mesas
A tela de mesas permite cadastrar novas mesas sob demanda, marcar disponibilidade no mapa visual e abrir pedidos apenas pela lista central de seleção, reduzindo cliques acidentais.

### Produção e acompanhamento
A área de cozinha consolida os pedidos por status para facilitar preparo, priorização e conferência operacional.

## Estrutura do projeto

```text
assets/
  style.css
  theme.js
bot/
data/
docs/
  screenshots/
pages/
main.js
preload.js
index.html
```

## Como executar

```bash
npm install
npm start
```

## Observações

- O projeto usa persistência local para facilitar demonstração e testes.
- A página de mesas foi remodelada para suportar cadastro dinâmico e fluxo centralizado de pedidos.
- O tema escuro foi ajustado nas áreas principais, incluindo a listagem de pratos cadastrados.
