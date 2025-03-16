import React, { useEffect } from "react";
import handleAPINotToken from "../../apis/handleAPINotToken";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import styles from "../../assets/css/chat-box.module.css";
import { Link } from "react-router-dom";
import { appVariables } from "../../constants/appVariables";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { add, chatSelector, update } from "../../redux/reducers/chatReducer";
import RoomChatComponent from "./RoomChatComponent";

let stompClient = appVariables.stompClient;
const ChatComponent = ({
  auth,
  messages,
  setMessages,
  countUser,
  setCountUser,
  chatContainerRef,
}) => {
  const chat = useSelector(chatSelector);
  const userData = chat?.userData;
  const room = chat?.room;
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData.connected) {
      connect();
    }
  }, [userData.connected, room]);

  useEffect(() => {
    return () => {
      if (stompClient && stompClient.connected) {
        disconnect().then();
      }
    };
  }, [userData.connected, room]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (stompClient && stompClient.connected) {
        disconnect().then(() => {
          console.log("Disconnected successfully before reloading.");
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [stompClient]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const connect = () => {
    console.log("Attempting to connect...");
    const socket = new SockJS("http://localhost:9090/ws");
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log("debug: " + str);
      },
      onConnect: () => {
        console.log("WebSocket connected!");
        onConnected();
      },
      onStompError: (frame) => {
        console.error("ERROR STOMP:", frame);
      },
      onWebSocketClose: (event) => {
        console.log("WebSocket connection closed.", event);
        dispatch(update((prevData) => ({ ...prevData, connected: false })));
      },
    });

    try {
      stompClient.activate();
      console.log("WebSocket activation initiated.");
    } catch (error) {
      console.error("Error activating WebSocket:", error);
    }
  };

  const onConnected = () => {
    stompClient.subscribe(`/topic/room/${room}`, (message) => {
      onMessageReceived(message).then();
    });

    stompClient.publish({
      destination: `/app/addUser/${room}`,
      body: JSON.stringify({
        sender: auth?.info?.email,
        email: auth?.info?.email,
        type: "JOIN",
        room,
      }),
    });
  };

  const disconnect = async () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/leaveRoom/${room}`,
        body: JSON.stringify({
          sender: auth?.info?.username,
          email: auth?.info?.email,
          type: "LEAVE",
        }),
      });
      stompClient.deactivate();
      console.log("WebSocket disconnected.");
      dispatch(update({ connected: false }));
      setMessages([]);
    } else {
      console.log("WebSocket is already disconnected.");
    }
  };

  const onMessageReceived = async (payload) => {
    const message = JSON.parse(payload.body);
    console.log("msg: ", message);
    if (message?.count) {
      setCountUser("Số user trong phòng: " + message?.count);
    }
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = () => {
    if (
      stompClient &&
      stompClient.connected &&
      userData.message.trim() !== ""
    ) {
      const chatMessage = {
        sender: auth?.info?.email,
        email: auth?.info?.email,
        content: userData.message,
        type: "CHAT",
        room,
      };
      stompClient.publish({
        destination: `/app/sendMessageToRoom/${room}`,
        body: JSON.stringify(chatMessage),
      });
      dispatch(update({ message: "" }));
    } else {
      console.log("STOMP connection is not established yet.");
    }
  };

  const handleMessageChange = (event) => {
    dispatch(update({ message: event.target.value }));
  };

  return (
    <div>
      {!userData.connected ? (
        <div>
          <RoomChatComponent />
        </div>
      ) : (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h2>Phòng: {room}</h2>
            <h3>Người dùng: {auth?.info?.username}</h3>
            <span className={styles.userCount}>{countUser} người</span>
            <button className={styles.exitButton} onClick={disconnect}>
              Thoát phòng
            </button>
          </div>

          <div className={styles.chatMessages} ref={chatContainerRef}>
            <ul>
              {messages.map((msg, index) => (
                <li key={index} className={styles.messageItem}>
                  <div
                    className={
                      msg.content !== null && msg.sender !== undefined
                        ? msg.sender === auth?.info?.email
                          ? `${styles.chatMessage} ${styles.chatMessageSelf}`
                          : `${styles.chatMessage} ${styles.chatMessageOther}`
                        : ""
                    }
                  >
                    <b>
                      {msg.content === null
                        ? ""
                        : msg.sender === undefined
                        ? ""
                        : msg.sender === null
                        ? "Anonymous: "
                        : msg.sender + ": "}
                    </b>
                    <span>{msg.content}</span>
                  </div>

                  {msg?.bot && (
                    <div className={`${styles.chatMessage} ${styles.chatBot}`}>
                      <span>
                        <b>Bot: </b>
                        {msg.bot}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.chatInputContainer}>
            <input
              className={styles.chatInput}
              type="text"
              value={userData.message}
              onChange={handleMessageChange}
              placeholder="Nhập tin nhắn..."
            />
            <button className={styles.sendButton} onClick={sendMessage}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
