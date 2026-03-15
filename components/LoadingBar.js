// LoadingBar.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const LoadingBar = () => {
  const loadingBarWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateLoadingBar = () => {
      Animated.loop(
        Animated.timing(loadingBarWidth, {
          toValue: 100,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    };

    animateLoadingBar();
  }, [loadingBarWidth]);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.loadingBar, { width: loadingBarWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      }) }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    height: 15,
    backgroundColor: '#eee',
    overflow: 'hidden',
    marginTop: 300,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 15,
  },
  loadingBar: {
    height: 15,
    backgroundColor: '#09AA5C',
  },
});

export default LoadingBar;
