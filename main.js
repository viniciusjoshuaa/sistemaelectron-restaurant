const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const path = require("path")
const fs = require("fs")
let ThermalPrinter = null
let PrinterTypes = null
try {
  ({ ThermalPrinter, PrinterTypes } = require('electron-thermal-printer'))
} catch (error) {
  console.log('Impressão térmica opcional indisponível:', error.message)
}

const dataPath = path.join(__dirname, "data")
const backupPath = path.join(app.getPath('documents'), 'RestauranteBackup')

// Garantir que pastas existam
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true })
if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath, { recursive: true })

function getFile(file) {
  return path.join(dataPath, file)
}

function readJSON(file, fallback = []) {
  const filePath = getFile(file)
  if (!fs.existsSync(filePath)) return fallback
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    if (!raw.trim()) return fallback
    return JSON.parse(raw)
  } catch (error) {
    console.error(`Erro ao ler ${file}:`, error)
    return fallback
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(getFile(file), JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Erro ao escrever ${file}:`, error)
    return false
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets', 'logo.png')
  })

  win.loadFile("index.html")
}

function enviarEventoWhatsapp(event, payload = {}) {
  try {
    const windows = BrowserWindow.getAllWindows()
    windows.forEach(win => win.webContents.send('whatsapp-event', { event, payload }))
  } catch (error) {
    console.error('Erro ao enviar evento do WhatsApp para a interface:', error)
  }
}

app.whenReady().then(() => {
  createWindow()
  iniciarBackupAutomatico()
  try {
    iniciarSessao('mandir_principal', enviarEventoWhatsapp)
  } catch (error) {
    console.log('WhatsApp local ainda não inicializado:', error.message)
  }
})

// =============================
// BACKUP AUTOMÁTICO
// =============================
function fazerBackup() {
  try {
    const dataDir = dataPath
    const files = fs.readdirSync(dataDir)
    const timestamp = Date.now()
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const sourcePath = path.join(dataDir, file)
        const destPath = path.join(backupPath, `${timestamp}-${file}`)
        fs.copyFileSync(sourcePath, destPath)
      }
    })
    console.log(`Backup realizado em ${new Date().toLocaleString()}`)
    return true
  } catch (error) {
    console.error('Erro no backup:', error)
    return false
  }
}

function iniciarBackupAutomatico() {
  setInterval(fazerBackup, 60 * 60 * 1000)
  fazerBackup()
}

ipcMain.handle("fazer-backup-agora", () => {
  return fazerBackup()
})

// =============================
// USUÁRIOS / LOGIN
// =============================
ipcMain.handle("login", (e, usuario, senha) => {
  let usuarios = readJSON("usuarios.json")
  
  if (usuarios.length === 0) {
    const admin = {
      id: 1,
      usuario: "admin",
      senha: "admin",
      nome: "Administrador",
      tipo: "admin"
    }
    usuarios = [admin]
    writeJSON("usuarios.json", usuarios)
  }
  
  const user = usuarios.find(u => u.usuario === usuario && u.senha === senha)
  if (user) {
    const { senha, ...userSemSenha } = user
    return userSemSenha
  }
  return null
})

// =============================
// PRODUTOS
// =============================
ipcMain.handle("get-produtos", () => readJSON("produtos.json"))

ipcMain.handle("save-produto", (e, produto) => {
  const produtos = readJSON("produtos.json")
  produto.id = Date.now()
  produtos.push(produto)
  writeJSON("produtos.json", produtos)
  return produto
})

ipcMain.handle("update-produtos", (e, lista) => {
  return writeJSON("produtos.json", lista)
})

ipcMain.handle("delete-produto", (e, id) => {
  let produtos = readJSON("produtos.json")
  produtos = produtos.filter(p => p.id !== id)
  return writeJSON("produtos.json", produtos)
})

// =============================
// CLIENTES
// =============================
ipcMain.handle("get-clientes", () => readJSON("clientes.json"))

ipcMain.handle("save-cliente", (e, cliente) => {
  const clientes = readJSON("clientes.json")
  cliente.id = Date.now()
  cliente.dataCadastro = new Date().toLocaleDateString()
  clientes.push(cliente)
  writeJSON("clientes.json", clientes)
  return cliente
})

ipcMain.handle("update-clientes", (e, listaAtualizada) => {
  return writeJSON("clientes.json", listaAtualizada)
})

ipcMain.handle("delete-cliente", (e, id) => {
  let clientes = readJSON("clientes.json")
  clientes = clientes.filter(c => c.id !== id)
  return writeJSON("clientes.json", clientes)
})

// =============================
// CARDÁPIO ATUAL
// =============================
ipcMain.handle("get-cardapio-atual", () => {
  console.log("🔍 [SERVER] get-cardapio-atual foi chamado!")
  
  const filePath = getFile("cardapioAtual.json")
  console.log("📁 Caminho do arquivo:", filePath)
  
  if (!fs.existsSync(filePath)) {
    console.log("❌ Arquivo não existe!")
    return null
  }
  
  try {
    const conteudo = fs.readFileSync(filePath, 'utf8')
    console.log("📄 Conteúdo do arquivo:", conteudo)
    
    const data = JSON.parse(conteudo)
    
    if (data && data.itens) {
      console.log(`✅ Cardápio encontrado com ${data.itens.length} itens`)
      return data
    } else if (Array.isArray(data)) {
      return {
        data: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        itens: data
      }
    }
    
    return null
  } catch (error) {
    console.error("❌ Erro ao ler cardápio:", error)
    return null
  }
})

ipcMain.handle("save-cardapio-atual", (e, data) => {
  try {
    const filePath = getFile("cardapioAtual.json")
    
    if (data === null) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      return true
    }
    
    const cardapioToSave = {
      data: data.data || new Date().toLocaleDateString(),
      hora: data.hora || new Date().toLocaleTimeString(),
      itens: data.itens || []
    }
    
    fs.writeFileSync(filePath, JSON.stringify(cardapioToSave, null, 2))
    console.log("✅ Cardápio salvo com sucesso:", cardapioToSave)
    return true
  } catch (error) {
    console.error("❌ Erro ao salvar cardápio:", error)
    return false
  }
})

// =============================
// HISTÓRICO
// =============================
ipcMain.handle("salvar-historico-final", (e, registro) => {
  const historico = readJSON("historico.json")
  registro.id = Date.now()
  historico.push(registro)
  return writeJSON("historico.json", historico)
})

ipcMain.handle("get-historico-final", () => readJSON("historico.json"))

// =============================
// PEDIDOS (APENAS UMA VEZ!)
// =============================

// Função de impressão
async function imprimirCupom(pedido) {
  try {
    if (!ThermalPrinter || !PrinterTypes) {
      console.log('⚠️ Biblioteca de impressão térmica não instalada. Pedido salvo sem impressão.')
      return false
    }

    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: 'usb',
      width: 48,
      characterSet: 'PC850_MULTILINGUAL'
    })

    const isConnected = await printer.isPrinterConnected()
    if (!isConnected) {
      console.log('⚠️ Impressora não conectada')
      return false
    }

    printer
      .alignCenter()
      .println('==============================')
      .println('RESTAURANTE')
      .println('==============================')
      .alignLeft()
      .println(`Data: ${pedido.data}`)
      .println(`Hora: ${pedido.hora}`)
      .println(`Pedido Nº: #${pedido.id.toString().slice(-6)}`)
      .println('------------------------------')
      .println('ITENS DO PEDIDO:')
      .println('------------------------------')

    const itensAgrupados = {}
    pedido.itens.forEach(item => {
      itensAgrupados[item] = (itensAgrupados[item] || 0) + 1
    })

    Object.entries(itensAgrupados).forEach(([item, qtd]) => {
      printer.println(`${qtd}x ${item}`)
    })

    if (pedido.observacao) {
      printer.println('------------------------------')
      printer.println('OBSERVAÇÕES:')
      printer.println(pedido.observacao)
    }

    printer
      .println('------------------------------')
      .alignCenter()
      .println('Obrigado pela preferência!')
      .println('==============================')
      .cut()
      .beep()

    await printer.execute()
    console.log('✅ Cupom impresso com sucesso!')
    return true

  } catch (error) {
    console.error('❌ Erro na impressão:', error)
    return false
  }
}

