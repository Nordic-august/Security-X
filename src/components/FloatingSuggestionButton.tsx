import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface FloatingSuggestionButtonProps {
  onClick: () => void;
}

export const FloatingSuggestionButton: React.FC<FloatingSuggestionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-semibold text-xs sm:text-sm rounded-full shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-200 cursor-pointer border border-cyan-300/40"
      title="Ir para a Central de Sugestões (Aba 3)"
    >
      <div className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center">
        <MessageSquarePlus className="w-3.5 h-3.5 text-slate-950" />
      </div>
      <span className="whitespace-nowrap font-medium">Sugerir Fragilidade</span>
    </button>
  );
};
