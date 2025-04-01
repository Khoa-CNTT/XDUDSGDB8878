import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  isLoading: false,
  buildings: [],
  listBuildingDetail: [],
  isError: false,
  selectedType: "",
  selectedArea: "",
  selectedStructure: "",
  inputPrice: 0,
  formattedPrice: "",
  building: null,
};

const buildingSlice = createSlice({
  name: "building",
  initialState,
  reducers: {
    success: (state, action) => {
      state.isLoading = true;
      state.buildings = action.payload;
      state.isError = false;
    },
    failed: (state, action) => {
      state.isLoading = false;
      state.buildings = [];
      state.isError = true;
    },
    setBuilding: (state, action) => {
      state.building = action.payload;
    },
    removeBuilding: (state, action) => {
      state.building = null;
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setSelectedArea: (state, action) => {
      state.selectedArea = action.payload;
    },
    setSelectedStructure: (state, action) => {
      state.selectedStructure = action.payload;
    },
    setPrice: (state, action) => {
      state.inputPrice = action.payload;
    },
    addBuildingDetails: (state, action) => {
      if (state.listBuildingDetail.length === 0) {
        state.listBuildingDetail.push(action.payload);
        message.success("Thêm nhà vào hợp đồng thành công!");
        return;
      }
      const exists = state.listBuildingDetail.some(
        (building) => building.id === action.payload.id
      );
      if (exists) {
        message.error("Bạn đã thêm nhà này vào hợp đồng!");
        return;
      }
      state.listBuildingDetail.push(action.payload);
      message.success("Thêm nhà vào hợp đồng thành công!");
    },
    setFormattedPrice: (state, action) => {
      state.inputPrice = action.payload;
    },
    removeBuildingDetails: (state, action) => {
      state.listBuildingDetail = state.listBuildingDetail.filter(
        (building) => building.id !== action.payload
      );
    },
    removeSelectedType: (state, action) => {
      state.selectedType = "";
    },
    removeSelectedArea: (state, action) => {
      state.selectedArea = "";
    },
    removeSelectedStructure: (state, action) => {
      state.selectedStructure = "";
    },
    removePrice: (state, action) => {
      state.inputPrice = 0;
    },
    removeFormattedPrice: (state, action) => {
      state.formattedPrice = "";
    },
  },
});

export const {
  success,
  failed,
  setBuilding,
  removeBuilding,
  setSelectedType,
  setSelectedArea,
  setSelectedStructure,
  setPrice,
  addBuildingDetails,
  setFormattedPrice,
  removeSelectedType,
  removeSelectedArea,
  removeSelectedStructure,
  removePrice,
  removeBuildingDetails,
  removeFormattedPrice,
} = buildingSlice.actions;
export default buildingSlice.reducer;
export const buildingSelector = (state) => state.building;
