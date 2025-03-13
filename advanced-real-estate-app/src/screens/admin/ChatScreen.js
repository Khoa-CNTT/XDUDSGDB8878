import React, {useState, useEffect, useRef} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {useDispatch, useSelector} from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import styles from "../../assets/css/chat-box.module.css";
import handleAPINotToken from "../../apis/handleAPINotToken";
import {Link} from "react-router-dom";
import ChatComponent from "../../component/roomChat/ChatComponent";

const ChatScreen = () => {

    const auth = useSelector(authSelector);
    const [messages, setMessages] = useState([]);
    const [countUser, setCountUser] = useState("");
    const chatContainerRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        return ()=>{
        }
    }, []);

    return (
        <div>
            <ChatComponent
                auth={auth}
                messages={messages}
                setMessages={setMessages}
                countUser={countUser}
                setCountUser={setCountUser}
                chatContainerRef={chatContainerRef}
            />
        </div>
    );
};

export default ChatScreen;
