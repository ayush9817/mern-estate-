import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure,updateUserStart,updateUserSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
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


  const handleChange = (e)=>{
         setFormData({...FormData,[e.target.id]:e.target.value})
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

      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-500 cursor-pointer'>Delete account</span>
        <span className='text-red-500 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{errors? errors : "" }</p>
      <p className='text-green-700 mt-5'>{updateSuccess?"User Updated Successfully":""}</p>
    </div>
  )
}

export default Profile