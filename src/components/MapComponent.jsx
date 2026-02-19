import React, { useEffect, useState, useCallback, useMemo } from "react";
import { arrow_back_ios, BusIcon, Mapnotations, locationicon } from "@/assets";
import { Button, Typography, Spinner } from "@material-tailwind/react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  PolylineF,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 44.9778, lng: -93.2650 };
const GOOGLE_LIBRARIES = ["places"];

/**
 * ✅ Uber-style MapComponent (correct approach):
 *
 * 1. ONE Google Directions request only:
 *    - origin = first stop
 *    - destination = last stop
 *    - waypoints = all middle stops (pickup points)
 *    - optimizeWaypoints: true for best order
 *
 * 2. Single polyline from Google response:
 *    - Use overview_path (or combined legs) → one path only
 *    - Draw ONLY this one polyline on the map
 *
 * 3. No extra lines:
 *    - Saare stops ke liye sirf markers (pins) — unke beech koi extra lines nahi
 *    - routes prop is NOT used in route-map mode (parent passes routes=[])
 */
const MapComponent = ({
  onBack,
  isRouteMap,
  closeCard,
  showCard,
  markers = [],
  routes = [],
  center = defaultCenter,
  zoom = 12,
  distanceKm,
  durationMinutes,
  cardTitle,
  scheduleText,
  contactText,
  contactPhone,
  destinationName,
  destinationAddress,
  destinationLatLng,
}) => {
  const [distance, setDistance] = useState(0);
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [directionsResult, setDirectionsResult] = useState(null);
  const [animatedPath, setAnimatedPath] = useState([]);
  const [drawCount, setDrawCount] = useState(0);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_LIBRARIES,
  });

  // ✅ Make stopPoints tolerant:
  // Your markers can be: stop OR pickup/drop, etc.
  const stopPoints = useMemo(() => {
    if (!Array.isArray(markers)) return [];
    return markers
      .filter((m) => {
        if (!m?.position) return false;
        const t = (m.type || "").toLowerCase();
        return t === "stop" || t === "pickup" || t === "drop" || t === "dropoff";
      })
      .slice()
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [markers]);

  const onLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);

      // fit bounds for markers (basic)
      if (markers.length > 0 && window.google?.maps?.LatLngBounds) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach((m) => m?.position && bounds.extend(m.position));
        mapInstance.fitBounds(bounds);
      }
    },
    [markers]
  );

  const onUnmount = useCallback(() => setMap(null), []);

  // ✅ Uber style: ONE Directions request — origin = first stop, destination = last stop, waypoints = baaki sab stops
  useEffect(() => {
    if (!isLoaded) return;
    if (!window.google?.maps?.DirectionsService) return;

    if (!isRouteMap || stopPoints.length < 2) {
      setDirectionsResult(null);
      return;
    }

    let cancelled = false;
    const service = new window.google.maps.DirectionsService();

    const origin = stopPoints[0].position;                                    // first stop
    const destination = stopPoints[stopPoints.length - 1].position;            // last stop
    const waypoints = stopPoints.slice(1, -1).map((p) => ({                   // baaki sab (pickup points)
      location: p.position,
      stopover: true,
    }));

    service.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,   // best order ke liye
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (cancelled) return;

        if (status === "OK" && result) {
          setDirectionsResult(result);
        } else {
          console.warn("Directions request failed:", status);
          setDirectionsResult(null);
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isRouteMap, stopPoints]);

  // Single polyline from Google response: overview_path (combined legs) — sirf ye ek path, koi extra lines nahi
  useEffect(() => {
    if (!directionsResult?.routes?.length) {
      setAnimatedPath([]);
      return;
    }
    const firstRoute = directionsResult.routes[0];
    const overview = firstRoute.overview_path || [];
    if (!overview.length) {
      setAnimatedPath([]);
      return;
    }
    const path = overview.map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
    setAnimatedPath(path);
  }, [directionsResult]);

  // ✅ Filled route animation
  useEffect(() => {
    if (!animatedPath?.length) return;

    let i = 0;
    let raf;

    const step = () => {
      i = Math.min(i + 2, animatedPath.length); // speed: 2 points/frame
      setDrawCount(i);
      if (i < animatedPath.length) raf = requestAnimationFrame(step);
    };

    setDrawCount(0);
    raf = requestAnimationFrame(step);

    return () => raf && cancelAnimationFrame(raf);
  }, [animatedPath]);

  // Fit bounds to route (route-map mode)
  useEffect(() => {
    if (!map) return;
    if (!isRouteMap) return;
    if (!animatedPath?.length) return;
    if (!window.google?.maps?.LatLngBounds) return;

    const bounds = new window.google.maps.LatLngBounds();
    animatedPath.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds);
  }, [map, isRouteMap, animatedPath]);

  const renderedMarkers = useMemo(() => {
    if (!isLoaded) return null;

    return markers.map((marker) => {
      const t = (marker.type || "").toLowerCase();
      const isBus = t === "bus";
      const isStudent = t === "student";
      const isStop = t === "stop" || t === "pickup" || t === "drop" || t === "dropoff";
      const role = marker.stopRole || "mid";

      const stopIcon = isStop
        ? role === "start" || role === "end"
          ? {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#C01824",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            }
          : {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#111111",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }
        : undefined;

      const studentIcon = isStudent
        ? {
            url: locationicon,
            scaledSize: window.google?.maps?.Size ? new window.google.maps.Size(36, 36) : undefined,
            anchor: window.google?.maps?.Point ? new window.google.maps.Point(18, 36) : undefined,
          }
        : undefined;

      const icon = isBus
        ? {
            url: BusIcon,
            scaledSize: window.google?.maps?.Size ? new window.google.maps.Size(40, 40) : undefined,
          }
        : isStudent
        ? studentIcon
        : stopIcon;

      return (
        <MarkerF
          key={marker.id}
          position={marker.position}
          title={marker.title}
          icon={icon}
          onClick={() => setSelectedMarker(marker)}
        />
      );
    });
  }, [markers, isLoaded]);

  // Non-route screens (keep your old behavior)
  const renderedRoutes = useMemo(() => {
    if (!isLoaded) return null;
    return routes.map((route) => (
      <PolylineF
        key={route.id}
        path={route.path}
        options={{
          strokeColor: route.color || "#8B6B73",
          strokeOpacity: 1,
          strokeWeight: 8,
          clickable: false,
          geodesic: true,
          zIndex: 8,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    ));
  }, [routes, isLoaded]);

  const handleImport = () => console.log("Import button clicked");
  const handleOk = () => console.log(`OK clicked with distance: ${distance} km`);

  const handleOpenInGoogleMaps = () => {
    const query = destinationLatLng
      ? `${destinationLatLng.lat},${destinationLatLng.lng}`
      : (destinationAddress || destinationName || "").trim();
    if (!query) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-6 text-center">
        <Typography variant="h5" color="red">
          Map Loading Error
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Please check your API key and Cloud Console configuration.
        </Typography>
        <Button onClick={onBack} className="mt-4 bg-[#C01824]">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-100 overflow-hidden rounded-lg shadow-inner">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {/* Saare stops ke liye sirf markers (pins) — unke beech extra lines nahi */}
          {renderedMarkers}

          {/* InfoWindow popup — marker click pe chhota popup */}
          {selectedMarker && (
            <InfoWindowF
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
              options={{ pixelOffset: window.google?.maps?.Size ? new window.google.maps.Size(0, -40) : undefined }}
            >
              <div className="min-w-[160px] max-w-[220px] text-sm font-sans">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                  <div className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        (selectedMarker.type || "").toLowerCase() === "pickup" ? "#16a34a" :
                        (selectedMarker.type || "").toLowerCase() === "dropoff" ? "#dc2626" : "#2563eb"
                    }}
                  />
                  <span className="font-bold text-gray-900 text-[13px] leading-tight">{selectedMarker.title}</span>
                </div>
                {selectedMarker.type && (
                  <p className="text-gray-500 text-[11px] mb-1 capitalize">
                    {selectedMarker.type === "pickup" ? "Pickup Location" :
                     selectedMarker.type === "dropoff" ? "Drop-off Location" :
                     selectedMarker.type === "student" ? "Student Stop" : selectedMarker.type}
                  </p>
                )}
                <div className="bg-[#C01824] text-white rounded-md px-2 py-1 flex items-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className="text-[11px] font-bold">
                    {typeof durationMinutes === "number" ? `Est. ${durationMinutes} min` : "Estimated time N/A"}
                  </span>
                </div>
                {selectedMarker.position && (
                  <p className="text-gray-400 text-[10px] mt-1">
                    {Number(selectedMarker.position.lat).toFixed(5)}, {Number(selectedMarker.position.lng).toFixed(5)}
                  </p>
                )}
              </div>
            </InfoWindowF>
          )}

          {/* Route-map: sirf ek polyline (overview_path), koi manual/extra routes nahi */}
          {isRouteMap ? (
            directionsResult ? (
              <>
                <DirectionsRenderer
                  directions={directionsResult}
                  options={{
                    suppressMarkers: true,
                    preserveViewport: true,
                    polylineOptions: { strokeOpacity: 0 },
                  }}
                />

                {/* Ek hi polyline — Google overview_path */}
                {animatedPath.length > 0 && (
                  <PolylineF
                    path={animatedPath}
                    options={{
                      strokeColor: "#8B6B73",
                      strokeOpacity: 0.25,
                      strokeWeight: 8,
                      clickable: false,
                      zIndex: 9,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                    }}
                  />
                )}

                {/* Filled route */}
                {animatedPath.length > 0 && (
                  <PolylineF
                    path={animatedPath.slice(0, drawCount)}
                    options={{
                      strokeColor: "#8B6B73",
                      strokeOpacity: 1,
                      strokeWeight: 8,
                      clickable: false,
                      zIndex: 10,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                    }}
                  />
                )}
              </>
            ) : null
          ) : (
            renderedRoutes
          )}
        </GoogleMap>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner className="h-10 w-10 text-[#C01824]" />
          <Typography className="mt-4 text-gray-500 font-medium italic">
            Initializing RouteIQ Engine...
          </Typography>
        </div>
      )}

      {/* Top Buttons */}
      <div className="absolute top-0 left-0 right-0 flex flex-row justify-between items-center p-4 pointer-events-none">
        <img
          src={arrow_back_ios}
          className="z-10 cursor-pointer pointer-events-auto hover:scale-110 transition-transform"
          alt="Back Arrow"
          onClick={onBack}
        />
        <img
          src={Mapnotations}
          className="z-20 cursor-pointer pointer-events-auto hover:scale-105 transition-transform"
          alt="Map Notations"
          onClick={onBack}
        />
      </div>

      {/* Card */}
      {showCard && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl w-80 pointer-events-auto border border-gray-100 transform transition-all duration-300 hover:shadow-red-100">
            <div className="p-5 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {cardTitle || "Route"}
                </h2>
                <button
                  className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-200 transition-colors"
                  onClick={closeCard}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="bg-[#C01824] text-white p-3 gap-3 rounded-lg flex items-center justify-center mb-5 shadow-lg shadow-red-200">
                <img src={BusIcon} className="w-6 h-6 invert" alt="Bus" />
                <span className="font-bold text-lg">
                  {typeof durationMinutes === "number" ? `${durationMinutes} minutes` : "7 minutes"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Schedule</p>
                  <p className="font-bold text-gray-800 text-base">{scheduleText || "—"}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Contact</p>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {contactText ? (
                        <p className="text-gray-900 font-bold text-base truncate">{contactText}</p>
                      ) : null}

                      {contactPhone ? (
                        <a
                          href={`tel:${contactPhone}`}
                          className="text-sky-600 font-bold text-base hover:underline break-all"
                        >
                          {contactPhone}
                        </a>
                      ) : !contactText ? (
                        <p className="text-gray-800 font-bold text-base">—</p>
                      ) : null}
                    </div>

                    {contactPhone ? (
                      <button
                        type="button"
                        className="shrink-0 h-9 w-9 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-md pointer-events-auto"
                        onClick={() => window.open(`tel:${contactPhone}`)}
                        title="Call"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.81.3 1.6.54 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.72-1.06a2 2 0 0 1 2.11-.45c.76.24 1.55.42 2.36.54A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Destination</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">{destinationName || "—"}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{destinationAddress || "—"}</p>
                    </div>
                    <button
                      className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors pointer-events-auto"
                      onClick={handleOpenInGoogleMaps}
                      title="Open in Google Maps"
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      {isRouteMap && (
        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 pointer-events-none">
          <Button
            onClick={handleImport}
            className="px-10 py-4 bg-[#C01824] text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-xl hover:bg-[#A01520] transition-all pointer-events-auto"
            variant="filled"
          >
            Import
          </Button>

          <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-100 flex-grow max-w-md pointer-events-auto">
            <div className="flex-grow flex flex-col mr-6">
              <span className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2">
                Distance Range
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="59"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="flex-grow accent-[#C01824] h-1.5 rounded-lg bg-gray-200 cursor-pointer"
                />
                <span className="font-black text-gray-900 min-w-[45px] text-right">
                  {distance} km
                </span>
              </div>

              {typeof distanceKm === "number" && typeof durationMinutes === "number" ? (
                <div className="mt-2 text-xs font-bold text-gray-600">
                  Route: {distanceKm.toFixed(2)} km • {durationMinutes} min
                </div>
              ) : null}
            </div>

            <Button
              onClick={handleOk}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-2.5 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all"
            >
              Ok
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
