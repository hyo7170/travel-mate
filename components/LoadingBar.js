import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';

const LoadingBar = ({ message = '데이터를 불러오는 중입니다...' }) => {
  const loadingBarWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(loadingBarWidth, {
        toValue: 100,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  return (
    <View style={styles.loadingWrapper}>
      <View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.loadingBar,
            {
              width: loadingBarWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    backgroundColor: '#F7F9FB', // 배경색과 통일
  },
  loadingContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E6ED',
    borderRadius: 10,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#09AA5C',
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default LoadingBar;