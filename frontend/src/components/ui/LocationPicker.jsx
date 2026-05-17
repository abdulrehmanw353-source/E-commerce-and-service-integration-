import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, LocateFixed, Loader2 } from 'lucide-react';

// ─── Fix Leaflet default marker icon (missing in bundled builds) ───
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Custom marker icon ───────────────────────────────────────
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ─── Component to programmatically fly the map to new coords ──
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

/**
 * LocationPicker — Reusable location detection + map display component.
 *
 * Props:
 * - onLocationSelect(locationData) — called when a location is detected/selected.
 *   locationData = { lat, lng, address, city, state, zip, country }
 * - initialPosition — [lat, lng] array for initial map center (optional)
 * - className — additional CSS classes for the wrapper
 */
export default function LocationPicker({ onLocationSelect, initialPosition, className = '' }) {
  const [position, setPosition] = useState(initialPosition || null);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');
  const [mapReady, setMapReady] = useState(false);

  // Reverse geocode coordinates to address using Nominatim
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await res.json();
      const addr = data.address || {};

      const street = [addr.road, addr.house_number, addr.neighbourhood, addr.suburb]
        .filter(Boolean)
        .join(', ') || data.display_name?.split(',').slice(0, 2).join(',') || '';

      const locationData = {
        lat,
        lng,
        address: street,
        city: addr.city || addr.town || addr.village || addr.county || '',
        state: addr.state || addr.state_district || '',
        zip: addr.postcode || '',
        country: addr.country || '',
        displayName: data.display_name || '',
      };

      return locationData;
    } catch {
      return { lat, lng, address: '', city: '', state: '', zip: '', country: '', displayName: '' };
    }
  }, []);

  const handleDetectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setDetecting(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPosition = [latitude, longitude];
        setPosition(newPosition);
        setMapReady(true);

        // Reverse geocode and notify parent
        const locationData = await reverseGeocode(latitude, longitude);
        onLocationSelect?.(locationData);
        setDetecting(false);
      },
      (err) => {
        setDetecting(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please allow location permission in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An unknown error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [onLocationSelect, reverseGeocode]);

  // Default map center (Pakistan center if no position)
  const defaultCenter = [30.3753, 69.3451];
  const mapCenter = position || defaultCenter;
  const mapZoom = position ? 16 : 5;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Choose Current Location Button */}
      <button
        type="button"
        onClick={handleDetectLocation}
        disabled={detecting}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl border border-[#7a5cff]/30 bg-[#7a5cff]/10 hover:bg-[#7a5cff]/20 disabled:opacity-60 transition-all text-[14px] font-semibold text-[#c5b8ff]"
      >
        {detecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            Detecting your location…
          </>
        ) : (
          <>
            <LocateFixed className="w-4 h-4" strokeWidth={2} />
            Choose Current Location
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-[#ff5e7d]/10 border border-[#ff5e7d]/20">
          <MapPin className="w-4 h-4 text-[#ff5e7d] flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[12px] text-[#ff9aad]">{error}</p>
        </div>
      )}

      {/* Map */}
      {mapReady && position && (
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg" style={{ height: 240 }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            zoomControl={true}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={position} icon={customIcon} />
            <FlyToLocation position={position} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
