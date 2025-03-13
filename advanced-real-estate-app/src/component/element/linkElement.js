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
    {
      link: (
        <Link to={"/room-chat"} className="dropdown-item">
          PHÒNG NHẮN TIN
        </Link>
      ),
    },
    {
      link: (
        <Link to={"/user/hop-dong"} className="dropdown-item">
          HỢP ĐỒNG
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
          VỀ TÒA NHÀ
        </Link>
      ),
    },
    {
      link: (
        <Link to={"/user/auction-manager"} className="nav-item nav-link">
          QUẢN LÝ ĐẤU GIÁ
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
