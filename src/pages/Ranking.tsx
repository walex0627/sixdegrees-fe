// src/pages/Ranking.tsx
import { useGame } from '../context/GameContext';

export default function Ranking({ onRestart }: { onRestart: () => void }) {
    const { gameMessage, lobbyCode, players } = useGame();

    return (
        <div className="max-w-2xl mx-auto pt-16 px-6 text-center">
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-b from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                RESULTADOS
            </h1>
            <p className="text-slate-500 mb-12 uppercase tracking-widest font-bold">
                Lobby: {lobbyCode}
            </p>

            {/* Caja del mensaje del Backend */}
            <div className="mt-8 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />

                <div className="inline-block px-3 py-1 rounded-full text-[10px] bg-orange-500/20 text-orange-400 font-black uppercase mb-4">
                    🔥 EL DIRECTOR DICE:
                </div>

                <p className="text-2xl font-medium text-slate-200 italic leading-tight">
                    {/* Aquí mostramos el mensaje que viene del backend */}
                    "{gameMessage || "Cargando veredicto..."}"
                </p>
            </div>

            <button
                onClick={onRestart}
                className="w-full mt-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all"
            >
                NUEVA PARTIDA
            </button>
        </div>
    );
}