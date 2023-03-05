import '../stylesheets/App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import Login from './Login';
import { UserContext } from './UserContext';


function App() {
  const [user, setUser] = useState(null);
  const [userJWT, setUserJWT] = useState(null);
  console.log('in APP, user is: ', user);
  console.log('in APP, userJWT is: ', userJWT);
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


  return (
    <>
      <UserContext.Provider value={{user, userJWT}}>
        <Login setUser={(u) => setUser(u)} setUserJWT={(jwt) => setUserJWT(jwt)}></Login>

      </UserContext.Provider>
    </>
  );
}

export default App;
