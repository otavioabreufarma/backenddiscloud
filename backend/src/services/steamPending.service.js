const pending = new Map();

/**
 * Cria um token temporário para login Steam
 */
function createPendingSteam(order_nsu) {
  const token = Math.random().toString(36).slice(2, 10);
  pending.set(token, {
    order_nsu,
    createdAt: Date.now()
  });
  return token;
}

/**
 * Consome o token (one-time)
 */
function consumePendingSteam(token) {
  const data = pending.get(token);
  pending.delete(token);
  return data;
}

module.exports = {
  createPendingSteam,
  consumePendingSteam
};