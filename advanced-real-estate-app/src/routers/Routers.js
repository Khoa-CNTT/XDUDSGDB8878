/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import ClientRouter from "./ClientRouter";
import { ForgetPassword, NotFound } from "../screens";
import UserRouter from "./UserRouter";

const Routers = () => {
    return (
        <BrowserRouter>
            
            <Routes>
                {/* Nếu role là admin, chuyển đến AdminRouter */}
                {<Route path="/admin/*" element={<AdminRouter />} />}
                {<Route path="/404-not-found" element={<NotFound />} />}
                {<Route path="/admin/forgot-password" element={<ForgetPassword />} />}
                {<Route path="/user/*" element={<UserRouter />} />}
                {/* Nếu role là client hoặc bất kỳ URL khác, chuyển đến ClientRouter */}
                {<Route path="/*" element={<ClientRouter />} />}
            </Routes>
            
        </BrowserRouter>
    );
};

export default Routers;