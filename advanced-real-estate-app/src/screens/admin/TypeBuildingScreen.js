/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from 'react';
import Toast from "../../config/ToastConfig";
import handleAPI from '../../apis/handlAPI';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import { Bag, Setting2 } from 'iconsax-react';
import { Button, Checkbox, Dropdown, Space } from 'antd';
const TypeBuildingScreen = () => {
    const [createTypeBuilding, setCreateTypeBuilding] = useState({});
    const [typeBuilding, setTypeBuilding] = useState([]);
    const [listCheckBox, setListCheckBox] = useState([]);
    const [updateTypeBuilding, setUpdateTypeBuilding] = useState({});
    const auth = useSelector(authSelector);
    const getData = async (page) => {
        const url = `/api/type-building?page=${page}&size=5`;
        try {
            const data = await handleAPI(url, {}, "get", auth?.token);
            setTypeBuilding(data.data.data);
            setPagination(data.data.pagination);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

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

    const handleCreate = async () => {
        const url = `/api/type-building`;

        try {
            const res = await handleAPI(url, createTypeBuilding, "post", auth?.token)
            console.log(res.status);
            
            if(res.status === 200) {
                Toast("success", res.message);
                getData(pagination.current_page);
                window.$('#themMoiModal').modal('hide');
                setCreateTypeBuilding({
                    name : "",
                    status : ""
                });
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const handleChangeStatusAdmin = async (value, newStatus) => {
        const url = `/api/type-building/${value.id}`;
        const updatedNew = { ...value, status: newStatus };
        try {
            const res = await handleAPI(url, updatedNew, "put", auth?.token)
            console.log(res.status);
            
            if(res.status === 200) {
                Toast("success", res.message);
                getData(pagination.current_page);
                setUpdateTypeBuilding({
                    name : "",
                    status : ""
                });
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const handleUpdateTypeBuilding = async () => {
        const url = `/api/type-building/${updateTypeBuilding.id}`;

        try {
            const res = await handleAPI(url, updateTypeBuilding, "put", auth?.token)
            console.log(res.status);
            
            if(res.status === 200) {
                Toast("success", res.message);
                getData(pagination.current_page);
                window.$('#EditModal').modal('hide');
                setUpdateTypeBuilding({
                    name : "",
                    status : ""
                });
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const handlDeleteTypeBuilding = async () => {
        console.log(listCheckBox);
        
        if(listCheckBox.length === 1) {
            const url = `/api/type-building/${listCheckBox}`;
            try {
                const res = await handleAPI(url, {}, "delete", auth?.token)
                console.log(res.status);
                
                if(res.status === 200) {
                    Toast("success", res.message);
                    getData(pagination.current_page);
                    setListCheckBox((prev) => prev.filter((id) => id !== listCheckBox[0]));
                    window.$('#deleteModal').modal('hide');
                }
            } catch (error) {
                Toast("error", error.message);
            }
        } else {
            const url = `/api/type-building/delete-all`;
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
    }

    return (
        <>
            <div className='card'>
                <div className='card-header'>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="p-2 bd-highlight">
                            <span>Danh Sách Kiểu Tòa Nhà</span>
                        </div>
                        <div className="p-2 bd-highlight">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#themMoiModal"
                            >
                               Thêm Mới
                            </button>
                            <div className="modal fade" id="themMoiModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Thêm Mới Kiểu Tòa Nhà</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <lable className='form-lable'>Tên Kiểu Tòa Nhà</lable>
                                                    <input className='form-control mt-2' type='text'
                                                        value={createTypeBuilding.type_name}
                                                        onChange={
                                                            (e) => setCreateTypeBuilding({
                                                                ...createTypeBuilding,
                                                                type_name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className='col'>
                                                    <lable className='form-lable'>Giá Tiền</lable>
                                                    <input className='form-control mt-2' type='number'
                                                        value={createTypeBuilding.price}
                                                        onChange={
                                                            (e) => setCreateTypeBuilding({
                                                                ...createTypeBuilding,
                                                                price: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className='col'>
                                                    <lable className='form-lable'>Trạng Thái</lable>
                                                    <select className='form-control mt-2'
                                                        value={createTypeBuilding.status}
                                                        onChange={
                                                            (e) => setCreateTypeBuilding({
                                                                ...createTypeBuilding,
                                                                status: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Vui lòng chọn trạng thái...</option>
                                                        <option value="1">Mở</option>
                                                        <option value="0">Đóng</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button type="button" className="btn btn-primary" onClick={() => handleCreate()}>Xác Nhận</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card-body'>
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
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Xóa Loại Tòa Nhà</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body ">
                                                                <span>Bạn có chắc chắn muốn xóa <span className="text-danger">{listCheckBox.length}</span> kiểu toàn nhà này không?</span>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                                <button type="button" class="btn btn-primary" onClick={() => handlDeleteTypeBuilding()}>Xác Nhận</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> : 
                                            <>
                                            </>
                                        }
                                    </th>
                                    <th className="align-middle text-center">Tên Kiểu Tòa Nhà</th>
                                    <th className="align-middle text-center">Giá Tiền</th>
                                    <th className="align-middle text-center">Trạng Thái</th>
                                    <th className="align-middle text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {typeBuilding.map((value, key) => (
                                <>
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
                                        <td className="align-middle">{value.type_name || ""}</td>
                                        <td className="text-end align-middle">{value.price || ""}</td>
                                        <td className="text-center align-middle">
                                            {value.status === 1 ? (
                                                <button className="btn btn-primary" onClick={() => handleChangeStatusAdmin(value, 0)}>
                                                    Open
                                                </button>
                                            ) : (
                                                <button className="btn btn-danger" onClick={() => handleChangeStatusAdmin(value, 1)}>
                                                    Close
                                                </button>
                                            )}
                                        </td>
                                        <td className="text-center align-middle">
                                            <Space direction="vertical">
                                                <Space wrap>
                                                    <Dropdown
                                                        menu={{
                                                            items: [
                                                                {
                                                                    key: "1",
                                                                    label: (
                                                                        <>
                                                                            <a onClick={() => setUpdateTypeBuilding(value)} data-bs-toggle="modal"
                                                                               data-bs-target="#EditModal">Cập Nhật
                                                                                Thông Tin</a>
                                                                        </>
                                                                    ),
                                                                },
                                                            ],
                                                        }}
                                                        placement="bottomRight"
                                                        trigger={["click"]}
                                                    >
                                                        <Button
                                                            icon={<Setting2/>}
                                                        />
                                                    </Dropdown>
                                                </Space>
                                            </Space>
                                            <div className="modal fade" id="EditModal" tabIndex="-1"
                                                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-lg">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="exampleModalLabel">Cập Nhật
                                                                Tài Khoản</h5>
                                                            <button type="button" className="btn-close"
                                                                    data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div className="row">
                                                                <div className='col'>
                                                                    <lable className='form-lable float-start mb-2'>Tên Kiểu Tòa Nhà</lable>
                                                                    <input className='form-control mt-2' type='text'
                                                                        value={updateTypeBuilding.type_name}
                                                                        onChange={
                                                                            (e) => setUpdateTypeBuilding({
                                                                                ...updateTypeBuilding,
                                                                                type_name: e.target.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className='col'>
                                                                    <lable className='form-lable float-start mb-2'>Giá Tiền</lable>
                                                                    <input className='form-control mt-2' type='number'
                                                                        value={updateTypeBuilding.price}
                                                                        onChange={
                                                                            (e) => setUpdateTypeBuilding({
                                                                                ...updateTypeBuilding,
                                                                                price: e.target.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className='col'>
                                                                    <lable className='form-lable float-start mb-2'>Trạng Thái</lable>
                                                                    <select className='form-control mt-2'
                                                                        value={updateTypeBuilding.status}
                                                                        onChange={
                                                                            (e) => setUpdateTypeBuilding({
                                                                                ...updateTypeBuilding,
                                                                                status: e.target.value,
                                                                            })
                                                                        }
                                                                    >
                                                                        <option value="">Vui lòng chọn trạng thái...</option>
                                                                        <option value="1">Mở</option>
                                                                        <option value="0">Đóng</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                            <button type="button" className="btn btn-primary" onClick={handleUpdateTypeBuilding}>Xác Nhận</button>
                                                        </div>
                                                    </div>
                                                </div>  
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            ))}
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
    );
};

export default TypeBuildingScreen;