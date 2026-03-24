// hooks/useFlightData.js
import { useState, useEffect } from 'react';

export const useFlightData = (type = 'dep') => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flightCount, setFlightCount] = useState(0); // 👈 전체 개수 상태 추가
  const [cityFlightCounts, setCityFlightCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const serviceKey = 'bNxy7RPcmy860NJ4E%2B4OWEOJ%2FniUvrEhHvBHdh5RwPNs4Rh%2BFdTCSmtMZUMKFQl%2BoS5BEtC18cgjgFvXw%2FUz%2BQ%3D%3D';
        const endpoint = type === 'dep' ? 'getPassengerDeparturesOdp' : 'getPassengerArrivalsOdp';
        
        const cityCodes = ['HAN','SGN','DAD','TPE', 'NRT','HND','KIX','FUK','CTS','CGK','SIN','BKK','CNX','KUL','CRK','MNL','PNH','CMB'];
        
        const apiRequests = cityCodes.map(cityCode =>
          fetch(`http://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp/${endpoint}?serviceKey=${serviceKey}&from_time=0000&to_time=2400&type=json&airport=${cityCode}`)
        );

        const responses = await Promise.all(apiRequests);
        const fetchedData = await Promise.all(responses.map(res => res.json()));

        setResponseData(fetchedData);

        // 1. 도시별 개수 계산
        const cityCounts = {};
        // 2. 전체 항공편 개수 계산 (합산)
        let totalCount = 0;

        fetchedData.forEach(response => {
          const items = response?.response?.body?.items || [];
          if (items.length > 0) {
            const airportCode = items[0].airportCode;
            cityCounts[airportCode] = items.length;
            totalCount += items.length; // 👈 각 도시 개수를 합산
          }
        });

        setCityFlightCounts(cityCounts);
        setFlightCount(totalCount); // 👈 최종 합계 저장

      } catch (error) {
        console.error(`${type} 데이터 호출 에러:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  // 3. flightCount를 반환값에 포함시킵니다.
  return { responseData, loading, flightCount, cityFlightCounts };
};