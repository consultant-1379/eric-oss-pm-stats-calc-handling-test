import { check } from "k6";
import http from "k6/http";
import exec from "k6/execution";
import { ODATA_FEATURES, globalQueryLimit, legacyThresholds, isSef, kafkaDataDate } from "../../tests/modules/constants/Constants.js";
import * as customMetrics from "../../tests/modules/constants/Metrics.js";
import { getQueryCalcResultUrl } from "../../tests/modules/implementations/UrlImpl.js";
import { setCookie } from "../../tests/modules/implementations/ApiGw.js";
import { addAuthorizationHeader } from "../../tests/modules/implementations/SefGw.js";


const timeout = "900s";
const topCut = `&${ODATA_FEATURES.TOP}=${globalQueryLimit}`;
const formattedDate = kafkaDataDate.toISOString().split("T")[0];


export function logMessageWithVU(message) {
    if (exec.scenario.name === "parallelQuerySet") {
        console.log(`${message} (VU: #${exec.vu.idInTest})`);
    } else {
        console.log(message);
    }
}

function executeQueryRequest(url, metric) {
    if (!url.includes(ODATA_FEATURES.TOP)) {
        url += topCut;
    }
    url = url.replace(/ /g, "%20").replace(/'/g, "%27");
    logMessageWithVU(`Query URL: ${url}`);
    let params = { timeout: timeout };
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(url);
    }
    const response = http.get(url, params);
    logMessageWithVU(`Status code: ${response.status}`);
    check(response, {
        "Status code is 200": (r) => r.status === 200
    }, { legacy: legacyThresholds });
    if (response.status !== 200) {
        logMessageWithVU(response.body);
        return;
    }
    logMessageWithVU(`Response time: ${response.timings.duration}`);
    metric.add(response.timings.duration, { legacy: legacyThresholds });
    customMetrics.queryResponse.add(response.timings.duration, { legacy: legacyThresholds });
    logMessageWithVU(`Got number of results: ${response.json().value.length}`);
}

export function randomizeQueries(queries) {
    return queries.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
}

export function getKpiCount(schema, table) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.COUNT}=true`;
    executeQueryRequest(queryUrl, customMetrics.queryKpiCount);
}

export function getKpiCountWithTop(schema, table) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.COUNT}=true&${ODATA_FEATURES.TOP}=3`;
    executeQueryRequest(queryUrl, customMetrics.queryKpiCountWithTop);
}

export function getTop(schema, table, filter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.TOP}=${filter}`;
    executeQueryRequest(queryUrl, customMetrics.queryTop);
}

export function getSkip(schema, table, filter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.SKIP}=${filter}`;
    executeQueryRequest(queryUrl, customMetrics.querySkip);
}

export function getTimeLess(schema, table, column, time) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=${column} le ${formattedDate}T${time}Z`;
    executeQueryRequest(queryUrl, customMetrics.queryTimeLess);
}

export function getTimeLarger(schema, table, column, time) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=${column} gt ${formattedDate}T${time}Z`;
    executeQueryRequest(queryUrl, customMetrics.queryTimeLarger);
}

export function getTimeLargerWithTop(schema, table, column, time) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=${column} ge ${formattedDate}T${time}Z&${ODATA_FEATURES.TOP}=3`;
    executeQueryRequest(queryUrl, customMetrics.queryTimeLargerWithTop);
}

export function getLessThan(schema, table, column, filter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=${column} lt ${filter}`;
    executeQueryRequest(queryUrl, customMetrics.queryLessThan);
}

export function getSelectWithFilter(schema, table, column, filterColumn, filter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.SELECT}=${column}&${ODATA_FEATURES.FILTER}=${filterColumn} ge ${filter}`;
    executeQueryRequest(queryUrl, customMetrics.querySelectWithFilter);
}

export function getContains(schema, table, column, filter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=contains(${column},'${filter.replace(/=/g, "%3D")}')`;
    executeQueryRequest(queryUrl, customMetrics.queryContains);
}

export function getContainsWithCount(schema, table, column, filter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=contains(${column},'${filter.replace(/=/g, "%3D")}')&${ODATA_FEATURES.COUNT}=true`;
    executeQueryRequest(queryUrl, customMetrics.queryContainsWithCount);
}

export function getContainsWithOrderBy(schema, table, column, containsFilter, orderColumn, orderFilter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=contains(${column},'${containsFilter.replace(/=/g, "%3D")}')&${ODATA_FEATURES.ORDER_BY}=${orderColumn} ${orderFilter}`;
    executeQueryRequest(queryUrl, customMetrics.queryContainsWithOrderBy);
}

