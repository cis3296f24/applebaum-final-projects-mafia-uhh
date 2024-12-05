---
sidebar_position: 5
---

# Use-case descriptions

## Use Case 1: Player Joining The Game
```mermaid

sequenceDiagram
    actor User
    participant websocket
    participant Frontend Game.js
    participant Backend index.js
    
    activate Frontend Game.js
    User ->> websocket: connects
    activate websocket
    User ->> Frontend Game.js: input name
    User ->> Frontend Game.js: press join button
    Frontend Game.js ->> websocket: player name and JSON join message
    websocket ->> Backend index.js: player name and JSON join message
    activate Backend index.js
    Backend index.js ->> websocket: JSON player message
    deactivate Backend index.js
    websocket ->> Frontend Game.js: JSON player message
    deactivate websocket
    deactivate Frontend Game.js
```

This sequence diagram shows a player joining the game. First the user will open the website and that will make a websocket connection. Then the User will input their name and press the join button on the frontend client screen Game.js. The Frontend Game.js sends this information to the websocket connection and then the websocket will send that information to the backend index.js. The Backend index.js will send the player message to the websocket connection, which will then send it to the Frontend Game.js where it will be displayed on the client.

## Use Case 2: Host Changing Options in Host Panel
```mermaid

sequenceDiagram
    actor Host User
    participant websocket
    participant Frontend Game.js
    participant Backend index.js
    
    activate Frontend Game.js
    
    Host User ->> websocket: Open website and connects
    activate websocket
    
    Host User ->> Frontend Game.js: input name
    Host User ->> Frontend Game.js: press join button
    Frontend Game.js ->> websocket: player name and JSON join message
    websocket ->> Backend index.js: player name and JSON join message
    activate Backend index.js
    Backend index.js ->> websocket: JSON host message
    deactivate Backend index.js
    websocket ->> Frontend Game.js: JSON host message
    Frontend Game.js ->> Frontend Game.js: display host UI
    deactivate websocket
    deactivate Frontend Game.js
    Host User ->> Frontend Game.js: change max players to 6, number of mafia to 2
    Host User ->> Frontend Game.js: press start game button
    activate Frontend Game.js
    Frontend Game.js ->> websocket: start JSON with maxPlayers, numMafia
    websocket ->> Backend index.js: start JSON with maxPlayers, numMafia
    activate Backend index.js
    Backend index.js ->> Backend index.js: assignRoles()
    Backend index.js ->> websocket: role JSON
    deactivate Backend index.js
    websocket ->> Frontend Game.js: role JSON
    deactivate Frontend Game.js

```
This sequence diagram is for the use case of the Host, or the first person to connect to the game, changing options in the host options panel. The host user opens the website and connects to the websocket. The host enters their name and presses join, which causes the frontend to send a join message containing the player name to the backend. Since this is the first user to join, they are made the host. The backend sends a host message to the frontend via the websocket, which then triggers the frontend to display the host UI for the host only. Then the host changes max players to 6 and number of mafia to 2. Once they start the game, a start message is sent via websocket to the backend, where these variables are used to assignRoles() to all players. Using the websocket, the backend sends a role message to the frontend to display the role that each player got.

## Use Case 3: Player Selecting a Vote
```mermaid

sequenceDiagram
    actor User
    participant websocket
    participant Night.js
    participant index.js
    
    %% index.js = Backend, & Night.js = Frontend & websocket = communication pipe between both
    activate Night.js
    activate websocket

    %% the current moment is immediately after game status swapped from startGame.js
    %% User is already connected to the websocket

    %% Game has transitioned to Night.js, voting is isn't initialized but the timer is
    activate Night.js
    Night.js ->> websocket: sends 'startVote' from frontend
    deactivate Night.js
    
    Note right of Night.js: NIGHT.JS:<br>- Voting not initiated<br>- Timer started
    websocket ->> index.js: passes 'startVote' to backend
    
    activate index.js
    Note right of index.js: INDEX.JS:<br>- Processes 'startVote'<br>- Prepares "players" map
    index.js ->> websocket: sends 'startVoting' with the parameter players map
    deactivate index.js
    
    Note left of index.js:  NIGHT.JS:<br>- Voting phase initialized<br>- Sends active player list
    websocket ->> Night.js: passes 'startVoting' and parameter
    
    activate Night.js
    Note right of Night.js: NIGHT.JS:<br>- Updates Voting state<br>- `setVoting(true)`<br>- `useState(players)`<br>- Reset votes
    %% User voting interaction
    User ->> Night.js: clicks player name to vote (voteForPlayer)
    Note right of Night.js: NIGHT.JS:<br>- User vote submitted<br>- Processing voteForPlayer
    Night.js ->> websocket: sends 'vote' tag with name of voted player
    deactivate Night.js
    
    websocket ->> index.js: passes 'vote' with playerName
    
    activate index.js
    Note right of index.js: INDEX.JS:<br>- Initiates handleVoting<br>- `handleVoting` checks vote count<br>- Tie → 'voteTie'<br>- Winner → 'voteResults'
    %% Outcome: winner in votes
    Note right of index.js: - Player eliminated<br>- player.eliminated = true<br>- Results are universally broadcasted
    index.js ->> websocket: sends 'voteResults' with eliminatedPlayer name & team
    deactivate index.js
    
    websocket ->> Night.js: passes 'voteResults' with eliminatedPlayer
    
    activate Night.js
    Note right of Night.js: NIGHT.JS:<br>- updates eliminatedPlayers <br>- turns off voting & timer <br>- resets votes
    deactivate Night.js

    deactivate websocket
```

This sequence diagram represents a player who is already in the game and can vote. The user is already has a websocket connection. The current state of the game is immediately after game status swapped from startGame.js to Night.js. The diagram demonstates the various communications between the frontend and backend of the game system through a websocket. At first, the voting is not started, but then the game updates to have voting begin (through various communications between backend and frontend to setup the initialization of voting). Following this, the User will be able to select the name of their target vote for elimination by clicking on their button on the frontend client screen of Night.js. The frontend will communicate their choice to the backend who will process it. The backend then sends the reponse to the voting results from all other users to each individual users frontend. The player has the name of the eliminated player displayed on their screen and finally voting and the timer are reset back to their initial states.