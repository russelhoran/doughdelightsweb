'use client';
import React,{useState,useEffect} from 'react'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Link from 'next/link'
import axios from 'axios';
import styles from '../css/styles.module.css';

const Prod6 = ({type, forr}:any) => {
  const [typee,setType] = useState('');
  console.log(type,'typeforloop');
  
  const [accessToken,setAccessToken]= useState('')
  const [products,setProductData]=useState([]);
  
  const forType = forr == "home" ? "true" : ""

  function pdpPage (idx:any){
    <Link href={`product/${idx}`}></Link>
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
 
    if(type.type != '' && accessToken!=''){
      const fetchAllData = async() =>{
        try {
          setType(type); 
          const popularData = await axios.get(`http://localhost:8000/product/?category__name=${type.type}&home=${forType}&status=true`, {
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
      fetchAllData()
      }
}, [accessToken, type]);


  return (
    <div style={{background:"#FFF4E3"}}>
       <h1 className='font-bold' style={{fontSize:"60px", color:"#513126", fontFamily:'math'}}>{type.type.charAt(0).toUpperCase() + type.type.slice(1)} Products</h1>
      <div className='grid md:grid-cols-3 lg:grid-cols-4 gap-4 p-[34px]'>
        {products.map((prod:any, index:any):any => (
          <Link href={`/product/${prod?.url.split('/').reverse()[1]}`} key={prod?.url}>
          <div key={index} onClick={() => pdpPage(index)}>
          <img 
          className={`h-[260px] w-[260px] mb-[15px] hover:scale-125 transition-all duration-500 cursor-pointer ${styles.imgmobile}`} 
          src={prod?.image} 
          alt={prod?.description || 'Default description'} 
        />
          <h2 className='hover:underline' style={
                {fontSize: "17px",
                color: "#513126",
                fontFamily: "math",
                fontWeight:"bold"
                }}>{prod?.name}</h2>
            <p className='' style={{fontFamily: "Math"}}><CurrencyRupeeIcon className='' style={{
                fontSize:"17px"
            }}/>{prod?.mrp}</p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Prod6
