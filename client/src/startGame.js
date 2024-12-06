import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';                                  // imports the custom hook
import RoleDisplay from './roleDisplay';
import { useLocation, useNavigate } from 'react-router-dom';
import Tick from './Sounds/Tick.mp3'
import "./startGame.css"

function StartGame() {
    const ws = useWebSocket();                                                      // gets the WebSocket instance and connection status
    const [players, setPlayers] = useState([]);                                     // uses state to store the player list for voting
    const [voting, setVoting] = useState(false);                                    // uses state to determine when voting occurs
    const [votes, setVotes] = useState({});                                         // uses state to store a player's vote
    const [eliminatedPlayers, setEliminatedPlayers] = useState([]);                 // uses state to store a list of eliminated players
    const [isEliminatedListVisible, setIsEliminatedListVisible] = useState(false);  // uses state to toggle eliminated players list visibility
    const [alivePlayers, setAlivePlayers] = useState([]);                           // uses state to store a list of alive players
    const [isAliveListVisible, setIsAliveListVisible] = useState(false);            // uses state to toggle alive players list visibility
    const [timeLeft, setTimeLeft] = useState(10);                                   // starting timer value (defaults as 10 seconds)
    const [finalVote, setFinalVote] = useState(null);                               // uses state to store the final vote of each user
    const [showHelp, setShowHelp] = useState(false);                                // uses state to toggle the help menu

    const [voted, setVoted] = useState(true);

    const location = useLocation();
    const { role, playerName, isHost, dayLength, nightLength, rolesList } = location.state;               // includes dayLength and nightLength within the page state (needed for the timer value to transfer) 

    const navigate = useNavigate();                                                 // Hook for navigation

    useEffect(() => {                                                               // listens for messages from the WebSocket (and update state)
        if (!ws) {
        console.log("WebSocket is not initialized");
        return;
        } else if (ws) {
            if (!voting) {
                ws.send(JSON.stringify({ type: 'startVote', gamePhase: 'DAY'}));                      // immediately after the start button is clicked, this sends the 'startVote' tag to the backend to activate the voting phase
            }
            const handleMessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'startVoting') {  
                    setAlivePlayers(data.alivePlayers);
                    const newEliminatedPlayers = players.filter(player => !alivePlayers.includes(player));
                    setEliminatedPlayers(newEliminatedPlayers);
                    console.log(playerName);
                    console.log(role);
                    setVoting(true);                                         // this is for the start button
                    if(alivePlayers.includes(playerName)){
                        setVoted(false); 
                      }                                                                  // turns on voting
                    ws.send(JSON.stringify({ type: 'beginDayTimer', dayLength: dayLength}));                             // sends the signal to start the day timer
                    setPlayers(data.players);
                    setVotes({});                                                                   // reset vote tally for players
                } else if (data.type === 'voteResults') {
                    setEliminatedPlayers(prev => [...prev, data.eliminatedPlayer]);                 // adds the eliminated player to the array
                    setVoting(false);                                                               // turns off voting (can be useful for next phase implementation)                                                                                       // sets elimination message *i was having issues with this and navigate, this line may be unnecessary but keep it for consistency
                    setVotes({});                                                                   // reset vote tally for players
                    navigate('/Eliminated', {state: { role, playerName, isHost, rolesList, dayLength, nightLength, eliminationMessage: data.message, currentPhase: "DAY", elimination: true}});           // send players to Eliminated screen to see message of who is eliminated
                } else if (data.type === 'voteTie') {
                    setVoting(false);                                                               // turns off voting                                           // sets elimination message *i was having issues with this and navigate, this line may be unnecessary but keep it for consistency
                    setVotes({});                                                                   // reset vote tally for players
                    navigate('/Eliminated', {state: { role, playerName, isHost, rolesList, dayLength, nightLength, eliminationMessage: data.message, currentPhase: "DAY", elimination: false}});           // send players to Eliminated screen to see message of who tie
                } else if (data.type === 'dead') {                                                  // if this person receives this dead data type, then they have been eliminated and will be routed to the dead screen
                    navigate('/Dead');
                } else if (data.type === 'timer') {
                    if(data.timeLeft === 0){
                        if(!voted){ //checks if didnt vote then sends empty vote
                            console.log("voting for no one!")
                            ws.send(JSON.stringify({ type: 'vote', playerName: null}));
                        }   
                    } else if (data.timeLeft > 0){
                        speak(Tick, 0.4);
                    }
                    setTimeLeft(data.timeLeft);                                                     // sets the local timer based on the server timer
                //} else if (data.type === 'phase') {
                   // if (data.phase === 'NIGHT') {                                                // looks for the phase tag, and will change or stay on the page based on that
                     //   setVoting(false);
                       // navigate('/Night', { state: {role, playerName, isHost, dayLength, nightLength, rolesList } });    // move to night page 
                   // }
                } else if (data.type === 'gameOver') {   
                    console.log(data.winner);                                           // when gameOver data type is received, send player to game over screen
                    navigate('/GameOver', { state: {gameOverMessage: data.message, winner: data.winner}});
                }
            }
            ws.addEventListener('message', handleMessage)

            return () => {
                ws.removeEventListener('message', handleMessage);
            };
        }
    }, [ws, navigate, role, playerName, isHost, eliminatedPlayers, players, voting, dayLength, nightLength, voted, alivePlayers, rolesList]);  // Re-run the effect if WebSocket instance changes


    const voteForPlayer = (playerName) => {
        if (votes[playerName] || eliminatedPlayers.includes(playerName)) return;        // checks to see if a player already voted or dead; prevents a player voting more than once

        setVoted(true);
        setVotes({ ...votes, [playerName]: true });                                     // stores the votes for players and sets whether they have voted to true

        ws.send(JSON.stringify({ type: 'vote', playerName: playerName }));
                                                                    // sends the player's vote to the server
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  function speak(sound, vol) {
    var audio = new Audio(sound);
    audio.volume = vol;  // Set the volume level (0.0 to 1.0)
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
   };

  useEffect(() => {
    console.log('Updated voted state:', voted);  // This will run whenever `voted` changes
  }, [voted]);

  return (
    <div>
      <div className="startGameDay">
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
        {role && <RoleDisplay role={role} />}


        {/* Voting Section */}
        {voting && !eliminatedPlayers.includes(playerName) &&(
        <div className="voting-container">
            <div className="voting-header">
                Vote to Eliminate a Player
            </div>
            <div className="voting-players-container">
                <div className="voting-player-list">
                    {/* Buttons for voting */}
                    {alivePlayers.map((player) => (
                        <div key={player} className="voting-player-name">
                            <label>
                                <input
                                    type="radio"
                                    name="vote"
                                    value={player}
                                    onChange={() => setFinalVote(player)}
                                    disabled={eliminatedPlayers.includes(player)} // Prevent voting for eliminated players
                                />
                                {player}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {/* Submit Vote Button */}

            <button className="submit-btn"
                onClick={() => {
                    if (finalVote) voteForPlayer(finalVote);
                }}
                disabled={!finalVote} // Disable button until a player is selected
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
    </div>
    );
}

export default StartGame;