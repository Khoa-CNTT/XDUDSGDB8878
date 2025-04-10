import React from "react";
import { useState, useEffect } from "react";
import styles from "../../assets/css/auction-histories.module.css";
import { appVariables } from "../../constants/appVariables";
import {
  HistoryOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  TagOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, message } from "antd";
import handleAPI from "../../apis/handlAPI";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { f_collectionUtil } from "../../utils/f_collectionUtil";
import { AiFillExclamationCircle } from "react-icons/ai";

const ResultBadge = ({ result, status, icon }) => {
  const isConfirmed = status === appVariables.CONFIRMED;
  return (
    <div
      className={`${styles.resultBadge} ${
        !isConfirmed ? styles.winner : styles.participant
      }`}
    >
      {icon}
      <span>{result}</span>
    </div>
  );
};

const AuctionHistory = () => {
  const auth = useSelector(authSelector);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [auctionHistories, setAuctionHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 2;

  useEffect(() => {
    refresh().then();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await handleAPI(
        `/api/admin/auction-histories/user-auction-histories/${auth?.info?.id}`,
        {},
        "get",
        auth?.token
      );
      console.log("data: ", res?.data);

      setAuctionHistories(res?.data);
    } catch (error) {
      message.error("Đã có lỗi xảy ra");
      console.log("Fetch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = auctionHistories.filter((item) => {
    const matchesSearch =
      item?.auction?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.buildingResponse?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item?.messageBidId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.buildingResponse?.map?.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    if (filterType === "confimed")
      return matchesSearch && item?.status === appVariables.CONFIRMED;
    if (filterType === "yet_confirm")
      return matchesSearch && item?.status !== appVariables.CONFIRMED;

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>
              <HistoryOutlined className={styles.titleIcon} /> Lịch sử đấu giá
            </h2>
            <p className={styles.subtitle}>
              Xem lại các phiên đấu giá bạn đã tham gia
            </p>
          </div>

          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <SearchOutlined className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className={styles.filterWrapper}>
              <FilterOutlined className={styles.filterIcon} />
              <select
                className={styles.filterSelect}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="confirmed">Đã duyệt</option>
                <option value="yet_confirm">Chưa duyệt</option>
              </select>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <HistoryOutlined />
            </div>
            <h3>Không tìm thấy lịch sử đấu giá</h3>
            <p>Không có kết quả phù hợp với tìm kiếm của bạn</p>
          </div>
        ) : (
          <>
            <div className={styles.historyGrid}>
              {currentItems.map((item, index) => (
                <div key={index} className={styles.historyCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.auctionId}>
                      <span className={styles.idLabel}>ID:</span>
                      <span className={styles.idValue}>
                        {item?.messageBidId}
                      </span>
                    </div>
                    <ResultBadge
                      result={
                        item?.status === appVariables.CONFIRMED
                          ? "Đã duyệt"
                          : "Chưa duyệt"
                      }
                      icon={
                        item?.status === appVariables.CONFIRMED ? (
                          <i className="fa fa-check-circle"></i>
                        ) : (
                          <AiFillExclamationCircle />
                        )
                      }
                      status={item?.status}
                    />
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.auctionName}>
                      {item?.auction?.name}
                    </h3>

                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <CalendarOutlined className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Ngày & Giờ:</span>
                          <span className={styles.infoValue}>
                            {item?.bidTime}
                          </span>
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <DollarOutlined className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>
                            Số tiền đấu giá:
                          </span>
                          <span className={styles.infoValue}>
                            {appVariables.formatMoney(item?.bidAmount)}
                          </span>
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <TagOutlined className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Loại BĐS:</span>
                          <span className={styles.infoValue}>
                            {item?.buildingResponse?.typeBuilding?.type_name}
                          </span>
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <HomeOutlined className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Địa điểm:</span>
                          <span className={styles.infoValue}>
                            {item?.buildingResponse?.map?.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.statusBadge}>
                      {f_collectionUtil.checkTime(
                        item?.bidTime,
                        24 * 60 * 60 * 1000
                      ) === appVariables.NEW ? (
                        <span>Mới</span>
                      ) : (
                        <span>Cũ</span>
                      )}
                    </div>
                    <button className={styles.detailButton}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <LeftOutlined /> Trước
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      className={`${styles.pageNumber} ${
                        currentPage === number ? styles.activePage : ""
                      }`}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>

              <button
                className={styles.pageButton}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Sau <RightOutlined />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuctionHistory;
