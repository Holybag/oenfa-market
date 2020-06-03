import React, { useEffect } from 'react';
import { useState } from 'react';
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
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
//import { Link as RLink } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import axios from 'axios';
import qs from 'qs';

import { MenuItem, InputLabel } from '@material-ui/core';
//import { Redirect } from 'react-router-dom';


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
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    // display: 'none',
  },

}));


export default function UpdGoods() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [imageFile2, setImageFile2] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  let history = useHistory();

  function loadCategoryList() {
    const url = `${API_URL}/category`;

    axios.get(url).then(response => response.data)
      .then((data) => {
        setCategoryList(data.data);
        console.log(data.data);
      })
  }

  const categoryListSelected = (event) => {
    //console.log('event value:', event.target);
    setCategory(event.target.value);
    // categoryList.map((category) => {
    //   console.log(category.name);
    //   if (category.name === event.target.name) {
    //     setCategory(category.code)
    //     console.log('category selected:', category.name);
    //     return;
    //   }
    // });
  }

  const handleSummit = (event) => {
    console.log('title:',title);
    console.log('category:',category);
    console.log('price:',price);
    console.log('description:',description);
    event.preventDefault();
    const formData = new FormData();
    formData.append('imgFile', imageFile);
    formData.append('imgFile', imageFile2);
    formData.append('title', title);
    formData.append('userId', 1);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('description', description);
    
    //const url = `${API_URL}/products`;
    
    const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
    const currentRoute = window.location.pathname;
    var objId = currentRoute.replace("/UpdGoods/", "");  // remove "/viewgoods/"
    let url = `${API_URL}/products/${objId}`;
    console.log("url", url);
    console.log("formData", formData);


    //axios.put(url, formData, {
    axios({
      method: 'put',
      url: url,
      data: qs.stringify({
        imgFile: [imageFile,imageFile2],
        title: title,
        category: category,
        price: price,
        description: description
      }),
      headers: {
        'authorization': token,
        'Accept': 'application/json',
        //'Content-Type': 'application/json'
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
      
    })
      .then(res => {
        //console.log(JSON.stringify(res));
        //console.log(res.data);
        if (res.data.success){

          //history.push('/');
          alert("상품 수정 성공: " + res.data.message);
        } else {
          //console.log(res.data.errors);
          //console.log("error message display");
          alert("상품 수정 실패: " + res.data.message);
        }        
      })
  }

  function loadGoodsInfo() {
    console.log('loadGoodsInfo');
    //let url = `${API_URL}/products/view`;
    //console.log("url", url);
    const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
    console.log('token from localstorage:', token);

    const currentRoute = window.location.pathname;
    var objId = currentRoute.replace("/UpdGoods/", "");  // remove "/viewgoods/"
    let url = `${API_URL}/products/${objId}`;
    console.log("url", url);

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
        
        //let response = data.data;
        if (data.success === true){
          let result = data.data;
          console.log("결과");
          console.log(result);
          setTitle(result.title);
          setCategory(result.category);
          setPrice(result.price);
          setDescription(result.description);
  
          setImageFile(result.images[0]);
          setImageFile2(result.images[1]);
          console.log(result.images[0]);
          console.log(result.images[1]);
  
          //history.push('/');
        } else {
          console.log("loadGoodsInfo fail");
          alert("load GoodsInfo fail");
          //history.push('/');
        }
        
      });
  }

  useEffect(() => {
    loadCategoryList();
    loadGoodsInfo();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          상품 정보 수정 !!
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <input 
                name="imgFile" 
                type="file"
                onChange={(event) => setImageFile(event.target.files[0])}
                accept="image/*" 
                className={classes.input} 
                id="icon-button-file" />
              <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Grid>

            {/* second image file process*/}
            <Grid item xs={12}>
              <input 
                name="imgFile2" 
                type="file"
                  onChange={(event) => setImageFile2(event.target.files[0])}
                accept="image/*" 
                className={classes.input} 
                id="icon-button-file2" />
              <label htmlFor="icon-button-file2">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                name="title"
                variant="outlined"
                required
                fullWidth
                id="title"
                label="제목"
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
            <FormControl variant="outlined" style={{width: "100%"}}>
            <InputLabel id="outlined-label-category">
                카테고리
              </InputLabel>
              <Select
                id='category'
                labelId='outlined-label-category'
                label='카테고리'
                value={category}
                // onChange={(event) => setCategory(event.target.value)}
                onChange={categoryListSelected}
              >
                <MenuItem value={0} key={0}>None</MenuItem>
                {categoryList.map((category, index) => (
                  <MenuItem value={category.code} key={index+1}>
                    {category.name}
                  </MenuItem>
                ))}
                
              </Select>
            </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="price"
                label="금액"
                name="price"
                autoComplete="address1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="description"
                label="상세설명"
                multiline
                rows="8"
                name="description"
                autoComplete="address1"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSummit}
          >
            상품 정보 수정
          </Button>
        </form>
      </div>
    </Container>
  );
}