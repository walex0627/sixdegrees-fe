import { useState, useEffect } from 'react';
import axios from 'axios';
import type { GameNode } from '../types/games.types';

interface Props {
    label: string;
    type: 'person' | 'movie';
    onSelect: (node: GameNode) => void;
}

export const SearchInput = ({ label, type, onSelect }: Props) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GameNode[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (query.length < 3) return setResults([]);
            setLoading(true);
            try {
                // Tip: Es mejor usar una variable de entorno para la URL en el futuro
                const { data } = await axios.get(`https://sixdegrees-be-production.up.railway.app/api/game/search?q=${query}&type=${type}`);
                setResults(data);
            } catch (err) {
                console.error("Error searching", err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query, type]);

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium mb-2 text-slate-400">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={query} // <--- Input controlado
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none transition"
                    placeholder={`Buscar ${type === 'person' ? 'actor' : 'película'}...`}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && <div className="absolute right-3 top-3 animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
            </div>

            {results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                    {results.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => { 
                                onSelect(item); // Notifica al padre
                                setQuery(item.name); // Actualiza el texto del input
                                setResults([]); // Cierra la lista
                            }}
                            className="flex items-center w-full p-2 hover:bg-slate-700 transition gap-3 border-b border-slate-700 last:border-0"
                        >
                            {item.image ? (
                                <img src={item.image} className="w-10 h-14 object-cover rounded" alt={item.name} />
                            ) : (
                                <div className="w-10 h-14 bg-slate-700 rounded flex items-center justify-center text-[10px]">Sin foto</div>
                            )}
                            <span className="text-sm font-semibold text-white">{item.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};