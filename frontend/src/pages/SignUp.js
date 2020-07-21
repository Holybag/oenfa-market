import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
//import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import qs from 'qs';

//const API_URL = 'http://localhost:5000'
const API_URL = process.env.REACT_APP_API_URL;

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

export default function SignUp() {
  const classes = useStyles();

  const [duplicateCheck, setDuplicateCheck] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [description, setDescription] = useState('');
  
  let history = useHistory();
  
  const handleIdCheck = (event) => {
    console.log('handleIdCheck:');
    event.preventDefault();
    
    if (email === ""){
      alert("이메일 주소를 입력하세요.!")
      return;
    } else if(checkEmail(email) === false){
      return;
    }

    const url = `${API_URL}/users/${email}`;
    axios({
      method: 'get',
      url: url,
      data: qs.stringify({
        email: email
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
      .then(res => {
        console.log(JSON.stringify(res));
        //history.push('/');
      
        let response = res.data;
        if (response.success === true){
          alert("이 이메일을 사용 할 수 없습니다. 다른 이메일 아이디가 필요합니다.");
          setEmail('');
        } else {
          alert("사용 가능한 이메일 입니다.");
          setDuplicateCheck(true);
        }
      })
  }

  const handleSummit = (event) => {
      console.log('email:',email);
      console.log('password:',password);
      console.log('name:',name);
      console.log('tel:',tel);
      console.log('description:',description);
      event.preventDefault();

      if (duplicateCheck === false){
        alert("중복 체크를 확인하셔야 합니다.");
        return;
      }

      if (email === ""){
        alert("Email은 필수 항목입니다!");
        setEmail('');
        return;
      }

      if (password === ""){
        alert("비밀번호는 필수 항목입니다!");
        setPassword('');
        return;
      }

      const url = `${API_URL}/users`;
      axios({
        method: 'post',
        url: url,
        data: qs.stringify({
          email: email,
          password: password,
          name: name,
          tel: tel,
          description: description
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      })
        .then(res => {
          console.log(JSON.stringify(res));
          //history.push('/');
        
          let response = res.data;
          if (response.success === true){
            alert("가입이 완료되었습니다. 로그인이 필요합니다.");
            history.push('/login');
          } else {
            alert("가입 실패");
            //history.push('/');
          }
        })
    }
  
  function checkEmail(email) {
    //var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    var exptext = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+.[A-Za-z0-9-]+/;
    //var exptext = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (exptext.test(email) === false) {
      //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우			
      alert("이 메일형식이 올바르지 않습니다.");
      return false;
    }
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
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
            
              <Grid item xs={8} spacing={2}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                </Grid>
              <Grid xs={4}>
                  <Button
                    type="submit"
                    width="100"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleIdCheck}
                    >중복 체크
                  </Button>
                
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
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="./login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        
      </Container>
    </React.Fragment>
  );
}