import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
//import Home from './pages/Home';
import About from './pages/About';
import RegisterGoods from './pages/RegisterGoods';
import ListGoods from './pages/ListGoods';
import ViewGoods from './pages/ViewGoods';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <AppBar position="relative">
          <Toolbar>            
            <Typography variant="h6" color="inherit" noWrap>
            <Link style={{ textDecoration: 'none' }} to='/'>
              OE & FA Market
            </Link>
            </Typography>            
            <Link style={{ textDecoration: 'none' }} to='/registergoods'>
              <Button variant="outlined" color="primary">상품 등록</Button>
            </Link>
          </Toolbar>
        </AppBar>
        
        <Route exact path='/' component={ListGoods} />
        <Route path='/about' component={About} />
        <Route path='/listgoods' component={ListGoods} />
        <Route path='/registergoods' component={RegisterGoods} />        
        <Route path='/viewgoods' component={ViewGoods} />        
      </BrowserRouter>
    );
  }
}

export default App;
