/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {appVariables} from "../constants/appVariables";
import {useDispatch, useSelector} from "react-redux";
import {authSelector, removeAuth} from "../redux/reducers/authReducer";
import {Footer, Header} from "../component";
import Banner from "../component/client/Banner";
import Filter from "../component/client/Filter";
import styles from "../assets/css/content-client.module.css";
import HomeScreen from "../screens/client/HomeScreen";
import BuildClientScreen from "../screens/client/BuildClientScreen";
import RoomChatClientScreen from "../screens/client/RoomChatClientScreen";
import DauGiaClientScreen from "../screens/client/DauGiaClientScreen";
import MuaNhaClientScreen from "../screens/user/MuaNhaClientScreen";
import SignUp from "../screens/user/auth/SignUp";
import SignIn from "../screens/user/auth/SignIn";
import ContactClientScreen from "../screens/client/ContactClientScreen";
import InfoUserScreen from "../screens/user/InfoUserScreen";
import {jwtDecode} from "jwt-decode";
import {message} from "antd";
import {fetchUser} from "../apis/api";

const UserRouter = () => {
    const location = useLocation();
    const listPathHidenBanner = appVariables.listPathHidenBanner;
    const listPathHidenFilter = appVariables.listPathHidenFilter;
    const listPathNoContentClass = appVariables.listPathNoContentClass;
    const auth = useSelector(authSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addCssLink = (href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    };

    const addInitialCssLinks = () => {
        addCssLink(`${process.env.PUBLIC_URL}/lib/animate/animate.min.css`);
        addCssLink(`${process.env.PUBLIC_URL}/lib/owlcarousel/assets/owl.carousel.min.css`);
        addCssLink(`${process.env.PUBLIC_URL}/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css`);
        addCssLink(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
        addCssLink(`${process.env.PUBLIC_URL}/css/bootstrap.min.css`);
        addCssLink(`${process.env.PUBLIC_URL}/css/style.css`);
    };

    addInitialCssLinks();

    useEffect(() => {
        if(auth?.token){
            fetchUser("/api/users/my-info", {}, "get",
                auth?.token,
                dispatch,
                message
            ).then();
        }
    }, [auth?.token]);

    useEffect(() => {
        const token = auth?.token;
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                navigate("/sign-in");
                dispatch(removeAuth());
            }
        } catch (error) {
            dispatch(removeAuth());
        }
    }, [dispatch]);

    useEffect(() => {
        if (!auth.token){
            message.error("VUI LÒNG ĐĂNG NHẬP VÀO!");
        }
    }, []);

    if (!auth.token){
        dispatch(removeAuth());
        navigate("/sign-in");
    }

    return (
        <div>
            <div className={"headerClient"}>
                <Header />
            </div>
            <div>
                <Routes>
                    {/*USER ROUTE*/}
                    <Route path="/info" element={<InfoUserScreen />} />
                    <Route path="/hop-dong" element={<MuaNhaClientScreen />} />
                </Routes>
            </div>
            <div className={"footerClient"}>
                <Footer />
            </div>
        </div>
    );
};

export default UserRouter;