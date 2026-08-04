"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Film, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock data para sugestões
const MOCK_SUGGESTIONS = [
  "A Noite Inesquecível",
  "Dançando na Chuva",
  "Premium Collection",
  "Vlogs e Bastidores",
];

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce e busca falsa de sugestões
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      // Simula busca em API
      const filtered = MOCK_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(filtered);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fecha busca ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="relative" ref={searchRef}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
        >
          <Search className="w-5 h-5" />
        </button>
      ) : (
        <form onSubmit={handleSearch} className="relative flex items-center animate-in slide-in-from-right-4 duration-300">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full bg-zinc-900/80 border border-zinc-700 text-white text-sm rounded-full pl-9 pr-8 py-2 focus:outline-none focus:border-red-500 focus:bg-zinc-900 transition-all backdrop-blur-md"
              autoFocus
            />
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Caixa de Sugestões Instantâneas */}
      {isOpen && (query.trim().length > 0) && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in duration-200">
          <div className="p-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Sugestões
            </h4>
            {suggestions.length > 0 ? (
              <ul className="space-y-1">
                {suggestions.map((s, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left flex items-center gap-2 text-sm text-zinc-300 hover:text-white bg-transparent hover:bg-zinc-800/50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Search className="w-3 h-3 text-zinc-500" />
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-zinc-500 py-4 text-center">Nenhuma sugestão encontrada</div>
            )}
            
            <div className="mt-3 pt-3 border-t border-zinc-800/50">
               <button 
                onClick={handleSearch}
                className="w-full text-left flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-400 bg-transparent px-3 py-2 rounded-lg transition-colors"
              >
                Ver todos os resultados...
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
