// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
// import { useLanguage } from '../components/LanguageContext';
// import airlineLogos from '../assets/airlineLogos';

// function FlightDepartureApi() {
//   const [responseData, setResponseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [cityModalVisible, setCityModalVisible] = useState(false);
//   const [airlineModalVisible, setAirlineModalVisible] = useState(false);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const { translate } = useLanguage();

//   const [flightCount, setFlightCount] = useState(0);
//   const [cityFlightCounts, setCityFlightCounts] = useState({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedAirline, setSelectedAirline] = useState(null);

//   const getCurrentDateTime = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const date = String(now.getDate()).padStart(2, '0');
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     return `${year}-${month}-${date} ${hours}:${minutes}`;
//   };

//   const getStatusTextStyle = (status) => {
//     switch (status) {
//       case '출발':
//         return { color: 'green' };
//       case '결항':
//         return { color: 'red' };
//       case '지연':
//         return { color: 'orange' };
//       case '마감예정':
//         return { color: 'purple' };
//       case '체크인오픈':
//         return { color: 'blue' };
//       default:
//         return {};
//     }
//   };

//   useEffect(() => {
//     const serviceKey = 'bNxy7RPcmy860NJ4E%2B4OWEOJ%2FniUvrEhHvBHdh5RwPNs4Rh%2BFdTCSmtMZUMKFQl%2BoS5BEtC18cgjgFvXw%2FUz%2BQ%3D%3D';
//     const fetchData = async () => {
//       try {
//         let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
//         queryParams += '&' + encodeURIComponent('from_time') + '=' + encodeURIComponent('0000');
//         queryParams += '&' + encodeURIComponent('to_time') + '=' + encodeURIComponent('2400');
//         queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');

//         const cityCodes = ['HAN', 'SGN', 'DAD', 'TPE', 'NRT', 'HND', 'KIX', 'FUK', 'CTS', 'CGK', 'SIN', 'BKK', 'CNX', 'KUL', 'CRK', 'MNL', 'PNH'];
//         const airline = ['KE', 'OZ', '7C', 'LJ', 'VN'];
//         const apiRequests = cityCodes.map(cityCode =>
//           fetch(`http://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp/getPassengerDeparturesOdp${queryParams}&${encodeURIComponent('airport')}=${encodeURIComponent(cityCode)}&${airline.map(a => encodeURIComponent('airline[]') + '=' + encodeURIComponent(a)).join('&')}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           })
//         );

//         const responses = await Promise.all(apiRequests);

//         const responseData = await Promise.all(responses.map(async response => {
//           if (!response.ok) {
//             throw new Error('네트워크 요청에 실패했습니다.');
//           }
//           const json = await response.json();
//           console.log(json);
//           return json;
//         }));

//         setResponseData(responseData);

//         const cityCounts = {};
//         responseData.forEach(response => {
//           const airportCode = response.response.body.items[0].airportCode;
//           const count = response.response.body.items.length;
//           cityCounts[airportCode] = count;
//         });
//         setCityFlightCounts(cityCounts);

//         const totalFlights = responseData.reduce((total, response) => total + response.response.body.items.length, 0);
//         setFlightCount(totalFlights);
//       } catch (error) {
//         console.error('에러 발생:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading || !responseData) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setCityModalVisible(false);

//     const selectedResponse = responseData.find(response => response.response.body.items[0].airportCode === city);
//     setSelectedResponse(selectedResponse);
//   };

//   const handleAirlineSelect = (airline) => {
//     setSelectedAirline(airline);
//     setAirlineModalVisible(false);
//   };

//   const airportCode = [
//     { id: 'HAN', name: '하노이' },
//     { id: 'SGN', name: '호치민' },
//     { id: 'DAD', name: '다낭' },
//     { id: 'TPE', name: '타이베이' },
//     { id: 'NRT', name: '도쿄_나리타' },
//     { id: 'HND', name: '도쿄_하네다' },
//     { id: 'KIX', name: '오사카' },
//     { id: 'FUK', name: '후쿠오카' },
//     { id: 'CTS', name: '삿포로' },
//     { id: 'CGK', name: '자카르타' },
//     { id: 'SIN', name: '싱가포르' },
//     { id: 'BKK', name: '방콕' },
//     { id: 'CNX', name: '치앙마이' },
//     { id: 'KUL', name: '쿠알라룸푸르' },
//     { id: 'MNL', name: '마닐라' },
//     { id: 'CRK', name: '클락' },
//     { id: 'PNH', name: '프놈펜' },
//   ];

//   const airlines = [
//     { id: 'KE', name: '대한항공' },
//     { id: 'OZ', name: '아시아나항공' },
//     { id: '7C', name: '제주항공' },
//     { id: 'LJ', name: '진에어' },
//     { id: 'VN', name: '베트남항공' },
//   ];

//   const filterCities = (cities, query) => cities.filter(city => city.name.toLowerCase().includes(query.toLowerCase()));
//   const filterAirlines = (airlines, query) => airlines.filter(airline => airline.name.toLowerCase().includes(query.toLowerCase()));

