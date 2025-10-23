# ZCoupon
외계인은 배고파 쿠폰 페이지입니다.

## API
쿠폰 사용 요청
``` 
> method: POST
> Content-Type: application/json
> body: { accountName: string, couponCode: string }
```
쿠폰 사용 응답 (성공)
``` 
> StatusCode: 200
```
쿠폰 사용 응답 (실패)
``` 
> StatusCode: 400
> Content-Type: application/json
> body: { errorCode: string }
```
에러 코드 종류
```
> INVALID_REQUEST: 유효하지 않은 요청 (쿠폰 서버가 아닌 경우)
> INVALID_ACCOUNT: 유효하지 않은 계정 (이메일 형식이 잘못된 경우)
> INVALID_COUPON: 유효하지 않은 쿠폰 (쿠폰 번호 형식이 잘못된 경우, 쿠폰이 존재하지 않는 경우, 쿠폰 사용기한 시작하지 않은 경우)
> NO_ACCOUNT: 존재하지 않는 계정
> BLOCKED_ACCOUNT: 영구정지 계정
> EXPIRED_COUPON: 사용기한 만료된 쿠폰
> USED_COUPON: 이미 사용한 쿠폰
> SYSTEM_ERROR: 시스템 오류 (기타 오류)
```


## TODO
* css, js 파일 압축/난독화 (minify.js, terser 참조)
  * 압축하면 용량이 줄어들기도 하지만, 주석이 삭제됩니다.
  * 난독화하지 않으면 리버스 엔지니어링하기 쉽습니다.
* 요청 페이로드 암호화
  * 현재 요청 페이로드를 평문으로 보내고 있습니다.
  * 문제될 일은 많지 않아 보이지만, 암호화하면 좋습니다.
 * 폰트 변경
   * 가능하면 웹폰트가 편하다 : https://fonts.google.com/
   * 어렵다면 폰트를 다운받아서 css로 적용한다.
* 쿠폰 백엔드 연결
  * 동작 가능한 API 엔드포인트를 연결한다 : /scripts/redeem.js

