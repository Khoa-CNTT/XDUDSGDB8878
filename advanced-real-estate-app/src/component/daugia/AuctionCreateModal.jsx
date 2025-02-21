import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import {buildingSelector} from "../../redux/reducers/buildingReducer";
import handleAPI from "../../apis/handlAPI";
import {message} from "antd";

const AuctionCreateModal = ({refresh}) => {

    const auth = useSelector(authSelector);
    const buildingReducer = useSelector(buildingSelector);
    const [item, setItem] = useState(null);

    useEffect(() => {
        setItem({
            name: 'Phiên đấu giá mặc định',
            start_date: '2024-11-14',
            start_time: '00:00',
            end_time: '23:59',
            description: 'Mô tả mặc định',
            active: false,
            building_id: null,//buildingReducer?.buildings[0]?.id
            userCreatedBy: auth?.info?.id
        });
    }, [auth]);

    useEffect(() => {
        console.log("item: ", item);
    }, [item]);

    useEffect(() => {
        console.log('building data: ', buildingReducer);
    }, [buildingReducer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleCreate = () => {
      handleAPI(`/api/admin/auctions`, item, 'POST', auth?.token).then(
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
                id="AuctionCreateModal"
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
                                    <label className="mb-2">Tên phiên đấu giá</label>
                                    <input className="form-control" type="text"
                                           name={'name'}
                                           value={item?.name}
                                           onChange={handleChange}
                                    />
                                </div>
                                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                                    <label className="mb-2">Ngày bắt đầu</label>
                                    <input className="form-control" type="text"
                                           name={'start_date'}
                                           value={item?.start_date}
                                           onChange={handleChange}
                                    />
                                </div>
                                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                                    <label className="mb-2">Thời gian bắt đầu</label>
                                    <input className="form-control" type="time"
                                           name={'start_time'}
                                           value={item?.start_time}
                                           onChange={handleChange}
                                    />
                                </div>
                                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                                    <label className="mb-2">Thời gian kết thúc</label>
                                    <input className="form-control" type="time"
                                           name={'end_time'}
                                           value={item?.end_time}
                                           onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col">
                                    <label className="mb-2">Trang thái phiên</label>
                                    <select className="form-control"
                                            name={'active'}
                                            onChange={handleChange}
                                    >
                                        <option value={false}>
                                            {'Khóa phiên đấu giá'}
                                        </option>
                                        <option value={true}>
                                            {'Mở phiên đấu giá'}
                                        </option>
                                    </select>
                                </div>
                                <div className="col">
                                    <label className="mb-2">Nhà đấu giá</label>
                                    <select className="form-control"
                                            name={'building_id'}
                                            onChange={handleChange}
                                    >
                                        <option value={null}>
                                            Chọn nhà đấu giá
                                        </option>
                                        {buildingReducer?.buildings?.map((building, index) => (
                                            <option key={index} value={building?.id}>
                                                {building?.name} - {building?.typeBuilding?.type_name} - {building?.status === 1 ? 'Đang mở' : 'Đang đóng'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-3">

                                <div className="col">
                                    <label className="mb-2">Người tạo</label>
                                    <select className="form-control"
                                            onChange={handleChange}
                                            name={'userCreatedBy'}
                                    >
                                        <option value={auth?.info?.id}>
                                            {`${auth?.info?.email} - ${auth?.roles}`}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className={'col-lg-12'}>
                                <div className="col">
                                    <label className="mb-2">Mô tả</label>
                                    <textarea className="form-control" type="text"
                                              name={'description'}
                                              value={item?.description}
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

export default AuctionCreateModal;