import React from "react";
import { appInfo } from "../../constants/appInfos";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div
        className="container newsletter mt-5 wow fadeIn"
        data-wow-delay="0.1s"
        style={{
          visibility: "visible",
          animationDelay: "0.1s",
          animationName: "fadeIn",
        }}
      >
        <div className="row justify-content-center">
          <div className="col-lg-10 border rounded p-1">
            <div className="border rounded text-center p-1">
              <div className="bg-white rounded text-center p-5">
                <h4 className="mb-4">
                  {t("home.labels.contactOur")}
                  <span className="text-primary text-uppercase">
                    {t("home.labels.detail")}
                  </span>
                </h4>
                <div
                  className="position-relative mx-auto"
                  style={{ maxWidth: 400 }}
                >
                  <div className="col-md-12">
                    <div className="form-floating">
                      <input
                        className="form-control w-100 py-3 ps-4 pe-5"
                        type="text"
                        placeholder="NHẬP EMAIL CỦA BẠN"
                        name={"email"}
                      />
                      <label htmlFor="email">
                        {t("home.labels.yourEmail")}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-12 pt-2">
                    <div className="form-floating">
                      <textarea
                        className="form-control w-100 py-3 ps-4 pe-5"
                        type="text"
                        placeholder="NHẬP NỘI DUNG"
                        name={"content"}
                      />
                      <label htmlFor="content">
                        {t("home.labels.content")}
                      </label>
                    </div>
                  </div>
                  <div className="col-12 pt-3">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                    >
                      {t("home.buttons.send")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container-fluid bg-dark text-light footer wow fadeIn"
        data-wow-delay="0.1s"
        style={{
          visibility: "visible",
          animationDelay: "0.1s",
          animationName: "fadeIn",
        }}
      >
        <div className="container pb-5">
          <div className="row g-5">
            <div className="col-md-6 col-lg-4">
              <div className="bg-primary rounded p-4">
                <a href="index.html">
                  <h1 className="text-white text-uppercase mb-3">
                    {t("home.title")}
                  </h1>
                </a>
                <p className="text-white mb-0">{t("home.description")}</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <h6 className="section-title text-start text-primary text-uppercase mb-4">
                {t("home.footers.labels.contact")}
              </h6>
              <p className="mb-2">
                <i className="fa fa-map-marker-alt me-3" />
                {t("home.address")}
              </p>
              <p className="mb-2">
                <i className="fa fa-phone-alt me-3" />
                {t("home.phoneNumber")}
              </p>
              <p className="mb-2">
                <i className="fa fa-envelope me-3" />
                {t("home.email")}
              </p>
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-outline-light btn-social" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-outline-light btn-social" href="">
                  <i className="fab fa-youtube" />
                </a>
                <a className="btn btn-outline-light btn-social" href="">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <div className="row gy-5 g-4">
                <div className="col-md-6">
                  <h6 className="section-title text-start text-primary text-uppercase mb-4">
                    {t("home.footers.labels.company")}
                  </h6>
                  <Link className="btn btn-link" to="/contact">
                    {t("home.footers.links.company.us")}
                  </Link>
                  <Link className="btn btn-link" to="/contact">
                    {t("home.footers.links.company.contact")}
                  </Link>
                  <Link className="btn btn-link" to="/policy">
                    {t("home.footers.links.company.policy")}
                  </Link>
                </div>
                <div className="col-md-6">
                  <h6 className="section-title text-start text-primary text-uppercase mb-4">
                    {t("home.footers.labels.service")}
                  </h6>
                  <Link className="btn btn-link" to={"/dau-gia"}>
                    {t("home.footers.links.service.auction")}
                  </Link>
                  <Link className="btn btn-link" to={"/buildings"}>
                    {t("home.footers.links.service.buy")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                {t("home.char")}
                <a className="border-bottom" href="#">
                  {t("home.siteName")}
                </a>
                {t("home.footers.labels.description")}
                {/*/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. *** /*/}
                {t("home.footers.labels.by")}
                <a className="border-bottom" href="https://htmlcodex.com">
                  {t("home.html")}
                </a>
                <br />
                {t("home.footers.labels.by")}
                <a
                  className="border-bottom"
                  href="https://themewagon.com"
                  target="_blank"
                >
                  {t("home.team")}
                </a>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-menu">
                  <Link to="/">{t("home.footers.links.home")}</Link>
                  <Link to="/">{t("home.footers.links.cookies")}</Link>
                  <Link to="/">{t("home.footers.links.help")}</Link>
                  <Link to="/">{t("home.footers.links.faq")}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
