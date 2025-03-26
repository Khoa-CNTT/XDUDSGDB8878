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

const mockAuctionHistory = [
  {
    id: "AH-1001",
    auctionName: "Biệt thự Vinhomes Ocean Park",
    date: "15/03/2023",
    time: "14:30",
    bidAmount: 5800000000,
    propertyType: "Biệt thự",
    location: "Hà Nội",
    result: "Tham gia",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1002",
    auctionName: "Căn hộ cao cấp Landmark 81",
    date: "22/04/2023",
    time: "10:00",
    bidAmount: 12500000000,
    propertyType: "Căn hộ",
    location: "TP. Hồ Chí Minh",
    result: "Chiến thắng",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1003",
    auctionName: "Nhà phố Phú Mỹ Hưng",
    date: "05/05/2023",
    time: "15:45",
    bidAmount: 8900000000,
    propertyType: "Nhà phố",
    location: "TP. Hồ Chí Minh",
    result: "Tham gia",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1004",
    auctionName: "Đất nền Bình Chánh",
    date: "18/06/2023",
    time: "09:30",
    bidAmount: 3200000000,
    propertyType: "Đất nền",
    location: "TP. Hồ Chí Minh",
    result: "Tham gia",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1005",
    auctionName: "Căn hộ The Marq",
    date: "30/06/2023",
    time: "13:15",
    bidAmount: 9500000000,
    propertyType: "Căn hộ",
    location: "TP. Hồ Chí Minh",
    result: "Chiến thắng",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1006",
    auctionName: "Biệt thự Đảo Kim Cương",
    date: "12/07/2023",
    time: "11:00",
    bidAmount: 25000000000,
    propertyType: "Biệt thự",
    location: "TP. Hồ Chí Minh",
    result: "Tham gia",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1007",
    auctionName: "Nhà phố Thảo Điền",
    date: "25/07/2023",
    time: "16:30",
    bidAmount: 15800000000,
    propertyType: "Nhà phố",
    location: "TP. Hồ Chí Minh",
    result: "Tham gia",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1008",
    auctionName: "Căn hộ Masteri An Phú",
    date: "08/08/2023",
    time: "10:45",
    bidAmount: 6700000000,
    propertyType: "Căn hộ",
    location: "TP. Hồ Chí Minh",
    result: "Tham gia",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1009",
    auctionName: "Đất nền Long Thành",
    date: "20/08/2023",
    time: "09:00",
    bidAmount: 4500000000,
    propertyType: "Đất nền",
    location: "Đồng Nai",
    result: "Chiến thắng",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1010",
    auctionName: "Biệt thự Ecopark",
    date: "05/09/2023",
    time: "14:00",
    bidAmount: 18000000000,
    propertyType: "Biệt thự",
    location: "Hưng Yên",
    result: "Tham gia",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1011",
    auctionName: "Căn hộ Vinhomes Central Park",
    date: "18/09/2023",
    time: "11:30",
    bidAmount: 7800000000,
    propertyType: "Căn hộ",
    location: "TP. Hồ Chí Minh",
    result: "Tham gia",
    status: "Đã kết thúc",
  },
  {
    id: "AH-1012",
    auctionName: "Nhà phố Lakeview City",
    date: "30/09/2023",
    time: "15:00",
    bidAmount: 12000000000,
    propertyType: "Nhà phố",
    location: "TP. Hồ Chí Minh",
    result: "Chiến thắng",
    status: "Đã kết thúc",
  },
];

const ResultBadge = ({ result }) => {
  const isWinner = result === "Chiến thắng";
  return (
    <div
      className={`${styles.resultBadge} ${
        isWinner ? styles.winner : styles.participant
      }`}
    >
      {isWinner ? (
        <i className="fa fa-trophy"></i>
      ) : (
        <i className="fa fa-check-circle"></i>
      )}
      <span>{result}</span>
    </div>
  );
};

const AuctionHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const itemsPerPage = 2;

  const filteredHistory = mockAuctionHistory.filter((item) => {
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
                <option value="winner">Chiến thắng</option>
                <option value="participant">Tham gia</option>
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
                      <span className={styles.idValue}>{item.id}</span>
                    </div>
                    <ResultBadge result={item.result} />
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.auctionName}>{item.auctionName}</h3>

                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <CalendarOutlined className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Ngày & Giờ:</span>
                          <span className={styles.infoValue}>
                            {item.date} - {item.time}
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
                            {appVariables.formatMoney(item.bidAmount)}
                          </span>
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <TagOutlined className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Loại BĐS:</span>
                          <span className={styles.infoValue}>
                            {item.propertyType}
                          </span>
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <HomeOutlined className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Địa điểm:</span>
                          <span className={styles.infoValue}>
                            {item.location}
                          </span>
                        </div>
                      </div>
                    </div>
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

export default AuctionHistory;
