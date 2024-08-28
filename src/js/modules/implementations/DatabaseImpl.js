import http from "k6/http";
import { URLS, STATUS_CODES } from "../constants/Constants.js";


export function preloadDatabase(kpiSet, number_of_preloaded_days){
    let params = `kpiSet=${kpiSet}&number_of_preloaded_days=${number_of_preloaded_days}`;
    console.log('Loading database request with parameters:');
    console.log(URLS.KAFKA_SIDECAR_ENDPOINT + '/load-db?' + params);
    let res = http.post(`${URLS.KAFKA_SIDECAR_ENDPOINT}/load-db?${params}`);
    console.log('http post response: ' + JSON.stringify(res));
    return res;
}

export function isPreloadingRunning(kpiSet){
    let params = `kpiSet=${kpiSet}`;
    let res = http.get(`${URLS.KAFKA_SIDECAR_ENDPOINT}/get-dbloading-status?${params}`);
    console.log('http get response: ' + JSON.stringify(res));
    console.log('resp. status: ' + res.status);
    console.log('resp. body: ' + res.body);
    return res.body.includes("DB loader script is running");
}

export function restartCalculatorPod() {
    console.log("Triggering calculator restart");
    const response = http.post(`${URLS.KAFKA_SIDECAR_ENDPOINT}/restart-calculator-pod`);
    return response.status === STATUS_CODES.OK;
}

export function getRowCountOfTableWithSidecar(table) {
    const url = `${URLS.KAFKA_SIDECAR_ENDPOINT}/get-table-row-count?table=${table.split("/")[1]}`;
    console.log(`URL: ${url}`);
    const params = { timeout: "300s" };
    const response = http.get(url, params);
    const rowCount = response.json();
    console.log(`Got row count: ${rowCount}`);
    return rowCount;
}
