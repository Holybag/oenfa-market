import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
//import { Button } from 'reactstrap';
import { Button } from "@material-ui/core";
//import { Card, CardBody } from 'reactstrap';
//import { InputGroup, Input } from 'reactstrap';
//import { Container, Row, Col } from 'reactstrap';

import { Card, CardContent } from '@material-ui/core';
//import { Input } from '@material-ui/core';
import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import store from '../store';
import axios from 'axios';
import qs from 'qs';
import '../ViewChatting.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function ViewChatting() {
    let history = useHistory();

    const style = {
        p: {
            marginTop: '30px',
            padding: '10px',
        },
        button: {
            marginTop: '10px',
            width: '120px',
        },
        chatBox: {
            marginTop: '10px',
            marginBottom: '30px',
            border: '4px solid #40E0D0',
            width: '300px'
        },
        chatWindow: {
            width: '500px',
            height: '300px'
        }

    };

    const goBack = () => {
        //let socket = stateSocket;
        //socket.close();
        //history.goBack();
        history.push('/');
    };

    let chatUser;
    let gSocket;
    const [stateSocket, setStateSocket] = useState('');

    const [user, setUser] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [buyerId, setBuyerId] = useState('');
    const [roomList, setRoomList] = useState([]);
    const [roomNo, setRoomNo] = useState('');
    const [msg, setMsg] = useState('');


    function loginCheck(callbackFunc) {
        console.log('logCheckFunc in ViewChatting');
        var email_token = localStorage.getItem('userInfo');
        const obj = JSON.parse(email_token);
        if (obj == null) {
            return;
        }
        var email = obj.email;
        var token = obj.token;
        const url = `${API_URL}/login/loginCheck`;
        axios({
            method: 'post',
            url: url,
            data: qs.stringify({
                email: email,
                token: token
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
            .then(res => {
                //console.log(JSON.stringify(res));
                console.log(res.data);
                console.log("여기");
                if (res.data.success === true) {
                    console.log("LoginCheck:로긴됨", res.data.data.userId);
                    setUser(res.data.data.userId);
                    //setNewUser(res.data.data.userId);
                    // 사용자 셋팅
                    chatUser = res.data.data.userId;
                    console.log("chatUser", chatUser);
                    callbackFunc(res.data.data.userId);
                    //setChatName(res.data.data.userId);
                } else {
                    console.log("logincheck:로긴안됨");
                    callbackFunc(-1);
                    goBack();
                }
                //this.setState({ loginState: res.data.success })

                //setUser(res.)
            })
    }

    function sendHandler(event) {
        event.preventDefault();
        if (roomNo === undefined) {
            console.log("roomNo", roomNo);
            alert("채팅방(상품)을 선택하세요");
            return;
        }

        if (msg === "") {
            console.log("Nothing msg");
            return;
        }

        console.log("chatUser", chatUser);
        var message = { roomName: roomNo, type: 'chat', sellerId: sellerId, buyerId: buyerId, writer: user, message: msg }
        stateSocket.json.send(message);
        //gSocket.json.send(message);
        console.log("챗 메시지 전송 Client -> Server Message:", message);

        setMsg('');
    }

    function getRoomId() {
        var results = store.getState().roomId
        console.log("getRoomId:" + results);
        return results
    }

    // DB 조회 후 채팅방을 찾는다.
    function findRoomId(array) {
        let obj = array;
        var roomId = store.getState().roomId;
        var buyerId = store.getState().user;

        let findFlag = false;

        //console.log("array:" + obj[0]._id);
        console.log("roomId:" + roomId);

        for (let i = 0; i < array.length; i++) {
            console.log("array:" + obj[i].roomId);
            if (roomId === obj[i].roomId) {
                findFlag = true;
                break;
            }
        }

        if (findFlag || roomId === undefined) {
            console.log("찾았다 또는 undefined 이다");

        } else {
            console.log("없다 새로 만들자 일단 막아.");
            //saveNewRoomId(roomId, buyerId);
        }
        return
    }


    // 본인 계정에 해당하는 채팅방 하나를 가져온다.
    function getDefaultRoomID(currUser, callbackFunc) {

        let url = `${API_URL}/chattings`;
        //console.log("url:", url);

        const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
        //console.log('token from localstorage:', token);

        axios({
            method: 'get',
            url: url,
            headers: {
                'authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.data.success === true) {
                console.log("첫번째 roomId 조회 결과:", res.data.data);
                //console.log("roomId 조회 결과:", res.data.data[0].roomId);

                if (res.data.data.length !== 0) {
                    // 메시지 방이 있는 경우 메시지 전송
                    //handleChat(res.data.data[0].roomId, res.data.data[0].buyerId, res.data.data[0].sellerId, currUser );
                    callbackFunc(res.data.data[0]);
                }

            } else {
                console.log("roomId 조회 실패");
                callbackFunc(false);
            }
        })
    }

    // 본인 계정에 해당하는 채팅방 리스트를 가져온다.
    function getRoomList() {

        let url = `${API_URL}/chattings`;
        console.log("url:", url);

        const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
        console.log('token from localstorage:', token);

        axios({
            method: 'get',
            url: url,
            headers: {
                'authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.data.success === true) {
                console.log("chattings List 조회 결과:", res.data.data);
                setRoomList(res.data.data);
                findRoomId(res.data.data);

            } else {
                console.log("chattings List 조회 실패");
            }
        })
    }

    // 해당 채팅방의 대화 내용을 가져온다.
    function getChatMsgs(objId, currUser) {

        let url = `${API_URL}/chattings/msgs/${objId}`;
        console.log("url:", url);

        const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
        //console.log('token from localstorage:', token);

        axios({
            method: 'get',
            url: url,
            headers: {
                'authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.data.success === true) {
                console.log("chattings 내용 조회 결과:", res.data.data);
                let results = res.data.data;
                for (let i = 0; i < results.length; i++) {
                    // 작성자와 현재 사용자가 같은가 판단.
                    // console.log("currUser", currUser);
                    // console.log("results[i].writer", results[i].writer);
                    if (currUser !== results[i].writer) {
                        let data = results[i];
                        printOtherMsgsDB(data);
                    } else {
                        //console.log("같은 사람");
                        let data = results[i];
                        printMyMsgsDB(data);
                    }
                }

                // 포커스 스크롤 이동
                setfocusScroll();

            } else {
                console.log("chattings 내용 조회 실패");

            }
            // })
        }).then(res => {
            getRoomList();
        })

    }

    function printOtherMsgsDB(data) {
        //console.log("다른 사람");
        let createDate = data.createdAt;
        let yyyy = createDate.substr(0, 4);
        let mm = createDate.substr(5, 2);
        let dd = createDate.substr(8, 2);
        let hour = Number(createDate.substr(11, 2)) + 2;  // UTC Time에서 2시간 더하면 독일 시간. 한국은 9시간 더하기.
        let min = createDate.substr(14, 2);
        let sec = createDate.substr(17, 2);
        //console.log('시간', yyyy, mm, dd, hour, min);            

        let content = document.querySelector('#chat');
        let liTag = document.createElement("li");

        content.appendChild(liTag);
        liTag.outerHTML = "<li class='you'>"
            + "  <div class='entete'> <span class='status green'></span> "
            + "  <h2>Who</h2>"
            + "  <h3>" + hour + ":" + min + ":" + sec + "</h3> </div>"
            //+ "  <h3>10:12AM, Today</h3> </div>"
            + "  </div>"
            + "  <div class='triangle'></div> "
            + "  <div class='message'> "
            + data.message
            + "  </div>"
            + "</li>";
    }


    function printMyMsgsDB(data) {
        //console.log("같은 사람");
        let createDate = data.createdAt;
        let yyyy = createDate.substr(0, 4);
        let mm = createDate.substr(5, 2);
        let dd = createDate.substr(8, 2);
        let hour = Number(createDate.substr(11, 2)) + 2;  // UTC Time에서 2시간 더하면 독일 시간. 한국은 9시간 더하기.
        let min = createDate.substr(14, 2);
        let sec = createDate.substr(17, 2);
        //console.log('시간', yyyy, mm, dd, hour, min);            

        let content = document.querySelector('#chat');
        let liTag = document.createElement("li");
        content.appendChild(liTag);
        liTag.outerHTML = "<li class='me'>"
            + "  <div class='entete'>"
            + "  <h3>" + hour + ":" + min + ":" + sec + "</h3> </div>"
            //+ "  <h3>10:12AM, Today</h3> </div>"
            + "  <h2>Me</h2>"
            + "  <span class='status blue'></span>"
            + "  </div>"
            + "  <div class='triangle'></div> "
            + "  <div class='message'> "
            + data.message
            + "  </div>"
            + "</li>";
    }

    // 채팅 메시지를 DB에 저장.
    function saveMsgsToDB(roomId, sellerId, buyerId, writer, msgs) {
        console.log("function saveMsgsToDB");

        let url = `${API_URL}/chattings/msgs`;
        console.log("url:", url);

        const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
        console.log('token from localstorage:', token);

        console.log('roomId :', roomId);
        console.log('buyerId :', buyerId);
        console.log('sellerId :', sellerId);
        console.log('writer :', writer);
        console.log('message :', msgs);

        axios({
            method: 'post',
            url: url,
            data: qs.stringify({
                roomId: roomId,
                buyerId: buyerId,
                sellerId: sellerId,
                writer: writer,
                message: msgs
            }),
            headers: {
                'authorization': token,
                'Accept': 'application/json',
                //'Content-Type': 'application/json'
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }

        }).then(res => {
            if (res.data.success === true) {
                console.log("chat Msgs 추가 성공:", res.data.data);

            } else {
                console.log("chat Msgs 추가 실패");
            }
        })
    }


    // 채팅방을 선택 했을때 
    // 또는 이전 화면에서 메시지가 전송되어 왔을때
    function handleChat(roomId, sellerId, buyerId, currUser) {
        console.log("hanldeChat currUser: ", currUser);
        // console.log("hanldeChat roomId", roomId);
        // console.log("sellerId", sellerId);
        // console.log("buyerId", buyerId);

        setRoomNo(roomId);
        setSellerId(sellerId);

        // 사용자 등록.
        var message = { roomName: roomId, type: 'setUsername', user: currUser, sellerId: sellerId };
        console.log("handleChat c -> s send user name / msg:", message);
        //console.log("stateSocket", stateSocket);
        //console.log("gSocket", gSocket);
        //gSocket.json.send(message);

        if (!gSocket) {
            stateSocket.json.send(message);
        } else {
            gSocket.json.send(message);
        }
        //console.log("globalSocket", globalSocket);


        // 채팅 화면 클리어
        //let content = document.querySelector('#content');
        let content = document.querySelector('#chat');
        while (content.hasChildNodes()) {
            content.removeChild(content.firstChild);
        }

        // 채팅 대화창에 기존 대화를 DB에 조회 후 보여준다.
        //let currUser = buyerId;
        getChatMsgs(roomId, currUser);
    }

    function printMyMsgs(data) {
        console.log("printMyMsgs");
        let createDate = data.createdAt;
        let yyyy = createDate.substr(11, 4);
        let mm = createDate.substr(4, 3);
        let dd = createDate.substr(8, 2);
        let hour = createDate.substr(16, 2);
        let min = createDate.substr(19, 2);
        let sec = createDate.substr(22, 2);
        // //console.log('시간', yyyy, mm, dd, hour, min);
        
        let content = document.querySelector('#chat');
        let liTag = document.createElement("li");
        content.appendChild(liTag);
        liTag.outerHTML = "<li class='me'>"
            + "  <div class='entete'>"
            + "  <h3>" + hour + ":" + min + ":" + sec + "</h3> </div>"
            //+ "  <h3>10:12AM, Today</h3> </div>"
            + "  <h2>Me</h2>"
            + "  <span class='status blue'></span>"
            + "  </div>"
            + "  <div class='triangle'></div> "
            + "  <div class='message'> "
            + data.message
            + "  </div>"
            + "</li>";

    }

    function printOtherMsgs(data) {
        console.log("printOtherMsgs");

        let createDate = data.createdAt;
        let yyyy = createDate.substr(11, 4);
        let mm = createDate.substr(4, 3);
        let dd = createDate.substr(8, 2);
        let hour = createDate.substr(16, 2);
        let min = createDate.substr(19, 2);
        let sec = createDate.substr(22, 2);
        //console.log('시간', yyyy, mm, dd, hour, min);

        let content = document.querySelector('#chat');
        let liTag = document.createElement("li");
        content.appendChild(liTag);
        liTag.outerHTML = "<li class='you'>"
            + "  <div class='entete'> <span class='status green'></span> "
            + "  <h2>Who</h2>"
            + "  <h3>" + hour + ":" + min + ":" + sec + "</h3> </div>"
            //+ "  <h3>10:12AM, Today</h3> </div>"
            + "  </div>"
            + "  <div class='triangle'></div> "
            + "  <div class='message'> "
            + data.message
            + "  </div>"
            + "</li>";

    }

    function setfocusScroll() {
        // 스크롤 이동
        let objDiv = document.getElementById('chat');
        objDiv.scrollTop = objDiv.scrollHeight;
        // 포커스 이동
        document.getElementById('chatTxt').focus();
    }

    useEffect(() => {
        console.log("useEffect did");
        loginCheck(function (response) {
            let testId = response;
            console.log("-- callback testId", testId);
        });
        console.log("chatUser:", chatUser);

        //<-- 웹 소켓을 레디 상태로 만들기
        let socket = new io.connect('http://127.0.0.1:8070');
        setStateSocket(socket);
        //gSocket = new io.connect('http://127.0.0.1:8070');
        gSocket = socket;  // 문제 해결 필요.
        //console.log("gSocket",gSocket);

        console.log(socket);
        socket.on('connect', function () {
            console.log("socket.on : Connected");
        });

        socket.on('message', function (message) {
            console.log("socket.on : strMessage", message);
            //console.log("socket.on : chatUser", chatUser);

            if (message === null) {
                message = '';
            }
            let data = JSON.parse(message);
            //console.log("data.sellerId", data.sellerId);
            console.log("chatUser ?: ", chatUser);
            // console.log("data.buyerId ?: ", data.buyerId);
            // console.log("data.sellerId ?: ", data.sellerId);
            console.log("data.writer ?: ", data.writer);

            if (chatUser !== data.writer) {
                console.log("사용자와 작성자가 다른 경우");
                printOtherMsgs(data);
                
            } else {
                console.log("사용자와 작성자가 같은 경우");
                printMyMsgs(data);

            }

            // 포커스 스크롤 이동
            setfocusScroll();

        });

        socket.on('disconnect', function () {
            console.log('socket.on : disconnected');
        });
        //--> 웹 소켓을 레디 상태로 만들기  


        //<-- 리덕스에서 데이타를 가져온 경우 처리 (이전화면에서 상품을 선택하고 메시지를 전송한 경우)
        var results = store.getState();
        let roomId = results.roomId;
        let sellerId = results.sellerId;
        let buyerId = results.buyerId;
        let strUser = results.user;
        let message = results.message;

        console.log("이전화면에서 상품을 선택하고 실행한 화면인가 ? 리덕스 조회", results);
        if (strUser === '') {
            // 직접 "메시지 메뉴" 또는 직접 현재 페이지로 접속한 경우.
            console.log("채팅방이 없는 경우 (리덕스에 유저 없는 경우)", strUser);
            loginCheck(function (response) {
                let currUser = response;
                console.log("callback currUser", currUser);
                getDefaultRoomID(currUser, function (response) {
                    console.log("response", response);
                    handleChat(response.roomId, response.sellerId, response.buyerId, currUser);
                });
            });
        } else {
            // 이전 화면에서 상품을 선택하고 메시지를 전송한 후 접속된 경우
            console.log("상품을 선택한 경우 (채팅방 존재)");
            console.log("roomID: ", roomId);
            console.log("sellerId: ", sellerId);
            console.log("strUser: ", strUser);
            console.log("message: ", message);
            //handleChat(roomId, sellerId, strUser);
            let writer = strUser;
            // DB에 메시지 저장하기
            saveMsgsToDB(roomId, sellerId, strUser, writer, message);

            handleChat(roomId, sellerId, buyerId, strUser);

        }


        //let roomName = getRoomId();
        //setRoomNo(roomName);
        //console.log("roomName", roomName);


    }, []);

    return (
        <div style={style.p}>
            <Fragment>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Container>
                                    <h2 align="center">Messages</h2>
                                    <h4 align="center">Room: {roomNo}</h4>
                                    <h4 align="center">My Id: {user}</h4>
                                </Container>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>

                        {/* <Paper className={classes.paper}>xs=12 sm=6</Paper> */}
                        <Card>
                            <CardContent>
                                <Container>
                                    <h4 align="center">Room List</h4>

                                    {roomList.map((room, index) => (
                                        <div key={room.roomId}>
                                            {/* {room.roomId} */}
                                            <Button id="KKK" size="small" color="primary"
                                                onClick={
                                                    function (event) {
                                                        event.preventDefault();
                                                        handleChat(room.roomId, room.sellerId, room.buyerId, user);
                                                    }}>
                                                {room.roomId}
                                            </Button>
                                        </div>
                                    ))}

                                </Container>
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <div id="container">
                            {/* <aside>
                                <header>
                                    <input type="text" placeholder="search" />
                                </header>
                                
                                <ul>
                                    <li>
                                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_10.jpg" alt="" />
                                        <div>
                                            <h2>Prénom Nom</h2>
                                            <h3>
                                                <span class="status orange"></span>
                                                offline
                                            </h3>
                                        </div>
                                    </li>
                                </ul>
                            </aside> */}
                            <main>
                                {/* <header>
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="" />
                                <div>
                                    <h2>Chat with Vincent Porter</h2>
                                    <h3>already 1902 messages</h3>
                                </div>
                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_star.png" alt="" />
                                </header> */}

                                <ul id="chat">
                                </ul>

                                <footer>
                                    <textarea placeholder="Type your message" id="chatTxt" value={msg} name="msg" onChange={(event) => setMsg(event.target.value)}
                                        onKeyPress={
                                            function (event) {
                                                //console.log(event.keyCode);
                                                //event.preventDefault();
                                                var key = event.which;
                                                if (key == 13) {
                                                    sendHandler(event);
                                                }
                                            }
                                        }
                                    ></textarea>
                                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_picture.png" alt="" />
                                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_file.png" alt="" />
                                    <a href="#" onClick={sendHandler}>Send</a>
                                </footer>

                            </main>
                        </div>
                    </Grid>

                </Grid>

            </Fragment>
        </div>
    );
};
