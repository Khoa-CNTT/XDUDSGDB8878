import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const showToast = (type = null, message) => {
    const options = {
        autoClose: 3000,
        position: "top-right",
        theme: "colored",
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: true,
        hideProgressBar: false,
    };

    switch (type) {
        case 'success':
            toast.success(message, options);
            break;
        case 'error':
            toast.error(message, options);
            break;
        case 'info':
            toast.info(message, options);
            break;
        case 'warning':
            toast.warning(message, options);
            break;
        default:
            toast.success(message, options);
    }
}

export default showToast;