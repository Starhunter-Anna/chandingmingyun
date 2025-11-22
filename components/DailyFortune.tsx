import React, { useEffect, useState } from 'react';
import { BaziResult, Language, DailyFortuneResponse } from '../types';
import { getDailyFortune } from '../services/geminiService';
import { Sun, RefreshCw, X, Compass, Palette, Sparkles } from 'lucide-react';
import { t } from '../translations';

interface DailyFortuneProps {
  bazi: BaziResult;
  lang: Language;
}

export const DailyFortune: React.FC<DailyFortuneProps> = ({ bazi, lang }) => {
  const [fortune, setFortune] = useState<DailyFortuneResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const txt = t(lang);

  // Check local storage for today's cache to save API calls
  const getCachedFortune = (): DailyFortuneResponse | null => {
    const today = new Date().toISOString().split('T')[0];
    const id = `${bazi.birthPlace}_${bazi.birthDate}_${bazi.gender}_${lang}`;
    const key = `fortune_json_${id}_${today}`;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  };

  const saveCachedFortune = (data: DailyFortuneResponse) => {
    const today = new Date().toISOString().split('T')[0];
    const id = `${bazi.birthPlace}_${bazi.birthDate}_${bazi.gender}_${lang}`;
    const key = `fortune_json_${id}_${today}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const fetchFortune = async () => {
    setLoading(true);
    const result = await getDailyFortune(bazi, lang);
    if (result) {
        setFortune(result);
        saveCachedFortune(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    const cached = getCachedFortune();
    if (cached) {
      setFortune(cached);
    } else {
      fetchFortune();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bazi, lang]);

  // Compact Card View
  return (
    <>
        {/* Compact Banner Card */}
        <div 
            onClick={() => fortune && setIsModalOpen(true)}
            className="cursor-pointer w-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg p-4 flex items-center justify-between text-white relative overflow-hidden hover:shadow-xl transition-shadow"
        >
            {/* Background Decoration */}
            <div className="absolute -left-4 -bottom-8 opacity-20">
                <Sun size={100} />
            </div>

            {loading ? (
                <div className="flex items-center gap-3 animate-pulse w-full">
                    <div className="h-10 w-10 bg-white/30 rounded-full"></div>
                    <div className="h-4 bg-white/30 rounded w-1/2"></div>
                </div>
            ) : fortune ? (
                <div className="flex items-center gap-4 w-full relative z-10">
                    {/* Score Circle */}
                    <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-sm w-14 h-14 rounded-full border-2 border-white/40 flex-shrink-0">
                        <span className="text-xl font-bold font-serif-sc">{fortune.score}</span>
                        <span className="text-[8px] uppercase">{txt.dailyScore}</span>
                    </div>
                    
                    {/* Summary Text */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-serif-sc font-bold text-lg truncate">{txt.dailyTitle}</h3>
                        <p className="text-amber-50 text-sm truncate opacity-90">{fortune.summary}</p>
                        <p className="text-[10px] mt-1 uppercase tracking-wider text-white/70">{txt.readMore}</p>
                    </div>

                    <Sparkles className="text-yellow-200 animate-pulse" />
                </div>
            ) : (
                <div className="flex justify-between w-full items-center">
                     <span>{txt.dailyError}</span>
                     <button onClick={(e) => { e.stopPropagation(); fetchFortune(); }}>
                        <RefreshCw size={18} />
                     </button>
                </div>
            )}
        </div>

        {/* Detailed Modal */}
        {isModalOpen && fortune && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#fdfbf7] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col relative animate-slide-up">
                    
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative">
                         <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-1 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                         >
                             <X size={20} />
                         </button>
                         
                         <div className="flex items-center gap-4 mt-2">
                             <div className="w-20 h-20 rounded-full bg-white text-amber-600 flex items-center justify-center text-3xl font-bold font-serif-sc shadow-inner border-4 border-amber-300/50">
                                 {fortune.score}
                             </div>
                             <div>
                                 <div className="text-xs uppercase tracking-widest opacity-80">{txt.dailyTitle}</div>
                                 <h2 className="text-2xl font-serif-sc font-bold leading-tight">{fortune.summary}</h2>
                             </div>
                         </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto space-y-6">
                        {/* Lucky Indicators */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-white p-3 rounded-lg border border-stone-200 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                    <Palette size={16} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-stone-400 uppercase font-bold">{txt.luckyColor}</div>
                                    <div className="text-sm font-bold text-stone-800">{fortune.luckyColor}</div>
                                </div>
                            </div>
                            <div className="flex-1 bg-white p-3 rounded-lg border border-stone-200 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Compass size={16} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-stone-400 uppercase font-bold">{txt.luckyDirection}</div>
                                    <div className="text-sm font-bold text-stone-800">{fortune.luckyDirection}</div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div>
                            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wide mb-2 border-l-4 border-amber-500 pl-2">
                                运势详解
                            </h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                {fortune.analysis}
                            </p>
                        </div>

                        {/* Advice */}
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                             <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-1 flex items-center gap-2">
                                <Sparkles size={14} />
                                {txt.advice}
                             </h3>
                             <p className="text-amber-900/80 text-sm italic">
                                "{fortune.advice}"
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};