/**
 * Core coordinate structure
 */
export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Represents a student pickup/dropoff point on the map
 */
export interface MapMarker {
  id: string | number;
  position: LatLng;
  title: string;
  type: 'student' | 'school' | 'bus' | 'stop';
  details?: {
    name?: string;
    address?: string;
    phone?: string;
    status?: string;
    time?: string;
  };
}

/**
 * Represents a route line on the map
 */
export interface MapRoute {
  id: string | number;
  path: LatLng[];
  color: string;
  stops: MapMarker[];
}

/**
 * State for real-time tracking
 */
export interface BusTrackingState {
  busId: string | number;
  currentPosition: LatLng;
  nextStopId: string | number;
  etaMinutes: number;
  speed: number; // For Roads API phase
}

