/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Routes, Route, useLocation, matchPath } from "react-router-dom";
import { Footer, Header } from "../component";
import HomeScreen from "../screens/client/HomeScreen";
import BuildClientScreen from "../screens/client/BuildClientScreen";
import RoomChatClientScreen from "../screens/client/RoomChatClientScreen";
import Filter from "../component/client/Filter";
import Banner from "../component/client/Banner";
import DauGiaClientScreen from "../screens/client/DauGiaClientScreen";
import SignUp from "../screens/user/auth/SignUp";
import SignIn from "../screens/user/auth/SignIn";
import ContactClientScreen from "../screens/client/ContactClientScreen";
import BuildingDetailScreen from "../screens/client/BuildingDetailScreen";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/authReducer";
import ChatBotComponent from "../component/ChatBot/ChatBotComponent";
import AuctionRoomClientScreen from "../screens/client/AuctionRoomClientScreen";
import video from '../assets/video/video.mp4';

const ClientRouter = () => {
    const location = useLocation();
    const auth = useSelector(authSelector);

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

    const routes = [
        {
            path: '/',
            element: <HomeScreen />,
            showFilter: false,
            showBanner: true,
            showHeader: true,
            showFooter: true
        },
        {
            path: '/buildings',
            element: <BuildClientScreen />,
            showFilter: true,
            showBanner: false,
            showHeader: true,
            showFooter: true
        },
        {
            path: '/buildings/:id',
            element: <BuildingDetailScreen />,
            showFilter: false,
            showBanner: false,
            showHeader: true,
            showFooter: true
        },
        {
            path: '/room-chat',
            element: <RoomChatClientScreen />,
            showFilter: false,
            showBanner: false,
            showHeader: true,
            showFooter: true
        },
        {
            path: '/dau-gia',
            element: <DauGiaClientScreen />,
            showFilter: false,
            showBanner: false,
            showHeader: true,
            showFooter: true
        },
        {
            path: '/auction-room',
            element: <AuctionRoomClientScreen />,
            showFilter: false,
            showBanner: false,
            showHeader: false,
            showFooter: false
        },
        {
            path: '/sign-up',
            element: <SignUp />,
            showFilter: false,
            showBanner: false,
            showHeader: true,
            showFooter: true
        },
        {
            path: '/sign-in',
            element: <SignIn />,
            showFilter: false,
            showBanner: false,
            showHeader: true,
            showFooter: true
        },
        {
            path: '/contact',
            element: <ContactClientScreen />,
            showFilter: false,
            showBanner: false,
            showHeader: true,
            showFooter: true
        },
    ];

    const currentRoute = routes.find(route =>
        matchPath({ path: route.path, end: true }, location.pathname)
    );

    useEffect(() => {
        if (currentRoute?.showHeader === false) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [currentRoute?.showHeader]);

    useEffect(() => {
        console.log('auth: ', auth);
    }, [auth]);

    return (
        <div>
            {/* background */}
            {currentRoute?.showHeader === false && (
                // <video
                //     autoPlay
                //     loop
                //     muted
                //     className="background-video"
                // >
                //     <source src={video} type="video/mp4" />
                // </video>
                <div></div>
            )}

            {(currentRoute?.showHeader || currentRoute?.showBanner || currentRoute?.showFilter) && (
                <div className="headerClient">
                    {currentRoute?.showHeader && <Header />}
                    {currentRoute?.showBanner && <Banner />}
                    {currentRoute?.showFilter && <Filter />}
                </div>
            )}

            <div className="contentClient">
                <Routes>
                    {routes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))}
                </Routes>
                {currentRoute?.showHeader && <ChatBotComponent />}
            </div>

            {currentRoute?.showFooter && (
                <div className="footerClient">
                    <Footer />
                </div>
            )}
        </div>
    );
};

export default ClientRouter;
