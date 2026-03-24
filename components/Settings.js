import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  Alert, ScrollView, SafeAreaView, Platform 
} from 'react-native';
import LanguageChange from '../components/LanguageChange';
import PrivacyPolicy from '../components/PrivacyPolicy';
import { useLanguage } from '../components/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppSettings = ({ navigation }) => {
  const appName = 'Travel Mate';
  const appVersion = '1.0.0';
  const { translate } = useLanguage();

  const [isLanguageChangeOpen, setIsLanguageChangeOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  
  // 💡 테스트를 위해 로그인된 상태의 가상 데이터를 기본값으로 넣었습니다.
  const [userProfile, setUserProfile] = useState({
    nickname: '민효',
    joinDate: '2026.03.17',
    lastNicknameChange: '2026.03.17' // 최근 닉네임 변경일
  }); 

  // 구글 로그인 (게스트 상태일 때)
  const handleGoogleLogin = () => {
    navigation.navigate('Nickname', { fromSettings: true });
  };

  // 닉네임 변경 버튼 클릭 시 (1달 제한 로직 포함)
  const handleChangeNickname = () => {
    const lastChange = new Date(userProfile.lastNicknameChange);
    const today = new Date();
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    if (lastChange > oneMonthAgo) {
      if (Platform.OS === 'web') {
        window.alert(translate('닉네임은 1달에 한 번만 변경할 수 있습니다.'));
      } else {
        Alert.alert(
          translate('안내'), 
          translate('닉네임은 1달에 한 번만 변경할 수 있습니다.')
        );
      }
      return;
    }

    navigation.navigate('Nickname', { 
      currentNickname: userProfile.nickname,
      isEditMode: true 
    });
  };

  // 내 작성글 보기 이동
  const handleViewMyPosts = () => {
    console.log('내 작성글 보기로 이동');
    // navigation.navigate('MyPostsScreen');
  };

  // 로그아웃
  const handleLogout = () => {
    const logoutAction = () => setUserProfile(null);

    if (Platform.OS === 'web') {
      if (window.confirm(translate('정말 로그아웃 하시겠습니까?'))) logoutAction();
      return;
    }

    Alert.alert(
      translate('로그아웃'),
      translate('정말 로그아웃 하시겠습니까?'),
      [
        { text: translate('취소'), style: 'cancel' },
        { text: translate('로그아웃'), style: 'destructive', onPress: logoutAction },
      ]
    );
  };

  // 캐시 삭제
  const clearCache = async () => {
    const clearAction = async () => {
      try {
        await AsyncStorage.clear();
        Platform.OS === 'web' ? window.alert(translate('초기화되었습니다.')) : Alert.alert('성공', '초기화되었습니다.');
      } catch (e) { console.error(e); }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(translate('모든 설정 데이터가 초기화됩니다. 계속하시겠습니까?'))) clearAction();
      return;
    }

    Alert.alert(
      translate('캐시 삭제'),
      translate('모든 설정 데이터가 초기화됩니다. 계속하시겠습니까?'),
      [
        { text: translate('취소'), style: 'cancel' },
        { text: translate('삭제'), style: 'destructive', onPress: clearAction },
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
      <Text style={[styles.itemLabel, isDestructive && styles.destructiveText]}>{translate(label)}</Text>
      <View style={styles.rightContent}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        {isButton && <Text style={styles.arrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔥 모달을 제외한 메인 콘텐츠만 ScrollView 안에 둡니다. */}
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 프로필 섹션 */}
        {userProfile ? (
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>{userProfile.nickname.charAt(0)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{userProfile.nickname}</Text>
                <TouchableOpacity style={styles.editBtn} onPress={handleChangeNickname}>
                  <Text style={styles.editBtnText}>{translate('변경')}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.profileDate}>{translate('가입일')}: {userProfile.joinDate}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.guestSection}>
            <Text style={styles.guestMessage}>{translate('로그인하고 더 많은 기능을 즐겨보세요!')}</Text>
            <TouchableOpacity style={styles.googleLoginBtn} activeOpacity={0.7} onPress={handleGoogleLogin}>
              <Text style={styles.googleLoginText}>{translate('Google로 로그인')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 내 활동 섹션 */}
        {userProfile && (
          <>
            <Text style={styles.sectionTitle}>{translate('내 활동')}</Text>
            <View style={styles.card}>
              <SettingItem label="내 작성글 보기" isButton onPress={handleViewMyPosts} />
            </View>
          </>
        )}

        {/* 계정 관리 섹션 */}
        {userProfile && (
          <>
            <Text style={styles.sectionTitle}>{translate('계정 관리')}</Text>
            <View style={styles.card}>
              <SettingItem label="로그아웃" isButton isDestructive onPress={handleLogout} />
            </View>
          </>
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

      </ScrollView> 
      {/* 🛑 ScrollView 종료 */}


      {/* 🔥 모달 영역: ScrollView 바깥으로 이동 */}
      <Modal visible={isLanguageChangeOpen} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {/* 💡 팝업 안에서 언어선택 UI가 잘리지 않도록 높이(height)를 강제 지정했습니다. */}
            <View style={[styles.modalContent, { height: 450, overflow: 'hidden' }]}>
              {/* onLanguageSelected 속성으로 닫기 함수를 전달합니다. */}
              <LanguageChange onLanguageSelected={() => setIsLanguageChangeOpen(false)} />
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsLanguageChangeOpen(false)}>
              <Text style={styles.modalCloseText}>{translate('닫기')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 20 },
  
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4,
    elevation: 3
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A8A8E'
  },
  profileInfo: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  profileName: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginRight: 8 },
  editBtn: { backgroundColor: '#F2F2F7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  editBtnText: { fontSize: 12, color: '#007AFF', fontWeight: '600' },
  profileDate: { fontSize: 13, color: '#8A8A8E' },

  guestSection: { marginTop: 10, marginBottom: 10, alignItems: 'center' },
  guestMessage: { fontSize: 14, color: '#8A8A8E', marginBottom: 12 },
  googleLoginBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 16, width: '100%',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
  },
  googleLoginText: { fontSize: 16, color: '#4285F4', fontWeight: '600' },

  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#8A8A8E', marginTop: 28, marginBottom: 8, marginLeft: 12, letterSpacing: 0.5 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, minHeight: 56 },
  rightContent: { flexDirection: 'row', alignItems: 'center' },
  itemLabel: { fontSize: 16, color: '#1C1C1E', fontWeight: '400' },
  destructiveText: { color: '#FF3B30', fontWeight: '500' },
  itemValue: { fontSize: 16, color: '#8A8A8E', marginRight: 4 },
  arrow: { fontSize: 22, color: '#C7C7CC', lineHeight: 24, marginLeft: 4, marginTop: -2 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#C6C6C8', marginLeft: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '88%', maxHeight: '80%', backgroundColor: '#FFFFFF', borderRadius: 20, paddingTop: 24, paddingBottom: 16, paddingHorizontal: 20, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  modalContent: { width: '100%', flexShrink: 1, marginBottom: 20 },
  modalCloseBtn: { width: '100%', paddingVertical: 14, backgroundColor: '#F2F2F7', borderRadius: 12, alignItems: 'center' },
  modalCloseText: { color: '#007AFF', fontWeight: '600', fontSize: 16 }
});

export default AppSettings;