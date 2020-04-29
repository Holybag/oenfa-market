import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
    //products.image = "";

    function loadContents() {
        console.log('loadContents01');
        const currentRoute = window.location.pathname;
        var objId = currentRoute.replace("/viewgoods/", "");  // remove "/viewgoods/"
        let url = `${API_URL}/products/${objId}`;
        console.log("url",url);

        axios.get(url).then(response => response.data)
            .then((data) => {
                // modified date string
                data.createdAt = data.createdAt.substr(0,10);
                setProducts(data);
                console.log(data.image);
                //console.log(data.createdAt.substr(0,10));
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
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="h4">
                                카테고리: <CategoryCode2Name code={products.category} />
                            </Typography>
                        </CardContent>
                    </div>

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
                        {/* 로그인시에는 전화를 걸 수 있도록 */}
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        015901400000
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        로그인시에는 전화를 걸 수 있도록
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

/* change category code to name */
function CategoryCode2Name(props) {
    const [categoryName, setcategoryName] = useState();

    let url = `${API_URL}/category/${props.code}`;
    axios.get(url).then(response => response.data)
        .then((data) => {
            //console.log(data.name);
            setcategoryName(data.name);
        });

    return (
        <React.Fragment>
            {categoryName}
        </React.Fragment>
    );
}
