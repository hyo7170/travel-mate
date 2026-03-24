// components/SelectorButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SelectorButton = ({ label, onPress, iconName = "chevron-down" }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        <View style={styles.labelContainer}>
          {/* 이미지 1처럼 라벨 왼쪽의 아이콘 (포인트 컬러) */}
          <Icon name={iconName} size={18} color="#008485" style={styles.leftIcon} />
          <Text style={styles.text} numberOfLines={1}>
            {label}
          </Text>
        </View>
        {/* 이미지 1의 오른쪽 드롭다운 화살표 */}
        <Icon name="chevron-down" size={16} color="#333" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 6,
    height: 54, // 높이를 조금 더 키움
    backgroundColor: '#fff',
    borderRadius: 16, // 더 둥글게
    justifyContent: 'center',
    paddingHorizontal: 16,
    // 이미지 1의 부드러운 그림자 효과 구현
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  leftIcon: {
    marginRight: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});

export default SelectorButton;