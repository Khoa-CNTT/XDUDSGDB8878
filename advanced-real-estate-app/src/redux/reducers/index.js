import { combineReducers } from "redux";
import authReducer from "./authReducer";
import chatReducer from "./chatReducer";
import buildingReducer from "./buildingReducer";
import auctionSelector from "./auctionReducer"; // Import authReducer

const rootReducers = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    building: buildingReducer,
    auction: auctionSelector,
});

export default rootReducers;