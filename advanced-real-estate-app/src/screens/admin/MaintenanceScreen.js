/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import Toast from "../../config/ToastConfig";
import handleAPI from "./../../apis/handlAPI";
import moment from "moment";
import { Checkbox } from "antd";
import { Bag } from "iconsax-react";
const MaintenanceScreen = () => {
    const [createMaintenance, setCreateMaintenance] = useState({});
    const [updateMaintenance, setUpdateMaintenance] = useState({});
    const [maintenance, setMaintenance] = useState([]);
    const [building, setBuilding] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [listCheckBox, setListCheckBox] = useState([]);
    const auth = useSelector(authSelector);

    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 2,
        from: 1,
        to: 0,
        current_page: 1,
        last_page: 1,
    });

    const [offset] = useState(4);

    // Load dữ liệu ban đầu khi component được mount
    useEffect(() => {
        getData(pagination.current_page);
        getDataBuilding();
        getDataCustomer();
    }, [pagination.current_page]);


    // Hàm để thay đổi trang
    const changePage = (page) => {
        setPagination((prev) => ({
            ...prev,
            current_page: page
        }));

        getData(page);
    };

    const isActived = useMemo(() => {
        return pagination.current_page;
    }, [pagination]);

    const pagesNumber = useMemo(() => {
        if (!pagination.to) {
            return [];
        }
        let from = pagination.current_page - offset;
        if (from < 1) {
            from = 1;
        }
        let to = from + offset * 2;
        if (to >= pagination.last_page) {
            to = pagination.last_page;
        }
        const pagesArray = [];
        while (from <= to) {
            pagesArray.push(from);
            from++;
        }
        return pagesArray;
    }, [pagination, offset]);

    const formatDateVN = (date) => {
        return moment(date, "DD-MM-YYYY").format("DD/MM/YYYY");
    };

    const formatVietnamCurrency = (amount) => {
        // Đảm bảo số tiền là kiểu số
        if (typeof amount !== 'number') {
            amount = parseFloat(amount);
        }
        // Sử dụng Intl.NumberFormat để định dạng theo chuẩn Việt Nam
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(amount)
            .replace('₫', 'VND'); // Thay ký hiệu ₫ bằng VND nếu cần
    }
    
    const getData = async (page) => {
        const url = `/api/maintenance?page=${page}&size=5`;
        try {
            try {
                const res =  await handleAPI(url, {}, "get", auth?.token);
                setMaintenance(res.data.data)
                setPagination(res.data.pagination);
            } catch (error) {
                Toast("error", error.message)
            }
        } catch (error) {
            Toast("error", error.message)
        }
    }

    const getDataBuilding = async () => {
        const url = `/api/admin/buildings`;
        try {
            const res =  await handleAPI(url, {}, "get", auth?.token);
            setBuilding(res.data.data)
        } catch (error) {
            Toast("error", error.message)
        }
    }

    const getDataCustomer = async () => {
        const url = `/api/customer`;
        try {
            const res =  await handleAPI(url, {}, "get", auth?.token);
            setCustomer(res.data.data)
        } catch (error) {
            Toast("error", error.message)
        }
    }

    const createMaintenances = async () => {
        console.log(createMaintenance);
        const convertObejct = {
            cost        : createMaintenance.cost,
            description : createMaintenance.description,
            buildingId  : createMaintenance.id_building,
            customerId  : createMaintenance.id_customer,
            maintenance_date : createMaintenance.maintenance_date
        };
        
        const url = `/api/maintenance`;
        try {
            const res = await handleAPI(url, convertObejct, "post", auth?.token);
            if(res.status === 200) {
                Toast("success", res.message)
                window.$("#themMoiModal").modal("hide");
                getData(pagination.current_page);
                setCreateMaintenance({
                    cost        : 0,
                    description : "",
                    id_building  : "",
                    id_customer  : "",
                    maintenance_date : ""
                });
            }
        } catch (error) {
            Toast("error", error.message)
        }
    }

    const updateMaintenances = async () => {
        const convertObejct = {
            cost        : updateMaintenance.cost,
            description : updateMaintenance.description,
            buildingId  : updateMaintenance.buildingId,
            customerId  : updateMaintenance.customerId,
            maintenance_date : updateMaintenance.maintenance_date
        };
        console.log(convertObejct);

        const url = `/api/maintenance/${updateMaintenance.id}`;
        try {
            const res = await handleAPI(url, convertObejct, "put", auth?.token);
            if(res.status === 200) {
                Toast("success", res.message)
                window.$("#editModal").modal("hide");
                getData(pagination.current_page);
            }
        } catch (error) {
            Toast("error", error.message)
        }
    }

    const deleteMaintenances = async () => {
        const url = `/api/maintenance/delete-all`;
        const object = {
            ids : listCheckBox
        }
        try {
            const res = await handleAPI(url, object, "delete", auth?.token)
            console.log(res.status);
            
            if(res.status === 200) {
                Toast("success", res.message);
                getData(pagination.current_page);
                setListCheckBox([]);
                window.$('#deleteModal').modal('hide');
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    return(
        <>
            <div className="card">
                <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="p-2 bd-highlight">
                            Danh Sách Bảo Trì
                        </div>
                        <div className="p-2 bd-highlight">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#themMoiModal">
                                Thêm Mới
                            </button>
                            <div className="modal fade" id="themMoiModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Thêm Mới Bảo Trì</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-6">
                                                    <label className="mb-2">Tòa Nhà</label>
                                                    <select className="form-control"
                                                        value={createMaintenance.id_building}
                                                        onChange={(e) => setCreateMaintenance({
                                                            ...createMaintenance,
                                                            id_building : e.target.value
                                                        })}
                                                    >
                                                        <option value="">Mời chọn tòa nhà</option>
                                                        {
                                                            building?.map((value, key) => (
                                                                <option key={key} value={value.id}>{value.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-6">
                                                    <label className="mb-2">Khách Hàng</label>
                                                    <select className="form-control"
                                                        value={createMaintenance.id_customer}
                                                        onChange={(e) => setCreateMaintenance({
                                                            ...createMaintenance,
                                                            id_customer : e.target.value
                                                        })}
                                                    >
                                                        <option value="">Mời chọn khách hàng</option>
                                                        {
                                                            customer?.map((value, key) => (
                                                                <option key={key} value={value.id}>{value.first_name} {value.last_name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-6">
                                                    <label className="mb-2">Ngày Bảo Trì</label>
                                                    <input className="form-control" type="date"
                                                        value={createMaintenance.maintenance_date}
                                                        onChange={(e) => setCreateMaintenance({
                                                            ...createMaintenance,
                                                            maintenance_date : e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <label className="mb-2">Chi Phí</label>
                                                    <input className="form-control" type="number"
                                                        value={createMaintenance.cost}
                                                        onChange={(e) => setCreateMaintenance({
                                                            ...createMaintenance,
                                                            cost : e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12">
                                                    <label className="mb-2">Mô Tả</label>
                                                    <textarea rows="6" className="form-control"
                                                        value={createMaintenance.description}
                                                        onChange={(e) => setCreateMaintenance({
                                                            ...createMaintenance,
                                                            description : e.target.value
                                                        })}
                                                    > 
                                                    </textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button type="button" className="btn btn-primary" onClick={() => createMaintenances()}>Xác Nhận</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th className="align-middle text-center" style={{ width: "60px", height:"42px"}}>
                                        {
                                            listCheckBox.length > 0 ?
                                            <>
                                                <span type="button" className="text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                    <Bag/>
                                                </span>
                                                <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Xóa Lịch Bảo Trì</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body ">
                                                                <span>Bạn có chắc chắn muốn xóa <span className="text-danger">{listCheckBox.length}</span> bảo Trì nhà này không?</span>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                                <button type="button" class="btn btn-primary" onClick={() => deleteMaintenances()}>Xác Nhận</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> : 
                                            <>
                                            </>
                                        }
                                    </th>
                                    <th className="text-center align-middle">Tòa Nhà</th>
                                    <th className="text-center align-middle">Khách Hàng</th>
                                    <th className="text-center align-middle">Mô Tả</th>
                                    <th className="text-center align-middle">Ngày Bảo Trì</th>
                                    <th className="text-center align-middle">Chi Phí</th>
                                    <th className="text-center align-middle">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    maintenance.map((value, key) => (
                                        <tr key={key} className={listCheckBox.includes(value.id) ? "table-secondary" : ""}>
                                            <td className="text-center align-middle" style={{ width: "60px" }}>
                                                <Checkbox 
                                                    checked={listCheckBox.includes(value.id)}
                                                    onChange={() => {
                                                        setListCheckBox((prev) => {
                                                            if (prev.includes(value.id)) {
                                                                // Nếu đã có trong danh sách, loại bỏ nó
                                                                return prev.filter((id) => id !== value.id);
                                                            } else {
                                                                // Nếu chưa có trong danh sách, thêm vào
                                                                return [...prev, value.id];
                                                            }
                                                        });
                                                    }}
                                                />
                                            </td>
                                            <td className="align-middle">{value.building_name}</td>
                                            <td className="align-middle">{value.full_name}</td>
                                            <td className="text-center align-middle">{value.description}</td>
                                            <td className="text-center align-middle">{formatDateVN(value.maintenance_date)}</td>
                                            <td className="text-end align-middle">{formatVietnamCurrency(value.cost)}</td>
                                            <td className="text-center align-middle">
                                                <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#editModal"
                                                    onClick={() => setUpdateMaintenance(value)}
                                                >
                                                    Cập Nhật
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Cập Nhật</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div className="row">
                                            <div className="col-6">
                                                <label className="mb-2">Tòa Nhà</label>
                                                <select className="form-control"
                                                    value={updateMaintenance.buildingId}
                                                    onChange={(e) => setUpdateMaintenance({
                                                        ...updateMaintenance,
                                                        buildingId : e.target.value
                                                    })}
                                                >
                                                    <option value="">Mời chọn tòa nhà</option>
                                                    {
                                                        building?.map((value, key) => (
                                                            <option key={key} value={value.id}>{value.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <label className="mb-2">Khách Hàng</label>
                                                <select className="form-control"
                                                    value={updateMaintenance.customerId}
                                                    onChange={(e) => setUpdateMaintenance({
                                                        ...updateMaintenance,
                                                        customerId : e.target.value
                                                    })}
                                                >
                                                    <option value="">Mời chọn khách hàng</option>
                                                    {
                                                        customer?.map((value, key) => (
                                                            <option key={key} value={value.id}>{value.first_name} {value.last_name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-6">
                                                <label className="mb-2">Ngày Bảo Trì</label>
                                                <input className="form-control" type="date"
                                                    value={updateMaintenance.maintenance_date}
                                                    onChange={(e) => setUpdateMaintenance({
                                                        ...updateMaintenance,
                                                        maintenance_date : e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="mb-2">Chi Phí</label>
                                                <input className="form-control" type="number"
                                                    value={updateMaintenance.cost}
                                                    onChange={(e) => setUpdateMaintenance({
                                                        ...updateMaintenance,
                                                        cost : e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-12">
                                                <label className="mb-2">Mô Tả</label>
                                                <textarea rows="6" className="form-control"
                                                    value={updateMaintenance.description}
                                                    onChange={(e) => setUpdateMaintenance({
                                                        ...updateMaintenance,
                                                        description : e.target.value
                                                    })}
                                                > 
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary" onClick={() => updateMaintenances()}>Xác Nhận</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav className="m-b-30" aria-label="Page navigation example">
                        <ul className="pagination justify-content-end pagination-primary">
                            {pagination.current_page > 1 && (
                                <li className="page-item">
                                    <a
                                        className="page-link"
                                        href="#"
                                        aria-label="Previous"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            changePage(pagination.current_page - 1);
                                        }}
                                    >
                                        <span aria-hidden="true">Pre</span>
                                    </a>
                                </li>
                            )}

                            {pagesNumber.map((page) => (
                                <li
                                    key={page}
                                    className={`page-item ${page === isActived ? 'active' : ''}`}
                                >
                                    <a
                                        className="page-link"
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            changePage(page);
                                        }}
                                    >
                                        {page}
                                    </a>
                                </li>
                            ))}

                            {pagination.current_page < pagination.last_page && (
                                <li className="page-item">
                                    <a
                                        href="#"
                                        className="page-link"
                                        aria-label="Next"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            changePage(pagination.current_page + 1);
                                        }}
                                    >
                                        <span aria-hidden="true">Next</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default MaintenanceScreen;