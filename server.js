const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.get('/hltb', async (req, res) => {
  const gameTitle = req.query.title;
  if (!gameTitle) {
    return res.status(400).json({ error: 'Lipseste parametrul title.' });
  }

  try {
    const response = await axios.get(`https://hltb-proxy.fly.dev/v1/query`, {
      params: { title: gameTitle }
    });

    if (!response.data || !response.data[0]) {
      return res.status(404).json({ error: 'Jocul nu a fost gasit pe HLTB.' });
    }

    // Returneaza primul rezultat (cel mai relevant)
    res.json(response.data[0]);

  } catch (error) {
    console.error('Eroare la interogare HLTB:', error.message);
    res.status(500).json({ error: 'Eroare la interogarea HowLongToBeat.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe portul ${PORT}`);
});
