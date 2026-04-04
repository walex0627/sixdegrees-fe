import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Player, GameNode } from '../types/games.types';
import { socket } from '../api/socket';

interface SubmitedChain {
    id: string;
    type: 'person' | 'movie';
}

interface GameContextType {
    lobbyCode: string;
    players: Player[];
    username: string;
    startNode: GameNode | null;
    targetNode: GameNode | null;
    gameMessage: string;
    screen: 'home' | 'lobby' | 'game' | 'ranking';
    
    // Setters
    setGameData: (data: any) => void;
    setScreen: (screen: 'home' | 'lobby' | 'game' | 'ranking') => void;
    setGameMessage: (msg: string) => void;

    // Acciones de Juego (Eventos Socket)
    createLobby: (data: any) => void;
    joinLobby: (data: any) => void;
    startGame: () => void;
    submitChain: (chain: SubmitedChain[]) => void;
    updateMission: (startNode: GameNode, targetNode: GameNode) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [screen, setScreen] = useState<'home' | 'lobby' | 'game' | 'ranking'>('home');
    const [lobbyCode, setLobbyCode] = useState('');
    const [username, setUsername] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [startNode, setStartNode] = useState<GameNode | null>(null);
    const [targetNode, setTargetNode] = useState<GameNode | null>(null);
    const [gameMessage, setGameMessage] = useState('');

    const setGameData = (data: any) => {
        if (data.lobbyCode) setLobbyCode(data.lobbyCode);
        if (data.username) setUsername(data.username);
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
            
            // Verificamos que el nombre coincida para redirigir
            if (username && data.username.trim().toLowerCase() === username.trim().toLowerCase()) {
                console.log("🎯 Es mi resultado, guardando mensaje del backend...");
                setGameMessage(data.message);
                setScreen('ranking');
            }
        };

        const onMissionUpdated = (data: { startNode: GameNode, targetNode: GameNode }) => {
            console.log("🔄 Misión actualizada recibida:", data);
            if (data.startNode) setStartNode(data.startNode);
            if (data.targetNode) setTargetNode(data.targetNode);
            setScreen('lobby');
            setGameMessage('');
        };

        // Escuchadores de eventos
        socket.on('connect', onConnect);
        socket.on('game_started', onGameStarted);
        socket.on('round_result', onRoundResult);
        socket.on('mission_updated', onMissionUpdated);

        return () => {
            socket.off('connect', onConnect);
            socket.off('game_started', onGameStarted);
            socket.off('round_result', onRoundResult);
            socket.off('mission_updated', onMissionUpdated);
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
                username: data.username 
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
                    targetNode: res.targetNode 
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
            lobbyCode, players, username, startNode, targetNode, 
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