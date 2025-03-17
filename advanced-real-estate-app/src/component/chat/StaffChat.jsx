import { useState, useEffect, useRef, Fragment } from "react";
import styles from "../../assets/css/staff-chat.module.css";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  add,
  chatSelector,
  update,
  setStaffsOnline,
  setStaffsOffline,
} from "../../redux/reducers/chatReducer";
import { f_collectionUtil } from "../../utils/f_collectionUtil";
import { BsPeopleFill } from "react-icons/bs";
import { appVariables } from "../../constants/appVariables";
import { AiOutlineMenu } from "react-icons/ai";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import ChatBotLoading from "./ChatBotLoading";
import { RiRobot3Fill } from "react-icons/ri";
import { RiRobot3Line } from "react-icons/ri";

let stompClient = appVariables.stompClient;

function StaffStatus(props) {
  return (
    <div className={styles.status_container}>
      <span
        className={`${styles.status_dot} ${
          props?.isOnline ? styles.status_online : styles.status_offline
        }`}
      >
        {props?.isOnline && <span className={styles.status_ping} />}
      </span>
      <span className={styles.status_text}>
        {props?.isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}

const StaffChat = (props) => {
  const auth = useSelector(authSelector);
  const [messages, setMessages] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const chatContainerRef = useRef(null);
  const chat = useSelector(chatSelector);
  const userData = chat?.userData;
  const room = chat?.room;
  const dispatch = useDispatch();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    f_collectionUtil.handleCollectionArrayNotAuth(
      `/api/user/user-staffs`,
      (data) => {
        setStaffs(data);
        if (data.length > 0 && !activeUser) {
          setActiveUser(data[0]);
        }
      }
    );
  }, []);

  useEffect(() => {
    f_collectionUtil.handleCollectionArray(
      `/api/admin/user-clients`,
      setClients,
      auth?.token
    );
  }, []);

  useEffect(() => {
    if (userData.connected && activeUser) {
      connect();
    }
  }, [userData.connected, activeUser]);

  useEffect(() => {
    return () => {
      if (stompClient && stompClient.connected) {
        disconnect().then();
      }
    };
  }, [userData.connected, activeUser]);

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
    f_collectionUtil.scrollToBottom(chatContainerRef);
  }, [messages]);

  useEffect(() => {
    const storedTab = localStorage.getItem("user");
    if (storedTab) {
      const activeTab = staffs.find((user) => user?.email === storedTab);
      if (activeTab) {
        setActiveUser(activeTab);
      }
    }
  }, [staffs]);

  useEffect(() => {
    const storedTab = localStorage.getItem("user");
    if (storedTab) {
      const activeTab = clients.find((user) => user?.email === storedTab);
      if (activeTab) {
        setActiveUser(activeTab);
      }
    }
  }, [clients]);

  const connect = () => {
    const socket = new SockJS("http://localhost:9090/ws");
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {},
      onConnect: () => {
        onConnected();
      },
      onStompError: (frame) => {
        console.error("ERROR STOMP:", frame);
      },
      onWebSocketClose: (event) => {},
    });
    try {
      stompClient.activate();
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
        sender: auth?.info?.email || "guest".toUpperCase(),
        email: auth?.info?.email || "guest".toUpperCase(),
        type: "JOIN",
        room: room,
      }),
    });
  };

  const disconnect = async () => {
    if (stompClient && stompClient.connected && activeUser) {
      stompClient.publish({
        destination: `/app/leaveRoom/${room}`,
        body: JSON.stringify({
          sender: auth?.info?.email || "guest".toUpperCase(),
          email: auth?.info?.email || "guest".toUpperCase(),
          type: "LEAVE",
        }),
      });
      dispatch(setStaffsOffline());
      stompClient.deactivate();
    } else {
      console.log("WebSocket is already disconnected.");
    }
  };

  const onMessageReceived = async (payload) => {
    const message = JSON.parse(payload.body);
    if (!auth?.isAuth && message?.content) {
      console.log("message: ", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsLoading(false);
      return;
    }
    f_collectionUtil.handleCollectionArrayNotAuth(
      `/api/user/user-messages/${auth?.info?.id}/${activeUser?.email}`,
      setMessages
    );
    if (message?.listUserOnline) {
      dispatch(setStaffsOnline(message?.listUserOnline));
    }
    setIsLoading(false);
  };

  const sendMessage = () => {
    if (
      stompClient &&
      stompClient.connected &&
      userData.message.trim() !== "" &&
      activeUser
    ) {
      const staffRoom = `${room}_${activeUser?.roles}_${activeUser.email}`;
      setIsLoading(true);
      const chatMessage = {
        sender: auth?.info?.email || "guest".toUpperCase(),
        recipient: activeUser.email,
        email: auth?.info?.email || "guest".toUpperCase(),
        content: userData.message,
        isAuth: auth?.isAuth,
        room: staffRoom,
        type: "CHAT",
      };
      stompClient.publish({
        destination: `/app/sendMessageToRoom/${room}`,
        body: JSON.stringify(chatMessage),
      });
    } else {
      console.log("STOMP connection is not established yet.");
    }
  };

  const handleUserActiveChange = (user) => {
    localStorage.setItem("user", user?.email);
    setActiveUser(user);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const getInitials = (sender) => {
    if (typeof sender === "string") {
      return sender.substring(0, 2).toUpperCase();
    }

    const email = sender.email || "";
    const name = sender.name || email;

    if (!name) return "?";

    const parts = name.split("@")[0].split(/[._-]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={`${styles.staff_chat_container} ${
        !sidebarVisible ? styles.sidebar_collapsed : ""
      }`}
    >
      <div
        className={`${styles.staff_sidebar} ${
          !sidebarVisible ? styles.sidebar_icons_only : ""
        }`}
      >
        <div className={styles.sidebar_header}>
          <span className={styles.sidebar_title}>Người dùng</span>
        </div>
        <div className={styles.toggle_container}>
          <div
            className={`${styles.staff_item} ${styles.toggle_item}`}
            onClick={toggleSidebar}
          >
            <div
              className={`${styles.staff_avatar} ${styles.toggle_avatar}`}
              title={sidebarVisible ? "Hide staff list" : "Show staff list"}
            >
              <div className={styles.toggle_icon}>
                {sidebarVisible ? <AiOutlineCaretLeft /> : <AiOutlineMenu />}
              </div>
            </div>
            <div className={styles.staff_info}>
              <div className={styles.staff_email}>
                {sidebarVisible ? "Ẩn danh sách" : "Hiện danh sách"}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.staff_list}>
          {staffs?.map((user, index) => (
            <div
              key={index}
              className={`${styles.staff_item} ${
                activeUser?.email === user?.email ? styles.active_staff : ""
              }`}
              onClick={() => handleUserActiveChange(user)}
            >
              <div className={styles.staff_avatar_container}>
                <div className={styles.staff_status}>
                  <StaffStatus
                    isOnline={chat?.staffsOnline?.includes(user?.email)}
                  />
                </div>
                <div className={styles.staff_avatar} title={user?.email}>
                  {user?.email.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={styles.staff_info}>
                <div
                  style={{ top: "28px", position: "relative" }}
                  className={styles.staff_email}
                >
                  {user?.email}
                </div>
                <div style={{ paddingTop: "20px", fontSize: "8.5px" }}>
                  {user?.roles}
                </div>
              </div>
            </div>
          ))}
          {clients?.map((user, index) => (
            <div
              key={index}
              className={`${styles.staff_item} ${
                activeUser?.email === user?.email ? styles.active_staff : ""
              }`}
              onClick={() => handleUserActiveChange(user)}
            >
              <div className={styles.staff_avatar_container}>
                <div className={styles.staff_status}>
                  <StaffStatus
                    isOnline={chat?.staffsOnline?.includes(user?.email)}
                  />
                </div>
                <div className={styles.staff_avatar} title={user.email}>
                  {user?.email.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={styles.staff_info}>
                <div
                  style={{ top: "28px", position: "relative" }}
                  className={styles.staff_email}
                >
                  {user?.email}
                </div>
                <div style={{ paddingTop: "20px", fontSize: "8.5px" }}>
                  {user?.roles}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={styles.staff_chat_area}>
        {activeUser ? (
          <>
            <div className={styles.staff_chat_header}>
              <div className={styles.active_staff_info}>
                <div className={styles.staff_avatar}>
                  {activeUser?.email.charAt(0).toUpperCase()}
                </div>
                <div className={styles.staff_email}>{activeUser?.email}</div>
              </div>
            </div>

            <div className={styles.chat_content} ref={chatContainerRef}>
              {[...messages]
                .sort((a, b) => a.index - b.index)
                ?.map((msg, index) => (
                  <Fragment key={msg?.index || index}>
                    {msg?.bot_ai && (
                      <div className={styles.messageRow}>
                        <div className={styles.avatarContainer}>
                          <div className={styles.avatar}>
                            <div className={styles.botAvatarFallback}>
                              <RiRobot3Line />
                            </div>
                          </div>
                        </div>
                        <li
                          className={`${styles.messageItem} ${styles.other_message}`}
                        >
                          <div>
                            <span className={styles.sender_name}>
                              {"Bot AI"}
                            </span>
                            <span className={styles.message_content}>
                              {msg?.bot_ai.trim()}
                            </span>
                          </div>
                        </li>
                      </div>
                    )}

                    <div
                      className={
                        msg?.sender?.email === auth?.info?.email
                          ? styles.messageRowReverse
                          : styles.messageRow
                      }
                    >
                      <div className={styles.avatarContainer}>
                        <div className={styles.avatar}>
                          <div
                            className={
                              msg?.sender?.email === auth?.info?.email
                                ? styles.ownAvatarFallback
                                : styles.otherAvatarFallback
                            }
                          >
                            {getInitials(msg?.sender)}
                          </div>
                        </div>
                      </div>

                      <li
                        className={`${styles.messageItem} ${
                          msg?.sender?.email === auth?.info?.email
                            ? styles.own_message
                            : styles.other_message
                        }`}
                      >
                        <div>
                          <span className={styles.sender_name}>
                            {msg?.sender?.email || msg?.sender}
                          </span>
                          <span className={styles.message_content}>
                            {msg?.content}
                          </span>
                        </div>
                      </li>
                    </div>
                  </Fragment>
                ))}
              {isLoading && !auth?.isAuth && (
                <ChatBotLoading botName="Bot AI" />
              )}
            </div>

            <div className={styles.chat_input_area}>
              <input
                type="text"
                className={styles.chat_input}
                placeholder="Nhập tin nhắn..."
                value={userData.message}
                onChange={(e) => dispatch(update({ message: e.target.value }))}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className={styles.send_btn}
                disabled={!userData.message.trim()}
              >
                <i className={`fa fa-paper-plane`}></i>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.no_staff_selected}>
            Please select a staff member to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffChat;
