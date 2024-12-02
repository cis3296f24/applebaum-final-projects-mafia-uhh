import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';                                // Import the custom hook
import RoleDisplay from './roleDisplay';
import { useLocation, useNavigate } from 'react-router-dom';
import sound from './Narrations/MafiaCall.mp3'
import './Night.css';

function Night() {
  const ws = useWebSocket();                                                      // Get the WebSocket instance and connection status
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);                                     // uses state to store the player list for voting
  const [voting, setVoting] = useState(false);                                    // uses state to determine when voting occurs
  const [votes, setVotes] = useState({});                                         // uses state to store a player's vote
  // const [rolesList, setRolesList] = useState([]);                                 // uses state to store the entire roles list
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);                 // uses state to store a list of eliminated players
  const [isEliminatedListVisible, setIsEliminatedListVisible] = useState(false);  // uses state to toggle eliminated players list visibility
  const [alivePlayers, setAlivePlayers] = useState([]);                           // uses state to store a list of alive players
  const [isAliveListVisible, setIsAliveListVisible] = useState(false);            // uses state to toggle alive players list visibility

  const [timeLeft, setTimeLeft] = useState(10);                                   // Starting timer value
  const [finalVote, setFinalVote] = useState(null);                               // uses state to store the final vote of each user
  const [showHelp, setShowHelp] = useState(false);                                // uses state to toggle the help menu

  const[isNarrating, setNarrating] = useState(false);

  const location = useLocation();
  const { role, playerName, isHost, nightLength, rolesList } = location.state;               // includes nightLength within the page state 

  const navigate = useNavigate();                                                 // Hook for navigation

  useEffect(() => {                                                                   // listens for messages from the WebSocket (and update state)
      if (!ws) {
        console.log("WebSocket is not initialized");
        return;
      }else if(ws){  
        const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'startVoting') {
                speak(sound);
                setVoting(true);                                                      // turns on voting
                ws.send(JSON.stringify({ type: 'beginNightTimer', nightLength: nightLength }));
                setPlayers(data.players);
                setVotes({});                                                         // reset vote tally for players
            } else if (data.type === 'voteResults') {
                setEliminatedPlayers(prev => [...prev, data.eliminatedPlayer]); 
                setAlivePlayers();                                                    // adds the eliminated player to the array                                              
                setMessages(prev => [...prev, data.message]);
                setVotes({});                                                         // reset vote tally for players
            } else if (data.type === 'voteTie') {                                              
                setMessages(prev => [...prev, data.message]);                         // reset vote tally for players
                setVotes({});                                                                              
            } else if (data.type === 'timer') {
              setTimeLeft(data.timeLeft);                                             // sets the local timer based on the server timer           
            } else if (data.type === 'phase') {
              if (data.phase === 'DAY') {                                             // looks for the phase tag, and will update the IsDay state based on that
                setVoting(false);  
                ws.removeEventListener('message', handleMessage);                                                   // turns off voting 
                navigate('/startGame', { state: { role, playerName, isHost, nightLength, rolesList} });       // navigates to the startGame.js page                                                             
              } else if (data.phase === 'NIGHT NARRATION'){
                setNarrating(true);
              }
            } else if (data.type === 'gameOver') {
              setMessages(prev => [...prev, data.message]);
            }
      }
      ws.addEventListener('message', handleMessage)

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws, navigate, role, playerName, isHost, voting, nightLength, rolesList]);                        // Re-run the effect if WebSocket instance changes

  useEffect(() => {
    const newAlivePlayers = players.filter(player => !eliminatedPlayers.includes(player));
    setAlivePlayers(newAlivePlayers);
  }, [players, eliminatedPlayers]);

  const voteForPlayer = (playerName) => {
    if (votes[playerName] || eliminatedPlayers.includes(playerName)) return;                // checks to see if a player already voted or dead; prevents a player voting more than once

    setVotes({ ...votes, [playerName]: true });                                             // stores the votes for players and sets whether they have voted to true

    ws.send(JSON.stringify({ type: 'vote', playerName: playerName }));                      // sends the player's vote to the server
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

function speak(sound) {
  console.log("Mafia announced");
  var audio = new Audio(sound);
  audio.play().catch((error) => {
    console.error('Audio playback failed:', error);
  });
 };

  return (
      <div>
      {!isNarrating && (
        <div className="startGameNight">
          <div className="gameTitle">
            <h2>MafiUhh...</h2>
            <div className="help-btn">
              <button onClick={toggleHelp}>Help</button>
            </div>
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

        {/* Display the countdown timer */}
        <div className="timerWrapper">
            <div className="timer">
            <div className="timerNumber">{timeLeft}</div>
            </div>
        </div>

        {/* Display the user's role */}
        {role && (
            <RoleDisplay role={role}/>
        )}
          
        {/* Voting Section */}
        {voting && !eliminatedPlayers.includes(playerName) && (
        <div>
            <h3>Vote to Eliminate a Player</h3>
            <div>
                {/* Player Buttons for voting */}
                {players.map((player) => (
                    <div key={player}>
                        <label>
                            <input
                                type="radio"                                  // circle button design for now
                                name="vote"
                                value={player}
                                onChange={() => setFinalVote(player)}         // changes the state of the final vote for the user
                                disabled={eliminatedPlayers.includes(player)} // eliminated players can't vote
                            />
                            {player}
                        </label>
                    </div>
                ))}
            </div>
            {/* Submit Vote Button */}
            <button
                onClick={() => {
                    if (finalVote) voteForPlayer(finalVote);                  // submits the player's vote through the voteForPlayer function
                }}
                disabled={!finalVote}                                         // button is disabled until a player is selected
            >
                Submit Vote
            </button>
        </div>
        )}

        <div className="playerListsButtonWrapper">
        {/* Toggle Button for Eliminated Players List */}
        <div className="elimPlayersListButtonWrapper">
          <button
            onClick={() => setIsEliminatedListVisible((prev) => !prev)}
            className={`elimPlayersListButton player-button ${isAliveListVisible ? "disabled" : ""}`}
            disabled={isAliveListVisible}
          >
            {isEliminatedListVisible ? "Hide Eliminated Players" : "Show Eliminated Players"}
          </button>
        </div>

        {/* Toggle Button for Alive Players List */}
        <div className="alivePlayersListButtonWrapper">
          <button
            onClick={() => setIsAliveListVisible((prev) => !prev)}
            className={`alivePlayersListButton player-button ${isEliminatedListVisible ? "disabled" : ""}`}
            disabled={isEliminatedListVisible}
          >
            {isAliveListVisible ? "Hide Alive Players" : "Show Alive Players"}
          </button>
        </div>
        </div>

        {/* Eliminated Players List Modal */}
        {isEliminatedListVisible && (
          <div className="elimPlayersList-overlay">
            <div className="elimPlayersList-modal">
              <h3>Eliminated Players:</h3>
              <div className="elimPlayers-list">
                {eliminatedPlayers.map((player, index) => (
                    <p key={index} className="elimPlayer-name">{player}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alive Players List Modal */}
        {isAliveListVisible && (
          <div className="alivePlayersList-overlay">
            <div className="alivePlayersList-modal">
              <h3>Alive Players:</h3>
              <div className="alivePlayers-list">
                {alivePlayers.map((player, index) => (
                    <p key={index} className="alivePlayer-name">{player}</p>
                ))}
              </div>
            </div>
          </div>
        )}
                  
        </div>
        )}
        {isNarrating && (
            <div className="startGameNight">
            <div className="gameTitle">
                <h2>MafiUhh...</h2>
            </div>
            {/* Display the elimination messages after voting */}
            <div>
            {messages.length > 0 && (
                <div className="narration">
                <h3>Game Updates:</h3>
                <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>
                </div>
            )}
            </div>
                                      {/* COMMENTED OUT THE CONTINUE BUTTON FOR NOW */}
                                      {/*<div className="glow">
                                            {isHost && <button onClick={phaseChange}>Continue</button>}
                                        </div>*/}
            </div>
        )}
        </div>
  );
}

export default Night;