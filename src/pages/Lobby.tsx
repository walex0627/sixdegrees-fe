import { useGame } from '../context/GameContext';
import { useState, useEffect } from 'react';
import { SearchInput } from '../components/SearchInput';
import type { GameNode } from '../types/games.types';

export default function Lobby() {
    const { lobbyCode, startNode, targetNode, startGame, players, username, hostUsername, updateMission } = useGame();
    const [copied, setCopied] = useState(false);
    
    // El host ahora está explícitamente definido para evitar fallos de orden en el array
    const isHost = username && username === hostUsername;
    
    // Draft states for changing mission
    const [editMode, setEditMode] = useState(false);
    const [draftStart, setDraftStart] = useState<GameNode | null>(startNode);
    const [draftTarget, setDraftTarget] = useState<GameNode | null>(targetNode);

    // Sync draft when external changes happen
    useEffect(() => {
        setDraftStart(startNode);
        setDraftTarget(targetNode);
        setEditMode(false);
    }, [startNode, targetNode]);

    const inviteLink = `${window.location.origin}?gameId=${lobbyCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto pt-4 pb-12 px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* COLUMNA IZQUIERDA: Info de Sala y Jugadores */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-900/60 border border-slate-700/50 p-5 md:p-6 rounded-2xl backdrop-blur-xl shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-pink-500"></div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Código de Sala</h2>
                        <div className="text-4xl md:text-5xl font-mono font-black text-white tracking-widest mb-4">
                            {lobbyCode}
                        </div>
                        
                        <button 
                            onClick={handleCopy}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm shadow-md ${copied ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
                        >
                            {copied ? '✅ Enlace Copiado' : '📋 Copiar Invitación'}
                        </button>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-700/50 p-5 rounded-2xl backdrop-blur-xl shadow-xl flex flex-col min-h-[250px]">
                        <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                            Jugadores
                            <span className="bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs py-1 px-3 rounded-full shadow-inner">{players.length || 1}</span>
                        </h3>
                        
                        <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                            {players.map((p, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-inner text-sm">
                                            {p.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-white text-sm tracking-wide">
                                            {p.username} 
                                            {p.username === username && <span className="text-[10px] text-blue-400 font-bold ml-2">(Tú)</span>}
                                        </span>
                                        <span className="font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md text-[10px] border border-emerald-500/30 shadow-inner ml-2">
                                            {p.score || 0} pts
                                        </span>
                                    </div>
                                    {p.username === hostUsername && (
                                        <span className="text-[9px] uppercase font-black tracking-widest bg-pink-500/20 border border-pink-500/30 text-pink-400 py-1 px-2 rounded-md shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                                            Host
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Tablero de Misión */}
                <div className="lg:col-span-2 space-y-6 flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800/50 p-6 md:p-10 rounded-2xl backdrop-blur-xl shadow-xl min-h-[450px] relative">
                    
                    <div className="absolute top-0 right-0 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>

                    <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-widest text-slate-100 z-10">
                        La Misión
                    </h2>

                    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 z-10 min-h-[220px]">
                        {!editMode ? (
                            <>
                                {/* Nodo Inicial */}
                                <div className="relative group flex-1 max-w-[200px] w-full">
                                    <div className="absolute -inset-2 bg-gradient-to-b from-blue-500/30 to-blue-800/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-500/30 relative flex flex-col items-center shadow-lg transform transition-all group-hover:-translate-y-1 w-full text-center backdrop-blur-md">
                                        <p className="text-blue-400 text-[10px] font-black mb-4 uppercase tracking-widest bg-blue-500/10 py-1 px-2 rounded-md border border-blue-500/20">Inicia con</p>
                                        {startNode?.image ? (
                                            <img src={startNode.image} className="w-24 h-36 rounded-lg object-cover mb-4 shadow-md border border-slate-700" />
                                        ) : (
                                            <div className="w-24 h-36 bg-slate-800 rounded-lg mb-4 flex items-center justify-center border border-slate-700 text-xs">Sin foto</div>
                                        )}
                                        <h3 className="text-sm font-bold text-white leading-tight">{startNode?.name}</h3>
                                    </div>
                                </div>

                                {/* Flecha Animada */}
                                <div className="text-4xl text-slate-500 font-light flex items-center animate-pulse rotate-90 sm:rotate-0 my-2 sm:my-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                    ➔
                                </div>

                                {/* Nodo Objetivo */}
                                <div className="relative group flex-1 max-w-[200px] w-full">
                                    <div className="absolute -inset-2 bg-gradient-to-b from-pink-500/30 to-pink-800/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-pink-500/30 relative flex flex-col items-center shadow-lg transform transition-all group-hover:-translate-y-1 w-full text-center backdrop-blur-md">
                                        <p className="text-pink-400 text-[10px] font-black mb-4 uppercase tracking-widest bg-pink-500/10 py-1 px-2 rounded-md border border-pink-500/20">Llega hasta</p>
                                        {targetNode?.image ? (
                                            <img src={targetNode.image} className="w-24 h-36 rounded-lg object-cover mb-4 shadow-md border border-slate-700" />
                                        ) : (
                                            <div className="w-24 h-36 bg-slate-800 rounded-lg mb-4 flex items-center justify-center border border-slate-700 text-xs">Sin foto</div>
                                        )}
                                        <h3 className="text-sm font-bold text-white leading-tight">{targetNode?.name}</h3>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col gap-6 relative z-[100] animate-in zoom-in-95">
                                <div className="bg-slate-800/80 p-6 rounded-2xl border border-blue-500/50 relative shadow-xl z-[110]">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-black text-blue-400 uppercase tracking-widest">NUEVO ACTOR INICIAL</span>
                                        {draftStart && <span className="text-xs text-white">{draftStart.name}</span>}
                                    </div>
                                    <SearchInput type="person" label="Busca un actor..." onSelect={setDraftStart} />
                                </div>
                                <div className="bg-slate-800/80 p-6 rounded-2xl border border-pink-500/50 relative shadow-xl z-[100]">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-black text-pink-400 uppercase tracking-widest">NUEVA PELÍCULA OBJETIVO</span>
                                        {draftTarget && <span className="text-xs text-white">{draftTarget.name}</span>}
                                    </div>
                                    <SearchInput type="movie" label="Busca una película..." onSelect={setDraftTarget} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 w-full flex flex-col items-center justify-center relative z-0 transition-all">
                        {editMode ? (
                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                <button
                                    onClick={() => {
                                        setDraftStart(startNode);
                                        setDraftTarget(targetNode);
                                        setEditMode(false);
                                    }}
                                    className="flex-1 px-4 py-4 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-slate-600"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={() => {
                                        if (draftStart && draftTarget) {
                                            updateMission(draftStart, draftTarget);
                                        }
                                    }}
                                    disabled={!draftStart || !draftTarget}
                                    className="flex-1 px-4 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:grayscale"
                                >
                                    CONFIRMAR RETO
                                </button>
                            </div>
                        ) : isHost ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white text-sm font-black rounded-xl transition-all border border-slate-600"
                                >
                                    CAMBIAR RETO
                                </button>
                                <button
                                    onClick={startGame}
                                    className="px-10 py-4 bg-gradient-to-tr from-green-600 to-emerald-400 text-white text-lg font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-green-400/50"
                                >
                                    INICIAR DESAFÍO
                                </button>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse border border-slate-700/50 bg-slate-800/50 py-3 px-6 rounded-full shadow-inner">
                                Esperando a que el HOST inicie el desafío...
                            </p>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}