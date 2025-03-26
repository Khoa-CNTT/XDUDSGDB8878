import React, { useEffect, useState } from "react";
import styles from "../../../assets/css/quan-ly-dau-gia.module.css";
import auctionRoomStyles from "../../../assets/css/room-auction.module.css";
import AuctionHistory from "../../../component/daugia/AuctionHistory";
import AuctionWin from "../../../component/daugia/AuctionWin";
import { Link, useNavigate } from "react-router-dom";
import AuctionContract from "../../../component/daugia/AuctionContract";

const AuctionManagerScreen = () => {
  const [activeTab, setActiveTab] = useState("winning");
  const [isOpenSibar, setIsOpenSibar] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTab = localStorage.getItem("tabName");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, [])

  const handleTabName = (tabName) => {
    localStorage.setItem("tabName", tabName);
    setActiveTab(tabName);
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitleWrapper}>
              <i className={`fa fa-gavel ${styles.sidebarIcon}`}></i>
              <h2 className={styles.sidebarTitle}>Quản lý đấu giá</h2>
            </div>
            <p className={styles.sidebarSubtitle}>Quản lý các phiên đấu giá của bạn</p>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.sidebarContent}>
            <nav className={styles.sidebarNav}>
              <button
                className={`${styles.navButton} ${activeTab === "winning" ? styles.activeNavButton : ""}`}
                onClick={() => handleTabName("winning")}
              >
                <i className={`fa fa-trophy ${styles.navIcon}`}></i>
                <span>Phiên chiến thắng</span>
                {activeTab === "winning" && <i className={`fa fa-chevron-right ${styles.navActiveIcon}`}></i>}
              </button>
              <button
                className={`${styles.navButton} ${activeTab === "history" ? styles.activeNavButton : ""}`}
                onClick={() => handleTabName("history")}
              >
                <i className={`fa fa-history ${styles.navIcon}`}></i>
                <span>Lịch sử</span>
                {activeTab === "history" && <i className={`fa fa-chevron-right ${styles.navActiveIcon}`}></i>}
              </button>
              <button
                className={`${styles.navButton} ${activeTab === "contract" ? styles.activeNavButton : ""}`}
                onClick={() => handleTabName("contract")}
              >
                <i className={`fa fa-file-text ${styles.navIcon}`}></i>
                <span>Hợp đồng</span>
                {activeTab === "contract" && <i className={`fa fa-chevron-right ${styles.navActiveIcon}`}></i>}
              </button>
              <div className={styles.divider}></div>
              <button className={styles.navButton} onClick={() => navigate("/")}>
                <i className={`fa fa-home ${styles.navIcon}`}></i>
                <span>Trang chủ</span>
              </button>
              <button className={styles.navButton} onClick={() => navigate("/dau-gia")}>
                <i className={`fa fa-th-large ${styles.navIcon}`}></i>
                <span>Phòng đấu giá</span>
              </button>
            </nav>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.sidebarFooter}>
            <button className={`${styles.button} ${styles.outline} ${styles.fullWidth}`}>
              <i className={`fa fa-gavel ${styles.buttonIcon}`}></i>
              <span>Đóng</span>
            </button>
          </div>
        </aside>
        <div className={styles.mobileNav}>
          <button
            className={`${styles.mobileNavButton} ${activeTab === "winning" ? styles.activeMobileNavButton : ""}`}
            onClick={() => handleTabName("winning")}
          >
            <i className={`fa fa-trophy ${styles.mobileNavIcon}`}></i>
          </button>
          <button
            className={`${styles.mobileNavButton} ${activeTab === "history" ? styles.activeMobileNavButton : ""}`}
            onClick={() => handleTabName("history")}
          >
            <i className={`fa fa-history ${styles.mobileNavIcon}`}></i>
          </button>
          <button
            className={`${styles.mobileNavButton} ${activeTab === "contract" ? styles.activeMobileNavButton : ""}`}
            onClick={() => handleTabName("contract")}
          >
            <i className={`fa fa-file-text ${styles.mobileNavIcon}`}></i>
          </button>
          <button className={styles.mobileNavButton} onClick={() => navigate("/")}>
            <i className={`fa fa-home ${styles.mobileNavIcon}`}></i>
          </button>
          <button className={styles.mobileNavButton} onClick={() => navigate("/dau-gia")}>
            <i className={`fa fa-th-large ${styles.mobileNavIcon}`}></i>
          </button>
        </div>

        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            {activeTab === "winning" && <AuctionWin />}
            {activeTab === "history" && <AuctionHistory />}
            {activeTab === "contract" && <AuctionContract />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuctionManagerScreen;
