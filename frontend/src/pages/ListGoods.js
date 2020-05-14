import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link as RLink } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

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


export default function ListGoods() {
  const classes = useStyles();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  //const [value, setValue] = React.useState(0);

  function loadContents(currCategory) {
    console.log('loadContents');
    let url = `${API_URL}/products`;
    // console.log("url:", url);

    if (currCategory !== undefined && currCategory !== 1004) {  //1004 = All Category
      url = url + "/category/" + currCategory;
      console.log("url:", url);
    }
    axios.get(url).then(response => response.data)
      .then((data) => {
        setProducts(data);
        data.map(function (product) {
          //console.log(product);
          return 1;
        });
      });
  }

  function loadCategory() {
    // console.log('loadCategory');
    const url = `${API_URL}/category`;
    // console.log("category url:", url);
    
    axios.get(url).then(response => response.data)
      .then((data) => {
        setCategory(data);
        data.map(function (category) {
          //console.log(category.name);
          return 1;
        });
      });
  }

  useEffect(() => {
    // console.log("useEffect did");
    loadContents();
    loadCategory();
  }, []);
  
  return (
    <React.Fragment>
      
      <div className={classes.root}>

        <main className={classes.content}>
          <Toolbar />
          {/* Category Show */}
          <Container >
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
          </Container>

          <Container className={classes.cardGrid} maxWidth="md">
            <Grid container spacing={4}>
              {products.map((card) => (
                <Grid item key={card._id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <RLink to={'/viewgoods/' + card._id}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={API_URL + '/imageFiles/' + card.image}
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
      </div>
      {/* <FooterApp/> */}
    </React.Fragment>
  );
}
