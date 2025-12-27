import React from 'react';
import { StrategyType } from '../types';

interface StrategyCardProps {
  type: StrategyType;
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  isCritical?: boolean;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ 
  icon, 
  title, 
  description, 
  isSelected, 
  onClick,
  isCritical 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative flex flex-col p-5 rounded-xl border cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'bg-zinc-900 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.15)]' 
          : 'bg-zinc-900/50 border-white/5 hover:border-pink-500/30 hover:bg-zinc-900'
        }
      `}
    >
      {isCritical && (
        <span className="absolute -top-2.5 right-4 bg-pink-900/50 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-500/30">
          CRÍTICO
        </span>
      )}
      
      <div className={`mb-3 ${isSelected ? 'text-pink-500' : 'text-zinc-400 group-hover:text-pink-400'}`}>
        {icon}
      </div>
      
      <h3 className="text-white font-medium text-sm mb-1">{title}</h3>
      <p className="text-zinc-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
};