//   const renderCityItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleCitySelect(item.id)}>
//       <Text style={[styles.cityText, selectedCity === item.id && styles.selectedCity]}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   // 항공사 목록을 렌더링하는 부분입니다.
//   const renderAirlineItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleAirlineSelect(item.id)}>
//       <Text style={[styles.cityText, selectedAirline === item.id && styles.selectedCity]}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   // 데이터 필터링을 위한 함수가 변경되었습니다.
//   const filteredFlights = (selectedCity ? (selectedResponse?.response.body.items || []) : responseData.flatMap(response => response.response.body.items))
//     .filter(item => !selectedAirline || item.airline === selectedAirline);

//   return (
//     <View style={styles.outerContainer}>
//       <View style={styles.selectionContainer}>
//         <TouchableOpacity onPress={() => setCityModalVisible(true)} style={styles.selectionButton}>
//           <Text style={styles.selectedCityText}>
//             {selectedCity ? translate(airportCode.find(city => city.id === selectedCity).name) : translate('도시 선택')}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setAirlineModalVisible(true)} style={styles.selectionButton}>
//           <Text style={styles.selectedCityText}>
//             {selectedAirline ? translate(airlines.find(airline => airline.id === selectedAirline).name) : translate('항공사 선택')}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={cityModalVisible}
//         onRequestClose={() => setCityModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <TouchableOpacity onPress={() => setCityModalVisible(false)} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>X</Text>
//           </TouchableOpacity>
//           <TextInput
//             style={styles.searchInput}
//             placeholder={translate('도시를 검색하세요')}
//             onChangeText={(text) => setSearchQuery(text)}
//             value={searchQuery}
//           />
//           <FlatList
//             data={filterCities(airportCode, searchQuery)}
//             renderItem={renderCityItem}
//             keyExtractor={item => item.id}
//             contentContainerStyle={styles.cityList}
//             style={{ maxHeight: 400 }}
//           />
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={airlineModalVisible}
//         onRequestClose={() => setAirlineModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <TouchableOpacity onPress={() => setAirlineModalVisible(false)} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>X</Text>
//           </TouchableOpacity>
//           <TextInput
//             style={styles.searchInput}
//             placeholder={translate('항공사를 검색하세요')}
//             onChangeText={(text) => setSearchQuery(text)}
//             value={searchQuery}
//           />
//           <FlatList
//             data={filterAirlines(airlines, searchQuery)}
//             renderItem={renderAirlineItem}
//             keyExtractor={item => item.id}
//             contentContainerStyle={styles.cityList}
//             style={{ maxHeight: 400 }}
//           />
//         </View>
//       </Modal>

//       <View style={{ marginLeft: 20 }}>
//         <Text style={styles.dateTime}>
//           {getCurrentDateTime()} / {selectedCity && cityFlightCounts[selectedCity] ? `${translate(airportCode.find(airport => airport.id === selectedCity)?.name)}/${cityFlightCounts[selectedCity]} ${translate('개')}` : ''}
//         </Text>
//       </View>

//       <ScrollView style={{ maxHeight: 500 }}>
//         <View style={styles.container}>
//           {filteredFlights.map((item, index) => (
//             <View key={index} style={styles.itemContainer}>
//               <View style={styles.box}>
//                 <View style={styles.logoContainer}>
//                   <Image source={airlineLogos[item.airline]} style={styles.logo} />
//                 </View>
//                 <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18, }}>{translate(item.airline)}
//                   <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 16, }}> {item.flightId}</Text></Text>
//                 <View style={styles.textContainer}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={[styles.itemText, { textAlign: 'left' }]}>{translate('도착공항')}{'\n'}{translate(item.airport)}({item.cityCode})</Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={[styles.itemText, { textAlign: 'right' }]}>{translate('출발')}: {(item.scheduleDateTime)}</Text>
//                     <Text style={[styles.itemText, { textAlign: 'right' }]}>{translate('변경')}: {(item.estimatedDateTime)}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.inlineContainer}>
//                   <Text style={styles.inlineItem}>{translate('터미널')}{'\n'}{item.terminalId === 'P02' ? translate('제 2터미널') : item.terminalId === 'P03' ? translate('제 3터미널') : item.terminalId === 'P01' ? translate('제 1터미널') : item.terminalId}</Text>
//                   <Text style={styles.inlineItem}>{translate('체크인')}{'\n'}{item.chkinrange}</Text>
//                   <Text style={[styles.inlineItem, { textAlign: 'right' }]}>{translate('탑승구')}{'\n'}{item.gatenumber}</Text>
//                 </View>
//                 <Text style={[styles.itemText, getStatusTextStyle(item.remark)]}>{translate('현재상태')}: {item.remark}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
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
//     color: '#555',
//     padding: 10,
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 12,
//     textAlign: 'center',
//     marginTop: 10,
//     marginBottom: 10,
//     width: '90%',
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
//   box: {
//     borderWidth: 2,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 15,
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
//     textAlign: 'left',
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
//   selectionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//   },
//   selectionButton: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   dateTime: {
//     marginVertical: 10,
//   },
// });

// export default FlightDepartureApi;
