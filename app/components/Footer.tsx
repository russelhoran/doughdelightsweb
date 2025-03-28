import React from 'react'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import styles from '../css/styles.module.css'
const Footer = () => {

    const footerData =  {
        "sample":[
          {
            "description":"Subscribe for 15% off your first order!",
            "paragraph":"Be the first to know about exclusive collections and limited-edition offers.",
          },
        ]}


  return (
<div className={`${styles.footermobile} flex flex-col justify-center items-center h-[200px] p-[52px] bg-[#FFF4E3] mb-1 sm:mb-30 md:mb-1 lg:mb-2`}>
      <h2>
        {footerData.sample.map((e,index) =>(
            <div key={index}>
            <h2 style={{
    fontSize: "41px",
    color:'#513126',
    fontFamily:'math'
}}>{e.description}</h2>
<div className='m-auto flex justify-center align-middle'> 
            <p>{e.paragraph}</p>
            </div>
            </div>
        ))}
      </h2>
      <div className='border border-[#513126] p-3 rounded w-[360px]'>
        <input className='bg-[#FFF4E3] w-full outline-none indent-6' type="text" placeholder='Email' />
      </div>
      <ArrowRightAltIcon style={{
        right: '157px',
        position: 'relative',
        top: '-35px',
        fontSize: '21px'
      }}/>
    </div>
  )
}

export default Footer
