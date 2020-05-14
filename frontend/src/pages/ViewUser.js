import React from 'react';
//import { useState } from 'react';
import { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
//import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
//import TextField from '@material-ui/core/TextField';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
//import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
//import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
//import qs from 'qs';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';



const API_URL = 'http://localhost:5000'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ViewUser() {
  const [user, setUser] = useState([]);
  const classes = useStyles();

  let history = useHistory();
  
  useEffect(() => {
    console.log("useEffect in ViewUser");
    loadUserInfo();
  }, []);


  function loadUserInfo() {
    console.log('loadUserInfo');
    const url = `${API_URL}/users/view`;
    
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
          setUser(data.data);
          console.log(data);
        } else {
          alert("Login fail");
          history.push('/');
        }

      });
  }



  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            나의 정보
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Card className={classes.root}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      이메일: {user.email}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                      이름: {user.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              
              <Card className={classes.root}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      전화번호: {user.tel}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                      정보: {user.description}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                      등록일: {user.createdAt}
                    </Typography>

                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>

        </div>
      </Container>
    </React.Fragment>
  );
}