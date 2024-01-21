import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { SignOutUserFailure, SignOutUserStart, SignOutUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure,updateUserStart,updateUserSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom'
import axios from 'axios';



const Profile = () => {
  const {currentUser,loading ,errors} = useSelector((state)=>state.user)
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc,setfilePerc] = useState(0);
  const [FormData,setFormData] = useState({});
  const [fileError,setFileError] = useState(false);
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [showListingError,setShowListingError] = useState(false);
  const [userListings,setUserListings] = useState([]);

  const handleChange = (e)=>{
         setFormData({...FormData,[e.target.id]:e.target.value})
  }

  const handleSignOut = async (e)=>{
      try {
        dispatch(SignOutUserStart());
        const res = await axios.get('/api/auth/signout');
        console.log(res);
        dispatch(SignOutUserSuccess(res.data));

      } catch (error) {
        dispatch(SignOutUserFailure(error.response.data.message))
      }
  }

  const handleDeleteUser = async ()=>{
     try {
       dispatch(deleteUserStart());
       const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
       dispatch(deleteUserSuccess(res.data))
       console.log(res);
     } catch (error) {
       dispatch(deleteUserFailure(error.response.data.message))
       console.log(error);
     }
  }

  useEffect(()=>{
    if(file){
        handlefileUpload(file)
    }
  },[file])

  const handlefileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        setfilePerc(Math.round(progress));
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Error during upload:', error);
        setFileError(true);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(storageRef);
          console.log('File available at', downloadURL);
          setFormData({...FormData,avatar : downloadURL});
         
        } catch (error) {
          console.error('Error getting download URL:', error);
        }
        console.log('Upload complete');
      }
    );

  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(`/api/user/update/${currentUser._id}`,FormData);
      console.log(res);
      dispatch(updateUserSuccess(res.data));
      setUpdateSuccess(true);
      
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error.response.data.message));
    }

  }
  const handleShowListings = async () =>{
    try{
        setShowListingError(false);
        const res = await axios.get(`/api/user/listings/${currentUser._id}`);
        console.log(res.data);
        setUserListings(res.data);
    }catch(error){
        console.log(error);
        setShowListingError(true);   
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>{setFile(e.target.files[0])}} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=>{fileRef.current.click()}} className='rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center' src={FormData.avatar || currentUser.avatar}/>
        <p className='text-sm self-center'>
        {console.log("p",filePerc)}
        {fileError ? ( <span className='text-red-700'>Error uploading Image</span>
      ) : filePerc > 0 && filePerc < 100 ? ( <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
      ) : filePerc === 100 ? ( <span className='text-green-700'>Image Uploaded Successfully</span>
      ) : ( ''
      )}
        </p>
        <input type='text' defaultValue={currentUser.username} id='username' placeholder='Username' className='border p-3 rounded-lg' onChange={handleChange} />
        <input type='email' defaultValue={currentUser.email} id='email' placeholder='Email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type='password' id='password' placeholder='Password' className='border p-3 rounded-lg'/>
        <button className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80'>
          {loading?'Loading...':'Update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to='/create-listing'>
         Create Listing
        </Link>

      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-500 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-500 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{errors? errors : "" }</p>
      <p className='text-green-700 mt-5'>{updateSuccess?"User Updated Successfully":""}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingError?'Error showing listings':''}</p>
      {userListings && userListings.length > 0 &&
        
        <div className='flex flex-col gap-4'>
         <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        {userListings.map((listing)=>{
          return <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt='listing image' className='h-16 w-16 object-contain rounded-lg'/>
              </Link>
              <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
              <p >{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button className='text-red-700 uppercase'>Delete</button>
                <button className='text-green-700 uppercase'>Edit</button>
              </div>      
            </div>
        })}
        </div>

      }
    </div>
  )
}

export default Profile