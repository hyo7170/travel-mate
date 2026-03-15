import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  Alert, ScrollView, SafeAreaView 
} from 'react-native';
import LanguageChange from '../components/LanguageChange';
import PrivacyPolicy from '../components/PrivacyPolicy';
import { useLanguage } from '../components/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppSettings = () => {
  const appName = 'Travel Mate';
  const appVersion = '1.0.0';
  const { translate } = useLanguage();

  const [isLanguageChangeOpen, setIsLanguageChangeOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  // 로그인 상태를 관리하는 state (예시용)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // 구글 로그인 처리 함수 (여기에 실제 구글 로그인 로직 연동)
  const handleGoogleLogin = async () => {
    try {
      // API 호출 또는 구글 로그인 라이브러리 실행
      console.log('구글 로그인 시도');
      Alert.alert('알림', '구글 로그인 로직을 연결해 주세요.');
      // 성공 시: setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      translate('캐시 삭제'),
      translate('모든 설정 데이터가 초기화됩니다. 계속하시겠습니까?'),
      [
        { text: translate('취소'), style: 'cancel' },
        { 
          text: translate('삭제'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('성공', '초기화되었습니다.');
            } catch (e) { console.error(e); }
          }
        },
      ]
    );
  };

  // 공통 아이템 컴포넌트
  const SettingItem = ({ label, value, onPress, isButton, isDestructive }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={onPress} 
      disabled={!onPress}
      activeOpacity={0.6}
    >
      <Text style={[styles.itemLabel, isDestructive && styles.destructiveText]}>
        {translate(label)}
      </Text>
      
      <View style={styles.rightContent}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        {isButton && <Text style={styles.arrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 새로 추가된 계정 관리 섹션 */}
        <Text style={styles.sectionTitle}>{translate('계정 관리')}</Text>
        {isLoggedIn ? (
          <View style={styles.card}>
            <SettingItem label="로그아웃" isButton isDestructive onPress={() => setIsLoggedIn(false)} />
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.googleLoginBtn} 
            activeOpacity={0.7} 
            onPress={handleGoogleLogin}
          >
            {/* 구글 로고 아이콘이 있다면 텍스트 좌측에 Image 컴포넌트로 추가하면 좋습니다 */}
            <Text style={styles.googleLoginText}>{translate('Google로 로그인')}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>{translate('일반 설정')}</Text>
        <View style={styles.card}>
          <SettingItem label="앱 이름" value={appName} />
          <View style={styles.divider} />
          <SettingItem label="버전 정보" value={appVersion} />
          <View style={styles.divider} />
          <SettingItem label="문의사항" value="ko_travelmate@naver.com" />
        </View>

        <Text style={styles.sectionTitle}>{translate('사용자 설정')}</Text>
        <View style={styles.card}>
          <SettingItem label="언어 변경" isButton onPress={() => setIsLanguageChangeOpen(true)} />
          <View style={styles.divider} />
          <SettingItem label="개인정보 처리 방침" isButton onPress={() => setIsPrivacyPolicyOpen(true)} />
        </View>

        <Text style={styles.sectionTitle}>{translate('데이터 관리')}</Text>
        <View style={styles.card}>
          <SettingItem label="캐시 삭제" isButton isDestructive onPress={clearCache} />
        </View>

        {/* 언어 변경 모달 */}
        <Modal visible={isLanguageChangeOpen} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <View style={styles.modalContent}>
                <LanguageChange onClose={() => setIsLanguageChangeOpen(false)} />
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsLanguageChangeOpen(false)}>
                <Text style={styles.modalCloseText}>{translate('닫기')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 개인정보 처리 방침 모달 */}
        <Modal visible={isPrivacyPolicyOpen} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <View style={styles.modalContent}>
                <PrivacyPolicy />
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsPrivacyPolicyOpen(false)}>
                <Text style={styles.modalCloseText}>{translate('닫기')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#8A8A8E', 
    marginTop: 28, 
    marginBottom: 8, 
    marginLeft: 12,
    letterSpacing: 0.5 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 14, 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 3,
    elevation: 2 
  },
  
  /* 구글 로그인 버튼 전용 스타일 */
  googleLoginBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 3,
    elevation: 2,
  },
  googleLoginText: {
    fontSize: 16,
    color: '#4285F4', // 구글 블루 컬러
    fontWeight: '600',
  },

  itemContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 16,
    minHeight: 56
  },
  rightContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  itemLabel: { 
    fontSize: 16, 
    color: '#1C1C1E', 
    fontWeight: '400' 
  },
  destructiveText: { 
    color: '#FF3B30', 
    fontWeight: '500' 
  },
  itemValue: { 
    fontSize: 16, 
    color: '#8A8A8E', 
    marginRight: 4 
  },
  arrow: { 
    fontSize: 22, 
    color: '#C7C7CC', 
    lineHeight: 24,
    marginLeft: 4,
    marginTop: -2
  },
  divider: { 
    height: StyleSheet.hairlineWidth, 
    backgroundColor: '#C6C6C8', 
    marginLeft: 16 
  },
  
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.45)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalView: { 
    width: '88%', 
    maxHeight: '80%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center', 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalContent: {
    width: '100%',
    flexShrink: 1,
    marginBottom: 20
  },
  modalCloseBtn: { 
    width: '100%',
    paddingVertical: 14, 
    backgroundColor: '#F2F2F7', 
    borderRadius: 12,
    alignItems: 'center'
  },
  modalCloseText: { 
    color: '#007AFF', 
    fontWeight: '600',
    fontSize: 16
  }
});

export default AppSettings;