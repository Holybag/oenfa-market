import React from 'react';
import { useHistory } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function LoginGoogle(props) {
    let history = useHistory();
    // for google login
    const responseGoogle = (response) => {
        console.log(response);
        console.log("accessToken:", response.accessToken);
        //console.log(response.Da);
        //console.log(response.wc);
        //console.log(response.Pt);
        console.log("googleId:", response.googleId);
        console.log("email", response.profileObj.email);
        console.log("familyName", response.profileObj.familyName);
        console.log("givenName", response.profileObj.givenName);
        console.log("name", response.profileObj.name);
        console.log("imageUrl", response.profileObj.imageUrl);
        let email = response.profileObj.email;
        let googleId = response.profileObj.googleId;
        let name = response.profileObj.name;
        let imageUrl = response.profileObj.imageUrl;


        const url = `${API_URL}/login/google/`;
        axios.post(url, {
            'email': email,
            'googleId': googleId,
            'name': name,
            'imageUrl': imageUrl,
        }).then(res => {
            console.log(JSON.stringify(res));
            let response = res.data;
            if (response.success === true) {
                localStorage.setItem('userInfo', JSON.stringify({
                    email: response.data.email,
                    token: response.data.token
                }))
                /* parent reload */
                props.data();
                history.push('/');
            } else {
                alert("login fail");
            }
        })
    }



    const logout = (response) => {
        console.log(response);
    }

    return (
        <React.Fragment>
            <div>
                <GoogleLogin
                    clientId=""
                    buttonText="LOGIN WITH GOOGLE"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    
                />
            </div>
                <div><p></p></div>
            
        </React.Fragment>
    );
}