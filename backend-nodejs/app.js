var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongo = require('mongodb');
var promise = require('bluebird');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var fileUploadRouter = require('./routes/upload');
var categoryRouter = require('./routes/category');
var loginRouter = require('./routes/login');
var chattingsRouter = require('./routes/chattings');



var app = express();
app.use(cors());

const config = process.env.NODE_ENV === "prod"
    ? require("./application.prod.json")
    : require("./application.dev.json");

const url = config.db.url;
const dbName = config.db.dbName;


//mongo.connect(url, { promiseLibrary : promise })
mongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, })
    .catch(err => console.error(err.stack))
    .then(db => {
        console.log('mongodb connection success(app.js)');
        app.locals.db = db.db(dbName);
        //console.log(app.locals.db);

        let cateData = fs.readFileSync('../doc/category.json');
        if (!cateData) {
            console.error('Can not read category.json');
        }
        let category = JSON.parse(cateData);
        const categoryCollection = app.locals.db.collection('category');
        categoryCollection.find({}).count(function (err, res) {
            //console.log('find().count:', res);
            if (!res) {
                categoryCollection.insertMany(category);
                console.log('category data inserted');
            }
        });

    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); ``
app.use('/imageFiles', express.static('uploadfiles'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/upload', fileUploadRouter);
app.use('/category', categoryRouter);
app.use('/login', loginRouter);
app.use('/chattings', chattingsRouter);


// chat Server setup
var chatApp = require('http').createServer();
chatApp.listen(8070);
var io = require('socket.io').listen(chatApp);
var redis = require('redis');
var fs = require('fs');

let store = redis.createClient();
let pub = redis.createClient();
// 레디스 리스너 실행
//let sub = redis.createClient();
//console.log("sub.connected", sub.connected);

io.on('connection', function (client) {
    
    console.log("io.sockets.on('connection') id:", client.id);
    let clientRoomId;
    //console.log("sub.connected", sub.connected);

    // 레디스 리스너 실행
    let sub = redis.createClient();
    //let obj = {};
    sub.on("message", function (channel, message) {
        console.log("message received on server from publish ");
        console.log("Redis RoomId:" + channel + "  msg: " + message);
        console.log("client.id: " + client.id);
        console.log('client.connected :' + client.connected);
        console.log("clientRoomId: " + clientRoomId);
        if (channel === clientRoomId && client.id !== null){
        //if (channel === clientRoomId){
            console.log("클라이언트에 메시지 전송한다.");
            client.send(message);
        }
    });

    // 소켓 리스너 실행
    client.on("message", function (msg) {
        console.log("client.on msg:", msg);
        console.log("client.on: Receive msg");

        let roomName = msg.roomName;

        if (msg.type == "chat") {                                                         // 메시지가 오는 경우
            let createdAt = new Date();
            let updatedAt = new Date();
            
            //sub.subscribe(roomName);                                                    // 레디스에 방 아이디 등록
            //console.log("sub.subscribe in chat ", roomName);

            //pub.publish(msg.roomName, msg.message);
            strMessage = '{"sellerId":"' + msg.sellerId + '",' +
                '"buyerId":"' + msg.buyerId + '",' +
                '"writer":"' + msg.writer + '",' +
                '"message":"' + msg.message + '",' +
                '"createdAt":"' + createdAt + '"}';
            //pub.publish(roomName, msg.message);                                         // 레디스에 메시지 전송.
            pub.publish(roomName, strMessage);                                            // 레디스에 메시지 전송.                            
            //console.log("msg", strMessage);
            

            // chat 메시지를 DB에 저장.
            const chattingsCollection = app.locals.db.collection('chat_msgs');
            chattingsCollection.insertOne({
                roomId: roomName,
                sellerId: msg.sellerId,
                buyerId: msg.buyerId,
                writer: msg.writer,
                message: msg.message,
                createdAt: createdAt,
                updatedAt: updatedAt
            }, function (error, result) {
                if (error) {

                } else {

                }
            });
            //<--end-- chat 메시지를 DB에 저장. -->


        } else if (msg.type == "setUsername") {                                         // 사용자 등록요청 메시지
            
            console.log("sub.connected", sub.connected);
            sub.subscribe(roomName);                                                    // 레디스에 방 아이디 등록
            console.log("sub.subscribe: ", roomName);
            clientRoomId = roomName;
            //pub.publish("chatting","A new user in connected:" + msg.user); 
            //store.sadd("onlineUsers",msg.user);

            //pub.publish(roomName, "User connected: " + msg.user);                       // 레디스에 "사용자 접속" 메시지 전송.
            //obj = { roomName: roomName, clientID: client.id, userName: msg.user };
            //console.log("유저 등록 과정", roomName, msg);
            console.log("유저 등록 시작");


            // chat 방을 DB에 저장.
            //=> 채팅방이 존재여부 조회.
            let createdAt = new Date();
            let updatedAt = new Date();
            const chattingsCollection = app.locals.db.collection('chat_rooms');

            chattingsCollection.findOne({ roomId: roomName }, function (error, results) {
                if (error) {
                    console.log("채팅방 DB 조회 실패", roomName, msg, error);
                } else {
                    //console.log("채팅방 DB 조회 성공", results);
                    console.log("채팅방 DB 조회 성공");

                    //<-- 채팅방이 존재하지 않으면 DB에 채팅방을 생성한다. 
                    if (results === null) {
                        console.log("채팅방 만들러 고고");
                        chattingsCollection.insertOne({
                            roomId: roomName,
                            sellerId: msg.sellerId,
                            buyerId: msg.user,
                            //message: msg.message,
                            createdAt: createdAt,
                            updatedAt: updatedAt
                        }, function (error, result) {
                            if (error) {
                                console.log("채팅방 DB에 생성 실패", roomName, msg, error);
                            } else {
                                console.log("채팅방 DB에 생성 성공", roomName, msg);
                            }
                        });
                    } else {
                        console.log("채팅방 있어");
                    }
                    //--> 채팅방이 존재하지 않으면 DB에 채팅방을 생성한다.

                }
            });
        }
    });

    
    client.on('disconnect', function () {
        console.log('disconnect', client.id);
        console.log('disconnect and unsubscribe roomName', clientRoomId);
        console.log('disconnect');
        console.log('disconnect - client.connected :' + client.connected);

        pub.publish("chatting","User is disconnected :" + client.id);
        sub.unsubscribe(clientRoomId); 
        sub.quit();
        client.id = null;
        
    });

});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
