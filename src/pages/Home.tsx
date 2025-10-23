import React from "react";
import MainSlider from "../components/Slider/MainSlider";
import img2 from "../assets/twoleaff.png";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute z-[999] w-full">
        <Navbar />
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

          <span className="font-Mapau ml-[-12px] sm:ml-[-20px] md:ml-[-6px]">M</span>
          <span className="ml-[-12px] sm:ml-[-20px] md:ml-[-28px]">A</span>
          <span className="ml-[-20px] sm:ml-[-32px] md:ml-[-44px]">P</span >
          <span className="inline-block  ml-[-20px] md:ml-[-44px] lg:hidden">A</span>
          <span className="inline-block  ml-[-20px] md:ml-[-44px] lg:hidden">U</span>
        </h1>
        <br />
        <h1 className="logo-title">Luxury Cenotes</h1>  <p className="logo-subtitle">& Villas</p>
        <button
          className="
            border px-4 sm:px-5 my-4 sm:my-6 border-[#ffb434]
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
