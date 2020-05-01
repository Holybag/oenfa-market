import React from 'react';
// import { useState ,useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000';


export default function Logout(props) {

  console.log("Logout");

    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    let history = useHistory();

    // const handleSummit = () => {
    // console.log("handleSummit");
      
      const url = `${API_URL}/login`;
      const token = localStorage.getItem('userInfo') ? 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token : null;
    // console.log('token from localstorage:', token);

      axios({
        method: 'delete',
        url: url,
        headers: {
          'authorization': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
  
        .then(res => {
          //console.log(JSON.stringify(res));
          localStorage.setItem('userInfo', JSON.stringify({
            token: ' '
          }))
          /* parent reload */
          props.data();
          history.push('/');
        })
    // }
    
    // useEffect(() => {
    //   console.log("useEffect did Logout");
    //   this.handleSummit();
    // }, []);
  

    return (
      <React.Fragment>
        Log out !!!
      </React.Fragment>
    );
}


