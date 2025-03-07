import React, {useEffect, useState} from 'react';
import AuctionCreateModal from "../../component/daugia/AuctionCreateModal";
import AuctionAdminDetailModal from "../../component/daugia/AuctionAdminDetailModal";
import {appVariables} from "../../constants/appVariables";
import {Button, message} from "antd";
import {collectionUtil, f_collectionUtil} from "../../utils/f_collectionUtil";
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../../redux/reducers/authReducer";
import {useNavigate} from "react-router-dom";
import handleAPI from "../../apis/handlAPI";
import {appInfo} from "../../constants/appInfos";

const AuctionContractScreen = () => {
      const auth = useSelector(authSelector);
      const dispatch = useDispatch();
      const navigate = useNavigate();

      return (
      <div>
            <div className="card">
                  <div className="d-flex align-items-center justify-content-between">
                  <div className="p-2 bd-highlight">
                        <span>Danh Sách hợp đồng đấu giá</span>
                  </div>
                  <div className="p-2 bd-highlight">
                        <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#AuctionCreateModal"
                        >
                              Thêm Mới
                        </button>
                  </div>
                  </div>
                  <div className="card-body">
                  <div className="table-responsive">
                        <table className="table table-bordered">
                              <thead>
                              <tr>
                              <th className="align-middle text-center">ID</th>
                              <th colSpan={"3"}>Action</th>
                              </tr>
                              </thead>
                              <tbody>
                              {
                                    [{id: "sdasdas"}].map((item, index) => (
                                          <tr key={index}>
                                          <td>
                                                {item?.id}
                                          </td>
                                          <td>
                                                <Button className={'btn btn-danger'}
                                                      onClick={() => {
                                                            // deleteById(item?.id).then()
                                                      }}>
                                                      Xóa
                                                </Button>
                                          </td>
                                          </tr>
                                    ))
                              }
                              </tbody>
                        </table>
                  </div>
                  </div>
            </div>
      </div>
      );
};

export default AuctionContractScreen;