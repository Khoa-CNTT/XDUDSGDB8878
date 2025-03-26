import { Link } from "react-router-dom";
import React, { useState } from "react";
import styles from "../../assets/css/user-manager.module.css";
import { FaRegWindowRestore } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { TbHomeHand } from "react-icons/tb";
import { RiContractFill } from "react-icons/ri";
import { FaMoneyBillTransfer } from "react-icons/fa6";

export const mobileElement = {
  auctionButtons: [
    {
      element: (activeTab, handleTabName) => {
        return (
          <>
            <button
              className={`${styles.mobileNavButton} ${
                activeTab === "winning" ? styles.activeMobileNavButton : ""
              }`}
              onClick={() => handleTabName("winning")}
            >
              <i className={`fa fa-trophy ${styles.mobileNavIcon}`}></i>
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
              className={`${styles.mobileNavButton} ${
                activeTab === "history" ? styles.activeMobileNavButton : ""
              }`}
              onClick={() => handleTabName("history")}
            >
              <i className={`fa fa-history ${styles.mobileNavIcon}`}></i>
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
              className={`${styles.mobileNavButton} ${
                activeTab === "contract" ? styles.activeMobileNavButton : ""
              }`}
              onClick={() => handleTabName("contract")}
            >
              <i className={`fa fa-file-text ${styles.mobileNavIcon}`}></i>
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
              className={`${styles.mobileNavButton} ${
                activeTab === "user_building"
                  ? styles.activeMobileNavButton
                  : ""
              }`}
              onClick={() => handleTabName("user_building")}
            >
              <TbHomeHand className={`${styles.mobileNavIcon}`} />
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
              className={`${styles.mobileNavButton} ${
                activeTab === "contract_building"
                  ? styles.activeMobileNavButton
                  : ""
              }`}
              onClick={() => handleTabName("contract_building")}
            >
              <RiContractFill className={`${styles.mobileNavIcon}`} />
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
              className={`${styles.mobileNavButton} ${
                activeTab === "payment" ? styles.activeMobileNavButton : ""
              }`}
              onClick={() => handleTabName("payment")}
            >
              <FaRegCreditCard className={`${styles.mobileNavIcon}`} />
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
              className={`${styles.mobileNavButton} ${
                activeTab === "bill" ? styles.activeMobileNavButton : ""
              }`}
              onClick={() => handleTabName("bill")}
            >
              <FaMoneyBillTransfer className={`${styles.mobileNavIcon}`} />
            </button>
          </>
        );
      },
      tabName: "bill",
    },
  ],
};
