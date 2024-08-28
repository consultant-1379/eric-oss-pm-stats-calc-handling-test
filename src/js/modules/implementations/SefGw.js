import { check } from "k6";
import http from "k6/http";
import { URLS, STATUS_CODES } from "../constants/Constants.js";
import { getDefinitionUrl, getCalculationUrl, getQueryCalcResultUrl } from "./UrlImpl.js";


let token;
let tokenRefresh;
let tokenTime;

export function addAuthorizationHeader(params) {
    const currentTime = new Date();
    if (!tokenTime || (currentTime - tokenTime) / 1000 > tokenRefresh) {
        generateToken(__ENV.APIGW_USER, __ENV.APIGW_PASSWORD);
    }

    if (!("headers" in params)) {
        params.headers = {};
    }
    params.headers["Authorization"] = `Bearer ${token}`;
    return params;
}

export function generateToken(username, password) {
    console.log(`Getting new token for '${username}' user`);
    const url = `${URLS.GAS_URL}/auth/realms/master/protocol/openid-connect/token`;
    const payload = {
        grant_type: "password",
        username: username,
        password: password,
        client_id: "eo",
        client_secret: __ENV.SEF_CLIENT_SECRET
    };
    console.log(`URL: ${url}`);
    console.log(`Request payload: ${JSON.stringify(payload)}`);
    const response = http.post(url, payload);
    console.log(`Status code: ${response.status}`);
    console.log(`Response body: ${response.body}`);

    const json = response.json();
    token = json.access_token;
    tokenRefresh = json.expires_in - 30;
    tokenTime = new Date();
    return response;
}

export function createUser(user) {
    generateToken(__ENV.SEF_ADMIN_USER, __ENV.SEF_ADMIN_PASSWORD);
    console.log(`Creating user '${user.user.username}'`);
    const url = `${URLS.GAS_URL}/idm/usermgmt/v1/users`;
    const params = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    console.log(`URL: ${url}`);
    const response = http.post(url, JSON.stringify(user), params);
    console.log(`Status code: ${response.status}`);
    console.log(`Response body: ${response.body}`);
    return response;
}

export function checkUrlsForUser(user, permissions) {
    createUser(user);
    generateToken(user.user.username, __ENV.APIGW_PASSWORD);

    let params = {};
    params = addAuthorizationHeader(params);
    const urls = [
        {
            name: "Get KPI definitions",
            response: http.get(getDefinitionUrl(), params),
            expectedStatus: permissions.readonly ? STATUS_CODES.OK : STATUS_CODES.FORBIDDEN
        }, {
            name: "Post KPI definitions",
            response: http.post(getDefinitionUrl(), JSON.stringify({}), params),
            expectedStatus: permissions.admin ? STATUS_CODES.OK : STATUS_CODES.FORBIDDEN
        }, {
            name: "Get calculations",
            response: http.get(getCalculationUrl(), params),
            expectedStatus: permissions.readonly ? STATUS_CODES.OK : STATUS_CODES.FORBIDDEN
        }, {
            name: "Trigger calculations",
            response: http.post(getCalculationUrl(), JSON.stringify({}), params),
            expectedStatus: permissions.admin ? STATUS_CODES.OK : STATUS_CODES.FORBIDDEN
        }, {
            name: "Get KPI results",
            response: http.get(getQueryCalcResultUrl(), params),
            expectedStatus: permissions.readonly ? STATUS_CODES.NOT_FOUND : STATUS_CODES.FORBIDDEN
        }
    ];

    for (let i = 0; i < urls.length; i++) {
        console.log(`Status code for '${urls[i].name}': ${urls[i].response.status}`);
        if (!check(urls[i], {
            [urls[i].name]: (r) => r.response.status === r.expectedStatus
        })) {
            console.error(`Status code is not as expected! (Expected: ${urls[i].expectedStatus}, Got: ${urls[i].response.status})`);
            console.error(`Response body: ${urls[i].response.body}`);
        }
    }
}
