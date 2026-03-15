import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, FlatList, TextInput, Animated, Easing, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../components/LanguageContext';
import airlineLogos from '../assets/airlineLogos';
import airportCode from '../components/airportData'; // airportCode 모듈 import
import getStatusTextStyle from '../components/statusStyles';

function FlightDepartureApi() {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState(null); // 항공사 선택 상태 추가
  const [modalVisible, setModalVisible] = useState(false);
  const [airlineModalVisible, setAirlineModalVisible] = useState(false); // 항공사 선택 모달 상태 추가
  const [selectedResponse, setSelectedResponse] = useState(null);
  const { translate } = useLanguage();

  const [flightCount, setFlightCount] = useState(0); // 불러온 항공 일정 개수를 저장하는 상태 변수
  const [cityFlightCounts, setCityFlightCounts] = useState({});

  // 검색어 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [airlineSearchQuery, setAirlineSearchQuery] = useState(''); // 항공사 검색어 상태 추가

  // 즐겨찾기 상태 추가
  const [favorites, setFavorites] = useState([]);

  // 로딩 바 애니메이션 설정
  const loadingBarWidth = useRef(new Animated.Value(0)).current;

  const animateLoadingBar = () => {
    Animated.loop(
      Animated.timing(loadingBarWidth, {
        toValue: 100,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  };

  // 현재 시간을 가져오는 함수
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${year}-${month}-${date} ${hours}:${minutes}`;
    return currentTime;
  };

  // API로부터 받은 시간 정보를 hh:mm 형식으로 변환하는 함수
  const formatTime = (timeString) => {
    // 시간과 분을 추출
    const hours = timeString.substr(0, 2); // 문자열의 처음부터 2개의 문자를 추출하여 시간으로 사용
    const minutes = timeString.substr(2); // 문자열의 두 번째부터 끝까지를 추출하여 분으로 사용

    // 시간과 분을 합쳐서 반환
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    animateLoadingBar();
    const serviceKey = 'bNxy7RPcmy860NJ4E%2B4OWEOJ%2FniUvrEhHvBHdh5RwPNs4Rh%2BFdTCSmtMZUMKFQl%2BoS5BEtC18cgjgFvXw%2FUz%2BQ%3D%3D';
    const fetchData = async () => {
      try {
        let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
        queryParams += '&' + encodeURIComponent('from_time') + '=' + encodeURIComponent('0000');
        queryParams += '&' + encodeURIComponent('to_time') + '=' + encodeURIComponent('2400');
        queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');

        const cityCodes = ['HAN','SGN','DAD','TPE', 'NRT','HND','KIX','FUK','CTS','CGK','SIN','BKK','CNX','KUL','CRK','MNL','PNH','CMB'];
        const apiRequests = cityCodes.map(cityCode =>
          fetch(`http://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp/getPassengerArrivalsOdp${queryParams}&${encodeURIComponent('airport')}=${encodeURIComponent(cityCode)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );

        const responses = await Promise.all(apiRequests);

        const responseData = await Promise.all(responses.map(async response => {
          if (!response.ok) {
            throw new Error('네트워크 요청에 실패했습니다.');
          }
          const json = await response.json();
          console.log(json);
          return json;
        }));

        setResponseData(responseData);

        // 각 도시별 항공 일정 개수 계산
        const cityCounts = {};
        responseData.forEach(response => {
          const items = response?.response?.body?.items || [];
          if (items.length > 0) {
            const airportCode = items[0].airportCode;
            const count = items.length;
            cityCounts[airportCode] = count;
          }
        });
        setCityFlightCounts(cityCounts);

        // 불러온 항공 일정의 개수 설정
        const totalFlights = responseData.reduce((total, response) => total + (response?.response?.body?.items.length || 0), 0);
        setFlightCount(totalFlights);
      } catch (error) {
        console.error('에러 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    loadFavorites(); // 컴포넌트가 마운트될 때 즐겨찾기를 불러옵니다.
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('즐겨찾기를 불러오는 중 에러 발생:', error);
    }
  };

  const saveFavorites = async (updatedFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('즐겨찾기를 저장하는 중 에러 발생:', error);
    }
  };

  if (loading || !responseData) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingBar, { width: loadingBarWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }) }]} />
        </View>
        <Text>{translate('항공정보를 불러오고 있습니다.')}</Text>
      </View>
    );
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setModalVisible(false);

    const selectedResponse = responseData.find(response => (response?.response?.body?.items[0]?.airportCode === city));
    setSelectedResponse(selectedResponse);
  };

  const handleAirlineSelect = (airline) => {
    setSelectedAirline(airline);
    setAirlineModalVisible(false);
  };

  const toggleFavorite = (flightId) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.includes(flightId)) {
        updatedFavorites = prevFavorites.filter((id) => id !== flightId);
        showToast(translate('제일 상단에서 즐겨찾기에서 제거되었습니다.'));
      } else {
        updatedFavorites = [...prevFavorites, flightId];
        showToast(translate('제일 상단에 즐겨찾기에 추가되었습니다.'));
      }
      saveFavorites(updatedFavorites); // 업데이트된 즐겨찾기를 저장합니다.
      return updatedFavorites;
    });
  };

