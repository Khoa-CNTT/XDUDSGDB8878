import React from "react";
import { useState, useEffect } from "react";
import styles from "../../assets/css/building-user.module.css";
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
import { TbHomeHand } from "react-icons/tb";
import { RiContractFill } from "react-icons/ri";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const mockData = [];

const Bill = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const itemsPerPage = 2;

  const filteredHistory = mockData.filter((item) => {
    const matchesSearch =
      item.auctionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    if (filterType === "winner")
      return matchesSearch && item.result === "Chiến thắng";
    if (filterType === "participant")
      return matchesSearch && item.result === "Tham gia";

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              <FaMoneyBillTransfer className={styles.titleIcon} /> Hóa đơn giao
              dịch
            </h2>
            <p className={styles.subtitle}>Xem lại các hóa đơn</p>
          </div>

          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <SearchOutlined className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              </select>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <HistoryOutlined />
            </div>
            <h3>Không tìm thấy</h3>
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
                      <span className={styles.idValue}>{item.id}</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.auctionName}>{item.auctionName}</h3>

                    <div className={styles.infoGrid}></div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.statusBadge}>{item.status}</div>
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

export default Bill;
