import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import PostItem from "../components/PostItem";

const dummyData = [
  {
    id: "1",
    userId: "user_1",
    user: "Traveler_01",
    userPhoto: "https://picsum.photos/100/100?random=1",
    location: "Incheon Int'l Airport",
    image: "https://picsum.photos/400/300?random=11",
    text: "드디어 파리로 출발합니다!",
    date: "2시간 전"
  },
  {
    id: "2",
    userId: "user_2",
    user: "Jeju_Lover",
    userPhoto: "https://picsum.photos/100/100?random=3",
    location: "",
    image: null,
    text: "제주도 숙소 추천해주세요!",
    date: "3시간 전"
  },
  {
    id: "3",
    userId: "user_1",
    user: "AirTrip_Master",
    userPhoto: "https://picsum.photos/100/100?random=2",
    location: "Bangkok Night Market",
    image: "https://picsum.photos/400/300?random=12",
    text: "방콕 야시장 다녀왔습니다 🔥",
    date: "5시간 전"
  }
];

const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState(dummyData);
  const [likes, setLikes] = useState({});

  // 댓글 모달을 위한 상태들
  const [isCommentSheetVisible, setCommentSheetVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  // 현재 로그인 유저
  const currentUserId = "user_1";

  // 좋아요 토글
  const toggleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 삭제
  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((item) => item.id !== id));
  };

  // 수정
  const handleEdit = (post) => {
    navigation.navigate("WritePostScreen", { post });
  };

  // 글쓰기
  const handleWritePost = () => {
    navigation.navigate("WritePostScreen");
  };

  // 댓글 버튼 눌렀을 때 실행
  const handlePressComment = (post) => {
    setSelectedPost(post);
    setCommentSheetVisible(true);
  };

  // 모달 닫기
  const handleCloseSheet = () => {
    setCommentSheetVisible(false);
    setSelectedPost(null);
    setCommentText(""); // 입력창 초기화
  };

  // 댓글 작성 (게시 버튼)
  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    console.log(`${selectedPost.id}번 게시물에 댓글: ${commentText}`);
    // 실제 서버 연동 시 여기에 댓글 전송 API 호출
    setCommentText("");
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            liked={likes[item.id]}
            onToggleLike={toggleLike}
            currentUserId={currentUserId}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPressComment={handlePressComment} // ✨ 함수 전달
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* ✍️ 글쓰기 버튼 */}
      <TouchableOpacity style={styles.fab} onPress={handleWritePost}>
        <Icon name="pencil" size={22} color="#fff" />
      </TouchableOpacity>

      {/* 💬 댓글 바텀 시트 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentSheetVisible}
        onRequestClose={handleCloseSheet} // 안드로이드 뒤로가기 대응
      >
        <View style={styles.modalOverlay}>
          {/* 어두운 배경 클릭 시 닫힘 */}
          <TouchableOpacity 
            style={styles.backgroundTouchable} 
            onPress={handleCloseSheet} 
            activeOpacity={1} 
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomSheetContainer}
          >
            <View style={styles.bottomSheet}>
              {/* ✨ 상단 드래그 바, 타이틀, 그리고 닫기 버튼 */}
              <View style={styles.sheetHeader}>
                <View style={styles.dragHandle} />
                <Text style={styles.sheetTitle}>댓글</Text>
                
                {/* 닫기(X) 버튼 */}
                <TouchableOpacity style={styles.closeBtn} onPress={handleCloseSheet}>
                  <Icon name="close" size={24} color="#1C1C1E" />
                </TouchableOpacity>
              </View>

              {/* 댓글 목록 영역 */}
              <View style={styles.commentsArea}>
                {selectedPost && (
                  <Text style={styles.placeholderText}>
                    {selectedPost.user}님의 게시물입니다.{"\n"}
                    이곳에 댓글 리스트가 들어갑니다.
                  </Text>
                )}
              </View>

              {/* 하단 댓글 입력창 */}
              <View style={styles.inputArea}>
                <Image 
                  source={{ uri: "https://picsum.photos/100/100?random=99" }} 
                  style={styles.myAvatar} 
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="댓글 달기..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity onPress={handleSubmitComment} disabled={!commentText.trim()}>
                  <Text style={[styles.submitBtnText, commentText.trim() ? styles.submitBtnActive : null]}>
                    게시
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    paddingVertical: 10,
    paddingBottom: 90,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EFEFEF",
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#09AA5C",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // --- 댓글 바텀 시트 스타일 ---
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backgroundTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  bottomSheetContainer: {
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  
  // ✨ 헤더 스타일 수정됨 (닫기 버튼 배치 등)
  sheetHeader: {
    alignItems: "center",
    justifyContent: "center", // 세로 중앙 정렬
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFEF",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginBottom: 12, // 간격 살짝 조정
  },
  sheetTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1C1C1E"
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    top: 16, // 드래그 바와 글씨 높이에 맞춰 자연스럽게 배치
    padding: 4,
  },

  commentsArea: {
    flex: 1,
    padding: 16,
  },
  placeholderText: {
    textAlign: "center",
    color: "#8E8E8E",
    marginTop: 20,
    lineHeight: 20,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFEF",
  },
  myAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: "#F0F0F0",
  },
  textInput: {
    flex: 1,
    maxHeight: 80,
    marginRight: 12,
    fontSize: 15,
  },
  submitBtnText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#8E8E8E",
  },
  submitBtnActive: {
    color: "#007AFF", // 활성화 시 파란색
  },
});