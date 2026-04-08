import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Player, GameNode, SubmitedChain, GameContextType, RoundResult } from '../types/games.types';
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
        // Use explicit hostUsername from backend if provided; otherwise the FE assigns it
        if (data.hostUsername) setHostUsername(data.hostUsername);
        if (data.startNode) setStartNode(data.startNode);
        if (data.targetNode) setTargetNode(data.targetNode);
        if (data.players) setPlayers(data.players);
    };

    // --- SOCKET EVENT HANDLERS ---
    useEffect(() => {
        const onConnect = () => console.log('✅ Socket connected:', socket.id);
        
        const onGameStarted = (data: any) => {
            console.log('🚀 Game started', data);
            if (data && data.players) {
                setPlayers(data.players);
            }
            setScreen('game');
        };

        const onRoundResult = (data: RoundResult) => {
            console.log("📩 Evento round_result recibido:", data);
            
            // Sync the global ranking if the backend includes the players array
            if (data.players && data.players.length > 0) {
                console.log('🏆 Syncing global ranking from backend');
                setPlayers(data.players);
            }

            // If the backend signals a validation error, show a user-friendly message
            if (data.error) {
                console.warn('⚠️ Backend reported a chain validation error');
                setGameMessage('⚠️ There was a technical issue validating your chain. Try a shorter path.');
                setScreen('ranking');
                return;
            }
            
            // Determine if the current user is the round winner
            const isWinner = username && data.username.trim().toLowerCase() === username.trim().toLowerCase();
            
            if (isWinner) {
                console.log('🎯 Current user won — displaying personal verdict');
                setGameMessage(data.message);
            } else {
                console.log('🎯 Another player won — redirecting with announcement');
                setGameMessage(`Player ${data.username} completed the mission first and earned ${data.score} points!`);
            }
            
            // Navigate all players to the Ranking screen
            setScreen('ranking');
        };

        const onMissionUpdated = (data: { startNode: GameNode, targetNode: GameNode }) => {
            console.log('🔄 Mission updated received:', data);
            if (data.startNode) setStartNode(data.startNode);
            if (data.targetNode) setTargetNode(data.targetNode);
            setScreen('lobby');
            setGameMessage('');
        };

        const onPlayerJoined = (data: { players: Player[] }) => {
            console.log('👥 Player list updated:', data);
            if (data.players) {
                setPlayers(data.players);
            }
        };

        // Register socket event listeners
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
    }, [username]); // Re-subscribe when username changes

    // --- ACTIONS ---

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
                hostUsername: data.username, // Lobby creator is always the host
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
                    hostUsername: res.hostUsername || (res.players && res.players.length > 0 ? res.players[0].username : ''), // Prefer explicit hostUsername from backend
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
        console.log('🚀 Submitting chain for lobby:', lobbyCode);
        socket.emit('submit_chain', {
            lobby: lobbyCode,
            username,
            chain
        });
    };

    const updateMission = (startNode: GameNode, targetNode: GameNode) => {
        console.log('🔧 Updating mission for lobby:', lobbyCode);
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
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};