/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addAuth, authSelector} from "../../redux/reducers/authReducer";
import handleAPI from "../../apis/handlAPI";
import {message} from "antd";
import {useNavigate} from "react-router-dom";

const InfoModal = ({user, setUser, getUserInfo}) => {
    const auth = useSelector(authSelector);
    const [info, setInfo] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setInfo({
            ...user
        });
    }, [user]);

    useEffect(() => {
        console.log(info);
    }, [info]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const updateUser = async () =>{
        try{
            const res = await handleAPI(`/api/users/${user?.id}`, info, "PATCH", auth?.token);
            message.success("Update successfully");
            setUser(res?.result);
            return res;
        }catch (e) {
            message.error(e.message);
            console.log("Update error: ", e);
        }
    }

    return (
        <div>
            <div className="modal fade" id="RemoveModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <i className="fa fa-edit text-primary" id="exampleModalLabel"></i>
                            <b style={{ paddingLeft: 5 }}>Chỉnh sửa thông tin cá nhân của bạn {" "}</b>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        name="first_name"
                                        placeholder="Your firstName"
                                        value={info?.first_name}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="first_name">Họ</label>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        name="last_name"
                                        placeholder="Your lastName"
                                        value={info?.last_name}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="last_name">Tên</label>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <select name="gender"
                                        className="form-select"
                                        onChange={handleChange}
                                    >
                                        <option value={info?.gender}>Chọn giới tính</option>
                                        <option value="nam">Nam</option>
                                        <option value="nữ">Nữ</option>
                                    </select>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone_number"
                                        placeholder="Your phoneNumber"
                                        value={info?.phone_number}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="phoneNumber">Số điện thoại</label>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        placeholder="Your address"
                                        value={info?.address}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="address">Địa chỉ</label>
                                </div>
                                <br />
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="birthday"
                                        name="birthday"
                                        placeholder="Your birthday"
                                        value={info?.birthday}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="birthday">Ngày sinh</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={updateUser} type="button" className="w-100 btn btn-primary" data-bs-dismiss="modal">
                                LƯU
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default InfoModal;