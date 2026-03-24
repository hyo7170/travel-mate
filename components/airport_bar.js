import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../components/LanguageContext';

function SelectButtonBar() {
  const { translate } = useLanguage();
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    setSelectedValue(translate('인천국제공항(국제선)'));
  }, [translate]);

  if (!selectedValue) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>

      {/* 카드형 Picker */}
      <View style={styles.container}>
        <View style={styles.innerRow}>
          <Icon name="location-outline" size={20} color="#09AA5C" style={styles.icon} />

          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            dropdownIconColor="#09AA5C"
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
          >
            <Picker.Item
              label={translate('인천국제공항(국제선)')}
              value="인천국제공항(국제선)"
            />
          </Picker>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
  },

  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
    marginLeft: 5,
  },

  container: {
    borderRadius: 15,
    backgroundColor: '#FFFFFF',

    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },

    // Android
    elevation: 3,
  },

  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  icon: {
    marginRight: 5,
  },

  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },

  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
  },
});

export default function LanguageWrappedSelectButtonBar() {
  return <SelectButtonBar />;
}