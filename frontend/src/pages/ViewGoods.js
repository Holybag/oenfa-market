import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
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

    axios.get(url).then(response => response.data)
      .then((data) => {
        setProducts(data);
        data.map(function (product) {
          console.log(product);
          return 1;
        });
      });
  }

  useEffect(() => {
    loadContents();
  }, []);

  return (
    <div align="center" >
      <React.Fragment>
        <div><p></p></div>
        {products.map((card) => (
          <div key={card._id}>
            {/* <div>_id: {card._id}</div>
            <div>title: {card.title}</div>
            <div>userId: {card.userId}</div>
            <div>price: {card.price}</div>
            <div>description: {card.description}</div>
            <div>image: {card.image}</div>
            <div>createdAt: {card.createdAt}</div> */}

            <div>
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={API_URL + '/imageFiles/' + card.image}
                    title={card.title}
                  />
                </CardActionArea>
              </Card>
            </div>
            <div><p></p></div>

            <div align="center">
              <Card className={classes.root}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {card.price} 원
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {card.description}
                      <p></p>등록일: {card.createdAt}
                    </Typography>

                  </CardContent>
                </CardActionArea>
              </Card>

            </div>
          </div>
        ))}
      </React.Fragment>
    </div>
  );
}