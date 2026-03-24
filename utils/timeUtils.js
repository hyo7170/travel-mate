// utils/timeUtils.js

export const getCurrentDateTime = () => {
  const now = new Date();
  
  // 1. 현재 기기/서버의 타임존 오프셋을 구해서 완벽한 UTC(세계 표준시) 밀리초 단위로 변환
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); 
  
  // 2. 한국 시간은 UTC보다 9시간 빠르므로 9시간을 밀리초 단위로 더해줌
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const kstDate = new Date(utc + koreaTimeDiff); // 한국 시간이 적용된 Date 객체

  // 3. 변환된 한국 시간에서 년, 월, 일, 시, 분 추출
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const date = String(kstDate.getDate()).padStart(2, '0');
  const hours = String(kstDate.getHours()).padStart(2, '0');
  const minutes = String(kstDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${date} ${hours}:${minutes}`;
};

export const formatTime = (timeString) => {
  if (!timeString) return ''; 
  
  const hours = timeString.substr(0, 2);
  const minutes = timeString.substr(2);

  return `${hours}:${minutes}`;
};