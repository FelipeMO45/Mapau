import img2 from "../../assets/singleleaf1.png";
import img3 from "../../assets/singleleaf2.png";
import img4 from "../../assets/singleleaf3.png";
import "./SliderContent.css";

interface SliderContentProps {
  item: {
    img: string;
  };
}

const SliderContent: React.FC<SliderContentProps> = ({ item }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={item.img}
        alt=""
        className="object-cover w-full h-full"
      />

      <h1
        className=" font-Mapau
    text-[101px] sm:text-[100px] md:text-[120px] lg:text-[200px] xl:text-[250px]
    font-[900] text-[#ffb434] text-opacity-[90%] text-content text-laptop
  "
      >
        <span className="absolute text-u"></span>
        <span className="font-Mapau absolute pl-4 sm:pl-2 md:pl-10 text-u text-content pl-laptop-a">A</span>
        <span className="font-Mapau absolute pl-4 sm:pl-6 md:pl-10 text-r text-content pl-laptop-u">U</span>
      </h1>



      {/* Leaf One */}
      <div className="leaf leaf-one">
        <img
          src={img2}
          alt=""
          className="
            w-[50px] h-[38px]
            sm:w-[70px] sm:h-[55px]
            lg:w-[112px] lg:h-[83px]
            rotate-[-20deg]
          "
        />
      </div>

      {/* Leaf Two */}
      <div className="leaf leaf-two">
        <img
          src={img4}
          alt=""
          className="
            w-[40px] h-[30px]
            sm:w-[55px] sm:h-[40px]
            lg:w-[70px] lg:h-[52px]
          "
        />
      </div>

      {/* Leaf Three */}
      <div className="leaf leaf-three">
        <img
          src={img3}
          alt=""
          className="
            w-[40px] h-[30px]
            sm:w-[55px] sm:h-[40px]
            lg:w-[70px] lg:h-[52px]
          "
        />
      </div>
    </div>
  );
};

export default SliderContent;
