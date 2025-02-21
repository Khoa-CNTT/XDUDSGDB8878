/* eslint-disable react-hooks/exhaustive-deps */
import { Affix, Layout, Spin } from "antd";
import { Routes, Route, useNavigate } from "react-router-dom";
import { FooterComponent, HeaderComponent, SiderComponent } from "../component";
import AdminScreen from "./../screens/admin/AdminScreen";
import ServiceScreen from "./../screens/admin/ServiceScreen";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, removeAuth, authSelector } from "../redux/reducers/authReducer";
import { Login } from "../screens";
import { useEffect, useState } from "react";
import BuildingScreen from "../screens/admin/BuildingScreen";
import MapScreen from "../screens/admin/MapScreen";
import PrivateRoute from "./PrivateRoute";
import ChatScreen from "../screens/admin/ChatScreen";
import { jwtDecode } from 'jwt-decode';
import RoomChatScreen from "../screens/admin/RoomChatScreen";
import {appVariables} from "../constants/appVariables";
import {fetchUser} from "../apis/api";
import { message } from "antd";
import AuctionScreen from "../screens/admin/AuctionScreen";
import TypeBuildingScreen from "../screens/admin/TypeBuildingScreen";
import DeviceScreen from "../screens/admin/DeviceScreen";
import CategoryScreen from "../screens/admin/CategoryScreen";
import RolerScreen from "../screens/admin/RolerScreen";
import MaintenanceScreen from "../screens/admin/MaintenanceScreen";
import CustomerScreen from "../screens/admin/CustomerScreen";
import Contract from "../screens/admin/Contract";
import AuctionHistoryScreen from "../screens/admin/AuctionHistoryScreen";
import handleAPINotToken from "../apis/handleAPINotToken";

const { Content } = Layout;

function AdminRouter() {
    const auth = useSelector(authSelector);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true); // Trạng thái để kiểm soát hiển thị khi đang tải dữ liệu
    const navigate = useNavigate();
    const listRoleRequireForManagerPage = appVariables.listRoleRequireForManagerPage;
    const [listRoleManagerPage, setListRoleManagerPage] = useState([]);
    const [isRoleDataLoading, setIsRoleDataLoading] = useState(true);

    useEffect(() => {
        const type = listRoleRequireForManagerPage[0];
        handleAPINotToken(`/api/user/roles/${type}`, {}, 'GET')
            .then((res) => {
                setListRoleManagerPage(res?.data);
            })
            .catch((error) => {
                console.log("ERROR: ", error);
                message.error("ERROR: " + error);
                setListRoleManagerPage([]);
            })
            .finally(() => {
                setIsRoleDataLoading(false);
            });
    }, []);

    useEffect(() => {
        console.log("listRoleManagerPage: ", listRoleManagerPage);
    }, [listRoleManagerPage]);

    useEffect(() => {
        //luôn luôn gọi tới API để check token xem token có chính xác hay không
        if(auth?.token){
            fetchUser("/api/users", {}, "get",
                auth?.token,
                dispatch,
                message
            ).then();
        }
        console.log("auth: ",auth);
    }, [auth?.token]);

    useEffect(() => {
        const token = auth?.token;
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                navigate("/admin/login");
                dispatch(removeAuth());
            }
        } catch (error) {
            dispatch(removeAuth());
        }
    }, [dispatch]);

    useEffect(() => {
        if (!auth.token || !auth.isAuth) {
            navigate("/admin/login");
            getData();
        } else {
            if (window.location.pathname === "/admin/login") {
                navigate("/admin"); // Điều hướng đến /admin nếu đã đăng nhập và cố truy cập /admin/login
            }
            setIsLoading(false);
        }
    }, [auth.token]);

    const getData = async () => {
        dispatch(addAuth(auth));
        setIsLoading(false);
    };

    if (isLoading || isRoleDataLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Spin />
            </div>
        );
    }

    // Nếu không có token, hiển thị trang đăng nhập
    if (!auth.token) {
        return <Login />;
    }
    if (!auth.isAuth) {
        return <Login />;
    }
    // Nếu K phải là role ADMIN thì đá về đăng nhập
    if (auth?.roles) {
        if(listRoleManagerPage.length < 1){
            const initRoles = [
                { role_name: 'ADMIN'},
                { role_name: 'STAFF'},
            ];
            setListRoleManagerPage(initRoles);
        }
        const hasRequiredRole = listRoleManagerPage.some(role => role.role_name === auth.roles);
        if (!hasRequiredRole) {
            return <Login />;
        }
    }

    // Nếu có token, hiển thị giao diện admin
    return (
        <Layout>
            <Affix offsetTop={0}>
                <SiderComponent />
            </Affix>
            <Layout style={{ backgroundColor: "white !important" }}>
                <Affix offsetTop={0}>
                    <HeaderComponent />
                </Affix>
                <Content className="pt-3 container-fluid">
                    <Routes>
                        <Route
                            path="roler"
                            element={
                                <PrivateRoute path="/admin/roler">
                                    <RolerScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path=""
                            element={
                                <PrivateRoute path="/admin">
                                    <AdminScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="type-building"
                            element={
                                <PrivateRoute path="/admin/type-building">
                                    <TypeBuildingScreen />
                                </PrivateRoute>
                            }
                        />
                         <Route
                            path="contract"
                            element={
                                <PrivateRoute path="/admin/contract">
                                    <Contract />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="device"
                            element={
                                <PrivateRoute path="/admin/device">
                                    <DeviceScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="category"
                            element={
                                <PrivateRoute path="/admin/category">
                                    <CategoryScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="chat"
                            element={
                                <PrivateRoute path="/admin/chat">
                                   <ChatScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="room-chat"
                            element={
                                <PrivateRoute path="/admin/room-chat">
                                    <RoomChatScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="building"
                            element={
                                <PrivateRoute path="/admin/building">
                                    <BuildingScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="service"
                            element={
                                <PrivateRoute path="/admin/service">
                                    <ServiceScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="map"
                            element={
                                <PrivateRoute path="/admin/map">
                                    <MapScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="auction"
                            element={
                                <PrivateRoute path="/admin/auction">
                                    <AuctionScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="maintenances"
                            element={
                                <PrivateRoute path="/admin/maintenances">
                                    <MaintenanceScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="customer"
                            element={
                                <PrivateRoute path="/admin/customer">
                                    <CustomerScreen />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="auction-history"
                            element={
                                <PrivateRoute path="/admin/auction-history">
                                    <AuctionHistoryScreen />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Content>
                <Affix offsetTop={0}>
                    <FooterComponent />
                </Affix>
            </Layout>
        </Layout>
    );
}

export default AdminRouter;