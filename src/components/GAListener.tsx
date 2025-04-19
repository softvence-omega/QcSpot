import { useEffect } from "react";
import ReactGA from "react-ga4";

const GAListener = () => {
  ReactGA.initialize(import.meta.env.VITE_measurementId);

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
    });
  }, []);

  return null;
};

export default GAListener;
