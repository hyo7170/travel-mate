import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchModal = ({
  visible,
  onClose,
  title,
  data,
  searchQuery,
  setSearchQuery,
  renderItem,
  translate
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <View style={styles.dragBar} />

        <View style={styles.header}>
          <Text style={styles.modalTitle}>{translate(title)}</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* 이미지 스타일을 적용한 검색 입력창 */}
        <View style={styles.imageStyleInputContainer}>
          <View style={styles.inputWrapper}>
            {/* 왼쪽 위치 아이콘 (이미지의 초록색 포인트) */}
            <Icon name="location-outline" size={22} color="#008485" style={styles.leftIcon} />
            
            <TextInput
              style={styles.searchInput}
              placeholder={translate(`${title}를 검색하세요`)}
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />

            {/* 오른쪽 드롭다운 화살표 아이콘 */}
            <Icon name="chevron-down" size={18} color="#333" style={styles.rightIcon} />
          </View>
        </View>

        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                Keyboard.dismiss();
                renderItem({ item }).props.onPress?.();
                onClose();
              }}
              activeOpacity={0.8}
            >
              {renderItem({ item })}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '75%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -5 },
      },
      android: { elevation: 15 },
    }),
  },
  dragBar: {
    width: 45,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  
  // 핵심: 이미지의 검색박스 디자인 구현
  imageStyleInputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#333', 
    borderRadius: 12,     
    paddingHorizontal: 12,
    height: 56,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leftIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  rightIcon: {
    marginLeft: 10,
  },

  // ✨ 이 부분이 핵심적으로 수정되었습니다! ✨
  item: {
    // 기존에 있던 paddingVertical: 16, borderBottomWidth: 1 등을 전부 삭제하여 
    // 외부의 불필요한 줄과 빈 공간을 제거했습니다.
    // 안쪽에 들어오는 버튼(Pill) 디자인의 자체 여백만 사용하게 됩니다.
  },
  
  listContainer: {
    paddingBottom: 30,
  },
});

export default SearchModal;