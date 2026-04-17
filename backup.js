const fs = require('fs')
const path = require('path')

function fazerBackupManual() {
  const dataPath = path.join(__dirname, 'data')
  const backupPath = path.join(require('os').homedir(), 'Documents', 'RestauranteBackup')
  
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true })
  }
  
  const files = fs.readdirSync(dataPath)
  const timestamp = Date.now()
  
  files.forEach(file => {
    if (file.endsWith('.json')) {
      fs.copyFileSync(
        path.join(dataPath, file),
        path.join(backupPath, `${timestamp}-${file}`)
      )
    }
  })
  
  console.log(`✅ Backup realizado em: ${backupPath}`)
}

// Executar se chamado diretamente
if (require.main === module) {
  fazerBackupManual()
}

module.exports = { fazerBackupManual }