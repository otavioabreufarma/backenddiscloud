# Sistema VIP (Backend + Bot Discord)

Reestruturação dos backups zip para um sistema integrado e funcional.

## Estrutura

- `backend/`: API Express para Steam, pedidos, checkout e webhook.
- `bot/`: Bot Discord que conversa com o backend.
- `backup-*.zip`: backups originais preservados.

## Fluxo de integração

1. Bot cria pedido em `POST /api/orders`.
2. Backend retorna `steamLoginUrl` com `order_nsu`.
3. Usuário conecta Steam e backend vincula Steam ao pedido no callback.
4. Bot confirma com `GET /api/orders/by-discord/:discordId`.
5. Bot atualiza servidor/VIP e gera checkout.
6. Webhook confirma pagamento e ativa VIP.

## Executar

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Bot

```bash
cd bot
npm install
cp .env.example .env
npm start
```
