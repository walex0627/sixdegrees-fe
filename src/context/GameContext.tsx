import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Player, GameNode, SubmitedChain, GameContextType } from '../types/games.types';
import { socket } from '../api/socket';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [screen, setScreen] = useState<'home' | 'lobby' | 'game' | 'ranking'>('home');
    const [lobbyCode, setLobbyCode] = useState('');
    const [username, setUsername] = useState('');
    const [hostUsername, setHostUsername] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [startNode, setStartNode] = useState<GameNode | null>(null);
    const [targetNode, setTargetNode] = useState<GameNode | null>(null);
    const [gameMessage, setGameMessage] = useState('');

    const setGameData = (data: any) => {
        if (data.lobbyCode) setLobbyCode(data.lobbyCode);
        if (data.username) setUsername(data.username);
        // Si el backend lo manda explícito lo usamos, o sino el FE lo auto-asigna
        if (data.hostUsername) setHostUsername(data.hostUsername);
        if (data.startNode) setStartNode(data.startNode);
        if (data.targetNode) setTargetNode(data.targetNode);
        if (data.players) setPlayers(data.players);
    };

    // --- LÓGICA DE SOCKETS ---
    useEffect(() => {
        const onConnect = () => console.log('✅ Socket conectado:', socket.id);
        
        const onGameStarted = () => {
            console.log("🚀 El juego ha comenzado oficialmente");
            setScreen('game');
        };

        const onRoundResult = (data: { username: string, score: number, message: string, players?: Player[] }) => {
            console.log("📩 Evento round_result recibido:", data);
            
            if (data.players) {
                console.log("🏆 Sincronizando ranking general del backend");
                setPlayers(data.players);
            }
            
            // Determinar si yo fui el ganador
            const isWinner = username && data.username.trim().toLowerCase() === username.trim().toLowerCase();
            
            if (isWinner) {
                console.log("🎯 Fui el ganador, mostrando veredicto personal...");
                setGameMessage(data.message);
            } else {
                console.log("🎯 Alguien más ganó, redirigiendo con mensaje...");
                setGameMessage(`¡El jugador ${data.username} completó la misión primero y ganó ${data.score} puntos!`);
            }
            
            // Mandamos a TODOS los jugadores a la pantalla de Ranking
            setScreen('ranking');
        };

        const onMissionUpdated = (data: { startNode: GameNode, targetNode: GameNode }) => {
            console.log("🔄 Misión actualizada recibida:", data);
            if (data.startNode) setStartNode(data.startNode);
            if (data.targetNode) setTargetNode(data.targetNode);
            setScreen('lobby');
            setGameMessage('');
        };

        const onPlayerJoined = (data: { players: Player[] }) => {
            console.log("👥 Lista de jugadores actualizada:", data);
            if (data.players) {
                setPlayers(data.players);
            }
        };

        // Escuchadores de eventos
        socket.on('connect', onConnect);
        socket.on('game_started', onGameStarted);
        socket.on('round_result', onRoundResult);
        socket.on('mission_updated', onMissionUpdated);
        socket.on('player_joined', onPlayerJoined);

        return () => {
            socket.off('connect', onConnect);
            socket.off('game_started', onGameStarted);
            socket.off('round_result', onRoundResult);
            socket.off('mission_updated', onMissionUpdated);
            socket.off('player_joined', onPlayerJoined);
        };
    }, [username]); // Dependencias: si username cambia, se vuelve a suscribir

    // --- ACCIONES ---

    const createLobby = (data: any) => {
        if (!socket.connected) socket.connect();
        socket.emit('create_lobby', { 
            startNode: data.startNode, 
            targetNode: data.targetNode,
            username: data.username 
        }, (res: any) => {
            setGameData({ 
                ...data, 
                lobbyCode: res.lobbyCode,
                username: data.username,
                hostUsername: data.username, // Como yo lo creé, soy el HOST universalmente local.
                players: [{ username: data.username, score: 0, isReady: true }]
            });
            setScreen('lobby');
        });
    };

    const joinLobby = (data: any) => {
        if (!socket.connected) socket.connect();
        socket.emit('join_lobby', { 
            code: data.lobbyCode, 
            username: data.username 
        }, (res: any) => {
            if (res.status === 'success') {
                setGameData({ 
                    username: data.username, 
                    lobbyCode: data.lobbyCode, 
                    startNode: res.startNode, 
                    targetNode: res.targetNode,
                    hostUsername: res.hostUsername || (res.players && res.players.length > 0 ? res.players[0].username : ''), // <--- LO ESPERAMOS
                    players: res.players
                });
                setScreen('lobby');
            } else {
                alert(res.message || "Error al unirse");
            }
        });
    };

    const startGame = () => {
        socket.emit('start_game', { lobby: lobbyCode });
    };

    const submitChain = (chain: SubmitedChain[]) => {
        console.log("🚀 Enviando cadena al lobby:", lobbyCode);
        socket.emit('submit_chain', {
            lobby: lobbyCode,
            username,
            chain
        });
    };

    const updateMission = (startNode: GameNode, targetNode: GameNode) => {
        console.log("🔧 Actualizando misión del lobby:", lobbyCode);
        socket.emit('update_mission', {
            lobby_code: lobbyCode,
            startNode,
            targetNode
        });
    };

    return (
        <GameContext.Provider value={{ 
            lobbyCode, players, username, hostUsername, startNode, targetNode, 
            setGameData, screen, setScreen, gameMessage, setGameMessage,
            createLobby, joinLobby, startGame, submitChain, updateMission
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame debe usarse dentro de GameProvider');
    return context;
};