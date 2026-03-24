import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 임시 알림 데이터 (나중에 서버나 상태 관리로 대체)
const DUMMY_NOTIFICATIONS = [
  {
    id: '1',
    title: '새로운 메시지',
    content: '여행 메이트로부터 새로운 메시지가 도착했습니다.',
    time: '10분 전',
    isRead: false, // 안 읽은 알림
  },
  {
    id: '2',
    title: '일정 알림',
    content: '내일 제주도 일정이 시작됩니다. 짐을 확인해주세요!',
    time: '1시간 전',
    isRead: false,
  },
  {
    id: '3',
    title: '시스템 공지',
    content: 'TRAVEL MATE 앱 업데이트가 완료되었습니다.',
    time: '어제',
    isRead: true, // 읽은 알림
  },
];

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  // 알림 클릭 시 읽음 처리하는 임시 함수
  const handlePressNotification = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    // 여기에 해당 알림의 상세 페이지로 이동하는 로직을 추가할 수 있습니다.
  };

  // 리스트의 각 항목을 렌더링하는 함수
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.isRead ? styles.readItem : styles.unreadItem
      ]}
      onPress={() => handlePressNotification(item.id)}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={item.isRead ? "notifications-outline" : "notifications"} 
          size={24} 
          color={item.isRead ? "#999" : "#FF3B30"} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, item.isRead && styles.readText]}>{item.title}</Text>
        <Text style={[styles.content, item.isRead && styles.readText]} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>새로운 알림이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    paddingVertical: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    // 그림자 효과
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30', // 안 읽은 알림은 빨간색 테두리로 강조
  },
  readItem: {
    opacity: 0.7, // 읽은 알림은 살짝 투명하게
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  readText: {
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default NotificationsScreen;