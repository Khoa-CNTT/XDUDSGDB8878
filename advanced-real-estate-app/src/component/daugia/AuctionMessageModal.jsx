import React, {useEffect, useRef} from 'react';
import styles from '../../assets/css/daugia.module.css';
import {useSelector} from "react-redux";
import {auctionSelector} from "../../redux/reducers/auctionReducer";
import {appVariables} from "../../constants/appVariables";
import {authSelector} from "../../redux/reducers/authReducer";

const AuctionMessageModal = ({ object }) => {

    const auctionReducer = useSelector(auctionSelector);
    const chatMessagesRef = useRef(null);
    const auth = useSelector(authSelector);

    return (
        <div className={"auction-message-modal"}>
            <div>
                <div className="modal fade" id="AuctionMessageModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <i className="fa fa-balance-scale text-primary" id="exampleModalLabel"></i>
                                <b style={{paddingLeft: 5, color: 'black'}}>Tin nhắn đấu giá {" "}</b>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="col-md-12">
                                    <div className={styles.header}>
                                        <h3>Bid Messages</h3>
                                    </div>
                                    <div className={styles.chatBox}>
                                        <div className={styles.chatMessages}>
                                            {auctionReducer?.bidMessages?.map((msg, index) => (
                                                <div
                                                    className={`${styles.chatBubble} ${msg?.sender === auth?.info?.email ? styles.self : styles.other}`}
                                                    key={index}>
                                                    <div className={styles.messageContent}>
                                                    <span className={styles.messageUser}>
                                                        {msg?.sender || 'Unknown'}:
                                                    </span>
                                                    <span className={styles.bidAmount}>
                                                        {'Vừa đấu giá ' + appVariables.formatMoney(msg?.bidAmount || 0)}
                                                    </span>
                                                    </div>
                                                    <div className={styles.timeStamp}>
                                                        {msg?.currentDateTime}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer">
                                {auth?.roles === 'ADMIN' ? (
                                    <button onClick={object.deleteBidMessage} type="button"
                                            className="w-100 btn btn-danger">
                                        XÓA TIN NHẮN
                                    </button>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionMessageModal;