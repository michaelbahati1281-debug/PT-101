import { useCallback, useState } from "react";

/* =========================================================
   useGeolocation

   Lightweight wrapper around the browser Geolocation API used
   by the "Nearest to Me" sort option. It never asks for
   location automatically — requestLocation() only runs when
   the patient explicitly chooses that sort option, matching
   normal browser permission expectations.
========================================================= */

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Location is not supported on this device.");
      return;
    }

    setStatus("loading");
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("success");
      },
      () => {
        setStatus("error");
        setError("Couldn't access your location. Check location permissions and try again.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return { coords, status, error, requestLocation };
}
