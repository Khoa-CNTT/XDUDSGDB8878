import { useEffect, useState, useCallback } from "react";
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
import { message, Radio, Tabs } from "antd";
import {
  addBuildingDetails,
  buildingSelector,
  removeBuilding,
  setBuilding,
} from "../../redux/reducers/buildingReducer";
import handleAPINotToken from "../../apis/handleAPINotToken";
import DistanceMapComponent from "../../component/map/DistanceMapComponent";
import BuildingStatistical from "../../component/bieudo/BuildingStatistical";
import {
  FaAddressBook,
  FaRulerCombined,
  FaBuilding,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaInfoCircle,
  FaChartLine,
  FaMapMarkedAlt,
  FaArrowLeft,
  FaArrowRight,
  FaPhone,
  FaHeart,
} from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { MdMoneyOff } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { appInfo } from "../../constants/appInfos";

Chart.register(ChartDataLabels);

const BuildingDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buildingReducer = useSelector(buildingSelector);
  const auth = useSelector(authSelector);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

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

  const getStatusBadge = () => {
    if (buildingReducer?.building?.status === 1) {
      return (
        <span className="badge bg-success py-2 px-3 rounded-pill">
          <GiReceiveMoney className="me-1" />
          Nhà chưa có chủ
        </span>
      );
    } else {
      return (
        <span className="badge bg-secondary py-2 px-3 rounded-pill">
          <MdMoneyOff className="me-1" /> Nhà đã có chủ
        </span>
      );
    }
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <FaInfoCircle className="me-2" />
          Thông tin chi tiết
        </span>
      ),
      children: (
        <div className="p-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="d-flex align-items-center p-3 border rounded bg-white shadow-sm h-100">
                <FaBuilding className="text-primary fs-3 me-3" />
                <div>
                  <div className="text-muted small">Loại nhà</div>
                  <div className="fw-bold">
                    {buildingReducer?.building?.typeBuilding?.type_name ||
                      "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="d-flex align-items-center p-3 border rounded bg-white shadow-sm h-100">
                <FaRulerCombined className="text-primary fs-3 me-3" />
                <div>
                  <div className="text-muted small">Diện tích</div>
                  <div className="fw-bold">
                    {buildingReducer?.building?.area || "N/A"} m²
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="d-flex align-items-center p-3 border rounded bg-white shadow-sm h-100">
                <MdAttachMoney className="text-primary fs-3 me-3" />
                <div>
                  <div className="text-muted small">Giá</div>
                  <div className="fw-bold">
                    {appVariables.formatMoney(
                      buildingReducer?.building?.typeBuilding?.price
                    ) || "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="d-flex align-items-center p-3 border rounded bg-white shadow-sm h-100">
                <FaLayerGroup className="text-primary fs-3 me-3" />
                <div>
                  <div className="text-muted small">Số tầng</div>
                  <div className="fw-bold">
                    {buildingReducer?.building?.number_of_basement || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="border-bottom pb-2">Kiến trúc</h5>
            <p>
              {buildingReducer?.building?.structure || "Không có thông tin"}
            </p>
          </div>

          <div className="mt-4">
            <h5 className="border-bottom pb-2">Mô tả</h5>
            <div className="position-relative">
              <p
                className={`text-muted ${
                  isExpanded
                    ? styles.expandedDescription
                    : styles.collapsedDescription
                }`}
                style={{
                  maxHeight: isExpanded ? "none" : "150px",
                  overflow: isExpanded ? "visible" : "hidden",
                  position: "relative",
                }}
              >
                {buildingReducer?.building?.description || "Không có mô tả"}
              </p>
              {!isExpanded && (
                <div
                  className="position-absolute bottom-0 start-0 end-0"
                  style={{
                    background: "linear-gradient(transparent, white)",
                    height: "5px",
                  }}
                ></div>
              )}
            </div>
            <button
              onClick={toggleDescription}
              className="btn btn-sm btn-outline-primary mt-2"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <FaMapMarkedAlt className="me-2" />
          Vị trí
        </span>
      ),
      children: (
        <div className="p-4">
          <div className="row mb-4">
            <div className="col-md-12 mb-3">
              <div className="d-flex align-items-center p-3 border rounded bg-white shadow-sm">
                <FaMapMarkerAlt className="text-primary fs-3 me-3" />
                <div>
                  <div className="text-muted small">Địa chỉ</div>
                  <div className="fw-bold">
                    {buildingReducer?.building?.map?.address || "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="d-flex align-items-center p-3 border rounded bg-white shadow-sm h-100">
                <FaMapMarkerAlt className="text-primary fs-3 me-3" />
                <div>
                  <div className="text-muted small">
                    Vị trí hiện tại của bạn
                  </div>
                  <div className="fw-bold">
                    {currentLocation?.display_name || "Đang xác định..."}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="d-flex align-items-center p-3 border rounded bg-white shadow-sm h-100">
                <FaMotorcycle className="text-primary fs-3 me-3" />
                <div>
                  <div className="text-muted small">Khoảng cách</div>
                  <div className="fw-bold">
                    {currentLocation?.km || "Đang tính..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded shadow-sm overflow-hidden">
            <DistanceMapComponent
              buildingLocation={{ ...buildingReducer?.building?.map }}
              currentLocation={currentLocation}
            />
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <FaChartLine className="me-2" />
          Thống kê
        </span>
      ),
      children: (
        <div className="p-4">
          <BuildingStatistical />
        </div>
      ),
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = buildingReducer?.building?.image?.length || 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="py-5" style={{ paddingTop: "150px", marginTop: "150px" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="position-relative mb-4 rounded overflow-hidden shadow">
              <div style={{ height: "500px", overflow: "hidden" }}>
                <img
                  src={
                    buildingReducer?.building?.image?.[currentSlide] ||
                    "/placeholder.svg"
                  }
                  alt={`Property image ${currentSlide + 1}`}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <button
                onClick={prevSlide}
                className="position-absolute top-50 start-0 translate-middle-y btn btn-dark btn-sm ms-2 rounded-circle"
                style={{ width: "40px", height: "40px", opacity: 0.7 }}
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={nextSlide}
                className="position-absolute top-50 end-0 translate-middle-y btn btn-dark btn-sm me-2 rounded-circle"
                style={{ width: "40px", height: "40px", opacity: 0.7 }}
              >
                <FaArrowRight />
              </button>
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                <div className="d-flex gap-1">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`btn btn-sm rounded-circle ${
                        currentSlide === index
                          ? "btn-light"
                          : "btn-outline-light"
                      }`}
                      style={{
                        width: "12px",
                        height: "12px",
                        padding: 0,
                        opacity: currentSlide === index ? 1 : 0.5,
                      }}
                    >
                      <span className="visually-hidden">Slide {index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded shadow-sm mb-4">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                className="p-3"
                type="card"
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: "150px", zIndex: "1" }}>
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h2
                    style={{ textAlign: "start" }}
                    className="card-title h4 mb-3"
                  >
                    {buildingReducer?.building?.name}
                  </h2>
                  <div className="mb-3">{getStatusBadge()}</div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted">Giá</div>
                    <div className="h3 text-primary mb-0">
                      {appVariables.formatMoney(
                        buildingReducer?.building?.typeBuilding?.price
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted">Diện tích</div>
                    <div className="h5 mb-0">
                      {buildingReducer?.building?.area} m²
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Thông tin liên hệ</h5>
                  <div className="d-flex align-items-center mb-3">
                    <FaPhoneVolume
                      className="text-primary"
                      style={{ fontSize: "30px" }}
                    />
                    <div>
                      <div style={{ paddingLeft: "10px" }}>
                        <h6 className="mb-1">Số điện thoại tư vấn</h6>
                        <p className="text-muted mb-0">{appInfo.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
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
