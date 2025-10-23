// src/components/footer/Footer.tsx
import React from 'react'
import VisaIcon from '../assets/icons/visa.svg'
import MastercardIcon from '../assets/icons/mastercard.svg'
import AmexIcon from '../assets/icons/amex.svg'
import PayPalIcon from '../assets/icons/paypal.svg'

import {
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaTwitter,
} from 'react-icons/fa'
import { AiOutlineArrowRight } from 'react-icons/ai'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#1b1d20] via-[#15251c] to-[#000000] text-gray-300">
      {/* Top: newsletter */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-2xl font-bold text-white mb-4 lg:mb-0">
          SIGN UP FOR 10% OFF
        </h2>
        <form className="flex w-full lg:w-auto">
          <input
            type="email"
            placeholder="Enter your e-mail address here"
            className="flex-grow px-4 py-3 rounded-l-md bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-5 bg-green-600 hover:bg-green-700 text-white rounded-r-md flex items-center"
          >
            <AiOutlineArrowRight size={20} />
          </button>
        </form>
      </div>

      <div className="border-t border-gray-800" />

      {/* Middle: links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">ABOUT US</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Our Story
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Made with Care
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">ASSISTANCE</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Accessibility
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">BOUTIQUES</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Find a store
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Book a free eye test
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">FOLLOW US</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <FaTiktok size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800" />

      {/* Bottom: copyright & controls */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Mapau. All rights reserved.
        </p>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <img src={VisaIcon} alt="Visa" className="h-6" />
            <img src={MastercardIcon} alt="Mastercard" className="h-6" />
            <img src={AmexIcon} alt="Amex" className="h-6" />
            <img src={PayPalIcon} alt="PayPal" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  )
}