// Handler ÚNICO para save-pedido
ipcMain.handle("save-pedido", async (e, pedido) => {
  console.log("📝 Recebendo pedido:", pedido)
  
  const pedidos = readJSON("pedidos.json")
  pedido.id = Date.now()
  pedido.timestamp = Date.now()
  pedidos.push(pedido)
  writeJSON("pedidos.json", pedidos)
  
  // IMPRIMIR AUTOMATICAMENTE (opcional - pode falhar sem afetar o pedido)
  imprimirCupom(pedido).then(sucesso => {
    if (sucesso) {
      console.log(`📄 Cupom do pedido #${pedido.id} impresso`)
    } else {
      console.log(`⚠️ Impressora não disponível para o pedido #${pedido.id}`)
    }
  })
  
  return pedido
})

ipcMain.handle("get-pedidos", () => readJSON("pedidos.json"))

ipcMain.handle("get-pedidos-hoje", () => {
  const pedidos = readJSON("pedidos.json")
  const hoje = new Date().toLocaleDateString('pt-BR')
  return pedidos.filter(p => p.data === hoje).sort((a, b) => b.timestamp - a.timestamp)
})

ipcMain.handle("get-pedidos-pendentes", () => {
  const pedidos = readJSON("pedidos.json")
  return pedidos.filter(p => p.status !== "entregue" && p.status !== "cancelado")
    .sort((a, b) => b.timestamp - a.timestamp)
})

