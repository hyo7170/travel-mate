// // api.js
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const serviceKey = 'bNxy7RPcmy860NJ4E%2B4OWEOJ%2FniUvrEhHvBHdh5RwPNs4Rh%2BFdTCSmtMZUMKFQl%2BoS5BEtC18cgjgFvXw%2FUz%2BQ%3D%3D';

// const fetchFlightData = async (cityCodes) => {
//   let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
//   queryParams += '&' + encodeURIComponent('from_time') + '=' + encodeURIComponent('0000');
//   queryParams += '&' + encodeURIComponent('to_time') + '=' + encodeURIComponent('2400');
//   queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');

//   const apiRequests = cityCodes.map(cityCode =>
//     fetch(`http://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp/getPassengerDeparturesOdp${queryParams}&${encodeURIComponent('airport')}=${encodeURIComponent(cityCode)}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   );

//   const responses = await Promise.all(apiRequests);

//   const responseData = await Promise.all(responses.map(async response => {
//     if (!response.ok) {
//       throw new Error('네트워크 요청에 실패했습니다.');
//     }
//     const json = await response.json();
//     console.log(json);
//     return json;
//   }));

//   return responseData;
// };

// const loadFavorites = async () => {
//   try {
//     const storedFavorites = await AsyncStorage.getItem('favorites');
//     if (storedFavorites) {
//       return JSON.parse(storedFavorites);
//     }
//   } catch (error) {
//     console.error('즐겨찾기를 불러오는 중 에러 발생:', error);
//   }
//   return [];
// };

// const saveFavorites = async (favorites) => {
//   try {
//     await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
//   } catch (error) {
//     console.error('즐겨찾기를 저장하는 중 에러 발생:', error);
//   }
// };

// export { fetchFlightData, loadFavorites, saveFavorites };
