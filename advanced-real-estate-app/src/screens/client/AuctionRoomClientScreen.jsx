import React, { useEffect } from "react";
import DauGiaComponent from "../../component/daugia/DauGiaComponent";
import { useDispatch, useSelector } from "react-redux";
import { auctionSelector } from "../../redux/reducers/auctionReducer";
import { useNavigate } from "react-router-dom";

const AuctionRoomClientScreen = () => {
  const auctionReducer = useSelector(auctionSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auctionReducer?.lastAction === "") {
      navigate("/dau-gia");
    }
  }, [auctionReducer?.lastAction, navigate, dispatch]);

  return (
    <div
      style={{
        paddingTop: "100px",
      }}
    >
      <DauGiaComponent />
    </div>
  );
};

export default AuctionRoomClientScreen;
