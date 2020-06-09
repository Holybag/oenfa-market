import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
//import Grid from '@material-ui/core/Grid';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';


//const API_URL = 'http://localhost:5000'
const API_URL = process.env.REACT_APP_API_URL;

// const useStyles = makeStyles({
const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paper: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

export default function SingUpConfirm() {
    const [result, setResult] = useState();
    const classes = useStyles();

    function loadContents() {
        console.log('loadContents01');
        const currentRoute = window.location.pathname;
        var authKey = currentRoute.replace("/SignUpConfirm/", "");  // remove "/SignUpConfirm/"
        let url = `${API_URL}/users/confirm/${authKey}`;
        console.log("url", url);

        axios.get(url).then(response => response.data)
            .then((data) => {
                if (data.success === true) {
                    setResult("사용자 이메일 인증 성공");
                } else {
                    setResult("사용자 이메일 인증 실패");
                }
            });
    }

    useEffect(() => {
        loadContents();
    }, []);

    return (
        <React.Fragment>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {result}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                            <Link href="../login" variant="body2">
                                    Already have an account? Sign in
                                    </Link>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    
                </div>
            </Container>
        </React.Fragment>
    );
}
