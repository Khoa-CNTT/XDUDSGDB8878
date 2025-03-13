import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appInfo } from "../../constants/appInfos";
import DauGiaComponent from "../../component/daugia/DauGiaComponent";
import RoomAuctionComponent from "../../component/daugia/RoomAuctionComponent";
import { useDispatch, useSelector } from "react-redux";
import { auctionSelector } from "../../redux/reducers/auctionReducer";

const DauGiaClientScreen = () => {
  const auctionReducer = useSelector(auctionSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auctionReducer?.lastAction === "joinAuctionRoomCompleted") {
      navigate("/user/auction-room");
    }
  }, [auctionReducer?.lastAction, navigate, dispatch]);

  return (
    <div
      style={{
        paddingTop: "150px",
      }}
    >
      <div className="container-xxl">
        <div className="container">
          <div
            className="text-center wow fadeInUp"
            data-wow-delay="0.1s"
            style={{
              visibility: "visible",
              animationDelay: "0.1s",
              animationName: "fadeInUp",
            }}
          >
            {/*<h6 className="section-title text-center text-primary text-uppercase">*/}
            {/*    {appInfo.title}*/}
            {/*</h6>*/}
            {/*<h1 className="mb-5">*/}
            {/*    ĐẤU <span className="text-primary text-uppercase">GIÁ</span>*/}
            {/*</h1>*/}
          </div>
          <div className="row g-5">
            <div className="col-lg-12">
              <div
                className="wow fadeInUp"
                data-wow-delay="0.2s"
                style={{
                  visibility: "visible",
                  animationDelay: "0.2s",
                  animationName: "fadeInUp",
                }}
              >
                <RoomAuctionComponent pageSize={4} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DauGiaClientScreen;
