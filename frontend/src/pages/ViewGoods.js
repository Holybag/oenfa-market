import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
//import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const API_URL = 'http://localhost:5000'

const useStyles = makeStyles({
  root: {
  //  maxWidth: 345,
    maxWidth: 600,
  },
  media: {
//    height: 140,
    height: 400,
  },
});


export default function ViewGoods() {
  const [products, setProducts] = useState([]);
  const classes = useStyles();

  function loadContents() {
    console.log('loadContents');
    const currentRoute= window.location.pathname;
    var objId = currentRoute.replace("/viewgoods/","");  // remove "/viewgoods/"
    const url = `${API_URL}/products/${objId}`;

    console.log('loadContents:', url);
    
    axios.get(url).then(response => response.data)
      .then((data) => {
        setProducts(data);
        console.log(data);

        // data.map(function (product) {
        //   console.log(product);
        //   return 1;
        // });
      });
  }

  useEffect(() => {
    loadContents();
  }, []);

  return (
    <main className={classes.content}>
      <div align="center" >
        <div><p></p></div>
        <React.Fragment>
          {/* <div>_id: {products._id}</div>
          <div>title: {products.title}</div>
          <div>userId: {products.userId}</div>
          <div>price: {products.price}</div>
          <div>description: {products.description}</div>
          <div>image: {products.image}</div>
          <div>createdAt: {products.createdAt}</div> */}

          <div>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={API_URL + '/imageFiles/' + products.image}
                  title={products.title}
                />
              </CardActionArea>
            </Card>
          </div>
          <div align="center">
            <Card className={classes.root}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {products.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {products.price} 원
                    </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {products.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    등록일: {products.createdAt}
                  </Typography>

                </CardContent>
              </CardActionArea>
            </Card>
          </div>

          {/* </div>
        ))} */}
        </React.Fragment>
      </div>
    </main>
  );
}