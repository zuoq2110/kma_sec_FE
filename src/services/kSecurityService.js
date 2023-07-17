// const BASE_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;
const BASE_URL = "http://192.168.1.104:8000";
export const getDataAnalyzePage = () => {
    return JSON.parse(localStorage.getItem("dataAnalyze"));
};

export async function analyze(file, type) {
    const formData = new FormData();
    const url = new URL(`${BASE_URL}/api/v1/${type}/applications`);
    let response;

    formData.append("file", file);
    response = await fetch(url, { method: "POST", body: formData });
    return await response.json();
}

export async function updateModelState(idModel, newState) {
    const url = new URL(`${BASE_URL}/api/v1/models/${idModel}`);
    let response;

    response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify({
            state: `${newState}`,
        }),
    });

    const data = await response.json();
    return { status: response.status, data: data };
}

export async function getModels(type, page = 1, limit = 20) {
    const params = { input_format: type, page: page, limit: limit };
    const url = new URL(`${BASE_URL}/api/v1/models`);

    let response;

    Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
    );
    response = await fetch(url, { method: "GET" });
    return await response.json();
}

export async function getModelSource(id, format) {
    const url = new URL(`${BASE_URL}/api/v1/models/${id}/source`);

    url.searchParams.append("format", format);
    window.location.href = url;
}

export async function getAndroidAnalysis(page = 1, limit = 20) {
    const params = { page: page, limit: limit };
    const url = new URL(`${BASE_URL}/api/v1/android/applications`);
    let response;

    Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
    );
    response = await fetch(url, { method: "GET" });
    return response.json();
}

export async function getWindowAnalysis(page = 1, limit = 20) {
    const params = { page: page, limit: limit };
    const url = new URL(`${BASE_URL}/api/v1/windows/applications`);
    let response;

    Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
    );
    response = await fetch(url, { method: "GET" });
    return response.json();
}

export async function getModelDetails(id) {
    const url = new URL(`${BASE_URL}/api/v1/models/${id}`);
    const response = await fetch(url, { method: "GET" });

    return await response.json();
}

export async function getModelHistory(id) {
    const url = new URL(`${BASE_URL}/api/v1/models/${id}/history`);
    const response = await fetch(url, { method: "GET" });

    return await response.json();
}

export async function getModelDatasets(id) {
    const url = new URL(`${BASE_URL}/api/v1/models/${id}/datasets`);
    const response = await fetch(url, { method: "GET" });

    return await response.json();
}

export const isValidFilename = (filename, dataLabel) => {
    if (!dataLabel || !Array.isArray(dataLabel)) {
        return false;
    }
    const filteredDataLabel = dataLabel.filter((label) => label !== null);
    const lowercasedDataLabel = filteredDataLabel.map((label) =>
        label.toLowerCase()
    );
    const pattern = new RegExp(
        `^[a-zA-Z]+_(${lowercasedDataLabel.join("|")})+\\.apk$`,
        "i"
    );
    return pattern.test(filename);
};

export const validateVersionName = (value) => {
    const regex = /\d{1,3}.\d{1,3}.\d{1,3}/;
    return regex.test(value);
};

export const createModels = async(files, version, modelId, epoch) => {
    const formData = new FormData();
    const url = new URL(`${BASE_URL}/api/v1/models`);
    // const url = new URL(`https://7878-27-73-60-5.ngrok-free.app/api/v1/models`);

    let response;

    formData.append("version", version);
    formData.append("model_id", modelId);
    for (const file of files) {
        formData.append("dataset", file, file.name);
    }
    formData.append("epoch", epoch);

    response = await fetch(url, { method: "POST", body: formData });
    return await response.json();
};

export const getWindowDetails = async(id) => {
    const url = `${BASE_URL}/api/v1/windows/applications/${id}`;

    return fetch(url, { method: "GET" }).then((response) => response.json());
};