/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import handleAPI from "../../apis/handlAPI";
import Toast from "../../config/ToastConfig";
import { Button, Dropdown, Space } from "antd";
import { Setting2 } from "iconsax-react";
import { saveAs } from 'file-saver';
import { authSelector } from "../../redux/reducers/authReducer";
import { useSelector } from "react-redux";
const Contract = () => {
    const fileInputRef = useRef(null);
    const [content, setContent] = useState(null);
    const editorContainerRef = useRef(null);
    const [htmlContent, setHtmlContent] = useState("");
    const [updateContract, setUpdateContract] = useState("");
    const [data, setData] = useState([]);
    const auth = useSelector(authSelector);
    const handleFileChange = (e) => {
        // setContent(e.target.files[0]);
        getHtmlCkeditor4(e.target.files[0]);
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.ckeditor.com/4.25.0-lts/standard/ckeditor.js";

        script.onload = () => {
        if (window.CKEDITOR && editorContainerRef.current) {
            window.CKEDITOR.replace(editorContainerRef.current, {
            extraAllowedContent: "*[*]{*}", // Cho phép tất cả inline styles và attributes
            height: 550,
            versionCheck: false,
            contentsCss: [
                "https://fonts.googleapis.com/css?family=Times+New+Roman",
                "body { font-family: 'Times New Roman', serif; font-size: 18px; }",
            ],
            removePlugins: "notification", // Tắt plugin cảnh báo
            });

            // Gán nội dung khi CKEditor đã khởi tạo
            if (htmlContent) {
                window.CKEDITOR.instances["editor"].setData(htmlContent);
            }
        }
    };

        document.body.appendChild(script);

        return () => {
            // Cleanup CKEditor khi component unmount
            if (window.CKEDITOR) {
                for (let instance in window.CKEDITOR.instances) {
                window.CKEDITOR.instances[instance].destroy(true);
                }
            }
        };
    }, [htmlContent]);

    const getHtmlCkeditor4 = async (file) => {
        const url = `https://docx-converter.cke-cs.com/v2/convert/docx-html`;
        const formData = new FormData();
            formData.append("file", file);
            formData.append(
            "config",
            JSON.stringify({
                merge_fields: { prefix: "{{", suffix: "}}" },
                formatting: {
                resets: "none",
                defaults: "inline",
                styles: "inline",
                comments: "none",
                },
                timezone: "Asia/Saigon",
            })
        );
        const res = await handleAPI(url, formData, "post");
        console.log(res);
        
        setHtmlContent(res.html)
    }

    const handleCreateContract = async (value) => {
        if (!updateContract) {
            Toast.error("Vui lòng chọn hợp đồng");
            return;
        }
    
        let file;
        let fileName = `contract_${updateContract.contract_code}.doc`;
    
        // Option 1: Use file from fileInputRef if selected
        if (fileInputRef.current?.files[0]) {
            file = fileInputRef.current.files[0];
            fileName = file.name;
        } else {
            // Option 2: Generate Word file from CKEditor content
            const editorContent = window.CKEDITOR?.instances["editor"]?.getData() || "<p>No content</p>";
            const header =
            "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'></head><body>";
            const footer = "</body></html>";
            const content = header + editorContent + footer;
    
            const blob = new Blob([content], {
            type: "application/msword;charset=utf-8",
            });
            file = new File([blob], fileName, { type: "application/msword" });
        }
    
        if (!file) {
            Toast.error("Vui lòng chọn file hoặc nhập nội dung hợp đồng");
            return;
        }
    
        const contractId = value.id;
        const formData = new FormData();
        formData.append("file", file);
        // Add ContractUpdateFileRequest fields if needed
        formData.append("request", JSON.stringify({})); // Adjust based on ContractUpdateFileRequest
    
        try {
            const url = `/api/contract/upload-file/${contractId}`;
            const response = await handleAPI(url, formData, "post", auth.token);
            Toast("success", response.message);
            setUpdateContract(null);
            setHtmlContent("");
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear file input
            }
            if (window.CKEDITOR?.instances["editor"]) {
                window.CKEDITOR.instances["editor"].setData(""); // Clear CKEditor
            }
            // Close modal programmatically
            document.getElementById("EditModal").classList.remove("show");
            document.body.classList.remove("modal-open");
            document.querySelector(".modal-backdrop")?.remove();
            // Refresh contract list
            getData();

        } catch (error) {
            console.error("Error uploading file:", error);
            Toast.error("Tải file thất bại: " + (error.response?.data?.message || error.message));
        }
    };
    useEffect(()=> {
        getData();
    }, [])

    const getData = async () => {
        try{
            const url = `/api/contract?page=1&size=9999`;
            const res = await handleAPI(url, {}, "get", auth.token);
            console.log(res);
            if(res.status === 200) {
                setData(res.data.data);
            }
            // if()
        }catch(error) {
            console.log(error)
        }
    }


    const changStatusContract = async (value) => {
        if(value.status === 2) {
            const url = `/api/contract/change-status`;
            const res = await handleAPI(url, {id: value.id}, "post", auth.token);
            if(res.status === 200) {
                Toast("success", res.message);
                getData();
            }
        }
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            Danh Sách Hợp Đồng
                        </div>
                        <div className="card-header">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center align-middle">STT</th>
                                            <th className="text-center align-middle wrap">Mã Hợp Đồng</th>
                                            <th className="text-center align-middle">Họ Và Tên</th>
                                            <th className="text-center align-middle">Email</th>
                                            <th className="text-center align-middle">CCCD</th>
                                            <th className="text-center align-middle wrap">Nơi Cấp</th>
                                            <th className="text-center align-middle wrap">Nơi Chốn</th>
                                            <th className="text-center align-middle">Ngày Cấp</th>
                                            {/* <th className="text-center align-middle">Ngày Bắt Đầu</th>
                                            <th className="text-center align-middle">Ngày Kết Thúc</th> */}
                                            <th className="text-center align-middle wrap">Tổng Số Tiền</th>
                                            <th className="text-center align-middle">Trạng Thái</th>
                                            <th className="text-center align-middle wrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((value, key) => (
                                                <>
                                                    <tr key={key}>
                                                        <td className="text-center align-middle">{key + 1}</td>
                                                        <td className="text-center align-middle">{value.contract_code}</td>
                                                        <td className="text-center align-middle">{value.full_name}</td>
                                                        <td className="text-center align-middle">{value.email}</td>
                                                        <td className="text-center align-middle">{value.cccdid}</td>
                                                        <td className="text-center align-middle">{value.place_of_issue}</td>
                                                        <td className="text-center align-middle">{value.address}</td>
                                                        <td className="text-center align-middle">
                                                            {value.birth_date ? new Date(value.birth_date).toLocaleDateString('vi-VN') : ""}
                                                        </td>
                                                        {/* <td className="text-center align-middle">
                                                            {value.start_date ? new Date(value.start_date).toLocaleDateString('vi-VN') : ""}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {value.end_date ? new Date(value.end_date).toLocaleDateString('vi-VN') : ""}
                                                        </td> */}
                                                        <td className="text-center align-middle">{value.total_amount.toLocaleString('vi-VN')} VNĐ</td>
                                                        <td className="text-center align-middle">
                                                            <button onClick={() => changStatusContract(value)} className={`btn btn-${value.status === 1 ? "warning" : "success"} w-100`}>{value.status === 1 ? "Chờ Xét Duyệt" : value.status === 2 ? "Đã gửi mail" : "Đã xét duyệt"}</button>
                                                        </td>
                                                        <td className="text-center align-middle wrap">
                                                        <Space direction="vertical">
                                                                <Space wrap>
                                                                    <Dropdown
                                                                        menu={{
                                                                            items: [
                                                                                {
                                                                                    key: "1",
                                                                                    label: (
                                                                                        <>
                                                                                            <a onClick={() => setUpdateContract(value)} data-bs-toggle="modal"
                                                                                            data-bs-target="#EditModal">Cập Nhật Hợp Đồng</a>
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
                                                        </td>
                                                    </tr>
                                                </>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <div
                                    className="modal fade"
                                    id="EditModal"
                                    tabIndex="-1"
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-fullscreen">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    Cập Nhật Hợp Đồng
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                {/* <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Ngày Bắt Đầu</label>
                                                        <input type="date" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Ngày Kết Thúc</label>
                                                        <input type="date" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                </div> */}
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">File Hợp Đồng</label>
                                                        <input type="file" name="" id="" className="form-control" ref={fileInputRef} onChange={handleFileChange}/>
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col">
                                                        <textarea name="" id="editor" ref={editorContainerRef}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    data-bs-dismiss="modal"
                                                >
                                                    Đóng
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => handleCreateContract(updateContract)}
                                                >
                                                    Xác Nhận
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contract;
