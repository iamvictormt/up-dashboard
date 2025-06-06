import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: '/pin.svg', // Ou um CDN válido
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapInnerProps {
  coords: [number, number];
}

export default function MapInner({ coords }: MapInnerProps) {
  return (
    <MapContainer
      center={coords}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '320px', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords} icon={markerIcon}>
        <Popup>Local aproximado</Popup>
      </Marker>
    </MapContainer>
  );
}
