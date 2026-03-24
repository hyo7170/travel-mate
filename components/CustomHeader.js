import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 추가
import LanguageChange from './LanguageChange'; // 기존 언어 변경 컴포넌트 임포트

const CustomHeader = ({ onPressLogo, unreadCount = 3 }) => {
  const navigation = useNavigation(); // 설정 스크린 이동을 위해 추가

  // 더보기 메뉴(드롭다운) 상태
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  // 언어 변경 모달 상태
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const openMoreMenu = () => setMoreMenuVisible(true);
  const closeMoreMenu = () => setMoreMenuVisible(false);

  // 1. 언어 변경 클릭 시 동작
  const handleLanguageSelect = () => {
    closeMoreMenu(); // 드롭다운 닫기
    setLanguageModalVisible(true); // 언어 모달 열기
  };

  // 언어 선택이 완료되었을 때 실행될 함수
  const onLanguageSelected = () => {
    setLanguageModalVisible(false); // 모달 닫기
    // 언어 변경 후 필요한 데이터 리패칭 등의 로직 추가 가능
  };

  // 2. 설정 클릭 시 동작
  const handleSettingsSelect = () => {
    closeMoreMenu(); // 드롭다운 닫기
    // 설정 스크린으로 이동 (App.js나 Router에 'Settings' 스크린이 정의되어 있어야 함)
    navigation.navigate('Settings'); 
  };

  return (
    <View style={styles.headerContainer}>
      {/* 1. 좌측: TRAVEL MATE 로고 */}
      <TouchableOpacity onPress={onPressLogo} style={styles.logoContainer}>
        <Image source={require('../assets/Head_Logo.png')} style={styles.logo} />
      </TouchableOpacity>

      {/* 2. 우측: 알림 아이콘 & 더보기 아이콘 */}
      <View style={styles.rightIconsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={26} color="black" />
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={openMoreMenu}>
          <Ionicons name="ellipsis-vertical" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* 3. 더보기 드롭다운 메뉴 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={moreMenuVisible}
        onRequestClose={closeMoreMenu}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeMoreMenu}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLanguageSelect}>
              <Ionicons name="globe-outline" size={20} color="#333" />
              <Text style={styles.menuText}>언어 변경</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleSettingsSelect}>
              <Ionicons name="settings-outline" size={20} color="#333" />
              <Text style={styles.menuText}>설정</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 4. 언어 변경 모달 (기존 코드 통합) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.langModalBackground}>
          <View style={styles.langModalContainer}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            
            <LanguageChange onLanguageSelected={onLanguageSelected} />
            
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  // ... 기존 헤더 스타일들 (headerContainer, logo, iconButton 등은 위 답변과 동일하게 유지)
  headerContainer: { backgroundColor: 'white', height: 55, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  logoContainer: { justifyContent: 'center' },
  logo: { width: 150, height: 40, resizeMode: 'contain' },
  rightIconsContainer: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 15, position: 'relative' },
  badgeContainer: { position: 'absolute', right: -6, top: -4, backgroundColor: '#FF3B30', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1.5, borderColor: 'white' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  dropdownMenu: { position: 'absolute', top: 50, right: 15, backgroundColor: 'white', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, width: 140, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 5 },
  menuText: { fontSize: 15, color: '#333', marginLeft: 10 },
  divider: { height: 1, backgroundColor: '#EBEBEB', marginVertical: 2 },

  // --- 언어 변경 모달 스타일 (기존 사용자 코드 바탕) ---
  langModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  langModalContainer: {
    width: '90%',
    height: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold', // 닫기 버튼 강조
  },
});

export default CustomHeader;