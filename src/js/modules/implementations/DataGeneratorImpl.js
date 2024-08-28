import http from "k6/http";
import { STATUS_CODES, URLS } from "../constants/Constants.js";


export function getDataGeneratorStatus() {
    const url = `${URLS.DATA_GENERATOR_ENDPOINT}/monitor`;
    console.log(`URL: ${url}`);
    const response = http.get(url);
    console.log(`Got status code: ${response.status}`);
    if (response.status !== STATUS_CODES.OK) {
        console.log(`Response body: ${response.body}`);
        return null;
    }
    const json = response.json();
    return json;
}

export function submitDataGeneratorConfigFile(config) {
    const url = `${URLS.DATA_GENERATOR_ENDPOINT}/configuration`;
    console.log(`URL: ${url}`);
    const params = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = http.post(url, config, params);
    console.log(`Got status code: ${response.status}`);
    if (response.status !== STATUS_CODES.CREATED) {
        console.log(`Response body: ${response.body}`);
        return false;
    }
    return true;
}
