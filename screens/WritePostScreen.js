import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Keyboard
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const WritePostScreen = ({ navigation }) => {
  const [postText, setPostText] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);

  // 🚦 유효성 검사: 글이 1자 이상이거나, 사진이 1장 이상일 때만 'true'
  const isPostable = postText.trim().length > 0 || images.length > 0;

  // 사진 선택
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1
    });

    if (!result.canceled) {
      const selected = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...selected]);
    }
  };

  // 🗑️ 개별 이미지 삭제 함수
  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // 📝 게시 버튼 클릭 (기존 공유)
  const handlePost = () => {
    // 내용이 없으면 함수 종료 (방어 코드)
    if (!isPostable) return; 

    const postData = {
      text: postText,
      location: location,
      tags: tags,
      images: images
    };

    console.log("게시될 데이터:", postData);
    
    // TODO: 파이어베이스(Firestore/Storage) 업로드 로직 추가 예정
    
    // 게시 완료 후 피드로 돌아가기
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerCancel}>취소</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>새 게시물</Text>

        {/* 게시 버튼 (isPostable 상태에 따라 터치 활성/비활성 및 스타일 변경) */}
        <TouchableOpacity onPress={handlePost} disabled={!isPostable}>
          <Text style={[styles.headerPost, !isPostable && styles.headerPostDisabled]}>
            게시
          </Text>
        </TouchableOpacity>
      </View>

      {/* 키보드 제어 속성 추가:
        - keyboardShouldPersistTaps="handled": 빈 공간 터치 시 키보드 내려감
        - keyboardDismissMode="on-drag": 스크롤하려고 드래그하면 키보드 내려감
      */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* 사진 추가 버튼 */}
        <TouchableOpacity style={styles.photoButton} onPress={pickImages}>
          <Icon name="camera-outline" size={22} color="#262626" />
          <Text style={styles.photoText}>사진 추가</Text>
        </TouchableOpacity>

        {/* 사진 미리보기 */}
        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagePreviewContainer}
          >
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: img }}
                  style={styles.previewImage}
                />
                {/* ❌ 이미지 삭제 버튼 */}
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => removeImage(index)}
                >
                  <Icon name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* 텍스트 입력 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="여행 경험이나 공항 꿀팁을 공유해보세요 ✈️"
            placeholderTextColor="#8e8e8e"
            multiline
            maxLength={500}
            value={postText}
            onChangeText={setPostText}
          />
          <Text style={styles.counter}>
            {postText.length}/500
          </Text>
        </View>

        {/* 위치 */}
        <View style={styles.row}>
          <Icon name="location-outline" size={22} color="#262626" />
          <TextInput
            style={styles.rowInput}
            placeholder="위치 추가 (예: 인천공항 T1)"
            placeholderTextColor="#8e8e8e"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* 태그 */}
        <View style={styles.row}>
          <Icon name="pricetag-outline" size={22} color="#262626" />
          <TextInput
            style={styles.rowInput}
            placeholder="태그 추가 (#airport #food)"
            placeholderTextColor="#8e8e8e"
            value={tags}
            onChangeText={setTags}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default WritePostScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 15, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F0F0F0"
  },
  headerCancel: { fontSize: 16, color: "#262626" },
  headerTitle: { fontSize: 17, fontWeight: "600", color: "#262626" },
  headerPost: { fontSize: 16, fontWeight: "600", color: "#09AA5C" }, // 기존 'headerShare'에서 이름 변경
  headerPostDisabled: { color: "#B0B0B0" }, // 비활성화 상태일 때의 회색 색상
  photoButton: {
    flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#F0F0F0"
  },
  photoText: { marginLeft: 10, fontSize: 15, color: "#262626" },
  imagePreviewContainer: { paddingHorizontal: 15, marginTop: 10 },
  
  // 묶어주는 View와 삭제 버튼 스타일 추가
  imageWrapper: { marginRight: 10, position: 'relative' },
  previewImage: { width: 90, height: 90, borderRadius: 8 },
  deleteButton: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12 // 아이콘 뒤에 살짝 흰 배경을 깔아 가독성 확보
  },
  
  inputContainer: { padding: 15, minHeight: 200, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  textInput: { fontSize: 16, lineHeight: 22, color: "#262626", textAlignVertical: "top" },
  counter: { textAlign: "right", fontSize: 12, color: "#8e8e8e", marginTop: 10 },
  row: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0"
  },
  rowInput: { flex: 1, marginLeft: 10, fontSize: 16, color: "#262626" }
});