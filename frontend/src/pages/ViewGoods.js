import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
//import { makeStyles } from '@material-ui/core/styles';
//import Card from '@material-ui/core/Card';
//import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// react component for creating beautiful carousel
import Carousel from "react-slick";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
//import LocationOn from "@material-ui/icons/LocationOn";
// core components
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Card from "../components/Card/Card.js";

import styles from "../assets/jss/material-kit-react/views/componentsSections/carouselStyle.js";
import { Button } from "@material-ui/core";
//import { container } from "../assets/jss/material-kit-react.js";
import qs from 'qs';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import store from '../store';

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles(styles);

// const useStylesContens = makeStyles((theme) => ({
//     content: {
//         //marginTop: theme.spacing(0),
//         display: 'flex',
//         alignItems: 'center',
//         flexDirection: 'column',
//     },
//     cardBox: {
//         //maxWidth: 600,
//         display: 'flex',
//         alignItems: 'left',
//         flexDirection: 'column',
//     },
// }));


export default function ViewGoods() {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState(['']);
    const [user, setUser] = useState('');
    const [favorite, setFavorite] = useState(false);
    const classes = useStyles();
//    const classesContents = useStylesContens();

    //const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [message, setMessage] = useState('');

    let history = useHistory();

    function loadContents() {
        console.log('loadContents01');
        const currentRoute = window.location.pathname;
        let objId = currentRoute.replace("/viewgoods/", "");  // remove "/viewgoods/"
        let url = `${API_URL}/products/${objId}`;
        console.log("url:", url);

        axios.get(url).then(response => response.data)
            .then((data) => {
                // modified date string
                data.data.createdAt = data.data.createdAt.substr(0, 10);
                setProducts(data.data);
                //console.log(data.data);
                //console.log(data.data.images);
                if (data.data.images === undefined) {
                    let dafaultImg = ["default.png"];
                    setImages(dafaultImg);
                } else {
                    setImages(data.data.images);
                }
                //console.log(data.createdAt.substr(0,10));
            });
    }

    function loginCheck(){
        console.log('logCheckFunc in MyListGoods');
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
                if(res.data.success === true){
                  console.log("LoginCheck:로긴됨",res.data.data.userId);
                  setUser(res.data.data.userId);
                } else {
                  console.log("logincheck:로긴안됨");
                }
                //this.setState({ loginState: res.data.success })
                
                //setUser(res.)
            })
    }

    function handleFavorite(){
        
        console.log('user:',user);
        if (!user){
            alert('로그인 하세요');
            return;    
        }
        
        let url = `${API_URL}/products/favorite/${products._id}`;
        console.log("url:", url);
        axios.put(url, {
            userId: user
        }).then(res => {
            if(res.data.success === true){
                console.log("setFavorite API 결과:",res.data.data);
                if (res.data.data.includes(user)){
                    setFavorite(true);
                } else {
                    setFavorite(false);
                }
                
              } else {
                console.log("setFavorite API 실패");
              }
        })
    }

    useEffect(() => {
        loadContents();
        loginCheck();
    }, []);


    const handleMsgSend = (event) => {
        
        event.preventDefault();
        console.log('user:',user);
        if (!user){
            alert('메시지 전송은 로그인 후 가능합니다.');
            history.push('/login');
            return;    
        }

        console.log('products:',products);
        console.log('products:',products._id);
        console.log('name:',user);
        console.log('tel:',tel);
        console.log('message:',message);
        //event.preventDefault();

        //history.push(`/viewchatting/${chattingRoomId}`);
        history.push(`/viewchatting`);

        // Save userID in redux store
        // store.dispatch({ type: 'CREATE_USER', user: user });
        let roomId = products._id + user;
        let sellerId = products.userId;
        console.log('roomId:',roomId);
        console.log('sellerId:',sellerId);
        store.dispatch({ type: 'CREATE_USER', user: user, message: message, tel: tel, roomId:roomId , sellerId:sellerId});
        console.log('스토어에 저장하기');
        
        
        // // 본인 계정에 해당하는 새로운 채팅방을 만든다.
        // let url = `${API_URL}/chattings`;
        // console.log("url:", url);

        // const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
        // console.log('token from localstorage:', token);

        // console.log('roomId :', roomId);
        // console.log('buyerId :', user);
        // console.log('sellerId :', sellerId);

        // axios({
        //     method: 'post',
        //     url: url,
        //     data: qs.stringify({
        //         roomId: roomId,
        //         buyerId: user,
        //         sellerId: sellerId,
        //         message: message
        //     }),
        //     headers: {
        //         'authorization': token,
        //         'Accept': 'application/json',
        //         //'Content-Type': 'application/json'
        //         'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        //     }

        // }).then(res => {
        //     if (res.data.success === true) {
        //         console.log("chattings List 추가 결과:", res.data.data);
                
        //     } else {
        //         console.log("chattings List 추가 실패");
        //     }
        // })

    }

    return (
        <React.Fragment>
            <main>
                {/* <div className={classesContents.content} >
                </div> */}

                <div>
                    <div>
                        <ImageCarousel data={images} />
                    </div>

                    {/* <div>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h4">
                카테고리: <CategoryCode2Name code={products.category} />
              </Typography>
            </CardContent>
          </div> */}

                    <div>
                        {/* <Card className={classesContents.cardBox}> */}
                        <Card >
                            {/* <CardActionArea> */}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {products.title}
                                </Typography>
                                <Typography variant="h6" color="textSecondary" component="p">
                                    {products.price} 원
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {products.viewCount} View
                                </Typography>
                                <Typography variant="body1" color="textSecondary" component="p">
                                    등록일: {products.createdAt}
                                </Typography>
                            </CardContent>
                            {/* </CardActionArea> */}
                        </Card>
                        {/* 로그인시에는 전화를 걸 수 있도록 */}
                        <Card className={classes.root}>
                            {/* <CardActionArea> */}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    상세 정보
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {products.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    015901400000
                                </Typography>
                                {/* <Typography gutterBottom variant="h5" component="h2">
                        로그인시에는 전화를 걸 수 있도록
                    </Typography> */}
                            </CardContent>
                            {/* </CardActionArea> */}
                        </Card>
                        <Card className={classes.root}>
                            <CardContent>
                                <Button onClick={handleFavorite} size="small" color="primary">
                                    {favorite === true ? '찜됨':'찜하기'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className={classes.root}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    메시지 작성
                                </Typography>
                                <form className={classes.form} noValidate>
                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            Message
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                variant="outlined"
                                                //required
                                                fullWidth
                                                id="message"
                                                name="message"
                                                //label="message"
                                                type="message"
                                                value={message}
                                                onChange={(event) => setMessage(event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            Name
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                variant="outlined"
                                                //required
                                                fullWidth
                                                id="Name"
                                                //label="Name"
                                                name="Name"
                                                //autoComplete="lname"
                                                value={user}
                                                onChange={(event) => setUser(event.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            Tel
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                variant="outlined"
                                                //required
                                                fullWidth
                                                id="Tel"
                                                //label="Tel"
                                                name="Tel"
                                                //autoComplete="Tel"
                                                value={tel}
                                                onChange={(event) => setTel(event.target.value)}
                                            />
                                        </Grid>


                                    <Grid item xs={4} align="center">
                                    </Grid>
                                    <Grid item xs={8} align="center">
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            이용 약관을 준수를 위하여 메시지 처리 방법에 대한 정보는 데이터 보호 정책에서 확인 할 수 있습니다.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} align="center">
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={handleMsgSend}
                                        >
                                            Send
                                        </Button>        
                                    </Grid>
                                    </Grid>
                                    

                                </form>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
}

// /* change category code to name */
// function CategoryCode2Name(props) {
//     const [categoryName, setcategoryName] = useState();

//     let url = `${API_URL}/category/${props.code}`;
//     axios.get(url).then(response => response.data)
//         .then((data) => {
//             //console.log(data.name);
//             let category = data.data;
//             if (Array.isArray(category) && category.length > 0) {
//                 setcategoryName(category[0].name);
//             } else {
//                 setcategoryName("");
//             }
//         });
//     return (
//         <React.Fragment>
//             {categoryName}
//         </React.Fragment>
//     );
// }

function ImageCarousel(props) {
    //console.log("ImageCarousel");
    const classes = useStyles();
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false
    };
    return (
<div className={classes.section}>
    <div className={classes.container}>
        <GridContainer>
            <GridItem xs={12} sm={12} md={8} className={classes.marginAuto}>
                <Card carousel>
                    <Carousel {...settings}>
                        {props.data.map((fileName, index, images) => (
                            <div>
                                <img src={API_URL + '/imageFiles/' + props.data[index]}
                                    alt={fileName}
                                    className="slick-image" />
                                <div className="slick-caption">
                                    <h4>
                                        {index + 1}/{images.length}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </Card>
            </GridItem>
        </GridContainer>
    </div>
</div>
    );
}
