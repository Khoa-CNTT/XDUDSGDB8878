import React, {useEffect, useState} from 'react';
import handleAPINotToken from "../../apis/handleAPINotToken";
import styles from "../../assets/css/chat-box.module.css";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {add} from "../../redux/reducers/chatReducer";
import {authSelector} from "../../redux/reducers/authReducer";
import { Button, Card, Form, Input, message, Typography } from "antd";

const RoomChatComponent = () => {

    const [rooms, setRooms] = useState([]);
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);

    const callApiRoomChat = async ()=>{
        return await handleAPINotToken('/api/user/room-chats', {}, 'get');
    }

    useEffect(() => {
        callApiRoomChat()
            .then(res => setRooms(res?.data))
            .catch(error => console.error("Fetch error: ",error));
    }, []);

    const handleRoomChange = (room) => {
        if(!auth?.token){
            message.error("Bạn không thể vào phòng chat vui lòng đăng nhập vào!");
            return;
        }
        const chatData = {
            room: room,
            userData : {
                connected: true,
                message: "",
            }
        }
        dispatch(add(chatData));
    };

    return (
        <div>
            <div className={styles.roomContainer}>
                {rooms.map((room, index) => (
                    <div key={index} className={styles.roomCard}>
                        <img src={`data:${room?.file_type};base64,${room?.image}`}
                             alt={room.name} className={styles.roomImage}
                        />
                        <div className={styles.roomContent}>
                            <Link
                                onClick={() => handleRoomChange(room.name)}
                                to={'#'}
                            >
                                <h3 className={styles.roomTitle}>{room.name}</h3>
                                <p className={styles.roomDescription}>{room.description}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomChatComponent;