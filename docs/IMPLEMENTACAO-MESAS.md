# Implementação da nova página de Mesas

Este arquivo resume exatamente o que foi alterado para você conseguir reescrever a funcionalidade do zero no seu compilador.

## Arquivos alterados

- `pages/mesas.html`
- `main.js`
- `README.md`
- `docs/screenshots/*`

## O que mudou em `pages/mesas.html`

### 1. Fluxo novo da tela
A página foi refeita com três áreas principais:

- **Topo direito com botões simétricos**
  - `+` para cadastrar nova mesa
  - `⌗` para abrir o popup visual/buscador de mesas

- **Mapa visual**
  - popup com grade de pequenos quadrados
  - cada mesa alterna entre:
    - branco = `neutra`
    - verde = `disponivel`
    - vermelho = `ocupada`

- **Área central inferior**
  - lista scrollável de mesas
  - busca de produtos com filtro
  - inserção de itens no pedido
  - cliente, observação, total e ações finais

### 2. Regras de interação
- Clicar no mapa visual **não abre pedido**
- Pedido abre **somente** pela lista da parte inferior
- O modal fecha com:
  - botão Fechar
  - clique fora
  - tecla `ESC`

### 3. Funções principais adicionadas
- `cadastrarNovaMesa()`
- `abrirPopupMesas()`
- `fecharPopupMesas()`
- `alternarStatusMesa(id)`
- `selecionarMesaPorId(id)`
- `filtrarProdutos()`
- `adicionarProdutoAoPedido(pratoId)`
- `salvarPedidoMesa()`
- `marcarMesaDisponivel()`
- `liberarMesaAtual()`

## O que mudou em `main.js`

### Problema antigo
A função `getMesasPersistidas()` recriava o arquivo `mesas.json` quando a quantidade fosse diferente de 20.

Isso quebrava o fluxo de mesas dinâmicas.

### Solução aplicada
A lógica agora:
- cria 20 mesas padrão só se o arquivo estiver vazio ou inválido
- aceita quantidade variável de mesas
- normaliza cada registro antes de retornar
- mantém persistência das novas mesas cadastradas

## Contrato de dados da mesa

```json
{
  "id": 1,
  "nome": "Mesa 01",
  "status": "neutra",
  "clienteId": null,
  "clienteNome": "",
  "observacao": "",
  "itens": [],
  "atualizadoEm": null
}
```

## Handlers IPC usados pela nova tela

A nova página continua usando a lógica existente da aplicação:

- `window.api.getMesas()`
- `window.api.getClientes()`
- `window.api.getPratos()`
- `window.api.salvarEstadoMesas(mesas)`
- `window.api.registrarPedidoMesa(payload)`
- `window.api.liberarMesa(mesaId)`

## Ordem sugerida para reescrever do zero

1. Montar o HTML da página
2. Criar os botões quadrados do topo direito
3. Criar o popup com a grade visual de mesas
4. Implementar o ciclo de status
5. Implementar a lista central inferior das mesas
6. Conectar busca de produtos
7. Conectar lista de itens
8. Ligar os handlers IPC
9. Ajustar persistência no `main.js`

## Observação importante
Se você reescrever a página mas **não** alterar a lógica do `main.js`, as mesas novas podem sumir quando o app reiniciar.
