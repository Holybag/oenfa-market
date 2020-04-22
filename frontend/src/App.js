import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
//import Home from './pages/Home';
import About from './pages/About';
import RegisterGoods from './pages/RegisterGoods';
import ListGoods from './pages/ListGoods';
import ViewGoods from './pages/ViewGoods';
import SignUp from './pages/SignUp';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        
        <ButtonAppBar/>
        {/* <AppBar position="relative">
          <Toolbar>            
            <Typography variant="h6" color="inherit" noWrap>
            <Link style={{ textDecoration: 'none' }} to='/'>
              OE & FA Market
            </Link>
            </Typography>            
            <Link style={{ textDecoration: 'none' }} to='/registergoods'>
              <Button variant="outlined" color="primary">상품 등록</Button>
            </Link>
          </Toolbar>
        </AppBar> */}
        
        <Route exact path='/' component={ListGoods} />
        <Route path='/about' component={About} />
        <Route path='/listgoods' component={ListGoods} />
        <Route path='/registergoods' component={RegisterGoods} />        
        <Route path='/viewgoods' component={ViewGoods} />        
        <Route path='/signup' component={SignUp} />        
      </BrowserRouter>
    );
  }
}

export default App;


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(30),
  },
  title: {
    flexGrow: 1,
  },
}));

function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="primary" aria-label="menu">
            <Link to='/' color="inherit" >
              <MenuIcon />
            </Link>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            OE & FA Market
          </Typography>
          <Link to='/'>
            <Button color="primary" variant="contained">home</Button>
          </Link>
          <Link to='/registergoods'>
            <Button color="primary" variant="contained">상품 등록</Button>
          </Link>
          <Link to='/Login'>
            <Button color="primary" variant="contained">Login</Button>
          </Link>
          <Link to='/SignUp'>
            <Button color="primary" variant="contained">Sign in</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
