const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const roles = require('./mafiaParameters');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let players = [];

// Serve static files if you have a front-end in /public
app.use(express.static('public'));

// Handle WebSocket connections
wss.on('connection', (ws) => {
    let playerName;

    ws.send(JSON.stringify({ type: 'rolesList', roles }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            playerName = data.name;

            players.push({ ws, name: playerName });

            // Identify the first player as the host
            if (players.length === 1) {
                ws.send(JSON.stringify({ type: 'host', message: 'You are the host' }));
            } else {
                ws.send(JSON.stringify({ type: 'player', message: 'Connected to the game as ' + playerName }));
            }

            // Notify others that a player has joined
            players.forEach(player => {
                if (player.ws !== ws) {
                    player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has joined the game!' }));
                }
            });
        } else if (data.type === 'start') {
            // Ensure only the host can start the game
            if (players[0].ws === ws) {
                assignRoles(players);
                players.forEach(player => {
                    player.ws.send(JSON.stringify({ type: 'toggleHelpOff'}));
                    player.ws.send(JSON.stringify({ type: 'message', message: 'The game has started!' }));
                });
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Only the host can start the game.' }));
            }
        }
    });

    ws.on('close', () => {
        players = players.filter(player => player.ws !== ws);
        players.forEach(player => {
            player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has left the game.' }));
        });
    });
});

function assignRoles(players) {
    const sortedRoles = roles.slice(0, players.length); 

        for (let currentIndex = sortedRoles.length - 1; currentIndex > 0; currentIndex--) {
            const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
            [sortedRoles[currentIndex], sortedRoles[randomIndex]] = [sortedRoles[randomIndex], sortedRoles[currentIndex]];
        }

    players.forEach((player, index) => {
        const { name, description } = sortedRoles[index];
        player.ws.send(JSON.stringify({ type: 'role', role: name, description: description }));
    });
}

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});