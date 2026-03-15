import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../components/LanguageContext'; // 언어 설정을 가져옵니다.

function SelectButtonBar() {
  const { translate } = useLanguage(); // 언어 설정을 가져옵니다.
  // 초기값을 null 또는 적절한 기본값으로 설정합니다.
  const [selectedValue, setSelectedValue] = useState(null);

  // 컴포넌트가 마운트된 후 초기값을 설정합니다.
  useEffect(() => {
    setSelectedValue(translate('인천국제공항(국제선)'));
  }, [translate]);

  // selectedValue가 null인 경우, Picker를 렌더링하지 않습니다.
  if (selectedValue === null) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        {/* Picker.Item의 label도 translate 함수를 사용하여 동적으로 설정합니다. */}
        <Picker.Item label={translate('인천국제공항(국제선)')} value="인천국제공항(국제선)" />
        {/* 필요하다면 다른 Picker.Item들도 추가하세요. */}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#ddd', // 테두리 색상을 회색에서 연한 회색으로 변경합니다.
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10, // 양쪽에 여백을 추가합니다.
    marginLeft: 10,
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFFFFF',

  },
});

export default function LanguageWrappedSelectButtonBar() {
  return (
      <SelectButtonBar />
  );
}
