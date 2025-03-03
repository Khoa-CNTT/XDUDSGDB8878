import React, {useEffect, useState} from 'react';
import handleAPI from "../../apis/handlAPI";
import {Button, message} from "antd";
import {removeBidMessages, removeUsers} from "../../redux/reducers/auctionReducer";
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import {Link, useNavigate} from "react-router-dom";
import {appVariables} from "../../constants/appVariables";
import styles from '../../assets/css/auction-win.module.css';
import DetailAuctionModal from "./DetailAuctionModal";
import AuctionWinDetailModal from "./AuctionWinDetailModal";


export const StatusBadge = (props) => {
    console.log("props: ", props);
    return (
        <span className={`${props.styles.status} 
        ${props?.status === props?.trangThaiSoSanh ? props.styles.pending : props.styles.confirmed}`}>
         {props?.status === props?.trangThaiSoSanh ? props?.tranThaiTruyenVao : "Đã xác nhận"}
        </span>
    );
}

export const WinBadge = () => <span className={styles.winBadge}>Chiến thắng</span>

const AuctionWin = () => {
    const auth = useSelector(authSelector)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [auctionWins, setAuctionWins] = useState([]);
    const [objectItem, setObjectItem] = useState({});

    useEffect(() => {
        refresh().then()
    }, [])

    const refresh = async () => {
        try {
            const res = await handleAPI(
                `/api/admin/auction-details/user-auction-details/${auth?.info?.id}`,
                {},
                "get",
                auth?.token,
            )
            setAuctionWins(res?.data)
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
            <AuctionWinDetailModal
                utils={utils}
            />
            <div className={styles.container}>
                <h2 className={styles.title}>Phiên đấu giá chiến thắng</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Tên phiên đấu giá</th>
                            <th>Số tiền đấu giá</th>
                            <th>Trạng thái</th>
                            <th>Kết quả</th>
                            <th colSpan={"3"}>
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {auctionWins?.map((item, index) => (
                            <tr key={index}>
                                <td>{item?.id}</td>
                                <td>{item?.client?.email}</td>
                                <td>{item?.auction?.name}</td>
                                <td>
                                <span className={styles.bidAmount}>
                                    {appVariables.formatMoney(item?.bidAmount)}
                                </span>
                                </td>
                                <td>
                                    <StatusBadge 
                                        trangThaiSoSanh={appVariables.YET_CONFIRM} 
                                        tranThaiTruyenVao={'Chưa xác nhận'}
                                        styles={styles}
                                        status={item.status}
                                    />
                                </td>
                                <td>{item.result === appVariables.WIN && <WinBadge/>}</td>
                                <td>
                                    <Link type="button"
                                          data-bs-toggle="modal"
                                          data-bs-target="#auctionWinDetailModal"
                                          className={`btn btn-success ${styles.contractButton}`}
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
}

export default AuctionWin;