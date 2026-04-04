import { useGame } from './context/GameContext';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import GameRoom from './pages/GameRoom';
import Ranking from './pages/Ranking';

function App() {
  const { screen, setScreen, setGameMessage } = useGame();

  return (
    <main className="min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {screen === 'home' && <Home />}
        
        {screen === 'lobby' && <Lobby />}
        
        {screen === 'game' && <GameRoom />} 
        
        {screen === 'ranking' && (
          <Ranking 
              onBackToLobby={() => {
                  setScreen('lobby');
                  setGameMessage('');
              }}
              onMenu={() => { 
                  setScreen('home'); 
                  setGameMessage(''); 
              }} 
          />
        )}
      </div>
    </main>
  );
}

export default App;