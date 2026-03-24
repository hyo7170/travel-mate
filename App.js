import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 컴포넌트 및 화면 임포트
import { LanguageProvider } from './components/LanguageContext';
import LanguageSelection from './components/LanguageChange';
import MainNavigator from './components/MainNavigator';
import LoginScreen from './components/LoginScreen';
import SettingsScreen from './screens/Settings'; 
import WritePostScreen from './screens/WritePostScreen';
import NicknameScreen from './screens/NicknameScreen'; // 🔥 닉네임 스크린 임포트 추가!
import NotificationsScreen from './screens/NotificationsScreen'; // 🔥 1. 알림 스크린 임포트 추가! (파일 경로 확인 필요)

const Stack = createNativeStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        const loginState = await AsyncStorage.getItem('isLoggedIn');
        
        setIsFirstLaunch(firstLaunch === null);
        setIsLoggedIn(loginState === 'true');
      } catch (error) {
        console.error("초기 설정 로드 실패:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 1500);
      }
    };
    initApp();
  }, []);

  // 1. 언어 선택 완료 시
  const handleLanguageSelected = async () => {
    try {
      await AsyncStorage.setItem('isFirstLaunch', 'false');
      setIsFirstLaunch(false); 
    } catch (e) {
      console.error(e);
    }
  };

  // 2. 로그인 완료 시 (게스트 로그인 or 닉네임 설정 완료 시 호출)
  const handleLoginComplete = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true); 
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          {/* 🔥 조건에 따라 Stack 화면들을 다르게 렌더링합니다 */}
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            {isFirstLaunch ? (
              // 1순위: 앱 첫 실행 시 언어 선택
              <Stack.Screen name="Language">
                {(props) => <LanguageSelection {...props} onLanguageSelected={handleLanguageSelected} />}
              </Stack.Screen>

            ) : !isLoggedIn ? (
              // 2순위: 로그인이 안 된 상태 (Auth 플로우)
              <>
                <Stack.Screen name="Login">
                  {/* onGuest로 handleLoginComplete를 넘겨 바로 메인으로 가게 함 */}
                  {(props) => <LoginScreen {...props} onGuest={handleLoginComplete} />}
                </Stack.Screen>
                <Stack.Screen 
                  name="Nickname" 
                  options={{ headerShown: true, title: '프로필 설정' }}
                >
                  {/* 닉네임 설정 완료 시 handleLoginComplete 실행하여 메인으로 이동 */}
                  {(props) => <NicknameScreen {...props} onComplete={handleLoginComplete} />}
                </Stack.Screen>
              </>

            ) : (
              // 3순위: 로그인 완료 후 (Main 플로우)
              <>
                <Stack.Screen name="MainTabs" component={MainNavigator} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: '설정' }} />
                <Stack.Screen name="WritePostScreen" component={WritePostScreen} />

                 <Stack.Screen 
                            name="Notifications" 
                            component={NotificationsScreen} 
                            options={{ headerShown: true, title: '알림' }} 
                          />
                        </>
              
            )}

          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
};

export default App;