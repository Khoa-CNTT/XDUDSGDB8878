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
  const [detailBuilding, setDetailBuiding] = useState({});
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
      const matchesAuctionBuilding = ["Nhà bán", "Nhà cho thuê"].includes(
        building?.typeBuilding?.type_name
      );
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
              {nearbyBuildings.map((building) => (
                <Marker
                  key={building.id}
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
                                <button
                                  className="btn btn-primary h-100 w-100 rounded"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                  onClick={() => setDetailBuiding(building)}
                                >
                                  Mua
                                </button>
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
                                Thời Hạn Thuê
                              </label>
                              <select name="" id="" className="form-control">
                                <option value="">Vui lòng thời hạn thuê</option>
                                <option value="1">1 Năm</option>
                                <option value="3">3 Năm</option>
                                <option value="6">6 Năm</option>
                                <option value="12">12 Năm</option>
                              </select>
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
                            src="data:image/jpeg;base64,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"
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
