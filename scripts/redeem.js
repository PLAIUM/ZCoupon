import { getLanguageData } from './i18n.js';

// ** 더미 API 엔드포인트 ** (실제 백엔드 URL로 변경해야 합니다!)
const API_ENDPOINTS = {
  'earth': 'https://api.example.com/earth/redeem',
  'mars': 'https://api.example.com/marth/redeem',
  'venus': 'https://api.example.com/venus/redeem',
  'pluto': 'https://api.example.com/pluto/redeem',
  'jupiter': 'https://api.example.com/jupiter/redeem',
};
export const SERVER_NAMES = Object.keys(API_ENDPOINTS);

Object.freeze(API_ENDPOINTS);
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

  if (!isValidServerName(serverName)) {
    return `${languageData.invalidServerName} [${serverName}]`;
  }

  if (!isValidEmail(accountName)) {
    return `${languageData.invalidAccountName} [${accountName}]`;
  }

  if (!isValidCouponCode(couponCode)) {
    return `${languageData.invalidCouponCode} [${couponCode}]`;
  }

  const endpoint = API_ENDPOINTS[serverName];
  const requestBody = {
    AccountName: accountName,
    CouponCode: couponCode
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
      return `${languageData.failure} ${errorData.ErrorMessage || languageData.serverError}`;
    }
    
    return languageData.serverError;
  }
  catch (error) {
    return languageData.networkError;
  }
}

function isValidServerName(name) {
  return SERVER_NAMES.includes(name);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidCouponCode(code) {
  const couponRegex = /^[A-Z0-9]{8,12}$/;
  return couponRegex.test(code);
}
