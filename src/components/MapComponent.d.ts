import React from 'react';
import { MapMarker, MapRoute } from '@/types/maps';

export interface MapComponentProps {
  onBack: () => void;
  isRouteMap?: boolean;
  closeCard?: () => void;
  showCard?: boolean;
  markers?: MapMarker[];
  routes?: MapRoute[];
  center?: { lat: number; lng: number };
  zoom?: number;
  distanceKm?: number;
  durationMinutes?: number;
  cardTitle?: string | null;
  scheduleText?: string | null;
  contactText?: string | null;
  contactPhone?: string | null;
  destinationName?: string | null;
  destinationAddress?: string | null;
  destinationLatLng?: { lat: number; lng: number } | null;
}

declare const MapComponent: React.FC<MapComponentProps>;

export default MapComponent;

