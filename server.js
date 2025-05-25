const express = require('express');
const { HowLongToBeatService } = require('howlongtobeat');
const cors = require('cors');

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
    if (results.length === 0) {
      return res.status(404).json({ error: 'Jocul nu a fost găsit pe HLTB.' });
    }

    const mainStoryMinutes = results[0].gameplayMain * 60;
    res.json({ minutes: mainStoryMinutes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Eroare la interogarea HLTB.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
