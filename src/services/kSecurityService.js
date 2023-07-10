const BASE_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;

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

export async function getAnalysis(page = 1, limit = 20) {
  const params = { page: page, limit: limit };
  const url = new URL(`${BASE_URL}/api/v1/android/applications`);
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
