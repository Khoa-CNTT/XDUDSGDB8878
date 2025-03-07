import React, {useEffect, useState} from 'react';
import handleAPI from "../../apis/handlAPI";
import {Button, message} from "antd";
import {removeBidMessages, removeUsers} from "../../redux/reducers/auctionReducer";
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import {Link, useNavigate} from "react-router-dom";
import {appVariables} from "../../constants/appVariables";
import styleAuctionWins from '../../assets/css/auction-win.module.css';
import styleAuctionContracts from '../../assets/css/auction-contract.module.css';
import DetailAuctionModal from "./DetailAuctionModal";
import AuctionWinDetailModal from "./AuctionWinDetailModal";
import {StatusBadge, WinBadge} from "./AuctionWin";
import AuctionContractDetailModal from "./AuctionContractDetailModal";

const AuctionContract = () => {

    const auth = useSelector(authSelector)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [auctionContracts, setAuctionContracts] = useState([]);
    const [objectItem, setObjectItem] = useState({});
    
    useEffect(() => {
        refresh().then()
    }, [])

    const refresh = async () => {
        try {
            const res = await handleAPI(
                `/api/admin/auction-contracts/user-auction-contracts/${auth?.info?.id}`,
                {},
                "get",
                auth?.token,
            )
            setAuctionContracts(res?.data)
        } catch (error) {
            message.error("Fetch error: " + error)
            console.log("Fetch error: ", error);
        }
    }
    const utils = {
        objectItem: objectItem,
    }

    return (
        <div>
            <AuctionContractDetailModal 
                utils={utils}
            />
            <div className={styleAuctionWins.container}>
                <h2 className={styleAuctionWins.title}>Hợp đồng đấu giá</h2>
                <div className={styleAuctionWins.tableContainer}>
                    <table className={styleAuctionWins.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ và tên</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th colSpan={"3"}>
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {auctionContracts?.map((item, index) => (
                            <tr key={index}>
                                <td>{item?.id}</td>
                                <td>{item?.full_name}</td>
                                <td>{item?.phone_number}</td>
                                <td>{item?.address}</td>
                                <td>
                                    <td>
                                    <StatusBadge 
                                        trangThaiSoSanh={appVariables.PENDING} 
                                        tranThaiTruyenVao={'Chờ xác nhận'}
                                        styles={styleAuctionContracts}
                                        status={item?.contractStatus}
                                    />
                                </td>
                                </td>
                                <td>
                                    <Link type="button"
                                          data-bs-toggle="modal"
                                          data-bs-target="#auctionContractDetailModal"
                                          className={`btn btn-success ${styleAuctionWins.contractButton}`}
                                          onClick={()=>{
                                              setObjectItem(item);
                                          }}
                                          to={`#`}>
                                        XEM HỢP ĐỒNG
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default AuctionContract;