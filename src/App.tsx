import { useEffect } from 'react';
import { socket } from './api/socket';
import { useGame } from './context/GameContext';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import GameRoom from './pages/GameRoom';
import Ranking from './pages/Ranking';

function App() {
  const { screen, setGameData, setScreen, setGameMessage, username, lobbyCode } = useGame();

  useEffect(() => {
    // 1. Definimos los handlers fuera para poder limpiarlos exactamente
    const onConnect = () => console.log('✅ Socket conectado:', socket.id);
    
    const onGameStarted = () => {
      console.log("🚀 El juego ha comenzado oficialmente");
      setScreen('game');
    };

    const onRoundResult = (data: { username: string, score: number, message: string }) => {
      console.log("📩 Evento round_result recibido:", data);
      
      // Verificamos que el nombre coincida para redirigir
      if (username && data.username.trim().toLowerCase() === username.trim().toLowerCase()) {
        console.log("🎯 Es mi resultado, guardando mensaje del backend...");
        setGameMessage(data.message);
        setScreen('ranking');
      }
    };

    // 2. Limpieza preventiva: eliminamos cualquier listener previo del mismo evento
    socket.off('connect');
    socket.off('game_started');
    socket.off('round_result');

    // 3. Registramos los listeners
    socket.on('connect', onConnect);
    socket.on('game_started', onGameStarted);
    socket.on('round_result', onRoundResult);

    // 4. Cleanup: se ejecuta cuando el componente se desmonta o username cambia
    return () => {
      socket.off('connect', onConnect);
      socket.off('game_started', onGameStarted);
      socket.off('round_result', onRoundResult);
    };
  }, [username, setScreen, setGameMessage]); // Dependencias necesarias

  const handleJoin = (data: any) => {
    if (!socket.connected) socket.connect();
    
    if (data.mode === 'create') {
      socket.emit('create_lobby', { 
        startNode: data.startNode, 
        targetNode: data.targetNode,
        username: data.username // Enviamos username al crear también
      }, (res: any) => {
        setGameData({ 
            ...data, 
            lobbyCode: res.lobbyCode,
            username: data.username 
        });
        setScreen('lobby');
      });
    } else {
      socket.emit('join_lobby', { 
        code: data.lobbyCode, 
        username: data.username 
      }, (res: any) => {
        if (res.status === 'success') {
          setGameData({ 
            username: data.username, 
            lobbyCode: data.lobbyCode, 
            startNode: res.startNode, 
            targetNode: res.targetNode 
          });
          setScreen('lobby');
        } else {
          alert(res.message || "Error al unirse");
        }
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        {screen === 'home' && <Home onJoin={handleJoin} />}
        
        {screen === 'lobby' && (
          <Lobby onStart={() => {
              socket.emit('start_game', { lobby: lobbyCode });
          }} />
        )}
        
        {screen === 'game' && <GameRoom />} 
        
        {screen === 'ranking' && (
          <Ranking onRestart={() => { 
              setScreen('home'); 
              setGameMessage(''); 
          }} />
        )}
      </div>
    </main>
  );
}

export default App;