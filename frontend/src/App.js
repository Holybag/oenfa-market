import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
//import { useState } from 'react';

//import Home from './pages/Home';
import About from './pages/About';
import RegisterGoods from './pages/RegisterGoods';
import ListGoods from './pages/ListGoods';
import ViewGoods from './pages/ViewGoods';
import Login from './pages/Login';
import Logout from './pages/Logout';
import SignUp from './pages/SignUp';
import SignUpConfirm from './pages/SignUpConfirm';
import ViewUser from './pages/ViewUser';
import UpdUser from './pages/UpdUser';

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
//import MenuListComposition from './MenuListComposition';
import { useHistory } from 'react-router-dom';


// import React from 'react';
// import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
// import { makeStyles } from '@material-ui/core/styles';


const API_URL = 'http://localhost:5000';

class App extends Component {
  state = {
    loginState: false
  }
  
  loginCheck = () => {
    console.log('logCheckFunc');
    var email_token = localStorage.getItem('userInfo');
    const obj = JSON.parse(email_token);

    if (obj == null){
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
        this.setState({loginState:res.data.success})
    })
  }

  // After render()
  componentDidMount(){
    // console.log('class => componentDidMount');
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
        <Route path="/logout" render={() => <Logout data={this.loginCheck} />}/>        
        <Route path='/signup' component={SignUp} />
        <Route path='/signupconfirm' component={SignUpConfirm} />
        <Route path='/viewuser' component={ViewUser} />        
        <Route path='/upduser' component={UpdUser} />        
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
  // console.log("LogInMenu");
  return(
    <React.Fragment>
      <Link to='/registergoods'>
        <Button color="primary" variant="contained">상품 등록</Button>
      </Link>      
      <Link to='/ViewUser'>
        <Button color="primary" variant="contained">나의 정보</Button>
      </Link>
      <Link to='/UpdUser'>
        <Button color="primary" variant="contained">설 정</Button>
      </Link>
      <Link to='/Logout'>
        <Button color="primary" variant="contained">LogOut</Button>
      </Link>

      {/* <MenuListComposition/> */}

    </React.Fragment>
  );
}


function LogOutMenu() {
  // console.log("LogOutMenu");
  return(
    <React.Fragment>
      <Link to='/Login'>
        <Button color="primary" variant="contained">Log in</Button>
      </Link>
      <Link to='/SignUp'>
        <Button color="primary" variant="contained">Sign in</Button>
      </Link>
      
      {/* <MenuListComposition/> */}
      

    </React.Fragment>
  );
}



const useStyles2 = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

function MenuListComposition() {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  
  let history = useHistory();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    console.log("handleClose");  
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    console.log("setOpen:false");  
    setOpen(false);
  };

  const handleProfile = (event) => {
    console.log("handleProfile");
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      console.log("return");
      return;
    }
    history.push('/ViewUser');
    console.log("setOpen:false");  

    setOpen(false);
  };

  const handleUpdUser = (event) => {
    console.log("handleUpdUser");
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      console.log("return");
      return;
    }
    history.push('/UpdUser');
    console.log("setOpen:false");  

    setOpen(false);
  };

  const handleLogout = (event) => {
    console.log("handleLogout");
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      console.log("return");
      return;
    }
    history.push('/Logout');
    console.log("setOpen:false");  

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    console.log("useEffect");
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      {/* <Paper className={classes.paper}>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>My account</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuList>
      </Paper> */}
      <div>
        <Button
          color="primary" 
          variant="contained"
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          My Info
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleUpdUser}>My account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
