import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authSelector } from '../../redux/reducers/authReducer';

const FireWarning = () => {
  const auth = useSelector(authSelector);
  useEffect(() => {
    const socket = new WebSocket("ws://192.168.7.114:81/"); // ⚠️ thay bằng IP ESP32 thực tế
    console.log(`AUTH:${auth.info.id}`);
    
    socket.onopen = () => {
      console.log("✅ Đã kết nối ESP32 WebSocket");
      // Gửi userID nếu ESP yêu cầu xác thực
      socket.send(`AUTH:${auth.info.id}`);
    };

    socket.onmessage = (event) => {
      console.log("📩 Dữ liệu nhận:", event.data);

      if (event.data.startsWith("FIRE_ALERT")) {
        toast.error("🔥 CẢNH BÁO CHÁY!", {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    };

    socket.onerror = (err) => {
      console.error("❌ Lỗi WebSocket:", err);
    };

    // socket.onclose = () => {
    //   console.warn("⚠️ WebSocket bị ngắt kết nối");
    //   toast.warning("⚠️ Mất kết nối ESP32", {
    //     position: "top-center",
    //     autoClose: 3000,
    //   });
    // };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <ToastContainer />
    </>
  );
};

export default FireWarning;
