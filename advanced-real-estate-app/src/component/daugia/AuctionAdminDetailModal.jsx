/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import handleAPI from "../../apis/handlAPI";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { buildingSelector } from "../../redux/reducers/buildingReducer";
import { appVariables } from "../../constants/appVariables";
import {
  removeBidMessages,
  removeUsers,
} from "../../redux/reducers/auctionReducer";

const AuctionAdminDetailModal = ({ object, refresh }) => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const [item, setItem] = useState(null);
  const buildingReducer = useSelector(buildingSelector);
  const [auctionBuildings, setAuctionBuildings] = useState([]);

  useEffect(() => {
    setItem({
      ...object,
    });
  }, [object]);

  useEffect(() => {
    const filteredData = buildingReducer?.buildings?.filter((building) => {
      return ["Nhà đấu giá"].includes(building?.typeBuilding?.type_name);
    });
    setAuctionBuildings(filteredData);
  }, [buildingReducer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const updateById = async () => {
    try {
      const { building, map, userCreatedBy, ...payload } = item;
      const data = {
        ...payload,
        building_id: item?.building_id || building?.id,
        userCreatedBy: auth?.info?.id,
      };
      const res = await handleAPI(
        `/api/admin/auctions/${object?.id}`,
        data,
        "PATCH",
        auth?.token
      );
      message.success("Update successfully");
      dispatch(removeBidMessages());
      dispatch(removeUsers());
      await refresh();
      return res;
    } catch (e) {
      message.error(e.message);
      console.log("Update error: ", e);
    }
  };

  const handleClone = () => {
    const { building, map, userCreatedBy, ...payload } = item;
    const data = {
      ...payload,
      building_id: building?.id,
      userCreatedBy: auth?.info?.id,
    };
    console.log("data clone ", data);
    handleAPI("/api/admin/auctions", data, "POST", auth?.token)
      .then(async (res) => {
        message.success("successfully!");
        await refresh();
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  return (
    <div>
      <div
        className="modal fade"
        id="AuctionAdminDetailModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
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
                  <input
                    className="form-control"
                    type="text"
                    name={"name"}
                    value={item?.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                  <label className="mb-2">Ngày bắt đầu</label>
                  <input
                    className="form-control"
                    type="text"
                    name={"start_date"}
                    value={item?.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                  <label className="mb-2">Thời gian bắt đầu</label>
                  <input
                    className="form-control"
                    type="time"
                    name={"start_time"}
                    value={item?.start_time}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6">
                  <label className="mb-2">Thời gian kết thúc</label>
                  <input
                    className="form-control"
                    type="time"
                    name={"end_time"}
                    value={item?.end_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <label className="mb-2">Trang thái phiên</label>
                  <select
                    className="form-control"
                    onChange={handleChange}
                    name={"active"}
                  >
                    <option value={item?.active}>
                      {!item?.active ? "Đang bị khóa" : "Đang mở"}
                    </option>
                    <option value={false}>{"Khóa phiên đấu giá"}</option>
                    <option value={true}>{"Mở phiên đấu giá"}</option>
                  </select>
                </div>
                <div className="col">
                  <label className="mb-2">Nhà đấu giá</label>
                  <select
                    className="form-control"
                    onChange={handleChange}
                    name={"building_id"}
                  >
                    <option value={item?.building?.id}>Chọn nhà đấu giá</option>
                    {auctionBuildings.map((building, index) => (
                      <option key={index} value={building?.id}>
                        {building?.name} - {building?.typeBuilding?.type_name} -{" "}
                        {building?.status === 1 ? "Đang mở" : "Đang đóng"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <label className="mb-2">Người tạo</label>
                  <select
                    className="form-control"
                    onChange={handleChange}
                    name={"userCreatedBy"}
                  >
                    <option value={auth?.info?.id}>
                      {`${item?.userCreatedBy?.email} - ${item?.userCreatedBy?.role?.role_name}`}
                    </option>
                  </select>
                </div>
              </div>
              <div className={"col-lg-12"}>
                <div className="col">
                  <label className="mb-2">Mô tả</label>
                  <textarea
                    className="form-control"
                    type="text"
                    name={"description"}
                    value={item?.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-warning"
                data-bs-dismiss="modal"
                onClick={updateById}
              >
                Cập nhật
              </button>
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={handleClone}
              >
                Nhân đôi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionAdminDetailModal;
