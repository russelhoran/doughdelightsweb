'use client';
import React from 'react'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Link from 'next/link'

const Prod6 = () => {

  function pdpPage (idx){
    <Link href={`product/${idx}`}></Link>
  }

 const products =  {
        "sample":[
          {
            "description":"Lady with a red umbrella",
            "image-url":"./Images/cake1.jpeg"
          },
          {
            "description":"Flowers and some fruits",
            "image-url":"./Images/cake2.jpeg"
          },
          {
            "description":"Beautiful scenery",
            "image-url":"./Images/cake4.jpeg"
          },
          {
            "description":"Some kind of bird",
            "image-url":"./Images/cake3.jpeg"
          },
          {
            "description":"The attack of dragons",
            "image-url":"./Images/cake5.jpeg"
          }
          
        ]
      
      }



  return (
    <div style={{background:"#FFF4E3"}}>
       <h1 className='font-bold' style={{fontSize:"60px", color:"#513126", fontFamily:'math'}}>Popular Products</h1>
      <div className='grid grid-cols-4 gap-4 p-[34px]'>
        {products.sample.map((prod, index) => (
          <Link href={`/product/${index}`} key={index}>
          <div key={index} onClick={() => pdpPage(index)}>
            <img className='h-[260px] w-[260px] mb-[15px] hover:scale-125 transition-all duration-500 cursor-pointer' src={prod['image-url']} alt={prod.description} />
            <h2 className='hover:underline' style={
                {fontSize: "17px",
    color: "#513126",
    fontFamily: "math",
    fontWeight:"bold"
    }}>{prod.description}</h2>
            <p className='' style={{fontFamily: "Math"}}><CurrencyRupeeIcon className='' style={{
                fontSize:"17px"
            }}/>100</p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Prod6
