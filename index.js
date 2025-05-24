const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SCOPES,
  HOST
} = process.env;

app.get("/", (req, res) => {
  res.send("Shopify OAuth backend is running.");
});

app.get("/auth", (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send("Missing shop parameter");

  const redirectUri = `${HOST}/auth/callback`;
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SCOPES}&redirect_uri=${redirectUri}`;

  res.redirect(installUrl);
});

app.get("/auth/callback", async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) return res.status(400).send("Missing parameters");

  try {
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code
    });

    const accessToken = tokenResponse.data.access_token;
    console.log(`Access token for ${shop}:`, accessToken);

    res.send("App installed successfully. Access token logged on server.");
  } catch (error) {
    console.error("Error getting access token:", error.response?.data || error.message);
    res.status(500).send("Failed to get access token");
  }
});

// ✅ This should only appear once
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});