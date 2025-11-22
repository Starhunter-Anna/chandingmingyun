export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export type Language = 'en' | 'zh';

export interface Pillar {
  gan: string; // Heavenly Stem (e.g., Jia)
  zhi: string; // Earthly Branch (e.g., Zi)
  ganElement: string; // e.g., Wood
  zhiElement: string; // e.g., Water
  zhiAnimal: string; // e.g., Rat
}

export interface DaYun {
  startAge: number;
  endAge: number;
  year: number;
  gan: string;
  zhi: string;
}

export interface BaziResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: string; // The Day Gan (Self element)
  daYun: DaYun[];
  gender: Gender;
  birthDate: string; // ISO string
  birthPlace: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface SavedProfile {
  id: string;
  birthPlace: string;
  birthDate: string; // ISO
  gender: Gender;
  birthTime: string; // Store time for accurate reloading
}

export interface DailyFortuneResponse {
  score: number; // 0-100
  summary: string; // Short sentence
  analysis: string; // Detailed paragraph
  advice: string;
  luckyColor: string;
  luckyDirection: string;
}