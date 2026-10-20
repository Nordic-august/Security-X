import React from 'react';
import { ShieldAlert, PlusCircle, LogOut, Shield } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onScrollToCatalog: () => void;
  isAdminAuthenticated: boolean;
  onAdminLogout: () => void;
  onSecretAdminTrigger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onScrollToCatalog,
  isAdminAuthenticated,
  onAdminLogout,
  onSecretAdminTrigger,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              onSelectTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDoubleClick={onSecretAdminTrigger}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            title="Security X - Início"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white whitespace-nowrap shrink-0">
              Security <span className="text-cyan-400">X</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean, unboxed, strictly public for students and curious visitors) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => {
              onSelectTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'home'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Glossário
          </button>

          <button
            onClick={() => {
              if (activeTab !== 'home') {
                onSelectTab('home');
                setTimeout(() => onScrollToCatalog(), 100);
              } else {
                onScrollToCatalog();
              }
            }}
            className="text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Catálogo Streaming
          </button>

          <button
            onClick={() => onSelectTab('suggestions')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'suggestions'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sugerir Termo
          </button>

          {/* Admin link only appears IF ALREADY AUTHENTICATED */}
          {isAdminAuthenticated && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 text-xs font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'admin' ? 'border-cyan-400 text-cyan-300 font-bold' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Painel Admin (Ativo)</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('suggestions')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-400/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Enviar Sugestão</span>
          </button>

          {/* Logout button if authenticated */}
          {isAdminAuthenticated && (
            <button
              onClick={onAdminLogout}
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Encerrar sessão de administrador"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
