import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Clock,
  User,
  Mail,
  Shield,
  ArrowLeft,
  Flame,
  AlertTriangle,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Category, Suggestion, SeverityLevel } from '../types';

interface SuggestionsViewProps {
  categories: Category[];
  initialTermTitle?: string;
  onBackToHome: () => void;
  onSuggestionSubmitted?: () => void;
}

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
  categories,
  initialTermTitle = '',
  onBackToHome,
  onSuggestionSubmitted,
}) => {
  const [formData, setFormData] = useState({
    term_title: initialTermTitle,
    category_id: categories[0]?.id || 'owasp-top10',
    severity: 'Medium' as SeverityLevel,
    description: '',
    example: '',
    student_name: '',
    student_email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recentSuggestions, setRecentSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  // Fetch recent suggestions
  const fetchRecent = async () => {
    try {
      setIsLoadingRecent(true);
      const res = await fetch('/api/suggestions');
      if (res.ok) {
        const data = await res.json();
        setRecentSuggestions(data);
      }
    } catch (e) {
      console.error('Erro ao buscar sugestões recentes:', e);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  React.useEffect(() => {
    fetchRecent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.term_title.trim() || !formData.description.trim()) {
      setErrorMsg('Por favor, preencha o nome do termo e a explicação.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Falha ao enviar sugestão');
      }

      const created: Suggestion = await res.json();
      setSubmittedId(created.id);
      setFormData({
        term_title: '',
        category_id: categories[0]?.id || 'owasp-top10',
        severity: 'Medium',
        description: '',
        example: '',
        student_name: '',
        student_email: '',
      });

      fetchRecent();
      if (onSuggestionSubmitted) onSuggestionSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão com a API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para a Página Inicial & Catálogo</span>
      </button>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-3">
          <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
          <span>ABA 3 · COLABORAÇÃO ACADÊMICA</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white mb-2">
          Central de Sugestões da Comunidade
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          Conhece uma vulnerabilidade ou falha de sistema relevante que ainda não está no Security X? Envie sua sugestão abaixo. Os administradores analisarão seu envio na Aba 4 para publicação no catálogo streaming.
        </p>
      </div>

      {/* Success Banner */}
      {submittedId && (
        <div className="mb-8 p-5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="block font-semibold text-white mb-1">
              Sugestão enviada com sucesso! (ID: {submittedId})
            </strong>
            <p className="text-xs text-emerald-300 leading-relaxed">
              Obrigado por contribuir com o Security X! Sua sugestão foi encaminhada para a fila de moderação dos administradores (Aba 4). Assim que aprovada, ela passará a compor o catálogo no estilo streaming.
            </p>
            <button
              onClick={() => setSubmittedId(null)}
              className="mt-3 text-xs text-white underline hover:text-emerald-100 cursor-pointer"
            >
              Enviar outra sugestão
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Suggestion Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#101728] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Term Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Nome da Fragilidade / Termo Técnico <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.term_title}
              onChange={e => setFormData({ ...formData, term_title: e.target.value })}
              placeholder="Ex: Cross-Site Request Forgery (CSRF), Race Condition, Buffer Overflow..."
              className="w-full px-4 py-3 bg-[#090D16] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Categoria Temática
            </label>
            <select
              value={formData.category_id}
              onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 bg-[#090D16] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Estimate */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Gravidade Estimada
            </label>
            <select
              value={formData.severity}
              onChange={e =>
                setFormData({ ...formData, severity: e.target.value as SeverityLevel })
              }
              className="w-full px-4 py-3 bg-[#090D16] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="Critical" className="bg-slate-900 text-red-400">Crítica</option>
              <option value="High" className="bg-slate-900 text-amber-400">Alta</option>
              <option value="Medium" className="bg-slate-900 text-cyan-400">Média</option>
              <option value="Low" className="bg-slate-900 text-emerald-400">Baixa</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Explicação Acessível da Fragilidade <span className="text-cyan-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Explique com suas palavras o que é essa fragilidade, como ela ocorre e por que representa um risco para sistemas da informação..."
            className="w-full px-4 py-3 bg-[#090D16] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed"
          />
        </div>

        {/* Practical Example */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Exemplo Prático ou Cenário de Ataque (Opcional)
          </label>
          <textarea
            rows={3}
            value={formData.example}
            onChange={e => setFormData({ ...formData, example: e.target.value })}
            placeholder="Exemplo de código vulnerável, comando de exploit, requisição HTTP maliciosa ou história real..."
            className="w-full px-4 py-3 bg-[#090D16] border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed"
          />
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Seu Nome ou Usuário Acadêmico (Opcional)</span>
            </label>
            <input
              type="text"
              value={formData.student_name}
              onChange={e => setFormData({ ...formData, student_name: e.target.value })}
              placeholder="Ex: Carlos Oliveira (Estudante SI)"
              className="w-full px-4 py-2.5 bg-[#090D16] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>E-mail Acadêmico para Contato (Opcional)</span>
            </label>
            <input
              type="email"
              value={formData.student_email}
              onChange={e => setFormData({ ...formData, student_email: e.target.value })}
              placeholder="Ex: carlos@universidade.edu.br"
              className="w-full px-4 py-2.5 bg-[#090D16] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>{isSubmitting ? 'Enviando...' : 'Enviar Sugestão para o Catálogo'}</span>
          </button>
        </div>
      </form>

      {/* Recent Submissions List */}
      <div className="mt-14 pt-8 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-display text-white">
            Sugestões Enviadas Recentemente
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {recentSuggestions.length} cadastradas
          </span>
        </div>

        {isLoadingRecent ? (
          <div className="text-center py-6 text-slate-500 text-xs">Carregando sugestões...</div>
        ) : recentSuggestions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs bg-[#0F172A] rounded-xl border border-slate-800">
            Nenhuma sugestão enviada até o momento. Seja o primeiro a sugerir!
          </div>
        ) : (
          <div className="space-y-3">
            {recentSuggestions.slice(0, 5).map(s => {
              const statusBadge =
                s.status === 'approved'
                  ? { label: 'Aprovado no Catálogo', color: 'text-emerald-400 border-emerald-800/80 bg-emerald-950/30' }
                  : s.status === 'rejected'
                  ? { label: 'Rejeitado', color: 'text-red-400 border-red-800/80 bg-red-950/30' }
                  : { label: 'Em Análise pelo Admin', color: 'text-amber-400 border-amber-800/80 bg-amber-950/30' };

              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{s.term_title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <p className="text-slate-400 line-clamp-1">{s.description}</p>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Enviado por: {s.student_name || 'Estudante Anônimo'} · {new Date(s.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
