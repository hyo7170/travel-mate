import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, 
  Modal, TextInput, ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../components/LanguageContext';
import { Table, Row } from 'react-native-table-component';

// --- BusBox 컴포넌트 ---
function BusBox({ busInfo }) {
  const [showRoute, setShowRoute] = useState(false);
  const [showTimetable, setShowTimetable] = useState(false);
  const { translate } = useLanguage();

  const formatTime = (time) => {
    if (!time) return '';
    const hours = time.substring(0, 2);
    const minutes = time.substring(2);
    return `${hours}:${minutes}`;
  };

  const translateRouteInfo = (routeInfo) => {
    if (!routeInfo) return [];
    const locations = routeInfo.split(/,\s*|\s+/);
    return locations.map(location => translate(location));
  };

  const formatTimetableData = (timetable) => {
    if (!timetable) return [];
    const cleanedTimetable = timetable.replace(/,/g, '');
    const times = cleanedTimetable.match(/.{1,5}/g);
    const formattedTimes = times ? times.map(formatTime) : [];
    
    const tableData = [];
    for (let i = 0; i < formattedTimes.length; i += 2) {
      tableData.push([formattedTimes[i], formattedTimes[i + 1] || '']);
    }
    return tableData;
  };

  return (
    <View style={styles.busBox}>
      {/* 버스 번호 헤더 */}
      <View style={styles.busHeader}>
        <Icon name="bus" size={24} color="#008485" />
        <Text style={styles.busNumberText}>{busInfo.busnumber}</Text>
      </View>

      {/* 시간 정보 */}
      <View style={styles.timeInfoContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>{translate('첫차')}</Text>
          <Text style={styles.timeValue}>{formatTime(busInfo.toawfirst)}</Text>
        </View>
        <View style={styles.timeDivider} />
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>{translate('막차')}</Text>
          <Text style={styles.timeValue}>{formatTime(busInfo.toawlast)}</Text>
        </View>
      </View>

      {/* 액션 버튼 */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowRoute(true)}>
          <Icon name="map-outline" size={18} color="#555" />
          <Text style={styles.actionButtonText}>{translate('노선 보기')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowTimetable(true)}>
          <Icon name="time-outline" size={18} color="#555" />
          <Text style={styles.actionButtonText}>{translate('시간표')}</Text>
        </TouchableOpacity>
      </View>

      {/* 노선 모달 */}
      <Modal animationType="slide" transparent={true} visible={showRoute} onRequestClose={() => setShowRoute(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{translate('버스 노선')}</Text>
              <TouchableOpacity onPress={() => setShowRoute(false)}>
                <Icon name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%', paddingHorizontal: 20 }}>
              {translateRouteInfo(busInfo.routeinfo).map((item, index) => (
                <View key={index} style={styles.routeItem}>
                  <View style={styles.routeDot} />
                  <Text style={styles.routeText}>{item}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 시간표 모달 */}
      <Modal animationType="slide" transparent={true} visible={showTimetable} onRequestClose={() => setShowTimetable(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{translate('시간표')}</Text>
              <TouchableOpacity onPress={() => setShowTimetable(false)}>
                <Icon name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%', paddingHorizontal: 20, marginBottom: 20 }}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#eee' }}>
                <Row data={[translate('출발 시간')]} style={styles.tableHead} textStyle={styles.tableHeadText} />
                {formatTimetableData(busInfo.t1wdayt).map((data, index) => (
                  <Row key={index} data={data} textStyle={styles.tableText} style={{ height: 40 }}/>
                ))}
              </Table>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- 메인 컴포넌트 ---
function AirportBusInfo() {
  const [selectedArea, setSelectedArea] = useState('1');
  const [busInfo, setBusInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFavoriteRoute, setSelectedFavoriteRoute] = useState(null);
  const { translate } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const serviceKey = 'bNxy7RPcmy860NJ4E%2B4OWEOJ%2FniUvrEhHvBHdh5RwPNs4Rh%2BFdTCSmtMZUMKFQl%2BoS5BEtC18cgjgFvXw%2FUz%2BQ%3D%3D';
        const url = `http://apis.data.go.kr/B551177/BusInformation/getBusInfo?serviceKey=${serviceKey}&numOfRows=100&pageNo=1&area=${selectedArea}&type=json`;

        const response = await fetch(url);
        const jsonData = await response.json();

        if (jsonData?.response?.body?.items) {
          const translatedBusInfo = jsonData.response.body.items.map(item => ({
            ...item,
            routeinfo_en: item.routeinfo ? item.routeinfo.split(', ').map(location => translate(location, 'en')).join(', ') : ''
          }));
          setBusInfo(translatedBusInfo);
        } else {
          setBusInfo([]);
        }
      } catch (error) {
        console.error('데이터 에러:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedArea, translate]);

  const filteredBusInfo = busInfo.filter(item => {
    return (item.busnumber && item.busnumber.includes(searchText)) ||
           (item.routeinfo && item.routeinfo.includes(searchText)) ||
           (item.routeinfo_en && item.routeinfo_en.toLowerCase().includes(searchText.toLowerCase()));
  });

  const favoriteRoutes = [translate('강남역'), translate('압구정'), translate('홍대'), translate('서울역'), translate('종로')];

  const handleFavoriteRouteClick = (route) => {
    if (selectedFavoriteRoute === route) {
      setSearchText('');
      setSelectedFavoriteRoute(null);
    } else {
      setSearchText(route);
      setSelectedFavoriteRoute(route);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        
        {/* 지역 선택 */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedArea}
            onValueChange={(itemValue) => setSelectedArea(itemValue)}
            style={{ height: 50 }}
          >
            <Picker.Item label={translate('서울')} value="1" />
            <Picker.Item label={translate('경기도')} value="2" />
            <Picker.Item label={translate('인천광역시')} value="3" />
            <Picker.Item label={translate('강원도')} value="4" />
            <Picker.Item label={translate('충청도')} value="5" />
            <Picker.Item label={translate('경상도')} value="6" />
            <Picker.Item label={translate('전라도')} value="7" />
          </Picker>
        </View>

        {/* 검색 바 */}
        <View style={styles.searchWrapper}>
          <Icon name="search-outline" size={20} color="#888" style={{marginLeft: 10}}/>
          <TextInput
            style={styles.searchInput}
            placeholder={translate('버스번호 또는 목적지 검색')}
            onChangeText={text => setSearchText(text)}
            value={searchText}
            clearButtonMode="while-editing"
          />
        </View>

        {/* 칩(Chip) 스타일의 자주 가는 노선 */}
        <Text style={styles.sectionTitle}>{translate('자주 찾는 목적지')}</Text>
        <View style={styles.chipContainer}>
          {favoriteRoutes.map((route, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.chip, selectedFavoriteRoute === route && styles.chipSelected]}
              onPress={() => handleFavoriteRouteClick(route)}
            >
              <Text style={[styles.chipText, selectedFavoriteRoute === route && styles.chipTextSelected]}>
                {route}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 결과 리스트 */}
        <Text style={styles.resultTitle}>{translate('출발 예정 버스')}</Text>
        
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#008485" />
            <Text style={styles.loadingText}>{translate('버스 정보를 불러오는 중입니다...')}</Text>
          </View>
        ) : filteredBusInfo.length > 0 ? (
          filteredBusInfo.map((item, index) => (
            <BusBox key={index} busInfo={item} />
          ))
        ) : (
          <View style={styles.loadingBox}>
            <Text style={{color: '#888'}}>{translate('해당 노선 정보가 없습니다.')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' }, // 전체 배경 통일
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 15,
    justifyContent: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#333', // 이전 검색창 스타일과 통일
    height: 50,
    marginBottom: 20,
  },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 10 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 25 },
  chip: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, // 둥근 알약 형태
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#EDF5F5', borderColor: '#008485' },
  chipText: { fontSize: 14, color: '#555' },
  chipTextSelected: { color: '#008485', fontWeight: 'bold' },
  resultTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 15 },
  
  // BusBox 디자인 개선
  busBox: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  busHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  busNumberText: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginLeft: 8 },
  timeInfoContainer: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 10, padding: 15, marginBottom: 15 },
  timeBlock: { flex: 1, alignItems: 'center' },
  timeLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  timeValue: { fontSize: 18, fontWeight: '700', color: '#333' },
  timeDivider: { width: 1, backgroundColor: '#DDD', marginHorizontal: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 12, borderWidth: 1, borderColor: '#EEE', borderRadius: 10, marginHorizontal: 5
  },
  actionButtonText: { marginLeft: 5, fontSize: 14, fontWeight: '600', color: '#555' },

  // Modal 디자인 개선
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff', height: '80%', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingTop: 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  routeItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  routeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#008485', marginRight: 15 },
  routeText: { fontSize: 16, color: '#333' },
  tableHead: { height: 40, backgroundColor: '#F8F9FA' },
  tableHeadText: { textAlign: 'center', fontWeight: 'bold', color: '#555' },
  tableText: { textAlign: 'center', color: '#333' },
  loadingBox: { paddingVertical: 40, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' }
});

export default AirportBusInfo;