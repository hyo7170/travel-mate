// components/FlightCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../components/LanguageContext'; 
import airlineLogos from '../assets/airlineLogos'; 
import getStatusTextStyle from '../components/statusStyles'; 
import { formatTime } from '../utils/timeUtils'; 

// type prop을 추가로 받습니다 (기본값은 'dep')
const FlightCard = ({ item, isFavorite, onToggleFavorite, type = 'dep' }) => {
  const { translate } = useLanguage();

  const getTerminalName = (id) => {
    if (id === 'P01') return translate('1터미널');
    if (id === 'P02') return translate('1터미널 탑승동');
    if (id === 'P03') return translate('2터미널');
    return id || '-';
  };

  const isArrival = type === 'arr';

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.logoWrapper}>
          {airlineLogos[item.airline] ? (
            <Image source={airlineLogos[item.airline]} style={styles.logo} />
          ) : (
            <Text style={styles.fallbackAirlineText}>{translate(item.airline)}</Text>
          )}
        </View>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Icon 
            name={isFavorite ? "star" : "star-outline"} 
            size={24} 
            color={isFavorite ? "#FFCC00" : "#D1D1D1"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.flightNameRow}>
        <Text style={styles.airlineName}>{translate(item.airline)}</Text>
        <Text style={styles.flightId}>{item.flightId}</Text>
        {item.codeshare === "Slave" && (
          <View style={styles.codeshareBadge}>
            <Text style={styles.codeshareText}>{translate('코드쉐어')}</Text>
          </View>
        )}
      </View>

      <View style={styles.mainInfoRow}>
        <View style={styles.destinationBox}>
          {/* 타입에 따라 라벨 분기 */}
          <Text style={styles.infoLabel}>
            {isArrival ? translate('출발공항') : translate('도착공항')}
          </Text>
          <Text style={styles.destinationText} numberOfLines={1}>
            {translate(item.airport)}
          </Text>
          <Text style={styles.cityCodeText}>{item.cityCode}</Text>
        </View>

        <View style={styles.timeBox}>
          {/* 타입에 따라 시간 라벨 분기 */}
          <Text style={styles.infoLabel}>
            {isArrival ? translate('도착 시간') : translate('출발 시간')}
          </Text>
          <Text style={styles.timeText}>{formatTime(item.scheduleDateTime)}</Text>
          
          {item.estimatedDateTime && item.estimatedDateTime !== item.scheduleDateTime && (
            <Text style={styles.changedTimeText}>
              <Icon name="alert-circle" size={12} /> {formatTime(item.estimatedDateTime)} {translate('변경')}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{translate('터미널')}</Text>
          <Text style={styles.detailValue}>{getTerminalName(item.terminalId)}</Text>
        </View>
        <View style={styles.detailItem}>
          {/* 수하물 vs 체크인 분기 */}
          <Text style={styles.detailLabel}>
            {isArrival ? translate('수하물') : translate('체크인')}
          </Text>
          <Text style={styles.detailValue}>
            {isArrival ? (item.carousel || '-') : (item.chkinrange || '-')}
          </Text>
        </View>
        <View style={styles.detailItem}>
          {/* 출구 vs 탑승구 분기 */}
          <Text style={styles.detailLabel}>
            {isArrival ? translate('출구') : translate('탑승구')}
          </Text>
          <Text style={styles.detailValue}>{item.gatenumber || '-'}</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>{translate('현재 상태')}</Text>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, getStatusTextStyle(item.remark)]}>
            {translate(item.remark)}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ... 스타일은 이전과 완전히 동일하게 유지 ...
const styles = StyleSheet.create({
  cardContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  logoWrapper: { height: 24, justifyContent: 'center' },
  logo: { width: 120, height: 24, resizeMode: 'contain' },
  fallbackAirlineText: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  favoriteButton: { padding: 4 },
  flightNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  airlineName: { fontSize: 16, fontWeight: '600', color: '#666', marginRight: 6 },
  flightId: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  codeshareBadge: { backgroundColor: '#F1F3F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
  codeshareText: { fontSize: 11, fontWeight: '700', color: '#868E96' },
  mainInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  destinationBox: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 4, fontWeight: '500' },
  destinationText: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  cityCodeText: { fontSize: 14, color: '#008485', fontWeight: '700', marginTop: 2 },
  timeBox: { alignItems: 'flex-end' },
  timeText: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  changedTimeText: { fontSize: 13, color: '#FF3B30', fontWeight: '600', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#F1F3F5', marginBottom: 16 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8F9FA', padding: 12, borderRadius: 12, marginBottom: 16 },
  detailItem: { flex: 1, alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  detailValue: { fontSize: 15, fontWeight: '700', color: '#333' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLabel: { fontSize: 13, fontWeight: '600', color: '#666' },
  statusBadge: { backgroundColor: '#EDF5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { fontSize: 14, fontWeight: '800', color: '#008485' },
});

export default FlightCard;