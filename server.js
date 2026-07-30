const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques (HTML/CSS) depuis le dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route de santé pour le bot
app.get('/ping', (req, res) => {
  res.status(200).send('Bot actif : serveur maintenu en éveil');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);

  // Bot d'auto-ping pour empêcher Render de mettre le serveur en veille (toutes les 10 minutes)
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_URL) {
    setInterval(async () => {
      try {
        await axios.get(`${RENDER_URL}/ping`);
        console.log('Auto-ping réussi !');
      } catch (error) {
        console.error('Erreur lors de l\'auto-ping :', error.message);
      }
    }, 10 * 60 * 1000); // 10 minutes
  }
});
