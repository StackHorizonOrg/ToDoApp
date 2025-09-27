import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

interface GeoPositionError {
  code: number;
  message: string;
}

function fetchPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 99,
        message: "La geolocalizzazione non è supportata dal browser.",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      GEOLOCATION_OPTIONS,
    );
  });
}

export function useGeoPosition() {
  const [error, setError] = useState<GeoPositionError | null>(null);

  const { data: position, isLoading } = useQuery({
    queryKey: ["userGeoPosition"],
    queryFn: async () => {
      try {
        const pos = await fetchPosition();
        setError(null);
        return pos;
      } catch (err) {
        if (err instanceof GeolocationPositionError) {
          setError({ code: err.code, message: err.message });
        } else {
          setError({ code: 99, message: "Errore sconosciuto." });
        }
        return null;
      }
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const isPermissionDenied = error?.code === 1;

  return {
    position,
    isLoading,
    error,
    isPermissionDenied,
  };
}
