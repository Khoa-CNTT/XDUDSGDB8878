/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import Toast from "../../config/ToastConfig";
import handleAPI from "../../apis/handlAPI";
import handleAPINotToken from "../../apis/handleAPINotToken";
const CustomerScreen = () => {
    const [createCustomer, setCreateCustomer] = useState({});
    const [updateCustomer, setUpdateCustomer] = useState({});
    const [customer, setCustomer] = useState([]);
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

    const getData  = async (page) => {
        const url = `/api/customers?page=${page}&size=5`;
        try {
            const res = await handleAPI(url, {}, "get", auth?.token);
            if(res.status === 200) {
                setCustomer(res.data.data);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            Toast("erorr", error.message);
        }
    }

    const handleCreateCustomer  = async () => {
        const url = `/api/customers/register`;

        try {
            const res = await handleAPINotToken(url, createCustomer, "post", auth?.token);
            if(res.status === 200) {
                window.$("#themMoiModal").modal('hide');
                Toast("success", res.message);
                getData(pagination.current_page);
                setCreateCustomer({
                    first_name : "",
                    last_name : "",
                    user_name : "",
                    password : "",
                    status : "",
                    email : "",
                    phone_number : "",
                    avatar : "",
                    address : "",
                })
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const handleChangeStatusCustomer  = async (value, newStatus) => {
        const url = `/api/customers/${value.id}`;

        const newObject = {
            ...value,
            status : newStatus
        }

        try {
            const res = await handleAPI(url, newObject, "put", auth?.token);
            if(res.status === 200) {
                Toast("success", res.message);
                getData(pagination.current_page);
            }
        } catch (error) {
            Toast("erorr", error.message);
        }
    }

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="p-2 bd-highlight">Danh Sách Khách Hàng</div>
                        <div className="p-2 bd-highlight">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#themMoiModal">Thêm Mới</button>
                            <div className="modal fade" id="themMoiModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Thêm Mới Khách Hàng</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-3">
                                                    <label className="mb-2">First Name</label>
                                                    <input type="text" className="form-control"
                                                        value={createCustomer.first_name}
                                                        onChange={(e) => setCreateCustomer({
                                                            ...createCustomer,
                                                            first_name : e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <label className="mb-2">Last Name</label>
                                                    <input type="text" className="form-control"
                                                        value={createCustomer.last_name}
                                                        onChange={(e) => setCreateCustomer({
                                                            ...createCustomer,
                                                            last_name : e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <label className="mb-2">User Name</label>
                                                    <input type="text" className="form-control"
                                                        value={createCustomer.user_name}
                                                        onChange={(e) => setCreateCustomer({
                                                            ...createCustomer,
                                                            user_name : e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <label className="mb-2">Password</label>
                                                    <input type="text" className="form-control"
                                                        value={createCustomer.password}
                                                        onChange={(e) => setCreateCustomer({
                                                            ...createCustomer,
                                                            password : e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-4">
                                                    <label className="mb-2">Status</label>
                                                    <select className="form-control">
                                                        <option value="">Mời bạn chọn trạng thái</option>
                                                        <option value="1">Hoạt Động</option>
                                                        <option value="0">Bị Khóa</option>
                                                    </select>
                                                </div>
                                                <div className="col-4">
                                                    <label className="mb-2">Email</label>
                                                    <input type="text" className="form-control"
                                                        value={createCustomer.email}
                                                        onChange={(e) => setCreateCustomer({
                                                            ...createCustomer,
                                                            email : e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-4">
                                                    <label className="mb-2">Phone Number</label>
                                                    <input type="text" className="form-control"
                                                        value={createCustomer.phone_number}
                                                        onChange={(e) => setCreateCustomer({
                                                            ...createCustomer,
                                                            phone_number : e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-6">
                                                    <label className="mb-2">Avatar</label>
                                                    <input type="text" className="form-control"
                                                        value={createCustomer.avatar}
                                                        onChange={(e) => setCreateCustomer({
                                                            ...createCustomer,
                                                            avatar : e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <label className="mb-2">Address</label>
                                                    <input type="text" className="form-control"
                                                        value={createCustomer.address}
                                                        onChange={(e) => setCreateCustomer({
                                                            ...createCustomer,
                                                            address : e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button type="button" className="btn btn-primary" onClick={() => handleCreateCustomer()}>Xác Nhận</button>
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
                                    <th className="text-center align-middle">STT</th>
                                    <th className="text-center align-middle">First Name</th>
                                    <th className="text-center align-middle">Last Name</th>
                                    <th className="text-center align-middle">User Name</th>
                                    <th className="text-center align-middle">Email</th>
                                    <th className="text-center align-middle">Phone Number</th>
                                    <th className="text-center align-middle">Address</th>
                                    <th className="text-center align-middle">Avatar</th>
                                    <th className="text-center align-middle">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    customer?.map((value, key) => (
                                        <tr key={key}>
                                            <td className="text-center align-middle">{key + 1}</td>
                                            <td className="text-center align-middle">{value.first_name}</td>
                                            <td className="text-center align-middle">{value.last_name}</td>
                                            <td className="text-center align-middle">{value.user_name}</td>
                                            <td className="text-center align-middle">{value.email}</td>
                                            <td className="text-center align-middle">{value.phone_number}</td>
                                            <td className="text-center align-middle">{value.address}</td>
                                            <td className="text-center align-middle">
                                                <img src={value.avatar} alt="avatar" />
                                            </td>
                                            <td className="text-center align-middle">
                                                {
                                                    value.status === 1 ? (
                                                        <button type="button" className="btn btn-info" style={{width:"120px"}} 
                                                            onClick={()  => handleChangeStatusCustomer(value, 0)}
                                                        >
                                                            Hoạt Động
                                                        </button>
                                                    ): (
                                                        <button type="button" className="btn btn-danger" style={{width:"120px"}} 
                                                            onClick={()  => handleChangeStatusCustomer(value, 1)}
                                                        >
                                                            Bị Khóa
                                                        </button>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
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

export default CustomerScreen;