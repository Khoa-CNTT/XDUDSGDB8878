import React, { useEffect, useState } from "react";
import handleAPI from "../../apis/handlAPI";
import { Button, message } from "antd";
import {
  removeBidMessages,
  removeUsers,
} from "../../redux/reducers/auctionReducer";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { Link, useNavigate } from "react-router-dom";
import { appVariables } from "../../constants/appVariables";
import styles from "../../assets/css/auction-win.module.css";
import DetailAuctionModal from "./DetailAuctionModal";
import AuctionWinDetailModal from "./AuctionWinDetailModal";
import { IoMdTrophy } from "react-icons/io";

export const StatusBadge = (props) => {
  return (
    <div
      className={`${styles.statusBadge} ${
        props?.status === props?.trangThaiSoSanh
          ? styles.pending
          : styles.confirmed
      }`}
    >
      <i
        className={`fa ${
          props?.status === props?.trangThaiSoSanh
            ? "fa-clock-o"
            : "fa-check-circle"
        }`}
      ></i>
      <span>
        {props?.status === props?.trangThaiSoSanh
          ? props?.tranThaiTruyenVao
          : "Đã xác nhận"}
      </span>
    </div>
  );
};

export const WinBadge = (props) => (
  <div className={styles.winBadge}>
    {props?.icon}
    <span>{props?.message}</span>
  </div>
);

const AuctionWin = () => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const [auctionWins, setAuctionWins] = useState([]);
  const [objectItem, setObjectItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    refresh().then();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await handleAPI(
        `/api/admin/auction-details/user-auction-details/${auth?.info?.id}`,
        {},
        "get",
        auth?.token
      );
      setAuctionWins(res?.data);
    } catch (error) {
      message.error("Fetch error: " + error);
      console.log("Fetch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const utils = {
    isOpen: isModalOpen,
    objectItem: objectItem,
    onOpen: () => setIsModalOpen(true),
    onClose: () => setIsModalOpen(false),
  };

  return (
    <div className={styles.pageWrapper}>
      <AuctionWinDetailModal utils={utils} />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>
              <i className="fa fa-trophy"></i> Phiên đấu giá chiến thắng
            </h2>
            <p className={styles.subtitle}>
              Quản lý các phiên đấu giá bạn đã thắng
            </p>
          </div>

          <div className={styles.actions}>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${
                  viewMode === "grid" ? styles.active : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                <i className="fa fa-th-large"></i>
              </button>
              <button
                className={`${styles.viewButton} ${
                  viewMode === "list" ? styles.active : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                <i className="fa fa-list"></i>
              </button>
            </div>
            <button className={styles.refreshButton} onClick={refresh}>
              <i className="fa fa-refresh"></i>
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <i className="fa fa-spinner fa-spin"></i>
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : auctionWins?.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fa fa-trophy"></i>
            </div>
            <h3>Chưa có phiên đấu giá chiến thắng</h3>
            <p>Khi bạn thắng một phiên đấu giá, nó sẽ xuất hiện ở đây</p>
          </div>
        ) : (
          <div
            className={`${styles.auctionGrid} ${
              viewMode === "list" ? styles.listView : ""
            }`}
          >
            {auctionWins?.map((item, index) => (
              <div key={index} className={styles.auctionCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.auctionId}>
                    <span className={styles.idLabel}>ID:</span>
                    <span
                      className={styles.idValue}
                    >{`${item?.identity_key}`}</span>
                  </div>
                  {item.result === appVariables.WIN && (
                    <WinBadge icon={<IoMdTrophy />} message={"Chiến thắng"} />
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h2
                    className={styles.auctionName}
                  >{`${item?.auction?.name}`}</h2>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <i className="fa fa-envelope"></i>
                      <span>Email:</span>
                    </div>
                    <div className={styles.infoValue}>
                      {item?.client?.email}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <i className="fa fa-money"></i>
                      <span>Số tiền đấu giá:</span>
                    </div>
                    <div className={`${styles.infoValue} ${styles.bidAmount}`}>
                      {appVariables.formatMoney(item?.bidAmount)}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <i className="fa fa-info-circle"></i>
                      <span>Trạng thái:</span>
                    </div>
                    <StatusBadge
                      trangThaiSoSanh={appVariables.YET_CONFIRM}
                      tranThaiTruyenVao={"Chưa xác nhận"}
                      status={item?.status}
                    />
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link
                    className={styles.contractButton}
                    onClick={() => {
                      utils?.onOpen();
                      setObjectItem(item);
                    }}
                    to={`#`}
                  >
                    <i className="fa fa-file-text"></i>
                    <span>Tạo hợp đồng</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionWin;
