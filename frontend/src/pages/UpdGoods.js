import React, { useEffect } from 'react';
import { useState } from 'react';
//import { useHistory } from 'react-router-dom';
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
//import qs from 'qs';

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
  // style = {{'border: 1px solid #ddd; border-radius: 4px; padding: 5px; width: 130px;'}}
  img: {
    border: 1, 
    solid: "#ddd", 
    borderRadius: 2,
    padding: 2,
    width: 120,
  },
}));


export default function UpdGoods() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [prevImageFiles, setPrevImageFiles] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  //let history = useHistory();

  //function loadCategoryList() {
  const loadCategoryList = () => {
    const url = `${API_URL}/category`;
    axios.get(url).then(response => response.data)
      .then((data) => {
        setCategoryList(data.data);
        //console.log(data.data);
      })
  }

  const categoryListSelected = (event) => {
    setCategory(event.target.value);
  }

  const handleSummit = (event) => {
    // console.log('title:',title);
    // console.log('category:',category);
    // console.log('price:',price);
    // console.log('description:',description);
    event.preventDefault();
    
    const formData = new FormData();
    for (const key of Object.keys(imageFiles)) {
      formData.append('imgFile', imageFiles[key]);
    }
    formData.append('title', title);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('description', description);
    for (const key of Object.keys(prevImageFiles)) {
      formData.append('prevImageFiles', prevImageFiles[key]);
      //console.log('prevImageFiles', prevImageFiles[key]);
    }
    
    const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
    const currentRoute = window.location.pathname;
    var objId = currentRoute.replace("/UpdGoods/", "");  // remove "/viewgoods/"
    const url = `${API_URL}/products/${objId}`;
    //console.log("formData", formData);
    
    axios.post(url, formData, {
      headers: {
        'authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        //'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }      
    })
      .then(res => {
        if (res.data.success){
          alert("상품 수정 성공: " + res.data.message);
          window.location.reload(false);
        } else {
          //console.log(res.data.errors);
          //console.log("error message display");
          alert("상품 수정 실패: " + res.data.message);
        }        
      })
  }

  function loadGoodsInfo() {
    console.log('loadGoodsInfo');
    const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
    const currentRoute = window.location.pathname;
    var objId = currentRoute.replace("/UpdGoods/", "");  // remove "/viewgoods/"
    let url = `${API_URL}/products/${objId}`;

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
        if (data.success === true){
          let result = data.data;
          //console.log(result);
          setTitle(result.title);
          setCategory(result.category);
          setPrice(result.price);
          setDescription(result.description);
          setPrevImageFiles(result.images);
        } else {
          alert("load GoodsInfo fail");
        }
      });
  }

  const onFileChange = (event) => {
    //console.log("onFileChange");
    setImageFiles(event.target.files);
  }

  const onFileInit = () => {
    //console.log("onFileInit");
    const previewContainer = document.getElementById("preview-container");
    if (previewContainer !== null) {
      previewContainer.remove();
    }
  }

  const renderPreview = () => {
    onFileInit();
    //console.log("renderPreview");
    const initContainer = document.getElementById("preview-container-init");
    const initview = document.createElement("div");
    initview.id = "preview-container";
    initContainer.appendChild(initview);

    const previewContainer = document.getElementById("preview-container");
    for (let i = 0; i < imageFiles.length; i++) {
      const preview = document.createElement("img");
      preview.id = `preview_${i}`;
      preview.className = 'imgClass';
      preview.style = 'border: 1px solid #ddd; border-radius: 4px; padding: 5px; width: 130px;';
      previewContainer.appendChild(preview);
      const reader = new FileReader();
      reader.onload = function (evt) {
        preview.src = reader.result;
      };
      reader.readAsDataURL(imageFiles[i]);
    }
  }

  useEffect(() => {
    //console.log("Similar to componentDidMount and componentDidUpdate");
    renderPreview();
  });

  useEffect(() => {
    loadCategoryList();
    loadGoodsInfo();
  }, []);

  const handleDelete = (event) => {
    console.log("handleDelete");
    event.preventDefault();
    
    let response = window.confirm("이미지를 삭제하시겠습니까?");
    if (response === false) {
      return;
    }
    
    let deleteFile = event.target.alt;
    const itemToFind = prevImageFiles.find(function(item) {
      return item === deleteFile
    }) 
    const idx = prevImageFiles.indexOf(itemToFind) 
    if (idx > -1) {
      prevImageFiles.splice(idx, 1)
    }
    //console.log(prevImageFiles);
    
    //let vid = event.target.id;
    // let previewContainer = document.getElementById(vid);
    // console.log(previewContainer);
    // previewContainer.remove();

    // button hidden
    let alt = event.target.alt;
    let hiddenContainer = document.getElementById(alt);
    hiddenContainer.setAttribute("style", "display:none");

    setPrevImageFiles(prevImageFiles); 
  }

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
              <div>
                {prevImageFiles.map((img, index) => (
                  <Button  size="small" color="primary"
                  key = {index}
                  onClick={handleDelete}
                  id = {prevImageFiles[index]}
                    >             
                    <img 
                      src={API_URL + '/imageFiles/' + prevImageFiles[index] }
                      className={classes.img}
                      alt={prevImageFiles[index]}
                      id = {`image`+index}
                    />
                  </Button>
                ))}
              </div>
            </Grid>

            <Grid item xs={12}>
              <div id="preview-container-init" />
            </Grid>

            <Grid item xs={12}>
              <input 
                name="imgFile" 
                type="file"
                multiple
                onChange={onFileChange}
                //onChange={(event) => setImageFile(event.target.files[0])}
                accept="image/*" 
                className={classes.input} 
                id="icon-button-file" />
              <label htmlFor="icon-button-file">
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