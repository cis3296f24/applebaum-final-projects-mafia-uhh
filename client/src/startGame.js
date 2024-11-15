import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext'; // Import the custom hook
import RoleDisplay from './roleDisplay';
import { useLocation } from 'react-router-dom';

function StartGame() {
  const ws = useWebSocket(); // Get the WebSocket instance and connection status
  const [messages, setMessages] = useState([]);
  //const isHost = sessionStorage.getItem("isHost");
  //const role = sessionStorage.getItem("role");
  const [players, setPlayers] = useState([]);         // uses state to store the player list for voting
  const [voting, setVoting] = useState(false);        // uses state to determine when voting occurs
  const [votes, setVotes] = useState({});             // uses state to store a player's vote
  const [rolesList, setRolesList] = useState([]);     // uses state to store the entire roles list
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);     // uses state to store a list of eliminated players

  const location = useLocation();
  const { role, playerName, isHost } = location.state;

  //modify time left for timer here
  const timeLeft = 60;




  // Listen for messages from the WebSocket (and update state)
  useEffect(() => {
    if (!ws) {
      console.log("WebSocket is not initialized");
      return;
    }else if(ws){
      if(!voting){
        ws.send(JSON.stringify({ type: 'startVote'}));
      }
      const handleMessage = (event) => {
          console.log("event!");
          const data = JSON.parse(event.data);
          if (data.type === 'rolesList') {
              setRolesList(data.roleDesc);
          } else if (data.type === 'startVoting') {
              console.log("voting!");
              setVoting(true);                                                                    // turns on voting
              setPlayers(data.players);
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteResults') {
              setEliminatedPlayers(prev => [...prev, data.eliminatedPlayer]);                     // adds the eliminated player to the array
              setVoting(false);                                                                   // turns off voting (can be useful for next phase implementation)
              setMessages(prev => [...prev, `${data.eliminatedPlayer} has been eliminated!`]);
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteTie') {
              setVoting(false);                                                                   // turns off voting
              setMessages(prev => [...prev, data.message]);                                       // reset vote tally for players
              setVotes({});
          }
          setMessages((prevMessages) => [...prevMessages, data.message]); // Add new message
    }

    ws.addEventListener('message', handleMessage)

    return () => {
            ws.removeEventListener('message', handleMessage);
    };

  }

  }, [ws]); // Re-run the effect if WebSocket instance changes


  const voteForPlayer = (playerName) => {
    if (votes[playerName] || eliminatedPlayers.includes(playerName)) return;    // checks to see if a player already voted or dead; prevents a player voting more than once

    setVotes({ ...votes, [playerName]: true });                                 // stores the votes for players and sets whether they have voted to true

    ws.send(JSON.stringify({ type: 'vote', playerName: playerName }));  // sends the player's vote to the server
};


  return (
    <div className="startGame">
        <div className="gameTitle">
          <h2>MafiUhh...</h2>
        </div>
      {isHost && (
        <div className="user">
          Host
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
      {console.log(voting)}
      {voting && !eliminatedPlayers.includes(playerName) && (
                              <div>
                                  <h3>Vote to Eliminate a Player</h3>
                                  {players.map(player => (
                                      <button key={player} onClick={() => voteForPlayer(player)} disabled={eliminatedPlayers.includes(player)}>
                                          {player}
                                      </button>
                                  ))}
                              </div>
                          )}
    </div>
  );
}

export default StartGame;
