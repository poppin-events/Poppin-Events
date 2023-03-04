import '../stylesheets/App.css';
import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [data, setData] = useState();
  const urlWithProxy = '/api/v1';

  function getDataFromServer() {
    console.log('getting data from the server');
    axios
      .get(urlWithProxy)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="App">
      <button onClick={getDataFromServer}>Access server using proxy</button>
      <p>data is : {data}</p>
    </div>
  );
}

export default App;
