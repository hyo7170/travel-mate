import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const dummyData = [
  {
    id: "1",
    user: "Traveler_01",
    userPhoto: "https://picsum.photos/100/100?random=1",
    location: "Incheon Int'l Airport",
    image: "https://picsum.photos/400/300?random=11",
    text: "드디어 파리로 출발합니다! 스마트패스 등록해두니까 출국장 들어가는 데 5분도 안 걸렸어요. 다들 꼭 등록하고 가세요 ✈️",
    date: "2시간 전"
  },
  {
    id: "2",
    user: "Jeju_Lover",
    userPhoto: "https://picsum.photos/100/100?random=3",
    location: "", 
    image: null,  
    text: "다음 달에 혼자 제주도 3박 4일 가려고 하는데, 동쪽으로 뚜벅이가 가기 좋은 조용한 숙소 추천해주실 분 계신가요? ㅠㅠ",
    date: "3시간 전"
  },
  {
    id: "3",
    user: "AirTrip_Master",
    userPhoto: "https://picsum.photos/100/100?random=2",
    location: "Bangkok Night Market",
    image: "https://picsum.photos/400/300?random=12",
    text: "방콕 쩟페어 야시장 다녀왔습니다 🔥 랭쎕(고기산장) 양 진짜 많고 맛있네요. 사람 많으니까 소지품 주의하세요!",
    date: "5시간 전"
  }
];

const FeedScreen = ({ navigation }) => {
  const [likes, setLikes] = useState({});

  const toggleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleWritePost = () => {
    navigation.navigate('WritePostScreen'); 
  };

  const renderItem = ({ item }) => {
    const liked = likes[item.id];

    return (
      <View style={styles.postContainer}>
        <View style={styles.leftColumn}>
          <Image source={{ uri: item.userPhoto }} style={styles.userAvatar} />
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.headerRow}>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.postDate}> · {item.date}</Text>
            <TouchableOpacity style={styles.moreOptionsBtn}>
              <Icon name="ellipsis-horizontal" size={16} color="#8E8E8E" />
            </TouchableOpacity>
          </View>

          <Text style={styles.postText}>
            {item.text}
          </Text>

          {item.image && (
            <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
          )}

          {item.location ? (
            <View style={styles.locationContainer}>
              <Icon name="location-outline" size={14} color="#8E8E8E" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          ) : null}

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.actionBtn}>
              <Icon
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={liked ? "#ED4956" : "#8E8E8E"}
              />
              <Text style={[styles.actionText, liked && {color: '#ED4956'}]}>
                {liked ? '1' : '0'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Icon name="chatbubble-outline" size={18} color="#8E8E8E" />
              <Text style={styles.actionText}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Icon name="paper-plane-outline" size={18} color="#8E8E8E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />} 
      />
      
      {/* 🌟 크기가 작아지고 연필 아이콘으로 변경된 플로팅 버튼 */}
      <TouchableOpacity style={styles.fab} onPress={handleWritePost}>
        <Icon name="pencil" size={22} color="#fff" />
      </TouchableOpacity>
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
  postContainer: {
    flexDirection: 'row',
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
    backgroundColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontWeight: "700",
    fontSize: 15,
    color: '#1C1C1E'
  },
  postDate: {
    fontSize: 13,
    color: "#8E8E8E",
  },
  moreOptionsBtn: {
    marginLeft: 'auto',
    padding: 2,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1C1C1E",
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200, 
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EFEFEF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: "#8E8E8E",
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 13,
    color: "#8E8E8E",
    marginLeft: 6,
  },
  
  // 🌟 버튼 스타일 변경 적용
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#09AA5C', 
    width: 48,         // 56에서 48로 축소
    height: 48,        // 56에서 48로 축소
    borderRadius: 24,  // 크기의 절반으로 설정하여 완벽한 원형 유지
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});