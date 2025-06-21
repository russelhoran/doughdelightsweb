'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Payment from './Payment';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Formik } from 'formik';
import Image from 'next/image'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { wrap } from 'module';

const style = {
  position: 'absolute',
  top: '55%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display:"flex",
  flexDirection: "column",
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  gap:4,
  p: 4,
};


const CartOrder = () => {
  const [cartData, setCartData]:any = useState(null);
  const [external, setExternal] = useState({
    image:"",
    mode:"",
  });
  const [accessToken, setAccessToken] = useState('');
  const router = useRouter();
  const userId = Cookies.get('userid');
  const [open, setOpen] = useState(false);
  const handleOpen = async() => {
    await fetchQR(accessToken)
    await fetchpaymentMode(accessToken)
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  maxHeight: "100%",
  width: 1,
});

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
      setAccessToken(data.access);
      return data.access;
    } catch (err) {
      console.error('Error fetching token:', err);
    }
  };

  // Fetch cart data
  const fetchCart = async (token:any) => {
    try {
      const response = await fetch(`http://localhost:8000/cartorder/?users=${userId}&paidstatus=False`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCartData(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const fetchQR = async (token:String) => {
    try {
      const response = await fetch(`http://localhost:8000/Paymentscanner/?status=true`, { 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExternal((prev)=>({...prev,image:data.results[0].image}));
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const fetchpaymentMode = async (token:String) => {
    try {
      const response = await fetch(`http://localhost:8000/paymentmode/`, { 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExternal((prev)=>({...prev,mode:data.results[0].url}));
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };


  // Initial Load
  useEffect(() => {
    if (!userId) {
      router.push('/login');
      return;
    }

    const init = async () => {
      await fetchToken();
    };

    init();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchCart(accessToken);
    }
    console.log(external,'extenral;');
    
  }, [accessToken]);

  const updateQuantity = async (item:any, change:any) => {
    const newQty = item.quantity + change;
    if (newQty < 1) return;

    try {
      await fetchToken();
      await fetch(item.url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      const updatedItems = cartData?.results[0].orderitem__details.map((i: any) =>
        i.url === item.url ? { ...i, quantity: newQty } : i
      );

      await updateCartOrder(cartData?.results[0].url, updatedItems);
      fetchCart(accessToken);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const updateCartOrder = async (cartOrderUrl:any, items:any) => {
    const totalQuantity = items.reduce((sum:any, item:any) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum:any, item:any) => sum + item.product__details.mrp * item.quantity, 0);
    const discount = 0;

    try {
      //fetchToken().then((data)=>console.log(data,'bc'))
      // await fetchToken();
      await fetch(cartOrderUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quantity: totalQuantity,
          total: totalPrice,
          to_pay: totalPrice - discount,
          discount,
        }),
      });
      console.log(cartOrderUrl, items, 'kya baat')
      console.log('hmmm')
      fetchCart(accessToken)
    } catch (err) {
      console.error('Error updating cart order:', err);
    }
  };

  const removeItem = async (item: any) => {
    try {
      await fetchToken();
      await fetch(item.url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const updatedItems = cartData.results[0].orderitem__details.filter((i:any) => i.url !== item.url);
      await updateCartOrder(cartData.results[0].url, updatedItems);
      fetchCart(accessToken);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  return (
    <div className="lg:grid grid-cols-4 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-3 p-8">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        {cartData && cartData.results && cartData.results.length > 0 ? (
          cartData.results[0].orderitem__details.map((item:any, index:any) => (
            <div
              key={index}
              className="flex items-center gap-6 mb-6 p-4 border rounded-lg shadow-sm"
            >
              <img
                src={item.product__details.image}
                alt={item.product__details.name}
                className="w-[95px] h-[95px] object-cover rounded"
              />
              <div className="flex flex-col gap-2 flex-grow">
                <p>
                  <span className="font-semibold">Product Name:</span> {item.product__details.name}
                </p>
                <p>
                  <span className="font-semibold">Flavor Name:</span> {item.flavor__name}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ₹{item.product__details.mrp}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Quantity:</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => updateQuantity(item, -1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => updateQuantity(item, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item)}
                className="text-red-600 font-semibold hover:underline"
              >
                Remove
              </button>

            </div>
          ))
        ) : (
          <>
            <div className="mt-6">No Items To Display </div>
            <div className="font-bold">Add Items to Cart to display </div>
          </>
        )}
      </div>

      {/* Order Summary */}
      <div className="col-span-1 p-8 border-l">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        {cartData && cartData.results && cartData.results.length > 0 ? (
          <div className="space-y-3">
            <p>
              <span className="font-medium">Total Quantity:</span>{' '}
              {cartData.results[0].quantity ?? 0}
            </p>
            <p>
              <span className="font-medium">Total Price:</span> ₹
              {cartData.results[0].total ?? 0}
            </p>
            <p>
              <span className="font-medium">Discount:</span> ₹
              {cartData.results[0].discount ?? 0}
            </p>
            <p>
              <span className="font-medium">To Pay:</span> ₹
              {(cartData.results[0].total ?? 0) - (cartData.results[0].discount ?? 0)}
            </p>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="success" onClick={handleOpen}>
                Proceed To Pay
              </Button>
            </Stack>
          <Modal
        style={{overflowY:"scroll", display:'flex', justifyContent:'center', alignItems:'center'}}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
         <Formik
       initialValues={{ address: '', landmark: '',phone: '', payment:'', user: `http://localhost:8000/users/${userId}/`, upi_id: '' , transaction_id:'', modeofpayment:external.mode,upiss:'', email: ''}} 
       validate={values => {
         const errors:any = {};
         if (!values.address) {
           errors.address = 'Required';
         } 
         if (!values.landmark) {
           errors.landmark = 'Required';
         } 
         if (!values.phone) {
           errors.phone = 'Required';
         } 
        //  if (!values.payment) {
        //    errors.payment = 'Required';
        //  } 
           if (!values.email) {
            errors.email = 'Required';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
         if (!values.upi_id) {
           errors.upi_id = 'Required';
         } 
         if (!values.transaction_id) {
           errors.transaction_id = 'Required';
         } 
         if (!values.modeofpayment) {
           errors.modeofpayment = 'Required';
         } 
         if (!values.upiss) {
           errors.upiss = 'Required';
         } 
         return errors;
       }}
  onSubmit={async (values, { setSubmitting }) => {
  try {
    console.log(values,'values');
    
    setSubmitting(true);

    // Step 1: Submit payment
    const paymentRes = await fetch("http://localhost:8000/payment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        upi_id: values.upi_id,
        transaction_id: values.transaction_id,
        modeofpayment: values.modeofpayment,
      }),
    });

    if (!paymentRes.ok) throw new Error("Payment failed");

    const paymentData = await paymentRes.json();
    const paymentUrl = paymentData.url;

    // Step 2: Submit shipping
    const shippingRes = await fetch("http://localhost:8000/shipping/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        address: values.address,
        landmark: values.landmark,
        phone: values.phone,
        email: values.email,
        user: `http://localhost:8000/users/${userId}/`,
        payment: paymentUrl,
      }),
    });

    if (!shippingRes.ok) throw new Error("Shipping failed");

    const shippingData = await shippingRes.json();
    const shippingUrl = shippingData.url;

    const cartPatchRes = await fetch(cartData.results[0].url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        paidstatus: true,
        shipping: shippingUrl,
      }),
    });

    if (!cartPatchRes.ok) throw new Error("Cart update failed");

   
    const orderRes = await fetch("http://localhost:8000/order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        order: parseInt(cartData.results[0].url.split('/').filter(Boolean).pop()),
      }),
    });

    if (!orderRes.ok) throw new Error("Order creation failed");

    const orderData = await orderRes.json();

    await fetchCart(accessToken)
    toast("Order Placed Successfully, We will contact you as soon , as we confirm the details");
    // alert("Order placed successfully!");
    console.log(orderData);

    setSubmitting(false);
    handleClose(); 
  } catch (err) {
    console.error(err);
    alert("Something went wrong during order processing.");
    setSubmitting(false);
  }
}}>
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         setFieldValue
       }) => (
         <form onSubmit={handleSubmit} style={{maxHeight: "100vh", overflow: "scroll"}}>
          <Box>
          <label htmlFor='address' style={{fontWeight:'bold'}}>Address</label>
           <input
            style={{border: '2px solid black'}}
             type="text"
             name="address"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.address}
           />
           </Box>
           <p className='text-red-800'>{errors.address && touched.address && errors.address}</p>
            <Box>
            <label htmlFor='landmark' style={{fontWeight:'bold'}}>Landmark</label>
           <input
            style={{border: '2px solid black'}}
             type="text"
             name="landmark"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.landmark}
           />
           </Box>
           <p className='text-red-800'>{errors.landmark && touched.landmark && errors.landmark}</p>
              <Box>
            <label htmlFor='phone' style={{fontWeight:'bold'}}>Phone</label>
           <input
            style={{border: '2px solid black'}}
             type="number"
             name="phone"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.phone}
           />
           </Box>
           <p className='text-red-800'>{errors.phone && touched.phone && errors.phone}</p>
             <Box>
            <label htmlFor='email' style={{fontWeight:'bold'}}>Email</label>
           <input
            style={{border: '2px solid black'}}
             type="email"
             name="email"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.email}
           />
           </Box>
           <p className='text-red-800'>{errors.email && touched.email && errors.email}</p>
           <Box>
      {/* <p className='text-red-800'>{errors.modeofpayment && touched.modeofpayment && errors.modeofpayment}</p> */}
           <input
            style={{border: '2px solid black'}}
             type="text"
             hidden
             name="modeofpayment"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.modeofpayment}
           />
           </Box>
           {/* <p className='text-red-800'>{errors.modeofpayment && touched.modeofpayment && errors.modeofpayment}</p> */}
           <Box>
            <Image
            src={external?.image}
            width={500}
            height={500}
            alt="Qr Payment"
          />
           </Box>
           <Box>
        <p className="font-mono font-bold">
       Please make the payment using the QR code above, and then complete the details below. Once we verify the information, we will confirm your order. Thank you!
          </p>
           </Box>
             <Box sx={{display:"flex", flexWrap:"wrap"}}>
              {values.upiss == "" ? (
              <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                name="upiss"
                onChange={(e:any) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFieldValue("upiss", file.name); 
                  }
                }}
              />
            </Button>): (
             <Box sx={{ display: "flex", flexDirection: "column", maxWidth: "100%" }}>
                <Typography
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "100%",
                  }}
                  variant="body2"
                >
                  File Name: {values.upiss}
                </Typography>
                  <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              onClick={() => setFieldValue("upiss", "")}
            >Remove File</Button>
              </Box>)}
           </Box>
           {touched.upiss && errors.upiss && (
  <Typography color="error">{errors.upiss}</Typography>
)}
            <Box>
            <label htmlFor='phone' style={{fontWeight:'bold'}}>UPI ID</label>
           <input
            style={{border: '2px solid black'}}
             type="text"
             name="upi_id"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.upi_id}
           />
           </Box>
             {touched.upi_id && errors.upi_id && (
          <Typography color="error">{errors.upi_id}</Typography>
        )}
            <Box>
            <label htmlFor='phone' style={{fontWeight:'bold'}}>Transaction id</label>
           <input
            style={{border: '2px solid black'}}
             type="number"
             name="transaction_id"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.transaction_id}
           />
           </Box>
           <p className='text-red-800'>{errors.upi_id && touched.upi_id && errors.upi_id}</p>
                    <button
            className="bg-green-600 rounded p-2 w-[200px] text-center font-math text-white m-auto mt-5 size-12 disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
         </form>
       )}
     </Formik>
        </Box>
      </Modal>
          </div>
        ) : (
          <div className="mt-4">No Items to Display,</div>
        )}
      </div>
    </div>
  );
};

export default CartOrder;


