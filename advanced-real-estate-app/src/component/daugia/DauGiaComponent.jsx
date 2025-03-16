/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import styles from "../../assets/css/daugia.module.css";
import { appInfo } from "../../constants/appInfos";
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
  userOutRoom,
} from "../../redux/reducers/auctionReducer";
import { authSelector } from "../../redux/reducers/authReducer";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { update } from "../../redux/reducers/chatReducer";
import RoomAuctionComponent from "./RoomAuctionComponent";
import { message } from "antd";
import AuctionMessageModal from "./AuctionMessageModal";

let stompClient = appVariables.stompClient;
const DauGiaComponent = () => {
  const chatMessagesRef = useRef(null);
  const dispatch = useDispatch();
  const auctionReducer = useSelector(auctionSelector);
  const auth = useSelector(authSelector);
  const userData = auctionReducer?.userData;
  const roomId = auctionReducer?.roomId;
  const [countUser, setCountUser] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [bidAmount, setBidAmount] = useState(0.0);
  const [highestBid, setHighestBid] = useState(0.0);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [auctionReducer?.bidMessages]);

  useEffect(() => {
    if (userData.connected) {
      connect();
    }
  }, [userData.connected, roomId]);

  useEffect(() => {
    if (auctionReducer?.bidMessages?.length > 0) {
      const maxBid = appVariables.findMax(auctionReducer?.bidMessages);
      if (parseFloat(maxBid) !== highestBid) {
        setBidAmount(parseFloat(maxBid));
        setHighestBid(parseFloat(maxBid));
      }
    } else {
      const auctionPrice = parseFloat(
        auctionReducer?.auction?.typeBuilding?.price
      );
      if (auctionPrice !== highestBid) {
        setBidAmount(auctionPrice);
        setHighestBid(auctionPrice);
      }
    }
  }, [auctionReducer?.bidMessages, userData.connected, roomId]);

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
      debug: (str) => {
        // console.log("debug: " + str);
      },
      onConnect: () => {
        // console.log("WebSocket connected!");
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
      dispatch(removeBidMessages());
      dispatch(removeUsers());
    }
    if (msg?.bids) {
      const parsedBidMessages = msg?.bids
        ?.map((message) => JSON.parse(message))
        ?.filter((parsedMessage) => Object?.keys(parsedMessage).length > 0);
      dispatch(addBidMessages(parsedBidMessages));
    }
    if (msg?.isSendBid) {
      message.success(
        `${msg?.sender} Vừa đấu giá ${appVariables.formatMoney(msg?.bidAmount)}`
      );
      msg?.bot_ai && message.success(`${msg?.bot_ai}`);
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
    const newBid = parseFloat(bidAmount);
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
      } else {
        console.log("STOMP connection is not established yet.");
      }
    }
  };

  const handleClearAllBidMessage = () => {
    console.log("clear bids");
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
    const bidAmount = parseFloat(rawValue);
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
    const originPrice = parseFloat(
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
  const object = {
    deleteBidMessage: deleteBidMessage,
    handleClearAllBidMessage: handleClearAllBidMessage,
  };

  return (
    <div>
      {userData.connected && (
        <div className={styles.container}>
          <AuctionMessageModal object={object} />
          <div className={styles.columnsContainer}>
            <div className={styles.auctionColumn}>
              <div className={styles.itemSection}>
                <img
                  src={auctionReducer?.auction?.buildingImages[0]}
                  alt="Auction Item"
                  className={styles.itemImage}
                />
                <div className={styles.itemSection}>
                  <div className={styles.itemDescription}>
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
                <p className={styles.timeRemaining}>
                  Thời gian đấu giá còn lại: {timeLeft}
                </p>
              </div>
              <div className={styles.bidSection}>
                <p className={styles.currentBid}>
                  Giá khởi điểm của bạn: {appVariables.formatMoney(highestBid)}
                </p>
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
                />
                <button
                  onClick={handleIncrement}
                  className={styles.incrementButton}
                >
                  +
                </button>
                <br />
                <button onClick={handleBidSubmit} className={styles.bidButton}>
                  ĐẤU GIÁ
                </button>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#AuctionMessageModal"
                  className={`${styles.primaryButton}`}
                >
                  XEM TIN NHẮN ĐẤU GIÁ
                </button>
              </div>
            </div>

            <div className={styles.userColumn}>
              <button
                onClick={disconnect}
                className={`${styles.secondaryButton}`}
              >
                Rời phòng
              </button>
              <hr />
              <p className={styles.userTitle}>
                SỐ NGƯỜI TRONG PHÒNG: {countUser}
              </p>
              {auctionReducer?.users?.map((user, index) => (
                <p key={index} className={styles.userName}>
                  <i
                    className="fa fa-user-secret text-primary"
                    id="exampleModalLabel"
                  ></i>
                  {" " + user}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DauGiaComponent;
