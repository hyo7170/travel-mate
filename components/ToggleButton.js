import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FlightDeparturesApi from '../api/FlightDeparturesApi'; // 출발편 API
import FlightArrivalsApi from '../api/FlightArrivalApi'; // 도착편 API
import { useLanguage } from '../components/LanguageContext'; // 언어 설정을 가져옵니다.

const ToggleButton = () => {
  const [isInternational, setIsInternational] = useState(true);
  const { translate } = useLanguage(); // 언어 설정을 가져옵니다.

  const handleDeparturesClick = () => {
    setIsInternational(true);
  };

  const handleArrivalsClick = () => {
    setIsInternational(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isInternational ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={handleDeparturesClick}
        >
          <Text style={isInternational ? styles.activeButtonText : styles.inactiveButtonText}>
            {translate('출발편')} 
          </Text>              
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            !isInternational ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={handleArrivalsClick}
        >
          <Text style={!isInternational ? styles.activeButtonText : styles.inactiveButtonText}>
            {translate('도착편')} 
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dataContainer}>
        {isInternational ? <FlightDeparturesApi /> : <FlightArrivalsApi />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginRight: 10,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20, // 둥근 모서리
  },
  activeButton: {
    backgroundColor: '#09AA5C',
  },
  inactiveButton: {
    backgroundColor: '#D8D8D8',
  },
  activeButtonText: {
    color: 'white',
  },
  inactiveButtonText: {
    color: 'black',
  },
  dataContainer: {
    // API 데이터를 표시할 위치를 조정할 수 있는 스타일을 추가하세요.
  },
});

export default ToggleButton;
