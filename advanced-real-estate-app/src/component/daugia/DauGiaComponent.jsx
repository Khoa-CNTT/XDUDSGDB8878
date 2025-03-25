import { useEffect, useState, useRef } from "react";
import styles from "../../assets/css/daugia.module.css";
import { appVariables } from "../../constants/appVariables";
import { useDispatch, useSelector } from "react-redux";
import {
  addBidMessages,
  addUsers,
  auctionSelector,
  removeBidMessages,
  removeUsers,
  updatedAuctionRoom,
  updateUserInRoom,
  setListWaitingUser,
  removeListWaitingUser,
} from "../../redux/reducers/auctionReducer";
import { authSelector } from "../../redux/reducers/authReducer";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { message } from "antd";
import AuctionMessageModal from "./AuctionMessageModal";
import AuctionMessage from "./AuctionMessage";
import AuctionGuideLine from "./AuctionGuideLine";
import { f_collectionUtil } from "./../../utils/f_collectionUtil";

let stompClient = appVariables.stompClient;
const DauGiaComponent = () => {
  const dispatch = useDispatch();
  const auctionReducer = useSelector(auctionSelector);
  const auth = useSelector(authSelector);
  const userData = auctionReducer?.userData;
  const roomId = auctionReducer?.roomId;
  const [countUser, setCountUser] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [bidAmount, setBidAmount] = useState(0.0);
  const [highestBid, setHighestBid] = useState(0.0);
  const [bidUpdated, setBidUpdated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bidMessageRef = useRef(null);
  const [elementCoordinates, setElementCoordinates] = useState({});
  const posBidInputRef = useRef(null);
  const posTimeRemainingRef = useRef(null);
  const posItemInfoRef = useRef(null);
  const posBidButtonRef = useRef(null);
  const posViewHistoryAuctionRef = useRef(null);
  const posViewGuestJoinAutionRef = useRef(null);
  const posBtnOutAuctionRoomRef = useRef(null);
  const [prevJoinCount, setPrevJoinCount] = useState(null);
  const [waitingTime, setWaitingTime] = useState(0);
  const [timeSendBid, setTimeSendBid] = useState(0);

  const getElementCoordinates = (ref) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportCoords = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      };
      const documentCoords = {
        x: viewportCoords.x + window.scrollX,
        y: viewportCoords.y + window.scrollY,
      };
      const percentCoords = {
        x: (viewportCoords.x / window.innerWidth) * 100,
        y: (viewportCoords.y / window.innerHeight) * 100,
      };

      return {
        viewport: viewportCoords,
        document: documentCoords,
        percent: percentCoords,
      };
    }
    return null;
  };

  useEffect(() => {
    const currentUser = auctionReducer?.listWaitingUser?.find(
      (e) => e?.email === auth?.info?.email
    );
    const isEmailUser = currentUser?.isWaiting === true;
    const userJoinCount = currentUser?.joinCount;

    if (isEmailUser) {
      if (prevJoinCount !== null && prevJoinCount !== userJoinCount) {
        setWaitingTime(60);
      }
      setPrevJoinCount(userJoinCount);

      const interval = setInterval(() => {
        setWaitingTime((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [auctionReducer?.listWaitingUser, auth, prevJoinCount]);

  useEffect(() => {
    if (timeSendBid > 0) {
      const interval = setInterval(() => {
        setTimeSendBid((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeSendBid]);

  useEffect(() => {
    if (userData.connected) {
      const timer = setTimeout(() => {
        const coords = {
          bidInput: getElementCoordinates(posBidInputRef),
          itemInfo: getElementCoordinates(posItemInfoRef),
          bidButton: getElementCoordinates(posBidButtonRef),
          timeRemaining: getElementCoordinates(posTimeRemainingRef),
          btnOutAuction: getElementCoordinates(posBtnOutAuctionRoomRef),
          viewHistoryAuction: getElementCoordinates(posViewHistoryAuctionRef),
          viewGuestJoinAution: getElementCoordinates(posViewGuestJoinAutionRef),
        };
        setElementCoordinates(coords);
        // console.log("Element coordinates:", coords);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userData.connected]);

  useEffect(() => {
    const handleResize = () => {
      const coords = {
        bidInput: getElementCoordinates(posBidButtonRef),
        itemInfo: getElementCoordinates(posItemInfoRef),
        bidButton: getElementCoordinates(posBidButtonRef),
        timeRemaining: getElementCoordinates(posTimeRemainingRef),
        btnOutAuction: getElementCoordinates(posBtnOutAuctionRoomRef),
        viewHistoryAuction: getElementCoordinates(posViewHistoryAuctionRef),
        viewGuestJoinAution: getElementCoordinates(posViewGuestJoinAutionRef),
      };
      setElementCoordinates(coords);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (userData.connected) {
      connect();
    }
  }, [userData.connected, roomId]);

  useEffect(() => {
    if (userData.connected) {
      connect();
    }
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (auctionReducer?.bidMessages?.length > 0) {
      const maxBid = appVariables.findMax(auctionReducer?.bidMessages);
      if (Number.parseFloat(maxBid) !== highestBid) {
        setBidAmount(Number.parseFloat(maxBid));
        setHighestBid(Number.parseFloat(maxBid));
        setBidUpdated(true);
        setTimeout(() => setBidUpdated(false), 500);
      }
    } else {
      const auctionPrice = Number.parseFloat(
        auctionReducer?.auction?.typeBuilding?.price
      );
      if (auctionPrice !== highestBid) {
        setBidAmount(auctionPrice);
        setHighestBid(auctionPrice);
      }
    }
  }, [
    auctionReducer?.bidMessages,
    userData.connected,
    roomId,
    auctionReducer?.auction?.typeBuilding?.price,
  ]);

  useEffect(() => {
    console.log("auctionReducer", auctionReducer);
  }, [auctionReducer]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const countdown = await appVariables.handleAuction(
        auth,
        auctionReducer?.auction?.start_time,
        auctionReducer?.auction?.end_time,
        dispatch,
        updatedAuctionRoom,
        removeBidMessages,
        auctionReducer
      );
      setTimeLeft(countdown);
    }, 1000);
    return () => clearInterval(interval);
  }, [
    auctionReducer?.auction?.start_time,
    auctionReducer?.auction?.end_time,
    auctionReducer?.bidMessages,
  ]);

  const connect = () => {
    const socket = new SockJS("http://localhost:9090/ws", null, {
      withCredentials: true,
    });
    stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${auth?.token}`,
      },
      debug: (str) => {},
      onConnect: () => {
        stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
          onMessageReceived(message).then();
        });
        stompClient.publish({
          destination: `/app/userJoinAuction/${roomId}`,
          body: JSON.stringify({
            sender: auth?.info?.email,
            email: auth?.info?.email,
            client_id: auth?.info?.id,
            auction_id: roomId,
            type: "JOIN",
            identity_key: auctionReducer?.auction?.identity_key,
            roomId,
          }),
        });
      },
      onStompError: (frame) => {
        console.error("ERROR STOMP:", frame);
      },
      onWebSocketClose: (event) => {
        dispatch(
          updatedAuctionRoom({
            connected: false,
          })
        );
      },
    });

    try {
      stompClient.activate();
    } catch (error) {
      console.error("Error activating WebSocket:", error);
    }
  };

  const disconnect = async () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/leaveAuctionRoom/${roomId}`,
        body: JSON.stringify({
          sender: auth?.info?.username,
          email: auth?.info?.email,
          client_id: auth?.info?.id,
          auction_id: roomId,
          type: "LEAVE",
        }),
      });
      stompClient.deactivate();
      dispatch(
        updatedAuctionRoom({
          connected: false,
        })
      );
    } else {
      dispatch(
        updatedAuctionRoom({
          connected: false,
        })
      );
      console.log("WebSocket is already disconnected.");
    }
  };

  const onMessageReceived = async (payload) => {
    const msg = JSON.parse(payload.body);
    console.log("message: ", msg);
    if (msg?.isNewAuction) {
      dispatch(removeListWaitingUser());
      dispatch(removeBidMessages());
      dispatch(removeUsers());
    }
    if (msg?.previouslyBid) {
      dispatch(
        setListWaitingUser({
          email: msg.newUser,
          joinCount: msg?.user?.joinCount,
          isWaiting: msg?.previouslyBid,
        })
      );
    }
    if (msg?.bids) {
      const parsedBidMessages = msg?.bids
        ?.map((message) => JSON.parse(message))
        ?.filter(
          (parsedMessage) =>
            Object?.keys(parsedMessage).length > 0 &&
            Number.isFinite(Number(parsedMessage.bidAmount))
        );
      dispatch(addBidMessages(parsedBidMessages));

      msg?.bidAmount &&
        message.success(
          `${msg?.sender} Vừa đấu giá ${appVariables.formatMoney(
            msg?.bidAmount
          )}`
        );
    }
    if (msg?.users) {
      dispatch(addUsers(msg?.users));
    }
    if (msg?.isOut) {
      dispatch(updateUserInRoom(msg?.users));
    }
    if (msg?.count) {
      setCountUser(msg?.count);
    }
  };

  const handleBidSubmit = () => {
    const isEmailUser = auctionReducer?.listWaitingUser?.some(
      (e) => e?.email === auth?.info?.email
    );
    if (waitingTime > 0 && isEmailUser) return;
    if (timeSendBid > 0) return;

    setTimeSendBid(30);

    const newBid = Number.parseFloat(bidAmount);
    if (newBid < highestBid) {
      appVariables.toast_notify_error(
        "Bạn không được đấu giá thấp hơn giá khởi điểm!"
      );
      return;
    }
    if (newBid === highestBid) {
      appVariables.toast_notify_error(
        "Bạn không được đấu giá bằng giá khởi điểm!"
      );
      return;
    }
    if (newBid > highestBid) {
      setHighestBid(newBid);
      setBidAmount(newBid);
      if (stompClient && stompClient.connected) {
        const chatMessage = {
          sender: auth?.info?.email,
          bidAmount: `${newBid}`,
          email: auth?.info?.email,
          client_id: auth?.info?.id,
          auction_id: roomId,
          type: "AUCTION",
          identity_key: auctionReducer?.auction?.identity_key,
          roomId,
        };
        stompClient.publish({
          destination: `/app/sendBidToRoom/${roomId}`,
          body: JSON.stringify(chatMessage),
        });
        setTimeout(() => {
          if (bidMessageRef.current) {
            bidMessageRef.current.scrollTo({
              top: bidMessageRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);
      } else {
        console.log("STOMP connection is not established yet.");
      }
    }
  };

  const handleClearAllBidMessage = () => {
    if (stompClient && stompClient.connected) {
      const chatMessage = {
        sender: auth?.info?.email,
        email: auth?.info?.email,
        client_id: auth?.info?.id,
        auction_id: roomId,
        clear: true,
        type: "AUCTION",
        roomId,
      };
      stompClient.publish({
        destination: `/app/clearBidToRoom/${roomId}`,
        body: JSON.stringify(chatMessage),
      });
    } else {
      console.log("STOMP connection is not established yet.");
    }
  };

  const handleBidChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const bidAmount = Number.parseFloat(rawValue);
    setBidAmount(bidAmount || 0);
  };

  const deleteBidMessage = () => {
    handleClearAllBidMessage();
    dispatch(removeBidMessages());
    dispatch(removeUsers());
  };

  const handleIncrement = () => {
    setBidAmount((prevBid) => prevBid + 1000000);
  };

  const handleDecrement = () => {
    const originPrice = Number.parseFloat(
      auctionReducer?.auction?.typeBuilding?.price
    );
    setBidAmount((prevBid) => {
      if (bidAmount < originPrice) {
        appVariables.toast_notify_error(
          "Bạn không được đấu giá thấp hơn giá khởi điểm!"
        );
        return originPrice;
      }
      return Math.max(0, prevBid - 1000000);
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const object = {
    disconnect: disconnect,
    users: auctionReducer?.users,
    bidMessageRef: bidMessageRef,
    deleteBidMessage: deleteBidMessage,
    countUser: auctionReducer?.users.length,
    bidMessages: auctionReducer?.bidMessages,
    formatMoney: appVariables.formatMoney,
    handleClearAllBidMessage: handleClearAllBidMessage,
    posViewHistoryAuctionRef,
    posViewGuestJoinAutionRef,
    posBtnOutAuctionRoomRef,
  };

  return (
    <div>
      {userData.connected && (
        <div className={styles.container}>
          <AuctionMessageModal object={object} />
          <div className={styles.sidebarToggle} onClick={toggleSidebar}>
            <i className="fa fa-bars"></i>
          </div>
          <AuctionMessage utils={object} />
          <AuctionGuideLine elementCoordinates={elementCoordinates} />
          <div
            className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitle}>Thông tin phòng</div>
              <button className={styles.closeSidebar} onClick={toggleSidebar}>
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className={styles.userInfo}>
              <div className={styles.userCount}>
                PHÒNG ĐẤU GIÁ: {auctionReducer?.auction?.name}
              </div>
              <div className={styles.userCount}>
                SỐ NGƯỜI TRONG PHÒNG: {countUser}
              </div>
            </div>

            <div className={styles.sidebarActions}></div>
          </div>
          <div
            className={`${styles.overlay} ${
              isSidebarOpen ? styles.active : ""
            }`}
            onClick={() => {
              setIsSidebarOpen(false);
            }}
          ></div>

          <div className={styles.columnsContainer}>
            <div className={styles.auctionColumn}>
              <div className={styles.itemSection}>
                <img
                  src={
                    auctionReducer?.auction?.buildingImages[0] ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt="Auction Item"
                  className={styles.itemImage}
                />
                <div className={styles.itemSection}>
                  <div className={styles.itemDescription} ref={posItemInfoRef}>
                    <h4>Tên nhà: {auctionReducer?.auction?.name}</h4>
                  </div>
                  <div className={styles.itemDescription}>
                    <b>
                      Giá gốc:{" "}
                      {appVariables.formatMoney(
                        auctionReducer?.auction?.typeBuilding?.price
                      )}
                    </b>
                  </div>
                  <div className={styles.itemDescription}>
                    <span>
                      Loại nhà:{" "}
                      {auctionReducer?.auction?.typeBuilding?.type_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.bidColumn}>
              <div className={styles.timeSection}>
                <h1 className={styles.auctionTitle}>
                  Phiên {auctionReducer?.auction?.nameAuction}
                </h1>
                <p className={styles.startDate}>
                  Ngày bắt đầu: {auctionReducer?.auction?.start_date}
                </p>
                <p className={styles.startDate}>
                  Thời hạn đấu giá:{" "}
                  {`${auctionReducer?.auction?.start_time} - ${auctionReducer?.auction?.end_time}`}
                </p>
                <p className={styles.timeRemaining} ref={posTimeRemainingRef}>
                  Thời gian đấu giá còn lại: {timeLeft}
                </p>
              </div>
              <div className={styles.bidSection}>
                <p
                  className={`${styles.currentBid} ${
                    bidUpdated ? styles.bidUpdate : ""
                  }`}
                >
                  Giá khởi điểm của bạn: {appVariables.formatMoney(highestBid)}
                </p>
                <div className={styles.bidInputContainer}>
                  <button
                    onClick={handleDecrement}
                    className={styles.decrementButton}
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={appVariables.formatMoney(bidAmount)}
                    onChange={handleBidChange}
                    placeholder="Enter your bid"
                    className={styles.bidInput}
                    ref={posBidInputRef}
                  />
                  <button
                    onClick={handleIncrement}
                    className={styles.incrementButton}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleBidSubmit}
                  className={styles.bidButton}
                  style={{
                    backgroundColor:
                      timeSendBid > 0
                        ? "#ff6b6b"
                        : auctionReducer?.listWaitingUser?.some(
                            (e) => e?.email === auth?.info?.email
                          ) && waitingTime > 0
                        ? "#ff6b6b"
                        : "#4ecdc4",
                  }}
                  disabled={
                    (auctionReducer?.listWaitingUser?.some(
                      (e) => e?.email === auth?.info?.email
                    ) &&
                      waitingTime > 0) ||
                    timeSendBid > 0
                  }
                >
                  {timeSendBid > 0
                    ? `Chờ ${timeSendBid}s`
                    : auctionReducer?.listWaitingUser?.some(
                        (e) => e?.email === auth?.info?.email
                      ) && waitingTime > 0
                    ? `Chờ ${waitingTime}s`
                    : "ĐẤU GIÁ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DauGiaComponent;
