import { useState, useEffect } from "react";
import styles from "../../assets/css/auction-payment-form.module.css";
import { appVariables } from "../../constants/appVariables";
import { message } from "antd";
import { PaymentStatus } from "./../../screens/admin/AuctionContractScreen";
import { GrStatusGood } from "react-icons/gr";

const AuctionPayment = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    depositAmount: 0,
    outstandingBalance: 0,
    description: "",
  });

  const originAmount = props?.utils?.objectItem?.auctionDetail?.bidAmount || 0;
  const depositAmount = props?.utils?.objectItem?.depositAmount || 0;
  const outstandingBalance = props?.utils?.objectItem?.outstandingBalance || 0;
  const bidAmount = depositAmount > 0 ? outstandingBalance : originAmount;
  const currentDate = props?.utils?.objectItem?.confirmPaymentDate;
  const invoiceNumber = props?.utils?.objectItem?.code || "N/A";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const updatedOutstanding = bidAmount - formData.depositAmount;
    if (updatedOutstanding < 0) {
      message.error(
        "Số tiền bạn nhập vào đã lớn hơn số tiền đấu giá vui lòng nhập lại!"
      );
      return;
    }
    setFormData((prev) => ({
      ...prev,
      outstandingBalance: updatedOutstanding >= 0 ? updatedOutstanding : 0,
    }));
  }, [formData.depositAmount, bidAmount]);

  useEffect(() => {
    console.log("props: ", props);
  }, [props]);

  return (
    <div>
      {props?.utils?.openFormPayment && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.receiptHeader}>
              <div className={styles.receiptLogo}>
                <div className={styles.logoCircle}>
                  <span>INVOICE</span>
                </div>
              </div>
              <div className={styles.receiptInfo}>
                <h2 className={styles.receiptTitle}>LẬP HÓA ĐƠN THANH TOÁN</h2>
                <div className={styles.receiptMeta}>
                  <div className={styles.receiptMetaItem}>
                    <span>Mã hóa đơn:</span> {invoiceNumber}
                  </div>
                  <div className={styles.receiptMetaItem}>
                    <span>Ngày xác nhận thanh toán:</span> {currentDate}
                  </div>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => props?.utils?.setOpenFormPayment(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className={styles.receiptDivider}></div>

            <div className={styles.paymentSummary}>
              <div className={styles.summaryRow}>
                <div className={styles.summaryLabel}>
                  Tổng số tiền cần thanh toán:
                </div>
                <div className={styles.summaryValue}>
                  {appVariables.formatMoney(bidAmount)}
                </div>
              </div>
              <div className={styles.summaryRow}>
                <div className={styles.summaryLabel}>
                  Số tiền còn lại cần thanh toán:
                </div>
                <div className={styles.summaryValue}>
                  {appVariables.formatMoney(formData?.outstandingBalance)}
                </div>
              </div>
            </div>

            {props?.utils?.objectItem?.paymentStatus === 1 && (
              <div className={styles.paymentStatusContainer}>
                <PaymentStatus
                  styles={props?.utils?.styleElements.statusConfirmStyle}
                  message={`Đã xác nhận thanh toán`}
                  icon={<GrStatusGood style={{ fontSize: "25px" }} />}
                />
              </div>
            )}

            <div className={styles.receiptDivider}></div>

            <div className={styles.paymentForm}>
              <div className={styles.formGroup}>
                <label htmlFor="depositAmount" className={styles.label}>
                  Số tiền thanh toán
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    id="depositAmount"
                    name="depositAmount"
                    value={formData.depositAmount}
                    onChange={handleChange}
                    placeholder="0"
                    step="1000"
                    min="0"
                    className={styles.input}
                  />
                  <span className={styles.currencyLabel}>VND</span>
                </div>
                <div className={styles.helperText}>
                  Vui lòng nhập vào số tiền thanh toán
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Mô tả thanh toán
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả thanh toán..."
                  className={styles.textarea}
                  rows={2}
                />
                <div className={styles.textareaFooter}>
                  <div className={styles.helperText}>
                    Vui lòng mô tả chi tiết thanh toán
                  </div>
                  <div className={styles.charCount}>
                    {formData.description.length}/500
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.paymentMethod}>
              <div className={styles.paymentMethodHeader}>
                Phương thức thanh toán
              </div>
              <div className={styles.paymentMethodBody}>
                <div className={styles.paymentMethodItem}>
                  <div className={styles.paymentMethodRadio}>
                    <input
                      type="radio"
                      id="bank"
                      name="paymentMethod"
                      checked
                      readOnly
                    />
                    <label htmlFor="bank">Chuyển khoản ngân hàng</label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.receiptFooter}>
              <div className={styles.receiptNote}>
                * Yêu cầu chỉ cho khách hàng thanh toán trả góp tối đa 3 lần
              </div>
              <button
                onClick={() => {
                  props?.utils?.handleConfirmPayment({
                    id: props?.utils?.objectItem?.id,
                    formData: formData,
                    setIsSubmitting,
                  });
                }}
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác Nhận Thanh Toán"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionPayment;
