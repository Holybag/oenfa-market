import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
//import { useState } from 'react';

//import Home from './pages/Home';
import About from './pages/About';
import RegisterGoods from './pages/RegisterGoods';
import ListGoods from './pages/ListGoods';
import ViewGoods from './pages/ViewGoods';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import axios from 'axios';
import qs from 'qs';
//import { useHistory } from 'react-router-dom';

import FooterApp from './pages/FooterApp';

const API_URL = 'http://localhost:5000';

class App extends Component {
  state = {
    loginState: false
  }
  
  loginCheck = () => {
    console.log('logCheckFunc');
    var email_token = localStorage.getItem('userInfo');
    const obj = JSON.parse(email_token);
    
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
        this.setState({loginState:res.data.success})
    })
  }

  // After render()
  componentDidMount(){
    console.log('class => componentDidMount');
    this.loginCheck();
  }

  render() {
    return (
      <BrowserRouter>

        <ButtonAppBar currState={this.state.loginState}/>
        
        <Route exact path='/' component={ListGoods} />
        <Route path='/about' component={About} />
        <Route path='/listgoods' component={ListGoods} />
        <Route path='/registergoods' component={RegisterGoods} />        
        <Route path="/login" render={() => <Login data={this.loginCheck} />}/>
        <Route path='/signup' component={SignUp} />        
        <Route path='/viewgoods' component={ViewGoods} />        

        <FooterApp/>

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



function ButtonAppBar(props) {
  console.log("App.js ButtonAppBar");
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
          
          {props.currState ? <LogInMenu/> : <LogOutMenu/>}

          </Toolbar>
      </AppBar>
    </div>
  );
}


function LogInMenu() {
  console.log("LogInMenu");
  return(
    <React.Fragment>
      <Link to='/registergoods'>
        <Button color="primary" variant="contained">상품 등록</Button>
      </Link>      
      <Link to='/Login'>
        <Button color="primary" variant="contained">LogOut</Button>
      </Link>
    </React.Fragment>
  );
}


function LogOutMenu() {
  console.log("LogOutMenu");
  return(
    <React.Fragment>
      <Link to='/Login'>
        <Button color="primary" variant="contained">Log in</Button>
      </Link>
      <Link to='/SignUp'>
        <Button color="primary" variant="contained">Sign in</Button>
      </Link>
    </React.Fragment>
  );
}
