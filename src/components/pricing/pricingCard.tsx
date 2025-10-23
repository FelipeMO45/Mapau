// src/components/PricingCards.tsx
import { usePaquetes, Paquete } from '../../hooks/usePaquetes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BokunWidget from '../reusable/bokun';

export default function PricingCards() {
  const { paquetes, loading, error } = usePaquetes();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-white">
        Cargando paquetes…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center py-16">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0d191a] to-[#2f5c36] px-4 py-16">
      <div className="max-w-screen-2xl mx-auto space-y-8">
        {/* Encabezado de sección */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
            ¡Descubre Nuestros Paquetes!
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-300">
            Elige el plan perfecto para tu próxima aventura.
          </p>
        </div>

        {/* Carrusel / Grilla */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={20}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {paquetes.map(paq => (
              <SwiperSlide key={paq.id} className="h-full">
                {/* Altura fija para uniformidad */}
                <div
                  className="h-[500px] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  {/* Imagen con altura fija */}
                  {paq.imagen_url && (
                    <div className="h-40 sm:h-48 w-full overflow-hidden flex-shrink-0">
                      <img
                        src={paq.imagen_url}
                        alt={paq.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Contenido que rellena el resto */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <h3 className="@[300px]:text-2xl md:text-2xl font-semibold mb-2 text-gray-800">
                      {paq.titulo}
                    </h3>
                    {paq.descripcion && (
                      <p className="text-sm sm:text-base md:text-base text-gray-500 mb-4 line-clamp-2">
                        {paq.descripcion}
                      </p>
                    )}

                    <ul className="grid grid-cols-2 gap-2 mb-4 flex-1 overflow-auto">
                      {paq.actividades.slice(0, 4).map((act, i) => (
                        <li key={i} className="flex items-center text-sm sm:text-base md:text-sm text-gray-700">
                          <svg
                            className="w-3 h-3 text-green-500 flex-shrink-0 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0
                                 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {act}
                        </li>
                      ))}
                      {paq.actividades.length > 4 && (
                        <li className="col-span-2 text-right text-xs text-gray-500">
                          +{paq.actividades.length - 4} más…
                        </li>
                      )}
                    </ul>

                    {/* Precio y botón de reserva */}
                    <div className="mt-auto flex justify-center items-baseline space-x-1">
                      <span className="text-2xl font-bold text-[#1fa335]">
                        {paq.precio.toLocaleString('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                        })}
                      </span>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        MXN
                      </span>
                      <BokunWidget />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Nota final */}
          <div className="text-center mt-6">
            <p className="text-sm sm:text-xs md:text-sm text-gray-300">
              Los precios de los paquetes son por persona.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
