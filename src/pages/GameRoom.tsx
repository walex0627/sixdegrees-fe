import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SearchInput } from '../components/SearchInput';
import { socket } from '../api/socket';
import type { GameNode } from '../types/games.types';

export default function GameRoom() {
    const { startNode, targetNode, lobbyCode, username } = useGame();
    
    if (!startNode || !targetNode) return <div className="text-center mt-20">Sincronizando partida...</div>;

    const [chain, setChain] = useState<GameNode[]>([startNode]);

    const addToChain = (node: GameNode) => {
        if (chain.length > 0 && chain[chain.length - 1]?.id === node.id) return;
        setChain([...chain, node]);
    };

    const isTargetReached = chain[chain.length - 1]?.id === targetNode.id;
    const nextSearchType = chain[chain.length - 1]?.type === 'person' ? 'movie' : 'person';

    // FUNCIÓN DE FINALIZADO
    const handleFinalSubmit = () => {
    if (isTargetReached) {
        console.log("🚀 Enviando cadena al lobby:", lobbyCode);
        socket.emit('submit_chain', {
            lobby: lobbyCode,
            username: username, // <-- Añadimos esto para asegurar
            chain: chain.map(n => ({ id: n.id, type: n.type }))
        });
    }
};

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 pt-10 px-6 pb-20">
            {/* ... Tu código de Objetivo (Izquierda) ... */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-slate-400 text-xs font-black mb-4 uppercase tracking-widest text-center">OBJETIVO</h3>
                    <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <img src={targetNode.image || ''} className="w-12 h-16 rounded object-cover" />
                        <p className="font-bold text-sm">{targetNode.name}</p>
                    </div>
                </div>
            </div>

            {/* Columna Central: Juego */}
            <div className="lg:col-span-3 space-y-8">
                <div className="flex flex-wrap gap-4 items-center justify-center min-h-[250px] p-8 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl">
                    {chain.map((node, i) => (
                        <div key={`${node.id}-${i}`} className="flex items-center gap-4">
                            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 w-24 text-center">
                                <img src={node.image || ''} className="w-full h-24 object-cover rounded mb-2" />
                                <p className="text-[10px] font-black uppercase truncate">{node.name}</p>
                            </div>
                            {i < chain.length - 1 && <span className="text-slate-600 font-black">→</span>}
                        </div>
                    ))}
                </div>

                <div className="max-w-md mx-auto space-y-6">
                    {!isTargetReached ? (
                        <SearchInput
                            label={`Conecta a ${chain[chain.length - 1]?.name}`}
                            type={nextSearchType}
                            onSelect={addToChain}
                        />
                    ) : (
                        <div className="text-center animate-bounce">
                            <button
                                onClick={handleFinalSubmit}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl text-xl shadow-lg"
                            >
                                ¡META ALCANZADA! FINALIZAR
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}