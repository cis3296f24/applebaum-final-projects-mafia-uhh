import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext';
import './Dead.css';

function Dead() {
    const ws = useWebSocket();
    const navigate = useNavigate();

    useEffect(() => {
        const handleMessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'gameOver') {                                              // when gameOver data type is received, send player to game over screen
            navigate('/GameOver', { state: {gameOverMessage: data.message, winner: data.winner}});
            }
        }
        ws.addEventListener('message', handleMessage)

        return () => {
            ws.removeEventListener('message', handleMessage);
        };
    });
    
    return (
      <div className="deadPage">
        <div className="gameTitle">
          <h2>MafiUhh...</h2>
        </div>

        <div className="deadMessage">
            YOU ARE DEAD.
        </div>

      </div>
    );
  }
  
  export default Dead;