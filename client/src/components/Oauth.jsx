import React from 'react';
import {GoogleAuthProvider , getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import {useDispatch, useSelector} from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Oauth = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const handleGoogleClick = async ()=>{
    try{
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        const res = await signInWithPopup(auth,provider);
        console.log(res);
        const result = await axios.post("/api/auth/google",
        {
           name:res.user.displayName,
           email:res.user.email,
           photo:res.user.photoURL
        }
        )

        console.log("ayush",result);
        dispatch(signInSuccess(result.data))
        navigate('/');


        
    }catch(error){
       console.log(error);
    }
}
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95 '>Continue with google</button>
  )
}

export default Oauth