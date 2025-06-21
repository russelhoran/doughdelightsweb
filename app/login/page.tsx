'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Footer2 from '../components/Footer2';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [search, setSearch] = useState(null);
  const [formData,setFormData] = useState({
  username: "",
  password: "",
  email: "",
  is_staff: false,
  is_active: true,
  groups: [],
});
const[submit ,setSubmit] =useState(false);
  const [accessToken,setAccessToken] =useState(null);
  const [cerror, setCommonErr] = useState(null);
  const [error,setError] =useState({
  username:"",
  password:"",
});

  const router = useRouter()


  useEffect(() => {
    const searchParams:any = new URLSearchParams(window.location.search);
    setSearch(searchParams.get('register')); // Set the search parameter after component mounts
  }, []);

    function resetData (){
    setFormData({
      username: "",
  password: "",
  email: "",
  is_staff: false,
  is_active: true,
  groups: [],    
  })}


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
    
const loginUser = () => {
  if(formData.username!='' && formData.password!=''){

  const getUser = async () => {
    setError((prev) => ({
            ...prev,
           username: '',
           password: '',
           }))

if (accessToken !== '') {
  try {
          const userData =  await axios.post(
            'http://localhost:8000/api/token/', 
            formData, 
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if(userData.data){

            const data = await axios.get(`http://localhost:8000/users/?username=${formData.username}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            console.log(data)
            Cookies.set('user', 'loggedin', { expires: 1 })
            Cookies.set('userid', data.data.results[0].user__id , { expires: 1 })
            resetData();
            toast("User Logged in Successfully");
            setCommonErr(null)
            router.push('/')
        }

          console.log('Login Successful:', userData);

  
          }

    catch (err:any) {
          console.error('Error during registration:', err); 
          //console.log('yesyysysys');
            setCommonErr(err.response.data.username || err.response.data.password  ||'Either your Username or Password is wrong');

        }
}
}
  getUser();
}}

 const registerUser = () => {
   if(formData.username!='' && formData.password!=''){
    setFormData((prev)=>({
  ...prev,
   email: `${formData.username}@dough.com`
  }))
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

          if(registerData.data){
            resetData();
            toast("User Registered Successfully");
            setCommonErr(null)
        }

          console.log('Registration Successful:', registerData);
          }

    catch (err:any) {
          console.error('Error during registration:', err); 
          //console.log('yesyysysys');
            setCommonErr(err.response.data.username || err.response.data.password  ||'Either your Username or Password is wrong');

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
           {/* <ToastContainer 
            position="bottom-right"
            theme="dark"
            draggable 
            pauseOnHover
            autoClose={5000}
/> */}
      <div className='flex flex-col'>
        <form
          className='flex flex-col justify-center align-middle text-center'
          style={{ justifyContent: 'center', alignItems: 'center', gap: '15px' }}
        >
          <input
            type="text"
            name="username"
            placeholder='username'
            value={formData.username}
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
            value={formData.password}
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
              type='button'
              onClick={()=>loginUser()}
            >
              Sign in
            </button>
          )}
        </form>

        <div className='flex justify-center'>
          {!search ? (
          <a href="/login?register=true" className='underline text-[#513126] p-3 hover:font-bold cursor-pointer' style={{ fontSize: '14px' }}>
            Create Account?
     </a>) 
    :  
      (<a href="/login" className='underline text-[#513126] p-3 hover:font-bold cursor-pointer' style={{fontSize: '14px'}}> Login Now</a>)}
        </div>
      </div>
      <Footer />
      <Footer2 />
    </div>
  );
}

export default Page;

