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