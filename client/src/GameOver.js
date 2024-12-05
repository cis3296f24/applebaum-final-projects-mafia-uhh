import { useLocation } from 'react-router-dom';
import GameOverSound from './Sounds/GameOver.mp3'
import cWin from './Sounds/cWin.mp3'
import mWin from './Sounds/mWin.mp3'
import './GameOver.css';
import { useEffect } from 'react';


function GameOver() {

  let isPlaying = false;

    const location = useLocation();
    const { gameOverMessage , winner } = location.state;
    
    function speak(sound, callback) {
      let audio = new Audio(sound);
      audio.volume = 0.2;  // Set the volume level (0.0 to 1.0)
    
      // Play the audio
      audio.play().catch((error) => {
          console.error('Audio playback failed:', error);
      })

      audio.onended = callback; 
    };

    function audio() {
      if (!isPlaying) {
          isPlaying = true;  // Set the flag to indicate that an audio is playing
          speak(GameOverSound, function() {  // Play the first sound
              if (winner === 'C') {
                  speak(cWin, function() {  // Play the second sound after the first one finishes
                      isPlaying = false; // Reset flag once all audio has played
                  });
              } else {
                  speak(mWin, function() {  // Play the third sound after the second one finishes
                      isPlaying = false;  // Reset flag after all audio has finished
                  });
              }
          });
      }
  };

    useEffect(() => {
     audio();
    }, [winner]);

    return (
      <div className="gameOverPage">
        <div className="gameTitle">
          <h2>MafiUhh...</h2>
        </div>

        <div className="gameOverMessage">
            {gameOverMessage}
        </div>

      </div>
    );
  }
  
  export default GameOver;