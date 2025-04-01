/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import handleAPINotToken from "../../apis/handleAPINotToken";
import { Link, useLocation } from "react-router-dom";
import { appInfo } from "../../constants/appInfos";
import { useDispatch, useSelector } from "react-redux";
import {
  buildingSelector,
  failed,
  setSelectedArea,
  success,
} from "../../redux/reducers/buildingReducer";
import styles from "../../assets/css/building.module.css";
import { appVariables } from "../../constants/appVariables";
import BuildingModal from "./BuildingModal";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder"; // Import leaflet-control-geocoder
import handleAPI from "../../apis/handlAPI";
import { authSelector } from "../../redux/reducers/authReducer";
import { FaAddressBook } from "react-icons/fa6";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { message } from "antd";

// Hàm tính khoảng cách giữa hai tọa độ (haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Khoảng cách (km)
};

const BuildingComponent = () => {
  const buildingReducer = useSelector(buildingSelector);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const dispatch = useDispatch();
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const listPathNoFilterClick = appVariables.listPathNoFilterClick;
  const location = useLocation();
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([14.0583, 108.2772]); // Vị trí mặc định là Việt Nam
  const [buildings, setBuildings] = useState([]);
  const [nearbyBuildings, setNearbyBuildings] = useState([]);
  const [routeControl, setRouteControl] = useState(null);
  const auth = useSelector(authSelector);
  const [customer, setCustomer] = useState({
    first_name: auth?.info?.first_name,
    last_name: auth?.info?.last_name,
    email: auth?.info?.email,
    phone_number: auth?.info?.phone_number,
    birthday: auth?.info?.birthday,
  });
  const [detailBuilding, setDetailBuiding] = useState(null);
  const [checkout, setCheckout] = useState([]);
  const callApiBuildings = async () => {
    return await handleAPINotToken("/api/user/buildings", {}, "get");
  };

  useEffect(() => {
    callApiBuildings()
      .then((res) => {
        setBuildings(res?.data);
        dispatch(success(res?.data));
      })
      .catch((error) => {
        dispatch(failed());
        console.error("Fetch error: ", error);
      });
  }, [dispatch]);

  // Lấy vị trí hiện tại của người dùng khi component được mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          setMapCenter(coords);

          // Tìm các tòa nhà trong bán kính 1km
          const filteredBuildings = buildings.filter((building) => {
            const distance = calculateDistance(
              coords[0],
              coords[1],
              parseFloat(building.map.latitude),
              parseFloat(building.map.longitude)
            );
            return distance <= 1; // Bán kính 1km
          });
          setNearbyBuildings(filteredBuildings); // Lưu các tòa nhà trong bán kính 1km
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí người dùng: ", error);
        }
      );
    } else {
      console.error("Trình duyệt không hỗ trợ Geolocation.");
    }
  }, [buildings]); // Lắng nghe sự thay đổi của danh sách tòa nhà để thực hiện lọc khi có dữ liệu mới

  useEffect(() => {
    const allBuildings = buildingReducer?.buildings || [];
    const filteredData = allBuildings.filter((building) => {
      const listTypeBuildingRent = Array.from(
        { length: 999 },
        (_, i) => `nhà cho thuê giá ${i + 1} triệu/tháng`
      );
      const listTypeBuildingSale = Array.from(
        { length: 999 },
        (_, i) => `nhà bán giá ${i + 1} tỷ`
      );
      const matchesAuctionBuilding = [
        "Nhà bán",
        "Nhà cho thuê",
        ...listTypeBuildingRent,
        ...listTypeBuildingSale,
      ].some((type) => type === building?.typeBuilding?.type_name);
      const matchesType = buildingReducer?.selectedType
        ? building?.typeBuilding?.type_name === buildingReducer?.selectedType
        : true;
      const matchesArea = buildingReducer?.selectedArea
        ? building?.area === buildingReducer?.selectedArea
        : true;
      const matchesStructure = buildingReducer?.selectedStructure
        ? building?.structure === buildingReducer?.selectedStructure
        : true;
      const matchesPrice = buildingReducer?.inputPrice
        ? building?.price <= buildingReducer?.inputPrice
        : true;
      return (
        matchesType &&
        matchesArea &&
        matchesStructure &&
        matchesPrice &&
        matchesAuctionBuilding
      );
    });
    setFilteredBuildings(filteredData);
  }, [
    buildingReducer?.buildings,
    buildingReducer?.selectedType,
    buildingReducer?.selectedArea,
    buildingReducer?.selectedStructure,
    buildingReducer?.inputPrice,
  ]);

  useEffect(() => {
    if (routeControl && userLocation) {
      let isWithinRange = false;

      // Kiểm tra nếu marker đã click còn nằm trong phạm vi 1km
      routeControl.getWaypoints().forEach((waypoint) => {
        if (waypoint.latLng) {
          const distance = calculateDistance(
            userLocation[0],
            userLocation[1],
            waypoint.latLng.lat,
            waypoint.latLng.lng
          );

          if (distance <= 1) {
            isWithinRange = true;

            // Cập nhật lại đường đi
            routeControl.setWaypoints([
              L.latLng(userLocation[0], userLocation[1]), // Vị trí mới của người dùng
              waypoint.latLng, // Vị trí của marker đã click
            ]);
          }
        }
      });

      // Nếu không còn trong phạm vi, xóa routeControl
      if (!isWithinRange) {
        routeControl.getPlan().setWaypoints([]); // Xóa waypoints
        routeControl.remove(); // Xóa routeControl khỏi bản đồ
        setRouteControl(null); // Reset state
      }
    }
  }, [userLocation, routeControl]);

  const indexOfLastBuilding = currentPage * pageSize;
  const indexOfFirstBuilding = indexOfLastBuilding - pageSize;
  const currentBuildings = filteredBuildings.slice(
    indexOfFirstBuilding,
    indexOfLastBuilding
  );
  const totalPages = Math.ceil(filteredBuildings.length / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (buildingReducer?.isError) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }

  // Thành phần để bắt sự kiện click trên bản đồ
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setUserLocation([lat, lng]);

        // Tìm các tòa nhà trong bán kính 1km
        const filteredBuildings = buildings.filter((building) => {
          const distance = calculateDistance(
            lat,
            lng,
            parseFloat(building.map.latitude),
            parseFloat(building.map.longitude)
          );
          return distance <= 1; // Bán kính 1km
        });
        setNearbyBuildings(filteredBuildings);
      },
    });
    return null;
  };

  // Xử lý khi click vào Marker
  const handleMarkerClick = (map, buildingLat, buildingLng) => {
    const distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      buildingLat,
      buildingLng
    );
    if (distance <= 1) {
      // Nếu đã tồn tại routeControl, xóa nó trước
      if (routeControl) {
        map.removeControl(routeControl); // Loại bỏ routeControl khỏi bản đồ
        setRouteControl(null); // Đặt lại state
      }

      // Tạo routeControl mới
      const newRouteControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(buildingLat, buildingLng),
        ],
        routeWhileDragging: true,
        createMarker: () => null, // Không tạo thêm marker
      }).addTo(map);

      setRouteControl(newRouteControl);
    } else {
      // Nếu tòa nhà không còn trong phạm vi, xóa route và routeControl
      if (routeControl) {
        map.removeControl(routeControl);
        setRouteControl(null);
      }
    }
  };

  const hanldCreateContract = async () => {
    if (detailBuilding?.status < 1) {
      message.error("Nhà đã có chủ sở hữu!");
      return;
    }
    const payload = {
      ...customer,
      ...detailBuilding,
    };
    console.log(payload);
  };

  const formatNumber = (str) => {
    if (str === null || str === undefined) {
      return ""; // Trả về chuỗi rỗng nếu đầu vào không hợp lệ
    }

    // Chuyển đổi str thành chuỗi nếu không phải kiểu string
    const numStr = str.toString();

    return numStr
      .split("")
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ",") + prev;
      });
  };

  const isRentBuilding =
    detailBuilding?.typeBuilding?.type_name?.toLowerCase().includes("thuê") ??
    false;

  return (
    <div>
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="text-center wow fadeInUp"
            data-wow-delay="0.1s"
            style={{
              visibility: "visible",
              animationDelay: "0.1s",
              animationName: "fadeInUp",
            }}
          >
            <h6 className="section-title text-center text-primary text-uppercase">
              {appInfo.title}
            </h6>
            <h1 className="mb-5">
              NHÀ CỦA{" "}
              <span className="text-primary text-uppercase">CHÚNG TÔI</span>
            </h1>
          </div>
          <div className="row g-4">
            {!listPathNoFilterClick.includes(location.pathname) && (
              <div>
                <div
                  className={styles.filterContainer}
                  data-bs-toggle="modal"
                  data-bs-target="#RemoveModal"
                >
                  <span className={`${styles.filterIcon} text-primary`}>
                    <i className="fa fa-search" />
                  </span>
                  <span className={`${styles.filterText}`}>
                    BẤM VÀO ĐIỂM TÌM KIẾM
                  </span>
                </div>
              </div>
            )}
            <BuildingModal />

            <MapContainer
              key={mapCenter.join(",")}
              center={mapCenter}
              zoom={15}
              style={{ height: "620px", width: "100%" }}
              doubleClickZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              {userLocation && (
                <>
                  <Marker
                    position={userLocation}
                    icon={L.icon({
                      iconUrl: appInfo.currentLocationIcon,
                      iconSize: [35, 35],
                      iconAnchor: [17, 35],
                    })}
                  />
                  <Circle
                    center={userLocation}
                    radius={1000} // Bán kính 1km
                    pathOptions={{
                      color: "blue",
                      fillColor: "blue",
                      fillOpacity: 0.1,
                    }}
                  />
                </>
              )}
              {/* Chỉ hiển thị các tòa nhà trong bán kính 1km */}
              {nearbyBuildings.map((building, index) => (
                <Marker
                  key={index}
                  position={[
                    parseFloat(building.map.latitude),
                    parseFloat(building.map.longitude),
                  ]}
                  icon={L.icon({
                    iconUrl: appInfo.vitri4,
                    iconSize: [27, 37],
                    iconAnchor: [12, 41],
                  })}
                  eventHandlers={{
                    click: (e) =>
                      handleMarkerClick(
                        e.target._map,
                        building.map.latitude,
                        building.map.longitude
                      ),
                  }}
                >
                  <Popup>
                    <h6>{building.name}</h6>
                    <p>{building.typeBuilding?.type_name}</p>
                    <p>{`Diện tích: ${building.area} m²`}</p>
                    <p>{`Giá: ${appVariables.formatMoney(
                      building?.typeBuilding?.price
                    )}`}</p>
                    <p>{`Địa chỉ: ${building.map?.address}`}</p>
                    <p>
                      <Link to={`/buildings/${building?.id}`}>
                        Xem chi tiết ngay
                      </Link>
                    </p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            {currentBuildings
              .filter((item) => item.status === 1)
              .map((building, index) => (
                <div
                  key={index}
                  className="col-lg-4 col-md-6 mb-4 wow fadeInUp"
                  data-wow-delay="0.6s"
                  style={{
                    visibility: "visible",
                    animationDelay: "0.6s",
                    animationName: "fadeInUp",
                  }}
                >
                  <div className="card h-100 border-0 shadow-sm rounded overflow-hidden d-flex flex-column">
                    <div className="position-relative">
                      <img
                        src={building?.image?.[0]}
                        alt={building?.file_type}
                        className="card-img-top"
                        style={{ objectFit: "cover", height: "200px" }}
                      />
                      <span
                        className="position-absolute top-0 start-0 m-3 px-3 py-1 bg-primary text-white rounded-pill fw-bold"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <i className="fa fa-money me-2" />
                        {appVariables.formatMoney(
                          building?.typeBuilding?.price
                        )}
                      </span>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{building?.name}</h5>
                        <div className="d-flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className="fa fa-star text-warning ms-1"
                            />
                          ))}
                        </div>
                      </div>

                      <p
                        className="text-muted mb-3"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <i className="fa fa-home text-primary me-1"></i>{" "}
                        {building?.typeBuilding?.type_name}
                        <i className="fa fa-expand text-primary me-1 ms-3"></i>{" "}
                        Diện tích: {building?.area} m²
                      </p>

                      <div
                        className="d-flex flex-wrap text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <div className="me-3 mb-2">
                          <i className="fa fa-building text-primary me-1"></i>
                          {building?.number_of_basement
                            ? `Số tầng: ${building?.number_of_basement}`
                            : "Số tầng: N/A"}
                        </div>

                        <div className="me-3 mb-2">
                          {building?.status === 1 ? (
                            <FaHandHoldingDollar className="text-primary me-1" />
                          ) : (
                            <FaAddressBook className="text-primary me-1" />
                          )}
                          {building?.status === 1
                            ? `Nhà chưa có chủ`
                            : "Nhà đã có chủ"}
                        </div>
                        <div className="me-3 mb-2">
                          <i className="fa fa-building text-primary me-1"></i>
                          {building?.structure
                            ? `Kiến trúc: ${building?.structure}`
                            : "Kiến trúc: N/A"}
                        </div>
                        <div className="me-3 mb-2">
                          <i className="fa fa-map-marker text-primary me-1"></i>
                          {`Địa chỉ: ${building?.map?.address || "N/A"}`}
                        </div>
                      </div>

                      {/* Phần nút đặt ở cuối, dùng mt-auto để đẩy xuống đáy */}
                      <div className="mt-auto">
                        <div className="row">
                          {auth.token || auth.isAuth ? (
                            <>
                              <div className="col">
                                {building?.typeBuilding?.type_name
                                  ?.toLowerCase()
                                  .includes("thuê") ?? false ? (
                                  <button
                                    className="btn btn-primary h-100 w-100 rounded"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() => setDetailBuiding(building)}
                                    disabled={building?.status < 1}
                                  >
                                    Thuê
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-primary h-100 w-100 rounded"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() => setDetailBuiding(building)}
                                    disabled={building?.status < 1}
                                  >
                                    Mua
                                  </button>
                                )}
                              </div>
                              <div className="col">
                                <Link
                                  className="btn btn-info w-100 rounded"
                                  to={`/buildings/${building?.id}`}
                                >
                                  Xem chi tiết
                                </Link>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="col">
                                <Link
                                  className="btn btn-info w-100 rounded"
                                  to={`/buildings/${building?.id}`}
                                >
                                  Xem chi tiết
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      CHECKOUT
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div className="row">
                      <div className="col text-center">
                        <b>
                          <span className="text-dark">
                            THÔNG TIN KHÁCH HÀNG
                          </span>
                        </b>
                      </div>
                      <div className="row mt-2">
                        <div className="col">
                          <label htmlFor="" className="mb-2">
                            Họ Và Tên <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name=""
                            id=""
                            className="form-control"
                            value={customer?.full_name}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                full_name: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="col">
                          <label htmlFor="" className="mb-2">
                            Ngày Sinh <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            name=""
                            id=""
                            className="form-control"
                            value={customer?.birthday}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                birthday: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="col">
                          <label htmlFor="" className="mb-2">
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name=""
                            id=""
                            className="form-control"
                            value={customer?.email}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                email: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="col">
                          <label htmlFor="" className="mb-2">
                            Số Điện Thoại <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name=""
                            id=""
                            className="form-control"
                            value={customer?.phone_number}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                phone_number: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col">
                          <label htmlFor="" className="mb-2">
                            CMT/CCCD <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name=""
                            id=""
                            className="form-control"
                            value={customer?.cccd}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                cccd: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="col">
                          <label htmlFor="" className="mb-2">
                            Ngày Cấp <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            name=""
                            id=""
                            className="form-control"
                            value={customer?.ngay_cap}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                ngay_cap: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="col">
                          <label htmlFor="" className="mb-2">
                            Nơi Cấp <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name=""
                            id=""
                            className="form-control"
                            value={customer?.noi_cap}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                noi_cap: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="col">
                          <label htmlFor="" className="mb-2">
                            Cư Trú <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name=""
                            id=""
                            className="form-control"
                            value={customer?.noi_chon}
                            onChange={(e) => {
                              setCustomer({
                                ...customer,
                                noi_chon: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col text-center">
                          <b>
                            <span className="text-dark">THÔNG TIN TÒA NHÀ</span>
                          </b>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-8">
                          <div className="row">
                            <div className="col-4 mb-2">
                              <label htmlFor="" className="mb-2">
                                Tên Tòa Nhà
                              </label>
                              <input
                                type="text"
                                name=""
                                id=""
                                className="form-control"
                                value={detailBuilding?.name}
                                readOnly
                              />
                            </div>
                            <div className="col-4 mb-2">
                              <label htmlFor="" className="mb-2">
                                Diện Tích
                              </label>
                              <input
                                type="text"
                                name=""
                                id=""
                                className="form-control"
                                value={detailBuilding?.area}
                                readOnly
                              />
                            </div>
                            <div className="col-4 mb-2">
                              <label htmlFor="" className="mb-2">
                                {isRentBuilding
                                  ? "Thời Hạn Thuê"
                                  : "Thuê hoặc mua"}
                              </label>
                              {isRentBuilding ? (
                                <select name="" id="" className="form-control">
                                  <option value="">Vui lòng thời hạn</option>
                                  <option value="1">Thuê 1 Năm</option>
                                  <option value="3">Thuê 3 Năm</option>
                                  <option value="6">Thuê 6 Năm</option>
                                  <option value="12">Thuê 12 Năm</option>
                                </select>
                              ) : (
                                <select name="" id="" className="form-control">
                                  <option value="">Vui lòng thời hạn</option>
                                  <option value="0">Mua đứt</option>
                                  <option value="1">Thuê 1 Năm</option>
                                  <option value="3">Thuê 3 Năm</option>
                                  <option value="6">Thuê 6 Năm</option>
                                  <option value="12">Thuê 12 Năm</option>
                                </select>
                              )}
                            </div>
                            <div className="col-6 mb-2">
                              <label htmlFor="" className="mb-2">
                                Số Tầng
                              </label>
                              <input
                                type="text"
                                name=""
                                id=""
                                className="form-control"
                                value={detailBuilding?.number_of_basement}
                                readOnly
                              />
                            </div>
                            <div className="col-6 mb-2">
                              <label htmlFor="" className="mb-2">
                                Giá
                              </label>
                              <input
                                type="text"
                                name=""
                                id=""
                                className="form-control"
                                value={appVariables.formatMoney(
                                  detailBuilding?.typeBuilding?.price
                                )}
                                readOnly
                              />
                            </div>
                            <div className="col-12 mb-2">
                              <label htmlFor="" className="mb-2">
                                Kiến Trúc
                              </label>
                              <input
                                type="text"
                                name=""
                                id=""
                                className="form-control"
                                value={detailBuilding?.structure}
                                readOnly
                              />
                            </div>
                            <div className="col-12 mb-2">
                              <label htmlFor="" className="mb-2">
                                Địa Chỉ
                              </label>
                              <input
                                type="text"
                                name=""
                                id=""
                                className="form-control"
                                value={detailBuilding?.map?.address}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-4 mb-2">
                          <img
                            className="h-100 w-100"
                            src={detailBuilding?.image}
                            alt="bulding"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={() => hanldCreateContract()}
                    >
                      Xác Nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pagination mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`btn btn-primary mx-1 ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BuildingComponent;
