/* eslint-disable no-unused-vars */
import React, {useRef, useState} from 'react';
import styles from '../../assets/css/instance.module.css';
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import ChatComponent from "../../component/roomChat/ChatComponent";
import {appInfo} from "../../constants/appInfos";

const RoomChatClientScreen = () => {

    const auth = useSelector(authSelector);
    const [messages, setMessages] = useState([]);
    const [countUser, setCountUser] = useState("");
    const chatContainerRef = useRef(null);
    const dispatch = useDispatch();

    return (
        <div style={
            {
                paddingTop: "150px"
            }
        }>
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
                    </div>
                    <div className="row g-5">
                        <div className="col-lg-12">
                            <div
                                className="wow fadeInUp"
                                data-wow-delay="0.2s"
                                style={{
                                    visibility: "visible",
                                    animationDelay: "0.2s",
                                    animationName: "fadeInUp"
                                }}
                            >
                                <ChatComponent
                                    auth={auth}
                                    messages={messages}
                                    setMessages={setMessages}
                                    countUser={countUser}
                                    setCountUser={setCountUser}
                                    chatContainerRef={chatContainerRef}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RoomChatClientScreen;