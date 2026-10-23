import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';
import { PREDEFINED_AVATARS } from '../assets/avatars';
import { AvatarDisplay } from './AvatarDisplay';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType, token: string) => void;
  initialMode?: 'login' | 'register';
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [identifier, setIdentifier] = useState(''); // email or username for login
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(PREDEFINED_AVATARS[0].id);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateEmailFormat = (emailStr: string) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(emailStr.trim());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim() || !password) {
      setErrorMsg('Preencha seu e-mail ou nome de usuário e a senha.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao autenticar.');
      }

      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !username.trim() || !password) {
      setErrorMsg('Todos os campos são obrigatórios.');
      return;
    }

    if (!validateEmailFormat(email)) {
      setErrorMsg('Forneça um endereço de e-mail real e válido (ex: seu.nome@dominio.com).');
      return;
    }

    if (username.trim().length < 3) {
      setErrorMsg('O nome de usuário deve conter pelo menos 3 caracteres.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim(),
          password,
          avatar_id: selectedAvatarId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha no cadastro.');
      }

      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>PORTAL DA COMUNIDADE & ESTUDANTES</span>
          </div>
          <h3 className="text-2xl font-bold font-display text-white">
            {mode === 'login' ? 'Conectar ao Security X' : 'Criar Conta de Estudante'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Acesse seu perfil e envie sugestões de fragilidades para o catálogo.'
              : 'Cadastre-se com e-mail real para contribuir e acompanhar suas aprovações.'}
          </p>

          <div className="flex items-center justify-center gap-2 mt-5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 flex items-center gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail ou Nome de Usuário
              </label>
              <div className="relative flex items-center bg-[#090D16] border border-slate-700 rounded-xl focus-within:border-cyan-400">
                <div className="pl-3.5 text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="seu.email@faculdade.edu.br ou usuario"
                  className="w-full py-2.5 pl-3 pr-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Sua Senha
              </label>
              <div className="relative flex items-center bg-[#090D16] border border-slate-700 rounded-xl focus-within:border-cyan-400">
                <div className="pl-3.5 text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 pl-3 pr-10 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Conectando...' : 'Entrar na Conta'}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail Acadêmico / Real <span className="text-cyan-400">*</span>
              </label>
              <div className="relative flex items-center bg-[#090D16] border border-slate-700 rounded-xl focus-within:border-cyan-400">
                <div className="pl-3.5 text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@faculdade.edu.br"
                  className="w-full py-2 pl-3 pr-3 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Apenas formatos e domínios de e-mails válidos são aceitos para evitar contas falsas.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome de Usuário <span className="text-cyan-400">*</span>
              </label>
              <div className="relative flex items-center bg-[#090D16] border border-slate-700 rounded-xl focus-within:border-cyan-400">
                <div className="pl-3.5 text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="ex: CarlosDev, AnaSec"
                  className="w-full py-2 pl-3 pr-3 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Choose Initial Predefined Avatar */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Escolha seu Avatar Cyber
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PREDEFINED_AVATARS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatarId(av.id)}
                    className={`p-1 rounded-xl transition-all cursor-pointer flex flex-col items-center ${
                      selectedAvatarId === av.id
                        ? 'ring-2 ring-cyan-400 bg-cyan-950/40 scale-105'
                        : 'opacity-70 hover:opacity-100 hover:bg-slate-800'
                    }`}
                    title={av.name}
                  >
                    <AvatarDisplay avatarId={av.id} size="sm" showBorder={false} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Senha <span className="text-cyan-400">*</span>
                </label>
                <div className="relative flex items-center bg-[#090D16] border border-slate-700 rounded-xl focus-within:border-cyan-400">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 dígitos"
                    className="w-full py-2 px-3 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirmar Senha <span className="text-cyan-400">*</span>
                </label>
                <div className="relative flex items-center bg-[#090D16] border border-slate-700 rounded-xl focus-within:border-cyan-400">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full py-2 px-3 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
