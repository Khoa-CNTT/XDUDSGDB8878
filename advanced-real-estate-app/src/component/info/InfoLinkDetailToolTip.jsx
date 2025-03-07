import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/css/building-link-with-tooltip.module.css";

const InfoLinkDetailToolTip = (props) => {
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
        onClick={() =>
          (window.location.href = `/user/info`)
        }
        className={`${styles.link} ${props?.className || ""}`}
      >
        <span>{props?.full_name}</span>
      </Link>

      {isTooltipVisible && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.tooltipHeader}>Thông tin khách hàng</div>
          <div className={styles.tooltipContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tên khách hàng:</span>
              <span className={styles.infoValue}>
                {props?.full_name || "Chưa cập nhật"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Địa chỉ:</span>
              <span className={styles.infoValue}>
                {props?.address || "Chưa cập nhật"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Số điện thoại:</span>
              <span className={styles.infoValue}>
                {props?.phone_number || "Chưa cập nhật"}
              </span>
            </div>
            <hr style={{ margin: "10px 0px 0px 0px" }} />
            <Link
              onClick={() =>
                (window.location.href = `/user/info`)
              }
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

export default InfoLinkDetailToolTip;
