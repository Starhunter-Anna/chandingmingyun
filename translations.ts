import { Language } from './types';

export const translations = {
  en: {
    title: "ZenDestiny",
    subtitle: "Discover your BaZi Chart",
    birthPlace: "Birth Place",
    birthPlacePlaceholder: "City, Country (e.g. Beijing)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    date: "Date",
    time: "Time",
    reveal: "Reveal Destiny",
    chartTitle: "Destiny Chart",
    dayMaster: "Day Master",
    year: "Year",
    month: "Month",
    day: "Day",
    hour: "Hour",
    luckCycles: "10-Year Luck Cycles (Da Yun)",
    dailyTitle: "Daily Fortune",
    dailyLoading: "Consulting the stars...",
    dailyError: "The mists of time obscure today's reading.",
    dailyScore: "Fortune Score",
    readMore: "Tap to view full analysis",
    luckyColor: "Lucky Color",
    luckyDirection: "Direction",
    advice: "Daily Advice",
    chatTitle: "AI Consultant",
    chatPlaceholder: "Ask about your destiny...",
    chatLoading: "Divining...",
    newReading: "New Reading",
    savedProfiles: "History",
    delete: "Delete",
    close: "Close",
    loadError: "Could not load this profile.",
    calcError: "Failed to calculate chart. Please check inputs.",
    suggestions: ["When will my career breakthrough be?", "What is my love luck this year?", "Which elements are favorable for me?"],
    elements: { 
        'Wood': 'Wood', 'Fire': 'Fire', 'Earth': 'Earth', 'Metal': 'Metal', 'Water': 'Water', 'Unknown': 'Unknown' 
    },
    animals: { 
        'Rat': 'Rat', 'Ox': 'Ox', 'Tiger': 'Tiger', 'Rabbit': 'Rabbit', 'Dragon': 'Dragon', 
        'Snake': 'Snake', 'Horse': 'Horse', 'Goat': 'Goat', 'Monkey': 'Monkey', 'Rooster': 'Rooster', 
        'Dog': 'Dog', 'Pig': 'Pig', '': ''
    }
  },
  zh: {
    title: "禅定命运",
    subtitle: "探索您的八字命盘",
    birthPlace: "出生地点",
    birthPlacePlaceholder: "城市, 国家 (如: 北京)",
    gender: "性别",
    male: "男",
    female: "女",
    date: "出生日期",
    time: "出生时间",
    reveal: "揭示命运",
    chartTitle: "八字命盘",
    dayMaster: "日主",
    year: "年柱",
    month: "月柱",
    day: "日柱",
    hour: "时柱",
    luckCycles: "大运 (十年运程)",
    dailyTitle: "今日运势",
    dailyLoading: "正在观测星象...",
    dailyError: "今日天机不可泄露，请稍后再试。",
    dailyScore: "今日得分",
    readMore: "点击查看详细分析",
    luckyColor: "幸运色",
    luckyDirection: "吉利方位",
    advice: "今日建议",
    chatTitle: "命理咨询",
    chatPlaceholder: "询问关于您的事业、财运、姻缘...",
    chatLoading: "推算中...",
    newReading: "重新测算",
    savedProfiles: "历史档案",
    delete: "删除",
    close: "关闭",
    loadError: "无法加载此档案。",
    calcError: "排盘失败，请检查日期和时间。",
    suggestions: ["我什么时候会有事业突破？", "今年的桃花运如何？", "我的喜用神是什么？"],
    elements: { 
        'Wood': '木', 'Fire': '火', 'Earth': '土', 'Metal': '金', 'Water': '水', 'Unknown': '未知' 
    },
    animals: { 
        'Rat': '鼠', 'Ox': '牛', 'Tiger': '虎', 'Rabbit': '兔', 'Dragon': '龙', 
        'Snake': '蛇', 'Horse': '马', 'Goat': '羊', 'Monkey': '猴', 'Rooster': '鸡', 
        'Dog': '狗', 'Pig': '猪', '': ''
    }
  }
};

export const t = (lang: Language) => translations[lang];