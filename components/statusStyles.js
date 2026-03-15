//출발편 항공 상태값
const getStatusTextStyle = (status) => {
  switch (status) {
    case '출발':
      return { color: 'green' }; // 출발 상태는 초록색으로 설정
    case '결항':
      return { color: 'orange' }; // 결항 상태는 빨간색으로 설정
    case '지연':
      return { color: 'red' }; // 지연 상태는 노란색으로 설정
    case '마감예정':
      return { color: 'purple' }; // 마감 예정 상태는 보라색으로 설정
    case '체크인오픈':
      return { color: 'blue' }; // 체크인 오픈 상태는 파란색으로 설정
    case '탑승준비':
      return { color: '#00E2C3' }; // 체크인 오픈 상태는 파란색으로 설정+
    case '탑승중':
      return { color: '#FFF700' }; // 체크인 오픈 상태는 파란색으로 설정      
    case '탑승마감':
      return { color: '#004BE2' }; // 체크인 오픈 상태는 파란색으로 설정           
    default:
      return {}; // 기본값은 스타일을 변경하지 않음
  }
};

export default getStatusTextStyle;
