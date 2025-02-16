import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Footer2 from '../components/Footer2'

const page = () => {
  return (
    <div>
      <Navbar/>
      <h1 className='text-[#513126] justify-center align-middle flex p-5' style={{fontFamily:'math',fontSize:'55px'}}>Login</h1>
      <div className='flex flex-col'>
      <form action="" method="post" className='flex flex-col justify-center align-middle text-center' style={{justifyContent: 'center', alignItems:'center', gap:'15px'}}>
        <input type="text" placeholder='Email' className='w-[375px] border border-black p-2 rounded justify-center align-middle' />
        <input type="text" placeholder='Password' className='w-[375px] border border-black p-2 rounded justify-center' />
         <p className='text-[#513126] underline hover:font-bold cursor-pointer'>Forgot your password ?  </p>
         <button className='text-white bg-[#513126] p-3 w-[175px] hover:font-bold cursor-pointer transition-opacity duration-500 group-hover:opacity-80'>Sign In</button>
      </form>
      <div className='flex justify-center'>
         <a href="" className='underline text-[#513126] p-3 hover:font-bold cursor-pointer' style={{fontSize:'14px'}}>Create Account ?</a>
         </div>
      </div>
     <Footer/>
     <Footer2/>
    </div>
  )
}

export default page
