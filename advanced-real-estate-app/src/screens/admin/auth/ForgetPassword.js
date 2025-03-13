import { Button, Card, Form, Input, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../img/Logo.png";
// import handleAPI from "../../apis/handlAPI";
const { Title } = Typography;
const ForgetPassword = () => {
    // const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm();

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col d-none d-lg-block">
                        <div className="left-section">
                            <img
                                style={{
                                    width: "300px",
                                    height: "300px",
                                    objectFit: "cover",
                                }}
                                src={Logo}
                                alt=""
                            />
                            <Title level={2}>
                                <div style={{ color: "#F15E2B" }}>
                                    ADVANCED REAL ESTATE
                                </div>
                            </Title>
                        </div>
                    </div>
                    <div className="col content-center">
                        <Card>
                            <div className="text-center">
                                <img
                                    className="mt-3"
                                    style={{ width: "60px", height: "50px" }}
                                    src={Logo}
                                    alt=""
                                />
                                <Title level={2}>Forgot Password</Title>
                            </div>
                            <Form
                                layout="vertical"
                                form={form}
                                // onFinish={handleForgetPassword}
                                // disabled={isLoading}
                                size="large"
                            >
                                {/* Label + Input Email */}
                                <Form.Item
                                    name={"email"}
                                    label="Email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter your Email!!!",
                                        },
                                    ]}
                                >
                                    <Input
                                        allowClear
                                        maxLength={100}
                                        type="email"
                                    ></Input>
                                </Form.Item>
                            </Form>
                            <div className="row">
                                <div className="col text-end">
                                    <Link
                                        to={"/admin/login"}
                                        style={{
                                            color: "#F15E2B",
                                            textDecoration: "none",
                                        }}
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-4 mb-3">
                                <Button
                                    // loading={isLoading}
                                    onClick={() => form.submit()}
                                    htmlType="submit"
                                    className="text-white"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#F15E2B",
                                    }}
                                    size="large"
                                >
                                    Forgot Password
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgetPassword;
