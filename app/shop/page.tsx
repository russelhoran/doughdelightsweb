import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Footer2 from '../components/Footer2'
import Prod6 from '../components/Prod6'

const page = () => {
  const all = {
    "type": "all"
    }
  return (
    <div className='bg-[#FFF4E3]'>
      <Navbar/>
      <div>
        <h3 className='text-[#512926]' style={{fontFamily:'Math', fontSize:"55px"}}>All Products</h3>
      </div>
      <div className='flex text-[#512926]' style={{marginRight:'50px', gap:'5px'}}>
        Filter: 
        <p className='flex'>
            <select name="" id="" className='bg-[#FFF4E3] '>
                <option value="">Price</option>
                <option value="high">High to Low</option>
                <option value="low">Low to High</option>
            </select>
        </p>
      </div>
      <Prod6 type={all}/>
      <Footer/>
      <Footer2/>
    </div>
  )
}

export default page
