import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import About from './pages/About';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import AutoLogout from './components/AutoLogout'; // Import AutoLogout component
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { SignOutUserFailure, SignOutUserStart, SignOutUserSuccess, deleteUserFailure } from './redux/user/userSlice';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(true);
  const {currentUser} = useSelector((state)=>state.user)
  const dispatch = useDispatch();

  const handleLogout = async () => {
    
    try {
      dispatch(SignOutUserStart());
      const res = await axios.get('/api/auth/signout');
      console.log(res);
      dispatch(SignOutUserSuccess(res.data));

    } catch (error) {
      dispatch(SignOutUserFailure(error.response.data.message))
    }
  };

  return (
    <BrowserRouter>
    <AutoLogout onLogout={handleLogout}>
      <Header />
      <Routes>
         <Route path="/" element={<Home/>} />
         <Route path="/sign-in" element={<SignIn/>} />
         <Route path="/sign-up" element={<SignUp/>} />
         <Route element={<PrivateRoute/>}>
         <Route path="/profile" element={<Profile/>} />
         <Route path="/create-listing" element={<CreateListing/>} />
         </Route>
         <Route path="/about" element={<About/>} />
      </Routes>
    </AutoLogout>
  </BrowserRouter>
  );
};

export default App;
