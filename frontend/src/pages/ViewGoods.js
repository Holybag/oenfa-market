import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
//import { makeStyles } from '@material-ui/core/styles';
//import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// react component for creating beautiful carousel
import Carousel from "react-slick";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import LocationOn from "@material-ui/icons/LocationOn";
// core components
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Card from "../components/Card/Card.js";

import styles from "../assets/jss/material-kit-react/views/componentsSections/carouselStyle.js";
import { container } from "../assets/jss/material-kit-react.js";

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles(styles);

const useStylesContens = makeStyles((theme) => ({
    content: {
        //marginTop: theme.spacing(0),
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    cardBox: {
        //maxWidth: 600,
        display: 'flex',
        alignItems: 'left',
        flexDirection: 'column',
    },
}));

export default function ViewGoods() {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState(['']);
    const classes = useStyles();
    const classesContents = useStylesContens();

    function loadContents() {
        console.log('loadContents01');
        const currentRoute = window.location.pathname;
        var objId = currentRoute.replace("/viewgoods/", "");  // remove "/viewgoods/"
        let url = `${API_URL}/products/${objId}`;
        console.log("url", url);

        axios.get(url).then(response => response.data)
            .then((data) => {
                // modified date string
                data.data.createdAt = data.data.createdAt.substr(0, 10);
                setProducts(data.data);
                //console.log(data.data);
                //console.log(data.data.images);
                if (data.data.images === undefined) {
                    let dafaultImg = ["default.png"];
                    setImages(dafaultImg);
                } else {
                    setImages(data.data.images);
                }
                //console.log(data.createdAt.substr(0,10));
            });
    }

    useEffect(() => {
        loadContents();
    }, []);

    return (
        <React.Fragment>
            <main>
                {/* <div className={classesContents.content} >
                </div> */}

                <div>
                    <div>
                        <ImageCarousel data={images} />
                    </div>

                    {/* <div>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h4">
                카테고리: <CategoryCode2Name code={products.category} />
              </Typography>
            </CardContent>
          </div> */}

                    <div>
                        {/* <Card className={classesContents.cardBox}> */}
                        <Card >
                            {/* <CardActionArea> */}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {products.title}
                                </Typography>
                                <Typography variant="h6" color="textSecondary" component="p">
                                    {products.price} 원
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {products.viewCount} View
                                </Typography>
                                <Typography variant="body1" color="textSecondary" component="p">
                                    등록일: {products.createdAt}
                                </Typography>
                            </CardContent>
                            {/* </CardActionArea> */}
                        </Card>
                        {/* 로그인시에는 전화를 걸 수 있도록 */}
                        <Card className={classes.root}>
                            {/* <CardActionArea> */}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    상세 정보
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {products.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    015901400000
                                </Typography>
                                {/* <Typography gutterBottom variant="h5" component="h2">
                        로그인시에는 전화를 걸 수 있도록
                    </Typography> */}
                            </CardContent>
                            {/* </CardActionArea> */}
                        </Card>
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
}

/* change category code to name */
function CategoryCode2Name(props) {
    const [categoryName, setcategoryName] = useState();

    let url = `${API_URL}/category/${props.code}`;
    axios.get(url).then(response => response.data)
        .then((data) => {
            //console.log(data.name);
            let category = data.data;
            if (Array.isArray(category) && category.length > 0) {
                setcategoryName(category[0].name);
            } else {
                setcategoryName("");
            }
        });
    return (
        <React.Fragment>
            {categoryName}
        </React.Fragment>
    );
}

function ImageCarousel(props) {
    //console.log("ImageCarousel");
    const classes = useStyles();
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false
    };
    return (
<div className={classes.section}>
    <div className={classes.container}>
        <GridContainer>
            <GridItem xs={12} sm={12} md={8} className={classes.marginAuto}>
                <Card carousel>
                    <Carousel {...settings}>
                        {props.data.map((fileName, index, images) => (
                            <div>
                                <img src={API_URL + '/imageFiles/' + props.data[index]}
                                    alt={fileName}
                                    className="slick-image" />
                                <div className="slick-caption">
                                    <h4>
                                        {index + 1}/{images.length}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </Card>
            </GridItem>
        </GridContainer>
    </div>
</div>
    );
}
