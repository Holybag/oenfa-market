import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function FooterApp() {
  const classes = useStyles();
  return(
        <React.Fragment>
          <footer className={classes.footer}>
            {/* <Typography variant="h6" align="center" gutterBottom>
            </Typography> */}
            <Copyright />
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            oenfa.voc@gmail.com
            </Typography>
          </footer>
        </React.Fragment>
    );
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'} All rights reserved.
    </Typography>
  );
}
