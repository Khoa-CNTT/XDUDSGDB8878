/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "../../assets/css/building.module.css";
import { appVariables } from "../../constants/appVariables";
import handleAPI from "../../apis/handlAPI";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { styled } from "@mui/material";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Slider } from "@mui/material";
import { message, Radio } from "antd";
import {
  addBuildingDetails,
  buildingSelector,
  removeBuilding,
  setBuilding,
} from "../../redux/reducers/buildingReducer";
import handleAPINotToken from "../../apis/handleAPINotToken";
import DistanceMapComponent from "../../component/map/DistanceMapComponent";
import BuildingStatistical from "../../component/bieudo/BuildingStatistical";

Chart.register(ChartDataLabels);

const BuildingDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buildingReducer = useSelector(buildingSelector);
  const auth = useSelector(authSelector);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await handleAPI(`/api/user/buildings/${id}`, {}, "get");
      if (res?.data[0]) {
        dispatch(setBuilding(res.data[0]));
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("API Fetch Error: ", error);
    }
  }, [id, navigate, dispatch]);

  useEffect(() => {
    fetchData();

    return () => {
      dispatch(removeBuilding());
    };
  }, [fetchData]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
            const res = await handleAPINotToken(url, {}, "GET");

            const buildingLat = parseFloat(
              buildingReducer?.building?.map?.latitude
            );
            const buildingLon = parseFloat(
              buildingReducer?.building?.map?.longitude
            );
            const currentLat = position.coords.latitude;
            const currentLon = position.coords.longitude;

            if (!isNaN(buildingLat) && !isNaN(buildingLon)) {
              const distance = appVariables.calculateDistance(
                currentLat,
                currentLon,
                buildingLat,
                buildingLon
              );
              setCurrentLocation({
                ...res,
                km: `${distance?.toFixed(2)} km`,
              });
            }
          } catch (error) {
            console.error("Fetch geolocation error:", error);
          }
        },
        (error) => {
          console.warn("Error getting location:", error.message);
          appVariables.toast_notify_warning(
            "Vui lòng bật định vị để xác định khoảng cách đến tòa nhà!"
          );
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, [buildingReducer?.building]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClickKyHopDong = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "birthday",
      "gender",
      "phoneNumber",
      "address",
    ];
    const missingFields = requiredFields.filter(
      (field) => !auth?.info?.[field]
    );

    if (missingFields.length > 0) {
      message.error(
        "Vui lòng cập nhật đầy đủ thông tin cá nhân để ký hợp đồng!"
      );
      navigate("/user/info");
      return;
    }

    dispatch(addBuildingDetails(buildingReducer?.building));
  };

  return (
    <div
      style={{
        paddingTop: "150px",
      }}
    >
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            {/* Carousel Section */}
            <div
              id="carouselExample"
              className="carousel slide mb-4"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src={
                      buildingReducer?.building?.image[0] || "/placeholder.svg"
                    }
                    alt={buildingReducer?.building?.file_type}
                    className="d-block w-100 rounded"
                    style={{
                      height: "500px",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src={
                      buildingReducer?.building?.image[0] || "/placeholder.svg"
                    }
                    alt={buildingReducer?.building?.file_type}
                    className="d-block w-100 rounded"
                    style={{
                      height: "500px",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src={
                      buildingReducer?.building?.image[0] || "/placeholder.svg"
                    }
                    alt={buildingReducer?.building?.file_type}
                    className="d-block w-100 rounded"
                    style={{
                      height: "500px",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>

            {/* Details Section */}
            <div className="col-12">
              <div className="p-4 border rounded bg-light shadow-sm">
                <h3 className="mb-3">{buildingReducer?.building?.name}</h3>
                <div className="row mb-2">
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-circle text-primary me-2" />
                    <strong>Loại nhà:</strong>{" "}
                    {buildingReducer?.building?.typeBuilding?.type_name}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-arrows text-primary me-2" />
                    <strong>Diện tích:</strong>{" "}
                    {buildingReducer?.building?.area} m²
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-money text-primary me-2" />
                    <strong>Giá:</strong>{" "}
                    {appVariables.formatMoney(
                      buildingReducer?.building?.typeBuilding?.price
                    )}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-home text-primary me-2" />
                    <strong>Kiến trúc:</strong>{" "}
                    {buildingReducer?.building?.structure}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-home text-primary me-2" />
                    <strong>Số tầng:</strong>{" "}
                    {buildingReducer?.building?.number_of_basement}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-map text-primary me-2" />
                    <strong>Địa chỉ:</strong>{" "}
                    {buildingReducer?.building?.map?.address}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-map-marker text-primary me-2" />
                    <strong>Vị trí hiện tại của bạn:</strong>
                    {" " + currentLocation?.display_name}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-motorcycle text-primary me-2" />
                    <strong>Khoảng cách:</strong>
                    {" " + currentLocation?.km}
                  </div>
                </div>
                <h4 className="mt-3">Mô tả: </h4>
                <p
                  className={`w-75 text-muted ${
                    isExpanded
                      ? styles.expandedDescription
                      : styles.collapsedDescription
                  }`}
                >
                  {buildingReducer?.building?.description}
                </p>
                <Link onClick={toggleDescription} to={"#"}>
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </Link>
                <div style={{ paddingTop: "20px" }}>
                  <button
                    className={"btn btn-primary"}
                    onClick={handleClickKyHopDong}
                  >
                    Xem chi tiết hợp đồng
                  </button>
                </div>
                <div style={{ paddingTop: "20px" }}>
                  {/*<LeafLetMapComponent buildingLocation={building?.map}*/}
                  {/*                     currentLocation={currentLocation}*/}
                  {/*/>*/}
                  <DistanceMapComponent
                    buildingLocation={{ ...buildingReducer?.building?.map }}
                    currentLocation={currentLocation}
                  />
                </div>
                {/* Biểu đồ lãi suất */}
                <BuildingStatistical />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingDetailScreen;
