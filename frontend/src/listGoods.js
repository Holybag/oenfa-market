import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Oenfa
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
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
}));

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const goods = [
  {
    'id': '1',
    'title': '맥북 x201',
    'image': 'https://placeimg.com/64/64/any',
    'category': '컴퓨터',
    'price': '300,000',
    'desc': '상태 양호합니다'
  },
  {
    'id': '2',
    'title': '그냥 북 x401',
    'image': 'https://source.unsplash.com/random',
    'category': '책',
    'price': '40,000',
    'desc': '상태 B 급이여'
  },
  {
    'id': '3',
    'title': '흰 바지 x801',
    'image': 'https://placeimg.com/128/128/any',
    'category': '북',
    'price': '10,000',
    'desc': '최상급입니다.'
  },
  {
    'id': '1',
    'title': '비디오 503',
    'image': 'https://placeimg.com/32/64/any',
    'category': '컴퓨터',
    'price': '300,000',
    'desc': '상태 양호합니다'
  },
  {
    'id': '2',
    'title': '만화책 x401',
    'image': 'https://placeimg.com/100/100/any',
    'category': '책',
    'price': '40,000',
    'desc': '상태 B 급이여'
  },
  {
    'id': '3',
    'title': '핸드폰 x501',
    'image': 'https://placeimg.com/80/40/any',
    'category': '북',
    'price': '10,000',
    'desc': '최상급입니다.'
  }
]

export default function ListGoods() {
  const classes = useStyles();
  const [products, setProducts] = useState([]);

  function loadContents() {
    console.log('loadContents');
    const url = `${API_URL}/products`;
    axios.get(url).then(response => response.data)
      .then((data) => {
        setProducts(data);
        let list = data.map(function (product) {
          console.log(product);
          return 1;
        });
      });
  }

  useEffect(() => {
    loadContents();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            상품 리스트
          </Typography>
        </Toolbar>
      </AppBar>

      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              OE & FA
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              여기서 주거니 받거니
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    상품 조회
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    상품 등록
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {console.log(products)}
            {products.map((card) => (
              <Grid item key={card._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={API_URL + '/imageFiles/' + card.image}
                    title={card.title}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography>
                      {card.price}원 {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>

      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
