// // styles.js
// import { StyleSheet, Animated, Easing } from 'react-native';

// export const loadingBarWidth = new Animated.Value(0);

// export const animateLoadingBar = () => {
//   Animated.loop(
//     Animated.timing(loadingBarWidth, {
//       toValue: 100,
//       duration: 2000,
//       easing: Easing.linear,
//       useNativeDriver: false,
//     })
//   ).start();
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     marginTop: 5,
//   },
//   loadingContainer: {
//     width: '100%',
//     height: 15,
//     backgroundColor: '#eee',
//     overflow: 'hidden',
//     marginTop: 300,
//     borderWidth: 1,
//     borderColor: '#E8E8E8',
//     borderRadius: 15,
//   },
//   loadingBar: {
//     height: 15,
//     backgroundColor: '#09AA5C',
//   },
//   modalView: {
//     marginTop: 60,
//     marginHorizontal: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     paddingVertical: 20,
//     paddingHorizontal: 10,
//     elevation: 5,
//   },
//   cityList: {
//     paddingHorizontal: 10,
//   },
//   selectedCityText: {
//     fontSize: 16,
//     color: '#00000',
//     padding: 10,
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 12,
//     textAlign: 'center',
//     marginTop: 10,
//     marginBottom: 10,
//     width: 160,
//     alignSelf: 'center',
//   },
//   cityText: {
//     fontSize: 16,
//     color: '#555',
//     paddingVertical: 10,
//   },
//   selectedCity: {
//     fontWeight: 'bold',
//     color: 'blue',
//   },
//   itemContainer: {
//     marginBottom: 20,
//   },
//   shadowContainer: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10.84,
//     elevation: 4,
//     borderRadius: 15,
//   },
//   flightinfobox: {
//     padding: 10,
//     borderRadius: 15,
//     backgroundColor: '#FFFFFF',
//   },
//   logoContainer: {
//     alignItems: 'flex-start',
//     marginBottom: 10,
//   },
//   logo: {
//     width: 200,
//     height: 20,
//     resizeMode: 'contain',
//     alignSelf: 'flex-start',
//   },
//   itemText: {
//     fontSize: 16,
//   },
//   timeText: {
//     textAlign: 'right',
//   },
//   textContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   inlineContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   inlineItem: {
//     flex: 1,
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 50,
//   },
//   closeButtonText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#555',
//   },
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginTop: 40,
//   },
//   favoriteButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 50,
//   },
//   favoriteButtonText: { 
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFCC00',
//   },
//   selectorContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   dateTime: {
//     fontWeight: 'bold',
//   },
//   icon: {
//     marginLeft: 10,
//   },
//   delayedTime: {
//     color: 'red',
//   },
// });

// export default styles;
