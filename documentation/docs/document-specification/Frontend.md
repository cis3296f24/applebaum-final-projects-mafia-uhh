---
title: "Frontend"
---
<a name="App"></a>

## App() ⇒ <code>JSX.Element</code>
Main App component that sets up the routing for the application.
The app is wrapped with the WebSocketProvider to allow WebSocket context access throughout the app.

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The App component JSX, which contains the routes for the game pages.

---

<a name="Night"></a>

## Night() ⇒ <code>JSX.Element</code>
Night phase component for Mafia game. This component handles voting, player actions,
and WebSocket communication for the night phase of the game.

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The rendered JSX element for the night phase, including role display, voting section, and player lists.

* [Night()](#Night) ⇒ <code>JSX.Element</code>
    * [~ws](#Night..ws) : <code>WebSocket</code>
    * [~location](#Night..location) : <code>object</code>
    * [~navigate](#Night..navigate) : <code>function</code>
    * [~voteForPlayer(playerName)](#Night..voteForPlayer) ⇒ <code>void</code>
    * [~toggleHelp()](#Night..toggleHelp) ⇒ <code>void</code>
    * [~speak(sound, vol)](#Night..speak) ⇒ <code>void</code>

<a name="Night..ws"></a>

### Night~ws : <code>WebSocket</code>
WebSocket instance and connection status.

**Kind**: inner constant of [<code>Night</code>](#Night)

<a name="Night..location"></a>

### Night~location : <code>object</code>
React Router's `useLocation` hook to access the current location's state.

**Kind**: inner constant of [<code>Night</code>](#Night)

<a name="Night..navigate"></a>

### Night~navigate : <code>function</code>
React Router's `useNavigate` hook to programmatically navigate between pages.

**Kind**: inner constant of [<code>Night</code>](#Night)

<a name="Night..voteForPlayer"></a>

### Night~voteForPlayer(playerName) ⇒ <code>void</code>
Handles the action of voting for a player.

**Kind**: inner method of [<code>Night</code>](#Night)

| Param      | Type            | Description                     |
| ---------- | --------------- | ------------------------------- |
| playerName | <code>string</code> | The name of the player being voted for. |

<a name="Night..toggleHelp"></a>

### Night~toggleHelp() ⇒ <code>void</code>
Toggles the visibility of the help modal.

**Kind**: inner method of [<code>Night</code>](#Night)

<a name="Night..speak"></a>

### Night~speak(sound, vol) ⇒ <code>void</code>
Plays an audio sound.

**Kind**: inner method of [<code>Night</code>](#Night)

| Param      | Type            | Description                     |
| ---------- | --------------- | ------------------------------- |
| sound      | <code>string</code> | The path to the audio file.     |
| vol        | <code>number</code> | The volume level of the audio (0.0 to 1.0). |

---

<a name="StartGame"></a>

## StartGame() ⇒ <code>JSX.Element</code>
StartGame component for managing the Day phase of the game.
Handles voting, player management, and WebSocket communication for the start of the game.

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The rendered JSX for the StartGame page.

* [StartGame()](#StartGame) ⇒ <code>JSX.Element</code>
    * [~ws](#StartGame..ws) : <code>WebSocket</code>
    * [~location](#StartGame..location) : <code>object</code>
    * [~navigate](#StartGame..navigate) : <code>function</code>
    * [~voteForPlayer(playerName)](#StartGame..voteForPlayer)
    * [~toggleHelp()](#StartGame..toggleHelp)
    * [~speak(sound, vol)](#StartGame..speak)

<a name="StartGame..ws"></a>

### StartGame~ws : <code>WebSocket</code>
WebSocket instance and connection status.

**Kind**: inner constant of [<code>StartGame</code>](#StartGame)

<a name="StartGame..location"></a>

### StartGame~location : <code>object</code>
React Router's `useLocation` hook to access the current location's state.

**Kind**: inner constant of [<code>StartGame</code>](#StartGame)

**Properties**:

| Name       | Type            | Description                          |
| ---------- | --------------- | ------------------------------------ |
| role       | <code>string</code> | The role of the current player.     |
| playerName | <code>string</code> | The name of the current player.     |
| isHost     | <code>boolean</code> | Indicates if the current player is the host. |
| dayLength  | <code>number</code> | The duration of the day phase.      |
| nightLength | <code>number</code> | The duration of the night phase.    |
| rolesList  | <code>Array</code> | The list of roles in the game.      |

<a name="StartGame..navigate"></a>

### StartGame~navigate : <code>function</code>
React Router's `useNavigate` hook for programmatic navigation between pages.

**Kind**: inner constant of [<code>StartGame</code>](#StartGame)

<a name="StartGame..voteForPlayer"></a>

### StartGame~voteForPlayer(playerName)
Handles the voting action for a player.

**Kind**: inner method of [<code>StartGame</code>](#StartGame)

| Param      | Type            | Description                     |
| ---------- | --------------- | ------------------------------- |
| playerName | <code>string</code> | The name of the player to be voted for. |

<a name="StartGame..toggleHelp"></a>

### StartGame~toggleHelp()
Toggles the visibility of the help modal.

**Kind**: inner method of [<code>StartGame</code>](#StartGame)

<a name="StartGame..speak"></a>

### StartGame~speak(sound, vol)
Plays an audio sound.

**Kind**: inner method of [<code>StartGame</code>](#StartGame)

| Param      | Type            | Description                     |
| ---------- | --------------- | ------------------------------- |
| sound      | <code>string</code> | The path to the audio file.     |
| vol        | <code>number</code> | The volume level of the audio (0.0 to 1.0). |

---

<a name="useWebSocket"></a>

## useWebSocket ⇒ <code>WebSocket</code> \| <code>null</code>
Custom hook to access the WebSocket instance from the context.

**Kind**: global constant  
**Returns**: <code>WebSocket</code> \| <code>null</code> - The WebSocket instance or null if not connected.

<a name="WebSocketProvider"></a>

## WebSocketProvider ⇒ <code>JSX.Element</code>
WebSocketProvider component that manages the WebSocket connection and provides it to the app context.
It listens for events like `open`, `message`, `error`, and `close` to manage WebSocket behavior.

**Kind**: global constant  
**Returns**: <code>JSX.Element</code> - The WebSocket provider component.

**Component**:   

| Param       | Type                    | Description |
| ----------- | ----------------------- | ----------- |
| props       | <code>Object</code>      | The component's props. |
| props.children | <code>React.ReactNode</code> | The child components that will consume the WebSocket context. |

* [WebSocketProvider](#WebSocketProvider) ⇒ <code>JSX.Element</code>
    * [~wsRef](#WebSocketProvider..wsRef) : <code>React.RefObject.&lt;WebSocket&gt;</code>
        * [.current.onopen()](#WebSocketProvider..wsRef.current.onopen) ⇒ <code>void</code>
        * [.current.onmessage(event)](#WebSocketProvider..wsRef.current.onmessage) ⇒ <code>void</code>
        * [.current.onerror(error)](#WebSocketProvider..wsRef.current.onerror) ⇒ <code>void</code>
        * [.current.onclose(event)](#WebSocketProvider..wsRef.current.onclose) ⇒ <code>void</code>

<a name="WebSocketProvider..wsRef"></a>

### WebSocketProvider~wsRef : <code>React.RefObject.&lt;WebSocket&gt;</code>
Reference to store the WebSocket instance.

**Kind**: inner constant of

---

<a name="GameOver"></a>

## GameOver() ⇒ <code>JSX.Element</code>
GameOver component to display the game-over message and play the corresponding sound based on the winner.

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - - The rendered JSX element for the game over screen.  
**Component**:   

* [GameOver()](#GameOver) ⇒ <code>JSX.Element</code>
    * [~speak(sound, callback)](#GameOver..speak)
    * [~audio()](#GameOver..audio)

<a name="GameOver..speak"></a>

### GameOver~speak(sound, callback)
Function to play an audio file and invoke a callback once playback finishes.

**Kind**: inner method of [<code>GameOver</code>](#GameOver)  

| Param | Type | Description |
| --- | --- | --- |
| sound | <code>string</code> | The sound file path to be played. |
| callback | <code>function</code> | The callback function to be executed after the audio finishes playing. |

<a name="GameOver..audio"></a>

### GameOver~audio()
Function to handle the sequence of sounds to be played based on the winner.
It plays a sequence of sounds: Game Over sound followed by either the C win sound or M win sound.

**Kind**: inner method of [<code>GameOver</code>](#GameOver)  

---

<a name="Eliminated"></a>

## Eliminated() ⇒ <code>JSX.Element</code>
Eliminated component handles the elimination phase of the game. It plays sounds, displays
the elimination message, and navigates between game phases (Day and Night).

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - - The rendered JSX element for the elimination screen.  
**Component**:   

* [Eliminated()](#Eliminated) ⇒ <code>JSX.Element</code>
    * [~audio()](#Eliminated..audio) ⇒ <code>void</code>
    * [~speak(sound, callback)](#Eliminated..speak) ⇒ <code>void</code>

<a name="Eliminated..audio"></a>

### Eliminated~audio() ⇒ <code>void</code>
Handles the playing of multiple sounds in sequence.
Plays the "End Vote" sound first, then based on the elimination status,
it plays either the "Elim" or "NoElim" sound.

**Kind**: inner method of [<code>Eliminated</code>](#Eliminated)  
<a name="Eliminated..speak"></a>

### Eliminated~speak(sound, callback) ⇒ <code>void</code>
Plays an audio file and executes a callback function once the audio finishes playing.

**Kind**: inner method of [<code>Eliminated</code>](#Eliminated)  

| Param | Type | Description |
| --- | --- | --- |
| sound | <code>string</code> | The sound file to be played. |
| callback | <code>function</code> | The callback function to be executed after the sound finishes playing. |

---

<a name="Dead"></a>

## Dead() ⇒ <code>JSX.Element</code>
Dead component displays the "You Are Dead" message to players who have been eliminated.
It listens for a `gameOver` message from the WebSocket connection and navigates
to the GameOver screen when the game is finished.

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - - The rendered JSX element for the dead screen.  
**Component**:

---

<a name="module_index"></a>

## index
Main entry point for the React application.

This code renders the main `<App />` component into the root DOM element
and sets up performance reporting for the app.

**Requires**: <code>module:React</code>, <code>module:ReactDOM</code>, <code>module:App</code>, <code>module:reportWebVitals</code>  
<a name="module_index..root"></a>

### index~root : <code>ReactDOM.Root</code>
The root DOM element for the application.
This element is where the React app will be mounted.

**Kind**: inner constant of [<code>index</code>](#module_index)  
