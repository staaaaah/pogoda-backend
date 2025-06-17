const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

let cachedData = null;
let lastFetchTime = 0;

app.get("/pogoda", async (req, res) => {
  const now = Date.now();
  if (!cachedData || now - lastFetchTime > 5 * 60 * 1000) {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Toruń&lang=pl`);
      const data = await response.json();
      cachedData = data;
      lastFetchTime = now;
    } catch (error) {
      console.error("Błąd pobierania pogody:", error);
      return res.status(500).json({ error: "Błąd pobierania pogody" });
    }
  }
  res.json(cachedData);
});

app.listen(PORT, () => {
  console.log(`Serwer pogodowy działa na porcie ${PORT}`);
});