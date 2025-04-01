import React, { useEffect, useState } from "react";
import AuctionCreateModal from "../../component/daugia/AuctionCreateModal";
import AuctionAdminDetailModal from "../../component/daugia/AuctionAdminDetailModal";
import InfoLinkDetailToolTip from "../../component/info/InfoLinkDetailToolTip";
import AuctionLinkDetailToolTip from "../../component/daugia/AuctionLinkDetailToolTip";
import AuctionDetailLinkDetailToolTip from "../../component/daugia/AuctionDetailLinkDetailToolTip";
import { appVariables } from "../../constants/appVariables";
import { Button, message } from "antd";
import { collectionUtil, f_collectionUtil } from "../../utils/f_collectionUtil";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import handleAPI from "../../apis/handlAPI";
import { appInfo } from "../../constants/appInfos";
import { buttonStyleElements } from "../../component/element/buttonStyleElement";
import { Link, useNavigate } from "react-router-dom";
import { FaRemoveFormat } from "react-icons/fa";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { FiAlertTriangle, FiCheck } from "react-icons/fi";
import AuctionContractDetailModal from "../../component/daugia/AuctionContractDetailModal";
import { AlertWarningIconTooltip } from "../../component/element/alertElement";
import { ClockCircleOutlined } from "@ant-design/icons";
import { GoCheckCircle } from "react-icons/go";
import { useRef } from "react";
import { AiFillEye } from "react-icons/ai";

const AuctionContractScreen = (props) => {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [objectItem, setObjectItem] = useState({});
  const [auctionContracts, setAuctionContracts] = useState([]);

  useEffect(() => {
    refresh().then();
  }, [auth?.token]);

  const refresh = async () => {
    return await handleAPI(
      "/api/admin/auction-contracts",
      {},
      "get",
      auth?.token
    )
      .then((res) => {
        console.log("data: ", res?.data);
        setAuctionContracts(res?.data);
      })
      .catch((error) => {
        message.error("Fetch error: ", error);
        console.log("Fetch error: ", error);
      });
  };

  const deleteById = async (id) => {
    await handleAPI(
      `/api/admin/auction-contracts/${id}`,
      {},
      "delete",
      auth?.token
    )
      .then((res) => message.success("Delete successfully!"))
      .catch((error) => {
        message.error(error?.message);
        console.log("Delete error: ", error);
      });
    await refresh();
  };

  const utils = {
    objectItem: objectItem,
    refresh: refresh,
  };

  return (
    <div>
      <AuctionContractDetailModal utils={utils} />
      <div className="card">
        <div className="d-flex align-items-center justify-content-between">
          <div className="p-2 bd-highlight">
            <span>Danh Sách hợp đồng đấu giá</span>
          </div>
          <div className="p-2 bd-highlight">
            {/* <button
              type="button"
              className="btn btn-primary"a
              data-bs-toggle="modal"
              data-bs-target="#AuctionCreateModal"
            >
              Thêm Mới
            </button> */}
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive" style={{ overflow: "visible" }}>
            <table
              className="table table-bordered"
              style={{ position: "relative" }}
            >
              <thead>
                <tr>
                  <th className="align-middle text-center">Cảnh báo</th>
                  <th className="align-middle text-center">ID</th>
                  <th className="align-middle text-center">Tên khách hàng</th>
                  <th className="align-middle text-center">Phiên đấu giá</th>
                  <th className="align-middle text-center">Chi tiết đấu giá</th>
                  <th className="align-middle text-center">
                    Ngày lập hợp đồng
                  </th>
                  <th colSpan={"3"}>Action</th>
                </tr>
              </thead>
              <tbody>
                {auctionContracts.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      {appVariables.PENDING === item?.contractStatus &&
                      f_collectionUtil.checkContractTimeExceeded(
                        item?.settingDate
                      ) ? (
                        <AlertWarningIconTooltip
                          icon={FiAlertTriangle}
                          cssIcon={{
                            fontSize: "25px",
                            color: "#EF4444",
                            cursor: "pointer",
                          }}
                          message={`Đã trễ thời gian xác nhận hợp đồng. Vui lòng xác nhận!`}
                        />
                      ) : appVariables.PENDING === item?.contractStatus ? (
                        <AlertWarningIconTooltip
                          icon={ClockCircleOutlined}
                          cssIcon={{
                            fontSize: "25px",
                            color: "#FEA116",
                          }}
                          message={`Vui lòng xác nhận hợp đồng cho khách hàng!`}
                        />
                      ) : (
                        <GoCheckCircle
                          onClick={() => {
                            setObjectItem(item);
                            window
                              .$("#auctionContractDetailModal")
                              .modal("show");
                          }}
                          style={{
                            fontSize: "25px",
                            color: "#22C55E",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </td>
                    <td>{item?.id}</td>
                    <td>
                      <InfoLinkDetailToolTip
                        address={item?.address}
                        full_name={item?.full_name}
                        phone_number={item?.phone_number}
                      />
                    </td>
                    <td>
                      <AuctionLinkDetailToolTip
                        date={`${item?.auctionDetail?.auction?.start_date} 
                        ${item?.auctionDetail?.auction?.start_time} - ${item?.auctionDetail?.auction?.end_time}`}
                        originPrice={appVariables.formatMoney(
                          item?.auctionDetail?.building?.typeBuilding?.price
                        )}
                        auctionName={item?.auctionDetail?.auction?.name}
                        buildingName={item?.auctionDetail?.building?.name}
                      />
                    </td>
                    <td>
                      <AuctionDetailLinkDetailToolTip
                        buildingName={item?.auctionDetail?.building?.name}
                        auctionName={item?.auctionDetail?.auction?.name}
                        bidAmount={appVariables.formatMoney(
                          item?.auctionDetail?.bidAmount
                        )}
                        status={item?.auctionDetail?.status}
                        result={item?.auctionDetail?.result}
                      />
                    </td>
                    <td>{item?.settingDate}</td>
                    {item?.contractStatus === appVariables.PENDING ? (
                      <td>
                        <Link
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#auctionContractDetailModal"
                          style={buttonStyleElements?.confirmButtonStyle}
                          onClick={() => setObjectItem(item)}
                          to={`#`}
                        >
                          XÁC NHẬN
                        </Link>
                      </td>
                    ) : (
                      <td>
                        <Link
                          type="button"
                          style={buttonStyleElements?.confirmButtonStyle}
                          to={`#`}
                        >
                          ĐÃ XÁC NHẬN
                        </Link>
                      </td>
                    )}
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

export default AuctionContractScreen;
