/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { appInfo } from '../../constants/appInfos';
import 'leaflet-control-geocoder';  // Import leaflet-control-geocoder
import Toast from '../../config/ToastConfig';
import handleAPI from '../../apis/handlAPI';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import { Bag, Eye, EyeSlash, Setting2 } from 'iconsax-react';
import { Button, Checkbox, Dropdown, Space } from 'antd';
const MapScreen = () => {
    const [userLocation, setUserLocation] = useState(null); // Tọa độ người dùng
    const [selectedLocation, setSelectedLocation] = useState(null); // Tọa độ người dùng chọn
    const [address, setAddress] = useState(""); // Địa chỉ khi tìm kiếm
    const [nameMap, setNameMap] = useState(""); // Địa chỉ khi tên map
    const [ward, setWard] = useState(""); // Phường
    const [district, setDistrict] = useState(""); // Huyện
    const [province, setProvince] = useState(""); // Tỉnh
    const [lat, setLat] = useState(""); // Vĩ độ
    const [lon, setLon] = useState(""); // Kinh độ
    const auth = useSelector(authSelector);
    const [dataMap, setDataMap] = useState([]);
    const [listCheckBox, setListCheckBox] = useState([]);
    const [activeRow, setActiveRow] = useState(null);
    const [selectedShowLocation, setSelectedShowLocation] = useState(null);
    const [selectedShowLocationUpdate, setSelectedShowLocationUpdate] = useState(null);

    const [center, setCenter] = useState([14.0583, 108.2772]); // Lưu trữ vị trí trung tâm bản đồ
    const [centerUpdate, setCenterUpdate] = useState([14.0583, 108.2772]); // Lưu trữ vị trí trung tâm bản đồ
    const [zoom, setZoom] = useState(5); // Lưu trữ mức độ zoom

    const [updateMap, setUpdateMap] = useState({});
    const [updateAddress, setUpdateAddress] = useState(""); // Địa chỉ khi tìm kiếm
    const [updateNameMap, setUpdateNameMap] = useState(""); // Địa chỉ khi tên map
    const [updateWard, setUpdateWard] = useState(""); // Phường
    const [updateDistrict, setUpdateDistrict] = useState(""); // Huyện
    const [updateProvince, setUpdateProvince] = useState(""); // Tỉnh
    const [updateLat, setUpdateLat] = useState(""); // Vĩ độ
    const [updateLon, setUpdateLon] = useState(""); // Kinh độ
    // Lấy vị trí hiện tại của người dùng khi component được mount
    useEffect(() => {
        GetData();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                    setSelectedShowLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Lỗi khi lấy vị trí người dùng: ", error);
                }
            );
        } else {
            console.error("Trình duyệt không hỗ trợ Geolocation.");
        }
    }, []);
    // Hàm chung để gọi API và cập nhật thông tin địa chỉ
    const fetchAddress = (lat, lng) => {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then((response) => response.json())
            .then((data) => {
                if (data.address) {
                    setAddress(data.display_name || "");
                    setWard(data.address.quarter || data.address.town || "");
                    setDistrict(data.address.county || data.address.district || data.address.suburb ||"");
                    setProvince(data.address.state || data.address.city || "");
                    setLat(lat);
                    setLon(lng);
                }
            })
            .catch((error) => console.error("Lỗi khi lấy thông tin địa chỉ:", error));
    };

    
    // Hàm xử lý khi người dùng click vào bản đồ
    const handleMapClick = (e) => {
        console.log(e.latlng);
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]);
        fetchAddress(lat, lng);
    };

    //Render map lên
    const ShowMapWrapper = () => {
        const map = useMap();
        useMapEvents({
            click: handleMapClick
        });
        useEffect(() => {
            // Xóa attribution của OpenStreetMap
            map.attributionControl.remove();
           
            const handleModalShown = () => {
                map.invalidateSize(); // Cập nhật lại kích thước của bản đồ khi modal mở
            };
    
            // Lắng nghe sự kiện mở modal
            const modalElement = document.getElementById('themMoiModal');
            modalElement?.addEventListener('shown.bs.modal', handleModalShown);
    
            // Cleanup để tránh rò rỉ bộ nhớ
            return () => {
                modalElement?.removeEventListener('shown.bs.modal', handleModalShown);
            };
        }, [map]);

        return null;
    };

    // Hàm để phóng to vào vị trí đã chọn
    const showMap = (key, location) => {
        setActiveRow(key); // Đặt active row
        setSelectedShowLocation([location.latitude, location.longitude]); // Lưu trữ vị trí đã chọn
        setCenter([location.latitude, location.longitude]); // Cập nhật center để di chuyển bản đồ
        setZoom(20); // Đặt mức độ zoom khi phóng to vào vị trí
    };

    // Hàm để quay lại vị trí người dùng
    const hiddenMap = () => {
        setActiveRow(null); // Reset active row
        setSelectedShowLocation(userLocation); // Quay lại vị trí người dùng
        setCenter(userLocation); // Cập nhật center về vị trí người dùng
        setZoom(5); // Quay lại zoom level ban đầu
    };

    //Thêm mới map
    const CreateMap = async () => {
        try {
            const payload = {
                map_name: nameMap,
                latitude: lat,
                longitude: lon,
                address: address,
                province: province,
                district: district,
                ward: ward
            }

            console.log(payload);
            
            const url = `/api/admin/maps`;
            const res = await handleAPI(url, payload, "post", auth?.token);
            if(res.status === 200) {
                Toast("success", res.message);
                window.$("#themMoiModal").modal('hide');
                GetData();
                setAddress("");
                setDistrict("");
                setLat("");
                setLon("");
                setNameMap("");
                setProvince("");
                setWard("");
            }
        } catch (error) {
            Toast("error", error.message)            
        }
    }

    //Get data
    const GetData = async () => {
        try {
            const url = `/api/admin/maps`;
            const res = await handleAPI(url, {}, "get", auth?.token);
            setDataMap(res.data);
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const handlDeleteBuilding = async () => {
        const url = `/api/admin/maps`;
        const object = {
            ids : listCheckBox
        }
        try {
            const res = await handleAPI(url, object, "delete", auth?.token)
            console.log(res.status);
            
            if(res.status === 200) {
                Toast("success", res.message);
                GetData();
                setListCheckBox([]);
                window.$('#deleteModal').modal('hide');
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const ShowMapUpdateWrapper = () => {
        const map = useMap();
        const fetchAddressUpdate = (lat, lng) => {
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.address) {
                        setUpdateAddress(data.display_name || "");
                        setUpdateWard(data.address.quarter || data.address.town || "");
                        setUpdateDistrict(data.address.county || data.address.district || data.address.suburb ||"");
                        setUpdateProvince(data.address.state || data.address.city || "");
                        setUpdateLat(lat);
                        setUpdateLon(lng);
                    }
                })
                .catch((error) => console.error("Lỗi khi lấy thông tin địa chỉ:", error));
        };
        
        // Hàm xử lý sự kiện click trên bản đồ
        const handleMapUpdateClick = (e) => {
            const { lat, lng } = e.latlng;  // Lấy tọa độ từ sự kiện click
            setSelectedShowLocationUpdate([lat, lng]);  // Cập nhật vị trí marker
            setCenterUpdate([lat, lng]);  // Cập nhật vị trí trung tâm bản đồ
            fetchAddressUpdate(lat, lng);
        };
    
        useMapEvents({
            click: handleMapUpdateClick,  // Bắt sự kiện click trên bản đồ
        });
    
        useEffect(() => {
            map.attributionControl.remove();  // Xóa attribution của OpenStreetMap
    
            // Đảm bảo rằng bản đồ được làm mới khi có sự thay đổi
            const handleModalShown = () => {
                map.invalidateSize();  // Cập nhật lại kích thước của bản đồ khi modal mở
                map.setView(centerUpdate, 17); // Di chuyển bản đồ đến vị trí mới với zoom = 17
            };
    
            const modalElement = document.getElementById('EditModal');
            modalElement?.addEventListener('shown.bs.modal', handleModalShown);
    
            // Cleanup để tránh rò rỉ bộ nhớ
            return () => {
                modalElement?.removeEventListener('shown.bs.modal', handleModalShown);
            };
        }, [map, centerUpdate]);  // Cập nhật lại khi centerUpdate thay đổi
    
        return null;
    };
    
    
    const handleEditButtonClick = (value) => {
        // Cập nhật state
        setCenterUpdate([value.latitude, value.longitude]);
        setUpdateMap({
            id : value.id,
            map_name:value.map_name
        });
        setUpdateAddress(value.address);
        setUpdateWard(value.ward);
        setUpdateDistrict(value.district);
        setUpdateProvince(value.province);
        setUpdateLat(value.latitude);
        setUpdateLon(value.longitude);
        setSelectedShowLocationUpdate([value.latitude, value.longitude])
    }

    //cập nhật
    const UpdateMap = async() => {
        try {
            const url = `/api/admin/maps/${updateMap.id}`;
            const payload = {
                map_name: updateMap.map_name,
                latitude: updateLat,
                longitude: updateLon,
                address: updateAddress,
                province: updateProvince,
                district: updateDistrict,
                ward: updateWard
            }
            console.log(payload);
            const res = await handleAPI(url, payload, "patch", auth?.token);
            if(res.status === 200) {
                Toast("success", res.message);
                window.$("#EditModal").modal('hide');
                setUpdateMap({});
                GetData();
            }
        } catch (error) {
            Toast("error", error.message)
        }
    }
    useEffect(() => {
        if (updateMap.latitude && updateMap.longitude) {
            // Khi cập nhật map thành công, điều chỉnh lại tọa độ
            setCenterUpdate([updateMap.latitude, updateMap.longitude]);
            setSelectedShowLocationUpdate([updateMap.latitude, updateMap.longitude]);
        }
    }, [updateMap]); // Dùng useEffect để cập nhật khi updateMap thay đổi
    return (
        <>
            <div className="row">
                <div className="col-5">
                    <div className="card">
                        <div className="card-body">
                            <MapContainer
                                key={center.join(',')}
                                center={center} // Sử dụng state center để điều khiển vị trí
                                zoom={zoom} // Sử dụng state zoom để điều khiển mức độ zoom
                                style={{ height: '620px', width: '100%' }} // Kích thước của bản đồ
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {(userLocation || selectedShowLocation) && (
                                    <Marker
                                        position={selectedShowLocation || userLocation}
                                        icon={L.icon({
                                            iconUrl: appInfo.currentLocationIcon,
                                            iconSize: [35, 35],
                                            iconAnchor: [17, 35]
                                        })}
                                    />
                                )}
                            </MapContainer>
                        </div>
                    </div>
                </div>
                <div className="col-7">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='p-2 bd-highlight'>
                                    Danh Sách Map
                                </div>
                                <div className='p-2 bd-highlight'>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#themMoiModal"
                                    >
                                        Thêm Mới
                                    </button>

                                    <div className="modal fade" id="themMoiModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-xl">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">Thêm Mới Map</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="card">
                                                                <div className="card-header">
                                                                    <MapContainer
                                                                        center={[14.0583, 108.2772]} // Tọa độ trung tâm Việt Nam
                                                                        zoom={5} // Độ zoom phù hợp để hiển thị toàn bộ lãnh thổ
                                                                        style={{ height: '620px', width: '100%' }} // Kích thước của bản đồ
                                                                    >
                                                                        <TileLayer
                                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                                        />
                                                                        <ShowMapWrapper/>
                                                                        {selectedShowLocation && (
                                                                            <Marker
                                                                                position={selectedShowLocation} // Vị trí đã click
                                                                                icon={L.icon({
                                                                                    iconUrl: appInfo.currentLocationIcon,
                                                                                    iconSize: [35, 35],
                                                                                    iconAnchor: [17, 35] 
                                                                                })}
                                                                            />
                                                                        )}
                                                                    </MapContainer>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Tên Map</label>
                                                                            <input type="text" className='form-control'
                                                                                value={nameMap}
                                                                                onChange={(e) => {
                                                                                    setNameMap(e.target.value)
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Địa Chỉ</label>
                                                                            <input type="text" className='form-control' value={address} readOnly/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row mt-2">
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Phường / Thị Trấn</label>
                                                                            <input type="text" className='form-control' value={ward} readOnly/>
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Quận / Huyện</label>
                                                                            <input type="text" className='form-control' value={district} readOnly/>
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Tỉnh</label>
                                                                            <input type="text" className='form-control' value={province} readOnly/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row mt-2">
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Kinh Độ</label>
                                                                            <input type="text" className='form-control' value={lon} readOnly/>
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Vĩ Độ</label>
                                                                            <input type="text" className='form-control' value={lat} readOnly/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                    <button type="button" className="btn btn-primary" onClick={() => CreateMap()}>Thêm Mới</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th className="align-middle text-center" style={{width: "60px", height: "42px"}}>
                                                {
                                                    listCheckBox.length > 0 ?
                                                        <>
                                                            <span type="button" className="text-danger" data-bs-toggle="modal"
                                                                data-bs-target="#deleteModal">
                                                                <Bag/>
                                                            </span>
                                                            <div className="modal fade" id="deleteModal" tabindex="-1"
                                                                aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                <div className="modal-dialog">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Xóa
                                                                                Map</h1>
                                                                            <button type="button" className="btn-close"
                                                                                    data-bs-dismiss="modal"
                                                                                    aria-label="Close"></button>
                                                                        </div>
                                                                        <div className="modal-body ">
                                                                            <span>Bạn có chắc chắn muốn xóa <span
                                                                                classNameName="text-danger">{listCheckBox.length}</span> map này không?</span>
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button type="button" className="btn btn-secondary"
                                                                                    data-bs-dismiss="modal">Đóng
                                                                            </button>
                                                                            <button type="button" className="btn btn-primary"
                                                                                    onClick={() => handlDeleteBuilding()}>Xác Nhận
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </> :
                                                        <>
                                                        </>
                                                }
                                            </th>
                                            <th className='text-center align-middle'>Tên Map</th>
                                            <th className='text-center align-middle'>Địa Chỉ</th>
                                            <th className='text-center align-middle'>Phường</th>
                                            <th className='text-center align-middle'>Huyện</th>
                                            <th className='text-center align-middle'>Tỉnh</th>
                                            <th className='text-center align-middle'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dataMap.map((value, key) => (
                                                <tr key={key}
                                                    className={listCheckBox.includes(value.id) ? "table-secondary" : ""}>
                                                    <td className="text-center align-middle" style={{width: "60px"}}>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="bd-highlight">
                                                            {activeRow === key ? (
                                                                <EyeSlash
                                                                    size={16}
                                                                    onClick={() => hiddenMap()}
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={16}
                                                                    onClick={() => showMap(key, value)} // Show the row's location on the map
                                                                />
                                                            )}
                                                            </div>
                                                            <div className="bd-highlight mt-1">
                                                                <Checkbox
                                                                    checked={listCheckBox.includes(value.id)}
                                                                    onChange={() => {
                                                                        setListCheckBox((prev) => {
                                                                            if (prev.includes(value.id)) {
                                                                                // Nếu đã có trong danh sách, loại bỏ nó
                                                                                return prev.filter((id) => id !== value.id);
                                                                            } else {
                                                                                // Nếu chưa có trong danh sách, thêm vào
                                                                                return [...prev, value.id];
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='align-middle wrap'>{value.map_name}</td>
                                                    <td className='align-middle wrap'>{value.address}</td>
                                                    <td className='align-middle wrap'>{value.ward}</td>
                                                    <td className='align-middle wrap'>{value.district}</td>
                                                    <td className='align-middle wrap'>{value.province}</td>
                                                    <td className="align-middle text-center">
                                                        <Space direction="vertical">
                                                            <Space wrap>
                                                                <Dropdown
                                                                    menu={{
                                                                        items: [
                                                                            {
                                                                                key: "1",
                                                                                label: (
                                                                                    <>
                                                                                        <a
                                                                                            onClick={() => {
                                                                                                handleEditButtonClick(value);
                                                                                            }}
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#EditModal">Cập
                                                                                            Nhật Map</a>
                                                                                    </>
                                                                                ),
                                                                            },
                                                                        ],
                                                                    }}
                                                                    placement="bottomRight"
                                                                    trigger={["click"]}
                                                                >
                                                                    <Button
                                                                        icon={<Setting2/>}
                                                                    />
                                                                </Dropdown>
                                                            </Space>
                                                        </Space>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    <div class="modal fade" id="EditModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-xl">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLabel">Cập Nhật Map</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="card">
                                                                <div className="card-header">
                                                                <MapContainer
                                                                    key={centerUpdate.join(",")}  // Để render lại bản đồ khi vị trí trung tâm thay đổi
                                                                    center={centerUpdate}         // Cập nhật vị trí trung tâm của bản đồ
                                                                    zoom={17}                     // Độ zoom của bản đồ
                                                                    style={{ height: '620px', width: '100%' }}  // Kích thước bản đồ
                                                                >
                                                                    <TileLayer
                                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                                    />
                                                                    <ShowMapUpdateWrapper /> 
                                                                    {selectedShowLocationUpdate && (
                                                                        <Marker
                                                                            position={selectedShowLocationUpdate}  // Vị trí marker cập nhật
                                                                            icon={L.icon({
                                                                                iconUrl: appInfo.currentLocationIcon,
                                                                                iconSize: [35, 35],
                                                                                iconAnchor: [17, 35]
                                                                            })}
                                                                        />
                                                                    )}
                                                                </MapContainer>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Tên Map</label>
                                                                            <input type="text" className='form-control'
                                                                                value={updateMap.map_name}
                                                                                onChange={(e) => {
                                                                                    setUpdateMap({
                                                                                        ...updateMap,
                                                                                        map_name: e.target.value
                                                                                    })
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Địa Chỉ</label>
                                                                            <input type="text" className='form-control' value={updateAddress} readOnly/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row mt-2">
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Phường / Thị Trấn</label>
                                                                            <input type="text" className='form-control' value={updateWard} readOnly/>
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Quận / Huyện</label>
                                                                            <input type="text" className='form-control' value={updateDistrict} readOnly/>
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Tỉnh</label>
                                                                            <input type="text" className='form-control' value={updateProvince} readOnly/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row mt-2">
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Kinh Độ</label>
                                                                            <input type="text" className='form-control' value={updateLon} readOnly/>
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className='mb-2'>Vĩ Độ</label>
                                                                            <input type="text" className='form-control' value={updateLat} readOnly/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                    <button type="button" class="btn btn-primary" onClick={() => UpdateMap()}>Cập Nhật</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MapScreen;