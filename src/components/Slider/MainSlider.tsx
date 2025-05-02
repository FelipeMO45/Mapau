import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";

import SliderContent from "./SliderContent";
import "./MainSlider.css";

import img1 from "../../assets/img1.webp";
import img2 from "../../assets/img2.webp";
import img3 from "../../assets/img3.webp";

interface ImageItem {
  img: string;
}

export default function MainSlider(): JSX.Element {
  const images: ImageItem[] = [
    { img: img1 },
    { img: img2 },
    { img: img3 },
  ];

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden">
      <Swiper
        navigation
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        mousewheel={false}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        className="w-full h-full"
      >
        {images.map((item, i) => (
          <SwiperSlide key={i}  className="slider-image" >
            <SliderContent item={item}/>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
