const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000; // 👈 use Railway's port if provided

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SCOPES,
  HOST
} = process.env;

app.get("/", (req, res) => {
  res.send("Shopify OAuth backend is running.");
});

// 🔄 UPDATED /auth ROUTE
app.get("/auth", (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send("Missing shop parameter");

  // Trim env var to avoid hidden spaces/newlines
  const base = (HOST || "").trim();
  if (!/^https?:\/\//i.test(base)) {
    return res.status(500).send(
      "HOST must include scheme, e.g. https://your-app.up.railway.app"
    );
  }

  // Clean up scopes (remove whitespace/newlines)
  const scopes = (SCOPES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(",");

  const redirectUri = `${base}/auth/callback`;
  const installUrl =
    `https://${shop}/admin/oauth/authorize?` +
    `client_id=${encodeURIComponent(SHOPIFY_API_KEY)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  console.log("Install URL:", installUrl); // 👈 helpful for debugging
  return res.redirect(installUrl);
});

app.get("/auth/callback", async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) return res.status(400).send("Missing parameters");

  try {
    const tokenResponse = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log(`Access token for ${shop}:`, accessToken);

    res.send("App installed successfully. Access token logged on server.");
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response?.data || error.message
    );
    res.status(500).send("Failed to get access token");
  }
});

// ✅ This should only appear once
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
