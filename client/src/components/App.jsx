import '../stylesheets/App.css';
import axios from 'axios';
import Map from './Map';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import Login from './Login';
import { UserContext } from './UserContext';
import {Routes, Route, useNavigate} from 'react-router-dom';


function App(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // const [userJWT, setUserJWT] = useState(null);
  console.log('in APP, user is: ', user);
  // console.log('in APP, userJWT is: ', userJWT);

  // const urlWithProxy = '/api/v1';
  // function handleCallbackResponse(response) {
  //   console.log('response: ', response);
  //   console.log('credential ', response.credential);
  //   const userObject = jwt_decode(response.credential);
  //   console.log('user is: ', userObject);
  // }

  // useEffect(() => {
  //   /* global google */
  //   google.accounts.id.initialize({
  //     client_id: '795315060039-si05m90ads2mnsac9pfkj1t1krltss6k.apps.googleusercontent.com',
  //     callback: handleCallbackResponse,
  //   });
  //   google.accounts.id.renderButton(
  //     document.querySelector('.login-div'),
  //     { theme: 'outline', size: 'large' }
  //   );
  // }, []);

  useEffect(() => {
    console.log('in useEffect, and user is: ', user);
    const checkSession = async () => {
      try {
        const userInfo = await axios.get('/api/sessions');
        console.log('user info is: ', userInfo);
        if (userInfo.data.loggedIn === true) {
          setUser({
            name: userInfo.data.name,
            email: userInfo.data.email,
            picture: userInfo.data.picture,
          });
          navigate('/map');
        }
        else navigate('login');
      } catch (e) {
        console.log('Error in checkSession: ', e.message);
      }
    };
    if (user === null) {
      console.log('user is null');
      checkSession();
    }
    else {
      console.log('user is not null');
      navigate('/map');
    }
  }, [user]);

  const logout = async () => {
    // make server request to logout / destroy session + cookie
    try {
      const response = await axios.delete('/api/sessions');
      console.log('successful logout');
      setUser(null);
    } catch (e) {
      console.log('error logging out: ', e.message);
    }
  }


  return (
    <>
      <h1>Locale Events</h1>
      {user &&
        <>
          <button onClick={logout}> logout </button>
          <h2>{user.name}</h2>
        </>
      }
      <UserContext.Provider value={{user}}>
        <Routes>
          <Route
            path='/login'
            element={<Login setUser={(u) => setUser(u)}
            setUserJWT={(jwt) => setUserJWT(jwt)}></Login>}
          />
          <Route
            path='/'
            element={<p>you are on path= /</p>}
          />
          <Route
            path="/map"
            element={<Map />}
          />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
