import React from 'react';
import { useHistory } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
//import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function LoginGoogle(props) {
    let history = useHistory();
    // for Facebook login

    const responseFacebook = (response) => {
        console.log(response);
        console.log("name:", response.name);
        console.log("email:", response.email);
        console.log("id:", response.id);
        console.log("accessToken:", response.accessToken);
        let email = response.email;
        let facebookId = response.id;
        let name = response.name;

        const url = `${API_URL}/login/facebook/`;
        axios.post(url, {
            'email': email,
            'facebookId': facebookId,
            'name': name,
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

    return (
        <React.Fragment>

            <div>
                <FacebookLogin
                    appId=""
                    //autoLoad={true}
                    autoLoad={false}
                    fields="name,email,picture"
                    //onClick={componentClicked}
                    callback={responseFacebook}
                />
                <div><p></p></div>

            </div>
        </React.Fragment>
    );
}