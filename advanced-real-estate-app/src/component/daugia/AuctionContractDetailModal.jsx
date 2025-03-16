import React, { useEffect, useState } from "react";
import auctionDetailModelStyles from "../../assets/css/detail-auction-modal.module.css";
import styles from "../../assets/css/auction-win-detail.module.css";
import styleAuctionWins from "../../assets/css/auction-win.module.css";
import styleAuctionDetails from "../../assets/css/auction-win-detail.module.css";
import { appVariables } from "../../constants/appVariables";
import { Link, useNavigate } from "react-router-dom";
import { f_collectionUtil } from "../../utils/f_collectionUtil";
import { StatusBadge, WinBadge } from "./AuctionWin";
import { elements } from "../element/errorElement";
import { Button, message } from "antd";
import handleAPI from "../../apis/handlAPI";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import styleAuctionContractDetails from "../../assets/css/auction-contract-detail.module.css";
import AuctionContractMessage from "../auctionContract/AuctionContractMessage";
import AuctionContractRealToolTip from "../auctionContract/AuctionContractRealToolTip";
import BuildingLinkDetailToolTip from "../building/BuildingLinkDetailToolTip";
import { buttonStyleElements } from "../../component/element/buttonStyleElement";

const AuctionContractDetailModal = (props) => {
  const auth = useSelector(authSelector);
  const listRoleRequireForManagerPage =
    appVariables.listRoleRequireForManagerPage;
  const contractDate = new Date().toLocaleDateString("vi-VN");
  const auctionDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("vi-VN");
  const [info, setInfo] = useState(null);
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const hasManagement =
    listRoleRequireForManagerPage[0] === auth?.roleUser?.role_type;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    setInfo({
      ...props?.utils?.objectItem,
    });
  }, [props]);

  useEffect(() => {
    console.log("info:", info);
  }, [info]);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const handleViewContract = () => {
    setIsTooltipVisible(true);
  };

  const handleCloseTooltip = () => {
    setIsTooltipVisible(false);
  };

  const handleChooseFileChange = async (event) => {
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

    const formData = new FormData();
    formData.append("contractImageFile", file);

    try {
      const data = await handleAPI(
        `/api/admin/auction-contracts/${info?.id}/confirm`,
        formData,
        "PATCH",
        auth?.token
      );
      props?.utils?.refresh();
      console.log("Upload response:", data);
      message.success(data?.message);
    } catch (error) {
      console.error("Lỗi tải lên:", error);
      message.error(error?.message);
    }
  };

  return (
    <div
      className="modal fade"
      id="auctionContractDetailModal"
      tabIndex={-1}
      aria-labelledby="auctionContractDetailModalLabel"
      aria-hidden="true"
    >
      <div className={`modal-dialog ${styleAuctionContractDetails.modalLarge}`}>
        <div
          className={`modal-content ${styleAuctionContractDetails.modalContent}`}
        >
          <div
            className={`modal-header ${styleAuctionContractDetails.modalHeader}`}
          >
            <i
              className="fa fa-balance-scale text-primary"
              id="exampleModalLabel"
            ></i>
            <b className={styleAuctionContractDetails.modalTitle}>
              {"chi tiết hợp đồng đấu giá".toUpperCase()}
            </b>
            <div style={{ marginLeft: "10px" }}>
              {props?.utils?.objectItem?.result === appVariables.WIN && (
                <WinBadge />
              )}
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div
            className={`modal-body ${styleAuctionContractDetails.modalBody}`}
          >
            <div className={styleAuctionContractDetails.contractSection}>
              <h2 className={styleAuctionContractDetails.contractTitle}>
                Hợp Đồng Đấu Giá
              </h2>

              <div className={styleAuctionContractDetails.contractInfo}>
                <div className={styleAuctionContractDetails.infoItem}>
                  <span className={styleAuctionContractDetails.infoLabel}>
                    Số Hợp Đồng:
                  </span>
                  <span className={styleAuctionContractDetails.infoValue}>
                    AUC-2025-{info?.id}
                  </span>
                </div>
                <div className={styleAuctionContractDetails.infoItem}>
                  <span className={styleAuctionContractDetails.infoLabel}>
                    Ngày Lập:
                  </span>
                  <span className={styleAuctionContractDetails.infoValue}>
                    {info?.settingDate}
                  </span>
                </div>
                <div className={styleAuctionContractDetails.infoItem}>
                  <span className={styleAuctionContractDetails.infoLabel}>
                    Thời gian Đấu Giá:
                  </span>
                  <span className={styleAuctionContractDetails.infoValue}>
                    {`${info?.auctionDetail?.auction?.start_date} 
                      ${info?.auctionDetail?.auction?.start_time}
                     `}
                  </span>
                </div>
              </div>

              <div className={styleAuctionContractDetails.partiesSection}>
                <h3 className={styleAuctionContractDetails.sectionTitle}>
                  Các Bên Tham Gia
                </h3>
                <div className={styleAuctionContractDetails.party}>
                  <h4 className={styleAuctionContractDetails.partyTitle}>
                    Bên A (Đơn Vị Tổ Chức Đấu Giá):
                  </h4>
                  <p>Công Ty CP Đất Xanh Miền Trung</p>
                  <p>Địa chỉ: 03 Quang Trung, Hải Châu, TP. Đà Nẵng</p>
                  <p>Đại diện: Ông/Bà Nguyễn Ngọc Khánh</p>
                </div>
                <div className={styleAuctionContractDetails.party}>
                  <h4 className={styleAuctionContractDetails.partyTitle}>
                    Bên B (Người Tham Gia Đấu Giá):
                  </h4>
                  <p>Họ tên: {info?.full_name || "Chưa xác định"}</p>
                  <p>
                    CMND/CCCD:{" "}
                    {<img width={"30%"} src={`${info?.cccd_front}`} /> ||
                      "Chưa xác định"}
                  </p>
                  <p>Địa chỉ: {info?.address || "Chưa xác định"}</p>
                </div>
              </div>

              <div className={styleAuctionContractDetails.auctionDetails}>
                <h3 className={styleAuctionContractDetails.sectionTitle}>
                  Chi Tiết Đấu Giá
                </h3>
                <div className={styleAuctionContractDetails.detailItem}>
                  <span className={styleAuctionContractDetails.detailLabel}>
                    Tài Sản Đấu Giá:
                  </span>
                  <span className={styleAuctionContractDetails.detailValue}>
                    <BuildingLinkDetailToolTip
                      buildingId={
                        info?.auctionDetail?.building?.id || "Chưa xác định"
                      }
                      buildingName={
                        info?.auctionDetail?.building?.name || "Chưa xác định"
                      }
                      auctionHouseInfo={{
                        name: info?.auctionDetail?.building?.name,
                        address: info?.auctionDetail?.building?.map?.address,
                        phone: "0915662495",
                      }}
                    />
                  </span>
                </div>
                <div className={styleAuctionContractDetails.detailItem}>
                  <span className={styleAuctionContractDetails.detailLabel}>
                    Giá Khởi Điểm:
                  </span>
                  <span className={styleAuctionContractDetails.detailValue}>
                    {appVariables.formatMoney(
                      info?.auctionDetail?.building?.typeBuilding?.price
                    ) || appVariables.formatMoney(0)}
                  </span>
                </div>
                <div className={styleAuctionContractDetails.detailItem}>
                  <span className={styleAuctionContractDetails.detailLabel}>
                    Giá Trúng Đấu Giá:
                  </span>
                  <span className={styleAuctionContractDetails.detailValue}>
                    {appVariables.formatMoney(info?.auctionDetail?.bidAmount) ||
                      appVariables.formatMoney(0)}
                  </span>
                </div>

                {hasManagement && (
                  <div className={styleAuctionContractDetails.detailItem}>
                    <span className={styleAuctionContractDetails.detailLabel}>
                      Tải ảnh hợp đồng thực lên:
                    </span>
                    <span className={styleAuctionContractDetails.detailValue}>
                      <input
                        type="file"
                        id="contractImage"
                        className={styleAuctionDetails.input}
                        placeholder="Chọn căn cước công dân mặt sau"
                        name={"contractImage"}
                        onChange={handleChooseFileChange}
                      />
                    </span>
                  </div>
                )}
              </div>

              <div className={styleAuctionContractDetails.termsSection}>
                <h4 className={styleAuctionContractDetails.sectionTitle}>
                  Điều Khoản và Điều Kiện
                </h4>
                <ol className={styleAuctionContractDetails.termsList}>
                  <li>
                    Bên B đồng ý mua tài sản đấu giá với giá trúng đấu giá nêu
                    trên.
                  </li>
                  <li>
                    Bên B phải thanh toán đầy đủ số tiền trúng đấu giá trong
                    vòng 3 ngày làm việc kể từ ngày ký hợp đồng.
                  </li>
                  <li>
                    Bên A có trách nhiệm bàn giao tài sản cho Bên B trong vòng 7
                    ngày sau khi nhận đủ tiền.
                  </li>
                  <li>
                    Mọi tranh chấp sẽ được giải quyết thông qua thương lượng
                    hoặc tòa án có thẩm quyền.
                  </li>
                </ol>
              </div>

              <div className={styleAuctionContractDetails.signatureSection}>
                <div className={styleAuctionContractDetails.signature}>
                  <p>Đại diện Bên A</p>
                  <div
                    className={styleAuctionContractDetails.signatureLine}
                  ></div>
                </div>
                <div className={styleAuctionContractDetails.signature}>
                  <p>Bên B</p>
                  <div
                    className={styleAuctionContractDetails.signatureLine}
                  ></div>
                </div>
              </div>
              <br />
              <br />
              <div className={styleAuctionContractDetails.termsSection}>
                <ul
                  style={{ listStyle: "none" }}
                  className={styleAuctionContractDetails.termsList}
                >
                  <li>
                    {info?.contractStatus === appVariables.PENDING ? (
                      <AuctionContractMessage
                        late={f_collectionUtil.checkContractTimeExceeded(
                          info?.settingDate
                        )}
                        info={info}
                      />
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className={`modal-footer ${styleAuctionContractDetails.modalFooter}`}
          >
            {info?.contractStatus !== appVariables.PENDING && (
              <WinBadge message={"Hợp đồng đã được nhân viên xác nhận"} />
            )}
            {info?.contractStatus !== appVariables.PENDING && (
              <StaffStatus
                trangThaiSoSanh={appVariables.YET_CONFIRM}
                message={`Nhân viên ${info?.staffConfirm?.user_name} xác nhận`}
                styles={styleAuctionWins}
                status={info?.auctionDetail?.status}
              />
            )}
            <AuctionContractRealToolTip
              contractImage={info?.contractImage}
              cccdfrontImage={info?.cccd_front}
              cccdBackImage={info?.cccd_back}
              avatar={info?.avatar}
              isVisible={isTooltipVisible}
              onClose={handleCloseTooltip}
            />
            <Button
              onClick={handleViewContract}
              style={buttonStyleElements?.confirmButtonStyle}
            >
              {"XEM ẢNH TRONG HỢP ĐỒNG"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffStatus = (props) => {
  return (
    <span
      className={`${props.styles.status} 
        ${
          props?.status === props?.trangThaiSoSanh
            ? props.styles.pending
            : props.styles.confirmed
        }`}
    >
      {props?.message}
    </span>
  );
};

export default AuctionContractDetailModal;