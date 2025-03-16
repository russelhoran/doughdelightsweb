'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Footer2 from '../components/Footer2';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';


const Page = () => {
  const [search, setSearch] = useState(null);
  const [formData,setFormData] = useState({
  username: "",
  password: "",
});
const[submit ,setSubmit] =useState(false);
  const [accessToken,setAccessToken] =useState(null);
  const [cerror, setCommonErr] = useState(null);
  const [error,setError] =useState({
  username:"",
  password:"",
});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setSearch(searchParams.get('register')); // Set the search parameter after component mounts
  }, []);


   useEffect(()=>{
        const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
        const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
        const username = 'russel';
        const password = 'russel@123'
      
      
          const token = async () => {
            try {
              const popularData = await axios.post(
                "http://localhost:8000/api/token/", 
                new URLSearchParams({
                  grant_type: "password",
                  username,   
                  password,    
                }),
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
                  },
                }
              );
            
              console.log(popularData.data.access,'exit');
              
               setAccessToken(popularData.data.access)
            } catch (err) {
              console.error("Error fetching token:", err);
            }
           
          }
          token();
      },[])
    


 const registerUser = () => {
   if(formData.username!='' && formData.password!=''){
     const postRegisteration = async () => {
       setError((prev) => ({
            ...prev,
           username: '',
           password: '',
           }))
      if (accessToken !== '') {
        try {
          const registerData = await axios.post(
            'http://localhost:8000/users/', 
            formData, 
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          //console.log('Registration Successful:', registerData);
          }

    catch (err) {
          console.error('Error during registration:', err); 
          //console.log('yesyysysys');
            setCommonErr(err.response.data.username || err.response.data.password  ||'Unknown error occurred');

        }
      }
    };
  postRegisteration();
}

else{
 setError((prev) => ({
            ...prev,
           username: 'Please Enter a username',
           password: 'Please Enter a password',
           }))} 
}

  return (
    <div>
      <Navbar />
      <h1 className='text-[#513126] justify-center align-middle flex p-5' style={{ fontFamily: 'math', fontSize: '55px' }}>
        {search ? 'Register' : 'Login'}
      </h1>

      <div className='flex flex-col'>
        <form
          className='flex flex-col justify-center align-middle text-center'
          style={{ justifyContent: 'center', alignItems: 'center', gap: '15px' }}
        >
          <input
            type="text"
            name="username"
            placeholder='username'
            className='w-[375px] border border-black p-2 rounded justify-center align-middle'
            onChange={(e) => {
            setFormData((prev) => ({
            ...prev,
           username: e.target.value,
           }));
            }}/>
          {error && <div className="text-red-500 font-bold"> {error.username} </div>}    
<input
            type="password"
            name="password"
            placeholder='Password'
            className='w-[375px] border border-black p-2 rounded justify-center'
            onChange={(e) => {
            setFormData((prev) => ({
            ...prev,
           password: e.target.value,
           }));
            }} />
          {error && <span className="text-red-500 font-bold">{error.password}</span>}
          {cerror && <span className="text-red-600 font-bold">{cerror} </span>}
          <p className='text-[#513126] underline hover:font-bold cursor-pointer'>Forgot your password?</p>
          {search ? (
            <button
              className='text-white bg-[#513126] p-3 w-[175px] hover:font-bold cursor-pointer transition-opacity duration-500 group-hover:opacity-80'
              type='button'
              onClick={()=>registerUser()}
            >
              Register
            </button>
          ) : (
            <button
              className='text-white bg-[#513126] p-3 w-[175px] hover:font-bold cursor-pointer transition-opacity duration-500 group-hover:opacity-80'
              type='submit'
            >
              Sign in
            </button>
          )}
        </form>

        <div className='flex justify-center'>
          <a href="/login?register=true" className='underline text-[#513126] p-3 hover:font-bold cursor-pointer' style={{ fontSize: '14px' }}>
            Create Account?
          </a>
        </div>
      </div>

      <Footer />
      <Footer2 />
    </div>
  );
}

export default Page;

