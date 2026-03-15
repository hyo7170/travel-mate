import React from 'react';
import { View, StyleSheet } from 'react-native';
import FacilityScreen from '../api/FacilityScreenApi';

const App = () => {
  return (
    <View style={styles.container}>
      <FacilityScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // View가 화면 전체를 차지하도록 설정
    backgroundColor: '#FFFFFF', // 배경색을 흰색으로 설정
  },
});

export default App;
