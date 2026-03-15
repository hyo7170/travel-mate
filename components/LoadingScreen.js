// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ImageBackground } from 'react-native';

// const LoadingScreen = () => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     let interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev < 100) {
//           return prev + 1;
//         } else {
//           clearInterval(interval);
//           return 100;
//         }
//       });
//     }, 50); // 5초 동안 0에서 100까지 증가 (5000ms / 100 = 50ms)

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <ImageBackground
//       source={require('../assets/Loading_image.png')} // 이미지 경로를 설정하세요
//       style={styles.container}
//     >
//       <View style={styles.progressContainer}>
//         <Text style={styles.loadingText}>{progress}%</Text>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   progressContainer: {
//     position: 'absolute',
//     bottom: 50, // 하단에서 50px 위에 위치하도록 설정
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 40,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default LoadingScreen;
