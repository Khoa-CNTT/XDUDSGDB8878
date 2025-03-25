import React, { useEffect, useState, useRef, useMemo } from "react";
import styles from "../../assets/css/loading.module.css";
import { f_collectionUtil } from "../../utils/f_collectionUtil";
import { useNavigate } from "react-router-dom";
import { appInfo } from "../../constants/appInfos";
import { RiRobot3Fill } from "react-icons/ri";
import { RiRobot3Line } from "react-icons/ri";
const ChatBotLoading = (props) => {
  const [dotsCount, setDotsCount] = useState(1);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotsCount((prev) => (prev < 3 ? prev + 1 : 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [dotsCount]);

  return (
    <div ref={messagesEndRef}>
      <li className={`${styles.chatItem} ${styles.botMessage}`}>
        <div className={styles.messageContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <RiRobot3Line/>
            </div>
          </div>
          <div className={styles.contentWrapper}>
            <span className={styles.senderName}>{appInfo.nameAI}</span>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span className={styles.typingText}>Thinking</span>
                <div className={styles.dotsContainer}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`${styles.dot} ${
                        i <= dotsCount ? styles.activeDot : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default ChatBotLoading;
