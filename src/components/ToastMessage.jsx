import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = (content, toastTypes) => {
  switch (toastTypes) {
    case "success":
      return toast.success(
        <>
          <div>
            <h3>{content.title}</h3>
            <p>{content.message}</p>
          </div>
        </>,
        {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    case "error":
      return toast.error(
        <>
          <div>
            <h3>{content.title}</h3>
            <p>{content.message}</p>
          </div>
        </>,
        {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    case "info":
      return toast.info(
        <>
          <div>
            <h3>{content.title}</h3>
            <p>{content.message}</p>
          </div>
        </>,
        {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    default:
      break;
  }
};

export default ToastNotification;
