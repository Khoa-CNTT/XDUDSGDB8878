import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/css/building-link-with-tooltip.module.css";

const AuctionLinkDetailToolTip = (props) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const showTooltip = () => setIsTooltipVisible(true);
  const hideTooltip = () => setIsTooltipVisible(false);

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <Link
        onClick={() => (window.location.href = `/dau-gia`)}
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
              <span className={styles.infoLabel}>Giá gốc:</span>
              <span className={styles.infoValue}>
                {props?.originPrice || "Chưa cập nhật"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Thời gian đấu giá:</span>
              <span className={styles.infoValue}>
                {props?.date || "Chưa cập nhật"}
              </span>
            </div>
            <hr style={{ margin: "10px 0px 0px 0px" }} />
            <Link
              onClick={() => (window.location.href = `/dau-gia`)}
              className={styles.detailsLink}
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionLinkDetailToolTip;