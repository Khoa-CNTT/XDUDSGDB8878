import React, { useEffect, useState } from "react";
import styles from "../../../assets/css/quan-ly-dau-gia.module.css";
import auctionRoomStyles from "../../../assets/css/room-auction.module.css";
import AuctionHistory from "../../../component/daugia/AuctionHistory";
import AuctionWin from "../../../component/daugia/AuctionWin";
import { Link, useNavigate } from "react-router-dom";
import AuctionContract from "../../../component/daugia/AuctionContract";

const AuctionManagerScreen = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("tabName") || "winning"
  );
  const navigate = useNavigate();

  const handleTabName = (tabName) => {
    localStorage.setItem("tabName", tabName);
    setActiveTab(tabName);
  };

  useEffect(() => {
    const storedTab = localStorage.getItem("tabName");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitleWrapper}>
            <i
              className={`fa fa-balance-scale ${auctionRoomStyles.titleIcon}`}
            ></i>
            <h2 className={styles.sidebarTitle}>Quản lý đấu giá</h2>
          </div>
          <ul className={styles.sidebarMenu}>
            <li
              className={`${styles.sidebarMenuItem} ${
                activeTab === "winning" ? styles.active : ""
              }`}
              onClick={() => handleTabName("winning")}
            >
              Phiên chiến thắng
            </li>
            <li
              className={`${styles.sidebarMenuItem} ${
                activeTab === "history" ? styles.active : ""
              }`}
              onClick={() => handleTabName("history")}
            >
              Lịch sử
            </li>
            <li
              className={`${styles.sidebarMenuItem} ${
                activeTab === "contract" ? styles.active : ""
              }`}
              onClick={() => handleTabName("contract")}
            >
              Hợp đồng
            </li>
            <li
              className={`${styles.sidebarMenuItem}`}
              onClick={() => navigate("/")}
            >
              Trang chủ
            </li>
            <li
              className={`${styles.sidebarMenuItem}`}
              onClick={() => navigate("/dau-gia")}
            >
              Phòng đấu giá
            </li>
          </ul>
        </div>
        <div className={styles.content}>
          {activeTab === "winning" && <AuctionWin />}
          {activeTab === "history" && <AuctionHistory />}
          {activeTab === "contract" && <AuctionContract />}
        </div>
      </div>
    </div>
  );
};

export default AuctionManagerScreen;