const showToast = (message) => {
  Alert.alert(message);
};

// 도시 검색 함수
const filterCities = (cities, query) => {
  return cities.filter(city => city.name && city.name.toLowerCase().includes(query.toLowerCase()));
};

// 항공사 검색 함수
const filterAirlines = (airlines, query) => {
  return airlines.filter(airline => airline && airline.toLowerCase().includes(query.toLowerCase()));
};

const renderCityItem = ({ item }) => (
  <TouchableOpacity onPress={() => handleCitySelect(item.id)}>
    <Text style={[styles.cityText, selectedCity === item.id && styles.selectedCity]}>
      {translate(item.name)}
    </Text>
  </TouchableOpacity>
);

const renderAirlineItem = ({ item }) => (
  <TouchableOpacity onPress={() => handleAirlineSelect(item)}>
    <Text style={[styles.cityText, selectedAirline === item && styles.selectedCity]}>
      {translate(item)}
    </Text>
  </TouchableOpacity>
);

const sortedFlights = (selectedCity ? (selectedResponse?.response.body.items || []) : responseData.flatMap(response => response.response.body.items))
  .filter(flight => !selectedAirline || flight.airline === selectedAirline)
  .sort((a, b) => {
    if (favorites.includes(a.flightId) && !favorites.includes(b.flightId)) {
      return -1;
    }
    if (!favorites.includes(a.flightId) && favorites.includes(b.flightId)) {
      return 1;
    }
    return 0;
  });

const airlines = Array.from(new Set(responseData.flatMap(response => response.response.body.items.map(item => item.airline))));

