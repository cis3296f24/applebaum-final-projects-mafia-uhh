import React, { useState, useEffect, useRef } from 'react';

function Game() {
    const [isHost, setIsHost] = useState(false);        // uses state to determine if a player is the host (unlocks the start button)
    const [messages, setMessages] = useState([]);       // uses state to change the message delivered to the player 
    const [role, setRole] = useState(null);             // uses state to change and store the player's role (default is NULL)
    const [playerName, setPlayerName] = useState('');   // uses state to change and store player names (default is '')
    const [isJoined, setIsJoined] = useState(false);    // uses state to determine if a player has joined the game
    const [showHelp, setShowHelp] = useState(false);    // uses state to toggle the help menu
    const [rolesList, setRolesList] = useState([]);     // uses state to store the entire roles list
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:4000');

        ws.current.onmessage = (event) => {             // parses the incoming event type
            const data = JSON.parse(event.data);
            
            if (data.type === 'host') {
                setIsHost(true);
                setMessages(prev => [...prev, data.message]);
            } else if (data.type === 'player' || data.type === 'message') {
                setMessages(prev => [...prev, data.message]);
            } else if (data.type === 'role') {
                setRole(data.role);
                setMessages(prev => [...prev, `You are assigned the role of ${data.role}`]);
            } else if (data.type === 'rolesList') {
                setRolesList(data.roles);               // for the entire roles list (not one unit)
            } else if (data.type === 'toggleHelpOff') { 
                setShowHelp(false);                     // universal toggle-off for the help menu
            }
        };

        return () => {
            ws.current.close();
        };
    }, []);

    const handleJoinGame = () => {
        if (playerName.trim()) {
            ws.current.send(JSON.stringify({ type: 'join', name: playerName }));
            setIsJoined(true);
        }
    };

    const startGame = () => {
        if (isHost) {
            ws.current.send(JSON.stringify({ type: 'start' }));
        }
    };

    const toggleHelp = () => {
        setShowHelp(!showHelp);
    };
    
    // Helper function to get the image source based on the role
    const getRoleImage = () => {
        if (role === 'Mafia') {
            return '/mafia.jpg';  // Path to the mafia image in the public folder
        } else if (role === 'Citizen') {
            return '/citizen.jpg';  // Path to the citizen image in the public folder
        }
        return null;  // No image if no role assigned
    };

    return (
        <div>
            <h2>Game Messages</h2>
            <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>
            
            {!isJoined ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button onClick={handleJoinGame}>Join Game</button>
                </div>
            ) : (
                <>
                    {isHost && <button onClick={startGame}>Start Game</button>}
                    
                    {role && (
                        <div>
                            <h3>Your Role: {role}</h3>
                            <img src={getRoleImage()} alt={role} style={{ width: '300px', marginTop: '20px' }} />
                        </div>
                    )}

                    <button onClick={toggleHelp}>Help</button>

                    {showHelp && (
                        <div>
                            <h3>Character Roles</h3>
                            {rolesList.map((role, index) => (
                                <div key={index}>
                                    <h4>{role.name}</h4>
                                    <p>{role.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Game;
