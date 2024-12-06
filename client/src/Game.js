import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext';          // Import the custom hook
import './Game.css';

function Game() {
  const [isHost, setIsHost] = useState(false);              // uses state to determine if a player is the host (unlocks the start button)
  const [messages, setMessages] = useState([]);             // uses state to change the message delivered to the player 
  const [role, setRole] = useState(null);                   // uses state to change and store the player's role (default is NULL)
  const [playerName, setPlayerName] = useState('');         // uses state to change and store player names (default is '')
  const [isJoined, setIsJoined] = useState(false);          // uses state to determine if a player has joined the game
  const [showHelp, setShowHelp] = useState(false);          // uses state to toggle the help menu
  const [rolesList, setRolesList] = useState([]);           // uses state to store the entire roles list
  const [currentPlayers, setCurrentPlayers] = useState([]); // uses state to store list of current players for display
  const ws = useWebSocket();                                // Get the WebSocket instance from context
  const navigate = useNavigate();                           // Hook for navigation
  const [maxPlayers, setMaxPlayers] = useState(6);         // uses state to change and store maxPlayers (default is 15)
  const [numMafia, setNumMafia] = useState(2);              // uses state to change and store numMafia (default is 2)
  const [nightLength, setNightLength] = useState(13);       // uses state to change and store nightLength (default is 13)
  const [dayLength, setDayLength] = useState(13);       // uses state to change and store dayLength (default is 13)
  const [invalidPlayerNameMessage, setInvalidPlayerNameMessage] = useState(''); // uses state to store messages for invalid player names
  const [disconnectMessage, setDisconnectMessage] = useState(null); // State for connection status message
  const [invalidStartMessage, setInvalidStartMessage] = useState(null); //State for invalid start message (wrong # of players)
  

  useEffect(() => {                                                                       // listens for messages from the WebSocket
    if (ws) {
      const handleMessage = (event) => {
        const data = JSON.parse(event.data);
    
        if (data.type === 'host') {
            setIsHost(true);                                                              // changes the player's frontend state to host status
            setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'player' || data.type === 'message') {
            setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'role') {
            setRole(data.role);                                                           // updates the frontend state of the player's role to match what was given in the backend
            setMessages(prev => [...prev, `You are assigned the role of ${data.role}`]);
        } else if (data.type === 'rolesList') {
            setRolesList(data.roleDesc);                                                  // changes the roles list to match the roles descriptions as from mafiaParameter.js
        } else if (data.type === 'toggleHelpOff') { 
            setShowHelp(false);                                                           // universal toggle-off for the help menu (occurs after start is initiated)
        } else if (data.type === 'newNightTimer') {
            console.log("Received NEW Night Timer Amount: [" + data.nightLength + "].");  // debugging
            setNightLength(data.nightLength);                                             // receives the new timer value and updates it (required for all non-host users)
        } else if (data.type === 'newDayTimer') {
            console.log("Received NEW Day Timer Amount: [" + data.dayLength + "].");  // debugging
            setDayLength(data.dayLength);                                             // receives the new timer value and updates it (required for all non-host users)
        } else if (data.type === 'start') {
            setNightLength(data.nightLength);
            setDayLength(data.dayLength);                                             // receives the new timer value and updates it (required for all non-host users)             
            navigate('/startgame', { state: { role, playerName, isHost, dayLength, nightLength, rolesList } }); // sends every user to a new page: start page, passes to the new page: the role, player name, if they are the host, and nighttime timer amount
        } else if (data.type === 'updateCurrentPlayerList') {                           // updated the current player list for display
            setCurrentPlayers(data.currentPlayers);
        } else if (data.type === 'invalidPlayerName') {                                 // if player name is invalid, reset isJoined to false *it should already be false, just a check
            setIsJoined(false);
            setInvalidPlayerNameMessage(data.message);                                  // set the error message for invalid player name
        } else if (data.type === 'validPlayerName') {                                   // if player name is valid, joins the player
            setIsJoined(true);                                                          // marks the player as joined to hide join controls/buttons
        }
      }           
      
      ws.onclose = (event) => {
        console.log('WebSocket connection closed.');
        // You can check the close code or reason if needed
        console.log(`Close code: ${event.code}`);
        console.log(`Close reason: ${event.reason}`);
        setDisconnectMessage(`You have been kicked: ${event.code} - ${event.reason}`);
      };

      ws.addEventListener('message', handleMessage)

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws, navigate, role, playerName, isHost, currentPlayers, nightLength ]); // Re-run the effect if the WebSocket instance changes

  const handleJoinGame = () => {                                                // function to handle joining the game
    if (playerName.trim() && ws) {
        ws.send(JSON.stringify({ type: 'join', name: playerName }));        // sends the username of the player that joined to the backend
    }
  };

  const startGame = () => {
    if (isHost && ws) {
        ws.send(JSON.stringify({ type: 'start', maxPlayers: maxPlayers, numMafia: numMafia, dayLength: dayLength, nightLength: nightLength })); // sends the 'start' tag to the backend
    }
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };
    
  const goToStartGame = () => {
    //console.log("STARTGAME PARAMETERS: " + currentPlayers.length + "].");
    if (numMafia < maxPlayers && maxPlayers == currentPlayers.length){
        startGame();
    } else {
        setInvalidStartMessage("Incorrect number of players!");
    }
  };

  return (
      <div>
          {!isJoined ? (
              <div className="login">
                  <div className="gameTitle">
                      <h2>MAFIUHH...</h2>
                  </div>
                  <div className="container-login100">
                      <div className="wrap-login100">
                          <input
                              type="text"
                              placeholder="Enter your name"
                              value={playerName}
                              onChange={(e) => setPlayerName(e.target.value)}
                          />
                          {invalidPlayerNameMessage && <p className="invalidPlayerNameMessage">{invalidPlayerNameMessage}</p>}
                          <div className="glow">
                              <button className="lgn-btn" onClick={handleJoinGame}>
                                  Join Game
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          ) : (
              <div className="login">
                  <div className="gameTitle">
                      <h2>MAFIUHH...</h2>
                  </div>
                      <div className="container-login100">
                          <div className="wrap-login100">
                              <div className = "host-header">
                                  {isHost && "You are the Host"}
                              </div>

                              {invalidStartMessage && (
                                <div style={{ color: 'red', fontWeight: 'bold', marginTop: '20px' }}>
                                    {invalidStartMessage}
                                </div>
                              )}

                              <div className="players-container">
                                  <h2>Current Players</h2>
                                  <div id="players-list" className="players-list">
                                      {currentPlayers.map((player, index) => (
                                          <p key={index} className="player-name">{player}</p>
                                      ))}
                                  </div>
                              </div>
                              <div className="glow">
                                  {isHost && <button onClick={goToStartGame}>Start Game</button>}
                              </div>

                                <div>
                                    <button onClick={toggleHelp}>Help</button>
                                </div>

                                {showHelp && (
                                    <div className="help-modal-overlay" onClick={toggleHelp}>
                                        <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
                                            <div className="help-modal-header">
                                                <h3>Character Roles</h3>
                                                <button className="close-btn" onClick={toggleHelp}>X</button>
                                            </div>
                                            <div className="help-modal-body">
                                                {rolesList
                                                    .filter((value, index, self) =>
                                                        index === self.findIndex((t) => t.name === value.name)  // Ensures distinct roles by name
                                                    )
                                                    .map((roleDesc, index) => (
                                                    <div className="helplist" key={index}>
                                                        <h4>{roleDesc.name}</h4>
                                                        <p>{roleDesc.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isHost && ( 
                        <div className="container-login100">
                            <div className="wrap-login100">
                                <h3>Host Options</h3>
                                {disconnectMessage && (
                                <div style={{ color: 'red', fontWeight: 'bold', marginTop: '20px' }}>
                                    {disconnectMessage}
                                </div>
                                )}
                                <label htmlFor="name">Enter number of players:</label>
                                <input
                                    type="text"
                                    
                                    value={maxPlayers}
                                    //change value based on max players
                                    onChange={(e) => setMaxPlayers(e.target.value)}
                                />
                                <label htmlFor="name">Enter # of mafia:</label>
                                <input
                                    type="text"
                                    
                                    value={numMafia}
                                    //change value based on # of mafia
                                    onChange={(e) => setNumMafia(e.target.value)}
                                />
                                <label htmlFor="nightLength">Enter length of night (in seconds):</label>
                                <input
                                    type="number"
                                    value={nightLength}
                                    onChange={(e) => {
                                    const newNightValue = Number(e.target.value);
                                    setNightLength(newNightValue);
                                    console.log("Updated state (nightLength): ", newNightValue);
                                    ws.send(JSON.stringify({ type: 'newNightTimer', nightLength: newNightValue }));
                                }}
                                />
                                <label htmlFor="dayLength">Enter length of day (in seconds):</label>
                                <input
                                    type="number"
                                    value={dayLength}
                                    onChange={(e) => {
                                    const newDayValue = Number(e.target.value);
                                    setDayLength(newDayValue);
                                    console.log("Updated state (dayLength): ", newDayValue);
                                    ws.send(JSON.stringify({ type: 'newDayTimer', dayLength: newDayValue }));
                                }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Game;