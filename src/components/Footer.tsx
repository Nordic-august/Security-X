import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { ActiveTab, SiteSettings } from '../types';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
  onSecretAdminTrigger?: () => void;
  isAdminAuthenticated?: boolean;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onSecretAdminTrigger,
  isAdminAuthenticated,
  siteSettings,
}) => {
  const siteTitle = siteSettings?.site_title || 'Security X';
  const footerText =
    siteSettings?.footer_text ||
    'Plataforma educacional de conscientização e estudo de fragilidades em sistemas da informação, dedicada a estudantes e pesquisadores.';

  return (
    <footer className="w-full bg-[#070A11] border-t border-slate-800/80 text-xs text-slate-500 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <div className="flex items-center gap-2 text-slate-300 font-bold font-display text-sm">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{siteTitle}</span>
          </div>
          <p className="text-slate-400 text-center sm:text-left text-xs max-w-md">
            {footerText}
          </p>
        </div>

        {/* Public Navigation Links (No Admin Link for Regular Users) */}
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
          {isAdminAuthenticated && (
            <button
              onClick={() => onSelectTab('admin')}
              className="text-cyan-400 font-semibold hover:underline transition-colors cursor-pointer"
            >
              Painel de Operações Admin
            </button>
          )}
        </div>

        {/* Academic References & Secret Discreet Admin Trigger */}
        <div className="text-center sm:text-right text-[11px] text-slate-500">
          <span>Referências: OWASP Top 10 · MITRE CVE/CWE · UFPR 2025</span>
          <div className="mt-0.5 flex items-center justify-center sm:justify-end gap-1">
            <span>© {new Date().getFullYear()} {siteTitle}. Todos os direitos reservados.</span>
            {/* Discreet secret trigger for admins */}
            <button
              onClick={onSecretAdminTrigger}
              className="opacity-20 hover:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-cyan-400 cursor-default"
              title="Acesso Seguro"
              aria-label="Admin Trigger"
            >
              <Lock className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
