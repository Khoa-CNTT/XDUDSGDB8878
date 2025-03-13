import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import {buildingSelector} from "../../redux/reducers/buildingReducer";
import handleAPI from "../../apis/handlAPI";
import {message} from "antd";

const MapCreateModal = ({refresh}) => {

    const auth = useSelector(authSelector);
    const buildingReducer = useSelector(buildingSelector);
    const [item, setItem] = useState(null);

    useEffect(() => {
        setItem({
            map_name: "",
            latitude: '',
            longitude: '',
            address: '',
        });
    }, [auth]);

    useEffect(() => {
        console.log("item: ", item);
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleCreate = () => {

        console.log('item create: ', item);
        handleAPI(`/api/admin/maps`, item, 'POST', auth?.token).then(
            async res=>{
                message.success('Successfully');
                await refresh();
            }
        ).catch(
            error=>{
                console.log('Error', error);
                message.error(error.message);
            }
        );
    }

    return (
        <div>
            <div
                className="modal fade"
                id="MapCreateModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="exampleModalLabel"
                            >
                                Thông tin chi tiết
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                                    <label className="mb-2">Tên bản đồ</label>
                                    <input className="form-control" type="text"
                                           name={'map_name'}
                                           value={item?.map_name}
                                           onChange={handleChange}
                                    />
                                </div>
                                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                                    <label className="mb-2">Vĩ độ</label>
                                    <input className="form-control" type="text"
                                           name={'latitude'}
                                           value={item?.latitude}
                                           onChange={handleChange}
                                    />
                                </div>
                                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                                    <label className="mb-2">Kinh độ</label>
                                    <input className="form-control" type="text"
                                           name={'longitude'}
                                           value={item?.longitude}
                                           onChange={handleChange}
                                    />
                                </div>
                                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                                    <label className="mb-2">Địa chỉ cụ thể</label>
                                    <input className="form-control" type="text"
                                           name={'address'}
                                           value={item?.address}
                                           onChange={handleChange}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Đóng
                            </button>
                            <button type="button" className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    onClick={handleCreate}
                            >
                                Tạo
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapCreateModal;