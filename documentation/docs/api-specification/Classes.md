---
sidebar_position: 4
---

# Class Outline
(generated using [Javadoc to Markdown](https://delight-im.github.io/Javadoc-to-Markdown/))

## Index.js

This is the outer most layer of react set up for the web pages sets strict and calls App.


## App.js

### `App()`

This returns the app wraped in the WebSocketProvider and contains all the routes. 

## Game.js

### `Game()`

This is the main component that handles the game flow for a multiplayer Mafia game. It allows players to join the game, shows the current game status (like roles, messages, and players), and enables the host to start the game or adjust game settings (max players, number of mafia, day/night timers).

### `private boolean isHost`

This state variable determines if the current player is the host. The host has special privileges like starting the game and adjusting game settings.

### `private String[] messages`

An array of messages from the server or other players. It is used to display game status updates, such as role assignments and other game-related notifications.

### `private String role`

The current player's assigned role in the game. This value is updated when the server sends the player's role.

### `private String playerName`

The name chosen by the player. This is used to uniquely identify players in the game.

### `private boolean isJoined`

This state indicates if the player has successfully joined the game. If false, the player can still join by entering their name.

### `private boolean showHelp`

This state controls whether the help menu is displayed or not. The help menu explains the different character roles in the game.

### `private String[] rolesList`

A list of all available roles in the game. This is populated by the server and used to display role descriptions in the help menu.

### `private String[] currentPlayers`

An array containing the names of players currently in the game. This list is updated in real-time as players join or leave.

### `private WebSocket ws`

The WebSocket instance used for communication with the backend. It sends and receives messages related to game events, player actions, and state updates.

### `private void useEffect()`

This hook listens for incoming messages from the WebSocket and updates the state accordingly. It handles events like role assignment, starting the game, updating the player list, and showing error messages.

* **Parameters:** 
  - `ws` — The WebSocket instance used to communicate with the server.
  - `navigate` — A function from React Router used to navigate between pages.
  - `role`, `playerName`, `isHost`, `currentPlayers`, `nightLength` — Various game states that need to be updated in response to server messages.

### `private void handleJoinGame()`

This function is called when the player enters their name and clicks the "Join Game" button. It sends the player's name to the server to join the game.

* **Parameters:** None
* **Returns:** None

### `private void startGame()`

This function sends the start game command to the server, along with the game configuration settings (e.g., max players, mafia count, day/night timers). It is only available to the host.

* **Parameters:** None
* **Returns:** None

### `private void toggleHelp()`

This function toggles the visibility of the help menu, which explains the different character roles in the game.

* **Parameters:** None
* **Returns:** None

### `private void goToStartGame()`

This function is called when the host wants to start the game. It checks if the number of mafia players is less than the maximum number of players before starting the game.

* **Parameters:** None
* **Returns:** None

### `private String invalidPlayerNameMessage`

This is a state variable that holds the message shown to the user when they enter an invalid player name (e.g., if the name is already taken or invalid).

### `private String disconnectMessage`

This state holds a message indicating that the WebSocket connection has been lost. It displays an error message when the player is disconnected.

### `private void updateState()`

This function is triggered by WebSocket events to update the state based on the received data. It handles various message types like role assignments, game start signals, and player updates.

* **Parameters:** 
  - `event` — The WebSocket message event containing data about the game state.
* **Returns:** None

### `private void handleStartGame()`

This function is called when the host clicks the "Start Game" button. It checks if the current player is the host and sends the necessary game start data to the server.

* **Parameters:** None
* **Returns:** None

---


## StartGame.js

### `StartGame()`

This component handles the start phase of the Mafia game, where players participate in voting to eliminate someone. It includes functionalities for voting, showing player lists (alive/eliminated), a countdown timer, and a help menu explaining character roles. The component listens for WebSocket events to update the game state and handle player actions.

### `const [players, setPlayers]`

This state variable stores the list of all players in the game.

### `const [voting, setVoting]`

A boolean state that determines whether the voting phase is active.

### `const [votes, setVotes]`

An object that keeps track of which players have voted for whom.

### `const [eliminatedPlayers, setEliminatedPlayers]`

This state keeps a list of players who have been eliminated.

### `const [isEliminatedListVisible, setIsEliminatedListVisible]`

A boolean state that controls the visibility of the eliminated players' list.

### `const [alivePlayers, setAlivePlayers]`

This state keeps track of players who are still alive in the game.

### `const [isAliveListVisible, setIsAliveListVisible]`

A boolean state that controls the visibility of the alive players' list.

### `const [timeLeft, setTimeLeft]`

The countdown timer that shows how much time is left in the voting phase.

### `const [finalVote, setFinalVote]`

This stores the final vote of the user, which will be sent to the server.

### `const [showHelp, setShowHelp]`

A boolean state used to toggle the visibility of the help modal.

### `const [voted, setVoted]`

This state tracks if the user has already voted.

### `const location = useLocation()`

This hook retrieves the `role`, `playerName`, `isHost`, `dayLength`, `nightLength`, and `rolesList` from the current route's state, which contains relevant game configuration.

### `const navigate = useNavigate()`

This hook provides navigation functions for routing to different game phases (e.g., `Eliminated`, `Dead`, `GameOver`).

### `useEffect()`

This hook listens for incoming WebSocket messages to handle game state updates. It manages various events such as starting the voting phase, displaying the vote results, updating the timer, and handling game over or elimination notifications.

* **Parameters:** 
  - `ws` — The WebSocket instance used for communication.
  - `navigate` — A function from React Router to navigate between pages.
  - `role`, `playerName`, `isHost`, `eliminatedPlayers`, `players`, `voting`, `dayLength`, `nightLength`, `voted`, `alivePlayers`, `rolesList` — Various game states that are updated based on server messages.
* **Returns:** None

### `voteForPlayer(playerName)`

This function allows players to vote for someone to be eliminated. It checks if the player has already voted or if the player has been eliminated before allowing the vote.

* **Parameters:** 
  - `playerName` — The name of the player to vote for.
* **Returns:** None

### `toggleHelp()`

This function toggles the visibility of the help modal, which explains the different roles in the game.

* **Parameters:** None
* **Returns:** None

### `speak(sound, vol)`

This function plays a sound effect (like the countdown timer) at the specified volume.

* **Parameters:** 
  - `sound` — The path to the sound file to be played.
  - `vol` — The volume level (between 0.0 and 1.0).
* **Returns:** None

### `useEffect(() => { console.log('Updated voted state:', voted); }, [voted])`

This effect logs the updated voting state whenever the `voted` state changes. This is useful for debugging or confirming that the vote has been set.

### `return()`

This renders the component’s JSX, which includes:
- The game title and help button.
- The countdown timer.
- The player's role display.
- Voting interface for the current voting phase.
- Buttons to toggle between the alive and eliminated players list.
- Modals displaying the lists of eliminated and alive players.

### `JSX Structure:`
1. **Game Title and Help Button:** Displays the game title "MafiUhh..." and a button to toggle the help modal.
2. **Timer:** A countdown timer that shows the remaining time for voting.
3. **Role Display:** Displays the player's current role (e.g., Mafia, Civilian).
4. **Voting Section:** Displays a list of alive players with radio buttons to vote for elimination.
5. **Player Lists:** Toggle buttons to show or hide the lists of eliminated or alive players.
6. **Eliminated Players List Modal:** Displays the list of eliminated players when toggled on.
7. **Alive Players List Modal:** Displays the list of alive players when toggled on.

### `WebSocket Event Handling:`
- **startVoting:** Starts the voting phase and updates the player lists.
- **voteResults:** Displays the result of the vote and handles player elimination.
- **voteTie:** Handles cases where the vote ends in a tie.
- **dead:** Navigates to the Dead page if the player has been eliminated.
- **timer:** Updates the countdown timer and triggers sound effects.
- **gameOver:** Navigates to the GameOver page when the game ends.

