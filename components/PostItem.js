import React, { useState } from "react"; // useState 추가
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal, // Modal 추가
  StatusBar,
  Platform,

} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const PostItem = ({
  post,
  liked,
  onToggleLike,
  currentUserId,
  onDelete,
  onEdit,
  onPressComment,
}) => {
  const isMyPost = post.userId === currentUserId;
  const [optionsModalVisible, setOptionsModalVisible] = useState(false); // 모달 상태 추가

  // 삭제 2차 확인 네이티브 알림 (이것은 유지)
  const handleDeleteConfirm = () => {
    Alert.alert("삭제", "삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", onPress: () => onDelete(post.id), style: "destructive" },
    ]);
  };

  // ⋯ 버튼 클릭시 모달 열기
  const handleMore = () => {
    setOptionsModalVisible(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setOptionsModalVisible(false);
  };

  // 수정 버튼 클릭시
  const handleEditPress = () => {
    handleCloseModal();
    onEdit(post);
  };

  // 삭제 버튼 클릭시
  const handleDeletePress = () => {
    handleCloseModal();
    handleDeleteConfirm();
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.leftColumn}>
        <Image source={{ uri: post.userPhoto }} style={styles.userAvatar} />
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{post.user}</Text>
          <Text style={styles.postDate}> · {post.date}</Text>

          {/* ⋯ 버튼 */}
          <TouchableOpacity style={styles.moreOptionsBtn} onPress={handleMore}>
            <Icon name="ellipsis-horizontal" size={16} color="#8E8E8E" />
          </TouchableOpacity>
        </View>

        <Text style={styles.postText}>{post.text}</Text>

        {post.image && (
          <Image source={{ uri: post.image }} style={styles.postImage} />
        )}

        {post.location ? (
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={14} color="#8E8E8E" />
            <Text style={styles.locationText}>{post.location}</Text>
          </View>
        ) : null}

        <View style={styles.actionRow}>
          {/* 좋아요 */}
          <TouchableOpacity
            onPress={() => onToggleLike(post.id)}
            style={styles.actionBtn}
          >
            <Icon
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? "#ED4956" : "#8E8E8E"}
            />
            <Text style={[styles.actionText, liked && { color: "#ED4956" }]}>
              {liked ? "1" : "0"}
            </Text>
          </TouchableOpacity>

          {/* 댓글 */}
          {/* ✨ 2. onPress 이벤트 연결 (어떤 게시물의 댓글인지 알기 위해 post를 통째로 넘김) */}
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => onPressComment(post)}
          >
            <Icon name="chatbubble-outline" size={18} color="#8E8E8E" />
            <Text style={styles.actionText}>0</Text> 
          </TouchableOpacity>
        </View>
      </View>

      {/* 커스텀 옵션 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={styles.optionsModalOverlay}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <View style={styles.optionsModalContent}>
            <View style={styles.optionsModalHeader}>
              <Text style={styles.optionsModalTitle}>옵션</Text>
            </View>
            
            {isMyPost ? (
              <>
                <TouchableOpacity style={styles.optionsModalButton} onPress={handleEditPress}>
                  <Text style={styles.optionsModalButtonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionsModalButton, styles.optionsModalButtonDestructive]} onPress={handleDeletePress}>
                  <Text style={[styles.optionsModalButtonText, styles.optionsModalButtonTextDestructive]}>삭제</Text>
                </TouchableOpacity>
              </>
            ) : (
                <TouchableOpacity style={styles.optionsModalButton} onPress={() => console.log('신고')}>
                  <Text style={styles.optionsModalButtonText}>신고</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.optionsModalButton} onPress={handleCloseModal}>
              <Text style={styles.optionsModalButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  // 기존 스타일 유지
  postContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  leftColumn: {
    marginRight: 12,
  },
  rightColumn: {
    flex: 1,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F0F0",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1C1C1E",
  },
  postDate: {
    fontSize: 13,
    color: "#8E8E8E",
  },
  moreOptionsBtn: {
    marginLeft: "auto",
    padding: 4,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1C1C1E",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFEF",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: "#8E8E8E",
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    fontSize: 13,
    color: "#8E8E8E",
    marginLeft: 6,
  },

  // 커스텀 모달 스타일 추가
  optionsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 투명한 배경
    justifyContent: "center",
    alignItems: "center",
  },
  optionsModalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  optionsModalHeader: {
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFEF",
    alignItems: 'center',
  },
  optionsModalTitle: {
    fontWeight: "700",
    fontSize: 17,
    color: "#1C1C1E",
  },
  optionsModalButton: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFEF",
    alignItems: 'center',
    width: '100%',
  },
  optionsModalButtonDestructive: {
    backgroundColor: 'white', // 삭제 버튼 배경은 흰색
  },
  optionsModalButtonText: {
    fontSize: 17,
    color: "#007AFF", // iOS 스타일 파란색
    textAlign: "center",
  },
  optionsModalButtonTextDestructive: {
    color: "#ED4956", // 삭제 버튼은 빨간색
    fontWeight: '600',
  },
});