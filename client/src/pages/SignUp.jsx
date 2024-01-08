import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData,setformData] = useState({});
  const [errors,setError] = useState(null);
  const [loading,setLoading] = useState(false);
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
        setLoading(true);
        e.preventDefault();
        try {
          const res = await axios.post("/api/auth/signup",formData);
          console.log(res)
          const data = res.data;
          setLoading(false);
          setError(null);
          
          setformData({});
          navigate('/sign-in');
        } catch (error) {
          console.log(error.message);
          const data = error.response.data;
          console.log(data);
          if(data.success === false){
            console.log(data.message);
            setError(data.message);
            console.log("errors",errors);
            setLoading(false);
            return;
           }
        }

  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type='text' className='border rounded-lg p-3' id='username' placeholder='Username'onChange={handleChange}/>
        <input type='email' className='border rounded-lg p-3' id='email' placeholder='Email'onChange={handleChange}/>
        <input type='password' className='border rounded-lg p-3' id='password' placeholder='Password'onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
              {loading?'Loading...':'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-700'>  
          Sign In
          </span>
        </Link>
      </div>
      {errors && <p className='text-red-500 mt-5'>{errors}</p>}
    </div>
  )
}

export default SignUp