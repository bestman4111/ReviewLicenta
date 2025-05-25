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
    console.log("Primit nume joc:", gameName);
    const result = await hltbService.search(gameName);
    console.log("Rezultat HLTB:", result);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Jocul nu a fost găsit.' });
    }

    const minutes = result[0].gameplayMain * 60;
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
