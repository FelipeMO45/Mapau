import Home from "./components/Home";
import React from "react";
import Section1 from "./components/sections/CardSlider";

const App: React.FC = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden font-Montserrat">
      <Home />
      <Section1 />
    </div>
  );
};

export default App;
