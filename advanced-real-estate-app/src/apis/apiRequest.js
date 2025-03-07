import axiosClient from "./axiosClient";

const handleApiRequest = async (url, data, method , token) => {
    return axiosClient(url, {
        method: method,
        data,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export default handleApiRequest;