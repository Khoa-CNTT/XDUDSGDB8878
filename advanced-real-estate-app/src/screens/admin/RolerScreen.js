/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from "react";
import handleAPI from "../../apis/handlAPI";
import Toast from "../../config/ToastConfig";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import { Bag } from "iconsax-react";
import {appVariables} from "../../constants/appVariables";
const RolerScreen = () => {
    const [permission, setPermission] = useState([]);
    const [role, setRole] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [newPermission, setNewPermission] = useState([]);
    const [createRole, setCreateRole] = useState({});
    const [createPermission, setCreatePermission] = useState({});
    const [arrayPermissionPre, setArrayPermissionPre] = useState([]);
    const [arrayCreatePerrmission, setArrayCreatePerrmission] = useState([]);
    const [arrayDeleletPermission, setArrayDeleletPermission] = useState([]);
    const [arrayPermission, setArrayPermission] = useState([]);
    const [checkLink, setCheckLink] = useState(false);
    const [listCheckBox, setListCheckBox] = useState([]);
    const [listRoleCheckBox, setListRoleCheckBox] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Sử dụng useDispatch để tạo dispatch

    const auth = useSelector(authSelector);
    useEffect(() => {
        getRole();
        getPermission();
    }, []);
    
    const getPermission = async () => {
        const url = `/api/admin/permissions`;
        try {
            const res = await handleAPI(url, {}, "get", auth?.token)
            setPermission(res.data.data);
        } catch (error) {
            Toast("error", error.message)
        }
    }

    const getRole = async () => {
        const url = `/api/admins/role`;
        try{
            const data = await handleAPI(url, {}, "get", auth?.token);
            setRole(data.data.data);
        } catch (error) {
            Toast("error", error.message);
        }
        
    }

    const createRoles = async () => {
        console.log(permission);
        console.log(role);
        console.log(newPermission);
        const url = `/api/admins/role`;
        const payload = checkLink ? { permission_name: createRole.permission_name } : createRole;
    
        try {
            const res = await handleAPI(url, payload, "post", auth?.token);
            if (res.status === 200) {
                Toast("success", res.message);
                setCreateRole({
                    role_name: "",
                    role_type: "",
                    status: "",
                });
                getRole();
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const changeStatusRole = async (value, newStatus) => {
        const url = `/api/admins/role/${value.id}`
        const updateRoleNew = {...value, status:newStatus}
        
        try {
            const res = await handleAPI(url, updateRoleNew, "put", auth?.token);
            if(res.status === 200) {
                Toast("success", res.message);
                getRole();
            }
        } catch (error) {
            Toast("error", error.message)
        }
    }

    const getDataPermissionRole = async (newID) => {
        const url = `/api/admins/role-permission/${newID.id}`;
        try {
            const res = await handleAPI(url, {}, "get", auth?.token);
            
            setSelectedRoleId(newID.id)

            const permissionSet = new Set(res.data.map(Number));
            setArrayPermission(res.data.map(Number));
            const updatedData = permission.map(item => ({
                ...item,
                checked: permissionSet.has(item.id) ? true : false,
            }));
            setNewPermission(updatedData);
            setArrayPermissionPre(updatedData);

        } catch (error) {
            Toast("error", error.message);
        }
    };

    const handleCheckBoxCreate = (id) => {
        // Tạo mảng mới với giá trị `checked` được thay đổi
        const updatedPermissions = newPermission.map((permission) => {
            if (permission.id === id) {
                // Đổi trạng thái checked của phần tử được tích
                return { ...permission, checked: !permission.checked };
            }
            return permission; // Giữ nguyên các phần tử khác
        });
    
        // Cập nhật lại state
        setNewPermission(updatedPermissions);

        const a = arrayPermissionPre.filter((value) => value.checked === true).map((value) => value.id);
        console.log("đây là mảng a: ", a);
        const b = updatedPermissions.filter((value) => value.checked === true).map((value) => value.id);
        console.log("đây là mảng b: ", b);
        // Tìm các phần tử trong b không có trong a (tạo mảng c)
        const c = b.filter(item => !a.includes(item));

        // Tìm các phần tử khác nhau giữa a và b nhưng không thuộc c (tạo mảng d)
        const d = [...a, ...b].filter(item => !a.includes(item) || !b.includes(item))
                            .filter(item => !c.includes(item)); // Loại trừ phần tử đã có trong c
        console.log(`Mảng c (phần tử trong b không có trong a):`, c);
        console.log(`Mảng d (phần tử khác nhau giữa a và b, không có trong c):`, d);
        setArrayCreatePerrmission(c);
        setArrayDeleletPermission(d);
    };

    const getUserInfo = async() => {
        const url = `/api/users/my-info`;
        try {
            const res = await handleAPI(url, {}, "get", auth?.token);
            if (res.code === 1000) {
                // Lưu thông tin xác thực vào localStorage
                const authData = {
                    token      : auth?.token,
                    permission : res?.result?.permission
                };
                // Dispatch action để lưu vào Redux store
                dispatch(addAuth(authData));
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    const updatePermissionRole = async (value) => {
        const roleId = value.id;
        const urlCreate = `/api/admins/role-permission`;
        const urlDelete = `/api/admins/role-permission`;
        const payLoadCreate = {
            id   : roleId,
            list : arrayCreatePerrmission
        }
        
        const payLoadDelete = {
            id   : roleId,
            list : arrayDeleletPermission
        }

        console.log("Role ID: ", roleId);
        console.log("New Permission: ", arrayPermission);
        console.log("Pay Load Create: ", payLoadCreate);
        console.log("Pay Load Delete: ", payLoadDelete);

        if(arrayPermission.length === 0 && arrayCreatePerrmission.length === 0 && arrayDeleletPermission.length === 0) {
            return Toast("error", "Mời bạn chọn quyền trước khi cập nhật");
        } else {

            if(arrayCreatePerrmission.length === 0 && arrayDeleletPermission.length === 0) {
                return Toast("success", "Đã cập nhật thành công");
            }
            
            try {
                if (arrayDeleletPermission.length === 0) {
                    const res_1 = await handleAPI(urlCreate, payLoadCreate, "post", auth?.token)
                    if(res_1.status === 200) {
                        Toast("success", "Đã cấp quyền thành công");
                    }
                }

                if(arrayCreatePerrmission.length === 0) {
                    const res_2 = await handleAPI(urlDelete, payLoadDelete, "delete", auth?.token)
                    if(res_2.status === 200) {
                        Toast("success", "Đã cấp quyền thành công");
                    }
                }

                if(arrayDeleletPermission.length > 0 && arrayCreatePerrmission.length > 0) {
                    const res_1 = await handleAPI(urlCreate, payLoadCreate, "post", auth?.token)
                    const res_2 = await handleAPI(urlDelete, payLoadDelete, "delete", auth?.token)
        
                    if(res_1.status === 200 && res_2.status === 200) {
                        Toast("success", "Đã cấp quyền thành công");
                    }
                }
                getPermission();
                getDataPermissionRole(value);
                getUserInfo();
            } catch (error) {
                Toast("error", error.message);
            }
        }
    }

    // Hàm xử lý checkbox
    const handleCheckBoxChange = (permissionId) => {
        setListCheckBox((prev) => {
            if (prev.includes(permissionId)) {
                // Nếu đã có trong mảng, loại bỏ khỏi mảng
                return prev.filter((id) => id !== permissionId);
            } else {
                // Nếu chưa có, thêm vào mảng
                return [...prev, permissionId];
            }
        });
    };

    const createPermissions = async () => {
        const url = `/api/admin/permissions`;
    
        // Kiểm tra các trường dữ liệu trước khi gửi
        if (!createPermission.permission_name || createPermission.permission_name.trim() === "") {
            Toast("error", "Vui lòng nhập tên chức năng!");
            return;
        }
    
        // Nếu checkLink là true, kiểm tra trường link
        if (checkLink && (!createPermission.link || createPermission.link.trim() === "")) {
            Toast("error", "Vui lòng nhập đường dẫn!");
            return; 
        }
    
        // Tạo payload dựa trên checkLink
        const payload = checkLink
            ? { permission_name: createPermission.permission_name, link: createPermission.link }
            : { permission_name: createPermission.permission_name };
    
        try {
            const res = await handleAPI(url, payload, "post", auth?.token);
            if (res.status === 200) {
                Toast("success", res.message);
    
                setCreatePermission({
                    permission_name: "",
                    link: "",
                });
    
                getPermission();
                getRole();
            }
        } catch (error) {
            Toast("error", error.message);
        }
    };

    // Hàm gửi dữ liệu đến server
    const deletePermissions = async () => {
        const url = `/api/admin/permissions/delete-all`;
        const deleteAll = {
            ids : listCheckBox
        }
        try {
            const res = await handleAPI(url, deleteAll, "delete", auth?.token);
            if (res.status === 200) {
                Toast("success", "Permissions assigned successfully!");
                // Reset danh sách checkbox và mảng
                setListCheckBox([]);
                getPermission();
                getRole();
            }
        } catch (error) {
            Toast("error", error.message);
        }
    };

    const hanldDeleteRole = async () => {
        const url = `/api/admins/role/delete-all`;
        const deleteAll = {
            ids : listRoleCheckBox
        }
        try {
            const res = await handleAPI(url, deleteAll, "delete", auth?.token);
            if (res.status === 200) {
                Toast("success", "Permissions assigned successfully!");
                window.$("#deleteModal").modal('hide');
                // Reset danh sách checkbox và mảng
                setListRoleCheckBox([]);
                getPermission();
                getRole();
            }
        } catch (error) {
            Toast("error", error.message);
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-2">
                    <div className="card">
                        <div className="card-header">
                            Thêm Mới Quyền
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12">
                                    <label className="mb-2">Tên Quyền</label>
                                    <input className="form-control"
                                           value={createRole.role_name}
                                           onChange={(e) => setCreateRole({
                                               ...createRole,
                                               role_name: e.target.value
                                           })}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="mb-2">Loại Quyền</label>
                                    <select
                                        className="form-control"
                                        value={createRole.role_type}
                                        onChange={(e) => setCreateRole({
                                            ...createRole,
                                            role_type: e.target.value
                                        })}
                                    >
                                        {
                                            appVariables.listRoleRequireForManagerPage
                                            .map((item, index) => (
                                                <option key={index} value={item}>{`${item}`}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col-12 mt-2">
                                    <label className="mb-2">Trạng Thái</label>
                                    <select className="form-control"
                                            value={createRole.status}
                                            onChange={(e) => setCreateRole({
                                                ...createRole,
                                                status: e.target.value
                                            })}
                                    >
                                        <option value="">Mời bạn chọn trạng thái</option>
                                        <option value="1">Mở</option>
                                        <option value="0">Đóng</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-primary float-end" onClick={() => createRoles()}>Thêm Mới
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-5">
                    <div className="card">
                        <div className="card-header">Danh Sách Quyền</div>
                        <div className="card-body">
                            <div className="table-responsive">
                            <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="align-middle text-center" style={{ width: "60px", height:"42px"}}>
                                                {
                                                    listRoleCheckBox.length > 0 ?
                                                    <>
                                                        <span type="button" className="text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                            <Bag/>
                                                        </span>
                                                        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                            <div class="modal-dialog">
                                                                <div class="modal-content">
                                                                    <div class="modal-header">
                                                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Xóa Quyền</h1>
                                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                    </div>
                                                                    <div class="modal-body ">
                                                                        <span>Bạn có chắc chắn muốn xóa <span className="text-danger">{listRoleCheckBox.length}</span> quyền này không?</span>
                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                                        <button type="button" class="btn btn-primary" onClick={() => hanldDeleteRole()}>Xác Nhận</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </> : 
                                                    <>
                                                    </>
                                                }
                                            </th>
                                            <th className="text-center">Tên Quyền</th>
                                            <th className="text-center">Trạng Thái</th>
                                            <th className="text-center">Cấp Quyền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {role.map((value, key) => (
                                            <tr key={key} className={listRoleCheckBox.includes(value.id) ? "table-secondary" : ""}>
                                                <td className="text-center align-middle" style={{ width: "60px" }}>
                                                    <Checkbox 
                                                        checked={listRoleCheckBox.includes(value.id)}
                                                        onChange={() => {
                                                            setListRoleCheckBox((prev) => {
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
                                                <td className="align-middle">{value?.role_name}</td>
                                                <td className="text-center align-middle">
                                                    {value?.status === 1 ? (
                                                        <button
                                                            style={{ width: "70px" }}
                                                            className="btn btn-success"
                                                            onClick={() => changeStatusRole(value, 0)}
                                                        >
                                                            Mở
                                                        </button>
                                                    ) : (
                                                        <button
                                                            style={{ width: "70px" }}
                                                            className="btn btn-warning"
                                                            onClick={() => changeStatusRole(value, 1)}
                                                        >
                                                            Đóng
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="text-center align-middle">
                                                    {selectedRoleId === value.id ? (
                                                        <button style={{width: "150px"}} className="btn btn-success"
                                                            onClick={() => updatePermissionRole(value)}
                                                        >
                                                            Cập Nhật
                                                        </button>
                                                    ) : (
                                                        <button style={{width: "150px"}}
                                                            className="btn btn-primary"
                                                            onClick={() => 
                                                                getDataPermissionRole(value)
                                                            }
                                                        >
                                                            Cấp Chức Năng
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-5">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="p-2 bd-highlight">
                                    Danh Sách Chức Năng
                                </div>
                                <div className="p-2 bd-highlight">
                                    {selectedRoleId === null || selectedRoleId === undefined ? (
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#themMoiChucNangModal"
                                            onClick={() => 
                                                getPermission()
                                            }
                                        >
                                            Thêm Mới
                                        </button>
                                    ) : (
                                        <button
                                            // style={{ width: "150px" }}
                                            className="btn btn-danger"
                                            onClick={() => {
                                                setSelectedRoleId(null);
                                                setNewPermission([]);
                                                // getPermission();
                                            }} // Reset selectedRoleId
                                        >
                                            Hủy Bỏ Cấp Quyền
                                        </button>
                                    )}
                                    <div class="modal fade" id="themMoiChucNangModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-xl">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm Mới Chức Năng</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <div className="row">
                                                        <div className="col-3">
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            <label className="mb-2">Tên Chức Năng</label>
                                                                            <input className="form-control"
                                                                                value={createPermission.permission_name}
                                                                                onChange={(e) =>  setCreatePermission({
                                                                                    ...createPermission,
                                                                                    permission_name : e.target.value
                                                                                })}
                                                                            />
                                                                        </div>
                                                                        <div className="col-12 mt-2">
                                                                            <div class="form-check">
                                                                                <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault`} 
                                                                                    onChange={() => setCheckLink(!checkLink)}
                                                                                />
                                                                                <label className="form-check-label" htmlFor={`flexCheckDefault`}>
                                                                                    Cho phép gán đường dẫn
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            checkLink === true ? <>
                                                                                <div className="col-12 mt-2">
                                                                                    <label className="mb-2">Đường dẫn</label>
                                                                                    <input className="form-control"
                                                                                        value={createPermission.link}
                                                                                        onChange={(e) =>  setCreatePermission({
                                                                                            ...createPermission,
                                                                                            link : e.target.value
                                                                                        })}
                                                                                    />
                                                                                </div>
                                                                            </> : <></>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-9">
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col-3">
                                                                            <div className="row">
                                                                                {
                                                                                    permission.filter((value) => value.permission_name && value.permission_name.toLowerCase().includes("view"))
                                                                                               .map((value, key) => (
                                                                                        <>
                                                                                            <div className="col-12">
                                                                                                <div class="form-check">
                                                                                                    <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-add-view-${key}`} 
                                                                                                    checked={listCheckBox.includes(value.id)} // Kiểm tra trạng thái `checked`
                                                                                                    onChange={() => handleCheckBoxChange(value.id)}
                                                                                                    />
                                                                                                    <label className="form-check-label" htmlFor={`flexCheckDefault-add-view-${key}`}>
                                                                                                        {value.permission_name}
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="row">
                                                                                {
                                                                                    permission.filter((value) => value.permission_name && value.permission_name.toLowerCase().includes("thêm"))
                                                                                               .map((value, key) => (
                                                                                        <>
                                                                                            <div className="col-12">
                                                                                                <div class="form-check">
                                                                                                    <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-add-add-${key}`} 
                                                                                                    checked={listCheckBox.includes(value.id)} // Kiểm tra trạng thái `checked`
                                                                                                    onChange={() => handleCheckBoxChange(value.id)}
                                                                                                    />
                                                                                                    <label className="form-check-label" htmlFor={`flexCheckDefault-add-add-${key}`}>
                                                                                                        {value.permission_name}
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="row">
                                                                                {
                                                                                    permission.filter((value) => value.permission_name && value.permission_name.toLowerCase().includes("sửa"))
                                                                                               .map((value, key) => (
                                                                                        <>
                                                                                            <div className="col-12">
                                                                                                <div class="form-check">
                                                                                                    <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-add-edit-${key}`} 
                                                                                                    checked={listCheckBox.includes(value.id)} // Kiểm tra trạng thái `checked`
                                                                                                    onChange={() => handleCheckBoxChange(value.id)}
                                                                                                    />
                                                                                                    <label className="form-check-label" htmlFor={`flexCheckDefault-add-edit-${key}`}>
                                                                                                        {value.permission_name}
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="row">
                                                                                {
                                                                                    permission.filter((value) => value.permission_name && value.permission_name.toLowerCase().includes("xóa"))
                                                                                               .map((value, key) => (
                                                                                        <>
                                                                                            <div className="col-12">
                                                                                                <div class="form-check">
                                                                                                    <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-add-del-${key}`} 
                                                                                                    checked={listCheckBox.includes(value.id)} // Kiểm tra trạng thái `checked`
                                                                                                    onChange={() => handleCheckBoxChange(value.id)}
                                                                                                    />
                                                                                                    <label className="form-check-label" htmlFor={`flexCheckDefault-add-del-${key}`}>
                                                                                                        {value.permission_name}
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-primary" onClick={() => createPermissions()}>Thêm</button>
                                                    <button type="button" class="btn btn-danger" onClick={() => deletePermissions()}>Xóa</button>
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {
                                    newPermission.length > 0 ? (
                                        <>
                                            <div className="col-3">
                                                <div className="row">
                                                    {
                                                        newPermission.filter((value) => value.permission_name && value.permission_name.toLowerCase().includes("view"))
                                                                    .map((value, key) => (
                                                            <>
                                                                <div className="col-12">
                                                                    <div class="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-view-${key}`} 
                                                                            checked={value.checked} // Kiểm tra trạng thái `checked`
                                                                            onChange={() => handleCheckBoxCreate(value.id)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`flexCheckDefault-view-${key}`}
                                                                            // onChange={() => handleCheckBoxCreate(value.id)}
                                                                        >
                                                                            {value.permission_name}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="row">
                                                    {
                                                        newPermission.filter((value) => value.permission_name && value.permission_name.toLowerCase().includes("thêm"))
                                                                    .map((value, key) => (
                                                            <>
                                                                <div className="col-12">
                                                                    <div class="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-add-${key}`} 
                                                                        checked={value.checked} // Kiểm tra trạng thái `checked`
                                                                        onChange={() => handleCheckBoxCreate(value.id)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`flexCheckDefault-add-${key}`}
                                                                            // onChange={() => handleCheckBoxCreate(value.id)}
                                                                        >
                                                                            {value.permission_name}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="row">
                                                    {
                                                        newPermission.filter((value) => value.permission_name && value.permission_name.toLowerCase().includes("sửa"))
                                                                    .map((value, key) => (
                                                            <>
                                                                <div className="col-12">
                                                                    <div class="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-edit-${key}`} 
                                                                        checked={value.checked} // Kiểm tra trạng thái `checked`
                                                                        onChange={() => handleCheckBoxCreate(value.id)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`flexCheckDefault-edit-${key}`}
                                                                            // onChange={() => handleCheckBoxCreate(value.id)}
                                                                        >
                                                                            {value.permission_name}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="row">
                                                    {
                                                        newPermission.filter((value) => value.permission_name && value.permission_name.toLowerCase().includes("xóa"))
                                                                    .map((value, key) => (
                                                            <>
                                                                <div className="col-12">
                                                                    <div class="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id={`flexCheckDefault-del-${key}`} 
                                                                        checked={value.checked} // Kiểm tra trạng thái `checked`
                                                                        onChange={() => handleCheckBoxCreate(value.id)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`flexCheckDefault-del-${key}`}
                                                                            // onChange={() => handleCheckBoxCreate(value.id)}
                                                                        >
                                                                            {value.permission_name}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    ) : <div className="text-center">Dữu liệu chưa được load</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RolerScreen;