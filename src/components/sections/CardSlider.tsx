import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./cardslider.css";

import img1 from "../../assets/img1.webp";
import img2 from "../../assets/img2.webp";
import img3 from "../../assets/img3.webp";
import img4 from "../../assets/img1.webp";
import img5 from "../../assets/img2.webp";

interface Card {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

const cards: Card[] = [
  {
    id: 1,
    title: "Apple Intelligence",
    subtitle: "Tú a la infinita potencia.",
    image: img1,
    description: "Explora la potencia con inteligencia artificial.",
  },
  {
    id: 2,
    title: "Cámaras de última generación",
    subtitle: "Haz fotos soñadas y videos de película.",
    image: img2,
    description: "Captura momentos con calidad cinematográfica.",
  },
  {
    id: 3,
    title: "Chip y batería",
    subtitle: "Velocidad para rato.",
    image: img3,
    description: "El chip A18 Pro te acompaña todo el día.",
  },
  {
    id: 4,
    title: "Innovación",
    subtitle: "Diseñado para sorprender.",
    image: img4,
    description: "Cada detalle pensado para ti.",
  },
  {
    id: 5,
    title: "Pantalla avanzada",
    subtitle: "Colores más vivos que nunca.",
    image: img5,
    description: "Experimenta imágenes como nunca antes.",
  },
];

export default function CardSlider() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden bg-gradient-to-b from-[#82ff97] to-[#1e393b]">
      {/* Capa oscura + desenfoque permanente */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

      {/* Texto principal con responsividad */}
      <div className="text-center mb-6 relative z-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase">
          ¡Conoce nuestras actividades!
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-2">
          Desliza y explora cada una
        </p>
      </div>


      {/* Swiper */}
      <Swiper
        breakpoints={{
          300: { slidesPerView: 1.2, spaceBetween: 10 },
          640: { slidesPerView: 1.5, spaceBetween: 15 },
          768: { slidesPerView: 2.1, spaceBetween: 20 },
          1024: { slidesPerView: 3.2, spaceBetween: 30 },
          1920: { slidesPerView: 4.5, spaceBetween: 40 },
        }}
        loop={false}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        modules={[Autoplay]}
        className="w-full relative z-10"
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id} className="flex justify-center items-center">
            <div
              onClick={() => setSelectedCard(card)}
              className="relative w-[240px] h-[60vh] sm:w-[280px] sm:h-[65vh] md:w-[300px] md:h-[70vh] lg:w-[320px] lg:h-[75vh] xl:w-[340px] xl:h-[80vh] max-h-[700px] rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer group transition-transform duration-300 hover:scale-[1.01]"
              style={{
                backgroundImage: `url(${card.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition duration-300" />
              <div className="absolute top-6 left-6 right-6 z-10 text-white">
                <h3 className="text-sm font-medium text-white mb-1">{card.title}</h3>
                <p className="text-2xl font-bold leading-tight">{card.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* SVG ola decorativa en parte inferior con animación */}
      <div className="absolute bottom-0 left-0 w-[200%] z-0 overflow-hidden">
        <svg
          className="w-full h-[120px] animate-waves"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >

        </svg>
      </div>

      {/* Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">
          <div className="bg-white text-black rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-red-500"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            {/* Título principal */}
            <div className="mb-8">
              <h3 className="text-sm text-gray-500 font-medium">{selectedCard.title}</h3>
              <h2 className="text-3xl font-bold">{selectedCard.subtitle}</h2>
            </div>

            {/* Sección 1 */}
            <section className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-gray-100 p-6 rounded-xl">
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">La belleza de la simplicidad.</h4>
                <p className="text-gray-700 text-sm">
                  Las cámaras del iPhone capturan fotos espectaculares con un gran nivel de detalle.
                  Ahora puedes grabar el video perfecto en tiempo récord gracias a herramientas avanzadas.
                </p>
              </div>
              <img
                src={selectedCard.image}
                alt=""
                className="w-[200px] rounded-2xl shadow-lg"
              />
            </section>

            {/* Sección 2 */}
            <section className="mb-6 bg-gray-100 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-2">Un zoom que te dejará woooow.</h4>
              <p className="text-gray-700 text-sm mb-4">
                Amplía tus posibilidades a la hora de encuadrar. Usa primeros planos súper nítidos o
                el ultra gran angular para capturar más sin moverte.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="w-full aspect-[3/4] bg-gray-300 rounded-xl overflow-hidden"
                  >
                    <img
                      src={selectedCard.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );

}
