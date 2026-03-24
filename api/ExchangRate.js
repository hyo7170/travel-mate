import React, { useEffect, useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  TouchableWithoutFeedback 
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useLanguage } from '../components/LanguageContext';
import Icon from 'react-native-vector-icons/Ionicons';

function ExchangeRate() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('USD'); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 금액 상태 관리 (콤마가 포함된 문자열)
  const [foreignAmount, setForeignAmount] = useState('');
  const [krwAmount, setKrwAmount] = useState('');
  
  const { translate } = useLanguage();

  // 1. 환율 데이터 가져오기 (KRW 기준)
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const apiKey = '4lLbGEcNtZyPIm9fUKD9f5XxDFbN3yKa';
        const url = `https://api.currencybeacon.com/v1/latest?base=KRW&symbols=USD,JPY,EUR,VND,LKR,HKD,CNY,TWD&api_key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.response && data.response.rates) {
          const newItems = Object.keys(data.response.rates).map((key) => ({
            label: key.trim(),
            value: key.trim(),
            rate: data.response.rates[key], 
          }));
          setItems(newItems);
        }
      } catch (error) {
        console.error('환율 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  // 유틸리티: 숫자 포맷팅
  const toRawNumber = (str) => str.replace(/[^0-9.]/g, '');
  const numberWithCommas = (x) => {
    if (!x || x === "NaN") return '';
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  // 2. [핵심] 통화(value)가 변경될 때 현재 외화 기준으로 원화 재계산
  useEffect(() => {
    if (value && foreignAmount && items.length > 0) {
      const rawForeign = toRawNumber(foreignAmount);
      const selectedItem = items.find(item => item.value === value);
      
      if (selectedItem && rawForeign) {
        const rate = selectedItem.rate;
        const calculated = parseFloat(rawForeign) / rate;
        setKrwAmount(numberWithCommas(calculated.toFixed(0)));
      }
    }
  }, [value, items]); // 통화가 바뀌거나 아이템이 로드될 때 실행

  // 3. 외화 입력 시 -> 원화 계산
  const handleForeignChange = (text) => {
    const rawValue = toRawNumber(text);
    setForeignAmount(numberWithCommas(rawValue));

    const selectedItem = items.find(item => item.value === value);
    if (selectedItem && rawValue) {
      const rate = selectedItem.rate;
      const calculated = parseFloat(rawValue) / rate;
      setKrwAmount(numberWithCommas(calculated.toFixed(0)));
    } else {
      setKrwAmount('');
    }
  };

  // 4. 원화 입력 시 -> 외화 계산
  const handleKrwChange = (text) => {
    const rawValue = toRawNumber(text);
    setKrwAmount(numberWithCommas(rawValue));

    const selectedItem = items.find(item => item.value === value);
    if (selectedItem && rawValue) {
      const rate = selectedItem.rate;
      const calculated = parseFloat(rawValue) * rate;
      setForeignAmount(numberWithCommas(calculated.toFixed(2)));
    } else {
      setForeignAmount('');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.innerContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>{translate('환율 계산기')}</Text>
            <Text style={styles.subtitle}>{translate('외화와 원화를 양방향으로 확인하세요')}</Text>
          </View>

          {/* 계산기 카드 */}
          <View style={styles.card}>
            <Text style={styles.label}>{translate('통화 선택')}</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              loading={loading}
              placeholder="USD"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropDownBox}
              textStyle={styles.dropdownText}
              zIndex={3000}
              listMode="SCROLLVIEW"
            />

            <View style={styles.spacing} />

            {/* 외화 입력 필드 */}
            <Text style={styles.label}>{translate('외화 금액')} ({value})</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={foreignAmount}
                onChangeText={handleForeignChange}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#ccc"
              />
              <Text style={styles.currencySuffix}>{value}</Text>
            </View>

            {/* 교체 아이콘 */}
            <View style={styles.iconCenter}>
              <Icon name="swap-vertical" size={26} color="#008485" />
            </View>

            {/* 원화 입력 필드 */}
            <Text style={styles.label}>{translate('원화 금액')} (KRW)</Text>
            <View style={[styles.inputWrapper, styles.krwHighlight]}>
              <TextInput
                style={styles.input}
                value={krwAmount}
                onChangeText={handleKrwChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#ccc"
              />
              <Text style={styles.currencySuffix}>KRW</Text>
            </View>
          </View>

          {/* 안내 문구 */}
          <View style={styles.infoBox}>
            <Icon name="information-circle-outline" size={16} color="#999" />
            <Text style={styles.infoText}>
              {translate('통화 변경 시 현재 입력된 금액으로 재계산됩니다.')}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    borderColor: '#EAEAEA',
    borderRadius: 12,
    height: 50,
  },
  dropDownBox: {
    borderColor: '#EAEAEA',
    borderRadius: 12,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '600',
  },
  spacing: {
    height: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
  },
  krwHighlight: {
    borderColor: '#008485', // 원화 입력창 포인트 컬러
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  currencySuffix: {
    fontSize: 14,
    fontWeight: '800',
    color: '#008485',
    marginLeft: 10,
  },
  iconCenter: {
    alignItems: 'center',
    marginVertical: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
  },
});

export default ExchangeRate;