import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/authReducer";

const PrivateRoute = ({ children, path }) => {
    const auth = useSelector(authSelector);

    // Kiểm tra nếu chưa đăng nhập
    if (!auth.token) {
        return <Navigate to="/admin/login" />;
    }

    const roles = auth.permission || []; // Đảm bảo rằng roles luôn là một mảng
    if (!roles.includes(path)) {
        return <Navigate to="/404-not-found" />;
    }

    // Nếu đã đăng nhập và có quyền truy cập
    return children;
};

export default PrivateRoute;