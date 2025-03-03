import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import {Link, useNavigate} from "react-router-dom";
import handleAPINotToken from "../../apis/handleAPINotToken";
import {message} from "antd";
import {appVariables} from "../../constants/appVariables";
import styles from '../../assets/css/detail-auction-modal.module.css';

const DetailAuctionModal = ({auctionId}) => {

    const auth = useSelector(authSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [auction, setAuction] = useState(null);

    useEffect(() => {
        if(auctionId){
            handleAPINotToken(`/api/user/auctions/${auctionId}`, {}, 'GET')
                .then(res=>{
                    console.log(res?.data);
                    setAuction(res?.data);
                })
                .catch(error=>{
                    console.log(error);
                    message.error(error.message);
                });
        }
    }, [auctionId]);

    const handleRedirectDetailBuilding = () => {
        window.location.pathname = `/buildings/${auction?.building?.id}`;
    };

    return (
        <div>
            <div className="modal fade" id="auctionDetailModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <i className="fa fa-balance-scale text-primary" id="exampleModalLabel"></i>
                            <b style={{paddingLeft: 5}}>Chi tiết phiên đấu giá {" "}</b>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className={styles.auctionInfo}>
                                    <div className={styles.auctionColumn}>
                                        <span>
                                             <i className="fa fa-balance-scale text-primary"></i>
                                            {' Phiên: ' + auction?.name}
                                        </span>
                                        <br/>
                                        <span>
                                            <i className="fa fa-calendar text-primary"></i>
                                            {' Ngày bắt đầu: ' + auction?.start_date}
                                        </span>
                                        <br/>
                                        <span>
                                            <i className="fa fa-circle text-primary"></i>
                                            {' Trạng thái:'} {
                                            appVariables.checkStatus(auction?.start_date, auction?.start_time, auction?.end_time) ===
                                            appVariables.BEFORE ? (
                                                    <span className={'text-primary'}>
                                                Chưa bắt đầu
                                            </span>) :
                                                appVariables.checkStatus(auction?.start_date, auction?.start_time, auction?.end_time) ===
                                                appVariables.NOW ? (
                                                    <span className={'text-success'}>
                                                Đang bắt đầu
                                            </span>) : (
                                                    <span className={'text-danger'}>
                                                Đã kết thúc
                                            </span>
                                                )
                                        }
                                        </span>
                                    </div>
                                    <div className={styles.auctionColumn}>
                                        <i className="fa fa-clock text-primary"></i>
                                        <span>{` Thời hạn đấu giá: ${auction?.start_time} - ${auction?.end_time}`}</span>
                                        <br/>
                                        <i className="fa fa-info text-primary"></i>
                                        <span>{' Mô tả: ' + auction?.description}</span>
                                    </div>
                                </div>
                                <hr/>
                                <div className={styles.buildingInfo}>
                                    <h6>Thông tin nhà đấu giá</h6>
                                    <span>
                                        <i className="fa fa-money text-primary me-2"/>
                                        {' Nhà đấu giá: ' + auction?.building?.name}
                                    </span>
                                    <br/>
                                    <span>
                                        <i className="fa fa-arrows text-primary me-2"/>
                                        {' Diện tích nhà: ' + auction?.building?.acreage}
                                    </span>
                                    <br/>
                                    <span>
                                        <i className="fa fa-home text-primary me-2"/>
                                        {' Kiến trúc: ' + auction?.building?.structure}
                                    </span>
                                    <br/>
                                    <span>
                                        <i className="fa fa-home text-primary me-2"/>
                                        {' Số tầng: ' + auction?.building?.number_of_basement}
                                    </span>
                                    <br/>
                                    <span>
                                        <i className="fa fa-money text-primary me-2"/>
                                        {' Giá khởi điểm: ' + appVariables.formatMoney(auction?.typeBuilding?.price)}
                                    </span>
                                    <br/>
                                    <span>
                                        <i className="fa fa-map-marker text-primary me-2"/>
                                        {' Địa chỉ: ' + auction?.map?.address}
                                    </span>
                                    <br/>
                                    <span>
                                        <i className="fa fa-briefcase text-primary me-2"/>
                                        {' Tính pháp lý: sổ đỏ đầy đủ'}
                                    </span>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <Link className="w-100 text-center"
                                  onClick={handleRedirectDetailBuilding}
                                  to={'#'}
                            >
                                XEM NHÀ NGAY
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailAuctionModal;