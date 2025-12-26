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
}

declare const MapComponent: React.FC<MapComponentProps>;

export default MapComponent;

