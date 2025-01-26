import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

// Define types for the props
interface CarouselProps {
  data: {
    src: string[]; 
  };
  videos?: boolean; 
}

const Carousell: React.FC<CarouselProps> = ({ data, videos = false }) => {
  return (
    <div>
      <Carousel responsive={responsive}>
        {videos && (
          <div className='h-[500px]'>
            <video width="100%" style={{ height: "500px", objectFit: 'cover' }} loop autoPlay muted>
              <source src="./Videos/instagram.mp4" type="video/mp4" />
            </video>
            <p style={{
              position: 'absolute',
              top: '-254px',
              right: '-160px',
              color: 'white',
              fontSize: '55px',
              fontFamily: 'math',
              fontWeight: 'bold'
            }}>
              A New Era of Authentic Italian Desserts
            </p>
          </div>
        )}
        {data.src.map((img, index) => (
          <div key={index}>
            <img 
              src={img} 
              alt={`image-${index}`} 
              style={{ height: "450px", objectFit: 'cover', width: "100%" }} 
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Carousell;
