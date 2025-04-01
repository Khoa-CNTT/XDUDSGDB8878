import React, { useState, useRef, useEffect } from "react";
import styles from "../../assets/css/chatBotComponent.module.css";
import { message } from "antd";
import handleAPI from "../../apis/handlAPI";
import { f_collectionUtil } from "../../utils/f_collectionUtil";

const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Chào bạn! Tôi có thể giúp gì cho bạn về bất động sản?",
          sender: "bot",
        },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    f_collectionUtil.scrollToBottom(messagesEndRef);
  }, [messages]);

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
      const payload = {
        message: messageText,
      };
      try {
        const res = await handleAPI(url, payload, "POST");
        const pred = res?.prediction;
        const content = `${pred?.name || null} có diện tích ${
          pred?.acreage || null
        } mét vuông, tọa lạc tại số ${pred?.address || null}, quận ${
          pred?.district || null
        }, thành phố ${pred?.province || null}, phù hợp với ${
          pred?.description || null
        } và có ${pred?.number_of_basement || null} tầng hầm.`;
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
      } catch (error) {
        console.log(error);
        message.error("ERROR: " + error?.message);
      }
    } else {
      alert("Vui lòng nhập tin nhắn!");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Content */}
      <div className={styles.chat_content} ref={messagesEndRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.user : styles.bot
            }`}
          >
            <div
              className={`${styles.bubble} ${
                msg.isLoading ? styles.loading_bubble : ""
              }`}
            >
              {msg.text}
              {msg.isLoading && (
                <span className={styles.loading_dots}>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Footer */}
      <div className={styles.chat_footer}>
        <input
          type="text"
          placeholder="Nhập câu hỏi của bạn..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.chat_input}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className={styles.send_btn}
          disabled={isLoading || !inputMessage.trim()}
        >
          <i
            className={`fa ${
              isLoading ? "fa-spinner fa-spin" : "fa-paper-plane"
            }`}
          ></i>
        </button>
      </div>
    </>
  );
};

export default AiChat;
