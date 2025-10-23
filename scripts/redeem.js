import { getLanguageData } from './i18n.js';

// ** 더미 API 엔드포인트 ** (실제 백엔드 URL로 변경해야 합니다!)
const API_ENDPOINT = 'YOUR_ACTUAL_API_ENDPOINT_HERE'; 

/**
 * 쿠폰 사용 요청을 처리하고 결과 메시지를 반환합니다.
 * @param {object} inputValues - 사용자 입력 값 { server: string, accountName: string, couponCode: string }
 * @returns {Promise<string>} 결과 메시지
 */
export async function requestRedeem(inputValues) {
  const languageData = getLanguageData();
  const requestBody = {
    AccountName: inputValues.accountName,
    CouponCode: inputValues.couponCode
  };
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      return languageData.success;
    }
    
    if (response.status === 400) {
      const errorData = await response.json();
      return `${languageData.failure} ${errorData.ErrorMessage || languageData.serverError}`;
    }
    
    return languageData.serverError;
  }
  catch (error) {
    console.error('API request failed:', error);
    return languageData.networkError;
  }
}
