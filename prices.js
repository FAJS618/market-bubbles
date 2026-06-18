// ═══════════════════════════════════════════════════════════
// Netlify Function — Secure price fetcher
// This runs on Netlify's server, NOT in the browser.
// Your API key stays hidden in Environment Variables.
// ═══════════════════════════════════════════════════════════

exports.handler = async function (event, context) {
  const API_KEY = process.env.TWELVEDATA_API_KEY;

  // CORS headers so the browser can call this function
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API key not configured in Netlify" }),
    };
  }

  // All symbols we want — sent as ONE batch request (saves API calls)
  const symbols = [
    "XAU/USD",  // Gold
    "XAG/USD",  // Silver
    "WTI/USD",  // Oil (West Texas)
    "EUR/USD",  // Euro
    "GBP/USD",  // Pound
    "USD/JPY",  // Yen
    "DXY",      // Dollar Index
    "BTC/USD",  // Bitcoin
    "ETH/USD",  // Ethereum
    "SOL/USD",  // Solana
    "NVDA",     // NVIDIA
    "TSLA",     // Tesla
    "AAPL",     // Apple
  ].join(",");

  try {
    // Single batch call for all symbols — quote endpoint gives % change
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(
      symbols
    )}&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
