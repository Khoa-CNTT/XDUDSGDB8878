import { Link } from "react-router-dom";
import React from "react";

export const linkElements = {
  dropdownItems: [
    {
      link: (
        <Link to={"/contact"} className="dropdown-item">
          LIÊN HỆ
        </Link>
      ),
    },
  ],
  listDropdownMenu: [
    {
      link: (
        <Link to={"/user/info"} className="dropdown-item">
          THÔNG TIN CÁ NHÂN
        </Link>
      ),
    },
    {
      link: (
        <Link to={"/user/management"} className="dropdown-item">
          QUẢN LÝ
        </Link>
      ),
    },
  ],
  signInSignUpClientLinks: [
    {
      link: (
        <Link to={"/sign-in"} className="nav-item nav-link">
          ĐĂNG NHẬP
        </Link>
      ),
    },
    {
      link: (
        <Link to={"/sign-up"} className="nav-item nav-link">
          ĐĂNG KÝ
        </Link>
      ),
    },
  ],
  navItemNavLinks: [
    {
      link: (
        <Link to={"/"} className="nav-item nav-link active">
          TRANG CHỦ
        </Link>
      ),
    },
    {
      link: (
        <Link to={"/buildings"} className="nav-item nav-link">
          BẤT ĐỘNG SẢN
        </Link>
      ),
    },
    {
      link: (
        <Link to={"/user/management"} className="nav-item nav-link">
          QUẢN LÝ
        </Link>
      ),
    },
    {
      link: (
        <Link to={"/dau-gia"} className="nav-item nav-link">
          ĐẤU GIÁ
        </Link>
      ),
    },
  ],
};
