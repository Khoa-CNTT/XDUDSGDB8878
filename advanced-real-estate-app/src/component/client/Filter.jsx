import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    buildingSelector, removePrice, removeSelectedArea, removeSelectedStructure, removeSelectedType, setPrice,
    setSelectedArea,
    setSelectedStructure,
    setSelectedType
} from "../../redux/reducers/buildingReducer";
import {appVariables} from "../../constants/appVariables";

const Filter = () => {

    const dispatch = useDispatch();
    const buildingReducer = useSelector(buildingSelector);
    const buildings = buildingReducer?.buildings;
    const [formattedPrice, setFormattedPrice] = useState("");

    const handleInputPriceChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        dispatch(setPrice(value));
        if (value === "") {
            setFormattedPrice("0đ");
        } else {
            const formatted = appVariables.formatMoney(value);
            setFormattedPrice(formatted);
        }
    };

    useEffect(() => {
        return()=>{
            //set data trong redux về như ban đầu
            dispatch(removeSelectedType());
            dispatch(removeSelectedArea());
            dispatch(removeSelectedStructure());
            dispatch(removePrice());
        }
    }, []);

    return (
        <div
            className="container-fluid booking pb-5 wow fadeIn"
            data-wow-delay="0.1s"
            style={{
                visibility: "visible",
                animationDelay: "0.1s",
                animationName: "fadeIn"
            }}
        >
            <div className="container">
                <div className="bg-white shadow" style={{
                    padding: 35,
                    marginTop: "120px"
                }}
                >
                    <div className="row g-2 text-center justify-content-center">
                        <div className="col-md-10">
                            <div className="row g-4 d-flex justify-content-center">
                                <h2 className="mb-4">NHẬP VÀO TÌM KIẾM</h2>

                                <div className="col-md-4">
                                    <b>Loại nhà</b>
                                    <select name="type"
                                            className="form-select text-center"
                                            value={buildingReducer?.selectedType}
                                            onChange={(e) => dispatch(setSelectedType(e.target.value))}
                                    >
                                        <option value="">Hiện tất cả</option>
                                        <option value="nhà bán">nhà bán</option>
                                        <option value="nhà cho thuê">nhà cho thuê</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <b>Diện tích</b>
                                    <select className="form-select text-center"
                                            value={buildingReducer?.selectedArea}
                                            onChange={(e) => dispatch(setSelectedArea(e.target.value))}
                                    >
                                        <option value="">Hiện tất cả</option>
                                        {buildings.map((building, index) => (
                                            <option key={index} value={building?.area}>
                                                {building?.area}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <b>Kiến trúc</b>
                                    <select className="form-select text-center"
                                            value={buildingReducer?.selectedStructure}
                                            onChange={(e) => dispatch(setSelectedStructure(e.target.value))}
                                    >
                                        <option value="">Hiện tất cả</option>
                                        {buildings.map((building, index) => (
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;