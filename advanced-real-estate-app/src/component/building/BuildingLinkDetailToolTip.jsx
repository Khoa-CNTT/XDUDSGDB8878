import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/css/building-link-with-tooltip.module.css";

export function BuildingLinkDetailToolTip(props) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

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
        onClick={() =>
          (window.location.href = `/buildings/${props?.buildingId}`)
        }
        className={`${styles.link} ${props?.className || ""}`}
      >
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <path d="M9 22v-4h6v4"></path>
          <path d="M8 6h.01"></path>
          <path d="M16 6h.01"></path>
          <path d="M12 6h.01"></path>
          <path d="M8 10h.01"></path>
          <path d="M16 10h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M8 14h.01"></path>
          <path d="M16 14h.01"></path>
          <path d="M12 14h.01"></path>
        </svg>
        <span>{props?.buildingName}</span>
      </Link>

      {isTooltipVisible && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.tooltipHeader}>Thông tin nhà đấu giá</div>
          <div className={styles.tooltipContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tên bất động sản:</span>
              <span className={styles.infoValue}>
                {props?.auctionHouseInfo?.name || "Chưa cập nhật"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Địa chỉ:</span>
              <span className={styles.infoValue}>
                {props?.auctionHouseInfo?.address || "Chưa cập nhật"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Số điện thoại:</span>
              <span className={styles.infoValue}>
                {props?.auctionHouseInfo?.phone || "Chưa cập nhật"}
              </span>
            </div>
            <hr style={{ margin: "10px 0px 0px 0px" }} />
            <Link
              onClick={() =>
                (window.location.href = `/buildings/${props?.buildingId}`)
              }
              className={styles.detailsLink}
            >
              Xem chi tiết nhà đấu giá
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuildingLinkDetailToolTip;
