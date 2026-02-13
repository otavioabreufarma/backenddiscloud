const axios = require("axios");
const { steamRealm, steamReturnUrl } = require("../config/env");

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";

function buildSteamLoginRedirectUrl(order_nsu) {
  const returnTo = new URL(steamReturnUrl);
  returnTo.searchParams.set("order_nsu", order_nsu);

  const steamUrl = new URL(STEAM_OPENID_URL);
  steamUrl.searchParams.set("openid.ns", "http://specs.openid.net/auth/2.0");
  steamUrl.searchParams.set("openid.mode", "checkid_setup");
  steamUrl.searchParams.set("openid.return_to", returnTo.toString());
  steamUrl.searchParams.set("openid.realm", steamRealm);
  steamUrl.searchParams.set("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select");
  steamUrl.searchParams.set("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select");

  return steamUrl.toString();
}

async function validateSteamOpenIdCallback(query) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
      return;
    }
    if (value !== undefined && value !== null) params.append(key, String(value));
  });

  params.set("openid.mode", "check_authentication");

  const response = await axios.post(STEAM_OPENID_URL, params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  const body = String(response.data || "");
  return body.includes("is_valid:true");
}

function extractSteamId64(claimedId) {
  if (!claimedId) return null;
  const match = String(claimedId).match(/\/id\/(\d+)$/);
  return match ? match[1] : null;
}

module.exports = {
  buildSteamLoginRedirectUrl,
  validateSteamOpenIdCallback,
  extractSteamId64
};
