import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext';      // imports the custom hook

function Game() {
    const [isHost, setIsHost] = useState(false);        // uses state to determine if a player is the host (unlocks the start button)
    const [messages, setMessages] = useState([]);       // uses state to change the message delivered to the player 
    const [role, setRole] = useState(null);             // uses state to change and store the player's role (default is NULL)
    const [playerName, setPlayerName] = useState('');   // uses state to change and store player names (default is '')
    const [isJoined, setIsJoined] = useState(false);    // uses state to determine if a player has joined the game
    const [showHelp, setShowHelp] = useState(false);    // uses state to toggle the help menu
    const [rolesList, setRolesList] = useState([]);     // uses state to store the entire roles list
    const ws = useWebSocket();                          // gets the WebSocket instance from context
    const navigate = useNavigate();                     // hook for navigation

    useEffect(() => {                                   // listens for messages from the WebSocket
        if (ws) {
            const handleMessage = (event) => {
                const data = JSON.parse(event.data);
            
                if (data.type === 'host') {
                    setIsHost(true);                                                                // changes the player's frontend state to host status
                    setMessages(prev => [...prev, data.message]);
                    //trigger host options menu here
                } else if (data.type === 'player' || data.type === 'message') {
                    setMessages(prev => [...prev, data.message]);
                } else if (data.type === 'role') {
                    setRole(data.role);                                                             // updates the frontend state of the player's role to match what was given in the backend
                    setMessages(prev => [...prev, `You are assigned the role of ${data.role}`]);
                } else if (data.type === 'rolesList') {
                    setRolesList(data.roleDesc);                                                    // changes the roles list to match the roles descriptions as from mafiaParameter.js
                } else if (data.type === 'toggleHelpOff') { 
                    setShowHelp(false);                                                             // universal toggle-off for the help menu (occurs after start is initiated)
                } else if (data.type === 'start') {
                    navigate('/startgame', { state: { role, playerName, isHost} });                 // sends every user to a new page: start page; 
                }                                                                                   // passes to the new page: the role, player name and if they are the host
            };
            ws.addEventListener('message', handleMessage)

            return () => {
                    ws.removeEventListener('message', handleMessage);
            };
        }


    }, [ws, navigate, role, playerName, isHost]); // re-run the effect if the WebSocket instance changes
    
    function isMafia(role) {
        if (role != "Citizen") {
            return true;
        }
        return false;
    }

    const handleJoinGame = () => {
        if (playerName.trim() && ws) {
            ws.send(JSON.stringify({ type: 'join', name: playerName }));    // sends the username of the player that joined to the backend
            setIsJoined(true);                                              // marks the player as joined to hide join controls/buttons
        }
    };

    const startGame = () => {
        if (isHost && ws) {
            ws.send(JSON.stringify({ type: 'start' }));                     // sends the 'start' tag to the backend
        }
    };

    const toggleHelp = () => {
        setShowHelp(!showHelp);
    };
    
    const goToStartGame = () => {
        startGame();
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

                            <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>

                            <div className="glow">
                                {isHost && (            //host only elements
                                    <button onClick={goToStartGame}>Start Game</button>


                                )}
                            </div>

                            <div>
                                <button onClick={toggleHelp}>Help</button>
                            </div>
                            {showHelp && (
                                <div className ="helpbox">
                                    <h3>Character Roles</h3>
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
                            )}
                        </div>
                    </div>

                    
                    
                    <div className="container-login100">
                        <div className="wrap-login100">
                        
                        </div>
                    </div>
                    
                    

                </div>


            )}
        </div>
    );
}

export default Game;
