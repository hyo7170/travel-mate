// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useLanguage } from '../components/LanguageContext';
// import airlineLogos from '../assets/airlineLogos';
// import airportCode from '../components/airportData'; 
// import getStatusTextStyle from '../components/statusStyles';
// import { getCurrentDateTime, formatTime } from '../utils/timeUtils';
// import { useFavorites } from '../hooks/useFavorites';
// import { useFlightData } from '../hooks/useFlightData'; 
// import SearchModal from '../components/SearchModal';
// import LoadingBar from '../components/LoadingBar'; 

// function FlightArrivalApi() {
//   // 'arr' 인자를 넘겨 도착 데이터를 가져옵니다.
//   const { responseData, loading, flightCount, cityFlightCounts } = useFlightData('arr');
//   const { translate } = useLanguage();
//   const { favorites, toggleFavorite } = useFavorites(translate);

//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedAirline, setSelectedAirline] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [airlineModalVisible, setAirlineModalVisible] = useState(false);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [airlineSearchQuery, setAirlineSearchQuery] = useState('');

//   // 로딩 중일 때 컴포넌트 호출 (메인 파일의 복잡한 로직은 삭제됨)
//   if (loading || !responseData) {
//     return <LoadingBar message={translate('항공정보를 불러오고 있습니다.')} />;
//   }

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setModalVisible(false);
//     const selectedRes = responseData.find(response => (response?.response?.body?.items?.[0]?.airportCode === city));
//     setSelectedResponse(selectedRes);
//   };

//   const handleAirlineSelect = (airline) => {
//     if (airline === '전체') setSelectedAirline(null);
//     else setSelectedAirline(airline);
//     setAirlineModalVisible(false);
//   };

//   const allItems = responseData ? responseData.flatMap(response => response?.response?.body?.items || []) : [];
//   const airlines = ['전체', ...Array.from(new Set(allItems.map(item => item.airline)))];

//   const sortedFlights = (selectedCity ? (selectedResponse?.response?.body?.items || []) : allItems)
//     .filter(flight => !selectedAirline || flight.airline === selectedAirline)
//     .sort((a, b) => {
//       if (favorites.includes(a.flightId) && !favorites.includes(b.flightId)) return -1;
//       if (!favorites.includes(a.flightId) && favorites.includes(b.flightId)) return 1;
//       return 0;
//     });

//   // FlatList 렌더링 최적화
//   const renderFlightItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <View style={styles.shadowContainer}>
//         <View style={styles.flightinfobox}>
//           <TouchableOpacity onPress={() => toggleFavorite(item.flightId)} style={styles.favoriteButton}>
//             <Text style={styles.favoriteButtonText}>{favorites.includes(item.flightId) ? '★' : '☆'}</Text>
//           </TouchableOpacity>
//           <View style={styles.logoContainer}>
//             <Image source={airlineLogos[item.airline]} style={styles.logo} />
//           </View> 
//           <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}>
//             {translate(item.airline)}
//             <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 16 }}>
//               {" "}{item.flightId} {item.codeshare === "Slave" ? translate('[코드쉐어]') : ""}
//             </Text>
//           </Text>
          
//           <View style={styles.textContainer}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>{translate('출발공항')}</Text>{'\n'}{translate(item.airport)}({item.cityCode})</Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.timeText}><Text style={{ fontWeight: 'bold' }}>{translate('도착')}: </Text>{formatTime(item.scheduleDateTime)}</Text>
//               <Text style={styles.timeText}><Text style={{ fontWeight: 'bold' }}>{translate('변경')}: </Text>{formatTime(item.estimatedDateTime)}</Text>
//             </View>
//           </View>

