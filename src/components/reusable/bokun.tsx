import { useEffect } from "react";

const BokunWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js?bookingChannelUUID=fb13fed7-e5ea-4610-8199-d79a22e6e75f";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <style>{`
        #bokun_913bf47f_2ca4_460e_b8cb_655c0b971d2b {
          display: inline-block;
          padding: 10px 20px;
          background: #408C3D;
          border-radius: 5px;
          box-shadow: none;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          text-align: center;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
          transition: background .2s ease;
        }
        #bokun_913bf47f_2ca4_460e_b8cb_655c0b971d2b:hover {
          background: #285726;
        }
        #bokun_913bf47f_2ca4_460e_b8cb_655c0b971d2b:active {
          background: #30682e;
        }
      `}</style>

      <button
        className="bokunButton"
        disabled
        id="bokun_913bf47f_2ca4_460e_b8cb_655c0b971d2b"
        data-src="https://widgets.bokun.io/online-sales/fb13fed7-e5ea-4610-8199-d79a22e6e75f/experience/1032026?partialView=1"
        data-testid="widget-book-button"
      >
        Book now
      </button>
    </>
  );
};

export default BokunWidget;
