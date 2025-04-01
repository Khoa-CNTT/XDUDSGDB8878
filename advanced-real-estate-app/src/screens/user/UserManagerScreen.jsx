import React, { useEffect, useState, Fragment } from "react";
import styles from "../../assets/css/user-manager.module.css";
import AuctionHistory from "../../component/daugia/AuctionHistory";
import AuctionWin from "../../component/daugia/AuctionWin";
import { Link, useNavigate } from "react-router-dom";
import AuctionContract from "../../component/daugia/AuctionContract";
import { componentElement } from "../../component/element/componentElement";
import { mobileElement } from "../../component/element/mobileElement";
import { BiSolidBuildingHouse } from "react-icons/bi";
import { FaPowerOff } from "react-icons/fa";
import {
  authSelector,
  removeAuth,
  removeRoleManagerPage,
} from "../../redux/reducers/authReducer";
import { updatedAuctionRoom } from "../../redux/reducers/auctionReducer";
import { f_collectionUtil } from "../../utils/f_collectionUtil";
import { useDispatch, useSelector } from "react-redux";
import { FaRegAddressCard, FaRegCreditCard } from "react-icons/fa";

const UserManagerScreen = () => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("winning");
  const [isOpenSibar, setIsOpenSibar] = useState(true);
  const [pageObject, setPageObject] = useState(null);

  useEffect(() => {
    const storedTab = localStorage.getItem("tabName");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    setTitleByActiveTab(activeTab);
  }, [activeTab]);

  const setTitleByActiveTab = (activeTab) => {
    switch (true) {
      case componentElement.auctions.some(
        (auction) => auction.tabName === activeTab
      ):
        setPageObject({
          title: "Quản lý đấu giá",
          description: "Quản lý các phiên đấu giá của bạn",
          icon: <i className={`fa fa-gavel ${styles.sidebarIcon}`}></i>,
        });
        break;
      case componentElement.buildings.some(
        (building) => building.tabName === activeTab
      ):
        setPageObject({
          title: "Quản lý bất động sản",
          description: "Quản lý các bất động sản của bạn",
          icon: <BiSolidBuildingHouse style={{ color: "#fea116" }} />,
        });
        break;
      case componentElement.transactions.some(
        (building) => building.tabName === activeTab
      ):
        setPageObject({
          title: "Quản lý giao dịch",
          description: "Quản lý giao dịch của bạn",
          icon: <FaRegCreditCard style={{ color: "#fea116" }} />,
        });
        break;
      default:
        setPageObject({
          title: "Trang chủ",
          description: "Trang chủ",
        });
        break;
    }
  };

  const handleTabName = (tabName) => {
    localStorage.setItem("tabName", tabName);
    setActiveTab(tabName);
  };

  const logout = () => {
    f_collectionUtil?.logout(utils);
  };

  const activeAuction = componentElement.auctions.find(
    (auction) => auction.tabName === activeTab
  );
  const activeBuilding = componentElement.buildings.find(
    (auction) => auction.tabName === activeTab
  );
  const activeTransaction = componentElement.transactions.find(
    (auction) => auction.tabName === activeTab
  );
  const utils = {
    auth,
    dispatch,
    navigate,
    removeAuth,
    updatedAuctionRoom,
    removeRoleManagerPage,
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitleWrapper}>
              <h2>{pageObject?.icon}</h2>
              <h2 className={styles.sidebarTitle}>{pageObject?.title}</h2>
            </div>
            <p className={styles.sidebarSubtitle}>{pageObject?.description}</p>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.sidebarContent}>
            <nav className={styles.sidebarNav}>
              {/* tab list */}
              <div>
                {componentElement?.auctionButtons.map((item, index) => (
                  <Fragment key={index}>
                    {item?.element(activeTab, handleTabName)}
                  </Fragment>
                ))}
                {componentElement?.buildingButtons.map((item, index) => (
                  <Fragment key={index}>
                    {item?.element(activeTab, handleTabName)}
                  </Fragment>
                ))}
                {componentElement?.buttonTransactions.map((item, index) => (
                  <Fragment key={index}>
                    {item?.element(activeTab, handleTabName)}
                  </Fragment>
                ))}
              </div>
              <div className={styles.divider}></div>
              <button
                className={styles.navButton}
                onClick={() => navigate("/")}
              >
                <i className={`fa fa-home ${styles.navIcon}`}></i>
                <span>Trang chủ</span>
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/buildings")}
              >
                <BiSolidBuildingHouse className={`${styles.navIcon}`} />
                <span>Bất động sản</span>
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/dau-gia")}
              >
                <i className={`fa fa-th-large ${styles.navIcon}`}></i>
                <span>Phòng đấu giá</span>
              </button>
            </nav>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.sidebarFooter}>
            <button
              className={`${styles.button} ${styles.outline} ${styles.fullWidth}`}
              onClick={logout}
            >
              <FaPowerOff className={`${styles.buttonIcon}`} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>
        <div className={styles.mobileNav}>
          {mobileElement?.auctionButtons?.map((item, index) => (
            <Fragment key={index}>
              {item?.element(activeTab, handleTabName)}
            </Fragment>
          ))}
          {mobileElement?.buildingButtons?.map((item, index) => (
            <Fragment key={index}>
              {item?.element(activeTab, handleTabName)}
            </Fragment>
          ))}
          {mobileElement?.buttonTransactions?.map((item, index) => (
            <Fragment key={index}>
              {item?.element(activeTab, handleTabName)}
            </Fragment>
          ))}
          <button
            className={styles.mobileNavButton}
            onClick={() => navigate("/")}
          >
            <i className={`fa fa-home ${styles.mobileNavIcon}`}></i>
          </button>
          <button
            className={styles.mobileNavButton}
            onClick={() => navigate("/dau-gia")}
          >
            <i className={`fa fa-th-large ${styles.mobileNavIcon}`}></i>
          </button>
        </div>

        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>{activeAuction?.element}</div>
          <div className={styles.contentWrapper}>{activeBuilding?.element}</div>
          <div className={styles.contentWrapper}>
            {activeTransaction?.element}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagerScreen;
