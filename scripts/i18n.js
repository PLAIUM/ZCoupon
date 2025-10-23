import ko from '../languages/ko.json' with { type: 'json' };
import en from '../languages/en.json' with { type: 'json' };
import jp from '../languages/jp.json' with { type: 'json' };

const LANGUAGES = {
  'ko': {
    name: '한국어',
    data: ko
  },
  'en': {
    name: 'English',
    data: en
  },
  'jp': {
    name: '日本語',
    data: jp
  }
};
const LANGUAGE_CODES = Object.keys(LANGUAGES);

Object.freeze(LANGUAGES);
Object.freeze(LANGUAGE_CODES);

let _currentLanguageCode = (function () {
  const browserLanguageCode = document.documentElement.getAttribute('lang');
  return LANGUAGE_CODES.includes(browserLanguageCode) ? browserLanguageCode : 'en';
})();

/**
 * 현재 설정된 언어 코드입니다.
 * @returns {string} 언어 코드
 */
export function getLanguageCode() {
  return _currentLanguageCode;
}

/**
 * 언어 설정을 변경합니다.
 * @param {string} languageCode - 설정할 언어 코드
 * @returns {void}
 */
export function setLanguageCode(languageCode) {
  if (!LANGUAGE_CODES.includes(languageCode)) {
    throw new Error(`지원되지 않는 언어 코드: ${languageCode}`);
  }
  _currentLanguageCode = languageCode;
}

/**
 * 현재 설정된 번역 데이터입니다.
 * @returns {object} 번역 데이터 객체
 */
export function getLanguageData() {
  return LANGUAGES[_currentLanguageCode].data;
}

/**
 * 지원하는 언어 목록을 반환합니다.
 * @returns {string[]} 언어 이름 목록
 */
export function getSupportingLanguages() {
  return LANGUAGE_CODES.map(code => ({ code, name: LANGUAGES[code].name }));
}
