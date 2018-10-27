import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
//import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui/dist/semantic.min.css';
import  { BrowserRouter, Route } from 'react-router-dom';
import NavHdrFtr from './Components/NavHdrFtr';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import MapPage from './Pages/MapPage';
import CalculatorsPage from './Pages/CalculatorsPage';
import './index.css'; // include this *after* semantic.min.css!

const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
  <BrowserRouter forceRefresh={!supportsHistory}>
    <NavHdrFtr path="/">
      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/calc" component={CalculatorsPage} />
      <Route path="/map" component={MapPage} />
    </NavHdrFtr>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
