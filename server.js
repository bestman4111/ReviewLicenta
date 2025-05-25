const express = require('express');
const cors = require('cors');
const { HowLongToBeatService } = require('howlongtobeat');

const app = express();
const hltbService = new HowLongToBeatService();

app.use(cors());
app.use(express.json());

app.post('/hltb', async (req, res) => {
  const { gameName } = req.body;

  if (!gameName) {
    return res.status(400).json({ error: 'Lipseste numele jocului.' });
  }

  try {
    const results = await hltbService.search(gameName);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Jocul nu a fost gasit.' });
    }

    const mainStoryHours = results[0].gameplayMain;
    const minutes = Math.round(mainStoryHours * 60);

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
