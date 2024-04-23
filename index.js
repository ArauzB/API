const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors());


app.post('/api/data', (req, res) => {
  const { temperatura } = req.body;

  const data = JSON.stringify({ temperatura });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });

  res.status(200).json({ message: 'Datos recibidos correctamente' });
});

  wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');
  
    ws.on('message', (data) => {

        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      
      ws.send(data);
    });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

const port = process.env.PORT || 3000; 
  server.listen(port, () => {
    console.log(' 🚀 El servidor ha despegado en el puerto ', port);
  });