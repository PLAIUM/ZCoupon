import { getLanguageCode, setLanguageCode, getLanguageData, getSupportingLanguages } from './i18n.js';
import { SERVER_NAMES, requestRedeem } from './redeem.js';

/**
 * 이벤트를 바인딩하고 텍스트를 초기화합니다.
 * @returns {object} DOM 요소들
 */
export function initialize() {
  const eventElements = _collectEventElements();
  const textElements = _collectTextElements();
  const inputElements = _collectInputElements();

  _initializeEventListeners(eventElements, textElements, inputElements);
  _initializeDropdowns(eventElements.languageDropdown, inputElements.serverSelect);
  _updateTextElements(textElements);
}

function _collectEventElements() {
  const redeemButton = document.getElementById('redeem-button');
  const languageDropdown = document.getElementById('lang-select');
  const modal = document.getElementById('result-modal');
  const closeButtons = document.querySelectorAll('.close-button, #modal-close-button');
  return { redeemButton, languageDropdown, modal, closeButtons };
}

function _collectTextElements() {
  const textElements = document.querySelectorAll('[data-i18n-key], [data-i18n-placeholder-key]');
  const titleElement = document.querySelector('title');
  return [...textElements, titleElement];
}

function _collectInputElements() {
  const serverSelect = document.getElementById('server-select');
  const accountNameInput = document.getElementById('account-name');
  const couponCodeInput = document.getElementById('coupon-code');
  return { serverSelect, accountNameInput, couponCodeInput };
}

function _initializeEventListeners(eventElements, textElements, inputElements) {
  const { redeemButton, languageDropdown, modal, closeButtons } = eventElements;

  languageDropdown.addEventListener('change', (event) => _onDropdownChange(event.target.value, textElements));
  redeemButton.addEventListener('click', () => _onRedeemClick(inputElements, redeemButton, modal));
  
  closeButtons.forEach(button => button.addEventListener('click', () => _onCloseClick(modal)));
  window.addEventListener('click', (event) => _onModalOutsideClick(event.target, modal));
}

function _initializeDropdowns(languageDropdown, serverDropdown) {
  const supportingLanguages = getSupportingLanguages()
  const currentLanguageCode = getLanguageCode();
  languageDropdown.innerHTML = '';

  supportingLanguages.forEach(({ code, name }) => {
    const option = document.createElement('option');
    option.textContent = name;
    option.value = code;
    option.selected = code === currentLanguageCode;
    languageDropdown.appendChild(option);
  });

  SERVER_NAMES.forEach(serverName => {
    const option = document.createElement('option');
    option.textContent = serverName;
    option.value = serverName;
    serverDropdown.appendChild(option);
  });
}

function _updateTextElements(textElements) {
  const languageCode = getLanguageCode();
  const languageData = getLanguageData();

  textElements.forEach(element => {
    const contentKey = element.getAttribute('data-i18n-key');
    if (contentKey && languageData[contentKey] !== undefined) {
      element.textContent = languageData[contentKey];
    }
    
    const placeholderKey = element.getAttribute('data-i18n-placeholder-key');
    if (placeholderKey && languageData[placeholderKey] !== undefined) {
      element.setAttribute('placeholder', languageData[placeholderKey]);
    }
  });
  
  document.documentElement.setAttribute('lang', languageCode);
}

function _onDropdownChange(newLanguageCode, textElements) {
  setLanguageCode(newLanguageCode);
  _updateTextElements(textElements);
}

async function _onRedeemClick(inputElements, redeemButton, modal) {
  const languageData = getLanguageData();
  
  _setRedeemButtonDisabled(redeemButton, true, languageData.pending);
  {
    const { serverSelect, accountNameInput, couponCodeInput } = inputElements;
    const serverName = serverSelect.value;
    const accountName = accountNameInput.value.trim();
    const couponCode = couponCodeInput.value.trim();
    const resultMessage = await requestRedeem(serverName, accountName, couponCode);
    _showModal(modal, resultMessage);
  }
  _setRedeemButtonDisabled(redeemButton, false, languageData.redeem_button);
}

function _onCloseClick(modal) {
  _hideModal(modal);
}

function _onModalOutsideClick(clickTarget, modal) {
  if (clickTarget !== modal) {
    return;
  }

  _hideModal(modal);
}

function _setRedeemButtonDisabled(redeemButton, isDisabled, text) {
  redeemButton.disabled = isDisabled;
  redeemButton.textContent = text;
}

function _showModal(modal, message) {
  const modalMessage = modal.querySelector('#modal-message');
  modalMessage.textContent = message;
  modal.style.display = 'block';
}

function _hideModal(modal) {
  modal.style.display = 'none';
}