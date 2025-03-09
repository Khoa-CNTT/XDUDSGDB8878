import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { appVariables } from "../../constants/appVariables";
import { GoXCircle } from "react-icons/go";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  tooltip: {
    position: "relative",
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    maxWidth: "600px",
    maxHeight: "90%",
    overflow: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "10px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "5px",
  },
  tab: (active) => ({
    cursor: "pointer",
    padding: "8px 12px",
    fontWeight: active ? "bold" : "normal",
    color: active ? "#007bff" : "#333",
    borderBottom: active ? "3px solid #007bff" : "none",
  }),
  image: {
    maxWidth: "100%",
    maxHeight: "80vh",
    borderRadius: "6px",
  },
  closeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const renderImage = (activeTab, props) => {
  switch (activeTab) {
    case "contract":
      return props?.contractImage ? (
        <img
          width="500px"
          src={props?.contractImage}
          alt="Hợp đồng thực"
          style={styles.image}
        />
      ) : (
        "CHƯA CÓ ẢNH HỢP ĐỒNG THỰC"
      );
    case "cccdFront":
      return (
        <img
          width="500px"
          src={props?.cccdfrontImage}
          alt="CCCD Mặt trước"
          style={styles.image}
        />
      );
    case "cccdBack":
      return (
        <img
          width="500px"
          src={props?.cccdBackImage}
          alt="CCCD Mặt sau"
          style={styles.image}
        />
      );
    case "avatar":
      return (
        <img
          width="500px"
          src={props?.avatar}
          alt="Ảnh chân dung"
          style={styles.image}
        />
      );
    default:
      return null;
  }
};

const AuctionContractRealToolTip = (props) => {
  const [activeTab, setActiveTab] = useState("contract");

  if (!props?.isVisible) return null;

  return (
    <div style={styles.overlay} onClick={props?.onClose}>
      <div style={styles.tooltip} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span
            style={styles.tab(activeTab === "contract")}
            onClick={() => setActiveTab("contract")}
          >
            Hợp đồng thực
          </span>
          <span
            style={styles.tab(activeTab === "cccdFront")}
            onClick={() => setActiveTab("cccdFront")}
          >
            CCCD Mặt trước
          </span>
          <span
            style={styles.tab(activeTab === "cccdBack")}
            onClick={() => setActiveTab("cccdBack")}
          >
            CCCD Mặt sau
          </span>
          <span
            style={styles.tab(activeTab === "avatar")}
            onClick={() => setActiveTab("avatar")}
          >
            Ảnh chân dung
          </span>
        </div>
        {renderImage(activeTab, props)}
        <GoXCircle style={styles.closeButton} onClick={props?.onClose} />
      </div>
    </div>
  );
};
export default AuctionContractRealToolTip;
