import React, { useEffect, useState } from "react";
import auctionDetailModelStyles from "../../assets/css/detail-auction-modal.module.css";
import styles from "../../assets/css/auction-win-detail.module.css";
import styleAuctionWins from "../../assets/css/auction-win.module.css";
import { appVariables } from "../../constants/appVariables";
import { Link, useNavigate } from "react-router-dom";
import { f_collectionUtil } from "../../utils/f_collectionUtil";
import { StatusBadge, WinBadge } from "./AuctionWin";
import { errorElements } from "../element/errorElement";
import { Button, message } from "antd";
import handleAPI from "../../apis/handlAPI";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";

const AuctionWinDetailModal = (props) => {
  const auth = useSelector(authSelector);
  const [info, setInfo] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setInfo({
      ...props?.utils?.objectItem?.client,
      clientId: props?.utils?.objectItem?.client?.id,
      auctionDetailId: props?.utils?.objectItem?.id,
      note: "",
    });
  }, [props]);

  useEffect(() => {
    setIsDisabled(Object.values(errorMessages).some((error) => error));
  }, [errorMessages]);

  useEffect(() => {
    console.log("Props: ", props);
  }, [props]);

  useEffect(() => {
    console.log("Info: ", info);
  }, [info]);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = f_collectionUtil.validateField(name, value);

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    if (!error) {
      setInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  const handleChooseFileChange = (event) => {
    const { name, files: fileList } = event.target;

    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];

    if (!file.type.startsWith("image/")) {
      message.error(`File ${name} phải là hình ảnh!`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error(`File ${name} không được vượt quá 5MB!`);
      return;
    }
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles, [name]: file };
      console.log("Updated files:", updatedFiles);
      return updatedFiles;
    });
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prevPreviews) => ({
      ...prevPreviews,
      [name]: previewUrl,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!files.cccd_front || !files.cccd_back || !files.avatar) {
      message.error("Vui lòng chọn đầy đủ các ảnh yêu cầu!");
      return;
    }
    setIsUploading(true);
    try {
      const { user_name, phone_number, birthday, address } = info;
      const formData = new FormData();
      formData.append("full_name", user_name);
      formData.append("phone_number", phone_number);
      formData.append("birthday", birthday);
      formData.append("address", address);
      formData.append("cccd_front", files?.cccd_front);
      formData.append("cccd_back", files?.cccd_back);
      formData.append("avatar", files?.avatar);
      formData.append("clientId", info?.clientId);
      formData.append("auctionDetailId", info?.auctionDetailId);
      formData.append("note", info?.note);
      const data = await handleAPI(
        `/api/admin/auction-contracts`,
        formData,
        "POST",
        auth?.token
      );
      if (data?.error) {
        message.error(data?.error);
        return;
      }
      console.log("data: ", data);
      message.success(data?.message);
    } catch (error) {
      message?.error(`ERROR: ${error.message || "Không xác định"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="auctionWinDetailModal"
      tabIndex={-1}
      aria-labelledby="auctionWinDetailModalLabel"
      aria-hidden="true"
    >
      <div className={`modal-dialog ${styles.modalLarge}`}>
        <div className={`modal-content ${styles.modalContent}`}>
          <div className={`modal-header ${styles.modalHeader}`}>
            <i
              className="fa fa-balance-scale text-primary"
              id="exampleModalLabel"
            ></i>
            <b className={styles.modalTitle}>
              {"chi tiết hợp đồng đấu giá".toUpperCase()}
            </b>
            <div style={{ marginLeft: "10px" }}>
              {props?.utils?.objectItem?.result === appVariables.WIN && (
                <WinBadge message={"Chiến thắng"} />
              )}
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className={`modal-body ${styles.modalBody}`}>
            <div className={styles.contractSection}>
              <h6 className={styles.sectionTitle}>
                {"Thủ tục pháp lý".toUpperCase()}
              </h6>
              <p>
                <span style={{ color: "red" }}>{"* "}</span>
                <span
                  style={{
                    color: "red",
                    fontSize: "13px",
                  }}
                >
                  Lưu ý: Vui lòng nhập vào hoặc chỉnh sửa lại chính xác và trung
                  thực thông tin cá nhận của bạn để chúng tôi xác thực danh tính
                  của bạn và tiến tới ký kết hợp đồng đấu giá với bạn
                </span>
              </p>
              <div className={styles.inputGroup}>
                <label htmlFor="user_name" className={styles.label}>
                  Họ và tên:
                </label>
                <input
                  type="text"
                  id="user_name"
                  className={styles.input}
                  placeholder="Nhập họ và tên"
                  name={"user_name"}
                  value={info?.user_name}
                  onChange={handleChange}
                />
                <span className={styles.errorText}>
                  {errorElements?.forAuctionWinDetailModal?.errorMessage(
                    errorMessages?.user_name
                  )}
                </span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone_number" className={styles.label}>
                  Số điện thoại:
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  className={styles.input}
                  placeholder="Nhập số điện thoại"
                  name={"phone_number"}
                  value={info?.phone_number}
                  onChange={handleChange}
                />
                <span className={styles.errorText}>
                  {errorElements?.forAuctionWinDetailModal?.errorMessage(
                    errorMessages?.phone_number
                  )}
                </span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="birthday" className={styles.label}>
                  Ngày sinh:
                </label>
                <input
                  type="date"
                  id="birthday"
                  className={styles.input}
                  name={"birthday"}
                  value={info?.birthday}
                  onChange={handleChange}
                />
                <span className={styles.errorText}>
                  {errorElements?.forAuctionWinDetailModal?.errorMessage(
                    errorMessages?.birthday
                  )}
                </span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="address" className={styles.label}>
                  Địa chỉ:
                </label>
                <input
                  type="text"
                  id="address"
                  className={styles.input}
                  placeholder="Nhập địa chỉ"
                  name={"address"}
                  value={info?.address}
                  onChange={handleChange}
                />
                <span className={styles.errorText}>
                  {errorElements?.forAuctionWinDetailModal?.errorMessage(
                    errorMessages?.address
                  )}
                </span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="note" className={styles.label}>
                  Lời nhắn:
                </label>
                <textarea
                  type="text"
                  id="note"
                  className={styles.input}
                  placeholder="Nhập lời nhắn"
                  name={"note"}
                  value={info?.note}
                  onChange={handleChange}
                />
                <span className={styles.errorText}>
                  {errorElements?.forAuctionWinDetailModal?.errorMessage(
                    errorMessages?.note
                  )}
                </span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="cccd_front" className={styles.label}>
                  Căn cước công dân mặt trước:
                </label>
                <input
                  type="file"
                  id="cccd_front"
                  className={styles.input}
                  placeholder="Chọn căn cước công dân mặt trước"
                  name={"cccd_front"}
                  onChange={handleChooseFileChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="cccd_back" className={styles.label}>
                  Căn cước công dân mặt sau:
                </label>
                <input
                  type="file"
                  id="cccd_back"
                  className={styles.input}
                  placeholder="Chọn căn cước công dân mặt sau"
                  name={"cccd_back"}
                  onChange={handleChooseFileChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="avatar" className={styles.label}>
                  Ảnh chân dung của bạn:
                </label>
                <input
                  type="file"
                  id="avatar"
                  className={styles.input}
                  placeholder="Chọn ảnh chân dung"
                  name={"avatar"}
                  onChange={handleChooseFileChange}
                />
              </div>
            </div>

            <div className={styles.contractSection}>
              <h6 className={styles.sectionTitle}>Thông Tin Phiên Đấu Giá</h6>
              <div className={styles.infoItem}>
                <i className={`fa fa-balance-scale ${styles.icon}`}></i>
                <span className={styles.label}>Phiên:</span>
                <span>{props?.utils?.objectItem?.auction?.name}</span>
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-calendar ${styles.icon}`}></i>
                <span className={styles.label}>Ngày bắt đầu:</span>
                <span>{props?.utils?.objectItem?.auction?.start_date}</span>
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-clock ${styles.icon}`}></i>
                <span className={styles.label}>Thời hạn đấu giá:</span>
                {f_collectionUtil?.calculateDuration(
                  props?.utils?.objectItem?.auction?.start_date,
                  props?.utils?.objectItem?.auction?.start_time,
                  props?.utils?.objectItem?.auction?.end_time
                )}
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-money ${styles.icon}`}></i>
                <span className={styles.label}>Số tiền đấu giá:</span>
                {appVariables.formatMoney(props?.utils?.objectItem?.bidAmount)}
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-circle ${styles.icon}`}></i>
                <span className={styles.label}>Trạng thái:</span>
                <StatusBadge
                  trangThaiSoSanh={appVariables.YET_CONFIRM}
                  tranThaiTruyenVao={"Chưa xác nhận"}
                  status={props?.utils?.objectItem?.status}
                  styles={styleAuctionWins}
                />
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-trophy ${styles.icon}`}></i>
                <span className={styles.label}>Kết quả:</span>
                {props?.utils?.objectItem?.result === appVariables.WIN && (
                  <WinBadge message={"Chiến thắng"} />
                )}
              </div>
            </div>

            <div className={styles.contractSection}>
              <h6 className={styles.sectionTitle}>Thông Tin Bất Động Sản</h6>
              <div className={styles.infoItem}>
                <i className={`fa fa-home ${styles.icon}`}></i>
                <span className={styles.label}>Loại bất động sản:</span>
                <span>
                  {props?.utils?.objectItem?.typeBuildingResponse?.type_name}
                </span>
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-arrows ${styles.icon}`}></i>
                <span className={styles.label}>Diện tích:</span>
                <span>{props?.utils?.objectItem?.building?.area} m²</span>
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-building ${styles.icon}`}></i>
                <span className={styles.label}>Số tầng:</span>
                <span>
                  {props?.utils?.objectItem?.building?.number_of_basement}
                </span>
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-money ${styles.icon}`}></i>
                <span className={styles.label}>Giá khởi điểm:</span>
                <span>
                  {appVariables.formatMoney(
                    props?.utils?.objectItem?.typeBuildingResponse?.price
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-map-marker ${styles.icon}`}></i>
                <span className={styles.label}>Địa chỉ:</span>
                <span>{props?.utils?.objectItem?.building?.map?.address}</span>
              </div>
              <div className={styles.infoItem}>
                <i className={`fa fa-briefcase ${styles.icon}`}></i>
                <span className={styles.label}>Tính pháp lý:</span>
                <span>Sổ đỏ đầy đủ</span>
              </div>
              <div className={styles.infoItem}>
                <b
                  style={{
                    color: "#FEA116",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const modalElement = document.getElementById(
                      "auctionWinDetailModal"
                    );
                    if (modalElement) {
                      modalElement.classList.remove("show");
                      modalElement.setAttribute("aria-hidden", "true");
                      modalElement.style.display = "none";
                      const backdrop =
                        document.querySelector(".modal-backdrop");
                      if (backdrop) {
                        backdrop.remove();
                      }
                    }
                    window.location.href = `/buildings/${props?.utils?.objectItem?.building?.id}`;
                  }}
                >
                  XEM CHI TIẾT NHÀ
                </b>
              </div>
            </div>
          </div>
          <div className={`modal-footer ${styles.modalFooter}`}>
            <Button
              className={"btn btn-success"}
              disabled={isDisabled}
              onClick={handleSubmit}
            >
              {"Hoàn thành thủ tục"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionWinDetailModal;
