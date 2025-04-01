import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio } from "antd";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  buildingSelector,
  removeBuilding,
} from "../../redux/reducers/buildingReducer";
import { appVariables } from "../../constants/appVariables";
import { BiCalculator, BiInfoCircle } from "react-icons/bi";
import { IoMdCash } from "react-icons/io";

Chart.register(ChartDataLabels);

const CustomRangeInput = ({
  value,
  min,
  max,
  onChange,
  step = 1,
  color = "#3B82F6",
}) => {
  return (
    <div className="w-100 mb-2">
      <div className="d-flex justify-content-between mb-1">
        <span className="small text-muted">{min}</span>
        <span className="fw-bold" style={{ color }}>
          {value}
        </span>
        <span className="small text-muted">{max}</span>
      </div>
      <input
        type="range"
        className="form-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          accentColor: color,
        }}
      />
    </div>
  );
};

const BuildingStatistical = () => {
  const buildingReducer = useSelector(buildingSelector);
  const dispatch = useDispatch();

  // State for loan calculator
  const [giaNhaDat, setGiaNhaDat] = useState(
    buildingReducer?.building?.typeBuilding?.price || 0
  );
  const [tyLeVay, setTyLeVay] = useState(50);
  const [thoiHanVay, setThoiHanVay] = useState(20);
  const [laiSuat, setLaiSuat] = useState(8);
  const [phuongThucTinh, setPhuongThucTinh] = useState("duNoGiamDan");

  // Chart references
  const thamChieuDenBieuDoTong = useRef(null);
  const thamChieuDenBieuDoThangDau = useRef(null);
  const doiTuongBieuDoTong = useRef(null);
  const doiTuongBieuDoThangDau = useRef(null);

  // Calculation results
  const [duLieuTinhTrenBieuDo, setDuLieuTinhTrenBieuDo] = useState({
    soTienVay: 0,
    tongTienLai: 0,
    tienTraThangDau: 0,
    laiThangDau: 0,
    tienGocThangDau: 0,
  });

  // Update property price when building data changes
  useEffect(() => {
    setGiaNhaDat(buildingReducer?.building?.typeBuilding?.price || 0);
  }, [buildingReducer?.building?.typeBuilding?.price]);

  // Calculate loan details
  const xuLyTinhToan = useCallback(() => {
    const soTienVay = (giaNhaDat * tyLeVay) / 100;
    const laiSuatThang = laiSuat / 100 / 12;
    let tongTienLai = 0;
    let tienTraThangDau = 0;
    let laiThangDau = 0;
    let tienGocThangDau = 0;

    if (phuongThucTinh === "duNoGiamDan") {
      // Declining balance method
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
    } else {
      // Equal monthly payment method
      const soThangVay = thoiHanVay * 12;
      const r = Math.pow(1 + laiSuatThang, soThangVay);
      const tienTraHangThang = (soTienVay * laiSuatThang * r) / (r - 1);
      tienTraThangDau = tienTraHangThang;
      laiThangDau = soTienVay * laiSuatThang;
      tienGocThangDau = tienTraHangThang - laiThangDau;
      tongTienLai = tienTraHangThang * soThangVay - soTienVay;
    }

    setDuLieuTinhTrenBieuDo({
      soTienVay,
      tongTienLai,
      tienTraThangDau,
      laiThangDau,
      tienGocThangDau,
    });
  }, [giaNhaDat, tyLeVay, thoiHanVay, laiSuat, phuongThucTinh]);

  // Create or update charts
  const taoHoacCapNhatBieuDo = useCallback(() => {
    if (thamChieuDenBieuDoTong.current && thamChieuDenBieuDoThangDau.current) {
      const ctxTong = thamChieuDenBieuDoTong.current.getContext("2d");
      const ctxThangDau = thamChieuDenBieuDoThangDau.current.getContext("2d");

      // Destroy existing charts
      if (doiTuongBieuDoTong.current) {
        doiTuongBieuDoTong.current.destroy();
      }
      if (doiTuongBieuDoThangDau.current) {
        doiTuongBieuDoThangDau.current.destroy();
      }

      const tongTienPhaiTra =
        duLieuTinhTrenBieuDo.soTienVay + duLieuTinhTrenBieuDo.tongTienLai;

      doiTuongBieuDoTong.current = new Chart(ctxTong, {
        type: "doughnut",
        data: {
          labels: ["Số tiền vay", "Tổng lãi suất"],
          datasets: [
            {
              data: [
                duLieuTinhTrenBieuDo.soTienVay,
                duLieuTinhTrenBieuDo.tongTienLai,
              ],
              backgroundColor: ["#3B82F6", "#EF4444"],
              borderWidth: 1,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: "circle",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const percentage = ((value / tongTienPhaiTra) * 100).toFixed(
                    1
                  );
                  return `${label}: ${appVariables.formatMoney(
                    value
                  )} (${percentage}%)`;
                },
              },
            },
            datalabels: {
              display: false,
            },
          },
        },
      });

      // Create first month payment chart
      doiTuongBieuDoThangDau.current = new Chart(ctxThangDau, {
        type: "doughnut",
        data: {
          labels: ["Tiền gốc", "Lãi tháng đầu"],
          datasets: [
            {
              data: [
                duLieuTinhTrenBieuDo.tienGocThangDau || 0,
                duLieuTinhTrenBieuDo.laiThangDau || 0,
              ],
              backgroundColor: ["#10B981", "#F59E0B"],
              borderWidth: 1,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: "circle",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const percentage = (
                    (value / duLieuTinhTrenBieuDo.tienTraThangDau) *
                    100
                  ).toFixed(1);
                  return `${label}: ${appVariables.formatMoney(
                    value
                  )} (${percentage}%)`;
                },
              },
            },
            datalabels: {
              display: false,
            },
          },
        },
      });
    }
  }, [duLieuTinhTrenBieuDo]);

  // Run calculations when inputs change
  useEffect(() => {
    xuLyTinhToan();
  }, [xuLyTinhToan]);

  // Update charts when calculations change
  useEffect(() => {
    taoHoacCapNhatBieuDo();
  }, [taoHoacCapNhatBieuDo]);

  // Cleanup charts on unmount
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

  // Cleanup Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(removeBuilding());
    };
  }, [dispatch]);

  return (
    <div className="loan-calculator">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 d-flex align-items-center">
            <BiCalculator className="me-2 text-primary" size={20} />
            Tính lãi suất vay
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Input Section */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="p-3 border rounded bg-light">
                {/* Property Price */}
                <div className="mb-4">
                  <label className="form-label d-flex align-items-center">
                    <IoMdCash className="text-primary me-2" /> Giá nhà đất
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={appVariables.formatMoney(giaNhaDat)}
                      readOnly
                    />
                    <span className="input-group-text">VND</span>
                  </div>
                </div>

                {/* Loan Percentage */}
                <div className="mb-4">
                  <label className="form-label d-flex align-items-center">
                    {/* <MdOutlinePercentage className="text-primary me-2" />  */}
                    Tỉ lệ
                    vay ({tyLeVay}%)
                  </label>
                  <CustomRangeInput
                    min={10}
                    max={90}
                    value={tyLeVay}
                    onChange={setTyLeVay}
                    color="#3B82F6"
                  />
                </div>

                {/* Loan Term */}
                <div className="mb-4">
                  <label className="form-label d-flex align-items-center">
                    {/* <MdOutlineAccessTime className="text-primary me-2" />  */}
                    Thời
                    hạn vay ({thoiHanVay} năm)
                  </label>
                  <CustomRangeInput
                    min={1}
                    max={35}
                    value={thoiHanVay}
                    onChange={setThoiHanVay}
                    color="#10B981"
                  />
                </div>

                {/* Interest Rate */}
                <div className="mb-4">
                  <label className="form-label d-flex align-items-center">
                    {/* <MdOutlinePercentage className="text-primary me-2" />  */}
                    Lãi
                    suất ({laiSuat}%/năm)
                  </label>
                  <CustomRangeInput
                    min={1}
                    max={20}
                    step={0.1}
                    value={laiSuat}
                    onChange={setLaiSuat}
                    color="#EF4444"
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-3">
                  <label className="form-label d-flex align-items-center">
                    <BiCalculator className="text-primary me-2" /> Phương thức
                    tính
                  </label>
                  <Radio.Group
                    value={phuongThucTinh}
                    onChange={(e) => setPhuongThucTinh(e.target.value)}
                    className="d-flex flex-column gap-2"
                  >
                    <Radio value="duNoGiamDan">Dư nợ giảm dần</Radio>
                    <Radio value="traDeuTheoThang">Trả đều hàng tháng</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="col-lg-6">
              <div className="row h-100">
                {/* Summary Cards */}
                <div className="col-12 mb-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-light h-100">
                        <div className="small text-muted mb-1">Số tiền vay</div>
                        <div className="h5 mb-0 text-primary">
                          {appVariables.formatMoney(
                            duLieuTinhTrenBieuDo.soTienVay
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-light h-100">
                        <div className="small text-muted mb-1">
                          Tổng tiền lãi
                        </div>
                        <div className="h5 mb-0 text-danger">
                          {appVariables.formatMoney(
                            duLieuTinhTrenBieuDo.tongTienLai
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-light h-100">
                        <div className="small text-muted mb-1">
                          Tổng tiền phải trả
                        </div>
                        <div className="h5 mb-0 text-success">
                          {appVariables.formatMoney(
                            duLieuTinhTrenBieuDo.soTienVay +
                              duLieuTinhTrenBieuDo.tongTienLai
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-light h-100">
                        <div className="small text-muted mb-1">
                          Tiền trả tháng đầu
                        </div>
                        <div className="h5 mb-0 text-warning">
                          {appVariables.formatMoney(
                            duLieuTinhTrenBieuDo.tienTraThangDau
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="col-12">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-white h-100">
                        <h6 className="text-center mb-3">Tổng chi phí</h6>
                        <div style={{ height: "180px", position: "relative" }}>
                          <canvas ref={thamChieuDenBieuDoTong}></canvas>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-white h-100">
                        <h6 className="text-center mb-3">
                          Thanh toán tháng đầu
                        </h6>
                        <div style={{ height: "180px", position: "relative" }}>
                          <canvas ref={thamChieuDenBieuDoThangDau}></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="d-flex align-items-center justify-content-center text-muted small">
              <BiInfoCircle className="me-1" />
              Bảng tính chỉ có giá trị tham khảo. Vui lòng liên hệ tư vấn trực
              tiếp để nhận được thông tin chính xác nhất.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingStatistical;
