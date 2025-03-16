'use client'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styles from '../css/styles.module.css'
import Link from 'next/link'

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

  const openMobileNav = () =>{
    setMobNav(!mobNav);
  }



  return (
	<div className={`h-[86px] border bg-[#FFF4E3] sticky align-middle justify-center ${styles.navmobile}`} style={{   position: "sticky",
      top: 0,
      zIndex: "5000000"}}>
      <div className='flex justify-evenly'>
    <button className='block lg:hidden md:hidden sm:hidden' onClick={handleOpen}>
    <DensitySmallIcon />
    </button> 
    <img src="https://bomboloniboss.com/cdn/shop/files/bomboloni-wordmark-2024.png?v=1732044254&width=600" alt="" height={115} width={115} className='lg:hidden md:hidden sm:hidden justify-center flex m-auto'/>
    {open &&(
         <nav className='block lg:hidden md:hidden sm:hidden'>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='flex flex-col h-[300px]'
      >
        <Box sx={style}>
        <ul className=''>
        <li>Home</li>
            <li>Shop</li>
            <li>Contact</li>
            <li>En/Fr</li>
      </ul>
        </Box>
      </Modal>
      </nav>
    )
    }
      </div>

      <nav className='hidden lg:block md:block sm:block ' style={{
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
            <div className='justify-center flex m-auto mt-[30px]'>
            <div className={styles.the}>The</div>
        <div className={styles.doughdelights}>Dough Delights</div>
        <div className={styles.flourish}>Crafted with love</div>
        </div>
             <div className="flex gap-3">
              <div className='flex mt-8 gap-3 pr-4'>
            <SearchIcon/>
            <Link href={'/login'}>
            <PersonIcon/>
            </Link>
            <ShoppingCartIcon/>
            </div>
            </div>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
