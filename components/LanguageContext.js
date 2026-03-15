import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../Language/en.json';
import ko from '../Language/ko.json';
import ja from '../Language/ja.json';
import zh from '../Language/zh.json';
import si from '../Language/si.json';
import km from '../Language/km.json';
import vi from '../Language/vi.json';
import ru from '../Language/ru.json';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 불러오기

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('ko'); // 기본 언어를 한국어로 설정

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedLanguage) {
          setLocale(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, []);

  const translate = (key) => {
    return translations[locale] && translations[locale][key]
      ? translations[locale][key]
      : key;
  };

  const translations = {
    en,
    ko,
    ja,
    zh,
    si,
    km,
    vi,
    ru
  };

  return (
    <LanguageContext.Provider value={{ translate, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};
