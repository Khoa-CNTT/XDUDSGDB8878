/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import styles from "../../assets/css/building.module.css";
import {appVariables} from "../../constants/appVariables";
import handleAPI from "../../apis/handlAPI";
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import {message} from "antd";
import {
    addBuildingDetails,
    buildingSelector,
    removeBuildingDetails,
    setBuildingDetails
} from "../../redux/reducers/buildingReducer";
import handleAPINotToken from "../../apis/handleAPINotToken";
import LeafLetMapComponent from "../../component/map/LeafLetMapComponent";
import DistanceMapComponent from "../../component/map/DistanceMapComponent";

const BuildingDetailScreen = () => {

    const { id } = useParams();
    const buildingReducer = useSelector(buildingSelector);
    const [building, setBuilding] = useState(null);
    const auth = useSelector(authSelector);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        fetchData().then();
    }, [id]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
                    handleAPINotToken(url, {}, 'GET')
                    .then(async res => {
                        const buildingLat = parseFloat(building?.map?.latitude);
                        const buildingLon = parseFloat(building?.map?.longitude);
                        const currentLat = parseFloat(position.coords.latitude);
                        const currentLon = parseFloat(position.coords.longitude);
                        if (!isNaN(buildingLat) && !isNaN(buildingLon) && currentLat && currentLon) {
                            const distance = appVariables.calculateDistance(currentLat, currentLon, buildingLat, buildingLon);
                            setCurrentLocation({
                                ...res,
                                km: `${distance?.toFixed(2)} km`
                            });
                        }
                    })
                    .catch(error=>{
                        console.log('Fetch error: ', error);
                    });
                },
                (error) => {
                    console.log("Error getting location: " + error.message);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            appVariables.toast_notify_warning("Vui lòng bật định vị của bạn lên để chúng tôi xác định khoách cách từ vị trí của bạn đến vị trí tòa nhà!");
        }
    }, [
        building,
        navigator.geolocation
    ]);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };
    const fetchData = async ()=> {
        try {
            const res = await handleAPI(`/api/user/buildings/${id}`, {}, "get");
            setBuilding(res?.data[0]);
            if(!res?.data[0]){
                navigate("/");
            }
        } catch (error) {
            console.log("error: ",error);
        }
    }
    
    const handleClickKyHopDong = () => {
      if(!auth?.info?.firstName ||
          !auth?.info?.lastName ||
          !auth?.info?.birthday ||
          !auth?.info?.gender ||
          !auth?.info?.phoneNumber ||
          !auth?.info?.address){
          message.error("Vui lòng cập nhật đầy đủ thông tin cá nhân của bạn để ký hợp đồng!");
          navigate("/user/info");
          return;
      }
      dispatch(addBuildingDetails(building));
    }


    return (
        <div style={
            {
                paddingTop: "150px"
            }
        }
        >
            <div className="container-xxl py-5">
                <div className="container">

                    <div className="row g-4">
                        {/* Carousel Section */}
                        <div id="carouselExample" className="carousel slide mb-4" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0"
                                        className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"
                                        aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"
                                        aria-label="Slide 3"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img
                                        src={building?.image[0]}
                                        alt={building?.file_type}
                                        className="d-block w-100 rounded"
                                        style={{
                                            height: "500px",
                                            objectFit: "cover",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                        }}
                                    />
                                </div>
                                <div className="carousel-item">
                                    <img
                                        src={building?.image[0]}
                                        alt={building?.file_type}
                                        className="d-block w-100 rounded"
                                        style={{
                                            height: "500px",
                                            objectFit: "cover",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                        }}
                                    />
                                </div>
                                <div className="carousel-item">
                                    <img
                                        src={building?.image[0]}
                                        alt={building?.file_type}
                                        className="d-block w-100 rounded"
                                        style={{
                                            height: "500px",
                                            objectFit: "cover",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                        }}
                                    />
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample"
                                    data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample"
                                    data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>

                        {/* Details Section */}
                        <div className="col-12">
                            <div className="p-4 border rounded bg-light shadow-sm">
                                <h3 className="mb-3">{building?.name}</h3>
                                <div className="row mb-2">
                                    <div className="col-md-12 mb-3">
                                        <i className="fa fa-circle text-primary me-2"/>
                                        <strong>Loại nhà:</strong> {building?.typeBuilding?.type_name}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <i className="fa fa-arrows text-primary me-2"/>
                                        <strong>Diện tích:</strong> {building?.area} m²
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <i className="fa fa-money text-primary me-2"/>
                                        <strong>Giá:</strong> {appVariables.formatMoney(building?.typeBuilding?.price)}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <i className="fa fa-home text-primary me-2"/>
                                        <strong>Kiến trúc:</strong> {building?.structure}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <i className="fa fa-home text-primary me-2"/>
                                        <strong>Số tầng:</strong> {building?.number_of_basement}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <i className="fa fa-map text-primary me-2"/>
                                        <strong>Địa chỉ:</strong> {building?.map?.address}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <i className="fa fa-map-marker text-primary me-2"/>
                                        <strong>Vị trí hiện tại của bạn:</strong>
                                        {' ' + currentLocation?.display_name}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <i className="fa fa-motorcycle text-primary me-2"/>
                                        <strong>Khoảng cách:</strong>
                                        {' ' + currentLocation?.km}
                                    </div>
                                </div>
                                <h4 className="mt-3">Mô tả: </h4>
                                <p className={`w-75 text-muted ${
                                        isExpanded ? styles.expandedDescription : styles.collapsedDescription
                                    }`
                                }>
                                    {building?.description}
                                </p>
                                <Link onClick={toggleDescription} to={'#'}>
                                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                </Link>
                                <div style={{paddingTop: '20px'}}>
                                    <button className={"btn btn-primary"}
                                            onClick={handleClickKyHopDong}>
                                        Xem chi tiết hợp đồng
                                    </button>
                                </div>
                                <div style={{paddingTop: '20px'}}>
                                    {/*<LeafLetMapComponent buildingLocation={building?.map}*/}
                                    {/*                     currentLocation={currentLocation}*/}
                                    {/*/>*/}
                                    <DistanceMapComponent buildingLocation={{...building?.map}}
                                                          currentLocation={currentLocation}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default BuildingDetailScreen;