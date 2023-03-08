//  stylings
import '../stylesheets/App.css';
//  fetch requester
import axios from 'axios';
import React, { useState, useEffect } from 'react';
//  import routes and usenavigate
import { Routes, Route, useNavigate } from 'react-router-dom';
import Map from './Map';
// import jwt_decode from 'jwt-decode';
import Login from './Login';
import { UserContext } from './UserContext';


function App(props) {
  const navigate = useNavigate();
  // initialize null user to state
  const [user, setUser] = useState(null);
  console.log('in APP, user is: ', user);

  useEffect(() => {
    // on change, if user === null, check session
    console.log('in useEffect, and user is: ', user);
    const checkSession = async () => {
      try {
        // attempt to grab user info
        const userInfo = await axios.get('/api/sessions');
        console.log('user info is: ', userInfo);
        // if they are loggedIn, update state with user info and redirect to map
        if (userInfo.data.loggedIn === true) {
          setUser({
            name: userInfo.data.name,
            email: userInfo.data.email,
            picture: userInfo.data.picture,
            // for later: refactor to be userID instead of id
            id: userInfo.data.id,
          });
          navigate('/map');
        }
        // else go back to log in
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
      // if user is not null go to map
      console.log('user is not null');
      navigate('/map');
    }
  }, [user]);

  const logout = async () => {
    // make server request to logout / destroy session + cookie
    try {
      // delete session
      const response = await axios.delete('/api/sessions');
      console.log('successful logout');
      // reset user
      setUser(null);
    } catch (e) {
      console.log('error logging out: ', e.message);
    }
  }


  return (
    <>
      <nav className="navbar">
        <span className="brand-container">
          <h1 className="brand-heading">Poppin</h1>
          <img className="brand-logo" src="https://i.pinimg.com/originals/2f/c1/b8/2fc1b8f82e14172e3bcae39ca8c8ab33.gif"></img>
        </span>
        {user &&
          <ul className="nav-list">
            <li> <a onClick={logout}> Logout </a></li>
            <li>{user.name}</li>
          </ul>
        }
      </nav>
      
      {/* look into usercontext provider */}
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
