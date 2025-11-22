import React from 'react';
import { BaziResult, Language } from '../types';
import { PillarCard } from './PillarCard';
import { Sparkles, MapPin } from 'lucide-react';
import { t } from '../translations';

interface BaziDisplayProps {
  bazi: BaziResult;
  lang: Language;
}

export const BaziDisplay: React.FC<BaziDisplayProps> = ({ bazi, lang }) => {
  const txt = t(lang);
  const dayMasterElement = txt.elements[bazi.dayPillar.ganElement as keyof typeof txt.elements] || bazi.dayPillar.ganElement;
  const genderDisplay = bazi.gender === 'Male' ? txt.male : txt.female;

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 border border-stone-100">
      <div className="flex items-center justify-between mb-6 border-b pb-4 border-stone-100">
        <div>
            <h2 className="text-2xl font-serif-sc text-stone-800">{txt.chartTitle}</h2>
            <div className="flex items-center gap-3 mt-1">
                <span className="text-stone-500 text-sm flex items-center gap-1">
                    <MapPin size={14} />
                    {bazi.birthPlace}
                </span>
                <span className="text-stone-500 text-sm">{txt.dayMaster}: <span className="font-bold">{bazi.dayMaster}</span> ({dayMasterElement})</span>
            </div>
        </div>
        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles size={14} />
            {genderDisplay}
        </div>
      </div>

      {/* The Four Pillars */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
        <PillarCard title={txt.year} pillar={bazi.yearPillar} lang={lang} />
        <PillarCard title={txt.month} pillar={bazi.monthPillar} lang={lang} />
        <PillarCard title={txt.day} pillar={bazi.dayPillar} lang={lang} />
        <PillarCard title={txt.hour} pillar={bazi.hourPillar} lang={lang} />
      </div>

      {/* Da Yun / Major Cycles */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">{txt.luckCycles}</h3>
        <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
          {bazi.daYun.map((yun, idx) => (
            <div key={idx} className="flex-shrink-0 flex flex-col items-center bg-stone-50 rounded-md p-2 border border-stone-200 min-w-[70px]">
              <span className="text-xs text-stone-400 mb-1">{yun.startAge}-{yun.endAge}</span>
              <span className="text-lg font-serif-sc text-stone-800">{yun.gan}</span>
              <span className="text-lg font-serif-sc text-stone-800">{yun.zhi}</span>
              <span className="text-[10px] text-stone-400 mt-1">{yun.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};