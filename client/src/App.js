import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Game from './Game';
import StartGame from './startGame';  // Import the StartGame component
import { WebSocketProvider } from './WebSocketContext';

function App() {
  return (
    <WebSocketProvider> {/* Wrap the App with WebSocketProvider */}
      <BrowserRouter basname="/app">
        <div class = "App">
          <Routes>
            <Route path="/" element={<Game />} /> {/* Game component is rendered at the root route */}
            <Route path="/startgame" element={<StartGame />} /> {/* StartGame component at the /startgame route */}
          </Routes>
          </div>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App;