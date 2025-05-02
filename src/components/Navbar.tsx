import React from "react";
import logo from "../assets/logo.svg";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <div className="navbar-container">
      {/* Logo */}
      <div className="navbar-logo">
        <img src={logo} alt="Logo Mapau" className="logo-leaves" />
        <h1 className="logo-title">
          MAPAU <span className="logo-highlight">Luxury Cenotes</span>
        </h1>
        <p className="logo-subtitle">& Villas</p>
      </div>

      {/* Menu */}
      <div className="navbar-menu">
        <ul className="menu-items">
          {['Inicio', 'Nosotros', 'Contactanos', 'FAQ'].map((item, i) => (
            <li key={i} className="menu-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
