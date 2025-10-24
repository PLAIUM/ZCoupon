# ZCoupon
외계인은 배고파 쿠폰 페이지입니다.  
http://www.plaium.com/ZCoupon/

## 작업 방법
1. Visual Studio Code에서 `Live Server` Extension을 설치합니다.
2. Visual Studio Code의 Project Explorer에서 index.html 파일을 찾습니다.
3. index.html 파일을 마우스 우클릭하고 `Open with Live Server` 항목을 누릅니다.
4. 작업이 완료되면 commit을 작성하고 main branch로 push합니다. Actions를 통해 Page가 자동 갱신됩니다.

*이렇게 안 하면 js 파일 간 CORS 에러가 뜹니다.*

## 프로젝트 구조
* `/languages` : 다국어 지원 파일을 저장합니다 (파일명은 국가코드로 해야 합니다)
* `/public` : 정적 퍼블릭 리소스 파일을 저장합니다 (이미지, 사운드 등)
* `/scripts` : 자바스크립트 파일을 저장합니다
* `i18n.schema.json` : 다국어 지원 데이터 스키마를 만듭니다
* `index.html` : 보여줄 쿠폰 페이지입니다
* `README.md` : 지금 보고 있는 이 파일입니다
* `style.css` : 보여줄 쿠폰 페이지를 꾸며줍니다

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
| errorCode | 설명 |
| --------- | ----------- |
| INVALID_REQUEST | 유효하지 않은 요청 (쿠폰 서버가 아닌 경우) |
| INVALID_ACCOUNT | 유효하지 않은 계정 (이메일 형식이 잘못된 경우) |
| INVALID_COUPON | 유효하지 않은 쿠폰 (쿠폰 번호 형식이 잘못된 경우, 쿠폰이 존재하지 않는 경우, 쿠폰 사용기한 시작하지 않은 경우) |
| NO_ACCOUNT | 존재하지 않는 계정 |
| BLOCKED_ACCOUNT | 영구정지 계정 |
| EXPIRED_COUPON | 사용기한 만료된 쿠폰 |
| USED_COUPON | 이미 사용한 쿠폰 |
| SYSTEM_ERROR | 시스템 오류 (기타 오류) |

## 다국어 지원
1. i18n.schema.json 파일에서 properties 와 required 항목을 추가합니다.
2. languages 폴더 아래에 `<국가코드>.json` 파일을 추가합니다.
3. 스키마에 맞춰 내용을 작성합니다.

*i18n.schema.json 파일은 vscode 상에서 스키마 불일치 여부를 확인해줍니다.*

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

