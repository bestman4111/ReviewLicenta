import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/hltb', async (req, res) => {
  const { game } = req.body;

  if (!game) {
    return res.status(400).json({ error: "Lipsește parametrul 'game'" });
  }

  try {
    // URL-ul API-ului proxy HowLongToBeat
    const url = `https://htlb-proxy.vercel.app/api/search?query=${encodeURIComponent(game)}`;

    const response = await axios.get(url);

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ error: "Jocul nu a fost găsit în baza HLTB." });
    }

    // Extragem timpul principal (main story)
    const mainHours = response.data.data[0].gameplayMain || null;

    if (!mainHours) {
      return res.status(404).json({ error: "Timpul principal pentru joc nu este disponibil." });
    }

    // Răspuns către client, în minute
    res.json({ minutes: Math.round(mainHours * 60) });

  } catch (error) {
    console.error("Eroare la interogarea HLTB:", error.message);
    res.status(500).json({ error: "Eroare la interogarea HowLongToBeat." });
  }
});

app.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);
});
