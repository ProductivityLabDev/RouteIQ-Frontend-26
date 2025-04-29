import React, { memo, useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function MapComponent() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    apiKey: '6483-9609-3832',
  });

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [allMarkersLoaded, setAllMarkersLoaded] = useState(false);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          position: {
            lat: center.lat + Math.random() * 0.01 - 0.005,
            lng: center.lng + Math.random() * 0.01 - 0.005,
          },
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (map && allMarkersLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.position));
      map.fitBounds(bounds);
      map.setZoom(10);
    }
  }, [map, markers, allMarkersLoaded]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
        />
      ))}
    </GoogleMap>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>Loading maps...</div>
  );
}

export default memo(MapComponent);
