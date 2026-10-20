import React, { useState } from 'react';
import {
  ShieldAlert,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Database,
  Download,
  Search,
  Filter,
  Check,
  Flame,
  AlertTriangle,
  Info,
  ShieldCheck,
  ArrowLeft,
  X,
  FileCode,
} from 'lucide-react';
import { Category, Vulnerability, Suggestion, SeverityLevel } from '../types';

interface AdminViewProps {
  categories: Category[];
  vulnerabilities: Vulnerability[];
  suggestions: Suggestion[];
  authToken: string;
  onLogout: () => void;
  onDataChanged: () => void;
  onBackToHome: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  categories,
  vulnerabilities,
  suggestions,
  authToken,
  onLogout,
  onDataChanged,
  onBackToHome,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vulns' | 'suggestions' | 'database'>('vulns');
  const [searchTable, setSearchTable] = useState('');
  
  // Vulnerability CRUD Modal state
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingVuln, setEditingVuln] = useState<Vulnerability | null>(null);
  const [formVuln, setFormVuln] = useState({
    title: '',
    category_id: categories[0]?.id || 'owasp-top10',
    severity: 'Medium' as SeverityLevel,
    short_summary: '',
    detailed_description: '',
    practical_example: '',
    mitigation: '',
    cwe_id: '',
    owasp_reference: '',
    attack_vector: '',
    impact_scope: '',
  });

  // Action status message
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  const showNotice = (type: 'success' | 'error', msg: string) => {
    setActionNotice({ type, msg });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingVuln(null);
    setFormVuln({
      title: '',
      category_id: categories[0]?.id || 'owasp-top10',
      severity: 'Medium',
      short_summary: '',
      detailed_description: '',
      practical_example: '',
      mitigation: '',
      cwe_id: 'CWE-',
      owasp_reference: '',
      attack_vector: '',
      impact_scope: '',
    });
    setIsEditingModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (vuln: Vulnerability) => {
    setEditingVuln(vuln);
    setFormVuln({
      title: vuln.title,
      category_id: vuln.category_id,
      severity: vuln.severity,
      short_summary: vuln.short_summary,
      detailed_description: vuln.detailed_description,
      practical_example: vuln.practical_example || '',
      mitigation: vuln.mitigation || '',
      cwe_id: vuln.cwe_id || '',
      owasp_reference: vuln.owasp_reference || '',
      attack_vector: vuln.attack_vector || '',
      impact_scope: vuln.impact_scope || '',
    });
    setIsEditingModalOpen(true);
  };

  // Save (Create or Update) Vulnerability
  const handleSaveVulnerability = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVuln) {
        // PUT update
        const res = await fetch(`/api/vulnerabilities/${editingVuln.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(formVuln),
        });
        if (!res.ok) throw new Error('Falha ao atualizar fragilidade');
        showNotice('success', `Fragilidade "${formVuln.title}" atualizada com sucesso!`);
      } else {
        // POST create
        const res = await fetch('/api/vulnerabilities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(formVuln),
        });
        if (!res.ok) throw new Error('Falha ao cadastrar fragilidade');
        showNotice('success', `Nova fragilidade "${formVuln.title}" cadastrada e publicada no catálogo!`);
      }

      setIsEditingModalOpen(false);
      onDataChanged();
    } catch (err: any) {
      showNotice('error', err.message || 'Erro ao salvar fragilidade.');
    }
  };

  // Delete Vulnerability
  const handleDeleteVulnerability = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja remover a fragilidade "${title}" do catálogo?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/vulnerabilities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!res.ok) throw new Error('Falha ao remover fragilidade');
      showNotice('success', `Fragilidade "${title}" removida do catálogo.`);
      onDataChanged();
    } catch (err: any) {
      showNotice('error', err.message || 'Erro ao remover fragilidade.');
    }
  };

  // Approve Suggestion to Catalog
  const handleApproveSuggestion = async (suggestion: Suggestion) => {
    try {
      const res = await fetch(`/api/suggestions/${suggestion.id}/approve-to-vuln`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: suggestion.term_title,
          category_id: suggestion.category_id,
          severity: suggestion.severity,
          short_summary: suggestion.description.slice(0, 140),
          detailed_description: suggestion.description,
          practical_example: suggestion.example || 'Exemplo a ser complementado pelo administrador.',
          mitigation: 'Aplicar controle de acesso e validação estrita de entradas.',
        }),
      });

      if (!res.ok) throw new Error('Falha ao aprovar sugestão');
      showNotice('success', `Sugestão "${suggestion.term_title}" aprovada e inserida no catálogo oficial!`);
      onDataChanged();
    } catch (err: any) {
      showNotice('error', err.message || 'Erro ao aprovar sugestão.');
    }
  };

  // Reject Suggestion
  const handleRejectSuggestion = async (id: string) => {
    try {
      const res = await fetch(`/api/suggestions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status: 'rejected',
          admin_notes: 'Revisado pelo administrador.',
        }),
      });

      if (!res.ok) throw new Error('Falha ao rejeitar sugestão');
      showNotice('success', 'Sugestão marcada como rejeitada.');
      onDataChanged();
    } catch (err: any) {
      showNotice('error', err.message || 'Erro ao rejeitar sugestão.');
    }
  };

  // Download SQL PostgreSQL Dump
  const handleDownloadSql = () => {
    window.location.href = '/api/database/export-sql';
  };

  const filteredVulns = vulnerabilities.filter(
    v =>
      v.title.toLowerCase().includes(searchTable.toLowerCase()) ||
      (v.cwe_id && v.cwe_id.toLowerCase().includes(searchTable.toLowerCase())) ||
      v.short_summary.toLowerCase().includes(searchTable.toLowerCase())
  );

  return (
    <div className="w-full py-10 px-6 max-w-7xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Página Inicial & Catálogo</span>
        </button>

        <button
          onClick={onLogout}
          className="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/30 transition-colors cursor-pointer"
        >
          Encerrar Sessão de Administrador
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-mono mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>PAINEL EXCLUSIVO DO ADMINISTRADOR (Sessão Segura)</span>
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white">
            Administração do Security X
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Insira, edite e gerencie as terminologias do catálogo streaming, modere sugestões de estudantes e exporte para o PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold text-xs rounded-xl shadow-md shadow-cyan-400/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nova Fragilidade</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Notice */}
      {actionNotice && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm animate-in fade-in ${
            actionNotice.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              : 'bg-red-950/60 border-red-800 text-red-200'
          }`}
        >
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{actionNotice.msg}</span>
        </div>
      )}

      {/* Admin KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-[#101728] border border-slate-800">
          <span className="text-xs font-medium text-slate-400 block mb-1">Vulnerabilidades no Catálogo</span>
          <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {vulnerabilities.length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#101728] border border-slate-800">
          <span className="text-xs font-medium text-slate-400 block mb-1">Sugestões Pendentes</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {pendingSuggestions.length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#101728] border border-slate-800">
          <span className="text-xs font-medium text-slate-400 block mb-1">Categorias Ativas</span>
          <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">
            {categories.length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#101728] border border-slate-800">
          <span className="text-xs font-medium text-slate-400 block mb-1">Banco de Dados</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-2">
            <Database className="w-4 h-4" />
            <span>PostgreSQL Relational Ready</span>
          </span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveSubTab('vulns')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'vulns'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Gerenciar Fragilidades ({vulnerabilities.length})
        </button>

        <button
          onClick={() => setActiveSubTab('suggestions')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'suggestions'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Moderar Sugestões</span>
          {pendingSuggestions.length > 0 && (
            <span className="text-[11px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
              {pendingSuggestions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'database'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Banco de Dados & PostgreSQL</span>
        </button>
      </div>

      {/* Sub-tab 1: Gerenciar Fragilidades Table */}
      {activeSubTab === 'vulns' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTable}
                onChange={e => setSearchTable(e.target.value)}
                placeholder="Filtrar tabela por nome ou CWE..."
                className="w-full pl-9 pr-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <span className="text-xs text-slate-400 self-end sm:self-auto font-mono">
              Mostrando {filteredVulns.length} de {vulnerabilities.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0F172A]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#162038] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Título da Fragilidade</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Severidade</th>
                  <th className="py-3 px-4">Identificador</th>
                  <th className="py-3 px-4 text-right">Ações Administrativas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredVulns.map(v => {
                  const cat = categories.find(c => c.id === v.category_id);
                  return (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{v.title}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
                          {v.short_summary}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-300 font-medium">{cat?.name || 'Geral'}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            v.severity === 'Critical'
                              ? 'text-red-400'
                              : v.severity === 'High'
                              ? 'text-amber-400'
                              : v.severity === 'Medium'
                              ? 'text-cyan-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {v.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {v.cwe_id || '-'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(v)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Editar fragilidade"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVulnerability(v.id, v.title)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Excluir fragilidade do catálogo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Moderar Sugestões */}
      {activeSubTab === 'suggestions' && (
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-12 bg-[#0F172A] rounded-xl border border-slate-800 text-slate-400 text-xs">
              Nenhuma sugestão registrada até o momento.
            </div>
          ) : (
            suggestions.map(s => {
              const cat = categories.find(c => c.id === s.category_id);
              return (
                <div
                  key={s.id}
                  className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{s.term_title}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          s.status === 'approved'
                            ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800'
                            : s.status === 'rejected'
                            ? 'text-red-400 bg-red-950/40 border border-red-800'
                            : 'text-amber-400 bg-amber-950/40 border border-amber-800'
                        }`}
                      >
                        {s.status === 'approved'
                          ? 'Aprovada no Catálogo'
                          : s.status === 'rejected'
                          ? 'Rejeitada'
                          : 'Aguardando Moderação'}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">{s.description}</p>

                    {s.example && (
                      <div className="p-2.5 rounded bg-[#090D16] border border-slate-800 font-mono text-[11px] text-slate-300">
                        <strong>Exemplo:</strong> {s.example}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-1">
                      <span>Categoria sugerida: <strong className="text-slate-400">{cat?.name || 'Geral'}</strong></span>
                      <span>·</span>
                      <span>Enviado por: <strong className="text-slate-400">{s.student_name}</strong></span>
                      {s.student_email && (
                        <>
                          <span>·</span>
                          <span className="font-mono">{s.student_email}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions for Pending Suggestions */}
                  {s.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleApproveSuggestion(s)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar para o Catálogo</span>
                      </button>

                      <button
                        onClick={() => handleRejectSuggestion(s.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Sub-tab 3: Database & PostgreSQL Integration */}
      {activeSubTab === 'database' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <span>Esquema Relacional PostgreSQL</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  O Security X possui um modelo de dados relacional desenhado para PostgreSQL com chaves primárias, restrições e relacionamentos formais.
                </p>
              </div>

              <button
                onClick={handleDownloadSql}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Exportar DDL & DML PostgreSQL (.sql)</span>
              </button>
            </div>

            {/* Tables preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 font-mono block mb-2">TABELA categories</span>
                <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
                  <li>• id (VARCHAR PRIMARY KEY)</li>
                  <li>• name (VARCHAR NOT NULL)</li>
                  <li>• description (TEXT)</li>
                  <li>• badge_label (VARCHAR)</li>
                  <li>• sort_order (INT)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 font-mono block mb-2">TABELA vulnerabilities</span>
                <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
                  <li>• id (VARCHAR PRIMARY KEY)</li>
                  <li>• title (VARCHAR NOT NULL)</li>
                  <li>• category_id (FK categories)</li>
                  <li>• severity (CHECK IN enum)</li>
                  <li>• short_summary (TEXT)</li>
                  <li>• detailed_description (TEXT)</li>
                  <li>• practical_example (TEXT)</li>
                  <li>• mitigation (TEXT)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 font-mono block mb-2">TABELA suggestions</span>
                <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
                  <li>• id (VARCHAR PRIMARY KEY)</li>
                  <li>• term_title (VARCHAR NOT NULL)</li>
                  <li>• category_id (FK categories)</li>
                  <li>• severity (CHECK IN enum)</li>
                  <li>• description (TEXT)</li>
                  <li>• example (TEXT)</li>
                  <li>• student_name (VARCHAR)</li>
                  <li>• status (CHECK IN enum)</li>
                </ul>
              </div>
            </div>

            {/* SQL Snippet Preview */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Pré-visualização do Script DDL (PostgreSQL)</span>
              </span>
              <pre className="p-4 rounded-xl bg-[#090D16] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed max-h-60">
{`CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_label VARCHAR(50),
    sort_order INT DEFAULT 0
);

CREATE TABLE vulnerabilities (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    short_summary TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    practical_example TEXT NOT NULL,
    mitigation TEXT NOT NULL,
    cwe_id VARCHAR(50),
    owasp_reference VARCHAR(100),
    attack_vector VARCHAR(100),
    impact_scope VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Vulnerability Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div
            className="w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4 my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold font-display text-white">
                {editingVuln ? 'Editar Fragilidade do Catálogo' : 'Inserir Nova Fragilidade no Catálogo'}
              </h3>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVulnerability} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Título da Fragilidade <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formVuln.title}
                  onChange={e => setFormVuln({ ...formVuln, title: e.target.value })}
                  placeholder="Ex: Remote Code Execution (RCE)"
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoria</label>
                  <select
                    value={formVuln.category_id}
                    onChange={e => setFormVuln({ ...formVuln, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severidade</label>
                  <select
                    value={formVuln.severity}
                    onChange={e => setFormVuln({ ...formVuln, severity: e.target.value as SeverityLevel })}
                    className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white cursor-pointer"
                  >
                    <option value="Critical" className="bg-slate-900">Crítica</option>
                    <option value="High" className="bg-slate-900">Alta</option>
                    <option value="Medium" className="bg-slate-900">Média</option>
                    <option value="Low" className="bg-slate-900">Baixa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Código CWE</label>
                  <input
                    type="text"
                    value={formVuln.cwe_id}
                    onChange={e => setFormVuln({ ...formVuln, cwe_id: e.target.value })}
                    placeholder="Ex: CWE-79, CWE-89"
                    className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Referência OWASP</label>
                  <input
                    type="text"
                    value={formVuln.owasp_reference}
                    onChange={e => setFormVuln({ ...formVuln, owasp_reference: e.target.value })}
                    placeholder="Ex: A03:2021-Injection"
                    className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Resumo Curto (Para os Cards do Streaming) <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formVuln.short_summary}
                  onChange={e => setFormVuln({ ...formVuln, short_summary: e.target.value })}
                  placeholder="Resumo didático em 1 a 2 frases para leitura rápida no catálogo..."
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Explicação Didática Completa <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formVuln.detailed_description}
                  onChange={e => setFormVuln({ ...formVuln, detailed_description: e.target.value })}
                  placeholder="Explicação passo a passo da mecânica da falha..."
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Exemplo Prático / Código / Cenário de Ataque
                </label>
                <textarea
                  rows={3}
                  value={formVuln.practical_example}
                  onChange={e => setFormVuln({ ...formVuln, practical_example: e.target.value })}
                  placeholder="Exemplo prático de payload ou código demonstrativo..."
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Estratégias de Mitigação e Defesa
                </label>
                <textarea
                  rows={3}
                  value={formVuln.mitigation}
                  onChange={e => setFormVuln({ ...formVuln, mitigation: e.target.value })}
                  placeholder="Passos recomendados para blindar e corrigir o sistema..."
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 rounded-lg font-bold transition-colors cursor-pointer shadow"
                >
                  {editingVuln ? 'Atualizar Fragilidade' : 'Publicar no Catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
