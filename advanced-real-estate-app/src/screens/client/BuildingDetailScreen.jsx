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
} from "../../redux/reducers/buildingReducer";
import handleAPINotToken from "../../apis/handleAPINotToken";
import DistanceMapComponent from "../../component/map/DistanceMapComponent";

Chart.register(ChartDataLabels);

const BuildingDetailScreen = () => {
  const { id } = useParams();
  const buildingReducer = useSelector(buildingSelector);
  const [building, setBuilding] = useState(null);
  const auth = useSelector(authSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  //   thanh trượt cho hiển thị biểu đồ
  const BlueSlider = styled(Slider)(() => ({
    color: "blue",
    "& .MuiSlider-thumb": {
      backgroundColor: "blue",
    },
    "& .MuiSlider-track": {
      backgroundColor: "blue",
    },
    "& .MuiSlider-rail": {
      backgroundColor: "blue",
    },
    "& .MuiSlider-mark": {
      backgroundColor: "blue",
      height: 6,
      width: 4,
    },
    "& .MuiSlider-markLabel": {
      color: "rgba(0, 0, 0, 0.3)",
      fontSize: "12px",
    },
    "& .MuiSlider-valueLabel": {
      backgroundColor: "blue",
      color: "white",
      borderRadius: "3px",
      padding: "1px 2px",
    },
  }));
  const GreenSlider = styled(Slider)(() => ({
    color: "green",
    "& .MuiSlider-thumb": {
      backgroundColor: "green",
    },
    "& .MuiSlider-track": {
      backgroundColor: "green",
    },
    "& .MuiSlider-rail": {
      backgroundColor: "lightgreen",
    },
    "& .MuiSlider-mark": {
      backgroundColor: "lightgreen",
      height: 6,
      width: 4,
    },
    "& .MuiSlider-markLabel": {
      color: "rgba(0, 0, 0, 0.5)",
      fontSize: "12px",
    },
    "& .MuiSlider-valueLabel": {
      backgroundColor: "green",
      color: "white",
      borderRadius: "5px",
      padding: "1px 2px",
    },
  }));
  const PinkSlider = styled(Slider)(() => ({
    color: "red",
    "& .MuiSlider-thumb": {
      backgroundColor: "red",
    },
    "& .MuiSlider-track": {
      backgroundColor: "red",
    },
    "& .MuiSlider-rail": {
      backgroundColor: "red",
    },
    "& .MuiSlider-mark": {
      backgroundColor: "red",
      height: 6,
      width: 4,
    },
    "& .MuiSlider-markLabel": {
      color: "rgba(0, 0, 0, 0.5)",
      fontSize: "12px",
    },
    "& .MuiSlider-valueLabel": {
      backgroundColor: "red",
      color: "white",
      borderRadius: "3px",
      padding: "1px 2px",
    },
  }));
  const marksTyLeVay = Array.from({ length: 6 }, (_, i) => ({
    value: i * 20,
    label: `${i * 20}`,
  }));
  const marksThoiHanVay = Array.from({ length: 6 }, (_, i) => ({
    value: i * 6,
    label: `${i * 6}`,
  }));
  const marksLaiSuatVay = Array.from({ length: 6 }, (_, i) => ({
    value: i * 5,
    label: `${i * 5}`,
  }));

  // useState cho hiển thị biểu đồ
  const [giaNhaDat, setGiaNhaDat] = useState(
    building?.typeBuilding?.price || 0
  );

  const thamChieuDenBieuDoTong = useRef(null);
  const thamChieuDenBieuDoThangDau = useRef(null);
  const doiTuongBieuDoTong = useRef(null);
  const doiTuongBieuDoThangDau = useRef(null);

  const [tyLeVay, setTyLeVay] = useState(10);
  const [thoiHanVay, setThoiHanVay] = useState(1);
  const [laiSuat, setLaiSuat] = useState(12);
  const [phuongThucTinh, setPhuongThucTinh] = useState("duNoGiamDan");

  const [duLieuTinhTrenBieuDo, setDuLieuTinhTrenBieuDo] = useState({
    soTienVay: 0,
    tongTienLai: 0,
    tienTraThangDau: 0,
    laiThangDau: 0,
    tienGocThangDau: 0,
  });

  const xuLyTinhToan = useCallback(() => {
    const soTienVay = (giaNhaDat * tyLeVay) / 100;
    const laiSuatThang = laiSuat / 100 / 12;
    let tongTienLai = 0;
    let tienTraThangDau = 0;
    let laiThangDau = 0;
    let tienGocThangDau = 0;

    if (phuongThucTinh === "duNoGiamDan") {
      const soTienGocTraMoiThang = soTienVay / (thoiHanVay * 12);
      laiThangDau = soTienVay * laiSuatThang;
      tienTraThangDau = soTienGocTraMoiThang + laiThangDau;
      tienGocThangDau = soTienGocTraMoiThang;

      let soTienNo = soTienVay;
      for (let i = 0; i < thoiHanVay * 12; i++) {
        const laiSuatThangDuaTrenSoDu = soTienNo * laiSuatThang;
        tongTienLai += laiSuatThangDuaTrenSoDu;
        soTienNo -= soTienGocTraMoiThang;
      }

      setDuLieuTinhTrenBieuDo({
        soTienVay,
        tongTienLai,
        tienTraThangDau,
        laiThangDau,
        tienGocThangDau,
      });
    } else {
      // Trả đều hàng tháng
      const laiSuatThang = laiSuat / 100 / 12;
      const soThangVay = thoiHanVay * 12;
      const r = Math.pow(1 + laiSuatThang, soThangVay);
      const tienTraHangThang = (soTienVay * laiSuatThang * r) / (r - 1);
      tienTraThangDau = tienTraHangThang;
      laiThangDau = soTienVay * laiSuatThang;
      tienGocThangDau = tienTraHangThang - laiThangDau;
      tongTienLai = tienTraHangThang * soThangVay - soTienVay;

      setDuLieuTinhTrenBieuDo({
        soTienVay,
        tongTienLai,
        tienTraThangDau,
        laiThangDau,
        tienGocThangDau,
      });
      return; // Add this to prevent the second setDuLieuTinhTrenBieuDo call
    }
  }, [giaNhaDat, tyLeVay, thoiHanVay, laiSuat, phuongThucTinh]);

  const fetchData = useCallback(async () => {
    try {
      const res = await handleAPI(`/api/user/buildings/${id}`, {}, "get");
      setBuilding(res?.data[0]);
      if (!res?.data[0]) {
        navigate("/");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData().then();
  }, [fetchData]);

  // useEffect cho chi tiết tòa nhà
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
          handleAPINotToken(url, {}, "GET")
            .then(async (res) => {
              const buildingLat = Number.parseFloat(building?.map?.latitude);
              const buildingLon = Number.parseFloat(building?.map?.longitude);
              const currentLat = Number.parseFloat(position.coords.latitude);
              const currentLon = Number.parseFloat(position.coords.longitude);
              if (
                !isNaN(buildingLat) &&
                !isNaN(buildingLon) &&
                currentLat &&
                currentLon
              ) {
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
            })
            .catch((error) => {
              console.log("Fetch error: ", error);
            });
        },
        (error) => {
          console.log("Error getting location: " + error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      appVariables.toast_notify_warning(
        "Vui lòng bật định vị của bạn lên để chúng tôi xác định khoách cách từ vị trí của bạn đến vị trí tòa nhà!"
      );
    }
  }, [building]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClickKyHopDong = () => {
    if (
      !auth?.info?.firstName ||
      !auth?.info?.lastName ||
      !auth?.info?.birthday ||
      !auth?.info?.gender ||
      !auth?.info?.phoneNumber ||
      !auth?.info?.address
    ) {
      message.error(
        "Vui lòng cập nhật đầy đủ thông tin cá nhân của bạn để ký hợp đồng!"
      );
      navigate("/user/info");
      return;
    }
    dispatch(addBuildingDetails(building));
  };

  // useEffect cho hiển thị biểu đồ
  useEffect(() => {
    setGiaNhaDat(building?.typeBuilding?.price || 0);
  }, [building?.typeBuilding?.price]);

  const taoHoacCapNhatBieuDo = useCallback(() => {
    if (thamChieuDenBieuDoTong.current && thamChieuDenBieuDoThangDau.current) {
      const ctxTong = thamChieuDenBieuDoTong.current.getContext("2d");
      const ctxThangDau = thamChieuDenBieuDoThangDau.current.getContext("2d");

      // Destroy biểu đồ khi render
      if (doiTuongBieuDoTong.current) {
        doiTuongBieuDoTong.current.destroy();
      }
      if (doiTuongBieuDoThangDau.current) {
        doiTuongBieuDoThangDau.current.destroy();
      }

      const tongTienPhaiTra =
        duLieuTinhTrenBieuDo.soTienVay + duLieuTinhTrenBieuDo.tongTienLai;

      // tạo biểu đồ
      doiTuongBieuDoTong.current = new Chart(ctxTong, {
        type: "doughnut",
        data: {
          labels: ["Số tiền vay", "Tổng lãi suất", "Tổng tiền phải trả"],
          color: [
            "rgba(22, 24, 26, 0.6)",
            "rgba(255, 0, 55, 0.76)",
            "rgba(21, 199, 104, 0.6)",
          ],
          datasets: [
            {
              data: [
                duLieuTinhTrenBieuDo.soTienVay,
                duLieuTinhTrenBieuDo.tongTienLai,
                tongTienPhaiTra,
              ],

              backgroundColor: [
                "rgba(0, 153, 255, 0.6)",
                "rgba(255, 0, 55, 0.76)",
                "rgba(21, 199, 104, 0.6)",
              ],
              borderWidth: 1,
              hoverBorderWidth: 3,
              hoverBorderColor: "#000",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Tổng tiền phải trả",
              font: { size: 20 },
            },
            datalabels: {
              color: "#black",
              font: {
                weight: "bold",
                size: 0,
              },
              // formatter: (value, ctx) => {
              //   const label = ctx.chart.data.labels[ctx.dataIndex];
              //   if (label === "Tổng tiền phải trả") {
              //     return appVariables.formatMoney(value);
              //   }
              //   return label;
              // },
              // align: (ctx) => (ctx.dataIndex === 2 ? "center" : "end"),
              // anchor: (ctx) => (ctx.dataIndex === 2 ? "center" : "end"),
            },
            // tooltip: {
            //   callbacks: {
            //     label: (context) => {
            //       const label = context.label || "";
            //       const value = context.raw || 0;
            //       const percentage = ((value / tongTienPhaiTra) * 100).toFixed(
            //         2
            //       );
            //       return `${label}: ${appVariables.formatMoney(
            //         value
            //       )} (${percentage}%)`;
            //     },
            //   },
            // },
          },
        },
      });

      doiTuongBieuDoThangDau.current = new Chart(ctxThangDau, {
        type: "doughnut",
        data: {
          labels: ["Tiền gốc", "Lãi tháng đầu", "Tiền trả tháng đầu"],
          datasets: [
            {
              data: [
                duLieuTinhTrenBieuDo.tienGocThangDau || 0,
                duLieuTinhTrenBieuDo.laiThangDau || 0,
                duLieuTinhTrenBieuDo.tienTraThangDau || 0,
              ],
              backgroundColor: [
                "rgba(10, 148, 240, 0.6)",
                "rgba(255, 0, 55, 0.76)",
                "rgba(234, 174, 20, 0.6)",
              ],
              borderWidth: 1,
              hoverBorderWidth: 3,
              hoverBorderColor: "#000",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Tiền trả tháng đầu",
              font: { size: 20 },
            },
            datalabels: {
              color: "#black",
              font: {
                weight: "bold",
                size: 0,
              },
              // formatter: (value, ctx) => {
              //   const label = ctx.chart.data.labels[ctx.dataIndex];
              //   if (label === "Tiền trả tháng đầu") {
              //     // return appVariables.formatMoney(value);
              //   }
              //   return label;
              // },
              // align: (ctx) => (ctx.dataIndex === 2 ? "center" : "end"),
              // anchor: (ctx) => (ctx.dataIndex === 2 ? "center" : "end"),
            },
            // tooltip: {
            //   callbacks: {
            //     label: (context) => {
            //       // const label = context.label || "";
            //       // const value = context.raw || 0;
            //       // const percentage = (
            //       //   (value / duLieuTinhTrenBieuDo.tienTraThangDau) *
            //       //   100
            //       // ).toFixed(2);
            //       // return `${label}: ${appVariables.formatMoney(
            //       //   value
            //       // )} (${percentage}%)`;
            //     },
            //   },
            // },
          },
        },
      });
    }
  }, [duLieuTinhTrenBieuDo]);

  useEffect(() => {
    xuLyTinhToan();
  }, [xuLyTinhToan]);

  useEffect(() => {
    taoHoacCapNhatBieuDo();
  }, [taoHoacCapNhatBieuDo]);

  useEffect(() => {
    return () => {
      if (doiTuongBieuDoTong.current) {
        doiTuongBieuDoTong.current.destroy();
      }
      if (doiTuongBieuDoThangDau.current) {
        doiTuongBieuDoThangDau.current.destroy();
      }
    };
  }, []);

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
                    src={building?.image[0] || "/placeholder.svg"}
                    alt={building?.file_type}
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
                    src={building?.image[0] || "/placeholder.svg"}
                    alt={building?.file_type}
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
                    src={building?.image[0] || "/placeholder.svg"}
                    alt={building?.file_type}
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
                <h3 className="mb-3">{building?.name}</h3>
                <div className="row mb-2">
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-circle text-primary me-2" />
                    <strong>Loại nhà:</strong>{" "}
                    {building?.typeBuilding?.type_name}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-arrows text-primary me-2" />
                    <strong>Diện tích:</strong> {building?.area} m²
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-money text-primary me-2" />
                    <strong>Giá:</strong>{" "}
                    {appVariables.formatMoney(building?.typeBuilding?.price)}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-home text-primary me-2" />
                    <strong>Kiến trúc:</strong> {building?.structure}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-home text-primary me-2" />
                    <strong>Số tầng:</strong> {building?.number_of_basement}
                  </div>
                  <div className="col-md-12 mb-3">
                    <i className="fa fa-map text-primary me-2" />
                    <strong>Địa chỉ:</strong> {building?.map?.address}
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
                  {building?.description}
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
                    buildingLocation={{ ...building?.map }}
                    currentLocation={currentLocation}
                  />
                </div>

                {/* Biểu đồ lãi suất */}

                <div className="mt-4">
                  <h4>Tính lãi suất vay</h4>
                </div>
                <hr></hr>
                {/* trường thông tin và input */}
                <div className="col mt-4 md-12" style={{}}>
                  <div
                    className="col mt-4 md-6"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    {/* trường thông tin */}
                    <div
                      className="col-md-6"
                      style={{
                        padding: "20px",
                        paddingLeft: "150px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label style={{ marginBottom: "48px" }}>
                        Giá nhà đất{" "}
                      </label>
                      <label style={{ marginBottom: "48px" }}>
                        Tỉ lệ vay (%/năm)
                      </label>
                      <label style={{ marginBottom: "48px" }}>
                        Thời hạn vay
                      </label>
                      <label style={{ marginBottom: "48px" }}>Lãi suất </label>
                      <label>Phương thức tính</label>
                      <div
                        className="mt-1"
                        style={{ display: "flex", justifyContent: "left" }}
                      >
                        {/* <button
                          className="btn btn-primary"
                          onClick={xuLyTinhToan}
                        >
                          Tính toán
                        </button> */}
                      </div>
                    </div>
                    {/* input */}
                    <div
                      className="col-md-6"
                      style={{
                        padding: "20px",
                        marginBottom: "20px",
                        paddingBottom: "20px",
                        paddingRight: "100px",
                        display: "flex",
                        flexDirection: "column",
                        value:
                          "{appVariables.formatMoney(building?.typeBuilding?.price)}",
                      }}
                    >
                      <div
                        className="col-md-12"
                        style={{ display: "flex", flexDirection: "col" }}
                      >
                        {/* input giá nhà đất */}
                        <div className="col-md-10">
                          <input
                            type="text"
                            className="form-control"
                            style={{ marginBottom: "35px" }}
                            value={appVariables.formatMoney(
                              building?.typeBuilding?.price
                            )}
                          />
                        </div>
                        <div
                          className="col-md-2"
                          style={{
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <input
                            value={"VND"}
                            className="form-control"
                            style={{
                              marginBottom: "35px",
                              display: "flex",
                              textAlign: "center",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "3px",
                            }}
                          />
                        </div>
                      </div>
                      {/* input tỉ lệ vay */}
                      <div>
                        <BlueSlider
                          style={{ marginBottom: "35px" }}
                          aria-label="Pink Slider"
                          defaultValue={tyLeVay}
                          // step={1}
                          min={10}
                          max={100}
                          marks={marksTyLeVay}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `${value}%`}
                          value={tyLeVay}
                          onChange={(_, newValue) => {
                            try {
                              setTyLeVay(newValue);
                            } catch (error) {
                              console.error("Error updating tyLeVay:", error);
                            }
                          }}
                        />
                      </div>
                      {/* input thời hạn vay */}
                      <div>
                        <GreenSlider
                          style={{ marginBottom: "35px" }}
                          aria-label="Pink Slider"
                          defaultValue={tyLeVay}
                          // step={1}
                          min={1}
                          max={35}
                          marks={marksThoiHanVay}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `${value} năm`}
                          value={thoiHanVay}
                          onChange={(_, newValue) => {
                            try {
                              setThoiHanVay(newValue);
                            } catch (error) {
                              console.error(
                                "Error updating thoiHanVay:",
                                error
                              );
                            }
                          }}
                        />
                      </div>
                      {/* input lãi suất */}
                      <div>
                        <PinkSlider
                          style={{ marginBottom: "35px" }}
                          aria-label="Pink Slider"
                          defaultValue={laiSuat}
                          // step={1}
                          min={0}
                          max={20}
                          marks={marksLaiSuatVay}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `${value}%/năm`}
                          value={laiSuat}
                          onChange={(_, newValue) => {
                            try {
                              setLaiSuat(newValue);
                            } catch (error) {
                              console.error("Error updating laiSuat:", error);
                            }
                          }}
                        />
                      </div>
                      {/* input phương thức tính */}
                      <div className="radioPhuongThucTinh" style={{}}>
                        <Radio.Group
                          value={phuongThucTinh}
                          onChange={(e) => setPhuongThucTinh(e.target.value)}
                        >
                          <Radio value="duNoGiamDan">Dư nợ giảm dần</Radio>
                          <Radio value="traDeuTheoThang">
                            Trả đều hàng tháng
                          </Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  </div>
                  {/* biều đồ */}
                  <div
                    className="col mt-4 md-6"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <div className="col md-3" style={{ marginLeft: "160px" }}>
                      <h3>Biểu đồ tổng tiền phải trả</h3>
                      <div
                        className="chart-container"
                        style={{ width: "300px", height: "300px" }}
                      >
                        <canvas ref={thamChieuDenBieuDoTong}></canvas>
                      </div>
                    </div>
                    <div className="col md-3">
                      <h3>Biểu đồ tiền trả tháng đầu</h3>
                      <div
                        className="chart-container"
                        style={{ width: "300px", height: "300px" }}
                      >
                        <canvas ref={thamChieuDenBieuDoThangDau}></canvas>
                      </div>
                    </div>
                  </div>

                  {/*  */}
                  <div>
                    <h5
                      className=""
                      style={{
                        marginTop: "50px",
                        fontSize: "13px",
                        color: "grey",
                        textAlign: "center",
                      }}
                    >
                      Bảng tính chỉ có giá trị tham khảo. Vui lòng liên hệ tư
                      vấn trực tiếp để nhận được thông tin chính xác nhất.
                    </h5>
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
