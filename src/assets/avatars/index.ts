export interface PredefinedAvatar {
  id: string;
  name: string;
  category: string;
  gradient: string;
  borderColor: string;
  iconType: 'hacker' | 'shield' | 'terminal' | 'crypto' | 'network' | 'bot';
}

export const PREDEFINED_AVATARS: PredefinedAvatar[] = [
  {
    id: 'avatar-cyber-hacker',
    name: 'Hacker Ético (White Hat)',
    category: 'Segurança Ofensiva',
    gradient: 'from-cyan-500 to-blue-700',
    borderColor: 'border-cyan-400',
    iconType: 'hacker',
  },
  {
    id: 'avatar-sec-analyst',
    name: 'Analista SecOps',
    category: 'Defesa & Monitoramento',
    gradient: 'from-emerald-500 to-teal-800',
    borderColor: 'border-emerald-400',
    iconType: 'shield',
  },
  {
    id: 'avatar-crypto-expert',
    name: 'Especialista em Criptografia',
    category: 'Cifragem & Dados',
    gradient: 'from-purple-500 to-indigo-800',
    borderColor: 'border-purple-400',
    iconType: 'crypto',
  },
  {
    id: 'avatar-researcher',
    name: 'Pesquisador Acadêmico',
    category: 'Ciência & Pesquisa',
    gradient: 'from-amber-500 to-orange-700',
    borderColor: 'border-amber-400',
    iconType: 'network',
  },
  {
    id: 'avatar-sentinel',
    name: 'Sentinela de Redes',
    category: 'Infraestrutura',
    gradient: 'from-rose-500 to-pink-800',
    borderColor: 'border-rose-400',
    iconType: 'bot',
  },
  {
    id: 'avatar-terminal-ops',
    name: 'Engenheiro de Sistemas',
    category: 'Kernel & DevSecOps',
    gradient: 'from-sky-400 to-blue-800',
    borderColor: 'border-sky-400',
    iconType: 'terminal',
  },
];