ipcMain.handle("atualizar-status-pedido", (e, id, status) => {
  const pedidos = readJSON("pedidos.json")
  const index = pedidos.findIndex(p => p.id === id)
  if (index !== -1) {
    pedidos[index].status = status
    writeJSON("pedidos.json", pedidos)
    return true
  }
  return false
})

// Handler para testar impressora
ipcMain.handle("testar-impressora", async () => {
  return await imprimirCupom({
    id: Date.now(),
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR'),
    itens: ['Teste de Impressão'],
    observacao: 'Teste de configuração'
  })
})

// =============================
// RELATÓRIOS
// =============================
ipcMain.handle("gerar-relatorio-vendas", (e, dataInicio, dataFim) => {
  const pedidos = readJSON("pedidos.json")
  
  const inicio = new Date(dataInicio)
  const fim = new Date(dataFim)
  fim.setHours(23, 59, 59)
  
  const pedidosPeriodo = pedidos.filter(p => {
    const partes = p.data.split('/')
    const dataPedido = new Date(partes[2], partes[1] - 1, partes[0])
    return dataPedido >= inicio && dataPedido <= fim
  })
  
  const itensVendidos = {}
  pedidosPeriodo.forEach(pedido => {
    pedido.itens.forEach(item => {
      itensVendidos[item] = (itensVendidos[item] || 0) + 1
    })
  })
  
  const itensMaisVendidos = Object.entries(itensVendidos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([nome, quantidade]) => ({ nome, quantidade }))
  
  const relatorio = {
    periodo: {
      inicio: dataInicio,
      fim: dataFim
    },
    totalPedidos: pedidosPeriodo.length,
    itensMaisVendidos,
    pedidosPorStatus: {
      pendente: pedidosPeriodo.filter(p => p.status === "pendente").length,
      preparando: pedidosPeriodo.filter(p => p.status === "preparando").length,
      pronto: pedidosPeriodo.filter(p => p.status === "pronto").length,
      entregue: pedidosPeriodo.filter(p => p.status === "entregue").length,
      cancelado: pedidosPeriodo.filter(p => p.status === "cancelado").length
    }
  }
  
  return relatorio
})

