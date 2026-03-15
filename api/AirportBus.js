import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../components/LanguageContext'; // 언어 설정을 가져옵니다.
import { Table, Row, Rows } from 'react-native-table-component';

// 각 버스 정보를 보여주는 컴포넌트
function BusBox({ busInfo }) {
  const [showRoute, setShowRoute] = useState(false);
  const [showTimetable, setShowTimetable] = useState(false);
  const { translate } = useLanguage(); // useLanguage 훅을 통해 translate 함수를 가져옵니다.

  const handleRouteCheck = () => {
    setShowRoute(true);
    console.log(`노선 확인: ${busInfo.routeinfo}`);
  };

  const handleTimetableCheck = () => {
    setShowTimetable(true);
    console.log(`시간표 확인: ${busInfo.t1wdayt}`);
  };

  // 시간을 00:00 형식으로 변환하는 함수
  const formatTime = (time) => {
    if (!time) return ''; // null 또는 undefined인 경우 빈 문자열 반환
    const hours = time.substring(0, 2); // 시간 부분 추출
    const minutes = time.substring(2); // 분 부분 추출
    return `${hours}:${minutes}`;
  };

  // 노선 정보를 번역하는 함수
  const translateRouteInfo = (routeInfo) => {
    if (!routeInfo) return []; // routeInfo가 null이거나 값이 없는 경우 빈 배열 반환

    // 모든 구분자를 처리하기 위해 정규 표현식을 사용
    const locations = routeInfo.split(/,\s*|\s+/);

    // locations 배열을 번역하여 반환
    return locations.map(location => translate(location));
  };

  // 시간표 데이터를 테이블 형식으로 변환하는 함수
  const formatTimetableData = (timetable) => {
    if (!timetable) {
      return [];
    }

    // 쉼표 제거
    const cleanedTimetable = timetable.replace(/,/g, '');

    // 시간표 문자열을 4자리씩 분리
    const times = cleanedTimetable.match(/.{1,5}/g);

    // 분리된 시간들을 형식에 맞게 변환
    const formattedTimes = times.map(formatTime);

    // 변환된 시간들을 2개씩 묶어서 테이블 데이터로 저장
    const tableData = [];
    for (let i = 0; i < formattedTimes.length; i += 2) {
      tableData.push([formattedTimes[i], formattedTimes[i + 1]]);
    }

    // 저장된 테이블 데이터를 반환
    return tableData;
  };

  return (
    <View style={styles.busBox}>
      <Text style={styles.busInfoText}>{translate('버스번호')}: {busInfo.busnumber}</Text>
      <Text style={styles.busInfoText}>{translate('첫차')}: {formatTime(busInfo.toawfirst)}</Text>
      <Text style={styles.busInfoText}>{translate('막차')}: {formatTime(busInfo.toawlast)}</Text>
      <TouchableOpacity style={styles.button} onPress={handleRouteCheck}>
        <Text style={styles.buttonText}>{translate('노선 확인하기')}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false} // 전체 화면을 위해 transparent를 false로 설정
        visible={showRoute}
        onRequestClose={() => setShowRoute(false)}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.fullScreenModalContent}>
            <Text style={styles.modalTitle}>{translate('노선')}</Text>
            <ScrollView style={{ width: '100%' }}>
              {translateRouteInfo(busInfo.routeinfo).map((item, index) => (
                <Text key={index} style={styles.modalText}>{item}</Text>
              ))}
            </ScrollView>
            <Button title={translate('닫기')} onPress={() => setShowRoute(false)} />
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.button} onPress={handleTimetableCheck}>
        <Text style={styles.buttonText}>{translate('시간표 확인하기')}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false} // 전체 화면을 위해 transparent를 false로 설정
        visible={showTimetable}
        onRequestClose={() => setShowTimetable(false)}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.fullScreenModalContent}>
            <Text style={styles.modalTitle}>{translate('공항버스 시간표')}</Text>
            <ScrollView style={{ width: '100%' }}>
              <Table borderStyle={{ borderWidth: 1 }}>
                <Row data={[translate('인천공항 출발시간')]} style={styles.head} textStyle={styles.tableText} />
                {formatTimetableData(busInfo.t1wdayt).map((data, index) => (
                  <Row key={index} data={data} textStyle={styles.tableText} />
                ))}
              </Table>
            </ScrollView>
            <Button title={translate('닫기')} onPress={() => setShowTimetable(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 공항 버스 정보를 표시하는 컴포넌트
function AirportBusInfo() {
  const [selectedArea, setSelectedArea] = useState('1');
  const [busInfo, setBusInfo] = useState(null);
  const [searchText, setSearchText] = useState(''); // 검색어 상태 추가
  const [selectedFavoriteRoute, setSelectedFavoriteRoute] = useState(null); // 선택된 노선 상태 추가
  const { translate } = useLanguage(); // useLanguage 훅을 통해 translate 함수를 가져옵니다.

useEffect(() => {
  const fetchData = async () => {
    try {
      const serviceKey = 'bNxy7RPcmy860NJ4E%2B4OWEOJ%2FniUvrEhHvBHdh5RwPNs4Rh%2BFdTCSmtMZUMKFQl%2BoS5BEtC18cgjgFvXw%2FUz%2BQ%3D%3D';
      const numOfRows = '100';
      const pageNo = '1';
      const area = selectedArea;
      const type = 'json';

      // API 요청 URL 생성
      const url = `http://apis.data.go.kr/B551177/BusInformation/getBusInfo?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&area=${area}&type=${type}`;

      // API 호출
      const response = await fetch(url);
      const jsonData = await response.json();

      // 응답 데이터를 한글과 영어로 번역하여 설정
      const translatedBusInfo = jsonData.response.body.items.map(item => ({
        ...item,
        routeinfo_en: item.routeinfo ? item.routeinfo.split(', ').map(location => translate(location, 'en')).join(', ') : ''
      }));

      // 번역된 데이터를 상태에 설정
      setBusInfo(translatedBusInfo);
    } catch (error) {
      console.error('데이터를 불러오는 중 에러 발생:', error);
    }
  };

  fetchData();
}, [selectedArea, translate]); // translate 추가

  // 검색어를 이용하여 버스 정보 필터링
  const filteredBusInfo = busInfo ?
    busInfo.filter(item => {
      return (item.busnumber && item.busnumber.includes(searchText)) ||
        (item.routeinfo && item.routeinfo.includes(searchText)) ||
        (item.routeinfo_en && item.routeinfo_en.includes(searchText));
    }) : [];

  // 자주가는 버스 노선 리스트
  const favoriteRoutes = [
    translate('강남역'),
    translate('압구정'),
    translate('홍대'),
    translate('서울역'),
    translate('종로')
  ]; // 예시로 3개의 자주가는 버스 노선을 설정

  // 즐겨찾기 노선 버튼 클릭 핸들러
  const handleFavoriteRouteClick = (route) => {
    setSearchText(route);
    setSelectedFavoriteRoute(route); // 선택된 노선 업데이트
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 20 }}>
        {/* 지역 선택 피커 */}
        <View style={styles.pickercontainer}>
          <Picker
            selectedValue={selectedArea}
            onValueChange={(itemValue, itemIndex) => setSelectedArea(itemValue)}
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
        <TextInput
          style={styles.searchInput}
          placeholder={translate('버스번호 또는 노선을 검색하세요')}
          onChangeText={text => setSearchText(text)}
          value={searchText}
        />
        {/* 자주가는 노선 버튼 */}
        <View>
          <Text style={styles.text1}>{translate('자주가는 도착지')}</Text>
          <View style={styles.favoriteRoutesContainer}>
            {favoriteRoutes.map((route, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.favoriteRouteButton,
                  selectedFavoriteRoute === route && styles.selectedFavoriteRouteButton
                ]}
                onPress={() => handleFavoriteRouteClick(route)}
              >
                <Text
                  style={[
                    styles.favoriteRouteButtonText,
                    selectedFavoriteRoute === route && styles.selectedFavoriteRouteButtonText
                  ]}
                >
                  {route}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* 버스 정보 표시 */}
        {filteredBusInfo.length > 0 ? (
          <View>
            <Text style={styles.resultText}>{translate('인천공항에서 출발하는 버스 정보를 확인하세요')}</Text>
            {filteredBusInfo.map((item, index) => (
              <BusBox key={index} busInfo={item} />
            ))}
          </View>
        ) : (
          <Text style={styles.resultText}>{translate('노선정보를 불러오고 있습니다')}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  busBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  busInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#09AA5C',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  fullScreenModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  favoriteRoutesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // flexWrap을 추가하여 줄바꿈이 되도록 설정
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  favoriteRouteButton: {
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5, // 버튼 간에 세로 간격 추가
    width: '45%', // 버튼의 너비를 45%로 설정하여 두 줄로 배치
  },
  selectedFavoriteRouteButton: {
    backgroundColor: '#09AA5C',
  },
  favoriteRouteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedFavoriteRouteButtonText: {
    color: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f1f1',
  },
  tableText: {
    margin: 6,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight:'bold',
  },
    text1: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight:'bold',
  },
  pickercontainer:{
    borderWidth: 2,
    borderRadius: 11,
    borderColor: '#ddd', // 테두리 색상을 회색에서 연한 회색으로 변경합니다.
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 2,
    paddingHorizontal: 10, // 양쪽에 여백을 추가합니다.
  }
});

export default AirportBusInfo;
