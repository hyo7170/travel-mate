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

const Stack = createNativeStackNavigator();

// 로그인 완료 후의 메인 스택 레이아웃
const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: '설정' }} 
      />
      <Stack.Screen 
        name="WritePostScreen" 
        component={WritePostScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        const loginState = await AsyncStorage.getItem('isLoggedIn');
        
        // 처음 실행 여부 판단 (값이 없으면 true)
        setIsFirstLaunch(firstLaunch === null);
        // 로그인 상태 판단
        setIsLoggedIn(loginState === 'true');
      } catch (error) {
        console.error("초기 설정 로드 실패:", error);
      } finally {
        // 로딩 화면을 약간 보여주어 부드러운 전환 유도
        setTimeout(() => setIsLoading(false), 1500);
      }
    };
    initApp();
  }, []);

  // 1. 언어 선택 완료 시 호출 (첫 방문 -> 로그인 화면으로)
  const handleLanguageSelected = async () => {
    try {
      await AsyncStorage.setItem('isFirstLaunch', 'false');
      setIsFirstLaunch(false); // 🔥 상태 업데이트로 화면 전환 유도
    } catch (e) {
      console.error(e);
    }
  };

  // 2. 로그인 완료 시 호출 (로그인 화면 -> 메인 화면으로)
  const handleGuestLogin = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true); // 🔥 상태 업데이트로 화면 전환 유도
    } catch (e) {
      console.error(e);
    }
  };

  // 로딩 중일 때 보여줄 화면
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 화면 결정 로직
  let screen;
  if (isFirstLaunch) {
    // 1순위: 앱 설치 후 첫 실행 시 언어 선택
    screen = <LanguageSelection onLanguageSelected={handleLanguageSelected} />;
  } else if (!isLoggedIn) {
    // 2순위: 언어 선택은 했으나 로그인이 안 된 경우
    screen = <LoginScreen onGuest={handleGuestLogin} />;
  } else {
    // 3순위: 로그인 완료 후 메인 서비스
    screen = <RootStack />; 
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          {screen}
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
};

export default App;