/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styles from "../../assets/css/room-auction.module.css";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import handleAPINotToken from "../../apis/handleAPINotToken";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { add } from "../../redux/reducers/chatReducer";
import { appVariables } from "../../constants/appVariables";
import DetailAuctionModal from "./DetailAuctionModal";
import {
  auctionSelector,
  joinAuctionRoom,
  removeBidMessages,
  removeUsers,
} from "../../redux/reducers/auctionReducer";

const RoomAuctionComponent = ({ pageSize }) => {
  const [auctionRooms, setAuctionRooms] = useState([]);
  const [auctionId, setAuctionId] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const auctionReducer = useSelector(auctionSelector);
  // const pageSize = 3;
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentItems = auctionRooms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(auctionRooms.length / pageSize);

  useEffect(() => {
    handleAPINotToken("/api/user/auctions", {}, "get")
      .then((res) => {
        console.log("data: ", res?.data);
        setAuctionRooms(res?.data);
      })
      .catch((error) => console.error("Fetch error: ", error));
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRoomChange = (roomId, item) => {
    const { building, map, ...auction } = item;
    const { name, description } = item;
    const { image, auctions, ...buildingDetail } = building;
    const { buildings, ...mapDetail } = map;
    const status = appVariables.checkStatus(
      item?.start_date,
      item?.start_time,
      item?.end_time
    );
    if (!auth?.isAuth || !auth?.token) {
      message.error(
        "Bạn không thể vào phòng vui lòng đăng nhập để vào đấu giá!"
      );
      return;
    }
    if (status === appVariables.AFTER) {
      appVariables.toast_notify_error(
        "Bạn không thể vào. Phiên đấu giá này đã kết thúc!",
        2000
      );
      return;
    }
    if (status === appVariables.BEFORE) {
      appVariables.toast_notify_error(
        "Bạn không thể vào. Phiên đấu giá này chưa bắt đầu!",
        2000
      );
      return;
    }
    if (!item?.active) {
      appVariables.toast_notify_error(
        "Phiên đấu giá này đang bị khóa bạn không thể vào!",
        2000
      );
      return;
    }
    const userJoinAuctionRoom = {
      roomId: roomId,
      userData: {
        connected: true,
        message: "",
      },
      auction: {
        ...auction,
        ...buildingDetail,
        ...mapDetail,
        nameAuction: name,
        descriptionAuction: description,
      },
    };
    dispatch(joinAuctionRoom(userJoinAuctionRoom));
  };

  return (
    <div>
      <DetailAuctionModal auctionId={auctionId} />
      <div className={styles.roomContainer}>
        {currentItems.map((item, index) => (
          <div key={index} className={styles.roomCard}>
            <img
              src={item?.buildingImages[0]}
              alt={item?.building?.name}
              className={styles.roomImage}
            />
            <div className={styles.roomContent}>
              <Link to={"#"}>
                <div>
                  <h3 className={styles.roomTitle}>
                    <i
                      className={`fa fa-balance-scale text-primary ${styles.titleIcon}`}
                    ></i>
                    <span>{"Phiên " + item.name}</span>
                  </h3>
                </div>
                <div className={styles.timeContent}>
                  <span className={styles.startEndTime}>
                    <i
                      className="fa fa-circle text-primary"
                      id="exampleModalLabel"
                    ></i>
                    {" Trạng thái hoạt động:"}{" "}
                    {appVariables.checkStatus(
                      item?.start_date,
                      item?.start_time,
                      item?.end_time
                    ) === appVariables.BEFORE ? (
                      <span className={"text-primary"}>Chưa bắt đầu</span>
                    ) : appVariables.checkStatus(
                        item?.start_date,
                        item?.start_time,
                        item?.end_time
                      ) === appVariables.NOW ? (
                      <span className={"text-success"}>Đang bắt đầu</span>
                    ) : (
                      <span className={"text-danger"}>Đã kết thúc</span>
                    )}
                  </span>
                </div>
                {!item?.active ? (
                  <div className={styles.timeContent}>
                    <i
                      className="fa fa-lock text-primary"
                      id="exampleModalLabel"
                    ></i>
                    {" Trạng thái phiên:"}
                    <span className={"text-danger"}>{" Đang bị khóa"}</span>
                  </div>
                ) : (
                  <div className={styles.timeContent}>
                    <i
                      className="fa fa-unlock text-primary"
                      id="exampleModalLabel"
                    ></i>
                    {" Trạng thái phiên:"}
                    <span className={"text-success"}>{" Đang mở"}</span>
                  </div>
                )}
                <div className={styles.timeContent}>
                  <span className={`${styles.startDate}`}>
                    <i
                      className="fa fa-money text-primary"
                      id="exampleModalLabel"
                    ></i>
                    <span>{" Giá khởi điểm:"}</span>
                    <span className={"text-primary"}>
                      {" " +
                        appVariables.formatMoney(item?.typeBuilding?.price)}
                    </span>
                  </span>
                </div>
                <div className={styles.timeContent}>
                  <i
                    className="fa fa-calendar text-primary"
                    id="exampleModalLabel"
                  ></i>
                  <span className={styles.startDate}>
                    {" Ngày bắt đầu: " + item.start_date}
                  </span>
                </div>
                <div className={styles.timeContent}>
                  <span className={styles.startEndTime}>
                    <i
                      className="fa fa-clock text-primary"
                      id="exampleModalLabel"
                    ></i>
                    {` Thời gian đấu giá: ${item.start_time} - ${item.end_time}`}
                  </span>
                </div>
                {/*<p className={styles.roomDescription}>{item.description}</p>*/}
              </Link>
              <div className={styles.linkContainer}>
                <Link
                  onClick={() => handleRoomChange(item.id, item)}
                  className={styles.linkJoin}
                  to={"#"}
                >
                  VÀO NGAY
                </Link>
                <Link
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#auctionDetailModal"
                  className={styles.linkDetail}
                  onClick={() => {
                    setAuctionId(item?.id);
                  }}
                  to={`#`}
                >
                  XEM CHI TIẾT
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`btn btn-primary mx-1 ${
              currentPage === i + 1 ? "active" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomAuctionComponent;
