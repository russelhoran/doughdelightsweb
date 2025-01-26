import React from 'react'
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';

const Footer2 = () => {
  return (
    <div className='bg-[#513126] h-[350px] grid grid-cols-4 gap-4 p-[34px]'>
      <div className='w-full flex flex-col gap-2 text-white' style={{fontFamily:'math'}}>
        <h1 className='font-bold mb-2'>Contact Details</h1>
       <p>About us</p>
       <p>Contact us</p>
        <p>For Sales Enquiries:</p>
        <p><PhoneIcon/>9999999999</p>
        <p><MailIcon/>test@gmail.com</p>

        <p>  Working hours: 10:30 am to 5:30 pm</p>
        <p>Closed on Sundays and Public Holidays</p>
      </div>

      <div className='flex flex-col text-white gap-1' style={{fontFamily:'Math'}}>
        <h1 className='font-bold'>Support</h1>
        <p>Terms & Conditions</p>
        <p>FAQs</p>
        <p>Terms & Conditions</p>
      </div>
      <div className='flex flex-col text-white gap-1' style={{fontFamily:'Math'}}>
        <h1 className='font-bold'>Login</h1>
        <p>My Orders</p>
        <p>Wish List</p>
        <p>Shopping Cart</p>
      </div>
      <div className='flex flex-col text-white gap-1' style={{fontFamily:'Math'}}>
        <h1 className='font-bold'>Registered Address</h1>
       <p className='font-bold'>Jai Bhavani Mata Rd, Amboli, Jogeshwari West, Mumbai, Maharashtra 400058</p>
      </div>
    </div>
  )
}

export default Footer2
