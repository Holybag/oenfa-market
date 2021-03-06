import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
//import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LoginGoogle from './LoginGoogle';
import LoginFacebook from './LoginFacebook';

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },

}));



export default function Login(props) {

    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let history = useHistory();

    //console.log(props.data);

    const handleSummit = (event) => {
        console.log('email:', email);
        console.log('password:', password);

        event.preventDefault();
        const url = `${API_URL}/login`;
        axios.post(url, {
            'email': email,
            'password': password,
        }).then(res => {
            //console.log(JSON.stringify(res));
            let response = res.data;
            if (response.success === true) {
                localStorage.setItem('userInfo', JSON.stringify({
                    email: response.data.email,
                    token: response.data.token
                }))
                /* parent reload */
                props.data();
                history.push('/');
            } else {
                alert("login fail");
            }
        })
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
                        Login
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSummit}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>

                <div>
                    <LoginGoogle data={props.data} ></LoginGoogle>
                </div>

                <div>
                    <LoginFacebook data={props.data}></LoginFacebook>
                </div>

                {/* <Box mt={8}>
            <Copyright />
          </Box> */}
            </Container>
        </React.Fragment>
    );
}
