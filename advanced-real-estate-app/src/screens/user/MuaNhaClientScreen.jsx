import React, {useEffect} from 'react';
import {appInfo} from "../../constants/appInfos";
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import {useNavigate} from "react-router-dom";
import {buildingSelector, removeBuildingDetails} from "../../redux/reducers/buildingReducer";
import {appVariables} from "../../constants/appVariables";
import styles from '../../assets/css/building.module.css'

const MuaNhaClientScreen = () => {

    const auth = useSelector(authSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const buildingReducer = useSelector(buildingSelector);

    const deleteById = (buildingId)=>{
        dispatch(removeBuildingDetails(buildingId));
    }

    return (
        <div style={
            {
                paddingTop: "150px"
            }
        }>
            <div className="container-xxl py-5">
                <div className="container">
                    <div
                        className="text-center wow fadeInUp"
                        data-wow-delay="0.1s"
                        style={{
                            visibility: "visible",
                            animationDelay: "0.1s",
                            animationName: "fadeInUp"
                        }}
                    >
                        <h6 className="section-title text-center text-primary text-uppercase">
                            {appInfo.title}
                        </h6>
                        <h1 className="mb-5">
                            HỢP ĐỒNG <span className="text-primary text-uppercase">MUA BÁN NHÀ</span>
                        </h1>
                    </div>
                    <div className="row g-5">
                        <div className="col-lg-12">
                            <div
                                className="wow fadeInUp"
                                data-wow-delay="0.2s"
                                style={{
                                    visibility: "visible",
                                    animationDelay: "0.2s",
                                    animationName: "fadeInUp"
                                }}
                            >
                                {buildingReducer?.listBuildingDetail?.length > 0 && (
                                        <div className={styles.contractContainer}>
                                            <h2>HỢP ĐỒNG</h2>
                                            <div className={styles.contractDetails}>
                                                {buildingReducer?.listBuildingDetail?.map((building, index) => (
                                                    <div key={index} className={styles.buildingContract}>
                                                        <h3>Thông Tin Nhà:</h3>
                                                        <p><strong>Tên nhà:</strong> {building?.name}</p>
                                                        <p><strong>Loại nhà:</strong> {building?.type}</p>
                                                        <p><strong>Kết cấu:</strong> {building?.structure}</p>
                                                        <p><strong>Diện tích:</strong> {building?.area}</p>
                                                        <p><strong>Giá:</strong> {appVariables.formatMoney(building?.price)}
                                                        </p>
                                                        <button className={styles.deleteButton}
                                                            onClick={() => deleteById(building?.id)}>
                                                            Xóa
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MuaNhaClientScreen;