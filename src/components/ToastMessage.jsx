import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = (content, toastTypes) => {
  switch (toastTypes) {
    case "success":
      return toast.success(
        <>
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {content.title}
            </p>
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
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {content.title}
            </p>{" "}
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
            <p
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {content.title}
            </p>{" "}
            <p>{content.message}</p>
          </div>
        </>,
        {
          toastId: "toast-loading",
          position: "bottom-right",
          autoClose: false,
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
