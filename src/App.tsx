import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StreamingCatalog } from './components/StreamingCatalog';
import { VulnerabilityModal } from './components/VulnerabilityModal';
import { FloatingSuggestionButton } from './components/FloatingSuggestionButton';
import { SuggestionsView } from './components/SuggestionsView';
import { AdminView } from './components/AdminView';
import { AdminLogin } from './components/AdminLogin';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentProfileView } from './components/StudentProfileView';
import { Footer } from './components/Footer';
import { Category, Vulnerability, Suggestion, ActiveTab, User, SiteSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  
  // Site dynamic configuration
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_title: 'Security X',
    site_description: 'Esse site tem como objetivo apresentar um glossário de fragilidades em sistemas da informação, além de mostrar exemplos e dar explicações acerca dessas mesmas vulnerabilidades de forma acessível e facilitada. Tendo como público alvo os estudantes da área.',
    hero_badge: 'PORTAL ACADÊMICO DE SEGURANÇA DEFENSIVA & OFENSIVA',
    footer_text: 'Plataforma educacional de conscientização e estudo de fragilidades em sistemas da informação, dedicada a estudantes e pesquisadores.',
  });

  // Search & Filters for Home Page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [suggestionInitialTitle, setSuggestionInitialTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Student Community Authentication State
  const [currentStudentUser, setCurrentStudentUser] = useState<User | null>(null);
  const [studentToken, setStudentToken] = useState<string>('');
  const [isStudentAuthModalOpen, setIsStudentAuthModalOpen] = useState(false);

  // Admin Authentication & Invisibility Controls
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');

  // Load all public data & settings from API
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [catsRes, vulnsRes, sugsRes, settingsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/vulnerabilities'),
        fetch('/api/suggestions'),
        fetch('/api/site-settings'),
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

      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        setSiteSettings(settings);
      }
    } catch (err) {
      console.error('Erro ao sincronizar dados com o backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify student token
  const verifyStudentSession = async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentStudentUser(data.user);
        setStudentToken(token);
      } else {
        localStorage.removeItem('secx_student_token');
        setCurrentStudentUser(null);
        setStudentToken('');
      }
    } catch (e) {
      console.error('Erro ao verificar sessão do estudante:', e);
    }
  };

  useEffect(() => {
    loadData();

    // Check student session
    const savedStudentToken = localStorage.getItem('secx_student_token');
    if (savedStudentToken) {
      verifyStudentSession(savedStudentToken);
    }

    // Check admin session
    const savedAdminToken = sessionStorage.getItem('secx_admin_token');
    if (savedAdminToken) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${savedAdminToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setIsAdminAuthenticated(true);
            setAuthToken(savedAdminToken);
          } else {
            sessionStorage.removeItem('secx_admin_token');
          }
        })
        .catch(() => {
          sessionStorage.removeItem('secx_admin_token');
        });
    }

    // Check if initial URL includes #admin or ?admin
    if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
      setActiveTab('admin');
    }

    // Keyboard listener for secret admin shortcut (Ctrl + Shift + A or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  // Secret admin entry trigger
  const handleSecretAdminTrigger = () => {
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle successful student login / register
  const handleStudentAuthSuccess = (user: User, token: string) => {
    localStorage.setItem('secx_student_token', token);
    setCurrentStudentUser(user);
    setStudentToken(token);
    setIsStudentAuthModalOpen(false);
  };

  // Handle student logout
  const handleStudentLogout = () => {
    localStorage.removeItem('secx_student_token');
    setCurrentStudentUser(null);
    setStudentToken('');
    if (activeTab === 'profile') {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle successful administrator login
  const handleAdminLoginSuccess = (token: string) => {
    sessionStorage.setItem('secx_admin_token', token);
    setAuthToken(token);
    setIsAdminAuthenticated(true);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle administrator logout
  const handleAdminLogout = async () => {
    try {
      if (authToken) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
    } catch (e) {
      console.error('Erro no logout do admin:', e);
    } finally {
      sessionStorage.removeItem('secx_admin_token');
      setAuthToken('');
      setIsAdminAuthenticated(false);
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      {/* 1. Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollToCatalog={handleScrollToCatalog}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={handleAdminLogout}
        onSecretAdminTrigger={handleSecretAdminTrigger}
        currentStudentUser={currentStudentUser}
        onOpenStudentAuth={() => setIsStudentAuthModalOpen(true)}
        onOpenStudentProfile={() => {
          setActiveTab('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-slate-400">Carregando {siteSettings.site_title}...</span>
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
                  siteSettings={siteSettings}
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

            {/* VIEW 3: Aba Separada - Central de Sugestões dos Estudantes (Requer Login) */}
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
                currentStudentUser={currentStudentUser}
                studentToken={studentToken}
                onOpenStudentAuth={() => setIsStudentAuthModalOpen(true)}
                onGoToProfile={() => {
                  setActiveTab('profile');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* VIEW 4: Aba Separada e Restrita - Painel Administrativo com Login Obrigatório */}
            {activeTab === 'admin' && (
              <>
                {!isAdminAuthenticated ? (
                  <AdminLogin
                    onSuccess={handleAdminLoginSuccess}
                    onCancel={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ) : (
                  <AdminView
                    categories={categories}
                    vulnerabilities={vulnerabilities}
                    suggestions={suggestions}
                    authToken={authToken}
                    onLogout={handleAdminLogout}
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

            {/* VIEW 5: Perfil do Estudante (Troca de senha, username, foto de perfil, minhas sugestões) */}
            {activeTab === 'profile' && (
              <>
                {currentStudentUser ? (
                  <StudentProfileView
                    currentUser={currentStudentUser}
                    studentToken={studentToken}
                    onUpdateUser={updated => setCurrentStudentUser(updated)}
                    onLogout={handleStudentLogout}
                    onBackToHome={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onGoToSuggestions={() => {
                      setActiveTab('suggestions');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ) : (
                  <div className="max-w-md mx-auto my-16 p-8 bg-[#101728] border border-slate-800 rounded-2xl text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Acesso ao Perfil</h3>
                    <p className="text-xs text-slate-400 mb-6">
                      Faça login com sua conta de estudante para gerenciar suas informações e contribuições.
                    </p>
                    <button
                      onClick={() => setIsStudentAuthModalOpen(true)}
                      className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold text-xs rounded-xl shadow cursor-pointer"
                    >
                      Entrar ou Cadastrar
                    </button>
                  </div>
                )}
              </>
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

      {/* Student Community Auth Modal */}
      <StudentAuthModal
        isOpen={isStudentAuthModalOpen}
        onClose={() => setIsStudentAuthModalOpen(false)}
        onSuccess={handleStudentAuthSuccess}
      />

      {/* Footer com gatilho discreto de administrador */}
      <Footer
        onSelectTab={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSecretAdminTrigger={handleSecretAdminTrigger}
        isAdminAuthenticated={isAdminAuthenticated}
        siteSettings={siteSettings}
      />
    </div>
  );
}
