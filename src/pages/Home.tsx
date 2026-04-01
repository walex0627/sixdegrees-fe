import { useState } from 'react';
import { SearchInput } from '../components/SearchInput';
import type { GameNode } from '../types/games.types';

export default function Home({ onJoin }: { onJoin: (data: any) => void }) {
    const [startNode, setStartNode] = useState<GameNode | null>(null);
    const [targetNode, setTargetNode] = useState<GameNode | null>(null);
    const [username, setUsername] = useState('');
    const [inputCode, setInputCode] = useState('');

    // Validación booleana para limpiar el render
    const isCreateDisabled = !startNode || !targetNode || !username;

    const handleCreate = () => {
        console.log("Intentando crear con :", {startNode, targetNode, username});
        
        if (isCreateDisabled) return;
        onJoin({ mode: 'create', startNode, targetNode, username });
    };

    const handleJoinById = () => {
        if (!inputCode || !username) {
            return alert("Pon tu nombre y el código que te pasaron.");
        }
        onJoin({ mode: 'join', lobbyCode: inputCode.toUpperCase(), username });
    };

    return (
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-6">
            <h1 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tighter">
                The Six Degrees
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* SECCIÓN: CREAR PARTIDA */}
                <div className="space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col">
                    <h2 className="text-xl font-bold text-blue-400">Crear Desafío</h2>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-400 -mb-2">Tu Apodo</label>
                        <input
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg focus:ring-2 ring-blue-500 outline-none transition-all text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <SearchInput label="Inicia con (Actor/Actriz)" type="person" onSelect={setStartNode} />
                        <SearchInput label="Objetivo (Película)" type="movie" onSelect={setTargetNode} />
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={isCreateDisabled}
                        className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg ${
                            isCreateDisabled 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 active:scale-95'
                        }`}
                    >
                        {isCreateDisabled ? 'Completa los campos' : 'Generar Lobby'}
                    </button>
                </div>

                {/* SECCIÓN: UNIRSE A PARTIDA */}
                <div className="space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-md h-full flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-pink-400 mb-6">¿Tienes un código?</h2>
                        <div className="space-y-4">
                            <input
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg focus:ring-2 ring-pink-500 outline-none transition-all uppercase tracking-widest text-center text-2xl font-mono text-white"
                                placeholder="X9J2L1"
                                maxLength={6}
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                            />
                            <p className="text-xs text-slate-500 text-center">
                                El código es de 6 caracteres alfanuméricos.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleJoinById}
                        className="w-full bg-slate-800 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-all border border-slate-700 hover:border-pink-500 active:scale-95"
                    >
                        Entrar a la Sala
                    </button>
                </div>
            </div>
        </div>
    );
}