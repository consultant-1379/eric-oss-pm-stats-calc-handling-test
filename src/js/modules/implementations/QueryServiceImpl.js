import http from "k6/http";
import { ODATA_FEATURES, isSef, globalQueryLimit } from "../constants/Constants.js";
import { getQueryCalcResultUrl } from "./UrlImpl.js";
import { setCookie } from "./ApiGw.js";
import { addAuthorizationHeader } from "./SefGw.js";


export function getKpis(schema) {
    let queryUrl = `${getQueryCalcResultUrl()}${schema}/`;
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(queryUrl);
    }
    console.log("query service url from UrlImpl: ", getQueryCalcResultUrl());
    return http.get(queryUrl, params);
}

export function getKpiSelect(schema, kpiName, column){
    let queryUrl = `${getQueryCalcResultUrl()}${schema}/${kpiName}?${ODATA_FEATURES.SELECT}=${column}`;
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(queryUrl);
    }
    console.log("query service url to KPI column select: ", queryUrl);
    return http.get(queryUrl, params);
}

export function getKpiFilterEqual(schema, kpiName, filter, column){
    let queryUrl = `${getQueryCalcResultUrl()}${schema}/${kpiName}?${ODATA_FEATURES.FILTER}=${column} eq ${filter}`;
    queryUrl = queryUrl.replace(/ /g, "%20").replace(/'/g, "%27");
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(queryUrl);
    }
    console.log("query service url to get KPI with filter: ", queryUrl.toString());
    return http.get(queryUrl, params);
}

export function getGreaterThen(schema, kpiName, filter, column){
    let queryUrl = `${getQueryCalcResultUrl()}${schema}/${kpiName}?${ODATA_FEATURES.FILTER}=${column} gt ${filter}`;
    queryUrl = queryUrl.replace(/ /g, "%20").replace(/'/g, "%27");
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(queryUrl);
    }
    console.log("query service url to get KPI with filter: ", queryUrl.toString());
    return http.get(queryUrl, params);
}

export function getRowCountOfTable(table) {
    const url = `${getQueryCalcResultUrl()}${table}?${ODATA_FEATURES.COUNT}=true&${ODATA_FEATURES.TOP}=0`;
    console.log(`Query URL: ${url}`);
    let params = { timeout: "180s" };
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(url);
    }
    const response = http.get(url, params);
    const rowCount = response.json()["@odata.count"];
    console.log(`Got row count: ${rowCount}`);
    return rowCount;
}

export function getRowsOfTable(table, offset) {
    const url = `${getQueryCalcResultUrl()}${table}?${ODATA_FEATURES.TOP}=${globalQueryLimit}&${ODATA_FEATURES.SKIP}=${offset}`;
    console.log(`Query URL: ${url}`);
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(url);
    }
    const response = http.get(url, params);
    const rows = response.json().value;
    console.log(`Got ${rows.length} rows of results`);
    return rows;
}

export function getFirstAggregationPeriodOfTable(table) {
    const url = `${getQueryCalcResultUrl()}${table}?${ODATA_FEATURES.SELECT}=aggregation_begin_time&${ODATA_FEATURES.ORDER_BY}=aggregation_begin_time%20asc&${ODATA_FEATURES.TOP}=1`;
    console.log(`Query URL: ${url}`);
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(url);
    }
    const response = http.get(url, params);
    const aggBeginTime = response.json().value[0]["aggregation_begin_time"];
    console.log(`Got: ${aggBeginTime}`);
    return aggBeginTime;
}

export function getAggregationPeriodByTableName(table) {
    const tableAggPeriod = table.match(/kpi_.+_(\d+)/);
    if (!tableAggPeriod) {
        return null;
    }
    return parseInt(tableAggPeriod[1]);
}

export function getAggregationPeriodForRow(tableAggPeriod, firstAggBegin, rowAggBegin) {
    const firstDate = new Date(firstAggBegin);
    const rowDate = new Date(rowAggBegin);
    const diffMinutes = (rowDate - firstDate) / 60000;
    return Math.floor(diffMinutes / tableAggPeriod) + 1;
}
