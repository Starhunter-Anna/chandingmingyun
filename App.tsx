import React, { useState, useEffect } from 'react';
import { calculateBazi } from './services/baziService';
import { BaziResult, Gender, SavedProfile, Language } from './types';
import { InputForm } from './components/InputForm';
import { BaziDisplay } from './components/BaziDisplay';
import { ChatInterface } from './components/ChatInterface';
import { DailyFortune } from './components/DailyFortune';
import { History, Trash2, LogOut, Globe, MessageCircle } from 'lucide-react';
import { t } from './translations';

export default function App() {
  const [currentBazi, setCurrentBazi] = useState<BaziResult | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [view, setView] = useState<'form' | 'result'>('form');
  const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load profiles on mount
  useEffect(() => {
    const saved = localStorage.getItem('zen_destiny_profiles');
    if (saved) {
      setSavedProfiles(JSON.parse(saved));
    }
  }, []);

  const handleFormSubmit = (birthPlace: string, date: string, time: string, gender: Gender) => {
    try {
        const bazi = calculateBazi(date, time, gender, birthPlace);
        setCurrentBazi(bazi);
        setView('result');

        // Save to history if not exists
        const newProfile: SavedProfile = {
            id: Date.now().toString(),
            birthPlace,
            birthDate: date,
            gender,
            birthTime: time
        };
        
        // Check duplicates roughly by place and date
        const exists = savedProfiles.find(p => p.birthPlace === birthPlace && p.birthDate === date && p.gender === gender);
        if (!exists) {
            const updated = [...savedProfiles, newProfile];
            setSavedProfiles(updated);
            localStorage.setItem('zen_destiny_profiles', JSON.stringify(updated));
        }
    } catch (error) {
        alert(t(language).calcError);
    }
  };

  const loadProfile = (profile: SavedProfile) => {
    // Use stored time or default to 12:00 if old profile format
    const time = profile.birthTime || "12:00";
    try {
        const bazi = calculateBazi(profile.birthDate, time, profile.gender, profile.birthPlace || "Unknown");
        setCurrentBazi(bazi);
        setView('result');
    } catch (e) {
        alert(t(language).loadError);
    }
  };

  const deleteProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedProfiles.filter(p => p.id !== id);
    setSavedProfiles(updated);
    localStorage.setItem('zen_destiny_profiles', JSON.stringify(updated));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const txt = t(language);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-stone-900 text-amber-50 p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('form')}>
            <span className="text-2xl">☯</span>
            <h1 className="text-xl font-serif-sc font-bold tracking-wide">{txt.title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                onClick={toggleLanguage}
                className="text-sm bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-2 border border-stone-700 transition-colors"
              >
                  <Globe size={14} />
                  {language === 'en' ? '中文' : 'English'}
              </button>

              {view === 'result' && (
                <button 
                    onClick={() => setView('form')}
                    className="text-sm bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-2 border border-stone-700 transition-colors"
                >
                    <LogOut size={14} />
                    {txt.newReading}
                </button>
              )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        
        {view === 'form' ? (
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center mt-8">
            <div className="w-full md:w-auto flex-shrink-0">
                 <InputForm onSubmit={handleFormSubmit} lang={language} />
            </div>
            
            {savedProfiles.length > 0 && (
                <div className="w-full md:w-80 bg-white rounded-xl shadow-sm border border-stone-100 p-6">
                    <h2 className="text-lg font-serif-sc font-bold mb-4 flex items-center gap-2 text-stone-700">
                        <History size={18} />
                        {txt.savedProfiles}
                    </h2>
                    <div className="space-y-3">
                        {savedProfiles.map(p => (
                            <div 
                                key={p.id}
                                onClick={() => loadProfile(p)} 
                                className="group flex justify-between items-center p-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer transition-all"
                            >
                                <div>
                                    <div className="font-bold text-stone-800">{p.birthPlace || "Unknown Place"}</div>
                                    <div className="text-xs text-stone-500">{p.birthDate} • {p.gender === Gender.MALE ? txt.male : txt.female}</div>
                                </div>
                                <button 
                                    onClick={(e) => deleteProfile(e, p.id)}
                                    className="text-stone-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title={txt.delete}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in-up relative">
             {currentBazi && (
                 <div className="flex flex-col gap-4">
                    {/* Stacked Layout */}
                    <DailyFortune bazi={currentBazi} lang={language} />
                    <BaziDisplay bazi={currentBazi} lang={language} />

                    {/* Chat Overlay */}
                    {isChatOpen && (
                        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-auto z-50 flex flex-col items-end">
                             <ChatInterface 
                                bazi={currentBazi} 
                                lang={language} 
                                onClose={() => setIsChatOpen(false)} 
                             />
                        </div>
                    )}

                    {/* Floating Action Button for Chat */}
                    <button 
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 ${
                            isChatOpen ? 'bg-stone-800 rotate-90' : 'bg-amber-600 hover:bg-amber-500'
                        } text-white`}
                    >
                        {isChatOpen ? <MessageCircle size={28} className="opacity-50"/> : <MessageCircle size={28} />}
                    </button>
                 </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
}