import ko from '../languages/ko.json' with { type: 'json' };
import en from '../languages/en.json' with { type: 'json' };
import jp from '../languages/jp.json' with { type: 'json' };

const _SUPPORTED_LANGUAGES = {
  KOREAN: 'ko',
  ENGLISH: 'en',
  JAPANESE: 'jp'
};
Object.freeze(_SUPPORTED_LANGUAGES);

export const LANGUAGE_LIST = {
  [_SUPPORTED_LANGUAGES.KOREAN]: '한국어',
  [_SUPPORTED_LANGUAGES.ENGLISH]: 'English',
  [_SUPPORTED_LANGUAGES.JAPANESE]: '日本語'
};

const _TRANSLATIONS = {
  [_SUPPORTED_LANGUAGES.KOREAN]: ko,
  [_SUPPORTED_LANGUAGES.ENGLISH]: en,
  [_SUPPORTED_LANGUAGES.JAPANESE]: jp
};

let _currentLanguageCode = (function () {
  const browserLanguageCode = document.documentElement.getAttribute('lang');
  
  return _isSupportedLanguage(browserLanguageCode)
    ? browserLanguageCode
    : _SUPPORTED_LANGUAGES.ENGLISH;
})();

/**
 * 현재 설정된 언어 코드입니다.
 * @returns {string} 언어 코드
 */
export function getCurrentLanguageCode() {
  return _currentLanguageCode;
}

/**
 * 현재 설정된 번역 데이터입니다.
 * @returns {object} 번역 데이터 객체
 */
export function getCurrentTranslation() {
  return _TRANSLATIONS[_currentLanguageCode];
}

/**
 * 언어 설정을 변경합니다.
 * @param {string} languageCode - 설정할 언어 코드
 * @returns {void}
 */
export function setLanguage(languageCode) {
  if (!_isSupportedLanguage(languageCode)) {
    throw new Error(`지원되지 않는 언어 코드: ${languageCode}`);
  }
  _currentLanguageCode = languageCode;
}

function _isSupportedLanguage(languageCode) {
  return Object.values(_SUPPORTED_LANGUAGES).includes(languageCode);
}
