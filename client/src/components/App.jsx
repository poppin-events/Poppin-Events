import '../stylesheets/App.css';
import axios from 'axios';
import React, { useState } from 'react';

console.log('derrick');

function App() {
  const [data, setData] = useState();
  console.log('Jon was here'); // test2
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
      <button onClick={getDataFromServer}>Access server using proxy TEST1Test3</button>
      <p></p>
      <p>data is : {data}</p>
      <p>Clark, Derrick, and Jonathan are pretty cool</p>
    </div>
  );
}

export default App;
