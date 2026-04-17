# Ajustes entregues

## O que foi alterado
- Painel inicial novo com cards padronizados.
- `precificador.html` refeito com visual consistente e cálculo corrigido.
- Nova página `mesas.html` com 20 mesas pré-definidas, status visual e modal de pedido.
- `main.js` e `preload.js` atualizados para suportar mesas, configuração oficial do WhatsApp e correções do precificador.
- `whatsapp.html` reorganizado para:
  - sessão local via WhatsApp Web;
  - cadastro de dados da Cloud API oficial.

## Estrutura esperada
- `index.html` na raiz.
- páginas dentro de `pages/`
- estilos e scripts globais em `assets/`
- backend Electron na raiz.
- `bot/whatsappManager.js` para a sessão local do WhatsApp.

## Dependências adicionais para o modo local do WhatsApp
No projeto Electron, instale:
- `whatsapp-web.js`
- `qrcode`

Exemplo:
```bash
npm install whatsapp-web.js qrcode
```

## Limite importante
Não existe uma forma honesta de deixar o sistema “100% pronto para qualquer WhatsApp Business” sem a etapa externa da Meta:
- criação do app;
- número conectado;
- token permanente;
- webhook público HTTPS;
- aprovação/configuração da conta.

O pacote já deixa o sistema preparado para receber esses dados e para operar também no modo local via WhatsApp Web.
