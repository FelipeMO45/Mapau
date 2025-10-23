// src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import logoUrl from '../assets/logo.svg';
import Home from '../pages/Home';
import Section1 from '../components/section1/CardSlider';
import ActividadesCRUD from './crud/ActividadesCRUD';
import 'react-toastify/dist/ReactToastify.css';
import PricingCards from './pricing/pricingCard';
import Dashboard from './Dashboard';
import { Footer } from './footer';

const Layout: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShowLoader(false), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden font-Montserrat relative">
      {showLoader && (
        <div
          className={`
            fixed inset-0 z-[9999] flex items-center justify-center
            bg-gradient-to-b from-[#1e393b] via-[#0f2f19] to-[#000000]
            transition-opacity duration-500
            ${fadeOut ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <img
            src={logoUrl}
            alt="Cargando…"
            className="w-20 h-20 animate-pulse"
          />
        </div>
      )}

      {/* Contenido principal */}
      <Home />
      <Section1 />
      <PricingCards/>
      <Footer/>
      <Dashboard/>



    </div>
  );
};

export default Layout;