// =============================
// GERAR PDF
// =============================
ipcMain.handle("gerar-pdf-cardapio", async (e, cardapio) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Salvar Cardápio',
    defaultPath: `cardapio-${cardapio.data.replace(/\//g, '-')}.txt`,
    filters: [
      { name: 'Arquivo de Texto', extensions: ['txt'] }
    ]
  })
  
  if (filePath) {
    let conteudo = `CARDÁPIO DO DIA - ${cardapio.data}\n`
    conteudo += `Hora: ${cardapio.hora}\n`
    conteudo += `================================\n\n`
    
    cardapio.itens.forEach((item, i) => {
      const nome = item.nome || item
      const descricao = item.descricao || ''
      conteudo += `${i+1}. ${nome}\n`
      if (descricao) conteudo += `   ${descricao}\n`
      conteudo += `\n`
    })
    
    fs.writeFileSync(filePath, conteudo, 'utf8')
    return true
  }
  return false
})

console.log("✅ Todos os handlers registrados com sucesso!")
console.log("- save-pedido (único)")
console.log("- get-cardapio-atual")
console.log("- save-cardapio-atual")
// ... outros handlers

// =============================
// INSUMOS (INGREDIENTES)
// =============================
ipcMain.handle("get-insumos", () => readJSON("insumos.json"))

ipcMain.handle("save-insumo", (e, insumo) => {
  const insumos = readJSON("insumos.json")
  insumo.id = Date.now()
  insumos.push(insumo)
  writeJSON("insumos.json", insumos)
  return insumo
})

ipcMain.handle("update-insumo", (e, id, insumo) => {
  const insumos = readJSON("insumos.json")
  const index = insumos.findIndex(i => i.id === id)
  if (index !== -1) {
    insumos[index] = { ...insumos[index], ...insumo }
    writeJSON("insumos.json", insumos)
    return true
  }
  return false
})

ipcMain.handle("delete-insumo", (e, id) => {
  let insumos = readJSON("insumos.json")
  insumos = insumos.filter(i => i.id !== id)
  return writeJSON("insumos.json", insumos)
})

// =============================
// PRATOS COM RECEITA (ATUALIZADO)
// =============================
ipcMain.handle("get-pratos", () => readJSON("pratos.json"))

ipcMain.handle("save-prato", (e, prato) => {
  const pratos = readJSON("pratos.json")
  
  // Calcular custo total do prato
  let custoTotal = 0
  const insumos = readJSON("insumos.json")
  
  prato.ingredientes.forEach(ing => {
    const insumo = insumos.find(i => i.id === ing.insumoId)
    if (insumo) {
      // Converter quantidade para kg (se veio em gramas)
      const quantidadeKg = ing.unidade === 'g' ? ing.quantidade / 1000 : 
                           ing.unidade === 'ml' ? ing.quantidade / 1000 : 
                           ing.quantidade
      custoTotal += quantidadeKg * insumo.precoKg
    }
  })
  
  // Calcular preço de venda baseado na margem de lucro
  const margemLucro = prato.margemLucro || 30 // 30% padrão
  const precoVenda = custoTotal * (1 + margemLucro / 100)
  
  prato.custoTotal = custoTotal
  prato.margemLucro = margemLucro
  prato.precoVenda = precoVenda
  prato.id = Date.now()
  
  pratos.push(prato)
  writeJSON("pratos.json", pratos)
  return prato
})

