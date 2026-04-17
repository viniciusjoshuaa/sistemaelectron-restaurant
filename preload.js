const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  
  // Backup
  fazerBackup: () => ipcRenderer.invoke('fazer-backup-agora'),
  
  // Login
  login: (usuario, senha) => ipcRenderer.invoke('login', usuario, senha),
  
  // Produtos
  getProdutos: () => ipcRenderer.invoke('get-produtos'),
  saveProduto: (produto) => ipcRenderer.invoke('save-produto', produto),
  updateProdutos: (lista) => ipcRenderer.invoke('update-produtos', lista),
  deleteProduto: (id) => ipcRenderer.invoke('delete-produto', id),
  
  // Clientes
  getClientes: () => ipcRenderer.invoke("get-clientes"),
  saveCliente: (cliente) => ipcRenderer.invoke("save-cliente", cliente),
  updateClientes: (lista) => ipcRenderer.invoke("update-clientes", lista),
  deleteCliente: (id) => ipcRenderer.invoke("delete-cliente", id),
  
  // Cardápio
  getCardapioAtual: () => ipcRenderer.invoke('get-cardapio-atual'),
  saveCardapioAtual: (lista) => ipcRenderer.invoke('save-cardapio-atual', lista),
  salvarHistoricoFinal: (dados) => ipcRenderer.invoke('salvar-historico-final', dados),
  getHistoricoFinal: () => ipcRenderer.invoke('get-historico-final'),
  
  // Pedidos
  savePedido: (pedido) => ipcRenderer.invoke('save-pedido', pedido),
  getPedidos: () => ipcRenderer.invoke('get-pedidos'),
  getPedidosHoje: () => ipcRenderer.invoke('get-pedidos-hoje'),
  getPedidosPendentes: () => ipcRenderer.invoke('get-pedidos-pendentes'),
  atualizarStatusPedido: (id, status) => ipcRenderer.invoke('atualizar-status-pedido', id, status),
  
  // Relatórios
  gerarRelatorioVendas: (inicio, fim) => ipcRenderer.invoke('gerar-relatorio-vendas', inicio, fim),
  
  // PDF
  gerarPDFCardapio: (cardapio) => ipcRenderer.invoke('gerar-pdf-cardapio', cardapio),
  
  // Impressora
  testarImpressora: () => ipcRenderer.invoke('testar-impressora'),

  // Insumos
  getInsumos: () => ipcRenderer.invoke('get-insumos'),
  saveInsumo: (insumo) => ipcRenderer.invoke('save-insumo', insumo),
  updateInsumo: (id, insumo) => ipcRenderer.invoke('update-insumo', id, insumo),
  deleteInsumo: (id) => ipcRenderer.invoke('delete-insumo', id),

  // Pratos com receita
  getPratos: async () => {
      // retorna diretamente os dados do main process
      return await ipcRenderer.invoke('get-pratos');
  },
  savePrato: (prato) => ipcRenderer.invoke('save-prato', prato),
  updatePrato: (id, prato) => ipcRenderer.invoke('update-prato', id, prato),
  deletePrato: (id) => ipcRenderer.invoke('delete-prato', id),

  // Notas
  getNotas: () => ipcRenderer.invoke('get-notas'),
  saveNota: (nota) => ipcRenderer.invoke('save-nota', nota),

  // Servidor Web e QR Code
  iniciarServidor: () => ipcRenderer.invoke('iniciar-servidor'),
  pararServidor: () => ipcRenderer.invoke('parar-servidor'),
  gerarQRCode: (url) => ipcRenderer.invoke('gerar-qrcode', url),
  statusServidor: () => ipcRenderer.invoke('status-servidor'),

  // Contas
  getContas: async () => {
      return await ipcRenderer.invoke('get-contas');
  },
  saveConta: (conta) => ipcRenderer.invoke('save-conta', conta),
  updateConta: (id, conta) => ipcRenderer.invoke('update-conta', id, conta),
  deleteConta: (id) => ipcRenderer.invoke('delete-conta', id),

  // Precificador
  getPrecificadorData: () => ipcRenderer.invoke('get-precificador-data'),

  // Mesas
  getMesas: () => ipcRenderer.invoke('get-mesas'),
  salvarEstadoMesas: (mesas) => ipcRenderer.invoke('salvar-estado-mesas', mesas),
  registrarPedidoMesa: (payload) => ipcRenderer.invoke('registrar-pedido-mesa', payload),
  liberarMesa: (mesaId) => ipcRenderer.invoke('liberar-mesa', mesaId),

  // WhatsApp config oficial
  getWhatsappConfig: () => ipcRenderer.invoke('get-whatsapp-config'),
  saveWhatsappConfig: (config) => ipcRenderer.invoke('save-whatsapp-config', config),
  simularFluxoWhatsapp: (texto) => ipcRenderer.invoke('simular-fluxo-whatsapp', texto)
});

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});

contextBridge.exposeInMainWorld('whatsappAPI', {
    getFluxo: () => ipcRenderer.invoke('get-fluxo'),
    saveFluxo: (data) => ipcRenderer.invoke('save-fluxo', data),
    iniciarWhatsapp: () => ipcRenderer.send('iniciar-whatsapp'),
    onEvent: (callback) => ipcRenderer.on('whatsapp-event', (_event, payload) => callback(payload))
});