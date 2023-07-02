import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { Divider } from "primereact/divider";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { v4 as uuidv4 } from "uuid";
import { DataContext } from "../context/dataContext";
import { analyze } from "../services/kSecurityService";

const CONTENT_TYPE_APK = "application/vnd.android.package-archive";

function AnalyzeBreadCrumb() {
  const template = (item, options) => {
    return (
      <Link
        className={options.className}
        to={item.url}
        style={{ color: "#495057" }}
      >
        {item.icon ? (
          <span className={`p-menuitem-icon ${item.icon}`}></span>
        ) : (
          <span className={options.labelClassName}>{item.label}</span>
        )}
      </Link>
    );
  };

  const home = { icon: "pi pi-home", url: "/", template: template };
  const items = [{ label: "Analyze", url: "/analyze/" }];

  return (
    <BreadCrumb
      model={items}
      home={home}
      style={{ background: "transparent", border: 0 }}
    />
  );
}

function AnalyzeFileUpload({ maxFileSize, progress, uploadHandler }) {
  const [currentSize, setCurrentSizeState] = useState(0);
  const fileUpload = useRef(null);

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const size = currentSize / 1000000;
    const fileSize =
      fileUpload && fileUpload.current
        ? fileUpload.current.formatSize(currentSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{fileSize} / 100 MB</span>
          <ProgressBar
            value={size}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };
  const progressBarTemplate = () => {
    return <ProgressBar value={progress} showValue={false} />;
  };
  const itemTemplate = (file, props) => {
    const onRemove = (file, callback) => {
      setCurrentSizeState(currentSize - file.size);
      callback();
    };

    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "60%" }}>
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onRemove(file, props.onRemove)}
        />
      </div>
    );
  };
  const emptyTemplate = () => {
    const onClick = (_) => {
      document.getElementsByTagName("input")[0].click();
    };

    return (
      <div
        className="flex align-items-center flex-column"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div className="mt-3">
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

        <h3 className="my-5">Drag and Drop files here</h3>
        <p className="text-center">
          By submitting data above, you are agreeing to our{" "}
          <Link to="/">Terms of Service</Link> and{" "}
          <Link to="/">Privacy Policy</Link>, and to the
          <strong>
            {" "}
            sharing of <br />
            your Sample submission with the security community.
          </strong>{" "}
          Please do not submit any personal information; <br />
          KMA - Security is not responsible for the contents of your submission.{" "}
          <Link to="/">Learn more.</Link>
        </p>
      </div>
    );
  };
  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  const onSelect = (e) => {
    let files = e.files;
    let size = 0;

    Object.keys(files).forEach((key) => {
      size += files[key].size || 0;
    });
    setCurrentSizeState(size);
  };
  const onClear = () => {
    setCurrentSizeState(0);
  };

  return (
    <FileUpload
      ref={fileUpload}
      maxFileSize={maxFileSize}
      onSelect={onSelect}
      onClear={onClear}
      headerTemplate={headerTemplate}
      progressBarTemplate={progressBarTemplate}
      itemTemplate={itemTemplate}
      emptyTemplate={emptyTemplate}
      chooseOptions={chooseOptions}
      uploadOptions={uploadOptions}
      cancelOptions={cancelOptions}
      customUpload={true}
      uploadHandler={uploadHandler}
    />
  );
}

export default function AnalyzePage() {
  const navigate = useNavigate();
  const { setDataWindowAnalysis } = useContext(DataContext);
  const [progress, setProgessState] = useState(0);
  const toast = useRef(null);

  const uploadHandler = async (event) => {
    const file = event.files[0];
    const type = file.type === CONTENT_TYPE_APK ? "android" : "windows";
    let response;

    setProgessState(100);
    try {
      response = await analyze(file, type);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Failure",
        detail: error,
      });
      return;
    } finally {
      setProgessState(0);
    }

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "File uploaded!",
    });
    setTimeout(() => {
      let id = response.data.analysis_id;

      if (type == "windows") {
        id = uuidv4().replace(/-/g, "");
        setDataWindowAnalysis(response.data);
      }
      navigate(`/analyze/${type}/${id}`);
    }, 1500);
  };

  return (
    <>
      <Toast ref={toast}></Toast>

      <div className="flex flex-wrap gap-2 align-items-center mb-4">
        <h3 className="mr-3" style={{ marginBottom: 0 }}>
          Analyze
        </h3>
        <Divider layout="vertical" />
        <AnalyzeBreadCrumb />
      </div>

      <div className="card mb-5">
        <Tooltip
          target=".custom-choose-btn"
          content="Choose"
          position="bottom"
        />
        <Tooltip
          target=".custom-upload-btn"
          content="Analyze"
          position="bottom"
        />
        <Tooltip
          target=".custom-cancel-btn"
          content="Cancel"
          position="bottom"
        />

        <AnalyzeFileUpload
          maxFileSize={100000000}
          progress={progress}
          uploadHandler={uploadHandler}
        />
      </div>
    </>
  );
}
