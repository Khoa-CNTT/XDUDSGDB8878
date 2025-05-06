import React, { useEffect, useState } from "react";
import {
  buildingSelector,
  removePrice,
  removeSelectedArea,
  removeSelectedStructure,
  removeSelectedType,
  setSelectedArea,
  setSelectedStructure,
  setSelectedType,
  filterBuildingsByPrice,
} from "../../redux/reducers/buildingReducer";
import { useDispatch, useSelector } from "react-redux";

const BuildingModal = () => {
  const dispatch = useDispatch();
  const buildingReducer = useSelector(buildingSelector);
  const buildings = buildingReducer?.buildings;
  const [price, setBuildingPrice] = useState("");
  const uniqueTypeNames = Array.from(
    new Set(
      buildings
        .map((b) => b?.typeBuilding?.type_name?.toLowerCase())
        .filter((name) => name && !name.startsWith("nhà đấu giá"))
    )
  );
  const uniqueStructures = Array.from(
    new Set(
      buildings
        .map((b) => b?.structure?.toLowerCase())
        .filter((structure) => structure)
    )
  );
  const uniqueAreas = Array.from(
    new Set(
      buildings
        .map((b) => b?.area?.toString().toLowerCase())
        .filter((area) => area)
    )
  );

  const handleInputPriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(rawValue)) return;
    const formattedValue = Number(rawValue).toLocaleString("en-US");
    setBuildingPrice(formattedValue);
    const inputPrice = Number(rawValue);
    dispatch(filterBuildingsByPrice(inputPrice));
  };

  useEffect(() => {
    return () => {
      dispatch(removeSelectedType());
      dispatch(removeSelectedArea());
      dispatch(removeSelectedStructure());
      dispatch(removePrice());
    };
  }, []);

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
                  {uniqueTypeNames.map((typeName, index) => (
                    <option key={index} value={typeName}>
                      {typeName}
                    </option>
                  ))}
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
                  {uniqueAreas.map((area, index) => (
                    <option key={index} value={area}>
                      {`${area} m²`}
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
                  {uniqueStructures.map((structure, index) => (
                    <option key={index} value={structure}>
                      {structure}
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
                    value={price}
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
