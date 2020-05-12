import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';


const API_URL = 'http://localhost:5000'

const useStyles = makeStyles({
    root: {
        //  maxWidth: 345,
        maxWidth: 400,
    }
});

export default function SingUpConfirm() {
    const [result, setResult] = useState();
    const classes = useStyles();

    function loadContents() {
        console.log('loadContents01');
        const currentRoute = window.location.pathname;
        var authKey = currentRoute.replace("/SignUpConfirm/", "");  // remove "/SignUpConfirm/"
        let url = `${API_URL}/users/confirm/${authKey}`;
        console.log("url",url);

        axios.get(url).then(response => response.data)
            .then((data) => {
                if (data.success === true){
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
        <main className={classes.content}>
            <React.Fragment>
                <div align="center" >
                    <div><p></p></div>
                    <div>
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {result}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <div><p></p></div>
                        <Card className={classes.root}>
                            <Grid container justify="center">
                                <Grid item>
                                    <Link href="../login" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Card>
                    </div>
                </div>
            </React.Fragment>
        </main>
    );
}
