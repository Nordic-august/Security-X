import React, { useState } from 'react';
import { ShieldAlert, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (token: string, username: string) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Informe o login e a senha de administrador.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.');
      }

      onSuccess(data.token, data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha na autenticação do administrador.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#101728] border border-slate-800 rounded-2xl p-8 shadow-2xl relative">
        {/* Back to Public Site */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao site público</span>
        </button>

        {/* Lock Graphic Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-950/50">
            <KeyRound className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Portal de Administração
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Acesso estritamente restrito para operadores autorizados do Security X.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 flex items-center gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Login de Administrador
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
                placeholder="Identificador do admin"
                className="w-full py-2.5 pl-3 pr-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Senha de Acesso
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
                placeholder="Senha de segurança"
                className="w-full py-2.5 pl-3 pr-10 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Autenticando...' : 'Entrar no Painel de Admin'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Ambiente monitorado. Todas as mutações e aprovações de termos são auditadas.
          </p>
        </div>
      </div>
    </div>
  );
};
