import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Player, GameNode } from '../types/games.types';

interface GameContextType {
    lobbyCode: string;
    players: Player[];
    username: string;
    startNode: GameNode | null;
    targetNode: GameNode | null;
    gameMessage: string;
    setGameMessage: (msg: string) => void;
    setGameData: (data: any) => void;
    screen: 'home' | 'lobby' | 'game' | 'ranking';
    setScreen: (screen: 'home' | 'lobby' | 'game' | 'ranking') => void;
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

    return (
        <GameContext.Provider value={{ 
            lobbyCode, players, username, startNode, targetNode, 
            setGameData, screen, setScreen, gameMessage, setGameMessage 
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