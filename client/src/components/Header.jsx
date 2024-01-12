import React from 'react';
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const Header = () => {
  const {currentUser} = useSelector((state)=>state.user);
  return (
    <header className='bg-slate-200 shadow-md'>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
        <h1 className='font-bold text-sm sm:text-xl flex-wrap'  >
            <span className='text-slate-500'>Ayush</span>
            <span className='text-slate-800'>Estate</span>
        </h1>
        </Link>
        <form className='bg-slate-100 p-2 rounded-lg flex items-center'>
            <input type="text" 
            placeholder='Search....'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            />
            <FaSearch />
        </form>
        <ul className='flex gap-4'>
        <Link to="/home">
            <li className='hidden sm:inline hover:underline'>
                Home
            </li>
        </Link>
        <Link to="/about">
            <li className='hidden sm:inline hover:underline'>
                About
            </li>
        </Link>
        <Link to="/profile">
            {
                currentUser?(
                  <img className='rounded-full w-7 h-7 object-cover' src={currentUser.avatar}/>
                ):
                (
                <li className=' hover:underline'>
                    Sign in
                </li>
                )
            }
        </Link>
        </ul>
    </div>
    </header>
  )
}

export default Header