return (
  <View style={styles.outerContainer}>
    <View style={styles.selectorContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconContainer}>
        <Text style={styles.selectedCityText}>
          {selectedCity ? translate(airportCode.find(city => city.id === selectedCity).name) : translate('도시 선택')}
          <Icon
            name="caret-up-circle-outline"
            size={18}
            color="black"
            style={styles.icon} // 스타일 적용
          />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setAirlineModalVisible(true)} style={styles.iconContainer}>
        <Text style={styles.selectedCityText}>
          {selectedAirline ? translate(selectedAirline) : translate('항공사 선택')}
          <Icon
            name="caret-up-circle-outline"
            size={18}
            color="black"
            style={styles.icon} // 스타일 적용
          />
        </Text>
      </TouchableOpacity>
    </View>

    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalView}>
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder={translate('도시를 검색하세요')}
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <FlatList
          data={filterCities(airportCode, searchQuery)}
          renderItem={renderCityItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.cityList}
          style={{ maxHeight: 400 }}
        />
      </View>
    </Modal>

    <Modal
      animationType="slide"
      transparent={true}
      visible={airlineModalVisible}
      onRequestClose={() => setAirlineModalVisible(false)}
    >
      <View style={styles.modalView}>
        <TouchableOpacity onPress={() => setAirlineModalVisible(false)} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder={translate('항공사를 검색하세요')}
          onChangeText={(text) => setAirlineSearchQuery(text)}
          value={airlineSearchQuery}
        />
        <FlatList
          data={filterAirlines(airlines, airlineSearchQuery)}
          renderItem={renderAirlineItem}
          keyExtractor={item => item}
          contentContainerStyle={styles.cityList}
          style={{ maxHeight: 400 }}
        />
      </View>
    </Modal>


      <View style={{ marginLeft: 20, marginBottom: 10 }}>
        <Text style={styles.dateTime}>
          {getCurrentDateTime()} / {selectedCity && cityFlightCounts[selectedCity] ? `${translate(airportCode.find(airport => airport.id === selectedCity)?.name)}-${cityFlightCounts[selectedCity]} ${translate('개')}` : ''}
        </Text>
      </View>

      <ScrollView style={{ maxHeight: 500 }}>
        <View style={styles.container}>
          {sortedFlights.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
          <View key={index} style={styles.shadowContainer}>
            <View style={styles.flightinfobox}>
                <TouchableOpacity onPress={() => toggleFavorite(item.flightId)} style={styles.favoriteButton}>
                  <Text style={styles.favoriteButtonText}>{favorites.includes(item.flightId) ? '★' : '☆'}</Text>
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                  <Image source={airlineLogos[item.airline]} style={styles.logo} />
                </View> 
                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18, }}>
                  {translate(item.airline)}
                      <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 16 }}>
                          {item.flightId} {item.codeshare === "Slave" ? translate('[코드쉐어]') : ""}
