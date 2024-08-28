import { check, fail } from "k6";
import { getKpi, updateKpiDefinition, defineKpis, triggerOnDemandKpiCalc, softDeleteKpis, getKpiDefinitions } from "../implementations/CalculatorImpl.js";
import { checkCalculationStatus, areTablesCreated, areNamesCreated, areKpisSoftDeleted, waitForNumberOfCalculations } from "./ObservabilityChecks.js";
import { SCHEMAS, NewSimpleKpi, bodyForSoftDeleteAfterBur, STATUS_CODES, legacyThresholds } from "../constants/Constants.js";
import * as customMetrics from "../constants/Metrics.js";
import { checkResultsForKPI, checkerStatic } from "./QueryServiceChecks.js";
import { getRowCountOfTable } from "../implementations/QueryServiceImpl.js";
import { getFinishedCalculationIDs } from "../implementations/ObservabilityImpl.js";

var calculationID;

export function checkDefineKpis(kpis) {
  var res = defineKpis(kpis);
  console.log("kpi definition response: ", res.body);
  console.log("status: ", res.status);
  console.log("response.timings.duration: ", res.timings.duration);
  customMetrics.submitKpisDuration.add(res.timings.duration, { legacy: legacyThresholds });
  if (
    !check(res, {
      [`Status code is ${STATUS_CODES.CREATED}`]: (r) =>
        r.status === STATUS_CODES.CREATED || r.status === STATUS_CODES.ACCEPTED,
      ["KPIs successfully persisted to the database"]: (r) =>
        r
          .json()
          .successMessage.includes(
            "All KPIs proposed are validated and persisted to database"
          ),
    })
  )
    fail("KPI definitions cannot be validated and persisted: ", res.body);
}

export function checkTablesAreCreated(kpis, isShowDeleted){
  var res = getKpiDefinitions(isShowDeleted);
  console.log("kpi table create response: ", res.body);
  console.log("status: ", res.status);
  if (
    !check(res, {
      [`Status code is ${STATUS_CODES.OK}`]: (r) =>
        r.status === STATUS_CODES.OK,
      ["KPI's table created"]: (r) =>
        areTablesCreated(r, kpis) === true,
    })
  )
    fail("KPI's tables are not created: ", res.body);
}

export function checkNamesOfKpisAreCreated(kpis, isShowDeleted){
  var res = getKpiDefinitions(isShowDeleted);
  console.log("kpi name check response: ", res.body);
  console.log("status: ", res.status);
  if (
    !check(res, {
      [`Status code is ${STATUS_CODES.OK}`]: (r) =>
        r.status === STATUS_CODES.OK,
      ["KPI's name created"]: (r) =>
        areNamesCreated(r, kpis),
    })
  )
    fail("KPI's names are not created: ", res.body);
}

export function checkKpisSoftDeleteWithParameter(kpisNameList, isShowDeleted){
  var deletionResponse = softDeleteKpis(kpisNameList);
  console.log("Response soft deleted kpis" , "isShown: " + isShowDeleted, deletionResponse.body);
  console.log("status: ", deletionResponse.status);
  if (
    !check(deletionResponse, {
      [`Status code is ${STATUS_CODES.OK}`]: (r) =>
        r.status === STATUS_CODES.OK,
      ["KPIs successfully are soft deleted"]: (r) =>
        areKpisSoftDeleted(r, isShowDeleted),
    })
  )
    fail("Soft delete of kpi definitions are not successful: ", deletionResponse.body);
}


export function checkTriggerOnDemandKpiCalc() {

  var res = triggerOnDemandKpiCalc();
  console.log("response: ", res.body);
  console.log("status: ", res.status);
  console.log("calcucationID: ", res.json().calculationId);
  calculationID = res.json().calculationId;
  if (
    !check(res, {
      [`Status code is ${STATUS_CODES.CREATED}`]: (r) =>
        r.status === STATUS_CODES.CREATED,
      ["On-demand KPI calculation is successfully triggered"]: (r) =>
        r
          .json()
          .successMessage.includes(
            "Requested KPIs are valid and calculation has been launched"
          ),
    })
  )
    fail("Submitting on demand KPI is not successful: ", res.body);
}


export function checkStatusOfOnDemandCalc() {
  console.log("calculcationId: ", calculationID);
  checkCalculationStatus(calculationID);
}

export function checkUpdatedKpiDefinition(kpi_name, field, expectedValue){
  console.log("\tSearching for \""+ field + "\": \"" + expectedValue + "\" in KPI " + kpi_name);
  let kpi = getKpi(kpi_name);
  if(!check(kpi, {
    'Field of KPI contains expected value': (kpi) =>
    JSON.stringify(kpi[field]) == expectedValue || JSON.stringify(kpi[field]) == "\""+expectedValue+"\""
    })
  ){
      console.error("Expected \"" + field + "\": \"" + expectedValue + "\" not found in KPI " + kpi_name);
  }else{
      console.log("Expected \"" + field + "\": \"" + expectedValue + "\" found in KPI " + kpi_name)
  }
}

export function checkQueryOriginallyExistingAfterBackupAndRestore() {
  console.log("Query 'mo_sum_15_simple' KPI after backup- and restore process existed originally.");
  checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_1_15`, "mo_sum_15_simple", 150000, checkerStatic, [3000]);
}

export function checkPatchOriginallyExistingAfterBackupAndRestore() {
  const kip_to_update = "mo_sum_15_simple";

  console.log("Patch and check the KPI definiton parameter to provide exact value.");
  updateKpiDefinition(kip_to_update, {"exportable": true});
  checkUpdatedKpiDefinition(kip_to_update, "exportable", "true");
  console.log("Re-patch and check the KPI definiton parameter.");
  updateKpiDefinition(kip_to_update, {"exportable": false});
  checkUpdatedKpiDefinition(kip_to_update, "exportable", "false");
}

export function checkDeleteOriginallyExistingAfterBackupAndRestore() {
  const KpiForDelete = '["mo_count_1440_simple"]';

  console.log("Delete existing KPI after backup- and restore process.");
  // Delete KPI and check that exists or not
  checkKpisSoftDeleteWithParameter(KpiForDelete, false);
}

export function checkNewSubmitAndQueryAfterBackupAndRestore() {

  console.log("Submit-, query- and delete KPI after backup- and restore process.");
  // Define new KPI and check KPI definition
  checkDefineKpis(NewSimpleKpi);
  checkTablesAreCreated(NewSimpleKpi, "false");
  checkNamesOfKpisAreCreated(NewSimpleKpi, "false");

  const finishedCalculations = getFinishedCalculationIDs().length;
  waitForNumberOfCalculations(finishedCalculations + 3);

  // Check Query of the KPI
  const tableRowCount = getRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_for_bur_15`);
  if (
    !check(tableRowCount, {
      ["Table contains enough rows"]: (r) => r > 0
    })
  ) {
    console.error("KPI table created after backup does not contain any row!");
  }
}
