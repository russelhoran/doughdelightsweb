import React from 'react'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const Prod3 = () => {

    const products =  {
        "sample":[
          {
            "description":"Lady with a red umbrella",
            "image-url":"/Images/cake6.jpeg"
          },
          {
            "description":"Flowers and some fruits",
            "image-url":"/Images/cake2.jpeg"
          },
          {
            "description":"Beautiful scenery",
            "image-url":"/Images/cake5.jpeg"
          },
          {
            "description":"Some kind of bird",
            "image-url":"https://i.imgur.com/QFDRuAh.jpg"
          },
          {
            "description":"The attack of dragons",
            "image-url":"https://i.imgur.com/8yIIokW.jpg"
          }
          
        ]
      
      }


    return (
    <div style={{margin: "auto",justifyContent: "center",display: "flex",flexDirection: "column", background:"#FFF4E3"}}>
    <h1 className='font-bold' style={{fontSize:"60px", color:"#513126", fontFamily:'math'}}>Signature Collections</h1>
   <div className='grid grid-cols-4 gap-4 p-[34px]' >
     {products.sample.slice(0, 3).map((prod, index) => (
       <div key={index}>
         <img className='h-[260px] w-[260px] mb-[15px]' src={prod['image-url']} alt={prod.description} />
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
     ))}
   </div>
 </div>
   )
}

export default Prod3
