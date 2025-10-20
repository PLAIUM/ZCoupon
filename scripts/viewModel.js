import { getCurrentTranslation, getCurrentLanguageCode, setLanguage, LANGUAGE_LIST } from './i18n.js';
import { requestRedeem } from './redeem.js';

/**
 * 이벤트를 바인딩하고 텍스트를 초기화합니다.
 * @returns {object} DOM 요소들
 */
export function initialize() {
  const eventElements = _collectEventElements();
  const textElements = _collectTextElements();

  _initializeTextElements(textElements);
  _initializeLangSelect(eventElements.langSelect);
  _initializeEventListeners(eventElements, textElements);
}

function _collectEventElements() {
  const redeemButton = document.getElementById('redeem-button');
  const langSelect = document.getElementById('lang-select');
  const modal = document.getElementById('result-modal');
  const closeButtons = document.querySelectorAll('.close-button, #modal-close-button');

  return { redeemButton, langSelect, modal, closeButtons };
}

function _collectTextElements() {
  const textElements = document.querySelectorAll('[data-i18n-key], [data-i18n-placeholder-key]');
  const titleElement = document.querySelector('title');

  return [...textElements, titleElement];
}

function _initializeEventListeners(eventElements, textElements) {
  const { redeemButton, langSelect, modal, closeButtons } = eventElements;
  const hideModal = () => modal.style.display = 'none';

  redeemButton.addEventListener('click', () => _handleRedeemClick(redeemButton));
  langSelect.addEventListener('change', (e) => {
    const newLanguageCode = e.target.value; 
    setLanguage(newLanguageCode);
    _initializeTextElements(textElements);
  });
  closeButtons.forEach(button => button.onclick = hideModal);
  window.onclick = (event) => {
    if (event.target === modal) {
      hideModal();
    }
  };
}

function _initializeLangSelect(langSelect) {
  const languageCode = getCurrentLanguageCode();
  langSelect.innerHTML = '';

  Object
    .entries(LANGUAGE_LIST)
    .forEach(([code, text]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = text;
      
      if (code === languageCode) {
        option.selected = true;
      }
      langSelect.appendChild(option);
    });
}

function _initializeTextElements(textElements) {
  const translation = getCurrentTranslation();

  textElements.forEach(element => {
    const contentKey = element.getAttribute('data-i18n-key');
    if (contentKey && translation[contentKey] !== undefined) {
      element.textContent = translation[contentKey];
    }
    
    const placeholderKey = element.getAttribute('data-i18n-placeholder-key');
    if (placeholderKey && translation[placeholderKey] !== undefined) {
      element.setAttribute('placeholder', translation[placeholderKey]);
    }
  });
  
  document.documentElement.setAttribute('lang', getCurrentLanguageCode());
}

async function _handleRedeemClick(redeemButton) {
  const serverSelect = document.getElementById('server-select');
  const accountNameInput = document.getElementById('account-name');
  const couponCodeInput = document.getElementById('coupon-code');
  const langData = getCurrentTranslation();

  if (!serverSelect.value) {
    return showModal(langData.errorServer || 'Server must be selected.'); 
  }

  if (accountNameInput.value.trim() === '') {
    return showModal(langData.errorAccount || 'Account is required.');
  }

  if (couponCodeInput.value.trim() === '') {
    return showModal(langData.errorCoupon || 'Coupon code is required.');
  }

  const inputValues = {
    server: serverSelect.value,
    accountName: accountNameInput.value.trim(),
    couponCode: couponCodeInput.value.trim()
  };
    
  await requestRedeem(
    inputValues,
    (message) => showModal(message),
    (isDisabled, text) => setRedeemButtonState(redeemButton, isDisabled, text)
  );
}

function showModal(message) {
  const modal = document.getElementById('result-modal');
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = message;
  modal.style.display = 'block';
}

function setRedeemButtonState(redeemButton, isDisabled, text) {
  redeemButton.disabled = isDisabled;
  redeemButton.textContent = text;
}
