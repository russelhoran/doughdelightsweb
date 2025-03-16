'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {initLightboxJS} from 'lightbox.js-react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const Pdp = ({product}) => {

    const [pdp,setPdpData] =useState([])
    const [accessToken,setAccessToken]= useState('')
    const [sizeData,setSizeData] =useState([])
    const [finalSize,setFinalSize]= useState('');
    const [finalflavor,setFinalFlavorUrl]= useState('');
    const [finalflavorname,setFinalFlavorName]= useState('');


    const [flavorData,setFlavorData]= useState('');
    const [setName,setFinalName] = useState('');
    const [count,setCount] = useState(0);
    // const [products,setProductData]=useState([]);

    const selectFinalFlav = (url,name) =>{
        setFinalFlavorName(name)
        setFinalFlavorUrl(url)
    }

    const selectedSize = (size,name) =>{
        setFinalSize(size);
        setFinalName(name)
    }

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
      
        if(product!='' && accessToken!=''){
          const fetchDataSignature = async() =>{
            try {
              const popularData = await axios.get(`http://localhost:8000/product/${product}/`, {
                headers: {
                  "Authorization": `Bearer ${accessToken}`
                }
              });
              console.log('test');
              setPdpData([popularData.data])
              if (popularData.data.sizes && popularData.data.sizes.length > 0) {
                const sizeDataPromises = popularData.data.sizes.map(async (sizeUrl) => {
                  const sizeResponse = await axios.get(sizeUrl, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  });
                  return sizeResponse.data; 
                });
        
                const sizesData = await Promise.all(sizeDataPromises);
                console.log(sizesData,'sizesData');
                
                setSizeData(sizesData);
              }
            } 
            catch (err) {
              throw new Error('Error');
            }
          };
          fetchDataSignature()
          }

          if(product!='' && accessToken!=''){
            const fetchFlavorData = async() =>{
              try {
                const popularData = await axios.get(`http://localhost:8000/product/${product}/`, {
                  headers: {
                    "Authorization": `Bearer ${accessToken}`
                  }
                });
                console.log('test');
                setPdpData([popularData.data])
                if (popularData.data.flavors && popularData.data.flavors.length > 0) {
                  const flavorDataPromises = popularData.data.flavors.map(async (flavor) => {
                    const flavorResponse = await axios.get(flavor, {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    });
                    return flavorResponse.data; 
                  });
          
                  const flavorData = await Promise.all(flavorDataPromises);
                  console.log(flavorData,'falvorData');
                  setFlavorData(flavorData);
                }
              } 
              catch (err) {
                throw new Error('Error');
              }
            };
            fetchFlavorData()
            }
      }, [accessToken, product]);
  

  return (
    <div className='p-3' style={{marginBottom: "55px"}}>
        {pdp.map((p, index) => (
  <div key={p.url} className='grid grid-cols-2 gap-1'> 
<div className="" style={{height:'100%'}}>
<Zoom >
        <img
          alt={p.name} 
          src={p.imageUrl || "/Images/cake1.jpeg"} 
	  style={{height: '100%'}}
          width="100%"
	  height="100%"
        />
      </Zoom>
    </div>
    <div>
      <h1 className="font-bold text-[#513126] text-lg">Dough Delights</h1>
<h3 className="font-bold" style={{fontSize:'24px'}}>{p.name}</h3>
      <p style={{fontSize:'21px',color:'#513126',fontFamily:"math"}}>Tax Included</p>
      <div>
      <div className='' style={{fontSize:'15px'}}>Size</div>
        <div className=' flex gap-3'>        
      {sizeData && sizeData.map((size) => (
   <button key={size.url}  className='text-white p-3 rounded gap-2 bg-[#513126] hover:bg-[#ff9d7c]'
   onClick={()=>selectedSize(size.url,size.name)}>{size.name}</button>
))}
</div>
<div style={{display:'block'}}>
 {
    setName && (
   <div className='block text-black font-bold'>You Have Selected: {setName}</div>
    )
}
</div>
<div>
    <h2 className='text-[#be8774] font-bold'>Flavors</h2>
    <div className='flex flex-col gap-[15px]'>
        {
         flavorData && flavorData.map((flav)=>(
            <>
            <div onClick={()=>selectFinalFlav(flav.url,flav.name)} className='flex text-white bg-orange-500' style={{fontSize:'20px' , fontFamily:'Math'}}>{flav.name}</div>
              </>
         ))
        }
    </div>
{finalflavorname && (<div>You have Selected Flavor : <span className="font-bold">{finalflavorname}</span></div>)}
</div>
<div className='mt-5'>
    <div className=''>
      <div>
      <span className='text-amber-700' style={{fontSize:'18px'}}>Quantity: {count}</span>
    <button onClick={()=>setCount(prev=>prev +1)}><div className='size-8 ml-[10px] bg-green-600 text-white flex justify-center align-middle' style={{fontSize:'24px', border: '1px solid black '}}>+</div></button>
    <button onClick={()=>setCount(prev=>prev -1)}><div className='size-8 ml-[20px] bg-red-500 text-white justify-center align-middle'  style={{marginLeft:'29px',fontSize:'24px', border: '1px solid black' }}>-</div></button>
    </div>
    </div>

 <button className=" text-white mt-2 bg-black p-2 rounded">Add to Cart</button>

</div>
    </div>
    </div>
  </div>
))}
    </div>
  )
}

export default Pdp
