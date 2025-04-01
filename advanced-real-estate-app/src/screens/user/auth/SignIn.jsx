import React, { useState } from 'react';
import {appInfo} from "../../../constants/appInfos";
import Toast from "../../../config/ToastConfig";
import handleAPI from '../../../apis/handlAPI';
import { useDispatch } from "react-redux";
import { addAuth } from "../../../redux/reducers/authReducer"; // Import addAuth action
import { useNavigate } from 'react-router-dom';
const SignIn = () => {
    const [customer, setCustomer] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Sử dụng useDispatch để tạo dispatch

    const hanlderLogin = async () => {
        const url = `/api/customers/login`;
        try {
            const res = await handleAPI(url,customer , "post");
            console.log(res.token);
            
            if(res.status === 200) {
                Toast("success", res.message);
                // Lưu thông tin xác thực vào localStorage
                const authData = {
                    token: res?.token,
                    roles: "CUSTOMER",
                    info: "",
                    permission : []
                };
                // Dispatch action để lưu vào Redux store
                dispatch(addAuth(authData));
                // Điều hướng về trang /admin ngay lập tức
                navigate("/");
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
                            ĐĂNG <span className="text-primary text-uppercase">NHẬP</span>
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
                                    animationName: "fadeInUp"
                                }}
                            >
                                <div>
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Your Email"
                                                    value={customer.email || ''}
                                                    onChange={(e) => setCustomer({
                                                        ...customer,
                                                        email: e.target.value
                                                    })}
                                                />
                                                <label htmlFor="email">Email</label>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-floating">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Your password"
                                                    value={customer.password || ''}
                                                    onChange={(e) => setCustomer({
                                                        ...customer,
                                                        password: e.target.value
                                                    })}
                                                />
                                                <label htmlFor="password">Mật khẩu</label>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <button className="btn btn-primary w-100 py-3" onClick={() => hanlderLogin()}>
                                                ĐĂNG NHẬP
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

export default SignIn;