import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';                    // imports the custom hook
import RoleDisplay from './roleDisplay';
import { useLocation } from 'react-router-dom';

function StartGame() {
  const ws = useWebSocket();                                                      // gets the WebSocket instance and connection status
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);                                     // uses state to store the player list for voting
  const [voting, setVoting] = useState(false);                                    // uses state to determine when voting occurs
  const [votes, setVotes] = useState({});                                         // uses state to store a player's vote
  const [rolesList, setRolesList] = useState([]);                                 // uses state to store the entire roles list
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);                 // uses state to store a list of eliminated players
  const [isEliminatedListVisible, setIsEliminatedListVisible] = useState(false);  // uses state to toggle eliminated players list visibility
  const [alivePlayers, setAlivePlayers] = useState([]);                           // uses state to store a list of alive players
  const [isAliveListVisible, setIsAliveListVisible] = useState(false);            // uses state to toggle alive players list visibility
  const [isDay, setIsDay] = useState(true);                                       // uses state to store whether it is night or day game phase
  const [timeLeft, setTimeLeft] = useState(10);                                   // starting timer value (defaults as 10 seconds)

  const location = useLocation();
  const { role, playerName, isHost } = location.state;

  useEffect(() => {                                                    // listens for messages from the WebSocket (and update state)
    if (!ws) {
      console.log("WebSocket is not initialized");
      return;
    }else if(ws){
      if(!voting){
        ws.send(JSON.stringify({ type: 'startVote'}));                 // immediately after the start button is clicked, this sends the 'startVote' tag to the backend to activate the voting phase
      }
      const handleMessage = (event) => {
          console.log("event!");
          const data = JSON.parse(event.data);
          if (data.type === 'rolesList') {
              setRolesList(data.roleDesc);                                                        // changes the roles list to match the roles descriptions as from mafiaParameter.js
          } else if (data.type === 'startVoting') {                                               // this is for the start button
              console.log("voting!");
              setVoting(true);                                                                    // turns on voting
              ws.send(JSON.stringify({ type: 'beginTimer' }));
              setPlayers(data.players);
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteResults') {
              setEliminatedPlayers(prev => [...prev, data.eliminatedPlayer]);                     // adds the eliminated player to the array
              setAlivePlayers();
              setVoting(false);                                                                   // turns off voting (can be useful for next phase implementation)
              setMessages(prev => [...prev, `${data.eliminatedPlayer} has been eliminated!`]);
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteTie') {
              setVoting(false);                                                                   // turns off voting
              setMessages(prev => [...prev, data.message]);                                       // reset vote tally for players
              setVotes({});
          } else if (data.type === 'timer') {
            setTimeLeft(data.timeLeft);                                                           // sets the local timer based on the server timer
            console.log("RECEIVED TIMER: " + data.timeLeft);                                      // debugging
          } else if (data.type === 'phase') {
            if (data.phase === 'DAY') {                                                           // looks for the phase tag, and will update the IsDay state based on that
              setIsDay(true);                                                                     
            } else {
              setIsDay(false);
            }
          }
    }

    ws.addEventListener('message', handleMessage)

    return () => {
            ws.removeEventListener('message', handleMessage);
    };

  }

  }, [ws]); // re-run the effect if WebSocket instance changes

  useEffect(() => {
    const newAlivePlayers = players.filter(player => !eliminatedPlayers.includes(player));
    setAlivePlayers(newAlivePlayers);
  }, [players, eliminatedPlayers]);

  const voteForPlayer = (playerName) => {
    if (votes[playerName] || eliminatedPlayers.includes(playerName)) return;    // checks to see if a player already voted or dead; prevents a player voting more than once

    setVotes({ ...votes, [playerName]: true });                                 // stores the votes for players and sets whether they have voted to true

    ws.send(JSON.stringify({ type: 'vote', playerName: playerName }));          // sends the player's vote to the server
};

return (
  <div>
    <div className={isDay ? "startGameDay" : "startGameNight"}>
      <div className="gameTitle">
        <h2>MafiUhh...</h2>
      </div>

      {/* Display the countdown timer */}
      <div className="timerWrapper">
        <div className="timer">
          <div className="timerNumber">{timeLeft}</div>
        </div>
      </div>

      {/* Display the user's role */}
      {role && <RoleDisplay role={role} />}

      {/* Display the elimination messages after voting */}
      {messages.length > 0 && (
        <div>
          <h3>Game Updates:</h3>
          <div>
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>
      )}

      {/* Voting Section */}
      {voting && !eliminatedPlayers.includes(playerName) && (
        <div>
          <h3>Vote to Eliminate a Player</h3>
          {players.map((player) => (
            <button
              key={player}
              onClick={() => voteForPlayer(player)}
              disabled={eliminatedPlayers.includes(player)}
            >
              {player}
            </button>
          ))}
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
  </div>
);
}


export default StartGame;

