const express = require('express');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws');

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

// Creeaza server http partajat de Express si WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({server}); // ataseaza WS la server

let clients = [];

wss.on('connection', (ws) => {
  console.log('Client WebSocket conectat');
  clients.push(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if(typeof data.user === 'string' && typeof data.text === 'string') {
        const cleanMsg = {
          user: data.user.trim().substring(0, 50),
          text: data.text.trim().substring(0, 500)
        };

        clients.forEach((client) => {
          if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(cleanMsg));
          }
        });
      }
    } catch(err) {
      console.error('Mesaj invalid: ', err.message);
    }
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log('Client deconectat');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serverul Express + WebSocket ruleaza pe portul ${PORT}`);
});
