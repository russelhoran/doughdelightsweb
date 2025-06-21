'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { initLightboxJS } from 'lightbox.js-react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';


const Pdp = ({ product }:any) => {
  const [pdp, setPdpData]:any = useState([])
  const [accessToken, setAccessToken] = useState('')
  const [sizeData, setSizeData]:any = useState([])
  const [finalSize, setFinalSize]:any = useState('')
  const [finalFlavor, setFinalFlavorUrl]:any = useState('')
  const [finalFlavorName, setFinalFlavorName]:any = useState('')
  const [flavorData, setFlavorData]:any = useState([])
  const [setName, setFinalName]:any = useState('')
  const [count, setCount]:any = useState(0)
  // const [cartOrderUrl, setCartOrderUrl] = useState('')

  const selectFinalFlav = (url:any, name:any):any => {
    setFinalFlavorName(name)
    setFinalFlavorUrl(url)
  }

  const selectedSize = (size:any, name:any) => {
    setFinalSize(size)
    setFinalName(name)
  }

  useEffect(() => {
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID
    const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET
    const username = 'russel'
    const password = 'russel@123'

    const token = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/token/',
          new URLSearchParams({ grant_type: 'password', username, password }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
            }
          }
        )
        setAccessToken(response.data.access)
      } catch (err) {
        console.error('Error fetching token:', err)
      }
    }

    token()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (product && accessToken) {
        try {
          const res = await axios.get(`http://localhost:8000/product/${product}/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          setPdpData([res.data])

          // Sizes
          if (res.data.sizes?.length) {
            const sizes = await Promise.all(
              res.data.sizes.map((url:any) =>
                axios.get(url, {
                  headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => res.data)
              )
            )
            setSizeData(sizes)
          }

          // Flavors
          if (res.data.flavors?.length) {
            const flavors = await Promise.all(
              res.data.flavors.map((url:any) =>
                axios.get(url, {
                  headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => res.data)
              )
            )
            setFlavorData(flavors)
          }
        } catch (err) {
          console.error('Fetch error:', err)
        }
      }
    }

    fetchData()
  }, [accessToken, product])

const handleAddToCart = async () => {
  if (!finalSize || !finalFlavor || count < 1) {
    // alert('Please select size, flavor, and quantity.');
    toast('Please select size, flavor, and quantity.')
    return;
  }

  const userId = Cookies.get('userid');
  if (!userId) {
    toast('User not logged in.');
    return;
  }

  try {
    const productUrl = pdp[0].url;

    // Step 1: Get existing cart order
    const cartRes = await axios.get(
      `http://localhost:8000/cartorder/?users=${userId}&paidstatus=false`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    let cartOrder = cartRes.data?.results?.[0];

    if (cartOrder) {
      // Step 2: Get existing order items
      const orderItemResponses = await Promise.all(
        cartOrder.orderitem.map((url:any) =>
          axios.get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
        )
      );

      const matchingItem = orderItemResponses.find(
        item =>
          item.data.product === productUrl &&
          item.data.size === finalSize &&
          item.data.flavor === finalFlavor
      );

      if (matchingItem) {
        // ✅ Update quantity of existing item
        const updatedQty = matchingItem.data.quantity + count;

        await axios.patch(
          matchingItem.data.url,
          { quantity: updatedQty },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        await axios.patch(
          cartOrder.url,
          {
            total: cartOrder.total + pdp[0].mrp * count,
            quantity: cartOrder.quantity + count,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        // ❌ No matching item, create new one
        const newItem = await axios.post(
          'http://localhost:8000/orderitem/',
          {
            product: productUrl,
            quantity: count,
            size: finalSize,
            flavor: finalFlavor,
  //          category: pdp[0].category,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Update cart with new order item
        await axios.patch(
          cartOrder.url,
          {
            orderitem: [...cartOrder.orderitem, newItem.data.url],
            total: cartOrder.total + pdp[0].mrp * count,
            quantity: cartOrder.quantity + count,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
    } else {
      // 🚨 No cart found, create a new one
      const newItemRes = await axios.post(
        'http://localhost:8000/orderitem/',
        {
          product: productUrl,
          quantity: count,
          size: finalSize,
          flavor: finalFlavor,
//          category: pdp[0].category,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      await axios.post(
        'http://localhost:8000/cartorder/',
        {
          users: `http://localhost:8000/users/${userId}/`,
          orderitem: [newItemRes.data.url],
          quantity: count,
          total: pdp[0].mrp * count,
          to_pay: pdp[0].mrp * count,
          discount: 0,
          paidstatus: false,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    }

    // ✅ Reset UI state
    setCount(1);
    setFinalSize('');
    setFinalFlavorUrl('');
    toast('Item added to cart!');
  } catch (err) {
    console.error('Error adding to cart:', err);
    toast('Failed to add to cart.');
  }
};

  return (
    <div className='p-4 max-w-4xl mx-auto'>
      {pdp.map((p:any) => (
        <div key={p.url} className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <Zoom>
            <img src={p.image || '/Images/cake1.jpeg'} alt={p.name} className='w-full h-auto rounded-lg shadow-md' />
          </Zoom>

          <div>
            <h1 className='text-2xl font-bold text-[#513126]'>{p.name}</h1>
            <p className='text-sm text-gray-600'>Tax Included</p>

            <div className='mt-4'>
              <h2 className='font-semibold text-sm'>Select Size</h2>
              <div className='flex gap-2 flex-wrap mt-1'>
                {sizeData.map((size:any) => (
                  <button
                    key={size.url}
                    className='bg-amber-100 text-black px-3 py-1 rounded hover:bg-amber-200 text-sm'
                    onClick={() => selectedSize(size.url, size.name)}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              {setName && <p className='mt-1 text-sm'>Selected Size: <strong>{setName}</strong></p>}
            </div>

            <div className='mt-4'>
              <h2 className='font-semibold text-sm text-[#be8774]'>Flavors</h2>
              <div className='flex flex-wrap gap-2 mt-1'>
                {flavorData.map((flav:any) => (
                  <button
                    key={flav.url}
                    className='bg-teal-600 text-white px-4 py-1 rounded text-sm hover:bg-teal-700'
                    onClick={() => selectFinalFlav(flav.url, flav.name)}
                  >
                    {flav.name}
                  </button>
                ))}
              </div>
              {finalFlavorName && <p className='mt-1 text-sm'>Selected Flavor: <strong>{finalFlavorName}</strong></p>}
            </div>

            <div className='mt-5'>
              <div className='flex items-center gap-4'>
                <span className='text-crimson font-semibold text-lg'>Quantity: {count}</span>
                <button
                  className='bg-green-600 text-white px-3 py-1 rounded text-xl'
                  onClick={() => setCount((prev:any) => prev + 1)}
                >
                  +
                </button>
                <button
                  className='bg-red-500 text-white px-3 py-1 rounded text-xl'
                  onClick={() => setCount((prev:any) => Math.max(prev - 1, 0))}
                >
                  -
                </button>
              </div>
              <button
                className='mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition'
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Pdp

