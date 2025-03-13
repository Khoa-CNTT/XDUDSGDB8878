/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Filter from "./Filter";
import { appInfo } from "../../constants/appInfos";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "../../redux/reducers/authReducer";
import handleAPI from "../../apis/handlAPI";
import { message } from "antd";
import styles from "../../assets/css/header-client.module.css";
import { updatedAuctionRoom } from "../../redux/reducers/auctionReducer";
import { linkElements } from "../element/linkElement";

const Header = () => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async () => {
    const token = auth?.token;
    const payload = {
      token: token,
    };
    dispatch(
      updatedAuctionRoom({
        connected: false,
      })
    );
    try {
      const res = await handleAPI("/api/auth/logout", payload, "post", token);
      if (res.code === 1000) {
        message.success("Đăng xuất thành công!");
        dispatch(removeAuth());
        navigate("/sign-in");
      } else {
        message.error("Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("error: ", error);
      message.error(error.message);
      dispatch(removeAuth());
      navigate("/sign-in");
    }
  };

  return (
    <div>
      <div className={`${styles.headerClient} container-fluid bg-dark px-0`}>
        <div className="row gx-0">
          <div className="col-lg-3 bg-dark d-none d-lg-block">
            <Link
              className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center"
              to={"/"}
            >
              <img
                className={styles.logoProject}
                src={appInfo?.logo_project2}
                alt="no logo"
              />
              {/*<h6 className={`m-0 text-primary text-uppercase ${styles.titleProject}`}>*/}
              {/*    {appInfo.title}*/}
              {/*</h6>*/}
            </Link>
          </div>
          <div className="col-lg-9">
            <div className="row gx-0 bg-white d-none d-lg-flex">
              <div className="col-lg-7 px-5 text-start">
                <div className="h-100 d-inline-flex align-items-center py-2 me-4">
                  <i className="fa fa-envelope text-primary me-2" />
                  <p className="mb-0">{appInfo.email}</p>
                </div>
                <div className="h-100 d-inline-flex align-items-center py-2">
                  <i className="fa fa-phone text-primary me-2" />
                  <p className="mb-0">{appInfo.phoneNumber}</p>
                </div>
              </div>
              <div className="col-lg-5 px-5 text-end">
                <div className="d-inline-flex align-items-center py-2">
                  <a className="me-3" href="">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a className="me-3" href="">
                    <i className="fab fa-twitter" />
                  </a>
                  <a className="me-3" href="">
                    <i className="fab fa-linkedin-in" />
                  </a>
                  <a className="me-3" href="">
                    <i className="fab fa-instagram" />
                  </a>
                  <a className="" href="">
                    <i className="fab fa-youtube" />
                  </a>
                </div>
              </div>
            </div>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
              <a href="index.html" className="navbar-brand d-block d-lg-none">
                <b className="m-0 text-primary text-uppercase">
                  {appInfo.title}
                </b>
              </a>
              <button
                type="button"
                className="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse justify-content-between"
                id="navbarCollapse"
              >
                <div className="navbar-nav mr-auto py-0">
                  {linkElements?.navItemNavLinks.map((item, index) => (
                    <div key={index}>{item?.link}</div>
                  ))}
                  <div className="nav-item dropdown">
                    <Link
                      to="#"
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      KHÁC
                    </Link>
                    <div className="dropdown-menu rounded-0 m-0">
                      {linkElements?.dropdownItems.map((item, index) => (
                        <div key={index}>{item?.link}</div>
                      ))}
                    </div>
                  </div>
                  {linkElements?.signInSignUpClientLinks.map((item, index) => (
                    <div key={index}>{item?.link}</div>
                  ))}
                </div>
                {!auth?.token && Object.keys(auth.info).length === 0 ? (
                  <div>
                    <Link
                      href="https://htmlcodex.com/hotel-html-template-pro"
                      className="btn btn-primary rounded-0 py-4 px-md-5 d-none d-lg-block"
                      to={"/"}
                    >
                      {appInfo.title}
                      <i className="fa fa-arrow-right ms-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="nav-item dropdown">
                    <Link
                      to="#"
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fa fa-user-secret ms-3" />
                      {" " + auth?.info?.user_name}
                    </Link>
                    <div className="dropdown-menu rounded-0 m-0">
                      <Link to={"/user/info"} className="dropdown-item">
                        THÔNG TIN CÁ NHÂN
                      </Link>
                      <Link onClick={logout} className="dropdown-item" to={"#"}>
                        ĐĂNG XUẤT
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
