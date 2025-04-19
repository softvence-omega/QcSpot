import { useEffect } from "react";
import ReactGA from "react-ga4";

const GAListener = () => {
  ReactGA.initialize("G-RZQL7ZYCLE");

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
    });
  }, []);

  return null;
};

export default GAListener;
