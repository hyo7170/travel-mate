import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar // ✨ 상태 표시줄 높이를 계산하기 위해 추가됨
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const WritePostScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null); // 나중에 갤러리에서 선택한 이미지 경로가 들어갈 곳

  // 공유(게시) 버튼을 눌렀을 때 실행될 함수
  const handlePost = () => {
    if (!text.trim() && !imageUri) {
      alert('내용이나 사진을 추가해주세요!');
      return;
    }

    // 나중에 파이어베이스 연동 시 이곳에 DB 저장 로직이 들어갑니다.
    console.log('서버로 보낼 데이터:', { text, imageUri });
    
    // 저장이 완료되었다고 가정하고 이전 피드 화면으로 돌아갑니다.
    navigation.goBack(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        {/* 1. 상단 헤더 영역 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="close" size={28} color="#262626" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>새 게시물</Text>
          <TouchableOpacity onPress={handlePost}>
            <Text style={[styles.postButtonText, (text || imageUri) ? styles.postButtonActive : null]}>
              공유
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. 사진 첨부 영역 */}
        <View style={styles.imageSection}>
          {imageUri ? (
            <View>
              {/* 이미지가 있을 경우 미리보기 */}
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => setImageUri(null)}
              >
                <Icon name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            // 이미지가 없을 경우 사진 추가 버튼
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => alert('사진 라이브러리 열기 (나중에 연동)')}
            >
              <Icon name="camera-outline" size={40} color="#8e8e8e" />
              <Text style={styles.placeholderText}>사진 추가</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. 텍스트 입력 영역 */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="오늘 공항은 어떤가요? 생생한 현장 소식을 나누어주세요!"
            placeholderTextColor="#8e8e8e"
            multiline={true} // 여러 줄 입력 가능
            autoFocus={true} // 화면 진입 시 자동으로 키보드 띄우기
            value={text}
            onChangeText={setText}
            textAlignVertical="top" // 안드로이드에서 글씨가 위에서부터 써지도록 설정
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WritePostScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    // ✨ 안드로이드일 경우 기기의 상태 표시줄 높이만큼 위쪽 여백을 줌
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8e8e8e', // 비활성화 색상
    padding: 5,
  },
  postButtonActive: {
    color: '#09AA5C', // 글씨나 사진이 들어가면 앱 메인 컬러(초록색)로 활성화!
  },
  imageSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 5,
    fontSize: 12,
    color: '#8e8e8e',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#000',
    borderRadius: 14,
  },
  inputSection: {
    flex: 1,
    padding: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#262626',
  },
});