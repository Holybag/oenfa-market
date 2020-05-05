import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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
import qs from 'qs';

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

export default function UpdUser() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [description, setDescription] = useState('');
  
  let history = useHistory();

  const handleSummit = (event) => {
      console.log('email:',email);
      console.log('password:',password);
      console.log('name:',name);
      console.log('tel:',tel);
      console.log('description:',description);
      event.preventDefault();

      var userId = email;
      const url = `${API_URL}/users/${userId}`;
      const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
      //console.log('token from localstorage:', token);
  
      axios({
        method: 'put',
        url: url,
        data: qs.stringify({
          email: email,
          password: password,
          name: name,
          tel: tel,
          description: description
        }),
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
            console.log("Update success !");
            alert("Update success !");
          } else {
            alert("Update fail !");
          }
          history.push('/');
        })

    }
  
  //const [user, setUser] = useState([]);
  // const classes = useStyles();

  function loadUserInfo() {
    console.log('loadUserInfo');
    let url = `${API_URL}/users/view`;
    console.log("url", url);
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
        let result = data.data;
        console.log(result);
        //setUser(result);
        setEmail(result.email);
        setPassword(result.password);
        setName(result.name);
        setDescription(result.description);
        setTel(result.tel);
        
        //let response = data.data;
        if (data.success === true){
          //history.push('/');
        } else {
          console.log("UpdUser.js: Login fail");
          alert("Login fail");
          history.push('/');
        }
        
      });
  }

  useEffect(() => {
    loadUserInfo();
  }, []);

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            나의 정보 수정
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
            
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  disabled
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="Name"
                  label="Name"
                  name="Name"
                  autoComplete="lname"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="Tel"
                  label="Tel"
                  name="Tel"
                  autoComplete="Tel"
                  value={tel}
                  onChange={(event) => setTel(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="description"
                  name="description"
                  label="description"
                  type="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSummit}
            >
              수정
            </Button>
            
          </form>
        </div>
      </Container>
    </React.Fragment>
  );
}