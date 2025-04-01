import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
  FileTextOutlined,
  IdcardOutlined,
  CameraOutlined,
  TrophyOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { appVariables } from "../../constants/appVariables";
import { f_collectionUtil } from "../../utils/f_collectionUtil";
import { StatusBadge, WinBadge } from "./AuctionWin";
import { errorElements } from "../element/errorElement";
import handleAPI from "../../apis/handlAPI";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import styles from "../../assets/css/auction-win-detail.module.css";
import { IoMdTrophy } from "react-icons/io";

const AuctionWinDetailModal = ({ utils }) => {
  const auth = useSelector(authSelector);
  const [info, setInfo] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const isOpen = utils?.isOpen || false;
  const objectItem = utils?.objectItem || {};
  const onClose = utils?.onClose || (() => {});

  useEffect(() => {
    if (utils?.objectItem?.client) {
      setInfo({
        ...utils.objectItem.client,
        clientId: utils.objectItem.client.id,
        auctionDetailId: utils.objectItem.id,
        note: "",
      });
    }
    console.log(utils?.objectItem);
    
  }, [utils?.objectItem]);

  useEffect(() => {
    setIsDisabled(Object.values(errorMessages).some((error) => error));
  }, [errorMessages]);

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
      message.success(data?.message);
      onClose();
    } catch (error) {
      if (error?.code >= 302 && error?.code <= 400) {
        message.error("Bạn đã tạo hợp đồng cho đơn đấu giá chiến thắng này!");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const viewPropertyDetails = () => {
    onClose();
    if (objectItem?.building?.id) {
      window.location.href = `/buildings/${objectItem.building.id}`;
    }
  };

  return (
    <>
      {isOpen && info && (
        <div className={styles.modalBackdrop_AuctionWinDetail}>
          <div className={styles.modalDialog_AuctionWinDetail}>
            <div className={styles.modalContent_AuctionWinDetail}>
              <div className={styles.modalHeader_AuctionWinDetail}>
                <div className={styles.headerContent_AuctionWinDetail}>
                  <TrophyOutlined
                    className={styles.headerIcon_AuctionWinDetail}
                  />
                  <h5 className={styles.modalTitle_AuctionWinDetail}>
                    {"TẠO HỢP ĐỒNG ĐẤU GIÁ"}
                  </h5>
                </div>
                <button
                  type="button"
                  className={styles.closeButton_AuctionWinDetail}
                  onClick={onClose}
                  aria-label="Close"
                >
                  <CloseOutlined />
                </button>
              </div>

              <div className={styles.modalBody_AuctionWinDetail}>
                <div className={styles.contractSection_AuctionWinDetail}>
                  <div className={styles.sectionHeader_AuctionWinDetail}>
                    <FileTextOutlined
                      className={styles.sectionIcon_AuctionWinDetail}
                    />
                    <h6 className={styles.sectionTitle_AuctionWinDetail}>
                      THỦ TỤC PHÁP LÝ
                    </h6>
                  </div>

                  <div className={styles.warningNote_AuctionWinDetail}>
                    <InfoCircleOutlined
                      className={styles.warningIcon_AuctionWinDetail}
                    />
                    <p>
                      Vui lòng nhập vào hoặc chỉnh sửa lại chính xác và trung
                      thực thông tin cá nhân để chúng tôi xác thực danh tính và
                      tiến tới ký kết hợp đồng đấu giá với bạn
                    </p>
                  </div>

                  <div className={styles.formGrid_AuctionWinDetail}>
                    <div className={styles.formGroup_AuctionWinDetail}>
                      <label
                        htmlFor="user_name"
                        className={styles.label_AuctionWinDetail}
                      >
                        <UserOutlined /> Họ và tên:
                      </label>
                      <input
                        type="text"
                        id="user_name"
                        className={styles.input_AuctionWinDetail}
                        placeholder="Nhập họ và tên"
                        name="user_name"
                        value={info?.user_name || ""}
                        onChange={handleChange}
                      />
                      {errorMessages?.user_name && (
                        <span className={styles.errorText_AuctionWinDetail}>
                          {errorElements?.forAuctionWinDetailModal?.errorMessage(
                            errorMessages?.user_name
                          )}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup_AuctionWinDetail}>
                      <label
                        htmlFor="phone_number"
                        className={styles.label_AuctionWinDetail}
                      >
                        <PhoneOutlined /> Số điện thoại:
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        className={styles.input_AuctionWinDetail}
                        placeholder="Nhập số điện thoại"
                        name="phone_number"
                        value={info?.phone_number || ""}
                        onChange={handleChange}
                      />
                      {errorMessages?.phone_number && (
                        <span className={styles.errorText_AuctionWinDetail}>
                          {errorElements?.forAuctionWinDetailModal?.errorMessage(
                            errorMessages?.phone_number
                          )}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup_AuctionWinDetail}>
                      <label
                        htmlFor="birthday"
                        className={styles.label_AuctionWinDetail}
                      >
                        <CalendarOutlined /> Ngày sinh:
                      </label>
                      <input
                        type="date"
                        id="birthday"
                        className={styles.input_AuctionWinDetail}
                        name="birthday"
                        value={info?.birthday || ""}
                        onChange={handleChange}
                      />
                      {errorMessages?.birthday && (
                        <span className={styles.errorText_AuctionWinDetail}>
                          {errorElements?.forAuctionWinDetailModal?.errorMessage(
                            errorMessages?.birthday
                          )}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup_AuctionWinDetail}>
                      <label
                        htmlFor="address"
                        className={styles.label_AuctionWinDetail}
                      >
                        <HomeOutlined /> Địa chỉ:
                      </label>
                      <input
                        type="text"
                        id="address"
                        className={styles.input_AuctionWinDetail}
                        placeholder="Nhập địa chỉ"
                        name="address"
                        value={info?.address || ""}
                        onChange={handleChange}
                      />
                      {errorMessages?.address && (
                        <span className={styles.errorText_AuctionWinDetail}>
                          {errorElements?.forAuctionWinDetailModal?.errorMessage(
                            errorMessages?.address
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroup_AuctionWinDetail}>
                    <label
                      htmlFor="note"
                      className={styles.label_AuctionWinDetail}
                    >
                      <FileTextOutlined /> Lời nhắn:
                    </label>
                    <textarea
                      id="note"
                      className={styles.textarea_AuctionWinDetail}
                      placeholder="Nhập lời nhắn"
                      name="note"
                      value={info?.note || ""}
                      onChange={handleChange}
                      rows={3}
                    />
                    {errorMessages?.note && (
                      <span className={styles.errorText_AuctionWinDetail}>
                        {errorElements?.forAuctionWinDetailModal?.errorMessage(
                          errorMessages?.note
                        )}
                      </span>
                    )}
                  </div>

                  <div
                    className={styles.documentUploadSection_AuctionWinDetail}
                  >
                    <h6 className={styles.uploadTitle_AuctionWinDetail}>
                      Tải lên giấy tờ
                    </h6>

                    <div className={styles.uploadGrid_AuctionWinDetail}>
                      <div className={styles.uploadItem_AuctionWinDetail}>
                        <label
                          htmlFor="cccd_front"
                          className={styles.uploadLabel_AuctionWinDetail}
                        >
                          <IdcardOutlined /> CCCD mặt trước
                        </label>
                        <div
                          className={styles.uploadContainer_AuctionWinDetail}
                        >
                          <input
                            type="file"
                            id="cccd_front"
                            className={styles.fileInput_AuctionWinDetail}
                            name="cccd_front"
                            onChange={handleChooseFileChange}
                            accept="image/*"
                          />
                          <div className={styles.uploadBox_AuctionWinDetail}>
                            {previews.cccd_front ? (
                              <img
                                src={previews.cccd_front || "/placeholder.svg"}
                                alt="CCCD mặt trước"
                                className={styles.previewImage_AuctionWinDetail}
                              />
                            ) : (
                              <>
                                <IdcardOutlined
                                  className={styles.uploadIcon_AuctionWinDetail}
                                />
                                <span>Chọn ảnh</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.uploadItem_AuctionWinDetail}>
                        <label
                          htmlFor="cccd_back"
                          className={styles.uploadLabel_AuctionWinDetail}
                        >
                          <IdcardOutlined /> CCCD mặt sau
                        </label>
                        <div
                          className={styles.uploadContainer_AuctionWinDetail}
                        >
                          <input
                            type="file"
                            id="cccd_back"
                            className={styles.fileInput_AuctionWinDetail}
                            name="cccd_back"
                            onChange={handleChooseFileChange}
                            accept="image/*"
                          />
                          <div className={styles.uploadBox_AuctionWinDetail}>
                            {previews.cccd_back ? (
                              <img
                                src={previews.cccd_back || "/placeholder.svg"}
                                alt="CCCD mặt sau"
                                className={styles.previewImage_AuctionWinDetail}
                              />
                            ) : (
                              <>
                                <IdcardOutlined
                                  className={styles.uploadIcon_AuctionWinDetail}
                                />
                                <span>Chọn ảnh</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.uploadItem_AuctionWinDetail}>
                        <label
                          htmlFor="avatar"
                          className={styles.uploadLabel_AuctionWinDetail}
                        >
                          <CameraOutlined /> Ảnh chân dung
                        </label>
                        <div
                          className={styles.uploadContainer_AuctionWinDetail}
                        >
                          <input
                            type="file"
                            id="avatar"
                            className={styles.fileInput_AuctionWinDetail}
                            name="avatar"
                            onChange={handleChooseFileChange}
                            accept="image/*"
                          />
                          <div className={styles.uploadBox_AuctionWinDetail}>
                            {previews.avatar ? (
                              <img
                                src={previews.avatar || "/placeholder.svg"}
                                alt="Ảnh chân dung"
                                className={styles.previewImage_AuctionWinDetail}
                              />
                            ) : (
                              <>
                                <CameraOutlined
                                  className={styles.uploadIcon_AuctionWinDetail}
                                />
                                <span>Chọn ảnh</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSectionsContainer_AuctionWinDetail}>
                  <div className={styles.contractSection_AuctionWinDetail}>
                    <div className={styles.sectionHeader_AuctionWinDetail}>
                      <TrophyOutlined
                        className={styles.sectionIcon_AuctionWinDetail}
                      />
                      <h6 className={styles.sectionTitle_AuctionWinDetail}>
                        THÔNG TIN PHIÊN ĐẤU GIÁ
                      </h6>
                    </div>

                    <div className={styles.infoGrid_AuctionWinDetail}>
                      <div className={styles.infoItem_AuctionWinDetail}>
                        <TrophyOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Phiên:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.auction?.name}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <CalendarOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Ngày bắt đầu:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.auction?.start_date}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <CalendarOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Thời hạn:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.auction?.start_date &&
                            objectItem?.auction?.start_time &&
                            objectItem?.auction?.end_time &&
                            f_collectionUtil?.calculateDuration(
                              objectItem.auction.start_date,
                              objectItem.auction.start_time,
                              objectItem.auction.end_time
                            )}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <DollarOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Số tiền đấu giá:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.bidAmount &&
                            appVariables.formatMoney(objectItem.bidAmount)}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <InfoCircleOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Trạng thái:
                        </span>
                        {objectItem?.status !== undefined && (
                          <StatusBadge
                            trangThaiSoSanh={appVariables.YET_CONFIRM}
                            tranThaiTruyenVao={"Chưa xác nhận"}
                            status={objectItem.status}
                          />
                        )}
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <TrophyOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Kết quả:
                        </span>
                        {objectItem?.result === appVariables.WIN && (
                          <WinBadge icon={<IoMdTrophy/>} message={"Chiến thắng"} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.contractSection_AuctionWinDetail}>
                    <div className={styles.sectionHeader_AuctionWinDetail}>
                      <HomeOutlined
                        className={styles.sectionIcon_AuctionWinDetail}
                      />
                      <h6 className={styles.sectionTitle_AuctionWinDetail}>
                        THÔNG TIN BẤT ĐỘNG SẢN
                      </h6>
                    </div>

                    <div className={styles.infoGrid_AuctionWinDetail}>
                      <div className={styles.infoItem_AuctionWinDetail}>
                        <HomeOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Loại BĐS:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.typeBuildingResponse?.type_name}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <span
                          className={`${styles.infoIcon_AuctionWinDetail} ${styles.areaIcon_AuctionWinDetail}`}
                        >
                          m²
                        </span>
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Diện tích:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.building?.area &&
                            `${objectItem.building.area} m²`}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <HomeOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Số tầng:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.building?.number_of_basement}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <DollarOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Giá khởi điểm:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.typeBuildingResponse?.price &&
                            appVariables.formatMoney(
                              objectItem.typeBuildingResponse.price
                            )}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <EnvironmentOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Địa chỉ:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          {objectItem?.building?.map?.address}
                        </span>
                      </div>

                      <div className={styles.infoItem_AuctionWinDetail}>
                        <SafetyCertificateOutlined
                          className={styles.infoIcon_AuctionWinDetail}
                        />
                        <span className={styles.infoLabel_AuctionWinDetail}>
                          Tính pháp lý:
                        </span>
                        <span className={styles.infoValue_AuctionWinDetail}>
                          Sổ đỏ đầy đủ
                        </span>
                      </div>
                    </div>

                    {objectItem?.building?.id && (
                      <button
                        className={styles.viewPropertyButton_AuctionWinDetail}
                        onClick={viewPropertyDetails}
                      >
                        <HomeOutlined /> XEM CHI TIẾT NHÀ
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter_AuctionWinDetail}>
                <Button
                  type="primary"
                  className={styles.submitButton_AuctionWinDetail}
                  disabled={isDisabled || isUploading}
                  onClick={handleSubmit}
                  loading={isUploading}
                >
                  {isUploading ? "Đang xử lý..." : "Hoàn thành thủ tục"}
                </Button>

                <Button
                  className={styles.cancelButton_AuctionWinDetail}
                  onClick={onClose}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AuctionWinDetailModal;
