import React from 'react';
import { Search, X, Shield, Terminal, BookOpen, Layers } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSeverity: string;
  onSelectSeverity: (sev: string) => void;
  totalCount: number;
  filteredCount: number;
  onScrollToCatalog: () => void;
  siteSettings?: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedSeverity,
  onSelectSeverity,
  totalCount,
  filteredCount,
  onScrollToCatalog,
  siteSettings,
}) => {
  const severities: { label: string; value: string }[] = [
    { label: 'Todas as Gravidades', value: 'all' },
    { label: 'Crítica', value: 'Critical' },
    { label: 'Alta', value: 'High' },
    { label: 'Média', value: 'Medium' },
    { label: 'Baixa', value: 'Low' },
  ];

  const siteTitle = siteSettings?.site_title || 'Security X';
  const heroBadge = siteSettings?.hero_badge || 'PORTAL ACADÊMICO DE SEGURANÇA DEFENSIVA & OFENSIVA';
  const siteDescription =
    siteSettings?.site_description ||
    'Esse site tem como objetivo apresentar um glossário de fragilidades em sistemas da informação, além de mostrar exemplos e dar explicações acerca dessas mesmas vulnerabilidades de forma acessível e facilitada. Tendo como público alvo os estudantes da área.';

  // Format title if it ends with "X" to highlight the "X" in cyan gradient
  const renderTitle = () => {
    if (siteTitle.endsWith(' X')) {
      const base = siteTitle.slice(0, -2);
      return (
        <>
          {base}{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            X
          </span>
        </>
      );
    }
    return siteTitle;
  };

  return (
    <section className="relative w-full pt-12 pb-16 overflow-hidden border-b border-slate-800/60">
      {/* Background Graphic Scrim */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src="/src/assets/images/security_x_hero_banner_1791932127395.jpg"
          alt="Security X Digital Network"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D16] via-[#090D16]/90 to-[#090D16]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Subtle Brand Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-6">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>{heroBadge}</span>
        </div>

        {/* Official Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-white mb-6">
          {renderTitle()}
        </h1>

        {/* Official Description */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-10">
          {siteDescription}
        </p>

        {/* Central Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-[#131C31] border border-slate-700/80 rounded-xl shadow-2xl shadow-cyan-950/30 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20 transition-all">
            <div className="pl-4 text-slate-400">
              <Search className="w-5 h-5 text-cyan-400" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Pesquisar por termo, CVE, CWE, SQLi, XSS, rede, autenticação..."
              className="w-full py-4 pl-3 pr-10 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="pr-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Limpar pesquisa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Real-time search status indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 px-2">
            <span>
              {searchQuery ? (
                <>
                  Exibindo <strong className="text-cyan-400 font-mono">{filteredCount}</strong> de {totalCount} vulnerabilidades encontradas
                </>
              ) : (
                <>
                  Total de <strong className="text-slate-200 font-mono">{totalCount}</strong> vulnerabilidades catalogadas
                </>
              )}
            </span>
            <button
              onClick={onScrollToCatalog}
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline cursor-pointer"
            >
              Rolar para catálogo de streaming ↓
            </button>
          </div>
        </div>

        {/* Severity Filter Controls (Interactive Segmented Buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {severities.map(sev => {
            const isActive = selectedSeverity === sev.value;
            return (
              <button
                key={sev.value}
                onClick={() => onSelectSeverity(sev.value)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {sev.label}
              </button>
            );
          })}
        </div>

        {/* Quick Academic Highlights (3 quiet highlights without pill overload) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12 text-left pt-6 border-t border-slate-800/60">
          <div className="p-3.5 rounded-lg bg-[#0F172A]/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <Shield className="w-4 h-4" />
              <span>OWASP & MITRE CWE</span>
            </div>
            <p className="text-xs text-slate-400">
              Alinhado aos padrões e referências mundiais de segurança de software.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0F172A]/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Didática Acessível</span>
            </div>
            <p className="text-xs text-slate-400">
              Explicações claras sem jargões desnecessários, com cenários reais de invasão.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0F172A]/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <Layers className="w-4 h-4" />
              <span>Streaming & Prática</span>
            </div>
            <p className="text-xs text-slate-400">
              Navegação visual por categorias temáticas e recomendações de correção.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
