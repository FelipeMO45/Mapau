// src/components/section1/CardSlider.tsx
import  {  useState , useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./cardslider.css";
import { useActividades, Actividad } from "../../hooks/useActividades";




export default function CardSlider() {
  const { actividades, loading } = useActividades();
  const [selected, setSelected] = useState<Actividad | null>(null);

   // Lock body scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "auto";
    return () => {
      // Asegura restaurar al desmontar
      document.body.style.overflow = "auto";
    };
  }, [selected]);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-300">
        Cargando actividades…
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden bg-gradient-to-b from-[#82ff97] to-[#1e393b]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

      {/* Heading */}
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
          1024: { slidesPerView: 3.8, spaceBetween: 30 },
          1920: { slidesPerView: 4.5, spaceBetween: 30 },
        }}
        loop={false}
        centeredSlides
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        modules={[Autoplay]}
        className="w-full relative z-10"
      >
        {actividades.map((act: Actividad) => {
          // Toma la primera imagen del JSONB o vacío
          const bgImage = act.imagenes?.[0] ?? "";

          return (
            <SwiperSlide key={act.id} className="flex justify-center items-center">
              <div
                onClick={() => setSelected(act)}
                className="relative w-[240px] h-[60vh] sm:w-[280px] sm:h-[65vh]
                           md:w-[300px] md:h-[70vh] lg:w-[320px] lg:h-[75vh]
                           xl:w-[340px] xl:h-[80vh] max-h-[700px]
                           rounded-[2rem] overflow-hidden shadow-2xl
                           cursor-pointer group transition-transform duration-300
                           hover:scale-[1.01]"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition duration-300" />
                <div className="absolute top-6 left-6 right-6 z-10 text-white">
                  <h3 className="text-sm font-medium mb-1">{act.titulo}</h3>
                  <p className="text-2xl font-bold leading-tight">{act.slogan}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Bottom wave (opcional) */}
      <div className="absolute bottom-0 left-0 w-[200%] z-0 overflow-hidden">
        <svg
          className="w-full h-[120px] animate-waves"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* tu <path> aquí */}
        </svg>
      </div>

      {/* Modal de detalle */}
      {selected && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gradient-to-b from-[#56a362] to-[#1e393b] text-black rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-2xl text-[#ffffff] hover:text-red-500"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            {/* Encabezado */}
            <div className="mb-8">
              <h3 className="text-sm text-[#e6e6e6] font-medium">{selected.titulo}</h3>
              <h2 className="text-3xl text-[#ffffff] font-bold">{selected.slogan}</h2>
            </div>

            {/* Sección 1 */}
            <section className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-[#0b5a1f70] p-6 rounded-xl">
              <div className="flex-1">
                <h4 className="text-lg  text-[#e6e6e6] font-bold mb-2">{selected.titulo1}</h4>
                <p className="text-[#ffffff] text-sm">{selected.texto1}</p>
              </div>
              {selected.imagenes[0] && (
                <img
                  src={selected.imagenes[0]}
                  alt=""
                  className="w-[200px] rounded-2xl shadow-lg object-cover"
                />
              )}
            </section>

            {/* Sección 2 */}
            <section className="mb-6 bg-gradient-to-b from-[#0b5a1f70] to-[#1e393b] p-6 rounded-xl">
              <h4 className="text-lg text-[#e6e6e6] font-bold mb-2">{selected.titulo2}</h4>
              <p className="text-[#ffffff] text-sm mb-4">{selected.texto2}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selected.imagenes.map((url, i) => (
                  <div key={i} className="w-full aspect-[3/4] rounded-xl overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
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
