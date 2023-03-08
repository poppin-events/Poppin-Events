/* eslint-disable react/function-component-definition */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import env from 'react-dotenv';
import { UserContext } from './UserContext';
import axios from 'axios';

const Login = (props) => {
  const navigate = useNavigate();

  const responseGoogle = async (response) => {
    // the google oauth (identity services) api responds with a JWT with all user info
    const userObject = jwt_decode(response.credential);
    // destructure that info for our purposes
    const { name, email, picture } = userObject;
    try {
      const res = await axios.post('/api/users', {
        name,
        email,
        picture,
      });
      // reroute to map
      if (res.status === 200) {
        props.setUser({ name, email, picture, id: res.data });
        navigate('/map');
      }
    } catch (e) {
      console.log('error in post: ', e.message);
    }
  };

  return (
    <div className="login-container">
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OATH_CLIENT_ID}
      >
        <GoogleLogin
          render={(renderProps) => (
            <button
              type="button"
              className="login-button"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <FcGoogle className="" /> Sign in with google
            </button>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy="single_host_origin"
          size="medium"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
