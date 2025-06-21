'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Footer2 from '../components/Footer2'
import Prod6 from '../components/Prod6'

const page = () => {
  // const all = {
  //   "type": "all"
  //   }

  const [shopType,setShopType] = useState({
    type:"all"
  })

  const [shopCat,setShopCat]:any =useState([])  
  // const [accessToken, setAccessToken] = useState('');
  const fetchToken = async () => {
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
    const username = 'russel';
    const password = 'russel@123';

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(`${client_id}:${client_secret}`),
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username,
          password,
        }),
      });

      const data = await response.json();
      // setAccessToken(data.access);
      return data.access;
    } catch (err) {
      console.error('Error fetching token:', err);
    }
  };

  const categoryData = async(token:String) =>{
  try {
      const response = await fetch(`http://localhost:8000/category/`, { 
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data,'daadadadad')
      setShopCat(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  }

useEffect(() => {
  const init = async () => {
    const token = await fetchToken();  
    if (token) {
      await categoryData(token);      
    }
  };

  init();
}, []);

    const handleCategoryChange = (e:any) => {
      console.log(e,'eeee');
    setShopType({type: e})
    }

  return (
    <div className='bg-[#FFF4E3]'>
      <Navbar/>
      <div>
        {/* <h3 className='text-[#512926]' style={{fontFamily:'Math', fontSize:"55px"}}>All Products</h3> */}
      </div>
      <div className='flex text-[#512926]' style={{marginRight:'50px', gap:'5px'}}>
        Filter: 
        {/* {JSON.stringify(shopCat)} */}
        <p className='flex'>
            {/* <select name="" id="" className='bg-[#FFF4E3] '>
                {shopCat.length > 0 && (
                  shopCat.map((cat)=>(
                     <option value={cat.url}>{cat.name}</option>
                  ))
                )} */}
                {/* <option value="high">High to Low</option>
                <option value="low">Low to High</option> */}
            {/* </select> */}
            <select name="" id="" className='bg-[#FFF4E3]'  onChange={(e)=>handleCategoryChange(e.target.value)}>
            {shopCat.results && shopCat.results.length > 0 ? (
              shopCat.results.map((cat:any) => (
                <option key={cat.url} value={cat.name}>{cat.name}</option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>
        </p>
      </div>
      <Prod6 type={shopType} home={"all"}/>
      <Footer/>
      <Footer2/>
    </div>
  )
}

export default page
