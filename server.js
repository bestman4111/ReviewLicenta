const express = require('express');
const cors = require('cors');
const { HowLongToBeatService } = require('howlongtobeat');

const app = express();
const hltbService = new HowLongToBeatService();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API-ul HowLongToBeat este online.');
});

app.post('/hltb', async (req, res) => {
  const { gameName } = req.body;

  if (!gameName) {
    return res.status(400).json({ error: 'Lipseste numele jocului.' });
  }

  try {
    const results = await hltbService.search(gameName);

    const bestMatch = results[0];
    const minutes = bestMatch?.gameplayMain ? bestMatch.gameplayMain * 60 : 1200;

    res.json({ minutes });
  } catch (error) {
    console.error('Eroare HLTB:', error);
    res.status(500).json({ error: 'Eroare la interogarea HowLongToBeat.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
