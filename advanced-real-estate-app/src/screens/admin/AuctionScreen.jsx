/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import MapAdminComponent from "../../component/map/MapAdminComponent";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import handleAPI from "../../apis/handlAPI";
import { appVariables } from "../../constants/appVariables";
import { collectionUtil, f_collectionUtil } from "../../utils/f_collectionUtil";
import AuctionAdminDetailModal from "../../component/daugia/AuctionAdminDetailModal";
import AuctionCreateModal from "../../component/daugia/AuctionCreateModal";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { buttonStyleElements, } from "../../component/element/buttonStyleElement";
import { HiMiniInformationCircle } from "react-icons/hi2";

const AuctionScreen = () => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [auction, setAuction] = useState(null);
  const [editing, setEditing] = useState(null);
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    refresh().then();
  }, [auth?.token]);

  useEffect(() => {
    console.log(auctions);
  }, [auctions]);

  useEffect(() => {
    handleAPI("/api/admin/buildings", {}, "get", auth?.token)
      .then((res) => {
        setBuildings(res?.data);
      })
      .catch((error) => {
        message.error("Fetch error: ", error);
        console.log("Fetch error: ", error);
      });
  }, [auth?.token]);

  const refresh = async () => {
    return await handleAPI("/api/admin/auctions", {}, "get", auth?.token)
      .then((res) => {
        setAuctions(res?.data);
      })
      .catch((error) => {
        message.error("Fetch error: ", error);
        console.log("Fetch error: ", error);
      });
  };

  const deleteById = async (id) => {
    await handleAPI(`/api/admin/auctions/${id}`, {}, "delete", auth?.token)
      .then((res) => message.success("Delete successfully!"))
      .catch((error) => {
        message.error("Delete error: ", error);
        console.log("Delete error: ", error);
      });
    await refresh();
  };

  return (
    <div>
      <AuctionCreateModal refresh={refresh} />
      <AuctionAdminDetailModal object={auction} refresh={refresh} />
      <div className="card">
        <div className="d-flex align-items-center justify-content-between">
          <div className="p-2 bd-highlight">
            <span>Danh Sách phiên đấu giá</span>
          </div>
          <div className="p-2 bd-highlight">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#AuctionCreateModal"
            >
              Thêm Mới
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="align-middle text-center">Ảnh nhà</th>
                  <th className="align-middle text-center">
                    Tên phiên đấu giá
                  </th>
                  <th className="align-middle text-center">
                    Trạng thái hoạt động
                  </th>
                  <th className="align-middle text-center">Trạng thái phiên</th>
                  <th className="align-middle text-center">Nhà đấu giá</th>
                  <th className="align-middle text-center">Người tạo</th>
                  <th className="align-middle text-center">Ngày bắt đầu</th>
                  <th colSpan={"3"}>Action</th>
                </tr>
              </thead>
              <tbody>
                {auctions?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={item?.buildingImages[0]}
                        alt={item?.building?.name}
                        width={"100px"}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      {appVariables.checkStatus(
                        item?.start_date,
                        item?.start_time,
                        item?.end_time
                      ) === appVariables.BEFORE ? (
                        <span className={"text-warning"}>Chưa bắt đầu</span>
                      ) : appVariables.checkStatus(
                          item?.start_date,
                          item?.start_time,
                          item?.end_time
                        ) === appVariables.NOW ? (
                        <span className={"text-success"}>Đang bắt đầu</span>
                      ) : (
                        <span className={"text-danger"}>Đã kết thúc</span>
                      )}
                    </td>
                    <td>
                      {editing?.id === item.id ? (
                        <select
                          name="active"
                          onChange={(e) => {
                            setEditing({
                              ...editing,
                              active: e.target.value,
                            });
                          }}
                        >
                          <option value={item?.active}>
                            {!item?.active ? "Đang bị khóa" : "Đang mở"}
                          </option>
                          <option value={false}>{"Khóa phiên đấu giá"}</option>
                          <option value={true}>{"Mở phiên đấu giá"}</option>
                        </select>
                      ) : (
                        <span>
                          {!item?.active ? (
                            <span className={"text-danger"}>Đang bị khóa</span>
                          ) : (
                            <span className={"text-success"}>Đang mở</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td>
                      {editing?.id === item.id ? (
                        <select
                          name="building_id"
                          onChange={(e) => {
                            setEditing({
                              ...editing,
                              building_id: e.target.value,
                            });
                          }}
                        >
                          <option value={item?.building?.id}>
                            {item?.building?.name}
                          </option>
                          {buildings.map((building, index) => (
                            <option key={index} value={building?.id}>
                              {building?.name} - {building?.type} -{" "}
                              {building?.status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          {item?.building?.name} -{" "}
                          {item?.typeBuilding?.type_name}
                        </>
                      )}
                    </td>
                    <td>
                      <>{`${item?.userCreatedBy?.email} - ${item?.userCreatedBy?.role?.role_name}`}</>
                    </td>
                    <td>{item.start_date}</td>
                    <td>
                      <Button
                          style={buttonStyleElements?.detailButtonStyle}
                          onClick={() => {
                          f_collectionUtil.handleCollectionItem(
                            `/api/admin/auctions/${item?.id}`,
                            setAuction,
                            auth
                          );
                          window.$("#AuctionAdminDetailModal").modal("show");
                        }}
                      >
                        <HiMiniInformationCircle/>
                      </Button>
                    </td>
                    <td>
                      <Button
                          style={buttonStyleElements?.deleteButtonStyle}
                          onClick={() => {
                          deleteById(item?.id).then();
                        }}
                      >
                        <HiArchiveBoxXMark/>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionScreen;
