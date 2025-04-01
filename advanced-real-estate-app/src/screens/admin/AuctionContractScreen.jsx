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
import { RiSecurePaymentLine } from "react-icons/ri";
import { GoShieldCheck } from "react-icons/go";
import { FaRegHandshake } from "react-icons/fa6";
import { BsTrophy } from "react-icons/bs";
import { WinBadge } from "../../component/daugia/AuctionWin";
import { IoMdTrophy } from "react-icons/io";
import { GrStatusGood } from "react-icons/gr";
import { TbCoinOff } from "react-icons/tb";
import { styleElements } from "../../component/element/styleElement";
export const PaymentStatus = (props) => (
  <div style={props?.styles}>
    {props?.icon}
    <span>{props?.message}</span>
  </div>
);

const AuctionContractScreen = (props) => {
  const auth = useSelector(authSelector);
  const [filter, setFilter] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [objectItem, setObjectItem] = useState({});
  const [auctionContracts, setAuctionContracts] = useState([]);
  const [showSignedContracts, setShowSignedContracts] = useState(false);

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

  const handleConfirmPayment = async (id) => {
    try {
      const res = await handleAPI(
        `/api/admin/auction-contracts/confirm_payment/${id}`,
        {},
        "PATCH",
        auth?.token
      );
      console.log(res);
      await refresh();
    } catch (error) {
      if (error?.code >= 302 && error?.code <= 400) {
        message.error("Hợp đồng này đã được xác nhận thanh toán!");
      }
      console.log(error);
    }
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
            <input
              type="checkbox"
              id="show-contracts"
              checked={filter?.showSignedContracts}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  showSignedContracts: e.target.checked,
                })
              }
              style={{
                height: "16px",
                width: "16px",
                marginRight: "8px",
              }}
            />
            <label
              htmlFor="show-contracts"
              style={{
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Lọc hợp đồng chưa xác nhận
            </label>
            <input
              type="checkbox"
              id="show-contracts"
              checked={filter?.isPayment}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  isPayment: e.target.checked,
                })
              }
              style={{
                height: "16px",
                width: "16px",
                marginRight: "8px",
                marginLeft: "15px",
              }}
            />
            <label
              htmlFor="show-contracts"
              style={{
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Lọc hợp đồng chưa thanh toán
            </label>
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
                  <th className="align-middle text-center">
                    Trạng thái thanh toán
                  </th>
                  <th className="align-middle text-center">Chi tiết đấu giá</th>
                  <th className="align-middle text-center">
                    Ngày lập hợp đồng
                  </th>
                  <th colSpan={"3"}>Action</th>
                </tr>
              </thead>
              <tbody>
                {auctionContracts
                  ?.filter((item) => {
                    const isPendingContract =
                      item?.contractStatus === appVariables.PENDING;
                    const isUnpaid = item?.paymentStatus < 1;
                    return (
                      (!filter?.showSignedContracts || isPendingContract) &&
                      (!filter?.isPayment || isUnpaid)
                    );
                  })
                  ?.map((item, index) => (
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
                      <td>
                        {item?.paymentStatus === 1 ? (
                          <PaymentStatus
                            styles={styleElements.statusConfirmStyle}
                            message={`Đã xác nhận thanh toán`}
                            icon={<GrStatusGood style={{ fontSize: "25px" }} />}
                          />
                        ) : (
                          <PaymentStatus
                            styles={styleElements.statusYetConfirmStyle}
                            message={`Chưa xác nhận thanh toán`}
                            icon={<TbCoinOff style={{ fontSize: "25px" }} />}
                          />
                        )}
                      </td>
                      <td>{item?.settingDate}</td>
                      {item?.contractStatus === appVariables.PENDING ? (
                        <td>
                          <Button
                            title="Xác nhận ký kết hợp đồng"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#auctionContractDetailModal"
                            style={buttonStyleElements?.confirmButtonStyle}
                            onClick={() => setObjectItem(item)}
                            to={`#`}
                          >
                            <FaRegHandshake />
                          </Button>
                        </td>
                      ) : (
                        <td>
                          <Button
                            title="Đã xác nhận ký kết hợp đồng"
                            type="button"
                            style={buttonStyleElements?.confirmBtnStyle}
                            to={`#`}
                          >
                            <GoShieldCheck />
                          </Button>
                        </td>
                      )}
                      <td>
                        <Button
                          title="Xác nhận thanh toán hợp đồng"
                          style={buttonStyleElements?.paymentButtonStyle}
                          onClick={() => handleConfirmPayment(item?.id)}
                        >
                          <RiSecurePaymentLine />
                        </Button>
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

export default AuctionContractScreen;
