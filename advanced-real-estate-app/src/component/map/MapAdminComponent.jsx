import React, {useEffect, useState} from 'react';
import handleAPINotToken from "../../apis/handleAPINotToken";
import {MapContainer, Marker, Popup, ScaleControl, TileLayer, ZoomControl, useMap} from "react-leaflet";
import L from "leaflet";
import {appInfo} from "../../constants/appInfos";
import {Button, message} from "antd";
import styles from '../../assets/css/map.module.css'
import {add} from "../../redux/reducers/chatReducer";

const customIcon = new L.Icon({
    iconUrl: appInfo.vitri4,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
});

const MapUpdater = ({ position }) => {
    const map = useMap();

    React.useEffect(() => {
        if (position.lat !== 0 && position.lon !== 0) {
            map.setView([position.lat, position.lon], 18, { animate: true });
        }
    }, [position, map]);

    return null;
};

const MapAdminComponent = () => {
    const [position, setPosition] = useState({
            lat: 16.068, lon: 108.212 ,
            display_name: ''
        }
    );
    const [currentLocation, setCurrentLocation] = useState(null);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    handleAPINotToken(
                        `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
                        {},
                        'GET'
                    ).then(res => {
                        setCurrentLocation({
                            ...res,
                        });
                        setPosition({
                            lat: parseFloat(position.coords.latitude),
                            lon: parseFloat(position.coords.longitude),
                            display_name: `Địa chỉ hiện tại của bạn: ${res?.display_name}`
                        });
                    });
                },
                (error) => {
                    console.log("Error getting location: " + error.message);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleSearch = async () => {
        try {
            const data = await handleAPINotToken(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
                {},
                'GET'
            );
            // console.log(data);
            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];
                setPosition({
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    display_name: `Địa chỉ: ${display_name}`
                });
            } else {
                message.error("Không tìm thấy vị trí!");
                console.log("Không tìm thấy vị trí!");
            }
        } catch (error) {
            message.error('Lỗi khi tìm kiếm địa chỉ:', error);
            console.error('Lỗi khi tìm kiếm địa chỉ:', error);
        }
    };

    return (
        <div>
            <h4 className={styles.searchTitle}>Tìm kiếm vị trí tòa nhà trên bản đồ</h4>
            <p>
                Địa chỉ hiện tại của bạn: {currentLocation?.display_name}
            </p>
            <p>
                Vĩ độ hiện tại của bạn: {currentLocation?.lat}
            </p>
            <p>
                Kinh độ hiện tại của bạn: {currentLocation?.lon}
            </p>
            <div className={styles.searchContainer}>
                <div className={`${styles.searchContent}`}>
                    <b>{'Nội dung bạn tìm kiếm: ' + address}</b>
                </div>

                <input
                    className={styles.inputSearch}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ"
                />
                <Button className={styles.buttonSearch} onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </div>

            <MapContainer
                center={[position.lat, position.lon]}
                zoom={position.lat !== 0 && position.lon !== 0 ? 20 : 2}
                style={{
                    height: '350px',
                    width: '100%',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
                zoomControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[position.lat, position.lon]} icon={customIcon}>
                    <Popup>
                        {'Vĩ độ: ' + position.lat + '\n'},
                        {'Kinh độ: ' + position.lon + '\n'}
                        {position?.display_name}
                    </Popup>
                </Marker>
                <ZoomControl position="topright"/>
                <ScaleControl position="bottomleft"/>
                <MapUpdater position={position}/>
            </MapContainer>
        </div>
    );
};


export default MapAdminComponent;