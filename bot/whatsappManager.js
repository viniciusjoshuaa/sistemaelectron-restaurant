const path = require('path')
const fs = require('fs')

let clients = {}

function emit(sender, event, payload = {}) {
  if (typeof sender === 'function') {
    sender(event, payload)
  }
}

function iniciarSessao(sessionId = 'mandir_principal', sender) {
  let Client, LocalAuth, qrcode
  try {
    ({ Client, LocalAuth } = require('whatsapp-web.js'))
    qrcode = require('qrcode')
  } catch (error) {
    emit(sender, 'error', {
      message: 'Bibliotecas do WhatsApp não instaladas. Rode: npm install whatsapp-web.js qrcode'
    })
    return null
  }

  if (clients[sessionId]) {
    emit(sender, 'status', { message: 'Sessão já inicializada.' })
    return clients[sessionId]
  }

  const authPath = path.join(__dirname, '..', '.wwebjs_auth')

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: sessionId,
      dataPath: authPath
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    },
    takeoverOnConflict: true
  })

  client.on('qr', async (qr) => {
    try {
      const qrCode = await qrcode.toDataURL(qr, { width: 280, margin: 2 })
      emit(sender, 'qr', { qrCode })
    } catch (error) {
      emit(sender, 'error', { message: error.message })
    }
  })

  client.on('authenticated', () => {
    emit(sender, 'status', { message: 'Autenticado no WhatsApp.' })
  })

  client.on('ready', () => {
    emit(sender, 'ready', { message: 'WhatsApp conectado.' })
  })

  client.on('auth_failure', (message) => {
    emit(sender, 'auth_failure', { message })
  })

  client.on('disconnected', (reason) => {
    emit(sender, 'disconnected', { reason })
    delete clients[sessionId]
  })

  client.on('message', async (message) => {
    try {
      const fluxoPath = path.join(__dirname, '..', 'data', 'fluxos.json')
      if (!fs.existsSync(fluxoPath)) return
      const fluxo = JSON.parse(fs.readFileSync(fluxoPath, 'utf-8') || '{}')
      const texto = (message.body || '').trim().toLowerCase()

      if (!Object.keys(fluxo).length) return

      let bloco = fluxo[texto] || fluxo.inicio || null
      if (!bloco) return

      await message.reply(bloco.mensagem || 'Olá!')
    } catch (error) {
      emit(sender, 'error', { message: error.message })
    }
  })

  client.initialize().catch((error) => {
    emit(sender, 'error', { message: error.message })
  })

  clients[sessionId] = client
  emit(sender, 'status', { message: 'Inicializando sessão local...' })
  return client
}

function iniciarBotWhatsapp(sessionId = 'mandir_principal', sender) {
  return iniciarSessao(sessionId, sender)
}

module.exports = {
  iniciarSessao,
  iniciarBotWhatsapp
}
