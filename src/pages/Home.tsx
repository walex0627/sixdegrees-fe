import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { SearchInput } from '../components/SearchInput';
import type { GameNode } from '../types/games.types';

export default function Home() {
    const { createLobby, joinLobby } = useGame();
    
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [mode, setMode] = useState<'create' | 'join' | null>(null);
    
    // Create Mode States
    const [startNode, setStartNode] = useState<GameNode | null>(null);
    const [targetNode, setTargetNode] = useState<GameNode | null>(null);
    
    // Join Mode States
    const [inputCode, setInputCode] = useState('');

    // Leer URL al iniciar para obtener el gameId si te invitaron por enlace
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('gameId');
        if (code) {
            setInputCode(code.toUpperCase());
            setMode('join');
            // Remove the URL param visually just for neatness (optional but good practice)
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleNextStep1 = () => {
        if (username.trim().length > 2) {
            if (inputCode && mode === 'join') {
                // If they came from a link, code is already loaded, skip directly to step 3!
                setStep(3);
            } else {
                setStep(2);
            }
        }
    };

    const handleCreate = () => {
        if (!startNode || !targetNode || !username) return;
        createLobby({ startNode, targetNode, username });
    };

    const handleJoin = () => {
        if (!inputCode || !username) return;
        joinLobby({ lobbyCode: inputCode.toUpperCase(), username });
    };

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 w-full transition-all duration-500">
            {/* Título animado */}
            <h1 className="text-4xl md:text-5xl font-black text-center mb-10 tracking-tighter cursor-default">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:drop-shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all">
                    The Six Degrees
                </span>
            </h1>

            <div className="w-full max-w-2xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                
                <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-700/50 backdrop-blur-2xl relative shadow-2xl flex flex-col items-center min-h-[250px] justify-center overflow-hidden w-full">
                    
                    {/* PASO 1: APODO */}
                    {step === 1 && (
                        <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight">Bienvenido, Director</h2>
                                <p className="text-slate-400 text-sm">¿Cuál es tu nombre para esta sesión?</p>
                            </div>
                            <input
                                autoFocus
                                className="w-full bg-slate-950/50 border border-slate-700/50 hover:border-slate-600 focus:border-blue-500 p-4 rounded-xl outline-none transition-all text-white text-center text-xl font-bold placeholder-slate-700 shadow-inner"
                                placeholder="Tu Apodo..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNextStep1()}
                            />
                            <button
                                onClick={handleNextStep1}
                                disabled={username.trim().length < 3}
                                className="w-full font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 text-base mt-2"
                            >
                                Continuar →
                            </button>
                        </div>
                    )}

                    {/* PASO 2: MODO DE JUEGO */}
                    {step === 2 && (
                        <div className="w-full max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2 tracking-tight">Hola, {username}</h2>
                                <p className="text-slate-400 text-sm">¿Qué deseas hacer en esta sesión cósmica?</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => { setMode('create'); setStep(3); }}
                                    className="group/btn relative overflow-hidden p-6 bg-slate-800/40 border border-slate-700/50 hover:border-blue-500 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1 block text-left"
                                >
                                    <div className="text-blue-400 mb-2 font-black text-xl group-hover/btn:scale-105 transition-transform origin-left">Jugar</div>
                                    <p className="text-xs text-slate-400 leading-relaxed">Crear partida. Escoge un actor inicial y el desafío final.</p>
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                </button>
                                
                                <button
                                    onClick={() => { setMode('join'); setStep(3); }}
                                    className="group/btn relative overflow-hidden p-6 bg-slate-800/40 border border-slate-700/50 hover:border-pink-500 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:-translate-y-1 block text-left"
                                >
                                    <div className="text-pink-400 mb-2 font-black text-xl group-hover/btn:scale-105 transition-transform origin-left">Unirse</div>
                                    <p className="text-xs text-slate-400 leading-relaxed">Tengo un código PIN de invitación de mis amigos.</p>
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                </button>
                            </div>
                            <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white mx-auto block transition-colors mt-6 font-medium">
                                ← Cambiar apodo
                            </button>
                        </div>
                    )}

                    {/* PASO 3: CREAR o UNIRSE */}
                    {step === 3 && mode === 'create' && (
                        <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
                            <h2 className="text-xl font-bold text-blue-400 text-center mb-6">Configurar Desafío</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 shadow-inner">
                                <SearchInput label="Inicia con (Actor/Actriz)" type="person" onSelect={setStartNode} />
                                
                                <SearchInput label="Objetivo final (Película)" type="movie" onSelect={setTargetNode} />
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={!startNode || !targetNode}
                                className="w-full mt-8 font-black py-4 rounded-xl transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-50 disabled:grayscale hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] text-base shadow-md border border-blue-400/30 tracking-wide"
                            >
                                GENERAR LOBBY 🚀
                            </button>
                            <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-white mx-auto block mt-4 transition-colors">
                                ← Volver a modos
                            </button>
                        </div>
                    )}

                    {step === 3 && mode === 'join' && (
                        <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in zoom-in-95 flex flex-col justify-center h-full">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-pink-400 mb-2 tracking-tight">Ingresa el PIN</h2>
                                <p className="text-sm text-slate-400">Pídeles el código de 6 caracteres.</p>
                            </div>
                            
                            <input
                                autoFocus
                                className="w-full bg-slate-950/50 border border-slate-700/50 hover:border-pink-500/50 focus:border-pink-500 p-4 rounded-xl outline-none transition-all text-white text-center text-3xl tracking-[0.3em] font-mono uppercase shadow-inner placeholder-slate-800"
                                placeholder="X9J2L1"
                                maxLength={6}
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                            />

                            <button
                                onClick={handleJoin}
                                disabled={inputCode.length !== 6}
                                className="w-full font-black py-4 rounded-xl transition-all bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white disabled:opacity-50 disabled:grayscale hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] text-lg mt-4 shadow-md border border-pink-400/30 tracking-wide"
                            >
                                Entrar a la Sala 🎮
                            </button>
                            <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-white mx-auto block mt-6 transition-colors">
                                ← Volver a modos
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}