ipcMain.handle("update-prato", (e, id, prato) => {
  const pratos = readJSON("pratos.json")
  const index = pratos.findIndex(p => p.id === id)
  if (index !== -1) {
    // Recalcular custo
    let custoTotal = 0
    const insumos = readJSON("insumos.json")
    
    prato.ingredientes.forEach(ing => {
      const insumo = insumos.find(i => i.id === ing.insumoId)
      if (insumo) {
        const quantidadeKg = ing.unidade === 'g' ? ing.quantidade / 1000 : 
                             ing.unidade === 'ml' ? ing.quantidade / 1000 : 
                             ing.quantidade
        custoTotal += quantidadeKg * insumo.precoKg
      }
    })
    
    // Recalcular preço de venda
    const margemLucro = prato.margemLucro || 30
    const precoVenda = custoTotal * (1 + margemLucro / 100)
    
    prato.custoTotal = custoTotal
    prato.precoVenda = precoVenda
    
    pratos[index] = { ...pratos[index], ...prato }
    writeJSON("pratos.json", pratos)
    return true
  }
  return false
})

ipcMain.handle("delete-prato", (e, id) => {
  let pratos = readJSON("pratos.json")
  pratos = pratos.filter(p => p.id !== id)
  return writeJSON("pratos.json", pratos)
})

// =============================
// NOTAS FISCAIS (COMPRAS)
// =============================
ipcMain.handle("get-notas", () => readJSON("notas.json"))

ipcMain.handle("save-nota", (e, nota) => {
  const notas = readJSON("notas.json")
  nota.id = Date.now()
  nota.itens = Array.isArray(nota.itens) ? nota.itens : []
  
  // Para cada item da nota, atualizar o preço do insumo
  const insumos = readJSON("insumos.json")
  
  nota.itens.forEach(item => {
    if (!item || !item.insumoId || !item.quantidadeKg || item.quantidadeKg <= 0 || !item.valorTotal) return
    const insumo = insumos.find(i => i.id === item.insumoId)
    if (insumo) {
      // Atualizar preço médio
      const precoAntigo = insumo.precoKg || 0
      const quantidadeAntiga = insumo.estoqueKg || 0
      const quantidadeNova = item.quantidadeKg
      const precoNovo = item.valorTotal / item.quantidadeKg
      
      // Média ponderada
      if (quantidadeAntiga + quantidadeNova > 0) {
        insumo.precoKg = ((precoAntigo * quantidadeAntiga) + (precoNovo * quantidadeNova)) / (quantidadeAntiga + quantidadeNova)
      }
      
      // Atualizar estoque
      insumo.estoqueKg = (insumo.estoqueKg || 0) + quantidadeNova
    }
  })
  
  writeJSON("insumos.json", insumos)
  notas.push(nota)
  writeJSON("notas.json", notas)
  return nota
})

// =============================
// SERVIDOR WEB E QR CODE
// =============================
const QRCode = require('qrcode')
const os = require('os')
let serverProcess = null

// Função para obter IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

// Iniciar servidor web
ipcMain.handle("iniciar-servidor", async () => {
  if (serverProcess) {
    return { success: false, message: 'Servidor já está rodando' }
  }

  try {
    const { spawn } = require('child_process')
    const serverPath = path.join(__dirname, 'server.js')
    
    serverProcess = spawn('node', [serverPath], {
      cwd: __dirname,
      stdio: 'inherit'
    })

    serverProcess.on('error', (error) => {
      console.error('Erro no servidor:', error)
      serverProcess = null
    })

    serverProcess.on('exit', (code) => {
      console.log(`Servidor encerrado com código ${code}`)
      serverProcess = null
    })

    // Aguardar um pouco para o servidor iniciar
    await new Promise(resolve => setTimeout(resolve, 2000))

    const ip = getLocalIP()
    const url = `http://${ip}:3000`

    return {
      success: true,
      url: url,
      ip: ip,
      port: 3000
    }
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error)
    serverProcess = null
    return {
      success: false,
      message: error.message
    }
  }
})

// Parar servidor web
ipcMain.handle("parar-servidor", () => {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
    return { success: true }
  }
  return { success: false, message: 'Servidor não está rodando' }
})

// Gerar QR Code
ipcMain.handle("gerar-qrcode", async (e, url) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e7e34',
        light: '#ffffff'
      }
    })
    return { success: true, qrCode: qrCodeDataURL }
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    return { success: false, message: error.message }
  }
})

