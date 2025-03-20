import handleAPI from "../apis/handlAPI";
import handleAPINotToken from "../apis/handleAPINotToken";
import { message } from "antd";

//function collection
export const f_collectionUtil = {
  handleCollectionId: function (id, set) {
    set(id);
  },
  handleCollectionItem: function (url, set, auth) {
    handleAPI(url, {}, "GET", auth?.token)
      .then((res) => {
        set(res?.data);
      })
      .catch((error) => {
        message.error("Error: ", error);
        console.log("Error: ", error);
      });
  },
  handleCollectionArrayNotAuth: function (url, sets) {
    handleAPINotToken(url, {}, "GET")
      .then((res) => {
        sets(res?.data);
      })
      .catch((error) => {
        message.error("Error: ", error);
        console.log("Error: ", error);
      });
  },
  handleCollectionArray: function (url, sets, token) {
    handleAPI(url, {}, "GET", token)
      .then((res) => {
        sets(res?.data);
      })
      .catch((error) => {
        sets([]);
        console.log("Error: ", error);
      });
  },
  scrollToBottom: (messagesEndRef) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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
  },
  calculateDuration(start_date, start_time, end_time) {
    const start = new Date(`${start_date}T` + start_time + "Z");
    const end = new Date(`${start_date}T` + end_time + "Z");
    let duration = (end - start) / 1000 / 60;
    if (duration < 0) {
      duration += 24 * 60;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} Giờ ${minutes} Phút`;
  },
  validateField(name, value) {
    if (!value.trim()) {
      return "Vui lòng nhập vào!";
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharRegex.test(value)) {
      return "Không được chứa ký tự đặc biệt!";
    }
    return null;
  },
  checkContractTimeExceeded(settingDate) {
    const contractDate = new Date(settingDate);
    const now = new Date();
    const timeDiff = now - contractDate;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      return true;
    } else {
      return false;
    }
  },
  embedLink(text) {
    const urlPattern = /(https?:\/\/[^\s\])]+)/g;
    const foundUrls = new Set();
    let cleanedText = text.replace(/[\[\]()]/g, " ");
    cleanedText = cleanedText.replace(/(https?:\/\/)/g, " $1").trim();

    return cleanedText
      .replace(urlPattern, (url) => {
        if (foundUrls.has(url)) return "";
        foundUrls.add(url);
        return `<a href="${url}" target="_blank">${url}</a>`;
      })
      .trim();
  },
};
