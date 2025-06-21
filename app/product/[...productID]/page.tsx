import Footer from '@/app/components/Footer'
import Footer2 from '@/app/components/Footer2'
import Navbar from '@/app/components/Navbar'
import Pdp from '@/app/components/Pdp'
import React from 'react'

const page = async({params}:any) => {
  const param = await params;
  const paramID = param.productID;
  return (
    <div>
      <Navbar/>
      <Pdp product={paramID}/>
      <Footer/>
      <Footer2/>
    </div>
  )
}

export default page
