'use client'
import React, { useState,useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styles from '../css/styles.module.css'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { redirect } from 'next/navigation'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [mobNav,setMobNav]=useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const openMobileNav = () =>{
    setMobNav(!mobNav);
  }

  const logout = () =>{
    Cookies.remove('user')
    Cookies.remove('userid')
    redirect('/login')
  }

  useEffect(() => {
    const user:any = Cookies.get('user');
    if(user == "loggedin"){
    setIsLoggedIn(user);
    }
  }, []);

  return (
	<div className={`h-[86px] border bg-[#FFF4E3] sticky align-middle justify-center ${styles.navmobile}`} style={{   position: "sticky",
      top: 0,
      zIndex: "50"}}>
  <div className={`h-[86px] lg:hidden md:hidden border bg-[#FFF4E3] sticky top-0 z-50 ${styles.navmobile}`}>
  <div className='flex justify-between items-center px-4 h-full'>
    <button className='block lg:hidden' onClick={handleOpen}>
      <DensitySmallIcon />
    </button>

    <img
      src="https://bomboloniboss.com/cdn/shop/files/bomboloni-wordmark-2024.png?v=1732044254&width=600"
      alt="Logo"
      height={115}
      width={115}
      className='block lg:hidden mx-auto'
    />
  </div>

  {/* Overlay and Slide-in Menu */}
  {open && (
    <>
      {/* Dim Background */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      ></div>
      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 left-0 w-[70%] h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <button onClick={handleClose} className="mb-4 text-right w-full">
            ❌
          </button>
          <ul className="space-y-6 text-black text-lg font-semibold">
            <Link href={'/'}><li className='hover:underline cursor-pointer'>Home</li></Link>
            <Link href={'/shop'}><li className='hover:underline cursor-pointer'>Shop</li></Link>
            <Link href={'/contact'}><li className='hover:underline cursor-pointer'>Contact</li></Link>
             {isLoggedIn && (  
            <Link href={'/cart'}><li className='hover:underline cursor-pointer'>Your Cart</li></Link>
                )}
            {!isLoggedIn ? (
                  <Link href={'/login'}>
          Login
              </Link>
        ) : (
       <button className="text-white bg-black font-bold border border-black h-fit w-[65px]" onClick={logout} type='button'>Logout</button>
      )}
            {/* <Link href={''}><li className='hover:underline cursor-pointer'>EN/FR</li></Link> */}
          </ul>
        </div>
      </div>
    </>
  )}
</div>

      <nav className='hidden lg:block md:block sm:hidden' style={{
        position: "sticky",
        top: 0,
        zIndex: "5000000"
      }}>
        <ul className='flex gap-4 h-10 justify-center'>
          <div className='pl-[15px] mt-8 flex gap-5 text-black font-bold' style={{fontSize:"15px", fontFamily:"Math"}}>
            <li className='cursor-pointer hover:underline'><Link href="/">Home</Link></li>
            <li className='cursor-pointer hover:underline'>
            <Link href="/shop">Shop</Link>
            </li>
            <li className='cursor-pointer hover:underline'>Contact</li>
            </div>
            {/* <img src="https://bomboloniboss.com/cdn/shop/files/bomboloni-wordmark-2024.png?v=1732044254&width=600" alt="" height={115} width={180} className='justify-center flex m-auto mt-[30px]'/> */}
            <div className='justify-center flex m-auto mt-[30px] cursor-pointer' onClick={(()=>redirect("/"))}>
            <div className={styles.the}>The</div>
        <div className={styles.doughdelights}>Dough Delights</div>
        <div className={styles.flourish}>Crafted with love</div>
        </div>
             <div className="flex gap-3">
              <div className='flex mt-8 gap-3 pr-4'>
            <SearchIcon/>
      {!isLoggedIn ? (
                  <Link href={'/login'}>
          <PersonIcon />
              </Link>
        ) : (
       <button className="text-white bg-black font-bold border border-black h-fit w-[65px]" onClick={logout} type='button'>Logout</button>
      )}
            <Link href="/cart">
            <ShoppingCartIcon/>
            </Link>
            </div>
            </div>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
