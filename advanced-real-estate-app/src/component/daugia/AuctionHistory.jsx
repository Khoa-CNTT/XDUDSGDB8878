import React from "react";
import styles from "../../assets/css/auction-win.module.css";
import { appVariables } from "../../constants/appVariables";
const AuctionHistory = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lịch sử đấu giá</h2>
      <div className={styles.tableContainer}>
        <div>Lịch sử đấu giá</div>
      </div>
    </div>
  );
};

export default AuctionHistory;