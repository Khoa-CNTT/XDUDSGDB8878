// src/components/ChatBotComponent.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "../../assets/css/chatBotComponent.module.css"; // Tạo file CSS tương ứng để định dạng
import handleAPI from "../../apis/handlAPI";
import {renderEffect} from "../../utils/functionCollectionUtil";
import {message} from "antd";
import {appVariables} from "../../constants/appVariables";
import {appInfo} from "../../constants/appInfos";

const ChatBotComponent = () => {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hiển thị khung chat
  const handleChatIconClick = () => {
    setIsChatBoxVisible(true);
    setMessages((prevMessages) => [
        ...prevMessages,
        {
            text: "Chào bạn! Tôi có thể giúp gì cho bạn về bất động sản?",
            sender: "bot",
        },
    ]);
  };

  // Đóng khung chat
  const handleCloseChat = () => {
    setIsChatBoxVisible(false);
  };

  // Gửi tin nhắn
  const sendMessage = async () => {
    const messageText = inputMessage.trim();

    if (messageText) {
      // Thêm tin nhắn của người dùng
        const url = `/api/buildings/search`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: messageText, sender: "user" },
      ]);
      const payload =  {
        message : messageText
      }
      try{
        const res = await handleAPI(url, payload, "POST");
        const pred = res?.prediction;
        const content = `${pred?.name || null} có diện tích ${pred?.acreage || null} mét vuông, tọa lạc tại số ${pred?.address || null}, quận ${pred?.district || null}, thành phố ${pred?.province || null}, phù hợp với ${pred?.description || null} và có ${pred?.number_of_basement || null} tầng hầm.`;
        setInputMessage(""); // Xóa nội dung input
        // Phản hồi của bot (giả lập)
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: content,
              sender: "bot",
            },
          ]);
        }, 500); // Độ trễ 0.5 giây
      }catch (error) {
        console.log(error);
        message.error("ERROR: " + error?.message);
      }
    } else {
      alert("Vui lòng nhập tin nhắn!");
    }
  };

  // Xử lý khi nhấn phím Enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn ngừa việc nhấn Enter tạo dòng mới
      sendMessage(); // Gửi tin nhắn
    }
  };

  return (
    <div className={styles.chat_container}>
      {/* Icon chat */}
      <div className={styles.chat_icon} onClick={handleChatIconClick}>
        <i
          className={`fa fa-comments ${styles.icon_gradient}`}
          style={{ fontSize: "55px", color: "#0d1329" }}
        ></i>
        {/*<img width={"10%"} src={appInfo.bot} alt="Chat box"></img>*/}
        {/*<img src="http://media.vietteltelecom.vn/upload/ckfinder/files/anhchatbot.png" alt="Chat box"></img>*/}
      </div>

      {/* Chat Box */}
      {isChatBoxVisible && (
          <div className={styles.chat_box}>
            <div className={styles.chat_header}>
            <span style={{fontSize:"13px"}}>Trợ lý ảo ADVANCED REAL ESTATE</span>
            <button className={styles.close_btn} onClick={handleCloseChat}>
              ✖
            </button>
          </div>

          <div className={styles.chat_content}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${msg.sender === 'bot' ? styles.bot : styles.user}`}>
                <div className={styles.bubble}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chat_footer}>
            <input
              type="text"
              placeholder="Nhập vào câu hỏi của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotComponent;
