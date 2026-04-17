/* =========================
   PRODUTOS
========================= */

async function adicionarProduto() {
  const nome = prompt("Nome do prato:")
  if (!nome) return

  const descricao = prompt("Descrição:")

  await window.api.saveProduto({ nome, descricao })
  carregarProdutos()
}

async function carregarProdutos() {
  const lista = document.getElementById("listaProdutos")
  if (!lista) return

  const produtos = await window.api.getProdutos()
  lista.innerHTML = ""

  produtos.forEach((p) => {
    lista.innerHTML += `
      <div class="item-lista">
        <strong>${p.nome}</strong>
        <div class="acoes">
          <button onclick="editarProduto(${p.id})">✏️</button>
          <button onclick="removerProduto(${p.id})">🗑️</button>
        </div>
      </div>
    `
  })
}

async function removerProduto(id) {
  const produtos = await window.api.getProdutos()
  const novaLista = produtos.filter(p => p.id !== id)
  await window.api.updateProdutos(novaLista)
  carregarProdutos()
}

async function editarProduto(id) {
  const produtos = await window.api.getProdutos()
  const produto = produtos.find(p => p.id === id)

  const novoNome = prompt("Nome:", produto.nome)
  const novaDescricao = prompt("Descrição:", produto.descricao)

  if (!novoNome) return

  const novaLista = produtos.map(p =>
    p.id === id ? { ...p, nome: novoNome, descricao: novaDescricao } : p
  )

  await window.api.updateProdutos(novaLista)
  carregarProdutos()
}


/* =========================
   CLIENTES
========================= */

/* =========================
   CLIENTES
========================= */

async function adicionarCliente() {
  const nome = prompt("Nome:")
  if (!nome) return

  const telefone = prompt("Telefone:")
  const endereco = prompt("Endereço:")

  await window.api.saveCliente({ nome, telefone, endereco })
  carregarClientes()
}

async function carregarClientes() {
  const lista = document.getElementById("listaClientes")
  if (!lista) return

  const clientes = await window.api.getClientes()
  lista.innerHTML = ""

  clientes.forEach((c) => {
    lista.innerHTML += `
      <div class="item-lista">
        <div class="cliente-nome">
          <strong>${c.nome}</strong>
          <button class="btn-olho" onclick="verCliente(${c.id})">👁</button>
        </div>

        <div class="acoes">
          <button onclick="editarCliente(${c.id})">✏️</button>
          <button onclick="excluirCliente(${c.id})">🗑️</button>
        </div>
      </div>
    `
  })
}

async function editarCliente(id) {
  const clientes = await window.api.getClientes()
  const cliente = clientes.find(c => c.id === id)

  const novoNome = prompt("Nome:", cliente.nome)
  const novoTelefone = prompt("Telefone:", cliente.telefone)
  const novoEndereco = prompt("Endereço:", cliente.endereco)

  if (!novoNome) return

  const novaLista = clientes.map(c =>
    c.id === id
      ? { ...c, nome: novoNome, telefone: novoTelefone, endereco: novoEndereco }
      : c
  )

  await window.api.updateClientes(novaLista)
  carregarClientes()
}

async function excluirCliente(id) {
  if (!confirm("Deseja excluir este cliente?")) return

  await window.api.deleteCliente(id)
  carregarClientes()
}


/* =========================
   POPUP VISUALIZAR CLIENTE
========================= */

async function verCliente(id) {
  const clientes = await window.api.getClientes()
  const cliente = clientes.find(c => c.id === id)

  document.getElementById("popupNome").innerText = cliente.nome
  document.getElementById("popupTelefone").innerText = cliente.telefone || "-"
  document.getElementById("popupEndereco").innerText = cliente.endereco || "-"

  document.getElementById("popupCliente").classList.remove("hidden")
}

function fecharPopupCliente() {
  document.getElementById("popupCliente").classList.add("hidden")
}