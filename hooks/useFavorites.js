// hooks/useFavorites.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFavorites = (translate) => {
  const [favorites, setFavorites] = useState([]);

  // 컴포넌트가 처음 마운트될 때 즐겨찾기 목록을 불러옵니다.
  useEffect(() => {
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
    loadFavorites();
  }, []);

  // 즐겨찾기를 저장하는 내부 함수
  const saveFavorites = async (updatedFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('즐겨찾기를 저장하는 중 에러 발생:', error);
    }
  };

  // Toast 메시지 띄우는 내부 함수
  const showToast = (message) => {
    Alert.alert(message);
  };

  // 즐겨찾기 추가/해제 토글 함수
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
      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };

  // 메인 컴포넌트에서 사용할 수 있도록 상태와 함수를 반환합니다.
  return { favorites, toggleFavorite };
};