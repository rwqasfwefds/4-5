// 모듈 불러오기
const express = require('express');
const path = require('path');

const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
// 파일 업로드를 위한 미들웨어
const multer = require('multer');

// dotenv 정의
// .env 파일을 사용 할 수 있게 해줌
dotenv.config();

// express 웹 서버 정의
const app = express();

// morgan 정의
// 추가적인 로깅 적용 : ms 시간 표시
app.use(morgan('dev'));

// static() 미들웨어 : express에 내장된 미들웨어
// 정적인 파일(이미지,css파일 등등)들이 있는 실제 경로와 라우터와 연결해주는 미들웨어
// 1st 매개변수 : 들어오는 라우터
// 2st 매개변수 : 실제 로컬 pc 경로(public)
// public이라는 파일과 '/'를 연결 시켜 루트 페이지에서 정적인 파일이
// 로딩이 될 수 있게 하는 미들웨어
app.use('/', express.static(path.join(__dirname, 'public')));

// body-parser 미들웨어 : express 내장된 미들웨어
// json() : 말 그대로 json파일을 해석해서 객체로 전달하는 미들웨어
app.use(express.json());
// url주소형식(params, querystring 형식)을 해석해서 객체로 전달하는 미들웨어
app.use(express.urlencoded({extended : false}));

// 쿠키 미들웨어 정의
// 쿠키를 해석해서 req.cookies 객체로 만들어 주는 미들웨어
// req.cookies에 저장 됨
// 매개변수 : 비밀 키가 .env파일에 있음
app.use(cookieParser(process.env.COOKIE_SECRET))

// 세션 미들웨어 정의
// 로그인 정보등의 이유로 임시적으로 저장 할 목적으로 사용
// 세션 정보 : req.session 객체에 저장
app.use(session({
    // 수정이 없더라도 세션을 다시 저장 할 지 설정
    // false면 다시 저장 안 하겠다 라는 뜻
    resave : false,
    // 세션에 저장 할 내역이 없어도 처음부터 세션을 생성 할 지 설정
    saveUninitialized : false,
    // 세션 쿠키를 클라이언트로 전송
    secret : process.env.COOKIE_SECRET,

    // 세션 쿠키
    cookie : {
        // 웹 브라우저에서만 볼 수 있게 설정
        httpOnly : true,
        // https 환경 외에서도 볼 수 있게 설정
        secure : false
    },
    name : 'session-cookie'
}))

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