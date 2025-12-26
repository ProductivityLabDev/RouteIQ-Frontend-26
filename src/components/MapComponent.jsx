import React, { useState, useCallback, useMemo } from 'react';
import { arrow_back_ios, BusIcon, Mapnotations, VendorMap2 } from '@/assets';
import { Button, Typography, Spinner } from '@material-tailwind/react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

/**
 * @typedef {import('@/types/maps').MapMarker} MapMarker
 * @typedef {import('@/types/maps').MapRoute} MapRoute
 * @typedef {import('./MapComponent').MapComponentProps} MapComponentProps
 */

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = { lat: 44.9778, lng: -93.2650 };

/**
 * MapComponent - Renders the real Google Map with custom UI overlays.
 * @param {MapComponentProps} props
 */
const MapComponent = ({ 
    onBack, 
    isRouteMap, 
    closeCard, 
    showCard,
    markers = [],
    routes = [],
    center = defaultCenter,
    zoom = 12
}) => {
    const [distance, setDistance] = useState(0);
    const [map, setMap] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: ['places']
    });

    const onLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
        if (markers.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            markers.forEach(m => bounds.extend(m.position));
            mapInstance.fitBounds(bounds);
        }
    }, [markers]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const renderedMarkers = useMemo(() => {
        if (!isLoaded) return null;
        return markers.map((marker) => (
            <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                icon={marker.type === 'bus' ? {
                    url: BusIcon,
                    scaledSize: new window.google.maps.Size(40, 40)
                } : undefined}
            />
        ));
    }, [markers, isLoaded]);

    const renderedRoutes = useMemo(() => {
        if (!isLoaded) return null;
        return routes.map((route) => (
            <Polyline
                key={route.id}
                path={route.path}
                options={{
                    strokeColor: route.color || '#C01824',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                }}
            />
        ));
    }, [routes, isLoaded]);

    const handleImport = () => console.log('Import button clicked');
    const handleOk = () => console.log(`OK clicked with distance: ${distance} km`);

    if (loadError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-6 text-center">
                <Typography variant="h5" color="red">Map Loading Error</Typography>
                <Typography className="mt-2 text-gray-600">Please check your API key and Cloud Console configuration.</Typography>
                <Button onClick={onBack} className="mt-4 bg-[#C01824]">Go Back</Button>
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
                    {renderedMarkers}
                    {renderedRoutes}
                </GoogleMap>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <Spinner className="h-10 w-10 text-[#C01824]" />
                    <Typography className="mt-4 text-gray-500 font-medium italic">Initializing RouteIQ Engine...</Typography>
                </div>
            )}
            
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

            {showCard && (
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                    <div className="bg-white rounded-xl shadow-2xl w-80 pointer-events-auto border border-gray-100 transform transition-all duration-300 hover:shadow-red-100">
                        <div className="p-5 relative">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">ABC</h2>
                                <button className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-200 transition-colors" onClick={closeCard}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-[#C01824] text-white p-3 gap-3 rounded-lg flex items-center justify-center mb-5 shadow-lg shadow-red-200">
                                <img src={BusIcon} className="w-6 h-6 invert" alt="Bus" />
                                <span className="font-bold text-lg">7 minutes</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Schedule</p>
                                    <p className="font-bold text-gray-800 text-base">17:00 - 00:00</p>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Contact</p>
                                    <a href="tel:+375173271045" className="text-blue-600 font-bold text-base hover:underline">+375 (17) 327-10-45</a>
                                </div>

                                <div className="pt-2 border-t border-gray-50">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Destination</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-bold text-gray-900 leading-tight">Hoover Elementary</p>
                                            <p className="text-sm text-gray-500 mt-0.5">950 Hunt Ave, WI 54956</p>
                                        </div>
                                        <button className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors pointer-events-auto">
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

            {isRouteMap && (
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 pointer-events-none">
                    <Button
                        onClick={handleImport}
                        className="px-10 py-4 bg-[#C01824] text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-xl hover:bg-[#A01520] transition-all pointer-events-auto"
                        variant='filled'
                    >
                        Import
                    </Button>
                    <div className='flex items-center justify-between bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-100 flex-grow max-w-md pointer-events-auto'>
                        <div className="flex-grow flex flex-col mr-6">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2">Distance Range</span>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="59"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                    className="flex-grow accent-[#C01824] h-1.5 rounded-lg bg-gray-200 cursor-pointer"
                                />
                                <span className="font-black text-gray-900 min-w-[45px] text-right">{distance} km</span>
                            </div>
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
