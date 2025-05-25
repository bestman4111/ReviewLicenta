const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/hltb', async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Titlul jocului este necesar.' });
  }

  console.log(`Primit nume joc: ${title}`);

  try {
    const response = await axios.get(`https://hltb-proxy.vercel.app/search?query=${encodeURIComponent(title)}`);

    const results = response.data;

    if (results.length === 0) {
      console.log('Nu s-a găsit jocul.');
      return res.status(404).json({ error: 'Jocul nu a fost găsit pe HLTB.' });
    }

    const game = results[0]; // Presupunem că primul rezultat e cel corect

    console.log(`Durata gameplay main pentru ${game.name}: ${game.gameplayMain} ore`);

    res.json({
      title: game.name,
      gameplayMain: game.gameplayMain,
      gameplayMainExtra: game.gameplayMainExtra,
      gameplayCompletionist: game.gameplayCompletionist
    });

  } catch (error) {
    console.error('Eroare la interogarea HLTB:', error.message);
    res.status(500).json({ error: 'Eroare la interogarea HowLongToBeat.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
