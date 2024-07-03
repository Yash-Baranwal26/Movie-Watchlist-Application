import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddMovie from './AddMovie';
import MovieDetail from './MovieDetail';
import UpdateMovieDetail from './UpdateMovieDetail';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<App/>}/>
    <Route path='/addMovie' element={<AddMovie/>}/>
    <Route path='/movieDetail/:id' element={<MovieDetail/>}/>
    <Route path='/updateMovieDetail/:id' element={<UpdateMovieDetail/>}/>
  </Routes>
  </BrowserRouter>
);

