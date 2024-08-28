import { check, fail, sleep } from "k6";
import { STATUS_CODES} from "../constants/Constants.js";
import { preloadDatabase, isPreloadingRunning, restartCalculatorPod, getRowCountOfTableWithSidecar } from "../implementations/DatabaseImpl.js";
import { getKpiDefinitions } from "../implementations/CalculatorImpl.js";
import { poll } from "../implementations/KafkaImpl.js";


export function checkPreloadedDatabase(kpiSet, number_of_preloaded_days){
  console.log("Executing database loader script");
  console.log("KPI set: " + kpiSet);
  console.log("Number of preloaded days: " + number_of_preloaded_days);
  let res = preloadDatabase(kpiSet, number_of_preloaded_days);
  console.log("full response: " + JSON.stringify(res));
  console.log("status: " + res.status);
  if (
    !check(res, {
    [`Status code is ${STATUS_CODES.OK}`]: (r) =>
    r.status === STATUS_CODES.OK,
    })
  )
  fail("Database preloading was not successful.", res.status);

  for (let i=1; i<60; i++){
    console.log("Check status of loader script " + i);
    if (!isPreloadingRunning(kpiSet)) break;
    sleep(60);
  }
}

export function checkRestartCalculator() {
    const restartStatus = restartCalculatorPod();
    if (!check(restartStatus, {
        ["Calculator restart is triggered"]: (r) => r
    })) {
        fail("Failed to trigger calculator restart!");
    }

    const response = poll({
        interval: 10,
        times: 30,
        pollingFunction: getKpiDefinitions,
        pollingFunctionArgs: [false],
        checker: (response) => {
            console.log(`Got status code: ${response.status}`);
            return response.status === STATUS_CODES.OK;
        }
    });
    if (!check(response, {
        ["Calculator is running again"]: (r) => r.status === STATUS_CODES.OK
    })) {
        fail("Calculator failed to start in time!");
    }
}

export function checkRowCountOfTableWithSidecar(table, expectedRowCount) {
    const tableRowCount = getRowCountOfTableWithSidecar(table);
    if (!check(tableRowCount, {
        ["Number of results for table are correct"]: (r) => r === expectedRowCount
    })) {
        fail(`Row count for '${table}' is unexpected! Expected: ${expectedRowCount}`);
    };
}
