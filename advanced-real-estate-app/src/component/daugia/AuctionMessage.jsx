import { useEffect, useRef, useState } from "react";
import styles from "../../assets/css/daugia.module.css";
import { BiMessageDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { message } from "antd";
import { f_collectionUtil } from "../../utils/f_collectionUtil";

const AuctionMessage = (props) => {
  const [activeTab, setActiveTab] = useState("bidMessageTab");
  const [isOpen, setIsOpen] = useState(true);
  const auth = useSelector(authSelector);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={styles.chatIcon} onClick={toggleChat}>
        <i className="fa fa-comments"></i>
      </div>
      <div
        className={`${styles.chatFloatingPanel} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.chatFloatingHeader}>
          <div className={styles.chatHeaderContent}>
            <div className={styles.chatAvatar}>
              <BiMessageDetail />
            </div>
            <div className={styles.chatTitle}>
              AUCTION ADVANCED REAL ESTATE
            </div>
          </div>
          <button className={styles.closeChat} onClick={toggleChat}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className={styles.chatTabs}>
          <button
            className={`${styles.chatTab} ${
              activeTab === "bidMessageTab" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("bidMessageTab")}
            ref={props?.utils?.posViewHistoryAuctionRef}
          >
            Lịch sử đấu giá
          </button>
          <button
            className={`${styles.chatTab} ${
              activeTab === "userTab" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("userTab")}
            ref={props?.utils?.posViewGuestJoinAutionRef}
          >
            Người tham gia ({props?.utils?.countUser})
          </button>
        </div>
        <div className={styles.chatFloatingContent} ref={props?.utils?.bidMessageRef}>
          {activeTab === "bidMessageTab" ? (
            <>
              {props?.utils?.bidMessages.length > 0 ? (
                [...props?.utils?.bidMessages]
                  .sort((a, b) => a.bidAmount - b.bidAmount)
                  .map((bid, index) => (
                    <div key={index} className={styles.bidHistoryItem}>
                      <div className={styles.bidHistoryUser}>{bid?.sender}</div>
                      <div className={styles.bidHistoryAmount}>
                        {props?.utils?.formatMoney(bid?.bidAmount)}
                      </div>
                      <div className={styles.bidHistoryTime}>
                        {bid?.currentDateTime}
                      </div>
                    </div>
                  ))
              ) : (
                <div className={styles.emptyMessage}>
                  Chưa có lịch sử đấu giá
                </div>
              )}
            </>
          ) : (
            <>
              {props?.utils?.users.length > 0 ? (
                props?.utils?.users.map((user, index) => (
                  <div key={index} className={styles.userItem}>
                    <i className="fa fa-user-secret"></i>
                    <span style={{ color: "black" }}>{user}</span>
                  </div>
                ))
              ) : (
                <div className={styles.emptyMessage}>
                  Không có người tham gia
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.chatFloatingActions} ref={props?.utils?.posBtnOutAuctionRoomRef}>
          {activeTab === "bidMessageTab" ? (
            <button
              onClick={
                auth?.roles === "ADMIN"
                  ? props?.utils?.deleteBidMessage
                  : () => {
                      message.error("Không có quyền!");
                    }
              }
              className={styles.deleteButton}
            >
              Xóa lịch sử đấu giá
            </button>
          ) : (
            <button
              onClick={props?.utils?.disconnect}
              className={styles.secondaryButton}
            >
              Rời phòng
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AuctionMessage;
