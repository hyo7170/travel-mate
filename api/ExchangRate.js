import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'; // Keyboard 추가
import DropDownPicker from 'react-native-dropdown-picker';
import { useLanguage } from '../components/LanguageContext';

function ExchangeRate() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
  const { translate } = useLanguage();

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const apiKey = '4lLbGEcNtZyPIm9fUKD9f5XxDFbN3yKa';
        const baseUrl = 'https://api.currencybeacon.com/v1';
        const endpoint = '/latest';
        const baseCurrency = 'KRW';
        const symbols = 'USD,JPY,EUR,VND,LKR,HKD,CNY,TWD';

        const url = `${baseUrl}${endpoint}?base=${baseCurrency}&symbols=${symbols}&api_key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        const newItems = Object.keys(data.response.rates).reduce((acc, key) => {
          const rate = data.response.rates[key];
          if (rate !== null) {
            acc.push({
              label: key.trim(),
              value: key.trim(),
              rate: rate.toString(),
            });
          }
          return acc;
        }, []);

        setItems(newItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (value && amount) {
      const rate = items.find((item) => item.value === value)?.rate;
      if (rate) {
        const calculated = (1 / parseFloat(rate.replace(/,/g, ''))) * parseFloat(amount.replace(/,/g, ''));
        setConvertedAmount(calculated);
      }
    } else {
      setConvertedAmount(0); // 금액 입력이 비어있을 때 원화 금액을 0으로 설정
    }
  }, [value, amount, items]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      (e) => {
        setKeyboardVerticalOffset(e.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVerticalOffset(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{translate('간편한 환율 계산기')}</Text>
        <Text style={styles.subtitle}>{translate('현지 통화를 간편하게 계산해보세요.')}</Text>
        <Text style={styles.info}>
          {translate('지원 통화')}
          {'\n'}
          USD, JPY, EUR, VND, LKR, HKD, CNY, TWD
        </Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          loading={loading}
          placeholder={translate('통화를 선택하세요.')}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropDownContainerStyle}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            const newText = text.replace(/[^0-9]/g, '');
            setAmount(numberWithCommas(newText));
            if (newText === '') {
              setConvertedAmount(0); // 입력이 비어있을 때 원화 금액을 0으로 설정
            }
          }}
          value={amount}
          placeholder={translate('금액을 입력하세요')}
          keyboardType="numeric"
        />
        <Text style={styles.result}>
          {translate('KRW 금액')} : {numberWithCommas(convertedAmount.toFixed())} KRW
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 10,
    backgroundColor: '#F3F3F3',
    padding: 5,
  },
  dropdownContainer: {
    marginBottom: 20,
    height: 50,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderRadius: 10,
  },
  dropdownText: {
    color: '#333333',
  },
  dropDownContainerStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
  },
  input: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#09AA5C',
    textAlign: 'center',
  },
});

export default ExchangeRate;
