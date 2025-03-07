import axiosClient from "./axiosClient";

const handleAPI = async (url, data, method = "get", token, additionalHeaders = {}) => {
    return axiosClient(url, {
        token: token,
        method: method,
        data,
        headers: {
            ...additionalHeaders,
        },
    });
};

export default handleAPI;
