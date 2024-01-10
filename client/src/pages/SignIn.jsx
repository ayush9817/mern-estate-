import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';


const SignIn = () => {
  const [formData,setformData] = useState({});
  const {loading ,errors} = useSelector((state)=>state.user);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e)=>{
  setformData(
    {
      ...formData,
      [e.target.id]:e.target.value
    }
   )
}
const handleSubmit = async (e)=>{
   // setLoading(true);
    dispatch(signInStart());
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/signin",formData);
      console.log(res)
      const data = res.data;
      dispatch(signInSuccess(res.data));
      setformData({});
      navigate('/');
    } catch (error) {
      console.log(error.message);
      const data = error.response.data;
      console.log(data);
      if(data.success === false){
        console.log(data.message);
       // setError(data.message);
        dispatch(signInFailure(data.message));
        console.log("errors",errors);
      //  setLoading(false);
        return;
       }
    }

}

return (
<div className='p-3 max-w-lg mx-auto'>
  <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
  <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
    <input type='email' className='border rounded-lg p-3' id='email' placeholder='Email'onChange={handleChange}/>
    <input type='password' className='border rounded-lg p-3' id='password' placeholder='Password'onChange={handleChange}/>
    <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading?'Loading...':'Sign In'}
    </button>
  </form>
  <div className='flex gap-2 mt-5'>
    <p>Dont Have an account?</p>
    <Link to="/sign-up">
      <span className='text-blue-700'>  
      Sign up
      </span>
    </Link>
  </div>
  {errors && <p className='text-red-500 mt-5'>{errors}</p>}
</div>
)
}

export default SignIn