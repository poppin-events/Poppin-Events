import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import env from 'react-dotenv';
import { UserContext } from './UserContext';
import axios from 'axios';

const Login = (props) => {
  // const navigate = useNavigate();
  const contextUser = useContext(UserContext).user;
  const contextJWT = useContext(UserContext).userJWT;
  console.log('CONTEXT VALUES ARE, user: ', contextUser);
  console.log('CONTEXT VALUES ARE, jwt: ', contextJWT);
  const [user, setUser] = useState(null);

  const responseGoogle = (response) => {
    console.log('response is: ', response);
    props.setUserJWT(response.credential);
    const userObject = jwt_decode(response.credential);
    console.log('user: ', userObject);
    const { name, email, picture } = userObject;
    props.setUser({name, email, picture});
    axios.post('/api/users', {
      name, email
    });
  }

  return (
    <div className="">
      <div className="">
        <GoogleOAuthProvider
          clientId='795315060039-si05m90ads2mnsac9pfkj1t1krltss6k.apps.googleusercontent.com'
        >
          <GoogleLogin
            render={(renderProps) => (
              <button
                type="button"
                className=""
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <FcGoogle className="" /> Sign in with google
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  )
}

export default Login