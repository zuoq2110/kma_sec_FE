const BASE_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;

export async function getAnalysis(page = 1, limit = 20) {
    const params = { page: page, limit: limit };
    const url = new URL(`${BASE_URL}/api/v1/android/applications`);

    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    return await fetch(url, { method: "GET" }).then((response) => response.json());
}
