import React, {useEffect, useState} from 'react';
import styles from "../../../assets/css/quan-ly-dau-gia.module.css";
import auctionRoomStyles from "../../../assets/css/room-auction.module.css";
import AuctionHistory from "../../../component/daugia/AuctionHistory";
import AuctionWin from "../../../component/daugia/AuctionWin";
import {Link, useNavigate} from "react-router-dom";
import AuctionContract from "../../../component/daugia/AuctionContract";

const AuctionManagerScreen = () => {

    const [activeTab, setActiveTab] = useState("winning");
    const navigate = useNavigate();

    useEffect(() => {

    }, [])

    return (
        <div className={styles.mainContainer}>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles.sidebarTitleWrapper}>
                        <i className={`fa fa-balance-scale ${auctionRoomStyles.titleIcon}`}></i>
                        <h2 className={styles.sidebarTitle}>Quản lý đấu giá</h2>
                    </div>
                    <ul className={styles.sidebarMenu}>
                        <li
                            className={`${styles.sidebarMenuItem} ${activeTab === "winning" ? styles.active : ""}`}
                            onClick={() => setActiveTab("winning")}
                        >
                            Phiên chiến thắng
                        </li>
                        <li
                            className={`${styles.sidebarMenuItem} ${activeTab === "history" ? styles.active : ""}`}
                            onClick={() => setActiveTab("history")}
                        >
                            Lịch sử
                        </li>
                        <li
                            className={`${styles.sidebarMenuItem} ${activeTab === "contract" ? styles.active : ""}`}
                            onClick={() => setActiveTab("contract")}
                        >
                            Hợp đồng
                        </li>
                        <li
                            className={`${styles.sidebarMenuItem} ${activeTab === "home" ? styles.active : ""}`}
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            Trang chủ
                        </li>
                        <li
                            className={`${styles.sidebarMenuItem} ${activeTab === "auction" ? styles.active : ""}`}
                            onClick={() => {
                                navigate("/dau-gia");
                            }}
                        >
                            Phòng đấu giá
                        </li>
                    </ul>
                </div>
                <div className={styles.content}>
                    {activeTab === "winning" && <AuctionWin/>}
                    {activeTab === "history" && <AuctionHistory/>}
                    {activeTab === "contract" && <AuctionContract/>}
                </div>
            </div>
        </div>
    )
};

export default AuctionManagerScreen;