import React, { useContext } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { DataContext } from "../context/dataContext";
import ToastNotification from "../components/ToastMessage";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;
const CONTENT_TYPE_APK = "application/vnd.android.package-archive";

const Analysis = () => {
  let infoToastRef = null;
  const navigate = useNavigate();
  const { setDataWindowAnalysis } = useContext(DataContext);

  const onChooseFile = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");

    input.addEventListener("change", function () {
      const file = input.files[0];

      if (file) {
        analyze(file);
      }
    });

    input.click();
  };
  const showCustomToast = () => {
    infoToastRef = ToastNotification(
      {
        title: "Analyzing...",
        message: "This analysis may take a few minutes",
      },
      "info"
    );
  };
  const hideCustomToast = () => {
    toast.dismiss(infoToastRef);
  };

  function analyze(file) {
    const formData = new FormData();
    let typeFile = "";
    formData.append("file", file);
    showCustomToast();
    file.name.includes(".apk")
      ? (typeFile = "android")
      : (typeFile = "windows");
    fetch(`${BASE_URL}/api/v1/${typeFile}/applications`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (response.status === 201) {
          return response.json();
        }

        const body = await response.json();

        throw new Error(body["message"]);
      })
      .then((response) => {
        const analysis_id = response["data"]["analysis_id"];
        let analysis_window = null;
        let type = null;

        switch (file.type) {
          case CONTENT_TYPE_APK:
            type = "android";
            break;

          default:
            type = "windows";
            analysis_window = uuidv4().replace(/-/g, "");
            setDataWindowAnalysis(response.data);
            break;
        }
        setTimeout(() => {
          if (type === "android") {
            navigate(`/analysis/android/${analysis_id}/`);
          } else {
            navigate(`/analysis/window/${analysis_window}/`);
          }
        }, 1500);
        hideCustomToast();
        notify(
          "Analyze application successfully! We will redirect in a few seconds",
          "success"
        );
      })
      .catch((error) => notify(error.message, "error"));
  }

  function notify(message, type) {
    const content = {
      title: "K-Security",
      message: message,
      // icon: "flaticon-alarm-1",
    };

    ToastNotification(content, type);
  }

  const dragOverHandler = (event) => {
    event.preventDefault();
  };

  const dropHandler = (event) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      [...event.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          analyze(item.getAsFile());
        }
      });
    }
  };

  return (
    <>
      <div className="main-panel">
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h4 className="page-title">Analysis</h4>
              <ul className="breadcrumbs">
                <li className="nav-home">
                  <a href="/">
                    <i className="flaticon-home"></i>
                  </a>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">
                  <span>Analysis</span>
                </li>
              </ul>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Dropzone</div>
              </div>
              <div className="card-body">
                <form
                  id="apk-files"
                  onDrop={(event) => dropHandler(event)}
                  onDragOver={(event) => dragOverHandler(event)}
                  method="post"
                  encType="multipart/form-data"
                  className="dropzone dz-clickable"
                  onClick={(event) => onChooseFile(event)}
                >
                  <div className="dz-message" data-dz-message="">
                    <div className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="80"
                        fill="currentColor"
                        viewBox="0 0 256 170"
                      >
                        <g>
                          <path
                            style={{ fill: "#20242c" }}
                            d="M71 8h80.9v29.1c0 2.2 1.8 4 4 4h30V47h8v-9.1c0-1.6-.6-3.1-1.7-4.2L161.1 1.8C160 .6 158.4 0 156.8 0H68c-2.8 0-5 2.2-5 5v42h8V8Zm88.9 4 20.5 21h-20.5V12Z"
                          ></path>
                          <path
                            style={{ fill: "#626c84" }}
                            fillRule="evenodd"
                            d="M185.9 161.9H71V59h-8v105.9c0 2.8 2.2 5 5 5h120.9c2.8 0 5-2.2 5-5V59h-8v102.9ZM103 63.3c.7.8 2 .9 2.8.2 1.8-1.6 4.6-3.2 8-4.5h-8.7c-.7.5-1.3 1-1.9 1.5-.9.7-.9 2-.2 2.8Zm49.5.1c.8-.8.7-2.1-.1-2.8l-1.8-1.5h-7.7c2.4 1.1 4.7 2.6 6.8 4.5.7.6 2 .6 2.8-.2Zm-41.1 51.7c-2.6-6.1-3.7-12.8-1.1-18.8 2.9-6.7 8.6-9.6 14.3-10.4 2.9-.4 5.7-.3 8.1.1 2.4.4 4.3 1.1 5.2 1.7 4.7 3.1 9.5 7.7 8.6 16.1-.1 1.1.7 2.1 1.8 2.2 1.1.1 2.1-.7 2.2-1.8 1.1-10.6-5.1-16.5-10.4-19.9-1.6-1-4-1.8-6.7-2.3-2.8-.5-6-.6-9.3-.1-6.7 1-13.8 4.5-17.4 12.8-3.2 7.4-1.7 15.4 1.1 21.9 2.8 6.6 7 12.2 9.8 15.2.7.8 2 .9 2.8.1.8-.7.9-2 .1-2.8-2.6-2.7-6.5-7.9-9.1-14ZM128 71.5c4.4-.1 11.3 1.2 17.5 4.9 6.3 3.8 12 10.2 13.9 20.3 1.2 6.1.7 10.7-1.2 13.9-1.9 3.2-5.1 4.6-8.3 4.6-3.2 0-6.5-1.3-9.1-3.3-2.6-2.1-4.7-5-5.3-8.5-.8-4.7-4.7-7.4-8.6-7.3-2 0-3.8.7-5.2 2.1-1.5 1.4-2.6 3.6-2.8 7-.4 6.6 3.6 12.4 8.7 16.8 2.5 2.1 5.1 3.9 7.4 5.1 2.3 1.2 4 1.8 4.6 1.9 1.1.1 1.8 1.1 1.7 2.2-.1 1.1-1.1 1.8-2.2 1.7-1.3-.2-3.6-1.1-6-2.4-2.4-1.3-5.4-3.2-8.1-5.6-5.5-4.7-10.7-11.7-10.1-20.1.2-4.1 1.7-7.3 3.9-9.5s5.1-3.3 7.9-3.3c5.6-.1 11.4 3.8 12.6 10.6.4 2.3 1.9 4.4 3.9 6 2 1.6 4.5 2.5 6.6 2.5 2.1 0 3.8-.8 4.9-2.7 1.2-2 1.8-5.5.7-11.1-1.7-8.7-6.6-14.2-12.1-17.5-5.6-3.4-11.7-4.5-15.4-4.4h-.1c-5.3-.2-17.6 2.1-24.3 12.1-3.2 5-4.3 11.2-4.2 17.2.1 6 1.4 11.5 2.5 14.6.4 1-.2 2.1-1.2 2.5-1 .4-2.1-.2-2.5-1.2-1.2-3.5-2.6-9.4-2.7-15.8-.1-6.4 1-13.5 4.9-19.4C108 73.8 122 71.3 128 71.5Zm5.8 42.5c3.1 3.6 8.7 6.6 18.6 6 1.1-.1 2 .8 2.1 2 0 1.1-.8 2-1.9 2.1-10.9.6-17.8-2.7-21.9-7.4-4-4.7-5-10.4-4.7-14.3 0-1.1 1-2 2.1-1.9 1.1 0 2 1 1.9 2.1-.2 3.1.6 7.7 3.8 11.4ZM95.2 83.5c-.5 1-1.8 1.3-2.7.7-1-.6-1.3-1.8-.7-2.7 4-6.5 17-19 38.2-19 18 0 30.5 12.6 34.7 18.9.6.9.3 2.2-.6 2.8-.9.6-2.2.3-2.8-.6-3.8-5.7-15.2-17.1-31.3-17.1-19.6 0-31.4 11.5-34.8 17Z"
                            clipRule="evenodd"
                          ></path>
                          <path
                            style={{ fill: " #0b4dda" }}
                            d="M185.9 47H0v12h256V47h-70.1Z"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <h4 className="message">Drag and Drop files here</h4>
                    <div className="note">
                      By submitting data above, you are agreeing to our{" "}
                      <a href="/">Terms of Service</a> and{" "}
                      <a href="/">Privacy Policy</a>, and to the
                      <strong>
                        {" "}
                        sharing of <br />
                        your Sample submission with the security community.
                      </strong>{" "}
                      Please do not submit any personal information; <br />
                      K-Security is not responsible for the contents of your
                      submission. <a href="/">Learn more.</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Analysis;
