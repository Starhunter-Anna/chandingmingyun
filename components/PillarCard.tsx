import React from 'react';
import { Pillar, Language } from '../types';
import { t } from '../translations';

interface PillarCardProps {
  title: string;
  pillar: Pillar;
  lang: Language;
}

const getElementColor = (element: string) => {
  switch (element) {
    case 'Wood': return 'text-green-600';
    case 'Fire': return 'text-red-600';
    case 'Earth': return 'text-amber-700';
    case 'Metal': return 'text-slate-500';
    case 'Water': return 'text-blue-600';
    default: return 'text-gray-700';
  }
};

const getElementBg = (element: string) => {
    switch (element) {
      case 'Wood': return 'bg-green-50 border-green-200';
      case 'Fire': return 'bg-red-50 border-red-200';
      case 'Earth': return 'bg-amber-50 border-amber-200';
      case 'Metal': return 'bg-slate-50 border-slate-200';
      case 'Water': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

export const PillarCard: React.FC<PillarCardProps> = ({ title, pillar, lang }) => {
  const txt = t(lang);
  
  // Cast keys to ensure TS happiness, although simple indexing works with string if loose
  const elementDisplay = txt.elements[pillar.ganElement as keyof typeof txt.elements] || pillar.ganElement;
  const animalDisplay = txt.animals[pillar.zhiAnimal as keyof typeof txt.animals] || pillar.zhiAnimal;
  const zhiElementDisplay = txt.elements[pillar.zhiElement as keyof typeof txt.elements] || pillar.zhiElement;

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border-2 ${getElementBg(pillar.ganElement)} shadow-sm`}>
      <span className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">{title}</span>
      
      {/* Heavenly Stem */}
      <div className="flex flex-col items-center mb-2">
        <span className={`text-4xl font-serif-sc font-bold ${getElementColor(pillar.ganElement)}`}>
          {pillar.gan}
        </span>
        <span className="text-[10px] text-gray-400 uppercase">{elementDisplay}</span>
      </div>

      <div className="w-full h-px bg-gray-300 my-1 opacity-50"></div>

      {/* Earthly Branch */}
      <div className="flex flex-col items-center mt-1">
        <span className={`text-4xl font-serif-sc font-bold ${getElementColor(pillar.zhiElement)}`}>
          {pillar.zhi}
        </span>
        <span className="text-xs text-gray-600 font-medium">{animalDisplay}</span>
      </div>
    </div>
  );
};