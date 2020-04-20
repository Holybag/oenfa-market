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

import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const API_URL = 'http://localhost:5000'
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
}));


//export default function ClippedDrawer() {
export default function ListGoods() {
  const classes = useStyles();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  function loadContents(currCategory) {
    console.log('loadContents');
    let url = `${API_URL}/products`;

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
    console.log('loadCategory');
    const url = `${API_URL}/category`;
    console.log("category url:", url);
    
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
    console.log("useEffect did");
    loadContents();
    loadCategory();
  }, []);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              <Link style={{ textDecoration: 'none' }} to='/'>
                OE & FA Market
            </Link>
            </Typography>
          </Toolbar>

          <div className={classes.drawerContainer}>
            <Divider />
            <List>
              {category.map((text, index) => (
                <ListItem button key={text._id} onClick={
                  function () {
                    loadContents(text.code);
                  }}>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text.name} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </div>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
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
                    <RLink style={{ textDecoration: 'none' }} to='/registergoods'>
                      <Button variant="outlined">
                        상품등록
                    </Button>
                    </RLink>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>

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
