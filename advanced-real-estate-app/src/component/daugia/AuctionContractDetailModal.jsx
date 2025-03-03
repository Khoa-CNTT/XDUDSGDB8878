import React, {useEffect, useState} from 'react';
import auctionDetailModelStyles from "../../assets/css/detail-auction-modal.module.css";
import styles from "../../assets/css/auction-win-detail.module.css";
import styleAuctionWins from '../../assets/css/auction-win.module.css';
import {appVariables} from "../../constants/appVariables";
import {Link, useNavigate} from "react-router-dom";
import {f_collectionUtil} from "../../utils/f_collectionUtil";
import {StatusBadge, WinBadge} from "./AuctionWin";
import {elements} from "../element/errorElement";
import {Button, message} from "antd";
import handleAPI from "../../apis/handlAPI";
import {useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import styleAuctionContractDetails from "../../assets/css/auction-contract-detail.module.css"

const AuctionContractDetailModal = (props) => {
    
const contractDate = new Date().toLocaleDateString("vi-VN")
  const auctionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")

  return (
    <div
      className="modal fade"
      id="auctionContractDetailModal"
      tabIndex={-1}
      aria-labelledby="auctionContractDetailModalLabel"
      aria-hidden="true"
    >
      <div className={`modal-dialog ${styleAuctionContractDetails.modalLarge}`}>
        <div className={`modal-content ${styleAuctionContractDetails.modalContent}`}>
          <div className={`modal-header ${styleAuctionContractDetails.modalHeader}`}>
            <i className="fa fa-balance-scale text-primary" id="exampleModalLabel"></i>
            <b className={styleAuctionContractDetails.modalTitle}>{"chi tiết hợp đồng đấu giá".toUpperCase()}</b>
            <div style={{ marginLeft: "10px" }}>
              {props?.utils?.objectItem?.result === appVariables.WIN && <WinBadge />}
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className={`modal-body ${styleAuctionContractDetails.modalBody}`}>
            <div className={styleAuctionContractDetails.contractSection}>
              <h2 className={styleAuctionContractDetails.contractTitle}>Hợp Đồng Đấu Giá</h2>

              <div className={styleAuctionContractDetails.contractInfo}>
                <div className={styleAuctionContractDetails.infoItem}>
                  <span className={styleAuctionContractDetails.infoLabel}>Số Hợp Đồng:</span>
                  <span className={styleAuctionContractDetails.infoValue}>
                    AUC-2023-{props?.utils?.objectItem?.id || "0000"}
                  </span>
                </div>
                <div className={styleAuctionContractDetails.infoItem}>
                  <span className={styleAuctionContractDetails.infoLabel}>Ngày Lập:</span>
                  <span className={styleAuctionContractDetails.infoValue}>{contractDate}</span>
                </div>
                <div className={styleAuctionContractDetails.infoItem}>
                  <span className={styleAuctionContractDetails.infoLabel}>Ngày Đấu Giá:</span>
                  <span className={styleAuctionContractDetails.infoValue}>{auctionDate}</span>
                </div>
              </div>

              <div className={styleAuctionContractDetails.partiesSection}>
                <h3 className={styleAuctionContractDetails.sectionTitle}>Các Bên Tham Gia</h3>
                <div className={styleAuctionContractDetails.party}>
                  <h4 className={styleAuctionContractDetails.partyTitle}>Bên A (Đơn Vị Tổ Chức Đấu Giá):</h4>
                  <p>Công ty Đấu giá XYZ</p>
                  <p>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                  <p>Đại diện: Ông/Bà Nguyễn Văn A</p>
                </div>
                <div className={styleAuctionContractDetails.party}>
                  <h4 className={styleAuctionContractDetails.partyTitle}>Bên B (Người Tham Gia Đấu Giá):</h4>
                  <p>Họ tên: {props?.utils?.objectItem?.bidderName || "Chưa xác định"}</p>
                  <p>CMND/CCCD: {props?.utils?.objectItem?.bidderIdNumber || "Chưa xác định"}</p>
                  <p>Địa chỉ: {props?.utils?.objectItem?.bidderAddress || "Chưa xác định"}</p>
                </div>
              </div>

              <div className={styleAuctionContractDetails.auctionDetails}>
                <h3 className={styleAuctionContractDetails.sectionTitle}>Chi Tiết Đấu Giá</h3>
                <div className={styleAuctionContractDetails.detailItem}>
                  <span className={styleAuctionContractDetails.detailLabel}>Tài Sản Đấu Giá:</span>
                  <span className={styleAuctionContractDetails.detailValue}>
                    {props?.utils?.objectItem?.assetName || "Chưa xác định"}
                  </span>
                </div>
                <div className={styleAuctionContractDetails.detailItem}>
                  <span className={styleAuctionContractDetails.detailLabel}>Giá Khởi Điểm:</span>
                  <span className={styleAuctionContractDetails.detailValue}>
                    {props?.utils?.objectItem?.startingPrice?.toLocaleString("vi-VN") || "0"} VNĐ
                  </span>
                </div>
                <div className={styleAuctionContractDetails.detailItem}>
                  <span className={styleAuctionContractDetails.detailLabel}>Giá Trúng Đấu Giá:</span>
                  <span className={styleAuctionContractDetails.detailValue}>
                    {props?.utils?.objectItem?.winningBid?.toLocaleString("vi-VN") || "0"} VNĐ
                  </span>
                </div>
              </div>

              <div className={styleAuctionContractDetails.termsSection}>
                <h3 className={styleAuctionContractDetails.sectionTitle}>Điều Khoản và Điều Kiện</h3>
                <ol className={styleAuctionContractDetails.termsList}>
                  <li>Bên B đồng ý mua tài sản đấu giá với giá trúng đấu giá nêu trên.</li>
                  <li>
                    Bên B phải thanh toán đầy đủ số tiền trúng đấu giá trong vòng 3 ngày làm việc kể từ ngày ký hợp
                    đồng.
                  </li>
                  <li>Bên A có trách nhiệm bàn giao tài sản cho Bên B trong vòng 7 ngày sau khi nhận đủ tiền.</li>
                  <li>Mọi tranh chấp sẽ được giải quyết thông qua thương lượng hoặc tòa án có thẩm quyền.</li>
                </ol>
              </div>

              <div className={styleAuctionContractDetails.signatureSection}>
                <div className={styleAuctionContractDetails.signature}>
                  <p>Đại diện Bên A</p>
                  <div className={styleAuctionContractDetails.signatureLine}></div>
                </div>
                <div className={styleAuctionContractDetails.signature}>
                  <p>Bên B</p>
                  <div className={styleAuctionContractDetails.signatureLine}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={`modal-footer ${styleAuctionContractDetails.modalFooter}`}>
            <Button className={"btn btn-success"}>{"Hoàn thành thủ tục"}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionContractDetailModal;