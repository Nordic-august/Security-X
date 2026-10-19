import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  AlertTriangle,
  Info,
  ShieldCheck,
  LayoutGrid,
  Film,
  Sparkles,
} from 'lucide-react';
import { Category, Vulnerability, SeverityLevel } from '../types';

interface StreamingCatalogProps {
  categories: Category[];
  vulnerabilities: Vulnerability[];
  searchQuery: string;
  onSelectVulnerability: (vuln: Vulnerability) => void;
}

const getSeverityBadge = (severity: SeverityLevel) => {
  switch (severity) {
    case 'Critical':
      return {
        label: 'Crítica',
        color: 'text-red-400 bg-red-950/40 border-red-800/60',
        icon: Flame,
      };
    case 'High':
      return {
        label: 'Alta',
        color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
        icon: AlertTriangle,
      };
    case 'Medium':
      return {
        label: 'Média',
        color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60',
        icon: Info,
      };
    case 'Low':
    default:
      return {
        label: 'Baixa',
        color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
        icon: ShieldCheck,
      };
  }
};

export const StreamingCatalog: React.FC<StreamingCatalogProps> = ({
  categories,
  vulnerabilities,
  searchQuery,
  onSelectVulnerability,
}) => {
  const [viewMode, setViewMode] = React.useState<'carousel' | 'grid'>('carousel');
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScroll = (categoryId: string, direction: 'left' | 'right') => {
    const container = scrollRefs.current[categoryId];
    if (container) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (vulnerabilities.length === 0) {
    return (
      <section id="streaming-catalog" className="w-full py-16 px-6 max-w-7xl mx-auto text-center">
        <div className="p-12 rounded-2xl bg-[#0F172A]/70 border border-slate-800 max-w-lg mx-auto">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-display text-white mb-2">Nenhuma fragilidade encontrada</h3>
          <p className="text-sm text-slate-400 mb-6">
            Nenhum resultado corresponde à busca &quot;{searchQuery}&quot;. Tente pesquisar por termos mais genéricos como &quot;SQL&quot;, &quot;Rede&quot; ou altere o filtro.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="streaming-catalog" className="w-full py-12 px-6 max-w-7xl mx-auto">
      {/* Section Header with View Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Film className="w-4 h-4" />
            <span>MOSTRUÁRIO INTERATIVO DE TERMINOLOGIAS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Catálogo de Vulnerabilidades
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Navegue pelas fileiras temáticas estilo streaming e clique em qualquer card para ver a explicação técnica e exemplos práticos.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === 'carousel'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Fileiras Streaming</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grade Completa</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Streaming Shelves (Netflix Style Rows) */}
      {viewMode === 'carousel' ? (
        <div className="space-y-12">
          {categories.map(category => {
            const categoryVulns = vulnerabilities.filter(v => v.category_id === category.id);
            if (categoryVulns.length === 0) return null;

            return (
              <div key={category.id} className="relative group/shelf">
                {/* Row Header with Category Title & Scroll Controls */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover/shelf:text-cyan-400 transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-500">
                        ({categoryVulns.length} {categoryVulns.length === 1 ? 'termo' : 'termos'})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {category.description}
                    </p>
                  </div>

                  {/* Desktop Scroll Arrow Controls */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      onClick={() => handleScroll(category.id, 'left')}
                      className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 hover:border-cyan-400/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer"
                      title="Rolar para esquerda"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleScroll(category.id, 'right')}
                      className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 hover:border-cyan-400/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer"
                      title="Rolar para direita"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrollable Row Container */}
                <div
                  ref={el => {
                    scrollRefs.current[category.id] = el;
                  }}
                  className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1 px-1 -mx-1"
                >
                  {categoryVulns.map(vuln => {
                    const badge = getSeverityBadge(vuln.severity);
                    const SeverityIcon = badge.icon;

                    return (
                      <div
                        key={vuln.id}
                        onClick={() => onSelectVulnerability(vuln)}
                        className="flex-shrink-0 w-[280px] sm:w-[320px] bg-[#101728] hover:bg-[#162038] border border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-cyan-950/40 hover:-translate-y-1"
                      >
                        <div>
                          {/* Card Top: Severity & Reference */}
                          <div className="flex items-center justify-between gap-2 text-xs mb-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${badge.color}`}
                            >
                              <SeverityIcon className="w-3 h-3" />
                              <span>{badge.label}</span>
                            </span>

                            {vuln.cwe_id && (
                              <span className="font-mono text-[11px] text-slate-400">
                                {vuln.cwe_id}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                            {vuln.title}
                          </h4>

                          {/* Summary */}
                          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                            {vuln.short_summary}
                          </p>
                        </div>

                        {/* Card Bottom: Metadata and Action */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <span className="truncate max-w-[170px] text-[11px]">
                            {vuln.owasp_reference || vuln.attack_vector}
                          </span>
                          <span className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                            <span>Ver Ficha</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Mode 2: Unified Responsive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vulnerabilities.map(vuln => {
            const badge = getSeverityBadge(vuln.severity);
            const SeverityIcon = badge.icon;
            const category = categories.find(c => c.id === vuln.category_id);

            return (
              <div
                key={vuln.id}
                onClick={() => onSelectVulnerability(vuln)}
                className="bg-[#101728] hover:bg-[#162038] border border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-cyan-950/40 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${badge.color}`}
                    >
                      <SeverityIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {category?.name || 'Geral'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                    {vuln.title}
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {vuln.short_summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">
                    {vuln.cwe_id || 'MITRE CWE'}
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Ver Ficha</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
