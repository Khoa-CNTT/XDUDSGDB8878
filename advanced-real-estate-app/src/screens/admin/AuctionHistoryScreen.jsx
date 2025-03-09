import React, { useEffect, useState } from "react";
import AuctionCreateModal from "../../component/daugia/AuctionCreateModal";
import AuctionAdminDetailModal from "../../component/daugia/AuctionAdminDetailModal";
import { appVariables } from "../../constants/appVariables";
import { Button, message } from "antd";
import { collectionUtil, f_collectionUtil } from "../../utils/f_collectionUtil";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import handleAPI from "../../apis/handlAPI";
import { appInfo } from "../../constants/appInfos";
import { buttonStyleElements } from "../../component/element/buttonStyleElement";
import { HiArchiveBoxXMark } from "react-icons/hi2";

const AuctionHistoryScreen = () => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [auctionHistories, setAuctionHistories] = useState([]);
  const [auctionHistoryId, setAuctionHistoryId] = useState("");
  const [auctionHistory, setAuctionHistory] = useState(null);
  const [editing, setEditing] = useState(null);
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    refresh().then();
  }, [auth?.token]);

  useEffect(() => {
    console.log(auctionHistories);
  }, [auctionHistories]);

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
    return await handleAPI(
      "/api/admin/auction-histories",
      {},
      "get",
      auth?.token
    )
      .then((res) => {
        setAuctionHistories(res?.data);
      })
      .catch((error) => {
        message.error("Fetch error: ", error);
        console.log("Fetch error: ", error);
      });
  };

  const handleAcceptance = async (auctionKey) => {
    console.log("Auction key: ", auctionKey);
    await handleAPI(
      `/api/admin/handle-acceptance-auction-histories/${auctionKey}`,
      {},
      "PATCH",
      auth?.token
    )
      .then((res) => {
        message.success("Acceptance successfully!");
        console.log("res: ", res);
      })
      .catch((error) => {
        message.error("Error: " + error?.message);
        console.log("Error: ", error);
      });
    await refresh();
  };

  const deleteById = async (id) => {
    await handleAPI(
      `/api/admin/auction-histories/${id}`,
      {},
      "delete",
      auth?.token
    )
      .then((res) => message.success("Delete successfully!"))
      .catch((error) => {
        message.error("Delete error: ", error);
        console.log("Delete error: ", error);
      });
    await refresh();
  };

  return (
    <div>
      <div className="card">
        <div className="d-flex align-items-center justify-content-between">
          <div className="p-2 bd-highlight">
            <span>Danh Sách lịch sử đấu giá</span>
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
                  <th className="align-middle text-center">Ảnh</th>
                  <th className="align-middle text-center">Phiên đấu giá</th>
                  <th className="align-middle text-center">Nhà đấu giá</th>
                  <th className="align-middle text-center">Người đấu giá</th>
                  <th className="align-middle text-center">Số tiền đấu giá</th>
                  <th className="align-middle text-center">
                    Mã định danh phiên đấu giá
                  </th>
                  <th className="align-middle text-center">Trạng thái</th>
                  <th className="align-middle text-center">Mô tả</th>
                  <th colSpan={"3"}>Action</th>
                </tr>
              </thead>
              <tbody>
                {auctionHistories.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={item?.buildingImageUrls[0]}
                        alt={item?.building?.name}
                        width={"100px"}
                      />
                    </td>
                    <td>{item?.auction?.name}</td>
                    <td>{item?.building?.name}</td>
                    <td>
                      {`${item?.client?.user_name} - ${item?.client?.email}`}
                    </td>
                    <td>{appVariables.formatMoney(item?.bidAmount)}</td>
                    <td>{item?.identityKey}</td>
                    <td>
                      {item?.status === appVariables.CONFIRMED ? (
                        <span style={{ color: "green" }}>Đã duyệt</span>
                      ) : (
                        <span style={{ color: "red" }}>Chưa duyệt</span>
                      )}
                    </td>
                    <td>
                      <div style={{ textAlign: "center" }}>
                        {
                          //24 * 60 * 60 * 1000 1 ngày
                          //60 * 1000 1 phút
                          f_collectionUtil.checkTime(
                            item?.bidTime,
                            24 * 60 * 60 * 1000
                          ) === appVariables.NEW ? (
                            <span>
                              <img
                                width={"50%"}
                                src={appInfo?.newIcon}
                                alt="new"
                              />
                            </span>
                          ) : (
                            <span>
                              <img
                                width={"50%"}
                                src={appInfo?.oldIcon}
                                alt="old"
                              />
                            </span>
                          )
                        }
                      </div>
                    </td>
                    <td>
                      {item?.status === appVariables.CONFIRMED ? (
                        <Button
                          style={buttonStyleElements?.confirmButtonStyle}
                          disabled={true}
                          onClick={() => {
                            handleAcceptance(item?.identityKey).then();
                          }}
                        >
                          Đã duyệt
                        </Button>
                      ) : (
                        <Button
                          style={buttonStyleElements?.confirmButtonStyle}
                          onClick={() => {
                            handleAcceptance(item?.identityKey).then();
                          }}
                        >
                          Duyệt
                        </Button>
                      )}
                    </td>
                    <td>
                      <Button
                        style={buttonStyleElements?.deleteButtonStyle}
                        onClick={() => {
                          deleteById(item?.id).then();
                        }}
                      >
                        <HiArchiveBoxXMark />
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

export default AuctionHistoryScreen;
