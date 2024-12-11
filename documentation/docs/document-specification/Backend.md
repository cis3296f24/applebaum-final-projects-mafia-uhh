---
title: "Backend"
---

<a name="module_mafia-game-server"></a>

## mafia-game-server
This module contains the server logic for a Mafia game implemented using Express.js, WebSockets (via the `ws` library), and custom player objects.
The game supports multiple players, role assignments, timers for day/night phases, voting mechanisms, and connection/disconnection handling.


* [mafia-game-server](#module_mafia-game-server)
    * [~checkPlayerNameValid(playerName, ws)](#module_mafia-game-server..checkPlayerNameValid) ⇒ <code>boolean</code>
    * [~beginDayTimer()](#module_mafia-game-server..beginDayTimer)
    * [~beginNightTimer()](#module_mafia-game-server..beginNightTimer)
    * [~doPhaseChange()](#module_mafia-game-server..doPhaseChange)
    * [~updateCurrentPlayersList()](#module_mafia-game-server..updateCurrentPlayersList)
    * [~checkWinConditions()](#module_mafia-game-server..checkWinConditions) ⇒ <code>boolean</code>
    * [~isMafia(role)](#module_mafia-game-server..isMafia) ⇒ <code>boolean</code>
    * [~kickExcessPlayers(maxPlayers)](#module_mafia-game-server..kickExcessPlayers)
    * [~assignRoles(players, maxPlayers, numMafia)](#module_mafia-game-server..assignRoles)
    * [~generateRoles(maxPlayers, numMafia)](#module_mafia-game-server..generateRoles) ⇒ <code>Array</code>
    * [~handleVoting(playerName, targetPlayer)](#module_mafia-game-server..handleVoting)

<a name="module_mafia-game-server..checkPlayerNameValid"></a>

### mafia-game-server~checkPlayerNameValid(playerName, ws) ⇒ <code>boolean</code>
Validates if the player's name is unique and meets the length criteria.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  
**Returns**: <code>boolean</code> - - Returns `true` if the player name is valid, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| playerName | <code>string</code> | The player's input name |
| ws | <code>WebSocket</code> | The WebSocket connection object |

<a name="module_mafia-game-server..beginDayTimer"></a>

### mafia-game-server~beginDayTimer()
Starts the day timer and broadcasts the time remaining to all players.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  
<a name="module_mafia-game-server..beginNightTimer"></a>

### mafia-game-server~beginNightTimer()
Starts the night timer and broadcasts the time remaining to all players.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  
<a name="module_mafia-game-server..doPhaseChange"></a>

### mafia-game-server~doPhaseChange()
Changes the game phase between DAY and NIGHT.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  
<a name="module_mafia-game-server..updateCurrentPlayersList"></a>

### mafia-game-server~updateCurrentPlayersList()
Sends the updated list of current players to all connected clients.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  
<a name="module_mafia-game-server..checkWinConditions"></a>

### mafia-game-server~checkWinConditions() ⇒ <code>boolean</code>
Checks if a team has won the game based on the current player status.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  
**Returns**: <code>boolean</code> - - Returns `true` if a team has won, `false` otherwise.  
<a name="module_mafia-game-server..isMafia"></a>

### mafia-game-server~isMafia(role) ⇒ <code>boolean</code>
Helper function to check if a role is part of the Mafia team.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  
**Returns**: <code>boolean</code> - - Returns `true` if the role is Mafia, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| role | <code>string</code> | The role to check |

<a name="module_mafia-game-server..kickExcessPlayers"></a>

### mafia-game-server~kickExcessPlayers(maxPlayers)
Removes excess players if the player count exceeds the max allowed.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  

| Param | Type | Description |
| --- | --- | --- |
| maxPlayers | <code>number</code> | The maximum allowed number of players |

<a name="module_mafia-game-server..assignRoles"></a>

### mafia-game-server~assignRoles(players, maxPlayers, numMafia)
Assigns roles to players based on the number of players and Mafia count.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  

| Param | Type | Description |
| --- | --- | --- |
| players | <code>Array</code> | The array of players |
| maxPlayers | <code>number</code> | The maximum number of players |
| numMafia | <code>number</code> | The number of Mafia players |

<a name="module_mafia-game-server..generateRoles"></a>

### mafia-game-server~generateRoles(maxPlayers, numMafia) ⇒ <code>Array</code>
Generates a shuffled list of roles based on the number of players and Mafia count.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  
**Returns**: <code>Array</code> - - The shuffled array of roles  

| Param | Type | Description |
| --- | --- | --- |
| maxPlayers | <code>number</code> | The maximum number of players |
| numMafia | <code>number</code> | The number of Mafia players |

<a name="module_mafia-game-server..handleVoting"></a>

### mafia-game-server~handleVoting(playerName, targetPlayer)
Handles voting logic when a player votes for another player.

**Kind**: inner method of [<code>mafia-game-server</code>](#module_mafia-game-server)  

| Param | Type | Description |
| --- | --- | --- |
| playerName | <code>string</code> | The name of the player who is voting |
| targetPlayer | <code>string</code> | The name of the player being voted for |

---

## Constants

<dl>
  <dt><a href="#roles">roles</a> : <code><a href="#Role">Array.&lt;Role&gt;</a></code></dt>
  <dd>
    <p>Array containing the roles in the game, such as Mafia and Citizen. The roles are distributed among players based on the number of players.</p>
  </dd>
  
  <dt><a href="#roleDesc">roleDesc</a> : <code><a href="#RoleDescription">Array.&lt;RoleDescription&gt;</a></code></dt>
  <dd>
    <p>Array of role descriptions, where each entry describes a specific role and its objective in the game.</p>
  </dd>
</dl>

## Typedefs

<dl>
  <dt><a href="#Role">Role</a> : <code>Object</code></dt>
  <dd>
    <p>Array of role objects representing the different roles in the game.</p>
  </dd>
  
  <dt><a href="#RoleDescription">RoleDescription</a> : <code>Object</code></dt>
  <dd>
    <p>Array containing descriptions of the roles in the game. Descriptions provide context and instructions for each role.</p>
  </dd>
</dl>

<a name="roles"></a>

## roles : [<code>Array.&lt;Role&gt;</code>](#Role)
Array containing the roles in the game, such as Mafia and Citizen.
The roles are distributed among players based on the number of players.

**Kind**: global constant  

<a name="roleDesc"></a>

## roleDesc : [<code>Array.&lt;RoleDescription&gt;</code>](#RoleDescription)
Array of role descriptions, where each entry describes a specific role and its objective in the game.

**Kind**: global constant  

<a name="Role"></a>

## Role : <code>Object</code>
Array of role objects representing the different roles in the game.

**Kind**: global typedef  

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the role. |

<a name="RoleDescription"></a>

## RoleDescription : <code>Object</code>
Array containing descriptions of the roles in the game. Descriptions provide context and instructions for each role.

**Kind**: global typedef  

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the role. |
| description | <code>string</code> | A brief explanation of the role's objective and behavior. |

---

<a name="Player"></a>

## Player
Class representing a player in the game.
Each player has a name, role, and additional properties for voting and elimination.

**Kind**: global class  

* [Player](#Player)
    * [new Player(name, role)](#new_Player_new)
    * [.name](#Player+name) : <code>string</code>
    * [.role](#Player+role) : <code>string</code>
    * [.eliminated](#Player+eliminated) : <code>boolean</code>
    * [.hasVoted](#Player+hasVoted) : <code>boolean</code>
    * [.targetVote](#Player+targetVote) : [<code>Player</code>](#Player) \| <code>null</code>
    * [.ability](#Player+ability) : <code>string</code> \| <code>null</code>
    * [.team](#Player+team) : <code>string</code> \| <code>null</code>
    * [.voteFor(player)](#Player+voteFor)
    * [.resetVote()](#Player+resetVote)
    * [.eliminate()](#Player+eliminate)

<a name="new_Player_new"></a>

### new Player(name, role)
Creates an instance of the Player class.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the player. |
| role | <code>string</code> | The role assigned to the player (e.g., Mafia, Citizen). |

<a name="Player+name"></a>

### player.name : <code>string</code>
The player's name.

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+role"></a>

### player.role : <code>string</code>
The role of the player (e.g., Mafia, Citizen).

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+eliminated"></a>

### player.eliminated : <code>boolean</code>
The player's status (whether they are eliminated or not).

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+hasVoted"></a>

### player.hasVoted : <code>boolean</code>
Flag indicating if the player has voted.

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+targetVote"></a>

### player.targetVote : [<code>Player</code>](#Player) \| <code>null</code>
The player that the current player has voted for.

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+ability"></a>

### player.ability : <code>string</code> \| <code>null</code>
The ability associated with the player's role (if any).
This can be used in the future for nighttime phase actions.

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+team"></a>

### player.team : <code>string</code> \| <code>null</code>
The team the player belongs to (e.g., Mafia team, Citizen team).

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+voteFor"></a>

### player.voteFor(player)
Allows the player to vote for another player.
Once the vote is cast, the player can no longer change their vote.

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| player | [<code>Player</code>](#Player) | The player that the current player is voting for. |

<a name="Player+resetVote"></a>

### player.resetVote()
Resets the player's vote, allowing them to vote again.
This is useful for scenarios where the player's vote is voided.

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+eliminate"></a>

### player.eliminate()
Eliminates the player from the game, changing their status to eliminated.
This is typically used when a player is voted out or otherwise removed.

**Kind**: instance method of [<code>Player</code>](#Player)  