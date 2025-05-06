import React, { useState } from "react";
import { appInfo } from "../../../constants/appInfos";
import Toast from "../../../config/ToastConfig";
import handleAPI from "../../../apis/handlAPI";
import { useDispatch } from "react-redux";
import { addAuth } from "../../../redux/reducers/authReducer"; // Import addAuth action
import { useNavigate } from "react-router-dom";
import { appVariables } from "../../../constants/appVariables";
import { message } from "antd";

const SignIn = () => {
  const [customer, setCustomer] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Sử dụng useDispatch để tạo dispatch
  const [isLoading, setIsLoading] = useState(false);
  const listRoleRequireForManagerPage =
    appVariables.listRoleRequireForManagerPage;

  const hanldeLogin = async () => {
    const api = `api/auth/token`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api, customer, "post");
      console.log(res);

      if (res.code === 1000) {
        message.success("Đăng nhập thành công!");
        // Lưu thông tin xác thực vào localStorage
        const authData = {
          info: res?.result?.infoUser,
          roleUser: res?.result?.roleUser,
          token: res?.result?.login?.token,
          roles: res?.result?.infoUser?.roles,
          permission: res?.result?.infoUser?.permission,
        };
        // Dispatch action để lưu vào Redux store
        dispatch(addAuth(authData));
        // Điều hướng về trang /admin ngay lập tức
        const managementPermission =
          listRoleRequireForManagerPage[0] === authData?.roleUser?.role_type;
        if (managementPermission) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          window.location.href = "/admin/building";
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          navigate("/user/management");
        }
      }
      if (res.code === 404) {
        message.error(res.message);
      }
    } catch (error) {
      navigate("/admin/login");
      console.log(error);
      message.error("Đã có lỗi xảy ra đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        paddingTop: "150px",
      }}
    >
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
                  animationName: "fadeInUp",
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
                          value={customer.email || ""}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              email: e.target.value,
                            })
                          }
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
                          value={customer.password || ""}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              password: e.target.value,
                            })
                          }
                        />
                        <label htmlFor="password">Mật khẩu</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100 py-3"
                        onClick={hanldeLogin}
                      >
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
