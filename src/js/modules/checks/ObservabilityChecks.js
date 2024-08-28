import { check, fail, sleep } from "k6";
import { CALCULATION_STATUSES } from "../constants/Constants.js";
import { getCalculation, isCalculationDone, getCalculations, getFinishedCalculationIDs, runningQuerySet } from "../implementations/ObservabilityImpl.js";
import { collectAllKpiNames, collectAllTableNames } from "../implementations/DefImpl.js";
import { getKpiDefinitions } from "../implementations/CalculatorImpl.js";


export function waitForNumberOfCalculations(number) {
    let calculationIDs = [];
    while (calculationIDs.length < number) {
        console.log("Getting finished calculations");
        calculationIDs = getFinishedCalculationIDs();
        console.log(`Got calculations: ${JSON.stringify(calculationIDs)}`);
        sleep(10);
    }
}

export function allCalculationsDone(executionGroups, latestCollectedData, failOnFailed = true) {
    console.log("Getting finished execution groups");
    let executionGroupsDone = new Set();
    const calculations = getCalculations();
    for (let i = 0; i < calculations.length; i++) {
        if (failOnFailed && calculations[i].status === CALCULATION_STATUSES.FAILED) {
            fail(`Calculation failed: ${calculations[i].calculationId}`);
        }
        if (isCalculationDone(calculations[i].calculationId, latestCollectedData)) {
            executionGroupsDone.add(calculations[i].executionGroup);
        }
    }
    console.log(`Finished executions groups: ${JSON.stringify([...executionGroupsDone].sort())}`);

    for (let i = 0; i < executionGroups.length; i++) {
        if (!executionGroupsDone.has(executionGroups[i])) {
            return false;
        }
    }
    return true;
}

export function runQuerysUntilAllCalculationsAreDone(executionGroups, latestCollectedData, querySet, querySetTimeout = 250) {
    let querySetReply = 0;
    while (!allCalculationsDone(executionGroups, latestCollectedData)) {
        if (Date.now() > querySetReply) {
            runningQuerySet(querySet);
            querySetReply = Date.now() + 1000 * querySetTimeout;
        }
        sleep(10);
    }
    runningQuerySet(querySet);
}

export function checkCalculationStatus(id) {
    let calculationStatus;
    while (true) {
        const calculation = getCalculation(id);
        console.log(`Calculation status for ${id}: ${calculation.status}`)
        if (calculation.status === CALCULATION_STATUSES.FINISHED ||
            calculation.status === CALCULATION_STATUSES.FAILED ||
            calculation.status === CALCULATION_STATUSES.NOTHING_CALCULATED
        ) {
            calculationStatus = calculation.status;
            break;
        }
        sleep(10);
    }

    if (!check(calculationStatus, {
        [`The status of the calculation is ${CALCULATION_STATUSES.FINISHED}`]: (r) => r === CALCULATION_STATUSES.FINISHED
    })) {
        fail("Status is not what's expected!");
    }
}

export function checkGroupCollectedRows(group, rows) {
    console.log(`Getting collected rows of execution group: ${group}`);
    const calculations = getCalculations();
    let collectedRows = 0;
    for (let i = 0; i < calculations.length; i++) {
        if (calculations[i].executionGroup !== group) {
            continue;
        }
        const calculation = getCalculation(calculations[i].calculationId);
        for (let j = 0; j < calculation.readinessLogs.length; j++) {
            collectedRows += calculation.readinessLogs[j].collectedRowsCount;
        }
    }

    console.log(`Collected rows: ${collectedRows}`);
    if (!check(collectedRows, {
        ["Actual and expected collected rows are equal"]: (r) => r === rows
    })) {
        fail(`Rows number is not what's expected! Group: ${group}, Rows: ${collectedRows}`);
    }
}

export function areTablesCreated(response, kpis){
    var expectedTableNames = collectAllTableNames(kpis);
    console.log("Expected:", expectedTableNames);
    var responseTableNames = collectAllTableNames(response.body);
    console.log("Result:", responseTableNames);
    return checkFieldExists(responseTableNames, expectedTableNames);
}

export function areNamesCreated(response, kpis) {
    var expectedNames = collectAllKpiNames(kpis);
    console.log("Expected names:", expectedNames);
    var responseNames = collectAllKpiNames(response.body);
    console.log("Result names:", responseNames);
    return checkFieldExists(responseNames, expectedNames);
}

function checkFieldExists(responseFieldList, expectedFieldList) {
    for(let i = 0; i < expectedFieldList.length; i++){
        if(!responseFieldList.includes(expectedFieldList[i])){
            console.log("Missing field:", expectedFieldList[i])
            return false;
        }
    }
    return true;
}

export function areKpisSoftDeleted(deletionResponse, isShowDeleted) {
    let getAllResponse = getKpiDefinitions(isShowDeleted);
    let allKpiNamesInDB = collectAllKpiNames(getAllResponse.body);
    console.log("All defitions name in db:", allKpiNamesInDB);
    let deletedKpisNameList = JSON.parse(deletionResponse.body);
    console.log("Deleted kpis list:", deletedKpisNameList);
        for(let i = 0; i < deletedKpisNameList.length; i++) {
            console.log("Deleted kpi", deletedKpisNameList[i])
            if(allKpiNamesInDB.includes(deletedKpisNameList[i])){
                console.log("Not deleted kpi:", deletedKpisNameList[i])
                return false;
            }
        }
    return true;
}