</Text>
                </Text>
                <View style={styles.textContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemText}>
                      <Text style={{fontWeight: 'bold'}}>{translate('출발공항')}</Text>
                      {'\n'}
                      {translate(item.airport)}({item.cityCode})
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                        <Text style={styles.timeText}>
                      <Text style={{fontWeight: 'bold', textAlign: 'right'}}>{translate('도착')}: </Text>
                      {formatTime(item.scheduleDateTime)}
                    </Text>
                    <Text style={styles.timeText}>
                      <Text style={{fontWeight: 'bold', textAlign: 'right'}}>{translate('변경')}: </Text>
                      {formatTime(item.estimatedDateTime)}
                    </Text>
                  </View>
                </View>
                    <View style={styles.inlineContainer}>
                        <Text style={styles.inlineItem}>
                          <Text style={{fontWeight: 'bold'}}>{translate('터미널')}{'\n'}</Text>
                          {item.terminalId === 'P02' ? translate('1터미널 탑승동') : item.terminalId === 'P03' ? translate('2터미널') : item.terminalId === 'P01' ? translate('1터미널') : item.terminalId}
                        </Text>
                                          <Text style={styles.inlineItem}>
                      <Text style={{fontWeight: 'bold'}}>{translate('수화물')}{'\n'}</Text>
                      {item.carousel}
                    </Text>
                      <Text style={[styles.inlineItem, { textAlign: 'center' }]}>
                        <Text style={{fontWeight: 'bold'}}>{translate('출구')}{'\n'}</Text>
                        {item.gatenumber}
                      </Text>
                    </View>
                    <Text style={[styles.itemText, getStatusTextStyle(item.remark), { fontWeight: 'bold' }]}>{translate('현재상태')}: {translate(item.remark)}</Text>
              </View>
            </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, // 수평 여백 설정
    paddingBottom: 20, // 하단 여백 설정
    marginTop: 5,
  },
  loadingContainer: {
    width: '100%',
    height: 15,
    backgroundColor: '#eee',
    overflow: 'hidden',
    marginTop: 300,
    borderWidth: 1, // 스트로크 두께 설정
    borderColor: '#E8E8E8', // 스트로크 색상 설정
    borderRadius: 15,
  },
  loadingBar: {
    height: 15,
    backgroundColor: '#09AA5C',
  },
  modalView: {
    marginTop: 60, // 상단 여백 설정
    marginHorizontal: 20, // 좌우 여백 설정
    backgroundColor: 'white', // 배경색 설정
    borderRadius: 10, // 테두리 모서리 둥글게 설정
    paddingVertical: 20, // 수직 내부 여백 설정
    paddingHorizontal: 10, // 수평 내부 여백 설정
    elevation: 5, // 그림자 효과 설정
  },
  cityList: {
    paddingHorizontal: 10, // 도시 목록의 좌우 여백 설정
  },
  selectedCityText: {
    fontSize: 16, // 폰트 크기 설정
    color: '#00000', // 폰트 색상 설정
    padding: 10, // 내부 여백 설정
    borderWidth: 2, // 테두리 두께 설정
    borderColor: '#ccc', // 테두리 색상 설정
    borderRadius: 12, // 테두리 모서리 둥글게 설정
    textAlign: 'center', // 텍스트 정렬 설정
    marginTop: 10, // 상단 여백 설정
    marginBottom: 10, // 하단 여백 설정
    width: 160, // 너비 설정
    alignSelf: 'center', // 중앙 정렬 설정
  },
  cityText: {
    fontSize: 16, // 폰트 크기 설정
    color: '#555', // 폰트 색상 설정
    paddingVertical: 10, // 수직 내부 여백 설정
  },
  selectedCity: {
    fontWeight: 'bold', // 폰트 굵기 설정
    color: 'blue', // 폰트 색상 설정
  },
  itemContainer: {
    marginBottom: 20, // 아이템 컨테이너 간 여백 설정
  },
  shadowContainer: {
    shadowColor: "#000", // 그림자 색상 설정
    shadowOffset: { width: 0, height: 4 }, // 그림자 오프셋 설정
    shadowOpacity: 0.15, // 그림자 불투명도 설정
    shadowRadius: 10.84, // 그림자 반경 설정
    elevation: 4, // 안드로이드용 그림자 설정
    borderRadius: 15, // 그림자 컨테이너의 모서리 둥글게 설정
  },
  flightinfobox: {
    padding: 10, // 내부 여백 설정
    borderRadius: 15, // 테두리 모서리 둥글게 설정
    backgroundColor: '#FFFFFF', // 배경색 설정
  },
  logoContainer: {
    alignItems: 'flex-start', // 아이템을 왼쪽으로 정렬 설정
    marginBottom: 10, // 아이템 간 여백 설정
  },
  logo: {
    width: 200, // 이미지 너비 설정
    height: 20, // 이미지 높이 설정
    resizeMode: 'contain', // 이미지 크기 조정 방식 설정
    alignSelf: 'flex-start', // 이미지를 왼쪽으로 정렬 설정
  },
  itemText: {
    fontSize: 16,
  },
  timeText:{
    textAlign: 'right',

  },
  textContainer: {
    flexDirection: 'row', // 가로 방향으로 아이템 정렬 설정
    justifyContent: 'space-between', // 아이템 사이의 여백을 동일하게 설정
  },
  inlineContainer: {
    flexDirection: 'row', // 가로 방향으로 아이템 정렬 설정
    justifyContent: 'space-between', // 아이템 사이의 여백을 동일하게 설정
  },
  inlineItem: {
    flex: 1, // 아이템의 비율 설정
    fontSize: 16, // 폰트 크기 설정
    textAlign: 'center', // 텍스트 정렬 설정
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 50,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555', // 닫기 버튼 색상을 조정합니다.
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 40,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 50,
  },
  favoriteButtonText: { 
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  dateTime: {
    fontWeight: 'bold',
  },
    icon: {
      marginLeft: 10,
    },
   delayedTime: {
    color: 'red',
  },

});

export default FlightDepartureApi;
