import handleAPI from "../apis/handlAPI";
import {message} from "antd";

//function collection
export const f_collectionUtil = {

    handleCollectionId: function (id, set) {
        set(id);
    },
    handleCollectionItem: function (url, set, auth) {
        handleAPI(url, {}, "GET", auth?.token)
        .then(res => {
            set(res?.data);
        })
        .catch(error=> {
            message.error("Error: ", error);
            console.log("Error: ", error);
        });
    },
    checkTime(time, timeLimited) {
        const currentTime = new Date();
        const bidDate = new Date(time);
        // Tính khoảng cách thời gian giữa `bidTime` và thời gian hiện tại (theo milliseconds)
        const timeDifference = currentTime - bidDate;
        // 1 ngày tính bằng milliseconds
        const timeLimit = timeLimited;

        if (timeDifference > timeLimit) {
            return "old";
        } else if (timeDifference > 0 && timeDifference <= timeLimit) {
            return "new";
        } else {
            return "invalid";
        }
    }
}