// Status do servidor
ipcMain.handle("status-servidor", () => {
  return {
    rodando: serverProcess !== null
  }
})

// =============================
// CONTAS (FIXAS E PESSOAL)
// =============================
ipcMain.handle("get-contas", () => {
  return readJSON("contas.json") || []
})

ipcMain.handle("save-conta", (e, conta) => {
  const contas = readJSON("contas.json") || []
  const novaConta = { ...conta, id: conta.id || Date.now() }
  contas.push(novaConta)
  writeJSON("contas.json", contas)
  return novaConta
})

ipcMain.handle("update-conta", (e, id, contaAtualizada) => {
  const contas = readJSON("contas.json") || []
  const index = contas.findIndex(c => c.id == id)
  
  if (index !== -1) {
    contas[index] = { ...contas[index], ...contaAtualizada }
    writeJSON("contas.json", contas)
    return contas[index]
  }
  
  return null
})

ipcMain.handle("delete-conta", (e, id) => {
  const contas = readJSON("contas.json") || []
  const novasContas = contas.filter(c => c.id != id)
  writeJSON("contas.json", novasContas)
  return true
})

const { iniciarSessao, iniciarBotWhatsapp } = require('./bot/whatsappManager');



const fluxoPath = path.join(__dirname, 'data', 'fluxos.json');

function normalizarTextoFluxo(texto = '') {
  return String(texto || '').trim().toLowerCase()
}

function resolverRespostaFluxo(fluxo, texto) {
  const entrada = normalizarTextoFluxo(texto)
  const mapa = fluxo && typeof fluxo === 'object' ? fluxo : {}

  if (!Object.keys(mapa).length) return { chave: null, bloco: null }

  if (mapa[entrada]) return { chave: entrada, bloco: mapa[entrada] }

  for (const [chave, bloco] of Object.entries(mapa)) {
    if (!bloco || typeof bloco !== 'object') continue
    const keywords = Array.isArray(bloco.keywords) ? bloco.keywords.map(normalizarTextoFluxo) : []
    const contains = Array.isArray(bloco.contains) ? bloco.contains.map(normalizarTextoFluxo) : []

    if (keywords.includes(entrada)) return { chave, bloco }
    if (contains.some(token => token && entrada.includes(token))) return { chave, bloco }
  }

  if (mapa.inicio) return { chave: 'inicio', bloco: mapa.inicio }
  return { chave: null, bloco: null }
}

// GET fluxo
ipcMain.handle('get-fluxo', async () => {
  if (!fs.existsSync(fluxoPath)) {
    fs.writeFileSync(fluxoPath, JSON.stringify({}, null, 2))
  }
  const data = fs.readFileSync(fluxoPath, 'utf-8');
  return JSON.parse(data || '{}');
});

// SAVE fluxo


ipcMain.handle('save-fluxo', async (event, novoFluxo) => {
  fs.writeFileSync(fluxoPath, JSON.stringify(novoFluxo, null, 2));
  return true;
});

ipcMain.handle('simular-fluxo-whatsapp', async (event, texto) => {
  const fluxo = readJSON('fluxos.json', {})
  const { chave, bloco } = resolverRespostaFluxo(fluxo, texto)
  return {
    entrada: texto,
    chaveResolvida: chave,
    resposta: bloco?.mensagem || null,
    bloco: bloco || null
  }
})

ipcMain.on('iniciar-whatsapp', () => {
  iniciarBotWhatsapp('mandir_principal', enviarEventoWhatsapp);
});

ipcMain.handle('salvarFluxo', async (event, fluxo) => {
  fs.writeFileSync('./bot/fluxo.json', JSON.stringify(fluxo, null, 2))
  return true
});


function gerarMesasPadrao() {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    nome: `Mesa ${String(index + 1).padStart(2, '0')}`,
    status: 'neutra',
    clienteId: null,
    clienteNome: '',
    observacao: '',
    itens: [],
    atualizadoEm: null
  }))
}

