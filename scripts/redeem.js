import { getCurrentTranslation } from './i18n.js';

// ** 더미 API 엔드포인트 ** (실제 백엔드 URL로 변경해야 합니다!)
const API_ENDPOINT = 'YOUR_ACTUAL_API_ENDPOINT_HERE'; 

/**
 * 쿠폰 사용 요청을 처리하고 결과를 콜백 함수로 반환하는 핵심 비즈니스 로직 함수입니다.
 * * @param {object} inputValues - 사용자 입력 값 { server: string, accountName: string, couponCode: string }
 * @param {function(string): void} displayResultCallback - 결과를 View에 표시할 콜백 함수
 * @param {function(boolean, string): void} setUIStateCallback - UI 상태(버튼 비활성화)를 변경할 콜백 함수
 */
export async function requestRedeem(inputValues, displayResultCallback, setUIStateCallback) {
  const langData = getCurrentTranslation();
  const requestBody = {
    AccountName: inputValues.accountName,
    CouponCode: inputValues.couponCode
  };
  
  setUIStateCallback(true, '처리 중...');
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      displayResultCallback(langData.success); 
    } else if (response.status === 400) {
      const errorData = await response.json();
      displayResultCallback(`${langData.failure} ${errorData.ErrorMessage || langData.serverError}`); 
    } else {
      displayResultCallback(langData.serverError);
    }
  } catch (error) {
    console.error('API 요청 실패:', error);
    displayResultCallback(langData.networkError);
  } finally {
    setUIStateCallback(false, langData.redeem_button);
  }
}