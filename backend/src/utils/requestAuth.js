function requireBotToken(req, res) {
  const headerToken = req.headers["x-bot-token"];
  const expected = process.env.BOT_TOKEN;

  if (!expected) {
    res.status(500).json({ error: "BOT_TOKEN não configurado no backend" });
    return false;
  }

  if (!headerToken) {
    res.status(401).json({ error: "Missing bot token" });
    return false;
  }

  if (headerToken !== expected) {
    res.status(401).json({ error: "Invalid bot token" });
    return false;
  }

  return true;
}

module.exports = { requireBotToken };
