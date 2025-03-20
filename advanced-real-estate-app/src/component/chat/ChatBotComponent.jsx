import React, { useState, useRef, useEffect } from "react";
import styles from "../../assets/css/chatBotComponent.module.css";
import handleAPI from "../../apis/handlAPI";
import { renderEffect } from "../../utils/functionCollectionUtil";
import { message } from "antd";
import { appVariables } from "../../constants/appVariables";
import { appInfo } from "../../constants/appInfos";
import AIChat from "./AiChat";
import StaffChat from "./StaffChat";
import { BsPeopleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../redux/reducers/chatReducer";
import { authSelector } from "../../redux/reducers/authReducer";

const ChatBotComponent = () => {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);

  const handleChatIconClick = () => {
    setIsChatBoxVisible(true);
  };

  const handleCloseChat = () => {
    setIsChatBoxVisible(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleRoomChange = () => {
    switchTab("staff");
    const chatData = {
      room: "counsel",
      userData: {
        connected: true,
        message: "",
      },
    };
    dispatch(add(chatData));
  };

  return (
    <div className={styles.chat_container}>
      {/* Chat Icon */}
      <div className={styles.chat_icon} onClick={handleChatIconClick}>
        <i className={`fa fa-comments ${styles.icon_gradient}`}></i>
      </div>

      {/* Chat Box */}
      {isChatBoxVisible && (
        <div className={styles.chat_box}>
          {/* Chat Header with Tabs */}
          <div className={styles.chat_header}>
            {/* Tabs */}
            <div className={styles.tab_container}>
              <button
                className={`${styles.tab} ${
                  activeTab === "ai" ? styles.active_tab : ""
                }`}
                onClick={() => switchTab("ai")}
              >
                <div className={styles.tab_icon_wrapper}>
                  <img
                    src={appInfo.bot_ai}
                    alt="AI Bot"
                    className={styles.bot_icon}
                  />
                </div>
                <span>Trợ lý ảo</span>
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "staff" ? styles.active_tab : ""
                }`}
                onClick={handleRoomChange}
              >
                <BsPeopleFill />
                <span>Nhân viên tư vấn</span>
              </button>
            </div>

            {/* Header Title and Close Button */}
            <div className={styles.header_content}>
              <span className={styles.header_title}>
                {activeTab === "ai"
                  ? "Trợ lý ảo ADVANCED REAL ESTATE"
                  : "Tư vấn trực tiếp"}
              </span>
              <button className={styles.close_btn} onClick={handleCloseChat}>
                ✖
              </button>
            </div>
          </div>

          {activeTab === "ai" && <AIChat />}

          {activeTab === "staff" && <StaffChat />}
        </div>
      )}
    </div>
  );
};

export default ChatBotComponent;
