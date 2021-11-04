const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');

const wsServer = new WebSocket.Server({ server:server });

wsServer.on('connection', function connection(ws) {
    // Mensagem que envia quando o html conecta com o servidor ws
    ws.send('Bem vindo novo client');

    ws.on('message', function incoming(message) {
        // Mensagem recebida ao clicar no botão
        console.log('received: %s', message);

        wsServer.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

    });
});

app.get('/', (req, res) => res.sendFile(__dirname + '/client/main.html'));

server.listen(3000, () => console.log(`Lisening on port :3000`))
