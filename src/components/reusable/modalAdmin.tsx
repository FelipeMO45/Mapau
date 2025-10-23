// src/components/Modal.tsx
import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: ReactNode;
  onClose(): void;
}

export function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    // Guardar overflow previos
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    // Bloquear scroll exterior
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      // Restaurar overflow
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  return createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        bg-black/60
        flex items-center justify-center
        px-4 sm:px-6 md:px-8
      "
      onClick={onClose}
    >
      <div
        className="
          relative bg-[#26292e] rounded-2xl
          w-full
          max-w-xs       sm:max-w-sm
          md:max-w-md    lg:max-w-lg
          xl:max-w-2xl   2xl:max-w-3xl
          mx-auto
          p-4 sm:p-6 md:p-8
          h-full sm:h-auto
          shadow-2xl
          overflow-auto max-h-[100vh]
        "
        onClick={e => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3
            text-2xl text-white hover:text-red-500
            p-1
          "
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
