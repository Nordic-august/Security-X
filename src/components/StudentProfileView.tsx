import React, { useState, useEffect } from 'react';
import {
  User as UserType,
  Suggestion,
} from '../types';
import { PREDEFINED_AVATARS, PredefinedAvatar } from '../assets/avatars';
import { AvatarDisplay } from './AvatarDisplay';
import {
  User,
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  Save,
  ArrowLeft,
  LogOut,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface StudentProfileViewProps {
  currentUser: UserType;
  studentToken: string;
  onUpdateUser: (updatedUser: UserType) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  onGoToSuggestions: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  currentUser,
  studentToken,
  onUpdateUser,
  onLogout,
  onBackToHome,
  onGoToSuggestions,
}) => {
  // Username and Avatar edit state
  const [username, setUsername] = useState(currentUser.username);
  const [selectedAvatarId, setSelectedAvatarId] = useState(currentUser.avatar_id || PREDEFINED_AVATARS[0].id);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password edit state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // My Suggestions state
  const [mySuggestions, setMySuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const fetchMySuggestions = async () => {
    try {
      setIsLoadingSuggestions(true);
      const res = await fetch('/api/auth/my-suggestions', {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMySuggestions(data);
      }
    } catch (e) {
      console.error('Erro ao buscar sugestões do estudante:', e);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchMySuggestions();
  }, [studentToken]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);

    if (username.trim().length < 3) {
      setProfileNotice({ type: 'error', text: 'O nome de usuário deve ter no mínimo 3 caracteres.' });
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          avatar_id: selectedAvatarId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao atualizar perfil');

      onUpdateUser(data.user);
      setProfileNotice({ type: 'success', text: 'Perfil e foto atualizados com sucesso!' });
      setTimeout(() => setProfileNotice(null), 4000);
    } catch (err: any) {
      setProfileNotice({ type: 'error', text: err.message || 'Erro ao salvar perfil.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (!currentPassword || !newPassword) {
      setPasswordNotice({ type: 'error', text: 'Preencha a senha atual e a nova senha.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordNotice({ type: 'error', text: 'A nova senha deve ter no mínimo 6 dígitos.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordNotice({ type: 'error', text: 'A confirmação de senha não confere.' });
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao alterar senha');

      setPasswordNotice({ type: 'success', text: 'Senha alterada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordNotice(null), 4000);
    } catch (err: any) {
      setPasswordNotice({ type: 'error', text: err.message || 'Erro ao alterar senha.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const filteredSuggestions = mySuggestions.filter(s => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const approvedCount = mySuggestions.filter(s => s.status === 'approved').length;
  const pendingCount = mySuggestions.filter(s => s.status === 'pending').length;

  return (
    <div className="w-full py-10 px-6 max-w-5xl mx-auto">
      {/* Back button & Action */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Glossário & Catálogo</span>
        </button>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair da Conta</span>
        </button>
      </div>

      {/* Profile Identity Card */}
      <div className="bg-[#101728] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <AvatarDisplay avatarId={selectedAvatarId} size="xl" />

        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-[11px] font-mono mb-2">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>ESTUDANTE / CONTRIBUIDOR VERIFICADO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {currentUser.username}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1 font-mono">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentUser.email}</span>
          </p>

          {/* Quick Counter Metrics */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block text-[11px]">Total de Sugestões</span>
              <strong className="text-cyan-400 font-mono text-base">{mySuggestions.length}</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[11px]">Aprovadas pelo Admin</span>
              <strong className="text-emerald-400 font-mono text-base">{approvedCount}</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[11px]">Aguardando Análise</span>
              <strong className="text-amber-400 font-mono text-base">{pendingCount}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* EDIT PROFILE FORM & AVATAR PICKER */}
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-white mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              <span>Personalizar Perfil & Avatar</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Altere seu nome de exibição e escolha uma foto de perfil temática predefinida.
            </p>

            {profileNotice && (
              <div
                className={`mb-4 p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  profileNotice.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                    : 'bg-red-950/60 border-red-800 text-red-200'
                }`}
              >
                {profileNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{profileNotice.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#090D16] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Predefined Avatar Gallery */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Galeria de Fotos de Perfil Predefinidas
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PREDEFINED_AVATARS.map(av => {
                    const isSelected = selectedAvatarId === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatarId(av.id)}
                        className={`p-2 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/30 scale-105'
                            : 'bg-[#090D16] border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                        title={`${av.name} (${av.category})`}
                      >
                        <AvatarDisplay avatarId={av.id} size="md" showBorder={false} />
                        <span className="text-[10px] text-slate-400 truncate max-w-full text-center">
                          {av.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações de Perfil'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* SECURITY & PASSWORD CHANGE */}
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-white mb-1 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>Segurança da Conta & Senha</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Mantenha sua conta de estudante protegida atualizando sua senha com frequência.
            </p>

            {passwordNotice && (
              <div
                className={`mb-4 p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  passwordNotice.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                    : 'bg-red-950/60 border-red-800 text-red-200'
                }`}
              >
                {passwordNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{passwordNotice.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Senha Atual</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-[#090D16] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nova Senha</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3.5 py-2 bg-[#090D16] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Nova Senha</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-3.5 py-2 bg-[#090D16] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>{isChangingPassword ? 'Alterando...' : 'Atualizar Minha Senha'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* DASHBOARD: MY CONTRIBUTIONS (SUGESTÕES DO ESTUDANTE) */}
      <div className="bg-[#101728] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Minhas Contribuições & Sugestões de Fragilidades</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Acompanhe em tempo real se suas sugestões já foram revisadas e publicadas no catálogo oficial pelo administrador.
            </p>
          </div>

          <button
            onClick={onGoToSuggestions}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <span>+ Nova Sugestão</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({mySuggestions.length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aprovadas pelo Admin ({approvedCount})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aguardando Moderação ({pendingCount})
          </button>
        </div>

        {/* Suggestions List */}
        {isLoadingSuggestions ? (
          <div className="text-center py-8 text-xs text-slate-500">Carregando suas sugestões...</div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="text-center py-12 bg-[#090D16] rounded-xl border border-slate-800 text-slate-400 text-xs">
            <Lightbulb className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300 mb-1">Nenhuma sugestão nesta categoria</p>
            <p className="text-slate-500 mb-4">Você ainda não possui sugestões com este status.</p>
            <button
              onClick={onGoToSuggestions}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Clique aqui para sugerir uma fragilidade ao catálogo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSuggestions.map(s => {
              const statusBadge =
                s.status === 'approved'
                  ? {
                      label: 'Aprovada no Catálogo',
                      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800',
                      icon: CheckCircle2,
                    }
                  : s.status === 'rejected'
                  ? {
                      label: 'Rejeitada',
                      color: 'text-red-400 bg-red-950/40 border-red-800',
                      icon: XCircle,
                    }
                  : {
                      label: 'Aguardando Moderação do Admin',
                      color: 'text-amber-400 bg-amber-950/40 border-amber-800',
                      icon: Clock,
                    };

              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={s.id}
                  className="p-5 rounded-xl bg-[#090D16] border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-base font-bold font-display text-white">{s.term_title}</h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[11px] font-semibold self-start sm:self-auto ${statusBadge.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{s.description}</p>

                  {s.example && (
                    <div className="p-3 rounded bg-[#0F172A] border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      <strong>Exemplo enviado:</strong> {s.example}
                    </div>
                  )}

                  {s.admin_notes && (
                    <div className="p-2.5 rounded bg-indigo-950/30 border border-indigo-800/40 text-[11px] text-indigo-300">
                      <strong>Nota do Administrador:</strong> {s.admin_notes}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-1">
                    <span>Enviado em: {new Date(s.created_at).toLocaleDateString('pt-BR')}</span>
                    <span>·</span>
                    <span>Gravidade estimada: <strong className="text-slate-300">{s.severity}</strong></span>
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