function normalizarMesa(mesa, fallbackId) {
  const id = Number(mesa?.id || fallbackId)
  return {
    id,
    nome: mesa?.nome || `Mesa ${String(id).padStart(2, '0')}`,
    status: mesa?.status || 'neutra',
    clienteId: mesa?.clienteId || null,
    clienteNome: mesa?.clienteNome || '',
    observacao: mesa?.observacao || '',
    itens: Array.isArray(mesa?.itens) ? mesa.itens : [],
    atualizadoEm: mesa?.atualizadoEm || null
  }
}

function getMesasPersistidas() {
  const mesas = readJSON('mesas.json')
  if (!Array.isArray(mesas) || mesas.length === 0) {
    const padrao = gerarMesasPadrao()
    writeJSON('mesas.json', padrao)
    return padrao
  }

  const normalizadas = mesas.map((mesa, index) => normalizarMesa(mesa, index + 1)).sort((a, b) => a.id - b.id)
  writeJSON('mesas.json', normalizadas)
  return normalizadas
}

ipcMain.handle('get-mesas', () => {
  return getMesasPersistidas()
})

ipcMain.handle('salvar-estado-mesas', (e, mesas) => {
  return writeJSON('mesas.json', mesas)
})

ipcMain.handle('registrar-pedido-mesa', (e, payload) => {
  const pedidos = readJSON('pedidos.json') || []
  const mesas = getMesasPersistidas()

  const pedido = {
    id: Date.now(),
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR'),
    cliente: {
      id: payload.clienteId || null,
      nome: payload.clienteNome || 'Consumidor da mesa'
    },
    itens: (payload.itens || []).flatMap(item => Array.from({ length: Number(item.quantidade || 1) }, () => item.nome)),
    itensDetalhados: payload.itens || [],
    observacao: payload.observacao || '',
    status: 'pendente',
    origem: 'mesa',
    mesaId: payload.mesaId,
    mesaNome: payload.mesaNome,
    timestamp: Date.now()
  }

  pedidos.push(pedido)
  writeJSON('pedidos.json', pedidos)

  const index = mesas.findIndex(m => Number(m.id) === Number(payload.mesaId))
  if (index !== -1) {
    mesas[index] = {
      ...mesas[index],
      status: 'ocupada',
      clienteId: payload.clienteId || null,
      clienteNome: payload.clienteNome || 'Consumidor da mesa',
      observacao: payload.observacao || '',
      itens: payload.itens || [],
      atualizadoEm: new Date().toISOString()
    }
    writeJSON('mesas.json', mesas)
  }

  return pedido
})

ipcMain.handle('liberar-mesa', (e, mesaId) => {
  const mesas = getMesasPersistidas()
  const index = mesas.findIndex(m => Number(m.id) === Number(mesaId))
  if (index !== -1) {
    mesas[index] = {
      ...mesas[index],
      status: 'disponivel',
      clienteId: null,
      clienteNome: '',
      observacao: '',
      itens: [],
      atualizadoEm: new Date().toISOString()
    }
    writeJSON('mesas.json', mesas)
    return true
  }
  return false
})

ipcMain.handle('get-whatsapp-config', () => {
  return readJSON('whatsappConfig.json') || {
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    verifyToken: '',
    webhookUrl: ''
  }
})

ipcMain.handle('save-whatsapp-config', (e, config) => {
  return writeJSON('whatsappConfig.json', {
    phoneNumberId: config.phoneNumberId || '',
    businessAccountId: config.businessAccountId || '',
    accessToken: config.accessToken || '',
    verifyToken: config.verifyToken || '',
    webhookUrl: config.webhookUrl || ''
  })
})

// =============================
// PRECIFICADOR: retornar pratos e contas para o frontend
// =============================
ipcMain.handle('get-precificador-data', () => {
  const pratos = readJSON('pratos.json') || []
  const contas = readJSON('contas.json') || []

  return {
    pratos,
    contas
  }
})