import axiosClient from "./axiosClient";

const handleAPINotToken = async (url, data, method) => {
    return axiosClient(url, {
        method: method,
        data,
    });
};

export default handleAPINotToken;