import React from 'react';
import ReactDOM from 'react-dom';
import Router from './routes';
import { Provider } from 'react-redux';
import { store } from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/App.scss';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root')
);

