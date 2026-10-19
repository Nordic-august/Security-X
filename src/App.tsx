import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StreamingCatalog } from './components/StreamingCatalog';
import { VulnerabilityModal } from './components/VulnerabilityModal';
import { FloatingSuggestionButton } from './components/FloatingSuggestionButton';
import { SuggestionsView } from './components/SuggestionsView';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { Category, Vulnerability, Suggestion, ActiveTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  
  // Search & Filters for Home Page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [suggestionInitialTitle, setSuggestionInitialTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load all data from API
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [catsRes, vulnsRes, sugsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/vulnerabilities'),
        fetch('/api/suggestions'),
      ]);

      if (catsRes.ok) {
        const cats = await catsRes.json();
        setCategories(cats);
      }

      if (vulnsRes.ok) {
        const vulns = await vulnsRes.json();
        setVulnerabilities(vulns);
      }

      if (sugsRes.ok) {
        const sugs = await sugsRes.json();
        setSuggestions(sugs);
      }
    } catch (err) {
      console.error('Erro ao sincronizar dados com o backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter vulnerabilities based on search and severity
  const filteredVulnerabilities = vulnerabilities.filter(v => {
    // Severity filter
    if (selectedSeverity !== 'all' && v.severity.toLowerCase() !== selectedSeverity.toLowerCase()) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchSummary = v.short_summary.toLowerCase().includes(q);
      const matchDescription = v.detailed_description.toLowerCase().includes(q);
      const matchCwe = v.cwe_id && v.cwe_id.toLowerCase().includes(q);
      const matchOwasp = v.owasp_reference && v.owasp_reference.toLowerCase().includes(q);
      const matchVector = v.attack_vector && v.attack_vector.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchDescription || matchCwe || matchOwasp || matchVector;
    }

    return true;
  });

  const handleScrollToCatalog = () => {
    const el = document.getElementById('streaming-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSuggestImprovement = (termTitle: string) => {
    setSuggestionInitialTitle(`Melhoria para: ${termTitle}`);
    setActiveTab('suggestions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingCount = suggestions.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      {/* 1. Header Navigation Bar (3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollToCatalog={handleScrollToCatalog}
        pendingSuggestionsCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-slate-400">Carregando glossário Security X...</span>
          </div>
        ) : (
          <>
            {/* VIEW 1 & 2: Página Inicial em Scroll Contínuo */}
            {activeTab === 'home' && (
              <div>
                {/* Scroll Section 1: Hero com Título Oficial, Descrição, Busca e Filtros */}
                <HeroSection
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedSeverity={selectedSeverity}
                  onSelectSeverity={setSelectedSeverity}
                  totalCount={vulnerabilities.length}
                  filteredCount={filteredVulnerabilities.length}
                  onScrollToCatalog={handleScrollToCatalog}
                />

                {/* Scroll Section 2: Catálogo no Estilo Streaming (Carrossel e Grade) */}
                <StreamingCatalog
                  categories={categories}
                  vulnerabilities={filteredVulnerabilities}
                  searchQuery={searchQuery}
                  onSelectVulnerability={setSelectedVulnerability}
                />

                {/* Botão Flutuante no Canto Direito Inferior que envia para a Aba 3 */}
                <FloatingSuggestionButton
                  onClick={() => {
                    setActiveTab('suggestions');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* VIEW 3: Aba Separada - Central de Sugestões dos Estudantes */}
            {activeTab === 'suggestions' && (
              <SuggestionsView
                categories={categories}
                initialTermTitle={suggestionInitialTitle}
                onBackToHome={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSuggestionSubmitted={() => {
                  loadData();
                }}
              />
            )}

            {/* VIEW 4: Aba Separada - Painel Administrativo */}
            {activeTab === 'admin' && (
              <AdminView
                categories={categories}
                vulnerabilities={vulnerabilities}
                suggestions={suggestions}
                onDataChanged={() => {
                  loadData();
                }}
                onBackToHome={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Deep-Dive Vulnerability Modal */}
      <VulnerabilityModal
        vulnerability={selectedVulnerability}
        category={categories.find(c => c.id === selectedVulnerability?.category_id)}
        onClose={() => setSelectedVulnerability(null)}
        onSuggestImprovement={handleSuggestImprovement}
      />

      {/* Footer */}
      <Footer
        onSelectTab={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
