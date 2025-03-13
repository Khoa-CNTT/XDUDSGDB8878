import React, {useRef, useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {appInfo} from "../../constants/appInfos";
import L from 'leaflet';
import handleAPINotToken from "../../apis/handleAPINotToken";

const customIcon = new L.Icon({
    iconUrl: appInfo.vitri4,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
});
const LeafLetMapComponent = ({buildingLocation, currentLocation}) => {
    const lat = parseFloat(buildingLocation?.latitude);
    const lon = parseFloat(buildingLocation?.longitude);

    useEffect(() => {
        console.log(currentLocation);
    }, [currentLocation]);

    if (isNaN(lat) || isNaN(lon)) {
        return <p>Không thể hiển thị bản đồ do dữ liệu không hợp lệ.</p>;
    }

    return (
        <div>
            <h4 style={{marginBottom: '10px', textAlign: 'start'}}>Vị trí của tòa nhà trên bản đồ</h4>
            <MapContainer
                center={[lat, lon]}
                zoom={20}
                style={{
                    height: '350px',
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
                <Marker position={[lat, lon]} icon={customIcon}>
                    <Popup>
                        Vị trí của tòa nhà: [{lat}, {lon}]
                    </Popup>
                </Marker>
                <ZoomControl position="topright"/>
                <ScaleControl position="bottomleft"/>
            </MapContainer>
        </div>

    );
};

export default LeafLetMapComponent;