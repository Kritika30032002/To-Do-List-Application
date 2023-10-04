
import React, { useState, useEffect } from 'react';
import { BrowserRouter ,Routes , Route } from 'react-router-dom';
import Register from  './components/Register';
import Login from './components/Login';
import Quiz from './components/TestPage'
import './App.css';

function App() {
 

  return (
  <>

<BrowserRouter>
<Routes>
  <Route path='/' element={<Register/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path='/quiz' element={<Quiz/>}/>
  
</Routes>
</BrowserRouter>
  </>
  );
}

export default App;
