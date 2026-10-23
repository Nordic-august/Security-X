import React from 'react';
import { PREDEFINED_AVATARS, PredefinedAvatar } from '../assets/avatars';
import { Terminal, Shield, Lock, Cpu, Globe, Bot } from 'lucide-react';

interface AvatarDisplayProps {
  avatarId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarId = 'avatar-cyber-hacker',
  size = 'md',
  className = '',
  showBorder = true,
}) => {
  const avatar: PredefinedAvatar =
    PREDEFINED_AVATARS.find(a => a.id === avatarId) || PREDEFINED_AVATARS[0];

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }[size];

  const renderIcon = () => {
    switch (avatar.iconType) {
      case 'shield':
        return <Shield className={iconSizes} />;
      case 'terminal':
        return <Terminal className={iconSizes} />;
      case 'crypto':
        return <Lock className={iconSizes} />;
      case 'network':
        return <Globe className={iconSizes} />;
      case 'bot':
        return <Bot className={iconSizes} />;
      case 'hacker':
      default:
        return <Cpu className={iconSizes} />;
    }
  };

  return (
    <div
      className={`relative rounded-full flex items-center justify-center text-white bg-gradient-to-br ${avatar.gradient} shadow-md shrink-0 ${
        showBorder ? `border-2 ${avatar.borderColor}` : ''
      } ${sizeClasses} ${className}`}
      title={avatar.name}
    >
      {renderIcon()}
    </div>
  );
};
