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
import {
  BlueSliderBuildingStatistical,
  GreenSliderBuildingStatistical,
  PinkSliderBuildingStatistical,
} from "../element/statisticalElement";

Chart.register(ChartDataLabels);

const BuildingStatistical = (props) => {
  const buildingReducer = useSelector(buildingSelector);
  const dispatch = useDispatch();
  //thanh trượt cho hiển thị biểu đồ

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
    buildingReducer?.building?.typeBuilding?.price || 0
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

  // useEffect cho hiển thị biểu đồ
  useEffect(() => {
    setGiaNhaDat(buildingReducer?.building?.typeBuilding?.price || 0);
  }, [buildingReducer?.building?.typeBuilding?.price]);

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
                "#06B6D4", //#EF4444
                "#EF4444",
                "#1C77BE", //#06B6D4
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

  useEffect(() => {
    return () => {
      dispatch(removeBuilding());
    };
  }, []);

  return (
    <div>
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
            <label style={{ marginBottom: "48px" }}>Giá nhà đất </label>
            <label style={{ marginBottom: "48px" }}>Tỉ lệ vay (%/năm)</label>
            <label style={{ marginBottom: "48px" }}>Thời hạn vay</label>
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
                  value={appVariables.formatMoney(giaNhaDat)}
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
              <BlueSliderBuildingStatistical
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
              <GreenSliderBuildingStatistical
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
                    console.error("Error updating thoiHanVay:", error);
                  }
                }}
              />
            </div>
            {/* input lãi suất */}
            <div>
              <PinkSliderBuildingStatistical
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
                <Radio value="traDeuTheoThang">Trả đều hàng tháng</Radio>
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
          <div className="col md-3" style={{ marginLeft: "120px" }}>
            <h3>Biểu đồ tổng tiền phải trả</h3>
            <div
              className="chart-container"
              style={{ width: "300px", height: "300px" }}
            >
              <canvas ref={thamChieuDenBieuDoTong}></canvas>
            </div>
          </div>
          <div className="col md-3" style={{ marginLeft: "110px" }}>
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
            Bảng tính chỉ có giá trị tham khảo. Vui lòng liên hệ tư vấn trực
            tiếp để nhận được thông tin chính xác nhất.
          </h5>
        </div>
      </div>
    </div>
  );
};

export default BuildingStatistical;
