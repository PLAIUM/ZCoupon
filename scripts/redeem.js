import { getLanguageData } from './i18n.js';

// ** 더미 API 엔드포인트 **
// 각 서버 URL로 변경해야 합니다.
// 서버에서는 Cross-Origin Resource Sharing(CORS) 설정이 올바르게 구성되어 있는지 확인해주세요.
const _API_ENDPOINTS = {
  'EARTH': 'https://localhost:7158/api/Coupon/RedeemCoupon',
  'MARS': 'https://localhost:7158/api/Coupon/RedeemCoupon',
  'VENUS': 'https://localhost:7158/api/Coupon/RedeemCoupon',
  'PLUTO': 'https://localhost:7158/api/Coupon/RedeemCoupon',
  'JUPITER': 'https://localhost:7158/api/Coupon/RedeemCoupon',
};
export const SERVER_NAMES = Object.keys(_API_ENDPOINTS);

Object.freeze(_API_ENDPOINTS);
Object.freeze(SERVER_NAMES);

/**
 * 쿠폰 사용 요청을 처리하고 결과 메시지를 반환합니다.
 * @param {string} serverName - 서버 이름
 * @param {string} accountName - 복구 이메일
 * @param {string} couponCode - 쿠폰 번호
 * @returns {Promise<string>} 결과 메시지
 */
export async function requestRedeem(serverName, accountName, couponCode) {
  const languageData = getLanguageData();

  if (!_isValidServerName(serverName)) {
    return `${languageData.invalidServerName}\n[${serverName}]`;
  }

  if (!_isValidEmail(accountName)) {
    return `${languageData.invalidAccountName}\n[${accountName}]`;
  }

  if (!_isValidCouponCode(couponCode)) {
    return `${languageData.invalidCouponCode}\n[${couponCode}]`;
  }

  const endpoint = _API_ENDPOINTS[serverName];
  const requestBody = {
    accountName,
    couponCode
  };
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      return languageData.success;
    }
    
    if (response.status === 400) {
      const errorData = await response.json();
      return `${languageData.failure}\n[${languageData[errorData.errorCode] || languageData.serverError}]`;
    }
    
    return languageData.serverError;
  }
  catch (error) {
    return languageData.networkError;
  }
}

function _isValidServerName(name) {
  return SERVER_NAMES.includes(name);
}

function _isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function _isValidCouponCode(code) {
  const couponRegex = /^[A-Z0-9]{8,12}$/;
  return couponRegex.test(code);
}
