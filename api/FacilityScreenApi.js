import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TextInput, 
  FlatList, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../components/LanguageContext';

const FacilityScreen = () => {
  const [facilityData, setFacilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categorizedData, setCategorizedData] = useState({
    라운지: [], 편의점: [], 카페: [], 면세: [], 은행: [], 로밍: [], 음식점: [],
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { translate } = useLanguage();

  // 카테고리별 아이콘 매핑
  const categoryIcons = {
    라운지: 'business-outline',
    편의점: 'cart-outline',
    카페: 'cafe-outline',
    면세: 'gift-outline',
    은행: 'cash-outline',
    로밍: 'planet-outline',
    음식점: 'restaurant-outline',
  };

  const categorizeData = useCallback(() => {
    const categories = { 라운지: [], 편의점: [], 카페: [], 면세: [], 은행: [], 로밍: [], 음식점: [] };
    const keywords = {
      라운지: ['라운지'],
      편의점: ['CU', '세븐일레븐', 'GS25'],
      카페: ['커피', '카페', '스타벅스', '공차', '빵', '디저트'],
      면세: ['화장품', '향수', '시계', '가방', '패션', '면세'],
      은행: ['은행', '환전'],
      로밍: ['로밍', '통신'],
      음식점: ['롯데', '분식', '메밀', '피자', '밥', '돈까스', '맥주', '만두', '국수', '짬뽕', '김치찌개', '푸드가든', '식당'],
    };

    facilityData.response.body.items.forEach(item => {
      Object.keys(keywords).forEach(category => {
        const isMatched = keywords[category].some(keyword => item.entrpskoreannm.includes(keyword));
        if (isMatched) {
          categories[category].push(item);
        }
      });
    });
    setCategorizedData(categories);
  }, [facilityData]);

  const fetchFacilityData = useCallback(async () => {
    setLoading(true);
    const serviceKey = 'bNxy7RPcmy860NJ4E+4OWEOJ/niUvrEhHvBHdh5RwPNs4Rh+FdTCSmtMZUMKFQl+oS5BEtC18cgjgFvXw/Uz+Q==';
    const url = `http://apis.data.go.kr/B551177/StatusOfFacility/getFacilityKR?serviceKey=${encodeURIComponent(serviceKey)}&type=json&numOfRows=300&pageNo=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setFacilityData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFacilityData(); }, [fetchFacilityData]);
  useEffect(() => { if (facilityData) categorizeData(); }, [facilityData, categorizeData]);

  const filteredData = selectedCategory ? categorizedData[selectedCategory].filter(item =>
    item.entrpskoreannm.includes(searchQuery) ||
    item.trtmntprdlstkoreannm.includes(searchQuery) ||
    item.lckoreannm.includes(searchQuery)
  ) : [];

  const translateProductNames = (productNames) => {
    if (!productNames) return '';
    return productNames.split(',').map(name => translate(name.trim())).join(', ');
  };

  // 개별 시설 카드 렌더링 함수
  const renderFacilityItem = ({ item }) => (
    <View style={styles.facilityCard}>
      <Text style={styles.facilityTitle}>{translate(item.entrpskoreannm)}</Text>
      <View style={styles.divider} />
      <View style={styles.infoRow}>
        <Icon name="cube-outline" size={14} color="#666" />
        <Text style={styles.facilityDetail}>{translateProductNames(item.trtmntprdlstkoreannm)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="location-outline" size={14} color="#666" />
        <Text style={styles.facilityDetail}>{translate(item.lckoreannm)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="time-outline" size={14} color="#666" />
        <Text style={styles.facilityDetail}>{translate(item.servicetime)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="call-outline" size={14} color="#666" />
        <Text style={styles.facilityDetail}>{item.tel || '-'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>{translate('인천공항 시설 안내')}</Text>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#008485" />
          <Text style={styles.loadingText}>{translate('정보를 불러오고 있습니다...')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.categoryGrid}>
          {Object.keys(categorizedData).map(category => (
            <TouchableOpacity
              key={category}
              style={styles.categoryCard}
              onPress={() => setSelectedCategory(category)}
            >
              <View style={styles.iconCircle}>
                <Icon name={categoryIcons[category]} size={28} color="#008485" />
              </View>
              <Text style={styles.categoryCardText}>{translate(category)}</Text>
              <Text style={styles.countText}>{categorizedData[category].length}개</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* 시설 리스트 모달 */}
      <Modal visible={!!selectedCategory} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setSelectedCategory(null); setSearchQuery(''); }}>
              <Icon name="chevron-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{translate(selectedCategory)}</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#999" style={{ marginLeft: 12 }} />
            <TextInput
              style={styles.searchBar}
              placeholder={translate('업체명 또는 위치 검색')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>

          <FlatList
            data={filteredData}
            renderItem={renderFacilityItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            initialNumToRender={10}
            windowSize={5}
            ListEmptyComponent={
              <View style={styles.centerBox}>
                <Text style={styles.emptyText}>{translate('검색 결과가 없습니다.')}</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F0F2F5' },
  titleContainer: { paddingVertical: 20, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  mainTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  categoryGrid: { padding: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: {
    backgroundColor: '#fff',
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
  },
  iconCircle: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#E6F3F3', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  categoryCardText: { fontSize: 16, fontWeight: '700', color: '#333' },
  countText: { fontSize: 12, color: '#008485', marginTop: 4, fontWeight: '600' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { marginTop: 15, color: '#666' },
  modalContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#fff' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', margin: 15, borderRadius: 12, borderWidth: 1, borderColor: '#DDD', height: 48 },
  searchBar: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: '#333' },
  listContent: { paddingHorizontal: 15, paddingBottom: 30 },
  facilityCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  facilityTitle: { fontSize: 17, fontWeight: '800', color: '#008485', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  facilityDetail: { fontSize: 14, color: '#444', marginLeft: 8, flex: 1, lineHeight: 20 },
  emptyText: { color: '#999', fontSize: 16 }
});

export default FacilityScreen;