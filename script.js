document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 가져오기
    const serverSelect = document.getElementById('server-select');
    const accountNameInput = document.getElementById('account-name');
    const couponCodeInput = document.getElementById('coupon-code');
    const redeemButton = document.getElementById('redeem-button');

    const modal = document.getElementById('result-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeButtons = document.querySelectorAll('.close-button, #modal-close-button');

    // ** 더미 API 엔드포인트 ** (실제 백엔드 URL로 변경해야 합니다!)
    const API_ENDPOINT = 'YOUR_ACTUAL_API_ENDPOINT_HERE'; 

    /**
     * 모달을 표시하고 메시지를 설정합니다.
     * @param {string} message - 모달에 표시할 메시지
     */
    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    /**
     * 모달을 숨깁니다.
     */
    function hideModal() {
        modal.style.display = 'none';
    }

    // 모달 닫기 이벤트 리스너 설정
    closeButtons.forEach(button => {
        button.onclick = hideModal;
    });

    // 모달 외부 클릭 시 닫기
    window.onclick = function(event) {
        if (event.target === modal) {
            hideModal();
        }
    }

    /**
     * 쿠폰 사용 버튼 클릭 핸들러
     */
    redeemButton.addEventListener('click', async () => {
        // 1. 클라이언트 측 유효성 검증
        if (!serverSelect.value) {
            showModal('❌ 서버를 선택해 주세요.');
            return;
        }
        if (accountNameInput.value.trim() === '') {
            showModal('❌ 복구 이메일 또는 계정명을 입력해 주세요.');
            return;
        }
        if (couponCodeInput.value.trim() === '') {
            showModal('❌ 쿠폰 번호를 입력해 주세요.');
            return;
        }

        // 2. HTTP POST 요청 본문 구성
        const requestBody = {
            AccountName: accountNameInput.value.trim(),
            CouponCode: couponCodeInput.value.trim()
        };

        // UI 피드백: 버튼 비활성화 및 텍스트 변경
        redeemButton.disabled = true;
        redeemButton.textContent = '처리 중...';
        
        // 3. HTTP POST 요청 전송 (Fetch API 사용)
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            // 4. 응답 처리
            if (response.ok) {
                // 200 OK: 성공
                showModal('✅ 쿠폰이 성공적으로 사용되었습니다!');
            } else if (response.status === 400) {
                // 400 Bad Request: 실패 (ErrorMessage 포함)
                const errorData = await response.json();
                showModal(`❌ 쿠폰 사용 실패: ${errorData.ErrorMessage || '알 수 없는 오류'}`);
            } else {
                // 기타 오류 (4xx, 5xx)
                showModal(`⚠️ 서버 오류 (${response.status}): 잠시 후 다시 시도해 주세요.`);
            }

        } catch (error) {
            // 네트워크 오류 등 요청 자체의 실패
            console.error('API 요청 실패:', error);
            showModal('🚨 네트워크 오류: 서버에 연결할 수 없습니다.');
        } finally {
            // UI 피드백 복원
            redeemButton.disabled = false;
            redeemButton.textContent = '쿠폰 사용';
        }
    });
});