//           <View style={styles.inlineContainer}>
//             <View style={styles.inlineItemWrap}>
//               <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{translate('터미널')}</Text>
//               <Text style={styles.inlineItemText}>
//                 {item.terminalId === 'P02' ? translate('1터미널 탑승동') : item.terminalId === 'P03' ? translate('2터미널') : translate('1터미널')}
//               </Text>
//             </View>
//             <View style={styles.inlineItemWrap}>
//               <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{translate('수화물')}</Text>
//               <Text style={styles.inlineItemText}>{item.carousel || '-'}</Text>
//             </View>
//             <View style={styles.inlineItemWrap}>
//               <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{translate('출구')}</Text>
//               <Text style={styles.inlineItemText}>{item.gatenumber || '-'}</Text>
//             </View>
//           </View>
//           <Text style={[styles.itemText, getStatusTextStyle(item.remark), { fontWeight: 'bold', marginTop: 10 }]}>
//             {translate('현재상태')}: {translate(item.remark)}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
//       <View style={{ paddingTop: 15 }}>
//         <View style={styles.selectorContainer}>
//           <TouchableOpacity onPress={() => setModalVisible(true)}>
//             <Text style={styles.selectedCityText}>
//               {selectedCity ? translate(airportCode.find(city => city.id === selectedCity).name) : translate('전체 도시')}
//               <Icon name="caret-up-circle-outline" size={18} color="black" style={styles.icon} />
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setAirlineModalVisible(true)}>
//             <Text style={styles.selectedCityText}>
//               {selectedAirline ? translate(selectedAirline) : translate('전체 항공사')}
//               <Icon name="caret-up-circle-outline" size={18} color="black" style={styles.icon} />
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ marginLeft: 20, marginBottom: 10 }}>
//           <Text style={styles.dateTime}>
//             {getCurrentDateTime()} / {selectedCity && cityFlightCounts[selectedCity] ? `${translate(airportCode.find(airport => airport.id === selectedCity)?.name)}-${cityFlightCounts[selectedCity]} ${translate('개')}` : `${translate('전체')} ${flightCount}${translate('개')}`}
//           </Text>
//         </View>
//       </View>

//       <FlatList
//         data={sortedFlights}
//         renderItem={renderFlightItem}
//         keyExtractor={(item, index) => item.flightId + index}
//         contentContainerStyle={styles.listContent}
//         initialNumToRender={10}
//         windowSize={5}
//       />

//       <SearchModal visible={modalVisible} onClose={() => setModalVisible(false)} title="도시" data={airportCode.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))} searchQuery={searchQuery} setSearchQuery={setSearchQuery} renderItem={({item}) => (
//         <TouchableOpacity onPress={() => handleCitySelect(item.id)}>
//           <Text style={[styles.cityText, selectedCity === item.id && styles.selectedCity]}>{translate(item.name)}</Text>
//         </TouchableOpacity>
//       )} translate={translate} />

//       <SearchModal visible={airlineModalVisible} onClose={() => setAirlineModalVisible(false)} title="항공사" data={airlines.filter(a => a?.toLowerCase().includes(airlineSearchQuery.toLowerCase()))} searchQuery={airlineSearchQuery} setSearchQuery={setAirlineSearchQuery} renderItem={({item}) => (
//         <TouchableOpacity onPress={() => handleAirlineSelect(item)}>
//           <Text style={[styles.cityText, (item === '전체' && selectedAirline === null) || selectedAirline === item ? styles.selectedCity : null]}>{translate(item)}</Text>
//         </TouchableOpacity>
//       )} translate={translate} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   listContent: { paddingHorizontal: 20, paddingBottom: 20 },
//   selectedCityText: { fontSize: 15, fontWeight: '600', color: '#1A1C1E', padding: 10, borderWidth: 1.5, borderColor: '#EFF2F5', borderRadius: 12, textAlign: 'center', width: 160, backgroundColor: '#FFF' },
//   cityText: { fontSize: 16, color: '#4B5563', paddingVertical: 14 },
//   selectedCity: { fontWeight: 'bold', color: 'blue' },
//   itemContainer: { marginBottom: 20 },
//   shadowContainer: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, borderRadius: 15 },
//   flightinfobox: { padding: 15, borderRadius: 15, backgroundColor: '#FFFFFF' },
//   logoContainer: { alignItems: 'flex-start', marginBottom: 10 },
//   logo: { width: 180, height: 25, resizeMode: 'contain' },
//   itemText: { fontSize: 16, color: '#333' },
//   timeText: { textAlign: 'right', fontSize: 15, color: '#333' },
//   textContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
//   inlineContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
//   inlineItemWrap: { flex: 1, alignItems: 'center' },
//   inlineItemText: { fontSize: 14, textAlign: 'center', color: '#4B5563', marginTop: 4 },
//   favoriteButton: { position: 'absolute', top: 15, right: 15, zIndex: 50 },
//   favoriteButtonText: { fontSize: 24, color: '#FFCC00' },
//   selectorContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15 },
//   dateTime: { fontWeight: 'bold', color: '#6B7280' },
//   icon: { marginLeft: 10 }
// });

// export default FlightArrivalApi;