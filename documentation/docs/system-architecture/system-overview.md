---
sidebar_position: 1
---

# System Overview

## Project Description
**Mafi-uhh** is an interactive, multiplayer game application based on the classic party game *Mafia*. It allows players to join a shared lobby and game, receive random roles, and engage in strategic gameplay and game phases to achieve their respective objectives. The game is designed for a web environment, utilizing WebSocket connections between a React-based frontend client and a backend Node.js server for real-time interaction between the players. 

## Architecture Overview
### Client-Server Model Design
- **Front-End**:
  - Developed using React, the front-end provides a user-friendly interface for players.
  - It manages user actions, such as joining the game and interacting with other participants.
  - Dynamic useStates and the WebSocket connection ensure frontend informatiom is processed quickly.

- **Back-End**:
  - Built with Node.js, the backend provides a central hub for user information to be processed.
  - It handles front end data updates, synchronizes users, and contains gameplay logic.
  - The WebSocket connection ensure processed data is sent to the designated users quickly and efficiently.

### Key Files
1. **Client-Side**:
   - **Game.js**: contains functions and such for the main starting page
   - **startGame.js** contains functions and such for the Day page
   - **Night.js** contains functions and such for the Night page
   - **Eliminated.js** contains functions and such for the Eliminated page
   - **Dead.js** contains functions and such for the Dead page

2. **Server-Side**:
   - **index.js**: contains functions that manage and process frontend data and synchronize data for all users
   - **player.js** contains Player class
   - **mafiaParameters.js**: contains the roles and their respective descriptions

## System Goals
- To provide an entertaining and strategic multiplayer experience.

---