export function getContainsSelectAndLessThan(schema, table, column1, containsFilter, column2, equalFilter, selectColumn) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=contains(${column1},'${containsFilter.replace(/=/g, "%3D")}') and ${column2} lt ${equalFilter}&${ODATA_FEATURES.SELECT}=${selectColumn}`;
    executeQueryRequest(queryUrl, customMetrics.queryContainsSelectAndLessThan);
}

export function getContainsSelectOrLessEqual(schema, table, column1, containsFilter, column2, equalFilter, selectColumn) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=contains(${column1},'${containsFilter.replace(/=/g, "%3D")}') or ${column2} le ${equalFilter}&${ODATA_FEATURES.SELECT}=${selectColumn}`;
    executeQueryRequest(queryUrl, customMetrics.queryContainsSelectOrLessEqual);
}

export function getOrderedLessthanWhithCount(schema, table, orderColumn, order, column, lessFilter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.ORDER_BY}=${orderColumn} ${order}&${ODATA_FEATURES.FILTER}=${column} lt ${lessFilter}&${ODATA_FEATURES.COUNT}=true`;
    executeQueryRequest(queryUrl, customMetrics.queryOrderedLessThanWithCount);
}

export function getOrderBywithLessEqualsLessThan(schema, table, orderColumn, orderFilter, column1, eqFilter1, column2, eqFilter2) {
    let queryUrl;
    if (column1 === "aggregation_begin_time") {
        queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.ORDER_BY}=${orderColumn} ${orderFilter}&${ODATA_FEATURES.FILTER}=${column1} le ${formattedDate}T${eqFilter1} and ${column2} lt ${eqFilter2}`;
    } else {
        queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.ORDER_BY}=${orderColumn} ${orderFilter}&${ODATA_FEATURES.FILTER}=${column1} le ${eqFilter1} and ${column2} lt ${eqFilter2}`;
    }
    executeQueryRequest(queryUrl, customMetrics.queryOrderByWithLessEqualsLessThan);
}

export function getTimeLargerAndContainsAndSelect(schema, table, column, time, containsColumn, containsFilter, selectColumn) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=${column} ge ${formattedDate}T${time}Z and contains(${containsColumn},'${containsFilter.replace(/=/g, "%3D")}')&${ODATA_FEATURES.SELECT}=${selectColumn}`;
    executeQueryRequest(queryUrl, customMetrics.queryTimeLargerAndContainsAndSelect);
}

export function getTimeEqualsWithOrderByAndTopAndCount(schema, table, column, time, orderColumn, orderFilter, topFilter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=${column} eq ${formattedDate}T${time}Z&${ODATA_FEATURES.ORDER_BY}=${orderColumn} ${orderFilter}&${ODATA_FEATURES.TOP}=${topFilter}&${ODATA_FEATURES.COUNT}=true`;
    executeQueryRequest(queryUrl, customMetrics.queryTimeEqualsWithOrderByAndTopAndCount);
}

export function getLessThanGreaterEqualsAndTopSkip(schema, table, lessColumn, lessFilter, greaterColumn, greaterFilter, topvalue, skipvalue) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=${lessColumn} lt ${lessFilter} and ${greaterColumn} ge ${greaterFilter}&${ODATA_FEATURES.TOP}=${topvalue}&${ODATA_FEATURES.SKIP}=${skipvalue}`;
    executeQueryRequest(queryUrl, customMetrics.queryCountWithLessThanGreaterEqualsAndTopSkip);
}

export function getCountWithLessThanGreaterEqualsAndTopSkip(schema, table, lessColumn, lessFilter, greaterColumn, greaterFilter, topvalue, skipvalue) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.COUNT}=true&${ODATA_FEATURES.FILTER}=${lessColumn} lt ${lessFilter} and ${greaterColumn} ge ${greaterFilter}&${ODATA_FEATURES.TOP}=${topvalue}&${ODATA_FEATURES.SKIP}=${skipvalue}`;
    executeQueryRequest(queryUrl, customMetrics.queryCountWithLessThanGreaterEqualsAndTopSkip);
}

export function getCountWithContainsAndGreaterAndSkip(schema, table, containsColumn, containsFilter, greaterColumn, greaterFilter, skipFilter) {
    const queryUrl = `${getQueryCalcResultUrl()}${schema}/${table}?${ODATA_FEATURES.FILTER}=contains(${containsColumn},'${containsFilter.replace(/=/g, "%3D")}') and ${greaterColumn} gt ${greaterFilter}&${ODATA_FEATURES.SKIP}=${skipFilter}`;
    executeQueryRequest(queryUrl, customMetrics.queryCountWithContainsAndGreaterAndSkip);
}
