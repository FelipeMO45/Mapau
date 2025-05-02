import React from "react";
import MainSlider from "./Slider/MainSlider";
import img1 from "../assets/NAT.png";
import img2 from "../assets/twoleaff.png";
import Navbar from "./Navbar";

const Home: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute z-[999] w-full">
        <Navbar />
      </div>

      <div className="absolute z-10 bg-black bg-opacity-[40%]">
        <img src={img1} alt="Background" className="bgimg1" />
      </div>


      <img
        src={img2}
        alt="Decorative leaf"
        className=" decorativeleaf
        "
      />

      <div
        className=" containermapau
          absolute z-[999]
          top-[28%] left-[5%]
          sm:top-[35%] sm:left-[7%]
          md:top-[35%] md:left-[9%]
          lg:top-[37%] lg:left-[11.1%]
          max-w-[90%]
        "
      >
        <h1
          className="responsive-title"
        >

          <span className="ml-[-12px] sm:ml-[-20px] md:ml-[-6px]">M</span><span className="ml-[-12px] sm:ml-[-20px] md:ml-[-28px]">A</span>
          <span className="ml-[-20px] sm:ml-[-32px] md:ml-[-44px]">P</span >
        </h1>
        <p
          className=" lorem
            text-white
            w-[250px]
            sm:w-[300px]
            md:w-[350px]
            lg:w-[400px]
            text-sm
            sm:text-base
          "
        >
          Lorem, ipsum dolor sit amet consectetur adipisicing elit
        </p>
        <button
          className="
            border px-4 sm:px-5 my-4 sm:my-6 border-[#ffbd07]
            rounded-[20px] text-white py-1
            hover:shadow-md hover:shadow-[#ffbd07b4]
            hover:scale-[1.01] transform duration-200
            text-sm sm:text-base
          "
        >
          Learn More
        </button>
      </div>

      <MainSlider />
    </div>
  );
};

export default Home;
