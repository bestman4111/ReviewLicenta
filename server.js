const express = require('express');
const cors = require('cors');
const { HowLongToBeatService } = require('howlongtobeat');

const app = express();
const port = process.env.PORT || 3000;

const hltbService = new HowLongToBeatService();

app.use(cors()); // permite cereri de oriunde

app.get('/hltb', async (req, res) => {
  const gameName = req.query.game;

  if (!gameName) {
    return res.status(400).json({ error: 'Parametrul "game" este necesar.' });
  }

  try {
    console.log(`Caut: ${gameName}`);
    const results = await hltbService.search(gameName);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Jocul nu a fost găsit.' });
    }

    const firstMatch = results[0];
    const mainMinutes = firstMatch.gameplayMain ? Math.round(firstMatch.gameplayMain * 60) : null;

    if (!mainMinutes) {
      return res.status(204).json({ error: 'Timpul principal nu este disponibil.' });
    }

    return res.json({ minutes: mainMinutes, game: firstMatch.name });
  } catch (err) {
    console.error('Eroare în HLTB search:', err);
    res.status(500).json({ error: 'Eroare internă server.' });
  }
});

app.get('/', (req, res) => {
  res.send('HLTB microserviciu este online.');
});

app.listen(port, () => {
  console.log(`Serverul HLTB rulează pe portul ${port}`);
});
