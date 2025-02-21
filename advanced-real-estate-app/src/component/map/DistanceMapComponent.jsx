import React, { useEffect, useRef } from 'react';
import {MapContainer, TileLayer, ZoomControl, ScaleControl, useMap, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { appInfo } from "../../constants/appInfos";

const RoutingControl = ({ currentLocation, buildingLocation }) => {
    const map = useMap();
    const routeControlRef = useRef(null);

    useEffect(() => {
        if (!currentLocation?.lat || !currentLocation?.lon ||
            !buildingLocation?.latitude || !buildingLocation?.longitude) {
            return;
        }
        try {
            routeControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(currentLocation.lat, currentLocation.lon),
                    L.latLng(parseFloat(buildingLocation.latitude), parseFloat(buildingLocation.longitude))
                ],
                routeWhileDragging: true,
                lineOptions: {
                    styles: [{ color: 'blue', weight: 5 }]
                },
                createMarker: () => null,
                addWaypoints: false,
                show: false
            }).addTo(map);
        } catch (error) {
            console.error("Error initializing Routing Control:", error);
        }

        return () => {
            try {
                if (routeControlRef.current) {
                    const plan = routeControlRef.current.getPlan();
                    if (plan) {
                        plan.setWaypoints([]);
                    }
                    if (map && map.hasLayer(routeControlRef.current)) {
                        map.removeControl(routeControlRef.current);
                    }
                    routeControlRef.current = null;
                }
            } catch (error) {
                console.error("Error removing Routing Control");
            }
        };
    }, [map, currentLocation, buildingLocation]);

    return null;
};

const DistanceMapComponent = ({ buildingLocation, currentLocation }) => {
    const currentLocationIcon = L.icon({
        iconUrl: appInfo.currentLocationIcon,
        iconSize: [35, 35],
        iconAnchor: [12, 41]
    });
    const buildingLocationIcon = L.icon({
        iconUrl: appInfo.vitri4,
        iconSize: [27, 37],
        iconAnchor: [12, 41]
    });

    const centerPosition = [
        currentLocation?.lat || 0,
        currentLocation?.lon || 0
    ];

    return (
        <div>
            <h4 style={{ marginBottom: '10px', textAlign: 'start' }}>Vị trí của tòa nhà trên bản đồ</h4>
            <MapContainer
                center={centerPosition}
                zoom={20}
                style={{
                    height: '500px',
                    width: '100%',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ZoomControl position="topright" />
                <ScaleControl position="bottomleft" />

                {/* Hiển thị đường đi */}
                {currentLocation?.lat && currentLocation?.lon && buildingLocation?.latitude && buildingLocation?.longitude && (
                    <RoutingControl currentLocation={currentLocation} buildingLocation={buildingLocation} />
                )}

                {currentLocation?.lat && currentLocation?.lon && (
                    <Marker position={[currentLocation.lat, currentLocation.lon]} icon={currentLocationIcon}>
                        <Popup>
                            Địa chỉ hiện tại: {currentLocation?.display_name+ ', '}
                            Vị trí của bạn: [{currentLocation.lat}, {currentLocation.lon}]
                        </Popup>
                    </Marker>
                )}
                {buildingLocation?.latitude && buildingLocation?.longitude && (
                    <Marker position={[buildingLocation.latitude, buildingLocation.longitude]} icon={buildingLocationIcon}>
                        <Popup>
                            Địa chỉ tòa nhà: {buildingLocation?.map_name+ ', '}
                            Vị trí của tòa nhà: [{buildingLocation.latitude}, {buildingLocation.longitude}]
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default DistanceMapComponent;