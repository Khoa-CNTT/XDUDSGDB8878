import styles from "../../assets/css/auction-contract-message.module.css";
import React, { useEffect, useState } from "react";
import { f_collectionUtil } from "../../utils/f_collectionUtil";

const AuctionContractMessage = (props) => {
  
  useEffect(() => {
    console.log("info: ", props?.info);
  }, [props]);

  useEffect(() => {
    console.log("late: ", props?.late);
  }, [props]);

  return (
    <div className={styles.messageContainer}>
      {!f_collectionUtil.checkContractTimeExceeded(props?.info?.settingDate) ? (
        <div className={styles.normalMessage}>
          <div className={styles.messageHeader}>
            <div className={styles.icon}>✓</div>
            <h3 className={styles.messageTitle}>Thông Báo Xác Nhận Hợp Đồng</h3>
          </div>
          <div className={styles.messageContent}>
            <p>
              Trong vòng 24 giờ nữa kể từ thời gian lập hợp đồng chúng tôi sẽ
              liên hệ bạn để gặp trực tiếp và cam kết, ký kết hợp đồng với quý khách.
            </p>
            <p>
              Nếu quý khách có thắc mắc gì vui lòng liên hệ hotline:{" "}
              <a href="tel:0915662495" className={styles.phoneLink}>
                <span className={styles.phoneIcon}>📞</span>
                0915662495
              </a>{" "}
              để biết thêm chi tiết.
            </p>
            <p className={styles.thankYou}>Xin chân thành cảm ơn quý khách!</p>
          </div>
          <div className={styles.timeIndicator}>
            <span className={styles.clockIcon}>⏱️</span>
            <span>24 giờ</span>
          </div>
        </div>
      ) : (
        <div className={styles.lateMessage}>
          <div className={styles.messageHeader}>
            <div className={styles.warningIcon}>⚠️</div>
            <h3 className={styles.messageTitle}>
              Xin Lỗi Vì Sự Chậm Trễ Trong Việc Xác Nhận Hợp Đồng!
            </h3>
          </div>
          <div className={styles.messageContent}>
            <p className={styles.greeting}>
              Kính gửi Anh/ Chị {props?.info?.full_name},
            </p>
            <p>
              Trước tiên, chúng tôi xin gửi lời cảm ơn chân thành đến Quý khách
              đã tin tưởng và tham gia đấu giá trên website của chúng tôi
            </p>

            <p>
              Chúng tôi chân thành xin lỗi vì sự chậm trễ trong việc xác nhận
              hợp đồng
              {` AUC-2025-${props?.info?.id}`}. Đây là sơ suất từ phía chúng tôi
              và hoàn toàn không mong muốn ảnh hưởng đến kế hoạch cũng như tiến
              độ công việc của Quý khách.
            </p>

            <p>
              Chúng tôi hiểu rằng sự chậm trễ này có thể gây ra bất tiện và cam
              kết sẽ nhanh chóng xử lý vấn đề để đảm bảo hợp đồng được xác nhận
              trong thời gian sớm nhất. Đồng thời, chúng tôi sẽ cải thiện quy
              trình làm việc để tránh tình trạng tương tự xảy ra trong tương
              lai.
            </p>

            <p>
              Một lần nữa, chúng tôi rất mong nhận được sự thông cảm từ Quý
              khách và hy vọng tiếp tục có cơ hội hợp tác, đồng hành cùng Quý
              khách trong thời gian tới. Nếu Quý khách có bất kỳ thắc mắc nào,
              xin vui lòng liên hệ với chúng tôi qua
              <b>{` Hotline: `}</b>
              <a href="tel:0915662495" className={styles.phoneLink}>
                <span className={styles.phoneIcon}>📞</span>
                0915662495
              </a>{" "}
              để được hỗ trợ ngay lập tức.
            </p>

            <div className={styles.signature}>
              <p>Trân trọng,</p>
              <p>Nhân viên tại Công Ty CP Đất Xanh Miền Trung</p>
              <p>
                <b>Hotline: </b>
                <a href="tel:0915662495" className={styles.phoneLink}>
                  <span className={styles.phoneIcon}>📞</span>
                  0915662495
                </a>{" "}
                | tranthetuong@dtu.edu.vn
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionContractMessage;
