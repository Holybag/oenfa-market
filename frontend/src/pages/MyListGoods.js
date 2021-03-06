import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
//import Link from '@material-ui/core/Link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link as RLink } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
//import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import qs from 'qs';

//const API_URL = 'http://localhost:5000'
const API_URL = process.env.REACT_APP_API_URL;

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  paper: {
    height: 50,
    width: 100,
  },
  categoryroot: {
    display: 'flex',
    height: 50,
  },
}));


export default function MyListGoods() {
  console.log("MyListGoods");
  
  const classes = useStyles();
  let history = useHistory();

  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  //const [category, setCategory] = useState([]);
  //const [value, setValue] = React.useState(0);
  //const [user, setUser] = useState('');
  

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
              console.log("성공",res.data.data.userId);
              //setUser(res.data.data.userId);
            } else {
              console.log("fail");
            }
            //this.setState({ loginState: res.data.success })
            
            //setUser(res.)
        })
  }

  /* 사용자가 올린 컨텐츠만 가져오기 */
  function loadContents() {
    console.log('loadContents in MyListGoods');
      
    let url = `${API_URL}/products`;
    url = url + "/mylist/mylist";
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
    }).then(response => response.data)
      .then((data) => {
        // modified date string
        //data.createdAt = data.createdAt.substr(0,10);
        console.log(data);

        // setUser(data.data);
        // console.log(data);
        
        if (data.success === true){
          setProducts(data.data);
          //console.log(data.data);
          
          var i =0;
          let productsImages = [];
          for(i=0; i < data.data.length;i++){
            if (data.data[i].images !== undefined){   // 에러처리
              productsImages[i] = data.data[i].images[0];
            }
          }
          setImages(productsImages);
          
        } else {
          alert("Login fail");
          //history.push('/');
        }

      });
  }

  // function loadContentsCategory(currCategory) {
  //   console.log('loadContentsCategory in MyListGoods');
  //   let url = `${API_URL}/products`;
  //   // console.log("url:", url);

  //   if (currCategory !== undefined && currCategory !== 1004) {  //1004 = All Category
  //     url = url + "/category/" + currCategory;
  //     console.log("url:", url);
  //   }
  //   axios.get(url).then(response => response.data)
  //     .then((data) => {
  //       setProducts(data.data);
  //       //data.map(function (product) {
  //       //  console.log(product);
  //       //  return 1;
  //       //});
  //     });
  // }

  
  // function loadCategory() {
  //   // console.log('loadCategory');
  //   const url = `${API_URL}/category`;
  //   // console.log("category url:", url);
    
  //   axios.get(url).then(response => response.data)
  //     .then((data) => {
  //       setCategory(data.data);
  //       // data.map(function (category) {
  //       //   console.log(category.name);
  //       //   return 1;
  //       // });
  //     });
  // }

  const handleEdit = (productsObjId) => {
      history.push(`/UpdGoods/${productsObjId}`);
  }

  const handleDelete = (productsObjId) => {

    console.log("productsObjId",productsObjId);
    const url = `${API_URL}/products/${productsObjId}`;
    const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
    //console.log('token from localstorage:', token);
    console.log('url=', url);

    axios({
      method: 'delete',
      url: url,
      // data: qs.stringify({
      //   email: email,
      // }),
      headers: {
        'authorization': token,
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
      .then(res => {
        console.log(JSON.stringify(res));
        console.log(res.data);
        if (res.data.success === true){
          console.log("Delete success !");
          //alert("Delete success !");
          // reload page
          loadContents();
        } else {
          alert("Delete fail !");
        }
      })
  }


  useEffect(() => {
    console.log("useEffect did");
    /* parent reload */
    //props.data();
    loginCheck();
    loadContents();
    //loadCategory();
  }, []);
  
  return (
    <React.Fragment>
      
      <div className={classes.root}>

        <main className={classes.content}>
          <Toolbar />
          {/* Category Show */}
          {/* <Container >
            <Grid>
              <Grid container justify="center" spacing='2'>
              <Breadcrumbs aria-label="breadcrumb">
                
              {category.map((text, index) => (
                  <Link key={index} color="inherit" href="/"
                    onClick={
                      function (event) {
                      event.preventDefault();
                      loadContents(text.code);
                  }}>
                    {text.name}
                  </Link>
              ))}
              </Breadcrumbs>
              </Grid>
            </Grid>
          </Container> */}

          <Container className={classes.cardGrid} maxWidth="md">
            <Grid container spacing={4}>
              {products.map((card, index) => (
                <Grid item key={card._id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <RLink to={'/viewgoods/' + card._id}>
                      {/* <CardMedia
                        className={classes.cardMedia}
                        image={API_URL + '/imageFiles/' + card.image}
                        title={card.title}
                      /> */}
                      <CardMedia
                        className={classes.cardMedia}
                        image={API_URL + '/imageFiles/' + images[index]}

                        title={card.title}
                      />
                    </RLink>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.title}
                      </Typography>
                      <Typography>
                        {card.price}원 {card.description}
                        {card._id}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        {card.viewCount} View
                    </Button>
                      <Button size="small" color="primary"
                      onClick={
                        function (event) {
                        event.preventDefault();
                        handleEdit(card._id);
                    }}>
                        Edit
                    </Button>
                    <Button size="small" color="primary" 
                    onClick={
                      function (event) {
                      event.preventDefault();
                      let response = window.confirm("등록된 상품을 삭제하시겠습니까?");
                      if (response === false) {
                        return;
                      }
                      handleDelete(card._id);
                  }}>
                        Delete
                    </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
      </div>
      {/* <FooterApp/> */}
    </React.Fragment>
  );
}
