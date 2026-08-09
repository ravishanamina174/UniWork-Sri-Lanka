"use client";

import { Map, Marker } from "pigeon-maps";
import { useState, useEffect } from "react";

interface TaskMapProps {
  // MongoDB GeoJSON coordinates format: [longitude, latitude]
  coordinates?: [number, number];
}

export default function TaskMap({ coordinates }: TaskMapProps) {
  // NEW: Add a mounted state to prevent SSR hydration mismatches
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fallback to Pelmadulla coordinates if none provided
  const lat = coordinates && coordinates.length === 2 ? coordinates[1] : 6.6191;
  const lng = coordinates && coordinates.length === 2 ? coordinates[0] : 80.5234;

  // NEW: Return a skeleton/placeholder while rendering on the server
  if (!isMounted) {
    return (
      <div className="absolute inset-0 z-0 bg-slate-100/50 animate-pulse flex items-center justify-center">
         {/* Optional: Add a subtle loading indicator while map mounts */}
      </div>
    );
  }

  // Once mounted on the client, render the actual map safely
  return (
    <div className="absolute inset-0 z-0">
      <Map 
        defaultCenter={[lat, lng]} 
        defaultZoom={15}
        metaWheelZoom={true} // Safe to use now!
      >
        <Marker 
          width={40} 
          anchor={[lat, lng]} 
          color="#EF4444" 
        />
      </Map>
    </div>
  );
}