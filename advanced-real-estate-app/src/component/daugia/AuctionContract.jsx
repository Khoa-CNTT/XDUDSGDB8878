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
import styleAuctionWins from "../../assets/css/auction-win.module.css";
import styles from "../../assets/css/auction-contract.module.css";
import DetailAuctionModal from "./DetailAuctionModal";
import AuctionWinDetailModal from "./AuctionWinDetailModal";
import { StatusBadge, WinBadge } from "./AuctionWin";
import AuctionContractDetailModal from "./AuctionContractDetailModal";
import {
  FileTextOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const AuctionContract = () => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [auctionContracts, setAuctionContracts] = useState([]);
  const [objectItem, setObjectItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refresh().then();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await handleAPI(
        `/api/admin/auction-contracts/user-auction-contracts/${auth?.info?.id}`,
        {},
        "get",
        auth?.token
      );
      setAuctionContracts(res?.data);
    } catch (error) {
      message.error("Fetch error: " + error);
      console.log("Fetch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = auctionContracts.filter((contract) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      contract?.full_name?.toLowerCase().includes(searchLower) ||
      contract?.phone_number?.includes(searchTerm) ||
      (contract?.contractStatus === appVariables.CONFIRMED
        ? "Đã xác nhận"
        : "Chờ xác nhận"
      )
        .toLowerCase()
        .includes(searchLower) ||
      contract?.address?.toLowerCase().includes(searchLower)
    );
  });

  const utils = {
    objectItem: objectItem,
  };

  return (
    <div className={styles.pageWrapper}>
      <AuctionContractDetailModal utils={utils} />

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>
              <FileTextOutlined className={styles.titleIcon} /> Hợp đồng đấu giá
            </h2>
            <p className={styles.subtitle}>
              Quản lý các hợp đồng đấu giá của bạn
            </p>
          </div>

          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <SearchOutlined className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm hợp đồng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className={styles.refreshButton}
              onClick={refresh}
              icon={<ReloadOutlined />}
              loading={loading}
            >
              Làm mới
            </Button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FileTextOutlined />
            </div>
            <h3>Chưa có hợp đồng nào</h3>
            <p>Khi bạn tạo hợp đồng đấu giá, nó sẽ xuất hiện ở đây</p>
          </div>
        ) : (
          <div className={styles.contractsGrid}>
            {filteredContracts.map((item, index) => (
              <div key={index} className={styles.contractCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.contractId}>
                    <span className={styles.idLabel}>ID:</span>
                    <span className={styles.idValue}>{item?.id}</span>
                  </div>
                  <StatusBadge
                    trangThaiSoSanh={appVariables.PENDING}
                    tranThaiTruyenVao={"Chờ xác nhận"}
                    status={item?.contractStatus}
                  />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoItem}>
                    <UserOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Họ và tên:</span>
                      <span className={styles.infoValue}>
                        {item?.full_name}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <PhoneOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Số điện thoại:</span>
                      <span className={styles.infoValue}>
                        {item?.phone_number}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <HomeOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Địa chỉ:</span>
                      <span className={styles.infoValue}>{item?.address}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <CalendarOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Ngày lập:</span>
                      <span className={styles.infoValue}>{item?.settingDate}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#auctionContractDetailModal"
                    onClick={() => {
                      setObjectItem(item);
                    }}
                    to={`#`}
                    className={styles.viewButton}
                  >
                    <EyeOutlined /> Xem hợp đồng
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionContract;
