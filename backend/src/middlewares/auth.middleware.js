module.exports.botAuth = (req, res, next) => {
  const token = req.headers["x-bot-token"];

  if (!token) return res.status(401).json({ error: "Missing bot token" });
  if (token !== process.env.BOT_TOKEN) {
    return res.status(401).json({ error: "Invalid bot token" });
  }

  next();
};
