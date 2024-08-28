import http from "k6/http";
import { CALCULATION_STATUSES, isSef, legacyThresholds } from "../constants/Constants.js";
import * as customMetrics from "../constants/Metrics.js";
import { getCalculationUrl } from "./UrlImpl.js";
import { setCookie } from "./ApiGw.js";
import { addAuthorizationHeader } from "./SefGw.js";
import { logMessageWithVU } from "../../../resources/query-sets/QuerySetFunctions.js";


export function getCalculation(id) {
    const url = `${getCalculationUrl()}${id}`;
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(url);
    }
    const response = http.get(url, params);
    const json = response.json();
    customMetrics.getCalculationDuration.add(response.timings.duration, { legacy: legacyThresholds });
    return json;
}

export function isCalculationDone(id, latestCollectedData) {
    const calculation = getCalculation(id);
    let executionGroups = new Set();
    let executionGroupsDone = new Set();
    for (let i = 0; i < calculation.readinessLogs.length; i++) {
        executionGroups.add(calculation.readinessLogs[i].datasource)
        if (calculation.readinessLogs[i].latestCollectedData.includes(latestCollectedData)) {
            executionGroupsDone.add(calculation.readinessLogs[i].datasource);
        }
    }
    return calculation.status === CALCULATION_STATUSES.FINISHED && executionGroups.size === executionGroupsDone.size;
}

export function getCalculations(elapsedMinutes = 120) {
    const url = `${getCalculationUrl()}?elapsedMinutes=${elapsedMinutes}`;
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(url);
    }
    const response = http.get(url, params);
    const json = response.json();
    customMetrics.getCalculationsDuration.add(response.timings.duration, { legacy: legacyThresholds });
    return json;
}

export function getFinishedCalculationIDs() {
    const calculations = getCalculations();
    let calculationIDs = [];
    for (let i = 0; i < calculations.length; i++) {
        if (calculations[i].status === CALCULATION_STATUSES.FINISHED) {
            calculationIDs.push(calculations[i].calculationId);
        }
    }
    return calculationIDs;
}

export function getComplexCalculationIdsByExecutionGroupAndReadinessLog(executionGroup, ropStartDate, datasource){
    let result = [];
    const calculations = getCalculations();
    const calculationIdsByExecutionGroup = getCalulationIdsByExecutionGroup(executionGroup, calculations);
    for (let i = 0; i < calculationIdsByExecutionGroup.length; i++) {
        let responseReadinessLog = getCalculation(calculationIdsByExecutionGroup[i]).readinessLogs;
        for (let j = 0; j < responseReadinessLog.length; j++) {
            if(responseReadinessLog[j].latestCollectedData === ropStartDate && responseReadinessLog[j].datasource.includes(datasource)){
                result.push(calculationIdsByExecutionGroup[i])
            }
        }
    }
    return result;
}

export function getSimpleCalculationIdsByExecutionGroupAndReadinessLog(executionGroup, ropStartDate){
    let result = [];
    const calculations = getCalculations();
    const calculationIdsByExecutionGroup = getCalulationIdsByExecutionGroup(executionGroup, calculations);
    for (let i = 0; i < calculationIdsByExecutionGroup.length; i++) {
        let responseReadinessLog = getCalculation(calculationIdsByExecutionGroup[i]).readinessLogs;
        for (let j = 0; j < responseReadinessLog.length; j++) {
            if(responseReadinessLog[j].latestCollectedData === ropStartDate){
                result.push(calculationIdsByExecutionGroup[i]);
            }
        }
    }
    return result;
}

export function getCalulationIdsByExecutionGroup(executionGroup, calculations){
    let calculationIdsByExecutionGroup = [];
    for (let i = 0; i < calculations.length; i++) {
        if(calculations[i].executionGroup.includes(executionGroup) && calculations[i].status === "FINISHED"){
            calculationIdsByExecutionGroup.push(calculations[i].calculationId);
        }
    }
    return calculationIdsByExecutionGroup;
}

export function runningQuerySet(querySet) {
    let querySetStart = Date.now();
    querySet();
    let querySetDuration = Math.floor(Date.now() - querySetStart);
    logMessageWithVU(`QuerySet duration: ${querySetDuration}`);
    customMetrics.durationsOfEachQuerySet.add(querySetDuration, { legacy: legacyThresholds });
}
