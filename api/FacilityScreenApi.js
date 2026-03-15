import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { useLanguage } from '../components/LanguageContext';

const FacilityScreen = () => {
  const [facilityData, setFacilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categorizedData, setCategorizedData] = useState({
    라운지: [],
    편의점: [],
    카페: [],
    면세: [],
    은행: [],
    로밍: [],
    음식점: [],
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { translate } = useLanguage();

  const categorizeData = useCallback(() => {
    const categories = {
      라운지: [],
      편의점: [],
      카페: [],
      면세: [],
      은행: [],
      로밍: [],
      음식점: [],
    };

    const keywords = {
      라운지: ['라운지'],
      편의점: ['CU', '세븐일레븐', 'GS25'],
      카페: ['커피', '카페', '스타벅스', '공차', '빵'],
      면세: ['화장품', '향수', '시계', '가방', '패션'],
      은행: ['은행', '환전'],
      로밍: ['로밍'],
      음식점: ['롯데', '분식', '메밀', '피자', '밥', '돈까스', '맥주', '만두', '국수', '짬뽕', '김치찌개', '푸드가든'],
    };

    facilityData.response.body.items.forEach(item => {
      Object.keys(keywords).forEach(category => {
        keywords[category].forEach(keyword => {
          if (item.entrpskoreannm.includes(keyword)) {
            categories[category].push(item);
          }
        });
      });
    });

    setCategorizedData(categories);
  }, [facilityData]);

  const fetchFacilityData = useCallback(async () => {
    setLoading(true);
    const serviceKey = 'bNxy7RPcmy860NJ4E+4OWEOJ/niUvrEhHvBHdh5RwPNs4Rh+FdTCSmtMZUMKFQl+oS5BEtC18cgjgFvXw/Uz+Q==';
    const type = 'json';
    const numOfRows = '200';
    const pageNo = '1';

    const url = `http://apis.data.go.kr/B551177/StatusOfFacility/getFacilityKR?serviceKey=${encodeURIComponent(serviceKey)}&facility_nm=&type=${encodeURIComponent(type)}&numOfRows=${encodeURIComponent(numOfRows)}&pageNo=${encodeURIComponent(pageNo)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Facility Data:', data);
      setFacilityData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilityData();
  }, [fetchFacilityData]);

  useEffect(() => {
    if (facilityData) {
      categorizeData();
    }
  }, [facilityData, categorizeData]);

  const filterData = () => {
    if (!selectedCategory) return [];

    return categorizedData[selectedCategory].filter(item =>
      item.entrpskoreannm.includes(searchQuery) ||
      item.trtmntprdlstkoreannm.includes(searchQuery) ||
      item.lckoreannm.includes(searchQuery)
    );
  };

  const translateProductNames = (productNames) => {
    return productNames.split(',').map(name => translate(name.trim())).join(', ');
  };

  const filteredData = filterData();

  return (
    <View style={{ flex: 1 }}>
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{translate('인천공항 시설 안내')}</Text>
    </View>
      <ScrollView style={styles.categoryContainer}>
        {Object.keys(categorizedData).map(category => (
          <TouchableOpacity
            key={category}
            style={styles.categoryButton}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{translate(category)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.contentContainer}>
        {loading && <Text>{translate('공항 시설정보를 불러오고 있습니다.')}</Text>}
        {error && <Text>{translate('일시적인 오류가 발생했습니다.')}</Text>}
        <Modal
          visible={!!selectedCategory}
          animationType="slide"
          onRequestClose={() => setSelectedCategory(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.headerContent}>
                {selectedCategory && (
                  <Text style={styles.categoryTitle}>{translate(selectedCategory)}</Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
              {selectedCategory && (
                <TextInput
                  style={styles.searchBar}
                  placeholder={translate('검색어를 입력하세요')}
                  value={searchQuery}
                  onChangeText={text => setSearchQuery(text)}
                />
              )}
            </View>
            <ScrollView style={styles.scrollView}>
              <View style={styles.scrollContent}>
                {filteredData.map((item, index) => (
                  <View key={index} style={styles.itemContainer}>
                        <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>{translate('업체명')}: </Text>{translate(item.entrpskoreannm)}</Text>
                        <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>{translate('상품')}: </Text>{translateProductNames(item.trtmntprdlstkoreannm)}</Text>
                        <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>{translate('위치')}: </Text>{translate(item.lckoreannm)}</Text>
                        <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>{translate('서비스 시간')}: </Text>{translate(item.servicetime)}</Text>
                        <Text style={styles.itemText}>
                          <Text style={{ fontWeight: 'bold' }}>{translate('도착 또는 출발')}: </Text>
                          {item.arrordep === 'D' ? translate('출발') : item.arrordep === 'A' ? translate('도착') : ''}
                        </Text>
                        <Text style={styles.itemText}><Text style={{ fontWeight: 'bold' }}>{translate('전화번호')}: </Text>{translate(item.tel)}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: '#fffff',
    paddingVertical: 10,
  },
  categoryButton: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 11,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,

  },
  titleContainer: {
    backgroundColor: '#fffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default FacilityScreen;