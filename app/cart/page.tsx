export const fetchCache = 'force-no-store';
//export const dynamic = 'force-dynamic'; // disables static rendering and caching
import CartOrder from "../components/CartOrder"
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Footer2 from '../components/Footer2';

const page = () => {

return (
<>
<Navbar/>
<CartOrder/>
<Footer/>
<Footer2/>


</>

)}


export default page
