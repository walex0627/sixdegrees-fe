import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { SearchInput } from '../components/SearchInput';
import type { GameNode } from '../types/games.types';

export default function GameRoom() {
    const { startNode, targetNode, submitChain, players, username, screen } = useGame();
    
    if (!startNode || !targetNode) return <div className="text-center mt-32 text-xl animate-pulse">Sincronizando partida cósmica...</div>;

    const [chain, setChain] = useState<GameNode[]>([startNode]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cuando el contexto cambie de pantalla (hacia 'ranking'), resetear el estado de carga
    useEffect(() => {
        if (screen === 'ranking') setIsSubmitting(false);
    }, [screen]);

    const addToChain = (node: GameNode) => {
        if (chain.length > 0 && chain[chain.length - 1]?.id === node.id) return;
        setChain([...chain, node]);
    };

    const isTargetReached = chain[chain.length - 1]?.id === targetNode.id;
    const nextSearchType = chain[chain.length - 1]?.type === 'person' ? 'movie' : 'person';

    const handleFinalSubmit = () => {
        if (isTargetReached && !isSubmitting) {
            setIsSubmitting(true);
            submitChain(chain.map(n => ({ id: n.id, type: n.type })));
            // El isSubmitting se resetea automáticamente cuando screen cambie a 'ranking'
        }
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6 pt-4 pb-16 px-4 md:px-6">
            
            {/* COLUMNA IZQUIERDA: Leaderboard & Objetivo */}
            <div className="xl:col-span-1 space-y-4 flex flex-col">
                {/* OBJETIVO CAJA DESTACADA */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.1)] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
                    <div className="absolute -inset-10 bg-pink-500/10 blur-2xl rounded-full group-hover:bg-pink-500/20 transition-colors"></div>
                    
                    <h3 className="text-pink-400 text-[10px] font-black mb-3 uppercase tracking-widest text-center relative z-10 border border-pink-500/20 bg-pink-500/10 inline-block px-3 py-1 rounded-full mx-auto w-full">TU OBJETIVO</h3>
                    
                    <div className="flex flex-col items-center gap-3 relative z-10 mt-2">
                        <img src={targetNode.image || ''} className="w-20 h-28 rounded-lg object-cover shadow-xl border border-slate-800" />
                        <p className="font-bold text-center text-sm text-white leading-tight">{targetNode.name}</p>
                    </div>
                </div>

                {/* LEADERBOARD EN TIEMPO REAL */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-xl flex-grow shadow-lg">
                    <h3 className="text-white text-xs font-black mb-4 tracking-widest flex items-center justify-between border-b border-slate-800 pb-2">
                        POSICIONES
                        <span className="bg-slate-800 text-slate-300 py-0.5 px-2 rounded-full text-[10px]">{players.length || 1} P</span>
                    </h3>
                    
                    <div className="space-y-2">
                        {(players.length > 0 ? players : [{ username, score: 0 }])
                            .sort((a,b) => b.score - a.score)
                            .map((p, i) => (
                            <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${p.username === username ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-slate-800/40 border-slate-700/50'}`}>
                                <div className="flex items-center gap-2">
                                    <span className={`w-5 h-5 flex items-center justify-center font-black rounded text-[10px] ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-slate-300 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                        {i + 1}
                                    </span>
                                    <span className={`font-bold text-xs ${p.username === username ? 'text-blue-400' : 'text-slate-200'} truncate max-w-[100px]`}>{p.username}</span>
                                </div>
                                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/20">{p.score}pt</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: El Juego (Línea de tiempo) */}
            <div className="xl:col-span-3 space-y-6 flex flex-col">
                
                {/* ÁREA DE BÚSQUEDA */}
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-xl shrink-0 relative z-50">
                    {!isTargetReached ? (
                        <div className="max-w-xl mx-auto flex flex-col gap-3 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold border border-blue-500/30 text-sm">
                                    {chain.length}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Próximo paso...</h2>
                                    <p className="text-slate-400 text-xs">¿Con quién / qué se conecta {chain[chain.length - 1]?.name}?</p>
                                </div>
                            </div>
                            <SearchInput
                                key={`search-${chain.length}`}
                                label={`Ingresa un(a) ${nextSearchType === 'movie' ? 'Película' : 'Actor/Actriz'}`}
                                type={nextSearchType}
                                onSelect={addToChain}
                                contextId={chain.length >= 1 ? chain[chain.length - 1].id : undefined}
                                contextType={chain.length >= 1 ? chain[chain.length - 1].type : undefined}
                            />
                        </div>
                    ) : (
                        <div className="text-center animate-in zoom-in slide-in-from-bottom-4 py-4">
                            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                ¡CONEXIÓN ESTABLECIDA!
                            </h2>
                            <button
                                onClick={handleFinalSubmit}
                                disabled={isSubmitting}
                                className={`w-full max-w-sm mx-auto font-black py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-2 border ${
                                    isSubmitting 
                                        ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed opacity-80' 
                                        : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-105 active:scale-95 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] border-emerald-400/50'
                                }`}
                            >
                                {isSubmitting ? '⏳ VALIDANDO CONEXIONES...' : '🚀 TERMINAR PARTIDA'}
                            </button>
                        </div>
                    )}
                </div>

                {/* LÍNEA DE TIEMPO SENSACIONAL */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 flex-grow shadow-inner relative min-h-[250px] z-10 w-full flex items-center justify-center">
                    <div className="flex flex-wrap items-center justify-center gap-y-8 gap-x-2 w-full pb-2">
                        {chain.map((node, i) => (
                            <div key={`${node.id}-${i}`} className="flex items-center group relative">
                                
                                {/* Nodo */}
                                <div className={`relative flex flex-col items-center bg-slate-900/80 p-3 rounded-xl border-2 transform transition-all hover:-translate-y-1 hover:shadow-xl hover:z-20 w-32 min-h-[170px] justify-start pt-4 ${i === 0 ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : isTargetReached && i === chain.length - 1 ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-slate-700/50 hover:border-slate-500'}`}>
                                    
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400 shadow">
                                        {i + 1}
                                    </span>

                                    {/* Categoría superior pequeñita */}
                                    <span className={`text-[8px] uppercase font-black tracking-widest mb-2 px-1.5 py-0.5 rounded border ${node.type === 'person' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                        {node.type === 'person' ? 'Actor' : 'Película'}
                                    </span>

                                    <img src={node.image || ''} className="w-16 h-24 object-cover rounded-lg mb-2 shadow border border-slate-800" />
                                    
                                    <p className="text-[10px] font-bold text-center leading-tight line-clamp-2 px-1 text-slate-200">
                                        {node.name}
                                    </p>
                                </div>

                                {/* Conector */}
                                {i < chain.length - 1 && (
                                    <div className="flex flex-col items-center justify-center px-2 md:px-4 relative z-0">
                                        <div className="w-6 md:w-10 h-0.5 bg-slate-700 rounded-full relative overflow-hidden group-hover:bg-slate-500 transition-colors">
                                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}