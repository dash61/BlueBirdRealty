import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui/dist/semantic.min.css';
import  { BrowserRouter, Route } from 'react-router-dom';
import NavHdrFtr from './Components/NavHdrFtr';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import MapPage from './Pages/MapPage';
import SellPage from './Pages/SellPage';
import './index.css'; // include this *after* semantic.min.css!

const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
  <BrowserRouter forceRefresh={!supportsHistory}>
    <NavHdrFtr>
      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/sell" component={SellPage} />
      <Route path="/map1" component={MapPage} />
      <Route path="/map2" component={MapPage} />
    </NavHdrFtr>
  </BrowserRouter>,
  document.getElementById('root')
);
/* NavHdrFtr used to include path="/" */

//tried: <Route path="/sell" render={(routeProps)=><SellPage {...routeProps} something={'foo'}/>}/>
// didn't help NavHdrFtr get data I need.

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
