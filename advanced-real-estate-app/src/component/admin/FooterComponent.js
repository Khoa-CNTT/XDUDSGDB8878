import { Layout } from "antd";
const { Footer } = Layout;
const FooterComponent = () => {
    return (
        <>
            <Footer className="bg-white" style={{ textAlign: "center" }}>
                ADVANCED REAL ESTATE ©{new Date().getFullYear()} Created by DTU students
            </Footer>
        </>
    );
};

export default FooterComponent;
