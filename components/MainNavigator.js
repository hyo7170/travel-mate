// MainNavigator.js
import React, { useEffect } from 'react';
import { StyleSheet, Alert, BackHandler, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useLanguage } from '../components/LanguageContext';
import CustomHeader from '../components/CustomHeader';
import HomeScreen from '../screens/HomeScreen';
import IncheonAirport from '../screens/AirportBus';
import ExchangeRate from '../screens/ExchangeRate';
import Facility from '../screens/FacilityScreen';
import FeedScreen from '../screens/FeedScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const { translate } = useLanguage();
  const navigation = useNavigation();

  // 하드웨어 뒤로가기 버튼 제어
  useEffect(() => {
    const backAction = () => {
      // 현재 스택의 인덱스를 확인하여 최상위(홈)가 아니면 홈으로 이동하거나, 
      // 앱 종료 팝업을 띄우는 로직입니다.
      Alert.alert(
        translate('앱 종료'),
        translate('어플 종료하시겠습니까?'),
        [
          {
            text: translate('취소'),
            onPress: () => null,
            style: 'cancel',
          },
          { text: translate('종료'), onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [translate]);

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#09AA5C",
          tabBarInactiveTintColor: "#8e8e8e",
          tabBarStyle: {
            display: "flex",
            paddingBottom: 6,
            height: 60, // 탭 바 높이 명시적 설정 (선택사항)
          },
          tabBarHideOnKeyboard: true,
          header: () => <CustomHeader />, // 모든 스크린 공통 헤더
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: translate('홈'),
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="IncheonAirport"
          component={IncheonAirport}
          options={{
            tabBarLabel: translate('공항버스'),
            tabBarIcon: ({ color, size }) => (
              <Icon name="directions-bus" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ExchangeRate"
          component={ExchangeRate}
          options={{
            tabBarLabel: translate('환율계산기'),
            tabBarIcon: ({ color, size }) => (
              <Icon name="attach-money" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Facility"
          component={Facility}
          options={{
            tabBarLabel: translate('공항시설'),
            tabBarIcon: ({ color, size }) => (
              <Icon name="local-hospital" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarLabel: translate('피드'),
            tabBarIcon: ({ color, size }) => (
              <Icon name="share" color={color} size={size} />
            ),
            headerShown: true, // 설정 화면만 헤더를 다르게 할 경우 여기서 제어
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // 배경색 지정으로 깜빡임 방지
  },
});

export default MainNavigator;