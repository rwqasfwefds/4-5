// 모듈 불러오기
const express = require('express');
const path = require('path');

// express 웹 서버 정의
const app = express();

// 포트 설정 : 3000
app.set('port', process.env.PORT || 3000);

// get 메서드로 텍스트 또는 파일 실행
app.get('/', (req, res) => {
    // html 파일 읽기 : '/' 라우터에서 실행
    res.sendFile(path.join(__dirname, '/index.html'));
});

// 웹 서버 계속 실행(위에서 정의한 포트로 계속 띄우는(대기) 쉨)
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중')
});