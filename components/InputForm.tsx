import React, { useState } from 'react';
import { Gender, Language } from '../types';
import { t } from '../translations';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface InputFormProps {
  onSubmit: (birthPlace: string, date: string, time: string, gender: Gender) => void;
  lang: Language;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, lang }) => {
  const [birthPlace, setBirthPlace] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [gender, setGender] = useState<Gender>(Gender.MALE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthPlace && date && time) {
      onSubmit(birthPlace, date, time, gender);
    }
  };

  const txt = t(lang);

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-stone-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif-sc font-bold text-stone-800 mb-2">{txt.title}</h1>
        <p className="text-stone-500 text-sm">{txt.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">{txt.birthPlace}</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              required
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder={txt.birthPlacePlaceholder}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">{txt.gender}</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setGender(Gender.MALE)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                gender === Gender.MALE 
                  ? 'bg-stone-800 text-white border-stone-800' 
                  : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {txt.male}
            </button>
            <button
              type="button"
              onClick={() => setGender(Gender.FEMALE)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                gender === Gender.FEMALE 
                  ? 'bg-amber-600 text-white border-amber-600' 
                  : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {txt.female}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">{txt.date}</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">{txt.time}</label>
            <div className="relative">
              <Clock size={18} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-4"
        >
          {txt.reveal}
        </button>
      </form>
    </div>
  );
};