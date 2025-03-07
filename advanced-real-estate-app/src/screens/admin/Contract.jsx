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
const Contract = () => {
    const fileInputRef = useRef(null);
    const [content, setContent] = useState(null);
    const editorContainerRef = useRef(null);
    const [htmlContent, setHtmlContent] = useState("");
    const [updateContract, setUpdateContract] = useState("");
    
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

    const handleCreateContract = () => {
        const editorContent = window.CKEDITOR.instances["editor"].getData();

        // Định dạng nội dung HTML để tải về dưới dạng file Word
        const header =
            "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'></head><body>";
        const footer = "</body></html>";
        const content = header + editorContent + footer;

        // Tạo Blob với MIME type cho file Word
        const blob = new Blob([content], {
            type: "application/msword;charset=utf-8",
        });

        // Sử dụng file-saver để tải file
        saveAs(blob, "contract.doc");
    };

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            Danh Sách Hợp Đồng
                        </div>
                        <div className="card-header">
                            <div className="table-response">
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
                                            <th className="text-center align-middle">Ngày Bắt Đầu</th>
                                            <th className="text-center align-middle">Ngày Kết Thúc</th>
                                            <th className="text-center align-middle wrap">Tổng Số Tiền</th>
                                            <th className="text-center align-middle">Trạng Thái</th>
                                            <th className="text-center align-middle wrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center align-middle">1</td>
                                            <td className="text-center align-middle wrap">HDND01</td>
                                            <td className="text-center align-middle">Phùng Văn Mạnh</td>
                                            <td className="text-center align-middle">phungvanmanh1303@gmail.com</td>
                                            <td className="text-center align-middle">066203001197</td>
                                            <td className="text-center align-middle wrap">Quảng Nam</td>
                                            <td className="text-center align-middle wrap">Đà Nẵng</td>
                                            <td className="text-center align-middle">26/03/2021</td>
                                            <td className="text-center align-middle">17/12/2024</td>
                                            <td className="text-center align-middle">17/12/2026</td>
                                            <td className="text-center align-middle wrap">100.000.000 VNĐ</td>
                                            <td className="text-center align-middle">
                                                <button className="btn btn-warning w-100">Chờ Xét Duyệt</button>
                                                {/* <button className="btn btn-success w-100">Đã Xét Duyệt</button> */}
                                                {/* <button className="btn btn-danger w-100">Chờ Thanh Toán</button> */}
                                                {/* <button className="btn btn-primary w-100">Đã Thanh Toán</button> */}
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
                                                                                <a data-bs-toggle="modal"
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
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Mã Hợp Đồng</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Họ Và Tên</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Ngày Sinh</label>
                                                        <input type="date" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Email</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Số Điện Thoại</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Địa Chỉ</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Ngày Bắt Đầu</label>
                                                        <input type="date" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Ngày Kết Thúc</label>
                                                        <input type="date" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">CMT/CCCD</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Nơi Cấp</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Ngày Cấp</label>
                                                        <input type="date" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Tòa Nhà Cho Thuê</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">Địa Chỉ Cho Thuê</label>
                                                        <input type="text" name="" id="" className="form-control" readOnly/>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <label htmlFor="" className="mb-2">File Hợp Đồng</label>
                                                        <input type="file" name="" id="" className="form-control" ref={fileInputRef} onChange={handleFileChange}/>
                                                    </div>
                                                    {/* <div className="col d-flex justify-content-center align-items-center">
                                                        <button className=" btn btn-primary mt-4" onClick={() => getHtmlCkeditor4()}>Tải file word</button>
                                                    </div> */}
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col">
                                                        {/* <textarea id="editor" ref={editorContainerRef}></textarea> */}
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
                                                    onClick={handleCreateContract}
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
