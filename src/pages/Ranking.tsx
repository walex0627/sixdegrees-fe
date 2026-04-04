import { useGame } from '../context/GameContext';

export default function Ranking({ onBackToLobby, onMenu }: { onBackToLobby: () => void, onMenu: () => void }) {
    const { gameMessage, lobbyCode, players, username } = useGame();

    return (
        <div className="max-w-3xl mx-auto pt-10 px-4 pb-16 text-center">
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-b from-yellow-300 via-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-tighter">
                    VEREDICTO FINAL
                </h1>
                <p className="text-slate-400 mb-8 uppercase tracking-[0.2em] font-bold text-xs">
                    Misión <span className="text-white font-black">{lobbyCode}</span> Completada
                </p>
            </div>

            {/* Mensaje del Director */}
            <div className="mb-8 p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 relative overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-in fade-in zoom-in-95 duration-700 delay-100 transform hover:scale-[1.01] transition-transform">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-orange-600 shadow-[0_0_10px_rgba(245,158,11,1)]" />
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

                <div className="inline-block px-3 py-1 rounded-full text-[10px] bg-amber-500/20 border border-amber-500/30 text-amber-400 font-black uppercase mb-4 tracking-widest shadow-inner">
                    🎙️ El Director Dice
                </div>

                <p className="text-xl md:text-2xl font-medium text-slate-100 italic leading-relaxed">
                    "{gameMessage || "¡Corte! Excelente actuación."}"
                </p>
            </div>

            {/* RANKING FINAL */}
            <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 relative overflow-hidden">
                
                <h3 className="text-lg font-black text-white mb-6 tracking-widest uppercase">Tabla de Posiciones</h3>
                
                <div className="space-y-3">
                    {(players.length > 0 ? players : [{ username, score: 0 }])
                        .sort((a, b) => b.score - a.score)
                        .map((p, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${i === 0 ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] transform scale-105 my-4' : p.username === username ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
                            
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center font-black rounded-lg text-sm shadow-inner ${i === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-600 text-black shadow-amber-500/50' : i === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-black' : i === 2 ? 'bg-gradient-to-br from-amber-700 to-yellow-900 text-white' : 'bg-slate-800 border border-slate-700 text-slate-400'}`}>
                                    {i === 0 ? '🏆' : i + 1}
                                </div>
                                <span className={`font-bold text-lg ${i === 0 ? 'text-amber-400' : p.username === username ? 'text-blue-400' : 'text-slate-200'}`}>
                                    {p.username} {p.username === username && <span className="text-xs text-slate-500 font-normal ml-2">(Tú)</span>}
                                </span>
                            </div>
                            
                            <span className={`font-mono font-black text-lg px-3 py-1 rounded-lg border ${i === 0 ? 'text-amber-300 bg-amber-950/50 border-amber-500/30' : 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'}`}>
                                {p.score} pts
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={onBackToLobby}
                    className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all border border-blue-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)] text-sm tracking-wide"
                >
                    VOLVER AL LOBBY
                </button>
                <button
                    onClick={onMenu}
                    className="w-full sm:w-auto px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-600 hover:scale-105 active:scale-95 shadow-lg text-sm tracking-wide"
                >
                    NUEVA SALA
                </button>
            </div>
        </div>
    );
}