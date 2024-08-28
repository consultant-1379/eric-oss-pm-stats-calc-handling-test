import { isSef, KAFKA } from "./modules/constants/Constants.js";
import { checkTopicsAreDeletedSuccessfully } from "./modules/checks/KafkaChecks.js";
import { loginToApiGw, logoutFromApiGw } from "./use_cases/functional/00_ApiGw.js";
import { loginToSefGw } from "./use_cases/functional/00_SefGw.js";
import { checkPrerequisites } from "./use_cases/functional/00_SetUp.js";
import { defineKpis } from "./use_cases/functional/01_DefineKpis.js";
import { checkReadinessLogInObservabilityApi } from "./use_cases/functional/02_CheckDataOnObservabilityApi.js";
import { readScheduledKpisInOutputKafkaTopic } from "./use_cases/functional/03_ReadScheduledKpisFromStreamingOutput.js";
import { queryScheduledCalcResultsThroughRestAPI } from "./use_cases/functional/04_QueryScheduledKpisThroughRestApi.js";
import { triggerOnDemandKpiCalculation } from "./use_cases/functional/05_TriggerOnDemandKpis.js";
import { readOnDemandKpisInOutputKafkaTopic } from "./use_cases/functional/06_ReadOnDemandKpisFromStreamingOutput.js";
import { queryOnDemandCalcResultsThroughRestAPI } from "./use_cases/functional/07_QueryOnDemandKpisThroughRestApi.js";
import { updateKpiDefinitions } from "./use_cases/functional/08_UpdateKpiDefinitions.js";
import { softDeleteKpis } from "./use_cases/functional/09_KpisSoftDeletionThroughRestApi.js";
import { postChecks } from "./use_cases/functional/10_PostChecks.js";



export const options = {
  insecureSkipTLSVerify: true,
  teardownTimeout: '3m',
  duration: '80m',
  iterations: 1
};

export function handleSummary(data) {
  return {
      '/reports/summary.json': JSON.stringify(data),
  };
}

export default function () {
  if (isSef) {
    loginToSefGw();
  } else {
    loginToApiGw();
  }
  checkPrerequisites();
  defineKpis();
  checkReadinessLogInObservabilityApi();
  readScheduledKpisInOutputKafkaTopic();
  queryScheduledCalcResultsThroughRestAPI();
  triggerOnDemandKpiCalculation();
  readOnDemandKpisInOutputKafkaTopic();
  queryOnDemandCalcResultsThroughRestAPI();
  updateKpiDefinitions();
  softDeleteKpis();
  postChecks();
  if (!isSef) {
    logoutFromApiGw();
  }
}

export function teardown() {
  checkTopicsAreDeletedSuccessfully([
    KAFKA.DATA_LOADER_TOPIC,
    KAFKA.EXPORTER_SCHEDULED_TOPIC,
    KAFKA.EXPORTER_ONDEMAND_TOPIC
  ]);
}
