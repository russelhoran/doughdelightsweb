'use client';
import React from 'react'
import Navbar from './components/Navbar'
import Carousell from './components/Carousel'
import Prod6 from './components/Prod6';
import Footer from './components/Footer';
import Footer2 from './components/Footer2';

const data =  {
  "src":[
    "/Images/cake5.jpeg",
  ]
}

const popular = {
"type": "popular"
}
const signature = {
"type": "signature"
}

const page = () => {
  return (
    <div>
      <Navbar/>
      <Carousell data={data} videos={true} />
      <Prod6 type={popular} forr={"home"}/>
      <Prod6 type={signature} forr={"home"}/>
      <Carousell data={data} videos={false}/>
      <Footer/>
      <Footer2/>
    </div>
  )
}

export default page
