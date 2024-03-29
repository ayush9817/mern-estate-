import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import { current } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const {currentUser} = useSelector((state)=>state.user)
  const [file,setFile] = useState([]);
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    imageUrls : [],
    name:"",
    description:"",
    address:"",
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:0,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,
  })
  const [errors,setErrors] = useState(false);
  const [loading,setLoading] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [imageUploadError,setImageUploadError] = useState(false);
  console.log(formData);
  const handleSubmiti = (e)=>{
     if(file.length > 0 && file.length<7){
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
        for(let i=0;i<file.length;i++){
            promises.push(storeImage(file[i]))
        }
        Promise.all(promises).then((urls)=>{
            setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)});
            setImageUploadError(false);
            setUploading(false);
        }
        
        ).catch((error)=>{
            setImageUploadError('Image Upload failed (2mb max per image)');
            console.log(error);
        })
     }else{
      setImageUploadError('Uplaod images between 1 to 6 in number')
     }

  };

  const storeImage = async (file) =>{
    return new Promise((resolve,reject)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
             console.log('Upload is ' + progress + '% done');
              
              },
            (error) => {
              // Handle unsuccessful uploads
              console.error('Error during upload:', error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(storageRef);
                console.log('File available at', downloadURL);
                resolve(downloadURL);
                console.log('Upload complete');
              } catch (error) {
                reject(error);
              }
             
            }
          );
    })
  }
  const handleRemoveImage = (index)=>{
    setFormData({
      ...formData,
      imageUrls : formData.imageUrls.filter((url,i)=>{
        return i!==index;
      })
    })
  }

  const handleChange = (e)=>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData(
        {
          ...formData,
          type:e.target.id
        }
      )
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData(
        {
          ...formData,
          [e.target.id]:e.target.checked
        }
      )
    }
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }


  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      if(formData.imageUrls.length < 1) return setErrors('You must upload atleast one image');
      if(+formData.regularPrice < +formData.discountPrice) return setErrors("Discount price must be lower than regular price")
      setLoading(true);
      setErrors(false);
      const res = await axios.post('api/listing/create',{...formData,userRef:currentUser._id});
      console.log(res);
      setLoading(false);
      navigate(`/listing/${res.data._id}`);
    } catch (error) {
      setErrors(error.message);
      setLoading(false);
    }
  }

  console.log(file);
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
           <div className='flex flex-col gap-4 flex-1'>
                <input onChange={handleChange} value={formData.name} type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' required maxLength='62' minLength='10'/>
                <textarea onChange={handleChange} value={formData.description} type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input onChange={handleChange} value={formData.address} type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === "sale"}/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'onChange={handleChange} checked={formData.type === "rent"}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking}/>
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished}/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                       <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} checked={formData.bedrooms}/>
                       <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                       <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} checked={formData.bathrooms}/>
                       <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                       <input type='number' id='regularPrice' min='1' max='100000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} checked={formData.regularPrice}/>
                       <div className='flex flex-col items-center'>
                       <p>Regular price</p>
                       <span>($/month)</span>
                       </div>
                       
                    </div>
                    {formData.offer && 
                    
                    <div className='flex items-center gap-2'>
                       <input type='number' id='discountPrice' min='1' max='10000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} checked={formData.discountPrice}/>
                       <div className='flex flex-col items-center'>
                       <p>Discounted price</p>
                       <span>($/month)</span>
                       </div>
                       
                    </div>
                    
                    }
                    
                </div>
           </div>
           <div className='flex flex-col flex-1 gap-4'>
               <p className='font semi-bold'>Images: 
                     <span className='font-normal text-gray-600 ml-2'> 
                      The first image will bw cover (max 6)
                     </span>
               </p>
               <div className='flex gap-4'>
                   <input onChange={(e)=>{setFile(e.target.files)}} className='p-3 border border-gray-300 rounded w-full ' type='file' id='images' accept='image/*' multiple/>
                   <button type='button' onClick={handleSubmiti} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 '>{uploading?"Uploading..":"Upload"}</button>
               </div>
               <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
               {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>{ return (
                  <div key={url} className='flex justify-between p-3 border items-center'>
                  <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                  <button type='button' onClick={()=>{handleRemoveImage(index)}} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95'>Delete</button>
                  </div>
                )
                })
               }
               <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading?'Creating...':'Create Listing'}
           </button>
           {errors && <p className='text-red-700 text-sm'>{errors}</p>}
           </div>
           
        </form>
    </main>
  )
}

export default CreateListing