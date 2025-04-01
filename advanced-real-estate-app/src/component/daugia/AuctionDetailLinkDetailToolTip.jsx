import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StatusBadge, WinBadge } from "./AuctionWin";
import { useDispatch, useSelector } from "react-redux";
import { appVariables } from "../../constants/appVariables";
import styleAuctionWins from "../../assets/css/auction-win.module.css";
import styles from "../../assets/css/building-link-with-tooltip.module.css";
import { BsTrophy } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa";

const AuctionDetailLinkDetailToolTip = (props) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const showTooltip = () => setIsTooltipVisible(true);
  const hideTooltip = () => setIsTooltipVisible(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <Link
        to={"/admin/auction"}
        className={`${styles.link} ${props?.className || ""}`}
      >
        <span>{props?.auctionName}</span>
      </Link>

      {isTooltipVisible && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.tooltipHeader}>Thông tin phiên đấu giá</div>
          <div className={styles.tooltipContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tên phiên đấu giá:</span>
              <span className={styles.infoValue}>
                {props?.auctionName || "Chưa cập nhật"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Nhà đấu giá:</span>
              <span className={styles.infoValue}>
                {props?.buildingName || "Chưa cập nhật"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Giá trúng đấu giá:</span>
              <span className={styles.infoValue}>
                {props?.bidAmount || "Chưa cập nhật"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Trạng thái:</span>
              <span className={styles.infoValue}>
                <StatusBadge
                  trangThaiSoSanh={appVariables.YET_CONFIRM}
                  tranThaiTruyenVao={"Chưa xác nhận"}
                  styles={styleAuctionWins}
                  status={props?.status}
                />
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Kết quả:</span>
              <span className={styles.infoValue}>
                {props?.result === appVariables.WIN && (
                  <WinBadge icon={<FaTrophy />} message={"Chiến thắng"} />
                )}
              </span>
            </div>
            <hr style={{ margin: "10px 0px 0px 0px" }} />
            <Link to={"/admin/auction"} className={styles.detailsLink}>
              Xem chi tiết
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetailLinkDetailToolTip;
