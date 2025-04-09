import { Link } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";

export const getLinkElements = (t) => ({
  dropdownItems: [
    {
      link: (
        <Link to="/contact" className="dropdown-item">
          {t("home.headers.links.contact")}
        </Link>
      ),
    },
  ],
  listDropdownMenu: [
    {
      link: (
        <Link to="/user/info" className="dropdown-item">
          {t("home.headers.links.info")}
        </Link>
      ),
    },
    {
      link: (
        <Link to="/user/management" className="dropdown-item">
          {t("home.headers.links.management")}
        </Link>
      ),
    },
  ],
  signInSignUpClientLinks: [
    {
      link: (
        <Link to="/sign-in" className="nav-item nav-link">
          {t("home.headers.links.login")}
        </Link>
      ),
    },
    {
      link: (
        <Link to="/sign-up" className="nav-item nav-link">
          {t("home.headers.links.login")}
        </Link>
      ),
    },
  ],
  navItemNavLinks: [
    {
      link: (
        <Link to="/" className="nav-item nav-link active">
          {t("home.headers.links.menu")}
        </Link>
      ),
    },
    {
      link: (
        <Link to="/buildings" className="nav-item nav-link">
          {t("home.headers.links.building")}
        </Link>
      ),
    },
    {
      link: (
        <Link to="/user/management" className="nav-item nav-link">
          {t("home.headers.links.management")}
        </Link>
      ),
    },
    {
      link: (
        <Link to="/dau-gia" className="nav-item nav-link">
          {t("home.headers.links.auction")}
        </Link>
      ),
    },
  ],
});
