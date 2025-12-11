import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

function RecenterMap({ lat, lng, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], zoom);
    }, [lat, lng, zoom, map]);
    return null;
}

export default function MapView({ city, data }) {
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const defaultCenter = { lat: 39.8283, lng: -98.5795, zoom: 4 };
    const centerLat = city ? city.lat : defaultCenter.lat;
    const centerLng = city ? city.lng : defaultCenter.lng;
    const zoomLevel = city ? 11 : defaultCenter.zoom;

    useEffect(() => {
        setSelectedDistrict(null);
    }, [city]);

    const getStyle = (feature) => {
        const isSelected = selectedDistrict && feature.properties.DISTRICT === selectedDistrict.DISTRICT;

        return {
            color: isSelected ? "#000000" : "#1e3a8a",
            weight: isSelected ? 2 : 1,
            // fillColor: isSelected ? "#fbbf24" : "#3b82f6",
            fillColor: isSelected ? "#0f3a81ff" : "#3b82f6",
            fillOpacity: isSelected ? 0.6 : 0.2,
        };
    };

    const onEachFeature = (feature, layer) => {
        const p = feature.properties;

        layer.on({
            click: (e) => {
                // stop the click from hitting the map background
                e.originalEvent.stopPropagation();
                setSelectedDistrict(p);
            }
        });
    };

    return (
        <div className="relative h-[600px] w-full">

            <MapContainer
                center={[centerLat, centerLng]}
                zoom={zoomLevel}
                style={{ height: "100%", width: "100%" }}
                minZoom={4}
            >
                <RecenterMap lat={centerLat} lng={centerLng} zoom={zoomLevel} />

                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {data && city && (
                    <GeoJSON
                        key={city.id}
                        data={data}
                        onEachFeature={onEachFeature}
                        style={getStyle}
                    />
                )}
            </MapContainer>

            {selectedDistrict && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-300 shadow-lg p-4 z-[1000] transition-transform duration-300 ease-in-out">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

                        <div className="border-b sm:border-b-0 sm:border-r border-gray-300 pb-2 sm:pb-0 sm:pr-6 text-center sm:text-left">
                            <h3 className="text-gray-500 text-xs uppercase font-bold tracking-wider">Selected District</h3>
                            <div className="text-2xl font-bold text-gray-900">{selectedDistrict.DISTRICT}</div>
                            <div className="text-sm text-gray-600 mt-1">
                                Total Pop: <span className="font-semibold text-gray-900">{selectedDistrict.TOTAL?.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 w-full sm:w-auto">
                            <StatBox label="White" value={selectedDistrict.WHITE} pct={selectedDistrict.WHITE_PCT} color="bg-pink-100 text-pink-800" />
                            <StatBox label="Black" value={selectedDistrict.BLACK} pct={selectedDistrict.BLACK_PCT} color="bg-purple-100 text-purple-800" />
                            <StatBox label="Hispanic" value={selectedDistrict.HISPANIC} pct={selectedDistrict.HISPANIC_PCT} color="bg-orange-100 text-orange-800" />
                            <StatBox label="Asian" value={selectedDistrict.ASIAN} pct={selectedDistrict.ASIAN_PCT} color="bg-green-100 text-green-800" />
                        </div>
                    </div>

                    <button
                        onClick={() => setSelectedDistrict(null)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            )}
        </div>
    );
}

// helper component for the little colored boxes
function StatBox({ label, value, pct, color }) {
    return (
        <div className={`rounded-lg p-2 ${color} flex flex-col items-center justify-center`}>
            <span className="text-xs font-semibold opacity-75 uppercase">{label}</span>
            <span className="text-lg font-bold">
                {pct ? (pct * 100).toFixed(1) + '%' : value}
            </span>
        </div>
    );
}