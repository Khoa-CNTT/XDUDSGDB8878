/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {Welcome} from "../../component";
import handleAPINotToken from "../../apis/handleAPINotToken";
import styles from "../../assets/css/building.module.css";
import {Link, useNavigate} from "react-router-dom";
import BuildingComponent from "../../component/building/BuildingComponent";
import {appInfo} from "../../constants/appInfos";
import {appVariables} from "../../constants/appVariables";
import RoomAuctionComponent from "../../component/daugia/RoomAuctionComponent";
import DauGiaComponent from "../../component/daugia/DauGiaComponent";
import {useDispatch, useSelector} from "react-redux";
import {auctionSelector} from "../../redux/reducers/auctionReducer";


let stompClient = null;

const HomeScreen = () => {
    const auctionReducer = useSelector(auctionSelector);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (auctionReducer?.lastAction === 'joinAuctionRoomCompleted') {
            navigate('/auction-room');
        }
    }, [auctionReducer?.lastAction, navigate, dispatch]);

    return (
        <div>
            <Welcome/>
            <BuildingComponent/>
            <div className="container-xxl py-5">
                <div className="container">
                    <div
                        className="text-center wow fadeInUp"
                        data-wow-delay="0.1s"
                        style={{
                            visibility: "visible",
                            animationDelay: "0.1s",
                            animationName: "fadeInUp"
                        }}
                    >
                        <h1 className="mb-5">
                            CÁC PHIÊN ĐẤU <span className="text-primary text-uppercase">GIÁ DIỄN RA</span>
                        </h1>
                    </div>
                    <div>
                        <RoomAuctionComponent pageSize={4}/>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
