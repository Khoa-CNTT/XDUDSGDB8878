import React, { useEffect, useState } from "react";
import {
  buildingSelector,
  removePrice,
  removeSelectedArea,
  removeSelectedStructure,
  removeSelectedType,
  setFormattedPrice,
  setPrice,
  setSelectedArea,
  setSelectedStructure,
  setSelectedType,
} from "../../redux/reducers/buildingReducer";
import { useDispatch, useSelector } from "react-redux";

const BuildingModal = () => {
  const buildingReducer = useSelector(buildingSelector);
  const dispatch = useDispatch();
  const [formattedPrice, setFormattedPrice] = useState("");

  useEffect(() => {
    return () => {
      dispatch(removeSelectedType());
      dispatch(removeSelectedArea());
      dispatch(removeSelectedStructure());
      dispatch(removePrice());
    };
  }, []);
  const handleInputPriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    dispatch(setPrice(value));
    if (value === "") {
      setFormattedPrice("0đ");
    } else {
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      }).format(value);
      setFormattedPrice(formatted);
    }
  };

  return (
    <div>
      <div
        className="modal fade"
        id="RemoveModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <i
                className="fa fa-filter text-primary"
                id="exampleModalLabel"
              ></i>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <b>Loại nhà</b>
                <select
                  name="type"
                  className="form-select text-center"
                  value={buildingReducer?.selectedType}
                  onChange={(e) => dispatch(setSelectedType(e.target.value))}
                >
                  <option value="">Hiện tất cả</option>
                  <option value="nhà bán">nhà bán</option>
                  <option value="nhà cho thuê">nhà cho thuê</option>
                </select>
              </div>
              <div className="col-md-12">
                <b>Diện tích</b>
                <select
                  className="form-select text-center"
                  value={buildingReducer?.selectedArea}
                  onChange={(e) => dispatch(setSelectedArea(e.target.value))}
                >
                  <option value="">Hiện tất cả</option>
                  {buildingReducer?.buildings.map((building, index) => (
                    <option key={index} value={building?.area}>
                      {building?.area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12">
                <b>Kiến trúc</b>
                <select
                  className="form-select text-center"
                  value={buildingReducer?.selectedStructure}
                  onChange={(e) =>
                    dispatch(setSelectedStructure(e.target.value))
                  }
                >
                  <option value="">Hiện tất cả</option>
                  {buildingReducer?.buildings.map((building, index) => (
                    <option key={index} value={building?.structure}>
                      {building?.structure}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12">
                <b>mức giá</b>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control text-center"
                    id="price"
                    placeholder="mức giá"
                    value={formattedPrice}
                    onChange={handleInputPriceChange}
                  />
                  <label htmlFor="price">Nhập vào mức giá</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingModal;
