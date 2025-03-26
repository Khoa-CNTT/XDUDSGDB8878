import { Link } from "react-router-dom";
import React, { useState } from "react";
import AuctionWin from "../daugia/AuctionWin";
import BuildingUser from "../building/BuildingUser";
import AuctionHistory from "../daugia/AuctionHistory";
import AuctionContract from "../daugia/AuctionContract";
import styles from "../../assets/css/user-manager.module.css";
import { FaRegWindowRestore } from "react-icons/fa";
import Payment from "../transaction/Payment";
import { FaRegAddressCard, FaRegCreditCard } from "react-icons/fa";
import { TbHomeHand } from "react-icons/tb";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import BuildingContract from "./../building/BuildingContract";
import { RiContractFill } from "react-icons/ri";
import Bill from "../transaction/Bill";

export const componentElement = {
  auctions: [
    {
      element: <AuctionWin />,
      tabName: "winning",
    },
    {
      element: <AuctionHistory />,
      tabName: "history",
    },
    {
      element: <AuctionContract />,
      tabName: "contract",
    },
  ],
  buildings: [
    {
      element: <BuildingUser />,
      tabName: "user_building",
    },
    {
      element: <BuildingContract />,
      tabName: "contract_building",
    },
  ],
  transactions: [
    {
      element: <Payment />,
      tabName: "payment",
    },
    {
      element: <Bill />,
      tabName: "bill",
    },
  ],
  auctionButtons: [
    {
      element: (activeTab, handleTabName) => {
        return (
          <>
            <button
              className={`${styles.navButton} ${
                activeTab === "winning" ? styles.activeNavButton : ""
              }`}
              onClick={() => handleTabName("winning")}
            >
              <i className={`fa fa-trophy ${styles.navIcon}`}></i>
              <span>Phiên chiến thắng</span>
              {activeTab === "winning" && (
                <i
                  className={`fa fa-chevron-right ${styles.navActiveIcon}`}
                ></i>
              )}
            </button>
          </>
        );
      },
      tabName: "winning",
    },
    {
      element: (activeTab, handleTabName) => {
        return (
          <>
            <button
              className={`${styles.navButton} ${
                activeTab === "history" ? styles.activeNavButton : ""
              }`}
              onClick={() => handleTabName("history")}
            >
              <i className={`fa fa-history ${styles.navIcon}`}></i>
              <span>Lịch sử đấu giá</span>
              {activeTab === "history" && (
                <i
                  className={`fa fa-chevron-right ${styles.navActiveIcon}`}
                ></i>
              )}
            </button>
          </>
        );
      },
      tabName: "history",
    },
    {
      element: (activeTab, handleTabName) => {
        return (
          <>
            <button
              className={`${styles.navButton} ${
                activeTab === "contract" ? styles.activeNavButton : ""
              }`}
              onClick={() => handleTabName("contract")}
            >
              <i className={`fa fa-file-text ${styles.navIcon}`}></i>
              <span>Hợp đồng đấu giá</span>
              {activeTab === "contract" && (
                <i
                  className={`fa fa-chevron-right ${styles.navActiveIcon}`}
                ></i>
              )}
            </button>
          </>
        );
      },
      tabName: "contract",
    },
  ],
  buildingButtons: [
    {
      element: (activeTab, handleTabName) => {
        return (
          <>
            <button
              className={`${styles.navButton} ${
                activeTab === "user_building" ? styles.activeNavButton : ""
              }`}
              onClick={() => handleTabName("user_building")}
            >
              <TbHomeHand className={`${styles.navIcon}`} />
              <span>Bất động sản đã mua</span>
              {activeTab === "user_building" && (
                <i
                  className={`fa fa-chevron-right ${styles.navActiveIcon}`}
                ></i>
              )}
            </button>
          </>
        );
      },
      tabName: "user_building",
    },
    {
      element: (activeTab, handleTabName) => {
        return (
          <>
            <button
              className={`${styles.navButton} ${
                activeTab === "contract_building" ? styles.activeNavButton : ""
              }`}
              onClick={() => handleTabName("contract_building")}
            >
              <RiContractFill className={`${styles.navIcon}`} />
              <span>Hợp đồng mua bán</span>
              {activeTab === "contract_building" && (
                <i
                  className={`fa fa-chevron-right ${styles.navActiveIcon}`}
                ></i>
              )}
            </button>
          </>
        );
      },
      tabName: "contract_building",
    },
  ],
  buttonTransactions: [
    {
      element: (activeTab, handleTabName) => {
        return (
          <>
            <button
              className={`${styles.navButton} ${
                activeTab === "payment" ? styles.activeNavButton : ""
              }`}
              onClick={() => handleTabName("payment")}
            >
              <FaRegCreditCard className={`${styles.navIcon}`} />
              <span>Thanh toán</span>
              {activeTab === "payment" && (
                <i
                  className={`fa fa-chevron-right ${styles.navActiveIcon}`}
                ></i>
              )}
            </button>
          </>
        );
      },
      tabName: "payment",
    },
    {
      element: (activeTab, handleTabName) => {
        return (
          <>
            <button
              className={`${styles.navButton} ${
                activeTab === "bill" ? styles.activeNavButton : ""
              }`}
              onClick={() => handleTabName("bill")}
            >
              <FaMoneyBillTransfer className={`${styles.navIcon}`} />
              <span>Hóa đơn giao dịch</span>
              {activeTab === "bill" && (
                <i
                  className={`fa fa-chevron-right ${styles.navActiveIcon}`}
                ></i>
              )}
            </button>
          </>
        );
      },
      tabName: "bill",
    },
  ],
};
