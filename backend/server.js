const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors()); // Autorise React
app.use(express.json());

const PORT = 5000;

// Use helper to get env to avoid undefined issues at startup
const getCreds = () => ({
  apiKey: process.env.VITE_CHALLONGE_API_KEY,
  slug: process.env.VITE_CHALLONGE_SLUG
});

// Route pour récupérer les matchs pour tes cartes d'interface
app.get('/api/matches', async (req, res) => {
  try {
    const { apiKey, slug } = getCreds();
    if (!apiKey || !slug) throw new Error("Missing API Key or Slug in .env");

    const response = await axios.get(
      `https://api.challonge.com/v1/tournaments/${slug}/matches.json?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Challonge Matches Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur Challonge Matches" });
  }
});

// Route pour récupérer les participants
app.get('/api/participants', async (req, res) => {
  try {
    const { apiKey, slug } = getCreds();
    if (!apiKey || !slug) throw new Error("Missing API Key or Slug in .env");

    const response = await axios.get(
      `https://api.challonge.com/v1/tournaments/${slug}/participants.json?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Challonge Participants Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur Challonge Participants" });
  }
});

app.listen(PORT, () => console.log(`Serveur ToGW lancé sur le port ${PORT}`));