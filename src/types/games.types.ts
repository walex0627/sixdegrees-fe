export type NodeType = 'person' | 'movie';

export interface GameNode {
  id: string;
  name: string;
  type: NodeType;
  image?: string;
}

export interface Player {
  username: string;
  score: number;
  isReady: boolean;
}

export interface GameState {
  lobbyCode: string;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  startNode: GameNode | null; 
  targetNode: GameNode | null;
  currentTurn: string; 
}

export interface ChainSubmission {
  lobby: string;
  username: string;
  chain: GameNode[];
}

export interface SubmitedChain {
    id: string;
    type: 'person' | 'movie';
}

export interface RoundResult {
    username: string;
    score: number;
    message: string;
    players?: Player[];
    error?: boolean; // Flag opcional del backend cuando falla la validación
}

export interface GameContextType {
    lobbyCode: string;
    players: Player[];
    username: string;
    hostUsername: string; // <--- AGREGADO PARA ROBUSTEZ Y EVITAR MULTI-HOSTING
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

export interface SearchInputProps {
    label: string;
    type: 'person' | 'movie';
    onSelect: (node: GameNode) => void;
}