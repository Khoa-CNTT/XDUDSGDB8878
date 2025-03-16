/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { appInfo } from "../../constants/appInfos";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/info.module.css";
import { message, Upload } from "antd";
import {
  setSelectedArea,
  setSelectedStructure,
  setSelectedType,
} from "../../redux/reducers/buildingReducer";
import InfoModal from "../../component/info/InfoModal";
import handleAPI from "../../apis/handlAPI";

const InfoUserScreen = () => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const getUserInfo = async () => {
    try {
      const res = await handleAPI(`/api/users/my-info`, {}, "GET", auth?.token);
      return res;
    } catch (e) {
      message.error(e.message);
      console.log("Error: ", e);
    }
  };

  useEffect(() => {
    getUserInfo()
      .then((data) => {
        setUser(data?.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div
      style={{
        paddingTop: "150px",
      }}
    >
      <InfoModal getUserInfo={getUserInfo} user={user} setUser={setUser} />

      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="text-center wow fadeInUp"
            data-wow-delay="0.1s"
            style={{
              visibility: "visible",
              animationDelay: "0.1s",
              animationName: "fadeInUp",
            }}
          >
            <h6 className="section-title text-center text-primary text-uppercase">
              {appInfo.title}
            </h6>
            <h1 className="mb-4">
              {/*THÔNG TIN <span className="text-primary text-uppercase">CÁ NHÂN</span>*/}
            </h1>
          </div>
          <div className="row g-5">
            <div className="col-lg-12">
              <div
                className="wow fadeInUp"
                data-wow-delay="0.2s"
                style={{
                  visibility: "visible",
                  animationDelay: "0.2s",
                  animationName: "fadeInUp",
                }}
              >
                <div className={styles.userInfoCard}>
                  <div className={styles.userInfoCardHeader}>
                    <div className={styles.avatarContainer}>
                      <img
                        src={auth?.info?.avatar || appInfo.avatar}
                        alt="User Avatar"
                        className={styles.avatar}
                      />
                    </div>
                    <div className={styles.headerText}>
                      <h4>THÔNG TIN</h4>
                      <h4 className="text-primary text-uppercase">CÁ NHÂN</h4>
                    </div>
                  </div>
                  <div className={styles.userInfoCardContent}>
                    <p>
                      <strong>Họ và tên:</strong> {user?.user_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p>
                      <strong>Họ:</strong> {user?.first_name}
                    </p>
                    <p>
                      <strong>Tên:</strong> {user?.last_name}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {user?.phone_number}
                    </p>
                    <p>
                      <strong>Giới tính:</strong> {user?.gender}
                    </p>
                    <p>
                      <strong>Ngày sinh:</strong> {user?.birthday}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {user?.address}
                    </p>
                    <p>
                      <strong>Vai trò:</strong> {auth?.roles}
                    </p>
                    <div className={styles.blockButton}>
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#RemoveModal"
                        className={"btn btn-primary"}
                      >
                        <span style={{ paddingRight: 15 }}>
                          CHỈNH SỬA THÔNG TIN
                        </span>
                        <i className="fa fa-edit text-default me-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoUserScreen;
