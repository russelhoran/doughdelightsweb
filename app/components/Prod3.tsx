import React, { useEffect, useState } from 'react'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import axios from 'axios';
import Link from 'next/link';

const Prod3 = ({typee}:any) => {


  // function pdpPage (idx:any){
  //   <Link href={`product/${idx}`}></Link>
  // }
    // console.log(typee,'typeeee');
    
    // const [typee,setType] = useState('');
    const [accessToken,setAccessToken]= useState('')
    const [products,setProductData]:any=useState([]);

    useEffect(()=>{
      const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
      const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
      const username = 'russel';
      const password = 'russel@123'
    
    
        const token = async () => {
          try {
            const popularData = await axios.post(
              "http://localhost:8000/api/token/", 
              new URLSearchParams({
                grant_type: "password",
                username,   
                password,    
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
                },
              }
            );
          
            console.log(popularData.data.access,'exit');
            
             setAccessToken(popularData.data.access)
          } catch (err) {
            console.error("Error fetching token:", err);
          }
         
        }
        token();
    },[])
  
    useEffect(() => {
    
      if(typee.type == 'signature' && accessToken!=''){
        const fetchDataSignature = async() =>{
          try {
            const popularData = await axios.get(`http://localhost:8000/product/?category__name=${typee.type}`, {
              headers: {
                "Authorization": `Bearer ${accessToken}`
              }
            });
            console.log('test');
            setProductData(popularData.data.results)
            console.log(products)
          } catch (err) {
            throw new Error('Error');
          }
        };
        fetchDataSignature()
        }
    }, [accessToken, typee]);

    return (
    <div style={{margin: "auto",justifyContent: "center",display: "flex",flexDirection: "column", background:"#FFF4E3"}}>
    <h1 className='font-bold' style={{fontSize:"60px", color:"#513126", fontFamily:'math'}}>Signature Collections</h1>
   <div className='grid grid-cols-4 gap-4 p-[34px]' >
     {products.slice(0, 3).map((prod:any, index:any) => (
          <Link href={`/product/${prod.url.split('').reverse().join('')[1]}`} key={index}>
          {/* <div key={index} onClick={() => pdpPage(index)}> */}
       <div key={index}>
         <img  className='h-[260px] w-[260px] mb-[15px] hover:scale-125 transition-all duration-500 cursor-pointer' src={prod.image} alt={prod.name} />
         <h2 className='hover:underline' style={
             {fontSize: "17px",
              color: "#513126",
              fontFamily: "math",
              fontWeight:"bold"
              }}>{prod.name}</h2>
         <p className='' style={{fontFamily: "Math"}}><CurrencyRupeeIcon className='' style={{
             fontSize:"17px"
         }}/>{prod.mrp}</p>
       </div>
       {/* </div> */}
       </Link>
     ))}
   </div>
 </div>
   )
}

export default Prod3
