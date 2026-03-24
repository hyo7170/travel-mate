import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 추가
import { useLanguage } from '../components/LanguageContext';
import airportCode from '../components/airportData'; 
import { getCurrentDateTime } from '../utils/timeUtils';
import { useFavorites } from '../hooks/useFavorites';
import { useFlightData } from '../hooks/useFlightData';
import FlightCard from '../components/FlightCard';
import SearchModal from '../components/SearchModal';
import SelectorButton from '../components/SelectorButton'; 

function FlightDepartureApi() {
  const { responseData, loading, flightCount, cityFlightCounts } = useFlightData('dep');
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [airlineModalVisible, setAirlineModalVisible] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const { translate } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites(translate);

  const [searchQuery, setSearchQuery] = useState('');
  const [airlineSearchQuery, setAirlineSearchQuery] = useState('');

  const loadingBarWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(loadingBarWidth, {
        toValue: 100,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  if (loading || !responseData) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingBar, { width: loadingBarWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }) }]} />
        </View>
        <Text style={styles.loadingText}>{translate('항공정보를 불러오고 있습니다.')}</Text>
      </View>
    );
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setModalVisible(false);
    const res = responseData.find(r => r?.response?.body?.items[0]?.airportCode === city);
    setSelectedResponse(res);
  };

  const handleAirlineSelect = (airline) => {
    setSelectedAirline(airline === '전체' ? null : airline);
    setAirlineModalVisible(false);
  };

  // 데이터 필터링 로직
  const allItems = responseData.flatMap(response => response.response.body.items || []);
  const airlines = ['전체', ...Array.from(new Set(allItems.map(item => item.airline)))];

  const sortedFlights = (selectedCity ? (selectedResponse?.response.body.items || []) : allItems)
    .filter(flight => !selectedAirline || flight.airline === selectedAirline)
    .sort((a, b) => {
      const aFav = favorites.includes(a.flightId);
      const bFav = favorites.includes(b.flightId);
      return aFav === bFav ? 0 : aFav ? -1 : 1;
    });

  // 🏙️ 모달 내부 도시 아이템 디자인
  const renderModalCityItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.modalItemButton, selectedCity === item.id && styles.modalItemButtonActive]}
      onPress={() => handleCitySelect(item.id)}
    >
      <View style={styles.modalItemContent}>
        <Icon 
          name="location-sharp" 
          size={16} 
          color={selectedCity === item.id ? "#008485" : "#A0A0A0"} 
          style={styles.modalItemIcon}
        />
        <Text style={[styles.modalItemText, selectedCity === item.id && styles.modalItemTextActive]}>
          {translate(item.name)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // ✈️ 모달 내부 항공사 아이템 디자인
  const renderModalAirlineItem = ({ item }) => {
    const isSelected = (item === '전체' && !selectedAirline) || selectedAirline === item;
    return (
      <TouchableOpacity
        style={[styles.modalItemButton, isSelected && styles.modalItemButtonActive]}
        onPress={() => handleAirlineSelect(item)}
      >
        <View style={styles.modalItemContent}>
          <Icon 
            name="airplane" 
            size={16} 
            color={isSelected ? "#008485" : "#A0A0A0"} 
            style={styles.modalItemIcon}
          />
          <Text style={[styles.modalItemText, isSelected && styles.modalItemTextActive]}>
            {translate(item)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* 🔘 셀렉터 버튼 섹션 */}
      <View style={styles.selectorContainer}>
        <SelectorButton 
          label={selectedCity ? translate(airportCode.find(c => c.id === selectedCity).name) : translate('전체 도시')}
          onPress={() => setModalVisible(true)}
          iconName="location-outline"
        />
        <SelectorButton 
          label={selectedAirline ? translate(selectedAirline) : translate('전체 항공사')}
          onPress={() => setAirlineModalVisible(true)}
          iconName="airplane-outline"
        />
      </View>

      {/* 🏙️ 도시 검색 모달 */}
      <SearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="도시"
        data={airportCode.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        renderItem={renderModalCityItem}
        translate={translate}
      />

      {/* ✈️ 항공사 검색 모달 */}
      <SearchModal
        visible={airlineModalVisible}
        onClose={() => setAirlineModalVisible(false)}
        title="항공사"
        data={airlines.filter(a => a?.toLowerCase().includes(airlineSearchQuery.toLowerCase()))}
        searchQuery={airlineSearchQuery}
        setSearchQuery={setAirlineSearchQuery}
        renderItem={renderModalAirlineItem}
        translate={translate}
      />

      {/* 날짜 및 검색 건수 */}
      <View style={styles.infoRow}>
        <Icon name="calendar-outline" size={16} color="#666" />
        <Text style={styles.dateTime}>
          {getCurrentDateTime()} / {selectedCity && cityFlightCounts[selectedCity] ? `${translate(airportCode.find(airport => airport.id === selectedCity)?.name)} ${cityFlightCounts[selectedCity]}${translate('건')}` : `${translate('전체')} ${flightCount}${translate('건')}`}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          {sortedFlights.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="alert-circle-outline" size={40} color="#CCC" />
              <Text style={styles.noFlightsText}>{translate('해당 조건의 항공편이 없습니다.')}</Text>
            </View>
          ) : (
            sortedFlights.map((item, index) => (
              <FlightCard 
                key={`${item.flightId}-${index}`} 
                item={item} 
                isFavorite={favorites.includes(item.flightId)} 
                onToggleFavorite={() => toggleFavorite(item.flightId)} 
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#F8F9FA', // 전체 배경 연회색 통일
    paddingTop: 15 
  },
  container: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 50 
  },
  loadingContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  loadingBar: { 
    height: '100%', 
    backgroundColor: '#008485', // 로딩바 색상 청록색 통일
    borderRadius: 4,
  },
  loadingText: { 
    marginTop: 15, 
    color: '#666', 
    fontWeight: '500' 
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 15,
  },
  dateTime: { 
    fontWeight: '600', 
    fontSize: 13, 
    color: '#666',
    marginLeft: 6,
  },
  
  // 모달 내부 아이템 디자인 (둥근 알약 스타일)
  modalItemButton: {
    backgroundColor: '#fff', 
    borderRadius: 25, 
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10, 
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  modalItemButtonActive: {
    backgroundColor: '#EDF5F5', 
    borderColor: '#008485', 
  },
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  modalItemIcon: {
    marginRight: 8,
  },
  modalItemText: { 
    fontSize: 15, 
    color: '#666', 
    fontWeight: '500' 
  },
  modalItemTextActive: { 
    color: '#008485', 
    fontWeight: '700' 
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  noFlightsText: { 
    textAlign: 'center', 
    marginTop: 10, 
    color: '#999', 
    fontSize: 15,
    fontWeight: '500'
  },
});

export default FlightDepartureApi;