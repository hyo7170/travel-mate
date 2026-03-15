import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../components/LanguageContext';

const LanguageChange = ({ onLanguageSelected }) => {
  const { setLocale, locale } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(locale);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 저장된 언어를 가져와 설정
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
          setLocale(storedLanguage); // storedLanguage가 존재할 때 locale도 업데이트
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, [setLocale]);

  const changeLanguage = async (language) => {
    console.log(`Changing language to ${getLanguageName(language)}.`);
    setLocale(language);
    setSelectedLanguage(language);
    await storeLanguage(language);
    onLanguageSelected(); // 언어 변경 후 onLanguageSelected 함수를 호출하여 홈 화면으로 이동합니다.
  };

  const getLanguageName = (language) => {
    switch (language) {
      case 'en': return 'English';
      case 'ko': return '한국어';
      case 'ja': return '日本語';
      case 'zh': return '中文';
      case 'si': return 'සිංහල'; // 싱할라어
      case 'km': return 'ភាសាខ្មែរ'; // 크메르어
      case 'vi': return 'Tiếng Việt'; // 베트남어
      case 'ru': return 'Русский'; // 러시아어
      default: return 'Unknown';
    }
  };

  const storeLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('language', language);
    } catch (error) {
      console.error('Error storing language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>언어를 선택해주세요.</Text>
      <Text style={styles.headerText}>Please choose your language.</Text>
      <ScrollView contentContainerStyle={styles.languageContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, selectedLanguage === 'en' && styles.selectedButton]}
            onPress={() => changeLanguage('en')}
          >
            <Text style={styles.buttonText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedLanguage === 'ko' && styles.selectedButton]}
            onPress={() => changeLanguage('ko')}
          >
            <Text style={styles.buttonText}>한국어</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, selectedLanguage === 'ja' && styles.selectedButton]}
            onPress={() => changeLanguage('ja')}
          >
            <Text style={styles.buttonText}>日本語</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedLanguage === 'zh' && styles.selectedButton]}
            onPress={() => changeLanguage('zh')}
          >
            <Text style={styles.buttonText}>中文</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, selectedLanguage === 'si' && styles.selectedButton]}
            onPress={() => changeLanguage('si')}
          >
            <Text style={styles.buttonText}>සිංහල</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedLanguage === 'km' && styles.selectedButton]}
            onPress={() => changeLanguage('km')}
          >
            <Text style={styles.buttonText}>ភាសាខ្មែរ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, selectedLanguage === 'vi' && styles.selectedButton]}
            onPress={() => changeLanguage('vi')}
          >
            <Text style={styles.buttonText}>Tiếng Việt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedLanguage === 'ru' && styles.selectedButton]}
            onPress={() => changeLanguage('ru')}
          >
            <Text style={styles.buttonText}>Русский</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 10, // 문구 간격 조정
    textAlign: 'center',
  },
  languageContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 10, // 양쪽 여백 조정
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10, // 각 행 간격 조정
  },
  button: {
    backgroundColor: '#cccccc', // 기본 버튼 색상 회색
    paddingHorizontal: 15, // 가로 여백 조정
    paddingVertical: 10,
    marginHorizontal: 5, // 버튼 간 간격 조정
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#28a745', // 선택된 버튼 색상 초록색
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LanguageChange;
