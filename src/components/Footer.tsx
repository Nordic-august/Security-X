import React from 'react';
import { Shield, BookOpen, ExternalLink } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-[#070A11] border-t border-slate-800/80 text-xs text-slate-500 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <div className="flex items-center gap-2 text-slate-300 font-bold font-display text-sm">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Security X</span>
          </div>
          <p className="text-slate-400 text-center sm:text-left text-xs max-w-md">
            Plataforma educacional de conscientização e estudo de fragilidades em sistemas da informação, dedicada a estudantes e profissionais.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <button
            onClick={() => {
              onSelectTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Início & Glossário
          </button>
          <button
            onClick={() => onSelectTab('suggestions')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Central de Sugestões
          </button>
          <button
            onClick={() => onSelectTab('admin')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Painel Administrativo
          </button>
        </div>

        {/* Academic References */}
        <div className="text-center sm:text-right text-[11px] text-slate-500">
          <span>Referências: OWASP Top 10 · MITRE CVE/CWE</span>
          <div className="mt-0.5">© {new Date().getFullYear()} Security X. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  );
};
