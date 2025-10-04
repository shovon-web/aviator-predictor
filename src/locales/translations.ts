import { Language } from '../types';

type Translation = {
  [key: string]: {
    [lang in Language]: string;
  };
};

export const translations: Translation = {
  // Welcome Modal
  welcomeTitle: { en: 'Welcome to Aviator Predictor', bn: 'এভিয়েটর প্রেডিক্টরে স্বাগতম' },
  welcomeDesc1: { en: 'This tool provides AI-powered analysis of game patterns to help you make informed decisions.', bn: 'এই টুলটি আপনাকে অবগত সিদ্ধান্ত নিতে সাহায্য করার জন্য গেমের প্যাটার্নের AI-চালিত বিশ্লেষণ প্রদান করে।' },
  welcomeDesc2: { en: 'It is intended for informational purposes only and does not guarantee winnings. Play responsibly.', bn: 'এটি শুধুমাত্র তথ্যমূলক উদ্দেশ্যে তৈরি এবং জয়ের নিশ্চয়তা দেয় না। দায়িত্বের সাথে খেলুন।' },
  welcomeDesc3: { en: 'By clicking "Agree & Continue", you acknowledge and accept these terms.', bn: '"সম্মত হন এবং চালিয়ে যান" এ ক্লিক করে, আপনি এই শর্তাবলী স্বীকার এবং গ্রহণ করছেন।' },
  agreeButton: { en: 'Agree & Continue', bn: 'সম্মত হন এবং চালিয়ে যান' },

  // Tabs
  predictionTab: { en: 'Prediction', bn: 'পূর্বাভাস' },
  historyTab: { en: 'History', bn: 'ইতিহাস' },
  settingsTab: { en: 'Settings', bn: 'সেটিংস' },
  aboutTab: { en: 'About', bn: 'সম্পর্কে' },
  
  // Prediction Display
  patternAnalysis: { en: 'Pattern Analysis', bn: 'প্যাটার্ন বিশ্লেষণ' },
  nextPrediction: { en: 'Next Round Prediction', bn: 'পরবর্তী রাউন্ডের পূর্বাভাস' },
  probabilities: { en: 'Probabilities', bn: 'সম্ভাবনা' },
  cashOutTarget: { en: 'Recommended Cash Out', bn: 'প্রস্তাবিত ক্যাশ আউট' },
  investmentAdvice: { en: 'Investment Advice', bn: 'বিনিয়োগ পরামর্শ' },
  confidenceLevel: { en: 'Confidence Level', bn: 'আত্মবিশ্বাসের স্তর' },
  confidenceHigh: { en: 'High', bn: 'উচ্চ' },
  confidenceMedium: { en: 'Medium', bn: 'মাঝারি' },
  confidenceLow: { en: 'Low', bn: 'নিম্ন' },
  
  // History View
  low: { en: 'Low', bn: 'নিম্ন' },
  medium: { en: 'Medium', bn: 'মাঝারি' },
  high: { en: 'High', bn: 'উচ্চ' },
  distribution: { en: 'Category Distribution', bn: 'বিভাগ বন্টন' },
  multiplierTrend: { en: 'Multiplier Trend', bn: 'গুণক প্রবণতা' },
  round: { en: 'Round', bn: 'রাউন্ড' },
  multiplier: { en: 'Multiplier', bn: 'গুণক' },
  multiplierHistory: { en: 'Multiplier History', bn: 'গুণকের ইতিহাস' },
  category: { en: 'Category', bn: 'বিভাগ' },

  // Controls
  startAnalysis: { en: 'Start Live Analysis', bn: 'লাইভ বিশ্লেষণ শুরু করুন' },
  stopAnalysis: { en: 'Stop Analysis', bn: 'বিশ্লেষণ বন্ধ করুন' },
  enterMultiplier: { en: 'Enter multiplier...', bn: 'গুণক প্রবেশ করান...' },
  add: { en: 'Add', bn: 'যোগ করুন' },
  manualEntry: { en: 'Manual', bn: 'ম্যানুয়াল' },
  
  // Settings
  language: { en: 'Language', bn: 'ভাষা' },
  captureArea: { en: 'Capture Area (ROI)', bn: 'ক্যাপচার এলাকা (ROI)' },
  currentArea: { en: 'Current', bn: 'বর্তমান' },
  setCaptureArea: { en: 'Set Capture Area', bn: 'ক্যাপচার এলাকা সেট করুন' },
  resetCaptureArea: { en: 'Reset', bn: 'রিসেট' },
  dragToSelect: { en: 'Click and drag to select the game\'s multiplier history area.', bn: 'গেমের গুণক ইতিহাস এলাকা নির্বাচন করতে ক্লিক করুন এবং টেনে আনুন।' },
  dataManagement: { en: 'Data Management', bn: 'তথ্য ব্যবস্থাপনা' },
  clearHistory: { en: 'Clear All History', bn: 'সমস্ত ইতিহাস পরিষ্কার করুন' },
  clearHistoryConfirm: { en: 'Are you sure you want to clear all multiplier history? This action cannot be undone.', bn: 'আপনি কি নিশ্চিত যে আপনি সমস্ত গুণকের ইতিহাস মুছে ফেলতে চান? এই ক্রিয়াটি ফিরিয়ে আনা যাবে না।' },
  
  // About
  developer: { en: 'Developer', bn: 'ডেভেলপার' },
  telegram: { en: 'Join our Telegram Channel', bn: 'আমাদের টেলিগ্রাম চ্যানেলে যোগ দিন' },
  
  // Trends
  trendIncreasing: { en: 'Trending Up', bn: 'ঊর্ধ্বমুখী' },
  trendDecreasing: { en: 'Trending Down', bn: 'নিম্নমুখী' },
  trendVolatile: { en: 'Volatile', bn: 'অস্থির' },
  trendStable: { en: 'Stable', bn: 'স্থিতিশীল' },
};
