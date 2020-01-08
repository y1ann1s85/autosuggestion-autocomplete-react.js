import React, { Component } from 'react';
import Autocomplete from './components/autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

class App extends Component {
  render() {
    return (
      <div>
        <Autocomplete />
      </div>
    );
  }
}

export default App;
