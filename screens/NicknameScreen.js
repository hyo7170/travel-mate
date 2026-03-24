import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// App.js에서 넘겨준 onComplete 프롭스를 받습니다.
const NicknameScreen = ({ route, onComplete }) => {
  // LoginScreen에서 넘어온 구글 이름 받기
  const { googleName } = route.params || { googleName: '' };
  const [nickname, setNickname] = useState(googleName);

  const handleComplete = () => {
    console.log("저장될 닉네임:", nickname);
    // TODO: 여기서 AsyncStorage나 서버에 닉네임 저장 로직 추가

    // 부모(App.js)의 handleLoginComplete 함수를 실행시켜 메인 화면으로 전환!
    onComplete(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>닉네임을 설정해 주세요 ✈️</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="사용하실 닉네임을 입력하세요"
      />
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NicknameScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, width: '100%', marginBottom: 20 },
  button: { backgroundColor: '#4285F4', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});