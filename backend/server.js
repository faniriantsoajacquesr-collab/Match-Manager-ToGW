const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors()); // Autorise React
app.use(express.json());

const PORT = 5000;

// Récupère les credentials via les headers pour être dynamique
const getCreds = (req) => ({
  apiKey: req.headers['x-challonge-api'],
  slug: req.headers['x-challonge-slug']
});

// Route pour récupérer les matchs pour tes cartes d'interface
app.get('/api/matches', async (req, res) => {
  try {
    const { apiKey, slug } = getCreds(req);
    if (!apiKey || !slug) return res.status(400).json({ error: "Missing Credentials in headers" });

    const response = await axios.get(
      `https://api.challonge.com/v1/tournaments/${slug}/matches.json?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Challonge Matches Error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    res.status(status).json({ error: error.response?.data || error.message });
  }
});

// Route pour récupérer les participants
app.get('/api/participants', async (req, res) => {
  try {
    const { apiKey, slug } = getCreds(req);
    if (!apiKey || !slug) return res.status(400).json({ error: "Missing Credentials in headers" });

    const response = await axios.get(
      `https://api.challonge.com/v1/tournaments/${slug}/participants.json?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Challonge Participants Error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    res.status(status).json({ error: error.response?.data || error.message });
  }
});

// Route pour valider un score sur Challonge
app.put('/api/matches/:id', async (req, res) => {
  try {
    const { apiKey, slug } = getCreds(req);
    const { id } = req.params;
    const { winner_id, scores_csv } = req.body;

    const response = await axios.put(
      `https://api.challonge.com/v1/tournaments/${slug}/matches/${id}.json?api_key=${apiKey}`,
      { match: { winner_id, scores_csv } }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Challonge Update Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la validation Challonge" });
  }
});

// Route de Login Admin (vérification via la table 'users' de Supabase gérée par le serveur)
app.post('/api/login', async (req, res) => {
    res.json({ message: "Use direct Supabase connection for auth" });
});

// Ne pas lancer app.listen sur Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Serveur ToGW lancé sur le port ${PORT}`));
}

module.exports = app;
