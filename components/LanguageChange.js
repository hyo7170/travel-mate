import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../components/LanguageContext';

// 💡 언어 목록을 배열로 관리하면 렌더링과 관리가 훨씬 쉬워집니다.
const LANGUAGE_LIST = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ru', name: 'Русский' },
  { code: 'km', name: 'ភាសាខ្មែរ' },
  { code: 'si', name: 'සිංහල' },
];

const LanguageChange = ({ onLanguageSelected }) => {
  const { setLocale, locale } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(locale);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
          setLocale(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLanguage();
  }, [setLocale]);

  const changeLanguage = async (languageCode, languageName) => {
    console.log(`Changing language to ${languageName}.`);
    setLocale(languageCode);
    setSelectedLanguage(languageCode);
    
    try {
      await AsyncStorage.setItem('language', languageCode);
    } catch (error) {
      console.error('Error storing language:', error);
    }

    // 언어 변경 후 모달 닫기 또는 홈 화면 이동
    if (onLanguageSelected) {
      onLanguageSelected(); 
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 타이틀 영역 */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>언어를 선택해주세요</Text>
        <Text style={styles.subtitle}>Please choose your language</Text>
      </View>

      {/* 언어 선택 리스트 */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {LANGUAGE_LIST.map((lang) => {
            const isSelected = selectedLanguage === lang.code;

            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageCard,
                  isSelected && styles.selectedCard
                ]}
                activeOpacity={0.7}
                onPress={() => changeLanguage(lang.code, lang.name)}
              >
                <Text style={[
                  styles.cardText,
                  isSelected && styles.selectedCardText
                ]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // 깨끗한 흰색 배경
    
    // 🔥 1. 상단 여백을 크게 증가시켜 전체 내용을 아래로 내립니다.
    // 기존 30 -> 100 정도로 대폭 증가
    paddingTop: 100, 
  },
  headerContainer: {
    alignItems: 'center',
    
    // 🔥 2. 제목과 버튼 그리드 사이의 여백도 늘려 답답함을 해소합니다.
    // 기존 30 -> 60으로 증가
    marginBottom: 60, 
  },
  title: {
    fontSize: 24, // 제목 글씨 크기를 조금 더 키워 강조
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10, // 문구 사이 간격
  },
  subtitle: {
    fontSize: 17, // 서브타이틀 크기도 살짝 증가
    color: '#888888',
  },
  scrollContent: {
    paddingHorizontal: 25, // 양옆 여백을 조금 더 넓혀 버튼들을 안쪽으로 모음
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageCard: {
    width: '48%', // 한 줄에 2개씩 배치
    backgroundColor: '#F8F9FA', // 기본 연한 회색 배경
    paddingVertical: 20, // 위아래 패딩을 늘려 버튼을 더 큼직하게
    borderRadius: 15, // 더 둥근 모서리
    marginBottom: 18, // 버튼 간 간격
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    
    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, // 아주 미세한 그림자로 고급스럽게
    shadowRadius: 4,
    // 그림자 (Android)
    elevation: 3, // 약간 더 띄운 느낌
  },
  selectedCard: {
    backgroundColor: '#F0F4FF', // 선택 시 연한 파란색 배경
    borderColor: '#4285F4', // 테두리 강조 (구글 블루 느낌)
  },
  cardText: {
    fontSize: 17, // 글씨 크기 살짝 증가
    color: '#555555',
    fontWeight: '500',
  },
  selectedCardText: {
    color: '#4285F4', // 글씨 색상도 블루로 맞춰서 통일감
    fontWeight: 'bold',
  },
});

export default LanguageChange;