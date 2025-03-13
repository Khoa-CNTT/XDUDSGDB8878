import React from "react";
import Routers from "./routers/Routers";
import "./index.css";
import { ConfigProvider } from "antd";
import {persistor, store} from "./redux/store";
import { Provider } from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {},
                    components: {},
                }}
            >
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <Routers />
                        <ToastContainer />
                    </PersistGate>
                </Provider>
            </ConfigProvider>
        </div>
    );
}

export default App;
