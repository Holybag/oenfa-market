import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import About from './pages/About';
import RegisterGoods from './pages/RegisterGoods';
import ListGoods from './pages/ListGoods';
import MyListGoods from './pages/MyListGoods';

import ViewGoods from './pages/ViewGoods';
import ViewChatting from './pages/ViewChatting';
import UpdGoods from './pages/UpdGoods';
import Login from './pages/Login';
import Logout from './pages/Logout';
import SignUp from './pages/SignUp';
import SignUpConfirm from './pages/SignUpConfirm';
import ViewUser from './pages/ViewUser';
import UpdUser from './pages/UpdUser';
//import Button from '@material-ui/core/Button';
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
// import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//import InboxIcon from '@material-ui/icons/MoveToInbox';
//import MailIcon from '@material-ui/icons/Mail';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SvgIcon from '@material-ui/core/SvgIcon';
import LockOpenSharpIcon from '@material-ui/icons/LockOpenSharp';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import SettingsIcon from '@material-ui/icons/Settings';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

import "./assets/scss/material-kit-react.scss?v=1.8.0";

//const API_URL = 'http://localhost:5000';

//<p>{process.env.REACT_APP_DB_HOST}</p>

const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL",API_URL);

class App extends Component {
    state = {
        loginState: false,
        drawerState: false
    }

    loginCheck = () => {
        console.log('logCheckFunc');
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
                this.setState({ loginState: res.data.success })
            })
    }

    // After render()
    componentDidMount() {
        // console.log('class => componentDidMount');
        this.loginCheck();
    }

    render() {
        return (
            <BrowserRouter>

                <ButtonAppBar currState={this.state.loginState} />

                <Route exact path='/' component={ListGoods} />
                <Route path='/listgoods' component={ListGoods} />
                <Route path='/registergoods' component={RegisterGoods} />
                {/* <Route path='/mylistgoods'  render={() => <MyListGoods data={this.loginCheck} />} /> */}
                <Route path='/mylistgoods'  component={MyListGoods} />
                <Route path="/login" render={() => <Login data={this.loginCheck} />} />
                <Route path="/logout" render={() => <Logout data={this.loginCheck} />} />
                <Route path='/signup' component={SignUp} />
                <Route path='/signupconfirm' component={SignUpConfirm} />
                <Route path='/viewuser' component={ViewUser} />
                <Route path='/upduser' component={UpdUser} />
                <Route path='/viewgoods' component={ViewGoods} />
                <Route path='/viewchatting' component={ViewChatting} />                
                <Route path='/updgoods' component={UpdGoods} />
                <Route path='/about' component={About} />
                
                <FooterApp />

            </BrowserRouter>
        );
    }
}

export default App;


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));


function ButtonAppBar(props) {
    const classes = useStyles();

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const parentCallback = () => {
        // 자식 컴포넌트에서 받은 값을 이용한 로직 처리
        console.log("dataFromChild : ");
        handleDrawerClose();
    }

    return (
        <div className={classes.root}>

            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        OE & FA Market
          </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />

                {props.currState ? <LogInMenu callbackFromParent={parentCallback} /> : <LogOutMenu callbackFromParent={parentCallback} />}

            </Drawer>
        </div>
    );
}


function LogInMenu(props) {
    // console.log("LogInMenu");
    let history = useHistory();

    const handleSummitHome = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/');
    }
    const handleSummitMsg = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/viewchatting');
    }
    const handleSummitMy = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/ViewUser');
    }
    const handleSummitProd = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/MyListGoods');
    }
    const handleSummitReg = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/registergoods');
    }
    const handleSummitSetting = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/UpdUser');
    }
    const handleSummitLogout = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/Logout');
    }

    return (
        <React.Fragment>
            <ListItem button key='0' onClick={handleSummitHome}>
                <ListItemIcon><HomeIcon color="secondary" /></ListItemIcon>
                <ListItemText primary="홈" />
            </ListItem>
            <ListItem button key='5' onClick={handleSummitMsg}>
                <ListItemIcon><ChatIcon /></ListItemIcon>
                <ListItemText primary="메시지" />
            </ListItem>
            <ListItem button key='6' onClick={handleSummitProd}>
                <ListItemIcon><AssignmentTurnedInIcon /></ListItemIcon>
                <ListItemText primary="상품 관리" />
            </ListItem>
            <ListItem button key='2' onClick={handleSummitReg}>
                <ListItemIcon><AddAPhotoIcon /></ListItemIcon>
                <ListItemText primary="상품 등록" />
            </ListItem>
            <ListItem button key='1' onClick={handleSummitMy}>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="나의 정보" />
            </ListItem>
            <ListItem button key='3' onClick={handleSummitSetting}>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="설 정" />
            </ListItem>
            <ListItem button key='4' onClick={handleSummitLogout}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="LogOut" />
            </ListItem>

        </React.Fragment>
    );
}


function LogOutMenu(props) {
    // console.log("LogOutMenu");
    let history = useHistory();

    const handleSummitHome = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/');
    }
    const handleSummitLogin = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/Login');
    }
    const handleSummitSignUp = (event) => {
        event.preventDefault();
        props.callbackFromParent();
        history.push('/SignUp');
    }

    return (
        <React.Fragment>
            <List>
                <ListItem button key='1' onClick={handleSummitHome}>
                    <ListItemIcon><HomeIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="홈" />
                </ListItem>
                <ListItem button key='2' onClick={handleSummitLogin}>
                    <ListItemIcon><LockOpenSharpIcon /></ListItemIcon>
                    <ListItemText primary="Log in" />
                </ListItem>
                <ListItem button key='3' onClick={handleSummitSignUp}>
                    <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
                    <ListItemText primary="Sign in" />
                </ListItem>
            </List>
        </React.Fragment>
    );
}


function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}
