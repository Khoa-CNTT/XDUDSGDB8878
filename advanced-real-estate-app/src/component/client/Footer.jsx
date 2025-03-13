import React from 'react';
import {appInfo} from "../../constants/appInfos";

const Footer = () => {

    return (
        <div>
            <div
                className="container newsletter mt-5 wow fadeIn"
                data-wow-delay="0.1s"
                style={{
                    visibility: "visible",
                    animationDelay: "0.1s",
                    animationName: "fadeIn"
                }}
            >
                <div className="row justify-content-center">
                    <div className="col-lg-10 border rounded p-1">
                        <div className="border rounded text-center p-1">
                            <div className="bg-white rounded text-center p-5">
                                <h4 className="mb-4">
                                    {"LIÊN HỆ VỚI CHÚNG TÔI "}
                                    <span className="text-primary text-uppercase">ĐỂ BIẾT THÊM CHI TIẾT</span>
                                </h4>
                                <div className="position-relative mx-auto" style={{maxWidth: 400}}>
                                    <div className="col-md-12">
                                        <div className="form-floating">
                                            <input
                                                className="form-control w-100 py-3 ps-4 pe-5"
                                                type="text"
                                                placeholder="NHẬP EMAIL CỦA BẠN"
                                                name={'email'}
                                            />
                                            <label htmlFor="email">EMAIL CỦA BẠN</label>
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
                                            <label htmlFor="content">NỘI DUNG GỬI</label>
                                        </div>
                                    </div>
                                    <div className="col-12 pt-3">
                                        <button className="btn btn-primary w-100 py-3" type="submit">
                                           GỬI
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
                    animationName: "fadeIn"
                }}
            >
                <div className="container pb-5">
                    <div className="row g-5">
                        <div className="col-md-6 col-lg-4">
                            <div className="bg-primary rounded p-4">
                                <a href="index.html">
                                    <h1 className="text-white text-uppercase mb-3">{appInfo.title}</h1>
                                </a>
                                <p className="text-white mb-0">
                                    Download{" "}
                                    <a
                                        className="text-dark fw-medium"
                                        href="https://htmlcodex.com/hotel-html-template-pro"
                                    >
                                        Hotelier – Premium Version
                                    </a>
                                    , build a professional website for your hotel business and grab the
                                    attention of new visitors upon your site’s launch.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <h6 className="section-title text-start text-primary text-uppercase mb-4">
                                Contact
                            </h6>
                            <p className="mb-2">
                                <i className="fa fa-map-marker-alt me-3"/>
                                123 Street, New York, USA
                            </p>
                            <p className="mb-2">
                                <i className="fa fa-phone-alt me-3"/>
                                +012 345 67890
                            </p>
                            <p className="mb-2">
                                <i className="fa fa-envelope me-3"/>
                                info@example.com
                            </p>
                            <div className="d-flex pt-2">
                                <a className="btn btn-outline-light btn-social" href="">
                                    <i className="fab fa-twitter"/>
                                </a>
                                <a className="btn btn-outline-light btn-social" href="">
                                    <i className="fab fa-facebook-f"/>
                                </a>
                                <a className="btn btn-outline-light btn-social" href="">
                                    <i className="fab fa-youtube"/>
                                </a>
                                <a className="btn btn-outline-light btn-social" href="">
                                    <i className="fab fa-linkedin-in"/>
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-12">
                            <div className="row gy-5 g-4">
                                <div className="col-md-6">
                                    <h6 className="section-title text-start text-primary text-uppercase mb-4">
                                        Company
                                    </h6>
                                    <a className="btn btn-link" href="">
                                        About Us
                                    </a>
                                    <a className="btn btn-link" href="">
                                        Contact Us
                                    </a>
                                    <a className="btn btn-link" href="">
                                        Privacy Policy
                                    </a>
                                    <a className="btn btn-link" href="">
                                        Terms &amp; Condition
                                    </a>
                                    <a className="btn btn-link" href="">
                                        Support
                                    </a>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="section-title text-start text-primary text-uppercase mb-4">
                                        Services
                                    </h6>
                                    <a className="btn btn-link" href="">
                                        Food &amp; Restaurant
                                    </a>
                                    <a className="btn btn-link" href="">
                                        Spa &amp; Fitness
                                    </a>
                                    <a className="btn btn-link" href="">
                                        Sports &amp; Gaming
                                    </a>
                                    <a className="btn btn-link" href="">
                                        Event &amp; Party
                                    </a>
                                    <a className="btn btn-link" href="">
                                        GYM &amp; Yoga
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="copyright">
                        <div className="row">
                            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                                ©{" "}
                                <a className="border-bottom" href="#">
                                    Your Site Name
                                </a>
                                , All Right Reserved.
                                {/*/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. *** /*/}
                                Designed By{" "}
                                <a className="border-bottom" href="https://htmlcodex.com">
                                    HTML Codex
                                </a>
                                <br/>
                                Distributed By:{" "}
                                <a
                                    className="border-bottom"
                                    href="https://themewagon.com"
                                    target="_blank"
                                >
                                    ThemeWagon
                                </a>
                            </div>
                            <div className="col-md-6 text-center text-md-end">
                                <div className="footer-menu">
                                    <a href="">Home</a>
                                    <a href="">Cookies</a>
                                    <a href="">Help</a>
                                    <a href="">FQAs</a>
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