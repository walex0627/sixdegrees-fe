import { useGame } from '../context/GameContext';

export default function Lobby({ onStart }: { onStart: () => void }) {
    const { lobbyCode, startNode, targetNode } = useGame();

    return (
        <div className="max-w-4xl mx-auto pt-16 px-6 text-center">
            <div className="inline-block bg-slate-900 border border-slate-800 px-6 py-2 rounded-full mb-8">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Código de Sala</span>
                <h2 className="text-3xl font-mono font-black text-blue-400 ml-3 inline-block">{lobbyCode}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
                {/* Nodo Inicial */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5">
                    <p className="text-blue-400 text-xs font-bold mb-4 uppercase">Empieza con</p>
                    {startNode?.image && <img src={startNode.image} className="w-32 h-44 mx-auto rounded-lg object-cover mb-4 shadow-md" />}
                    <h3 className="text-xl font-bold">{startNode?.name}</h3>
                </div>

                <div className="text-4xl text-slate-700">➜</div>

                {/* Nodo Objetivo */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5">
                    <p className="text-purple-400 text-xs font-bold mb-4 uppercase">Objetivo final</p>
                    {targetNode?.image && <img src={targetNode.image} className="w-32 h-44 mx-auto rounded-lg object-cover mb-4 shadow-md" />}
                    <h3 className="text-xl font-bold">{targetNode?.name}</h3>
                </div>
            </div>

            <button
                onClick={onStart}
                className="px-12 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform shadow-xl"
            >
                ¡EMPEZAR PARTIDA!
            </button>
        </div>
    );
}