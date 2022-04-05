// 모듈 불러오기
const express = require('express');
const path = require('path');

// express 웹 서버 정의
const app = express();

// 포트 설정 : 3000
app.set('port', process.env.PORT || 3000);

// 모든 요청에서 미들웨어 실행
// next 미들웨어 : 다음 미들웨어로 넘기는 기능이 있는 함수
app.use((req, res, next) => {
    console.log('모든 요청에 다 실행 됨');
    next();
});

// app.get(라우터, 미들웨어1, 미들웨어2)
// get을 쓰던 use를 쓰던 노 상관
// 루트(/)에서만 매개변수가 실행되게금 설정
app.get('/', (req, res, next) => {
    console.log('get 라우터는 / 요청에 대해서만 실행 됨');
    // next를 설정해야 ,뒤에 다음 함수가 실행 됨
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

// err : 에러처리 미들웨어, 반드시 매개변수가 4개가 돼야 함
app.use((err, req, res, next) => {
    // 에러만 보이게 하는게 console.error
    console.error(err);
    // 200번대가 성공, 400,500번대는 에러
    // status는 상태도 같이 보내는 거임
    // err.message = '에러는 에러 처리 미들웨어로 갑니다.'
    res.status(500).send(err.message)
});

// 웹 서버 계속 실행(위에서 정의한 포트로 계속 띄우는(대기) 쉨)
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중')
});