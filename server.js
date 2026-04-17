const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Função para ler arquivos JSON
function readJSON(file) {
  const filePath = path.join(__dirname, 'data', file);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Erro ao ler ${file}:`, error);
    return null;
  }
}

// Função para escrever arquivos JSON
function writeJSON(file, data) {
  try {
    const filePath = path.join(__dirname, 'data', file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Erro ao escrever ${file}:`, error);
    return false;
  }
}

// ==========================================
// ROTA: Obter cardápio atual
// ==========================================
app.get('/api/cardapio', (req, res) => {
  console.log('📋 Requisição de cardápio recebida');
  
  const cardapio = readJSON('cardapioAtual.json');
  
  if (!cardapio || !cardapio.itens || cardapio.itens.length === 0) {
    return res.status(404).json({ 
      error: 'Nenhum cardápio disponível no momento',
      message: 'O cardápio do dia ainda não foi cadastrado'
    });
  }
  
  console.log(`✅ Cardápio enviado com ${cardapio.itens.length} itens`);
  res.json(cardapio);
});

// ==========================================
// ROTA: Salvar pedido online
// ==========================================
app.post('/api/pedido', (req, res) => {
  console.log('📦 Novo pedido online recebido:', req.body);
  
  const { nome, telefone, itens, observacao } = req.body;
  
  // Validação
  if (!nome || !telefone || !itens || itens.length === 0) {
    return res.status(400).json({ 
      error: 'Dados incompletos',
      message: 'Preencha nome, telefone e selecione pelo menos um item'
    });
  }
  
  // Montar pedido
  const pedido = {
    id: Date.now(),
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR'),
    cliente: {
      nome: nome.trim(),
      telefone: telefone.trim()
    },
    itens: itens,
    observacao: observacao ? observacao.trim() : '',
    status: 'pendente',
    origem: 'online',
    timestamp: Date.now()
  };
  
  // Salvar no arquivo
  const pedidos = readJSON('pedidos.json') || [];
  pedidos.push(pedido);
  
  if (writeJSON('pedidos.json', pedidos)) {
    console.log(`✅ Pedido #${pedido.id} salvo com sucesso`);
    
    // Notificar o Electron para imprimir automaticamente
    try {
      const { BrowserWindow } = require('electron');
      const windows = BrowserWindow.getAllWindows();
      if (windows.length > 0) {
        windows[0].webContents.send('novo-pedido-online', pedido);
      }
    } catch (error) {
      console.log('Nota: Impressão automática requer Electron ativo');
    }
    
    res.json({ 
      success: true, 
      pedido: pedido,
      message: 'Pedido recebido com sucesso!'
    });
  } else {
    console.error('❌ Erro ao salvar pedido');
    res.status(500).json({ 
      error: 'Erro ao processar pedido',
      message: 'Tente novamente em alguns instantes'
    });
  }
});

// ==========================================
// ROTA: Página principal (cardápio web)
// ==========================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cardapio-online.html'));
});

// ==========================================
// ROTA: Status do servidor
// ==========================================
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    servidor: 'Cardápio Online',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// Iniciar servidor
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🌐 SERVIDOR DE CARDÁPIO ONLINE INICIADO');
  console.log('='.repeat(60));
  console.log(`🔗 URL Local: http://localhost:${PORT}`);
  console.log(`🔗 URL Rede: http://<SEU_IP>:${PORT}`);
  console.log(`📱 Acesse de qualquer dispositivo na mesma rede`);
  console.log('='.repeat(60) + '\n');
  
  // Detectar IP local
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  console.log('📡 IPs disponíveis:');
  Object.keys(interfaces).forEach(iface => {
    interfaces[iface].forEach(details => {
      if (details.family === 'IPv4' && !details.internal) {
        console.log(`   - http://${details.address}:${PORT}`);
      }
    });
  });
  console.log('');
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: 'Ocorreu um erro inesperado'
  });
});

module.exports = app;
