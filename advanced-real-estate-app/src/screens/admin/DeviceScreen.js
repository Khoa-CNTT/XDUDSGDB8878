/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import handleAPI from "../../apis/handlAPI";
import Toast from "../../config/ToastConfig";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { Bag, Setting2 } from "iconsax-react";
import { Button, Checkbox, Dropdown, Space } from "antd";

const DeviceScreen = () => {
    const [createDevice, setCreateDevice] = useState({});
    const [device, setDevice] = useState([]);
    const [building, setBuilding] = useState([]);
    const [category, setCategory] = useState([]);
    const [listCheckBox, setListCheckBox] = useState([]);
    const [updateDevice, setUpdateDevice] = useState({});
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
        getDataBuilding();
        getDataCategory();
        getData(pagination.current_page);
    }, [pagination.current_page]);

    const getData = async (page) => {
        const url = `/api/device?page=${page}&size=5`;
        try {
            const data = await handleAPI(url, {}, "get", auth?.token);
            setDevice(data.data.data);
            setPagination(data.data.pagination);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const getDataBuilding = async () => {
        const url = `/api/admin/buildings`;
        try {
            const data = await handleAPI(url, {}, "get", auth?.token);
            setBuilding(data.data.data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const getDataCategory = async () => {
        const url = `/api/category`;
        try {
            const data = await handleAPI(url, {}, "get", auth?.token);
            setCategory(data.data.data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

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
        const url = `/api/device`;
        try {
            const res = await handleAPI(url, createDevice, "post", auth?.token)
            console.log(res.status);
            
            if(res.status === 200) {
                Toast("success", res.message);
                getData(pagination.current_page);
                getDataBuilding();
                getDataCategory();
                setListCheckBox([]);
                window.$('#themMoiModal').modal('hide');
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const handleChangeStatusDevice = async (value, newStatus) => {
        const url = `/api/device/${value.id}`;
        const updatedNew = { ...value, status: newStatus };
        try {
            const res = await handleAPI(url, updatedNew, "put", auth?.token)
            console.log(res.status);
            
            if(res.status === 200) {
                Toast("success", res.message);
                getData(pagination.current_page);
                setUpdateDevice({
                    device_name     : "",
                    status          : "",
                    id_building     : "",
                    id_category     : "",
                    installation_date: "",
                    price           : 0,
                    description     : "",
                });
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const handleUpdateDevice = async () => {
        const url = `/api/device/${updateDevice.id}`;

        try {
            const res = await handleAPI(url, updateDevice, "put", auth?.token)
            console.log(res.status);
            
            if(res.status === 200) {
                Toast("success", res.message);
                getData(pagination.current_page);
                getDataBuilding();
                getDataCategory();
                window.$('#EditModal').modal('hide');
                setUpdateDevice({
                    device_name     : "",
                    status          : "",
                    id_building     : "",
                    id_category     : "",
                    installation_date: "",
                    price           : 0,
                    description     : "",
                });
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const handlDeleteDevice = async () => {
        console.log(listCheckBox);
        
        if(listCheckBox.length === 1) {
            const url = `/api/device/${listCheckBox}`;
            try {
                const res = await handleAPI(url, {}, "delete", auth?.token)
                console.log(res.status);
                
                if(res.status === 200) {
                    Toast("success", res.message);
                    getData(pagination.current_page);
                    getDataBuilding();
                    getDataCategory();
                    setListCheckBox((prev) => prev.filter((id) => id !== listCheckBox[0]));
                    window.$('#deleteModal').modal('hide');
                }
            } catch (error) {
                Toast("error", error.message);
            }
        } else {
            const url = `/api/device/delete-all`;
            const object = {
                ids : listCheckBox
            }
            try {
                const res = await handleAPI(url, object, "delete", auth?.token)
                console.log(res.status);
                
                if(res.status === 200) {
                    Toast("success", res.message);
                    getData(pagination.current_page);
                    getDataBuilding();
                    getDataCategory();
                    setListCheckBox([]);
                    window.$('#deleteModal').modal('hide');
                }
            } catch (error) {
                Toast("error", error.message);
            }
        }
    }

    return(
        <>
            <div className="card">
                <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="p-2 bd-highlight">
                            <span>Danh Sách Thiết Bị</span>
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
                                            <h5 className="modal-title" id="exampleModalLabel">Thêm Mới Thiết Bị</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col mb-2'>
                                                    <lable className='form-lable mb-2'>Tên Thiết Bị</lable>
                                                    <input className='form-control mt-2' type='text'
                                                        value={createDevice.device_name}
                                                        onChange={
                                                            (e) => setCreateDevice({
                                                                ...createDevice,
                                                                device_name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className='col mb-2'>
                                                    <lable className='form-lable mb-2'>Tòa Nhà</lable>
                                                    <select className='form-control mt-2'
                                                        value={createDevice.id_building}
                                                        onChange={
                                                            (e) => setCreateDevice({
                                                                ...createDevice,
                                                                id_building: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Vui lòng chọn tòa nhà</option>
                                                        {
                                                             building.map((value, key) => (
                                                                <option key={key} value={value.id}>{value.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='col mb-2'>
                                                    <lable className='form-lable mb-2'>Danh Mục Thiết Bị</lable>
                                                    <select className='form-control mt-2'
                                                        value={createDevice.id_category}
                                                        onChange={
                                                            (e) => setCreateDevice({
                                                                ...createDevice,
                                                                id_category: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Vui lòng danh mục thiết bị</option>
                                                        {
                                                            category.map((value, key) => (
                                                                <option key={key} value={value.id}>{value.category_name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <lable className='form-lable mb-2'>Ngày Lắp Đặt</lable>
                                                    <input className='form-control mt-2' type='date'
                                                        value={createDevice.installation_date}
                                                        onChange={
                                                            (e) => setCreateDevice({
                                                                ...createDevice,
                                                                installation_date: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className='col mb-2'>
                                                    <lable className='form-lable mb-2'>Trạng Thái</lable>
                                                    <select className='form-control mt-2'
                                                        value={createDevice.status}
                                                        onChange={
                                                            (e) => setCreateDevice({
                                                                ...createDevice,
                                                                status: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Vui lòng chọn trạng thái...</option>
                                                        <option value="1">Đã lắp đặt</option>
                                                        <option value="2">Đang lắp đặt</option>
                                                        <option value="0">Chưa lắp đặt</option>
                                                    </select>
                                                </div>
                                                <div className='col mb-2'>
                                                    <lable className='form-lable mb-2'>Giá Tiền</lable>
                                                    <input className='form-control mt-2' type='number'
                                                        value={createDevice.price}
                                                        onChange={
                                                            (e) => setCreateDevice({
                                                                ...createDevice,
                                                                price: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                 <div className='col mb-2'>
                                                    <lable className='form-lable'>Mô tả</lable>
                                                    <textarea className="form-control mt-2"
                                                    value={createDevice.description}
                                                        onChange={
                                                            (e) => setCreateDevice({
                                                                ...createDevice,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                    >
                                                    </textarea>
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
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Xóa Thiết Bị</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body ">
                                                                <span>Bạn có chắc chắn muốn xóa <span className="text-danger">{listCheckBox.length}</span> kiểu toàn nhà này không?</span>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                                <button type="button" class="btn btn-primary" onClick={() => handlDeleteDevice()}>Xác Nhận</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> : 
                                            <>
                                            </>
                                        }
                                    </th>
                                    <th className="text-center align-middle">Tên Thiết Bị</th>
                                    <th className="text-center align-middle">Tên Tòa Nhà</th>
                                    <th className="text-center align-middle">Tên Danh Mục Thiết Bị</th>
                                    <th className="text-center align-middle">Ngày Lắp Đặt</th>
                                    <th className="text-center align-middle">Giá</th>
                                    <th className="text-center align-middle">Mô Tả</th>
                                    <th className="text-center align-middle">Trạng Thái</th>
                                    <th className="text-center align-middle">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    device.map((value, key) => (
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
                                                <td className="align-middle">{value.device_name || ""}</td>
                                                <td className="align-middle">{value.building_name || ""}</td>
                                                <td className="align-middle">{value.category_name || ""}</td>
                                                <td className="align-middle text-center">{value.installation_date || ""}</td>
                                                <td className="align-middle text-end">{value.price || ""}</td>
                                                <td className="align-middle">{value.description || ""}</td>
                                                <td className="text-center align-middle">
                                                    {value.status === 1 ? (
                                                        <button className="btn btn-success" style={{width:"150px"}} onClick={() => handleChangeStatusDevice(value, 2)}>
                                                            Đã lắp đặt
                                                        </button>
                                                    ) : value.status === 2 ? (
                                                        <button className="btn btn-warning" style={{width:"150px"}} onClick={() => handleChangeStatusDevice(value, 0)}>
                                                            Đang lắp đặt
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-secondary" style={{width:"150px"}} onClick={() => handleChangeStatusDevice(value, 1)}>
                                                            Chưa lắp đặt
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
                                                                                    <a onClick={() => setUpdateDevice(value)} data-bs-toggle="modal"
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
                                                                    <div className='row'>
                                                                        <div className='col mb-2'>
                                                                            <lable className='form-lable mb-2 float-start'>Tên Thiết Bị</lable>
                                                                            <input className='form-control mt-2' type='text'
                                                                                value={updateDevice.device_name}
                                                                                onChange={
                                                                                    (e) => setUpdateDevice({
                                                                                        ...updateDevice,
                                                                                        device_name: e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className='col mb-2'>
                                                                            <lable className='form-lable mb-2 float-start'>Tòa Nhà</lable>
                                                                            <select className='form-control mt-2'
                                                                                value={updateDevice.id_building}
                                                                                onChange={
                                                                                    (e) => setUpdateDevice({
                                                                                        ...updateDevice,
                                                                                        id_building: e.target.value,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <option value="">Vui lòng chọn tòa nhà</option>
                                                                                {
                                                                                    building.map((value, key) => (
                                                                                        <option key={key} value={value.id}>{value.name}</option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                        <div className='col mb-2'>
                                                                            <lable className='form-lable mb-2 float-start'>Danh Mục Thiết Bị</lable>
                                                                            <select className='form-control mt-2'
                                                                                value={updateDevice.id_category}
                                                                                onChange={
                                                                                    (e) => setUpdateDevice({
                                                                                        ...updateDevice,
                                                                                        id_category: e.target.value,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <option value="">Vui lòng danh mục thiết bị</option>
                                                                                {
                                                                                    category.map((value, key) => (
                                                                                        <option key={key} value={value.id}>{value.category_name}</option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <lable className='form-lable mb-2 float-start'>Ngày Lắp Đặt</lable>
                                                                            <input className='form-control mt-2' type='date'
                                                                                value={updateDevice.installation_date}
                                                                                onChange={
                                                                                    (e) => setUpdateDevice({
                                                                                        ...updateDevice,
                                                                                        installation_date: e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className='col mb-2'>
                                                                            <lable className='form-lable mb-2 float-start'>Trạng Thái</lable>
                                                                            <select className='form-control mt-2'
                                                                                value={updateDevice.status}
                                                                                onChange={
                                                                                    (e) => setUpdateDevice({
                                                                                        ...updateDevice,
                                                                                        status: e.target.value,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <option value="">Vui lòng chọn trạng thái...</option>
                                                                                <option value="1">Đã lắp đặt</option>
                                                                                <option value="2">Đang lắp đặt</option>
                                                                                <option value="0">Chưa lắp đặt</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className='col mb-2'>
                                                                            <lable className='form-lable mb-2 float-start'>Giá Tiền</lable>
                                                                            <input className='form-control mt-2' type='number'
                                                                                value={updateDevice.price}
                                                                                onChange={
                                                                                    (e) => setUpdateDevice({
                                                                                        ...updateDevice,
                                                                                        price: e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className='col mb-2'>
                                                                            <lable className='form-lable mb-2 float-start'>Mô tả</lable>
                                                                            <textarea className="form-control"
                                                                            value={updateDevice.description}
                                                                                onChange={
                                                                                    (e) => setUpdateDevice({
                                                                                        ...updateDevice,
                                                                                        description: e.target.value,
                                                                                    })
                                                                                }
                                                                            >
                                                                            </textarea>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                                    <button type="button" className="btn btn-primary" onClick={handleUpdateDevice}>Xác Nhận</button>
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
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

export default DeviceScreen;