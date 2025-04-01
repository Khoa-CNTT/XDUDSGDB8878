import React from 'react';
import {appInfo} from "../../constants/appInfos";
import {useSelector} from "react-redux";
import {buildingSelector} from "../../redux/reducers/buildingReducer";

const Welcome = () => {

    const buildingReducer = useSelector(buildingSelector);

    return (
        <div>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <h6 className="section-title text-start text-primary text-uppercase">
                                About Us
                            </h6>
                            <h1 className="mb-4">
                                Welcome to{" "}
                                <span className="text-primary text-uppercase">{appInfo.title}</span>
                            </h1>
                            <p className="mb-4">
                                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu
                                diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet
                                lorem sit clita duo justo magna dolore erat amet
                            </p>
                            <div className="row g-3 pb-4">
                                <div
                                    className="col-sm-4 wow fadeIn"
                                    data-wow-delay="0.1s"
                                    style={{
                                        visibility: "visible",
                                        animationDelay: "0.1s",
                                        animationName: "fadeIn"
                                    }}
                                >
                                    <div className="border rounded p-1">
                                        <div className="border rounded text-center p-4">
                                            <i className="fa fa-home fa-2x text-primary mb-2"/>
                                            <h2 className="mb-1" data-toggle="counter-up">
                                                {buildingReducer?.buildings?.length}
                                            </h2>
                                            <p className="mb-0">Nhà</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-sm-4 wow fadeIn"
                                    data-wow-delay="0.3s"
                                    style={{
                                        visibility: "visible",
                                        animationDelay: "0.3s",
                                        animationName: "fadeIn"
                                    }}
                                >
                                    <div className="border rounded p-1">
                                        <div className="border rounded text-center p-4">
                                            <i className="fa fa-users fa-2x text-primary mb-2"/>
                                            <h2 className="mb-1" data-toggle="counter-up">
                                                1234
                                            </h2>
                                            <p className="mb-0">Nhân viên</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-sm-4 wow fadeIn"
                                    data-wow-delay="0.5s"
                                    style={{
                                        visibility: "visible",
                                        animationDelay: "0.5s",
                                        animationName: "fadeIn"
                                    }}
                                >
                                    <div className="border rounded p-1">
                                        <div className="border rounded text-center p-4">
                                            <i className="fa fa-users fa-2x text-primary mb-2"/>
                                            <h2 className="mb-1" data-toggle="counter-up">
                                                1234
                                            </h2>
                                            <p className="mb-0">Khách hàng</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a className="btn btn-primary py-3 px-5 mt-2" href="">
                                Explore More
                            </a>
                        </div>
                        <div className="col-lg-6">
                            <div className="row g-3">
                                <div className="col-6 text-end">
                                    <img
                                        className="img-fluid rounded w-75 wow zoomIn"
                                        data-wow-delay="0.1s"
                                        src="img/about-1.jpg"
                                        style={{
                                            marginTop: "25%",
                                            visibility: "visible",
                                            animationDelay: "0.1s",
                                            animationName: "zoomIn"
                                        }}
                                    />
                                </div>
                                <div className="col-6 text-start">
                                    <img
                                        className="img-fluid rounded w-100 wow zoomIn"
                                        data-wow-delay="0.3s"
                                        src="img/about-2.jpg"
                                        style={{
                                            visibility: "visible",
                                            animationDelay: "0.3s",
                                            animationName: "zoomIn"
                                        }}
                                    />
                                </div>
                                <div className="col-6 text-end">
                                    <img
                                        className="img-fluid rounded w-50 wow zoomIn"
                                        data-wow-delay="0.5s"
                                        src="img/about-3.jpg"
                                        style={{
                                            visibility: "visible",
                                            animationDelay: "0.5s",
                                            animationName: "zoomIn"
                                        }}
                                    />
                                </div>
                                <div className="col-6 text-start">
                                    <img
                                        className="img-fluid rounded w-75 wow zoomIn"
                                        data-wow-delay="0.7s"
                                        src="img/about-4.jpg"
                                        style={{
                                            visibility: "visible",
                                            animationDelay: "0.7s",
                                            animationName: "zoomIn"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;