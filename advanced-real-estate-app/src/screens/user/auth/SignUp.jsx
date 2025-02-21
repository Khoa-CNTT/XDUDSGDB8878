import React, { useState } from 'react';
import {appInfo} from "../../../constants/appInfos";
import Toast from "../../../config/ToastConfig";
import handleAPI from '../../../apis/handlAPI';

const SignUp = () => {
    const [ registerUser, setRgisterUser] = useState({});
    const handlRegisterUser = async () => {
        const url = `/api/customers/register`;
        try {
            const res = await handleAPI(url,registerUser , "post");
            if(res.status === 200) {
                Toast("success", res.message);
                setRgisterUser({
                    firstName: "string",
                    lastName: "string",
                    userName: "string",
                    email: "string",
                    phoneNumber: "string",
                    password: "string"
                })
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }
    return (
        <div style={
            {
                paddingTop: "150px"
            }
        }>
            <div className="container-xxl py-5">
                <div className="container">
                    <div
                        className="text-center wow fadeInUp"
                        data-wow-delay="0.1s"
                        style={{
                            visibility: "visible",
                            animationDelay: "0.1s",
                            animationName: "fadeInUp"
                        }}
                    >
                        <h6 className="section-title text-center text-primary text-uppercase">
                            {appInfo.title}
                        </h6>
                        <h1 className="mb-5">
                            ĐĂNG KÝ <span className="text-primary text-uppercase">TÀI KHOẢN</span>
                        </h1>
                    </div>
                    <div className="row g-5">
                        <div className="col-lg-6">
                            <div className="row g-3">
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

                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div
                                className="wow fadeInUp"
                                data-wow-delay="0.2s"
                                style={{
                                    visibility: "visible",
                                    animationDelay: "0.2s",
                                    animationName: "fadeInUp"
                                }}
                            >
                                <div className="row g-3">
                                    <div className="col-md-6">
                                    <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={registerUser.firstName}
                                                onChange={(e) => setRgisterUser({...registerUser, firstName : e.target.value})}
                                                placeholder="First Name"
                                            />
                                            <label htmlFor="name">Họ</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                    <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={registerUser.lastName}
                                                onChange={(e) => setRgisterUser({...registerUser, lastName : e.target.value})}
                                                placeholder="Last Name"
                                            />
                                            <label htmlFor="name">Tên</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={registerUser.userName}
                                                onChange={(e) => setRgisterUser({...registerUser, userName : e.target.value})}
                                                placeholder="User Name"
                                            />
                                            <label htmlFor="text">Tên người dùng</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={registerUser.phoneNumber}
                                                onChange={(e) => setRgisterUser({...registerUser, phoneNumber : e.target.value})}
                                                placeholder="Nhập Số Điện Thoại"
                                            />
                                            <label htmlFor="text">Số Điện Thoại</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={registerUser.email}
                                                onChange={(e) => setRgisterUser({...registerUser, email : e.target.value})}
                                                placeholder="Your Email"
                                            />
                                            <label htmlFor="email">EMAIL</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={registerUser.password}
                                                onChange={(e) => setRgisterUser({...registerUser, password : e.target.value})}
                                                placeholder="Your password"
                                            />
                                            <label htmlFor="password">Mật khẩu</label>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" onClick={() => handlRegisterUser()} type="submit">
                                            ĐĂNG KÝ NGAY
                                        </button>
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

export default SignUp;