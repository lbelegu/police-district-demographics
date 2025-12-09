import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function RecenterMap({ lat, lng, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], zoom);
    }, [lat, lng, zoom, map]);
    return null;
}

export default function MapView({ city, data }) {

    const defaultCenter = { lat: 39.8283, lng: -98.5795, zoom: 4 };
    const centerLat = city ? city.lat : defaultCenter.lat;
    const centerLng = city ? city.lng : defaultCenter.lng;
    const zoomLevel = city ? 11 : defaultCenter.zoom;

    const onEachFeature = (feature, layer) => {
        const p = feature.properties;
        const popupContent = `
            <div class="text-xs">
                <h3 class="font-bold text-sm mb-1">${p.DISTRICT || "District"}</h3>
                <hr class="my-1 border-gray-300"/>
                <div class="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <span class="text-gray-600">Total Pop:</span>
                    <span class="font-semibold text-right">${p.TOTAL?.toLocaleString() ?? 0}</span>
                    <span class="text-gray-600">White:</span>
                    <span class="font-semibold text-right">${p.WHITE_PCT ? (p.WHITE_PCT * 100).toFixed(1) + '%' : p.WHITE}</span>
                    <span class="text-gray-600">Black:</span>
                    <span class="font-semibold text-right">${p.BLACK_PCT ? (p.BLACK_PCT * 100).toFixed(1) + '%' : p.BLACK}</span>
                    <span class="text-gray-600">Hispanic:</span>
                    <span class="font-semibold text-right">${p.HISPANIC_PCT ? (p.HISPANIC_PCT * 100).toFixed(1) + '%' : p.HISPANIC}</span>
                    <span class="text-gray-600">Asian:</span>
                    <span class="font-semibold text-right">${p.ASIAN_PCT ? (p.ASIAN_PCT * 100).toFixed(1) + '%' : p.ASIAN}</span>
                </div>
            </div>
        `;
        layer.bindPopup(popupContent, { minWidth: 180, maxWidth: 250 });
    };

    return (
        <MapContainer
            center={[centerLat, centerLng]}
            zoom={zoomLevel}
            style={{ height: "600px", width: "100%" }}
            minZoom={4}
        >
            <RecenterMap lat={centerLat} lng={centerLng} zoom={zoomLevel} />

            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {data && city && (
                <GeoJSON
                    key={city.id}
                    data={data}
                    onEachFeature={onEachFeature}
                    style={() => ({
                        color: "#1e3a8a",
                        weight: 2,
                        fillColor: "#3b82f6",
                        fillOpacity: 0.2,
                    })}
                />
            )}
        </MapContainer>
    );
}