import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FlightDeparturesApi from '../api/FlightDeparturesApi';
import FlightArrivalsApi from '../api/FlightArrivalApi';
import { useLanguage } from '../components/LanguageContext';

const ToggleButton = () => {
  const [isInternational, setIsInternational] = useState(true);
  const { translate } = useLanguage();

  return (
    <View style={styles.container}>

      {/* 토글 탭 */}
      <View style={styles.tabWrapper}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            isInternational && styles.activeTab
          ]}
          onPress={() => setIsInternational(true)}
        >
          <Text style={[
            styles.tabText,
            isInternational && styles.activeText
          ]}>
            ✈️ {translate('출발편')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            !isInternational && styles.activeTab
          ]}
          onPress={() => setIsInternational(false)}
        >
          <Text style={[
            styles.tabText,
            !isInternational && styles.activeText
          ]}>
            🛬 {translate('도착편')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 데이터 영역 */}
      <View style={styles.dataContainer}>
        {isInternational ? <FlightDeparturesApi /> : <FlightArrivalsApi />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#F5F6F8',
  },

  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E9EDF2',
    borderRadius: 30,
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },

  activeTab: {
    backgroundColor: '#ffffff',

    // iOS 그림자
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // Android 그림자
    elevation: 3,
  },

  tabText: {
    fontSize: 15,
    color: '#777',
    fontWeight: '500',
  },

  activeText: {
    color: '#09AA5C',
    fontWeight: '700',
  },

  dataContainer: {
    flex: 1,
  },
});

export default ToggleButton;