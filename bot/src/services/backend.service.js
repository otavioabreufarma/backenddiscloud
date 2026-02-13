const axios = require("axios");
const { backendUrl, backendBotToken } = require("../config/env");

const api = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    "Content-Type": "application/json",
    "x-bot-token": backendBotToken
  }
});

async function createOrder(data) {
  const res = await api.post("/orders", data);
  return res.data;
}

async function updateOrder(orderNsu, data) {
  const res = await api.patch(`/orders/${orderNsu}`, data);
  return res.data;
}

async function createCheckout(orderNsu) {
  const res = await api.post(`/orders/checkout/${orderNsu}`);
  return res.data.checkoutUrl;
}

async function getOrderByDiscord(discordId) {
  const res = await api.get(`/orders/by-discord/${discordId}`);
  return res.data;
}

async function listServers() {
  const res = await api.get("/servers");
  return res.data;
}

module.exports = {
  createOrder,
  updateOrder,
  createCheckout,
  getOrderByDiscord,
  listServers
};
