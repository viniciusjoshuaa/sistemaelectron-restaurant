/*  
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data');

function ler(nome) {
  return JSON.parse(fs.readFileSync(path.join(dataPath, nome)));
}

function salvar(nome, dados) {
  fs.writeFileSync(path.join(dataPath, nome), JSON.stringify(dados, null, 2));
}

/* =====================
   CARDÁPIO
===================== 

function carregarCardapio() {
  const lista = document.getElementById("listaCardapio");
  if (!lista) return;

  lista.innerHTML = "";
  let dados = ler("cardapio.json");

  dados.forEach((item, index) => {
    lista.innerHTML += `
      <div>
        <b>${item.nome}</b><br>
        ${item.descricao}<br>
        <button onclick="editarPrato(${index})">Editar</button>
        <button onclick="removerPrato(${index})">Remover</button>
        <hr>
      </div>
    `;
  });
}

function adicionarPrato() {
  let nome = document.getElementById("nomePrato").value;
  let descricao = document.getElementById("descricaoPrato").value;

  let dados = ler("cardapio.json");
  dados.push({ nome, descricao });
  salvar("cardapio.json", dados);

  location.reload();
}

function removerPrato(i) {
  let dados = ler("cardapio.json");
  dados.splice(i, 1);
  salvar("cardapio.json", dados);
  location.reload();
}

function editarPrato(i) {
  let dados = ler("cardapio.json");
  let novoNome = prompt("Novo nome:", dados[i].nome);
  let novaDesc = prompt("Nova descrição:", dados[i].descricao);

  dados[i] = { nome: novoNome, descricao: novaDesc };
  salvar("cardapio.json", dados);
  location.reload();
}

/* =====================
   CARDÁPIO DO DIA
===================== 

async function carregarCardapioDia() {
  const produtos = await window.api.getProdutos()

  const lista = document.getElementById('listaCheckbox')
  lista.innerHTML = ''

  produtos.forEach((produto, index) => {
    lista.innerHTML += `
      <div>
        <input type="checkbox" id="prod${index}" value="${produto.nome}">
        <label for="prod${index}">
          <strong>${produto.nome}</strong><br>
          ${produto.descricao}
        </label>
      </div>
      <hr>
    `
  })
}

async function salvarCardapioDia() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')

  const selecionados = []

  checkboxes.forEach(cb => {
    selecionados.push(cb.value)
  })

  await window.api.saveCardapioDia(selecionados)

  alert("Cardápio do dia atualizado com sucesso!")
}


function salvarCardapioDia() {
  let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
  let selecionados = Array.from(checkboxes).map(c => c.value);

  salvar("cardapioDia.json", {
    data: new Date().toLocaleDateString(),
    itens: selecionados
  });

  alert("Cardápio do dia salvo!");
}

/* =====================
   CLIENTES
===================== 

function carregarClientes() {
  const lista = document.getElementById("listaClientes");
  if (!lista) return;

  lista.innerHTML = "";
  let dados = ler("clientes.json");

  dados.forEach((c, i) => {
    lista.innerHTML += `
      <div>
        <b>${c.nome}</b> - ${c.telefone}
        <button onclick="editarCliente(${i})">Editar</button>
        <hr>
      </div>
    `;
  });
}

function cadastrarCliente() {
  let nome = document.getElementById("nomeCliente").value;
  let telefone = document.getElementById("telefoneCliente").value;
  let endereco = document.getElementById("enderecoCliente").value;

  let dados = ler("clientes.json");
  dados.push({ nome, telefone, endereco });
  salvar("clientes.json", dados);

  location.reload();
}

function editarCliente(i) {
  let dados = ler("clientes.json");

  let novoNome = prompt("Nome:", dados[i].nome);
  let novoTel = prompt("Telefone:", dados[i].telefone);
  let novoEnd = prompt("Endereço:", dados[i].endereco);

  dados[i] = { nome: novoNome, telefone: novoTel, endereco: novoEnd };
  salvar("clientes.json", dados);

  location.reload();
}
 */