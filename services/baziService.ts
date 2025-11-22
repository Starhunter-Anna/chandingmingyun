import { Solar, Lunar } from 'lunar-javascript';
import { BaziResult, Pillar, DaYun, Gender } from '../types';

// Helper to map 5 elements to colors/names
const createPillar = (gan: string, zhi: string, lunar: Lunar): Pillar => {
  // Quick lookup for Zodiac
  const zodiacs: Record<string, string> = {
    '子': 'Rat', '丑': 'Ox', '寅': 'Tiger', '卯': 'Rabbit', 
    '辰': 'Dragon', '巳': 'Snake', '午': 'Horse', '未': 'Goat', 
    '申': 'Monkey', '酉': 'Rooster', '戌': 'Dog', '亥': 'Pig'
  };

  // Quick lookup for Elements (simplified)
  const ganElements: Record<string, string> = {
    '甲': 'Wood', '乙': 'Wood', '丙': 'Fire', '丁': 'Fire',
    '戊': 'Earth', '己': 'Earth', '庚': 'Metal', '辛': 'Metal',
    '壬': 'Water', '癸': 'Water'
  };
  
  const zhiElements: Record<string, string> = {
    '子': 'Water', '亥': 'Water',
    '寅': 'Wood', '卯': 'Wood',
    '巳': 'Fire', '午': 'Fire',
    '申': 'Metal', '酉': 'Metal',
    '辰': 'Earth', '戌': 'Earth', '丑': 'Earth', '未': 'Earth'
  };

  return {
    gan,
    zhi,
    ganElement: ganElements[gan] || 'Unknown',
    zhiElement: zhiElements[zhi] || 'Unknown',
    zhiAnimal: zodiacs[zhi] || ''
  };
};

export const calculateBazi = (dateStr: string, timeStr: string, gender: Gender, birthPlace: string): BaziResult => {
  try {
      const dateParts = dateStr.split('-').map(Number);
      const timeParts = timeStr.split(':').map(Number);
      
      if (dateParts.length !== 3 || timeParts.length !== 2) {
          throw new Error("Invalid Date or Time Format");
      }

      // Create Solar date
      const solar = Solar.fromYmdHms(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1], 0);
      const lunar = solar.getLunar();
      const baZi = lunar.getEightChar();

      // Pillars
      const yearPillar = createPillar(baZi.getYearGan(), baZi.getYearZhi(), lunar);
      const monthPillar = createPillar(baZi.getMonthGan(), baZi.getMonthZhi(), lunar);
      const dayPillar = createPillar(baZi.getDayGan(), baZi.getDayZhi(), lunar);
      const hourPillar = createPillar(baZi.getTimeGan(), baZi.getTimeZhi(), lunar);

      // Da Yun (Major Cycles)
      // Calculate Da Yun based on gender and Year Stem polarity (Yang/Yin)
      const yun = baZi.getYun(gender === Gender.MALE ? 1 : 0);
      const daYunArr = yun.getDaYun();
      
      const daYunList: DaYun[] = [];
      // Take first 8 major cycles usually covers a lifetime
      // Safety: Check if daYunArr exists and has elements
      if (daYunArr && daYunArr.length > 0) {
          // Iterate safely, respecting array bounds
          for (let i = 1; i < daYunArr.length && i <= 8; i++) {
            const dy = daYunArr[i]; 
            if(dy) {
                let gan = '';
                let zhi = '';

                // Use getGanZhi() which is safer and standard in the library
                // It returns string like '甲子'
                try {
                    const ganZhi = dy.getGanZhi();
                    if (ganZhi && ganZhi.length >= 1) {
                        gan = ganZhi.charAt(0);
                        zhi = ganZhi.length >= 2 ? ganZhi.charAt(1) : '';
                    }
                } catch (err) {
                    console.warn("Error getting GanZhi for cycle", i, err);
                }

                if (gan && zhi) {
                    daYunList.push({
                        startAge: dy.getStartAge(),
                        endAge: dy.getEndAge(),
                        year: dy.getStartYear(),
                        gan: gan,
                        zhi: zhi
                    });
                }
            }
          }
      }

      return {
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
        dayMaster: dayPillar.gan,
        daYun: daYunList,
        gender,
        birthDate: dateStr + 'T' + timeStr,
        birthPlace
      };
  } catch (e) {
      console.error("BaZi Calculation Error", e);
      throw e;
  }
};