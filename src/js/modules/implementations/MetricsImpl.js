import { check } from "k6";
import http from "k6/http";
import { URLS, isSef, kafkaDataDate, legacyThresholds } from "../constants/Constants.js";
import * as customMetrics from "../constants/Metrics.js";
import { setCookie } from "./ApiGw.js";
import { addAuthorizationHeader } from "./SefGw.js";
import { getComplexCalculationIdsByExecutionGroupAndReadinessLog, getFinishedCalculationIDs, getSimpleCalculationIdsByExecutionGroupAndReadinessLog } from "./ObservabilityImpl.js";


export function getMetrics(expression) {
    console.log(`Getting metrics from Prometheus: ${expression}`);
    const url = `${URLS.GAS_URL}/metrics/viewer/api/v1/query?query=${encodeURIComponent(expression)}`;
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(url);
    }
    const response = http.get(url, params);
    console.log(`Got status code: ${response.status}`);
    const data = response.json().data.result;
    console.log(`Got number of values: ${data.length}`);
    check(response, {
        ["Status code is 200"]: (r) => r.status === 200,
        ["Got value from metric"]: () => data.length
    }, { legacy: legacyThresholds });

    return data;
}

export function checkExporterMetrics() {
    const calculationIDs = getFinishedCalculationIDs().join("|");
    const firstCalculationStarts = getMetrics(`sort(pm_stats_calculator_spark_calculation_start_time_value{calculation_id=~"${calculationIDs}"})`)[0].value[1];
    const unixTestStartTime = Math.floor(firstCalculationStarts / 1000);

    const exportMetrics = getMetrics(`topk(1, pm_stats_exporter_cts_avro_export{id=~"${calculationIDs}"}) by (id, table, start, end, instance) - on (id) group_left() topk(1, pm_stats_exporter_exec_arrive) by (id)`);
    for (let i = 0; i < exportMetrics.length; i++) {
        customMetrics.executionReportToExportTime.add(exportMetrics[i].value[1], { legacy: legacyThresholds });
    }

    const execReportCountMetric = getMetrics(`sum(pm_stats_exporter_execution_report_timer_seconds_count) - sum(pm_stats_exporter_execution_report_timer_seconds_count @ ${unixTestStartTime} or vector(0))`)[0].value[1];
    customMetrics.executionReportCount.add(execReportCountMetric, { legacy: legacyThresholds });

    const execReportSumMetric = getMetrics(`sum(pm_stats_exporter_execution_report_timer_seconds_sum) - sum(pm_stats_exporter_execution_report_timer_seconds_sum @ ${unixTestStartTime} or vector(0))`)[0].value[1];
    customMetrics.executionReportSum.add(execReportSumMetric * 1000, { legacy: legacyThresholds });

    const execReportMaxMetric = getMetrics("max(max_over_time(pm_stats_exporter_execution_report_timer_seconds_max[1h]))")[0].value[1];
    customMetrics.executionReportMax.add(execReportMaxMetric * 1000, { legacy: legacyThresholds });
}

export function checkCalculatorMetricsForCharacteristics() {
    const calculationIDs = getFinishedCalculationIDs().join("|");
    const firstCalculationStarts = getFirstCalculationStartsTime(calculationIDs);
    const lastCalculationEnds = getLastCalculationEndsTime(calculationIDs);
    const lastBatchTime = kafkaDataDate.toISOString().split('T')[0] + "T23:45:00";

    // Time between first batch becomes available on Kafka and first calculation starts
    getTimeBetweenFirstBatchAvailableAndFirstCalcStart(calculationIDs);

    // Time between first batch becomes available on Kafka and last calculation ends
    getTimeBetweenFirstBatchAvailableAndLastCalcEnds(calculationIDs);

    // Time between first calculation starts and last calculation ends
    getTimeBetweenFirstCalcStartsAndLastCalcEnds(firstCalculationStarts, lastCalculationEnds);

    // Calculation duration for Simple KPIs
    getcalcDurationForSimpleKPIs(calculationIDs, ["ManagedObject"]);

    // Calculation duration for Complex KPIs
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["group"], customMetrics.calculationDurationForComplexKPIs);

    // Calculation duration for OnDemand KPIs
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["ON_DEMAND"], customMetrics.calculationDurationForOnDemandKPIs);

    // 4 Average and maximum time of daily Simple KPIs calculations from start to finish
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["ManagedObject2"], customMetrics.averageAndMaximumTimeOfDailySimpleCalculationsFromStartToFinishManagedObject2);

    //  Average and maximum time of quarterly Complex KPIs calculations from start to finish
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["ManagedObject3"], customMetrics.averageAndMaximumTimeOfQuarterlySimpleCalculationsFromStartToFinishManagedObject3);

    // 2 Time between data becoming available on Kafka and all Simple KPI calculations finished
    getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(5, "ManagedObject1" , lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedManagedObject1);
    getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(5, "ManagedObject2" , lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedManagedObject2);
    getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(5, "ManagedObject3" , lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedManagedObject3);
    
    // 5 Time between data becoming available on Kafka and all Scheduled hourly Complex KPI calculations finished
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup (5, "group1", "ManagedObject3", lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedManagedObject3);
}

export function getTimeWhenBatchBecomesAvailableOnKafkaById(batchId){
    return 1000 * getMetrics(`sentData{batchId="${batchId}"}`)[0]["metric"]["endTime"];
};

export function getFirstCalculationStartsTime(calculationIDs){
    return getMetrics(`sort(pm_stats_calculator_spark_calculation_start_time_value{calculation_id=~"${calculationIDs}"})`)[0].value[1];
}

export function getLastCalculationEndsTime(calculationIDs){
    return getMetrics(`sort_desc(pm_stats_calculator_spark_calculation_end_time_value{calculation_status="FINALIZING", calculation_id=~"${calculationIDs}"})`)[0].value[1];
}

export function getTimeBetweenFirstBatchAvailableAndFirstCalcStart(calculationIDs){
    let diff  = Math.round((getFirstCalculationStartsTime(calculationIDs) - getTimeWhenBatchBecomesAvailableOnKafkaById(1)) / 1000); // in sec
    customMetrics.timeBetweenFirstBatchBecomesAvailableOnKafkaAndFirstCalculationStarts.add(diff, { legacy: legacyThresholds });
}

export function getTimeBetweenFirstBatchAvailableAndLastCalcEnds(calculationIDs){
    let diff  = Math.round((getLastCalculationEndsTime(calculationIDs) - getTimeWhenBatchBecomesAvailableOnKafkaById(1)) / 1000); // in sec
    customMetrics.timeBetweenFirstBatchBecomesAvailableOnKafkaAndLastCalculationEnds.add(diff, { legacy: legacyThresholds });
}

export function getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup(batchId, executionGroup, datasource, ropStartDate, metric){
    let calculationIDs = getComplexCalculationIdsByExecutionGroupAndReadinessLog(executionGroup, ropStartDate, datasource).join("|");
    let diff  = Math.round((getMetrics(`sort_desc(pm_stats_calculator_spark_calculation_end_time_value{execution_group=~".*${executionGroup}.*", calculation_id=~"${calculationIDs}"})`)[0].value[1] - getTimeWhenBatchBecomesAvailableOnKafkaById(batchId)) / 1000); // in sec
    metric.add(diff, { legacy: legacyThresholds });
}

export function getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(batchId, executionGroup, ropStartDate, metric){
    let calculationIDs = getSimpleCalculationIdsByExecutionGroupAndReadinessLog(executionGroup, ropStartDate).join("|");
    let diff  = Math.round((getMetrics(`sort_desc(pm_stats_calculator_spark_calculation_end_time_value{execution_group=~".*${executionGroup}.*", calculation_id=~"${calculationIDs}"})`)[0].value[1] - getTimeWhenBatchBecomesAvailableOnKafkaById(batchId)) / 1000); // in sec
    metric.add(diff, { legacy: legacyThresholds });
}

export function getTimeBetweenFirstCalcStartsAndLastCalcEnds(firstCalculationStarts, lastCalculationEnds){
    customMetrics.timeBetweenFirstCalculationStartsAndLastCalculationEnds.add(Math.round((lastCalculationEnds - firstCalculationStarts) / 1000), { legacy: legacyThresholds });
}

export function getcalcDurationForSimpleKPIs(calculationIDs, executionGroups){
    for (let i = 0; i < executionGroups.length; i++) {
        let calcDurationForSimpleKPIs = getMetrics(`pm_stats_calculator_spark_calculation_duration_value{execution_group=~".*${executionGroups[i]}.*", calculation_id=~"${calculationIDs}"}`);
        for (let j = 0; j < calcDurationForSimpleKPIs.length; j++) {
            customMetrics.calculationDurationForSimpleKPIs.add(calcDurationForSimpleKPIs[j].value[1] / 1000, { legacy: legacyThresholds });
        }
    }
}

export function getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, executionGroups, metric){
    for (let i = 0; i < executionGroups.length; i++) {
        let calcDurationForKPIs = getMetrics(`pm_stats_calculator_spark_calculation_duration_value{execution_group=~".*${executionGroups[i]}.*", calculation_id=~"${calculationIDs}"}`);
        for (let j = 0; j < calcDurationForKPIs.length; j++) {
            metric.add(calcDurationForKPIs[j].value[1] / 1000, { legacy: legacyThresholds });
        }
    }
}

export function getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(batchId, executionGroup, datasource, ropStartDate, metric, kpi){
    let calculationIDs = getComplexCalculationIdsByExecutionGroupAndReadinessLog(executionGroup, ropStartDate, datasource).join("|");
    if(getMetrics(`sort_desc(pm_stats_exporter_cts_avro_export{id=~"${calculationIDs}", kpi=~"${kpi}"})`).length) {
        let diff  = Math.round(((getMetrics(`sort_desc(pm_stats_exporter_cts_avro_export{id=~"${calculationIDs}", kpi=~"${kpi}"})`)[0].value[1] - getTimeWhenBatchBecomesAvailableOnKafkaById(batchId))) / 1000); // in sec
        metric.add(diff, { legacy: legacyThresholds });
    }
}

export function getTimeBetweenNthBatchAvailableAndSimpleKPIsAreExportedByExecutionGroup(batchId, executionGroup, ropStartDate, metric, kpi){
    let calculationIDs = getSimpleCalculationIdsByExecutionGroupAndReadinessLog(executionGroup, ropStartDate).join("|");
    if(getMetrics(`pm_stats_exporter_cts_avro_export{id=~"${calculationIDs}", kpi=~"${kpi}"}`).length) {
        let diff  = Math.round((getMetrics(`pm_stats_exporter_cts_avro_export{id=~"${calculationIDs}", kpi=~"${kpi}"}`)[0].value[1] - getTimeWhenBatchBecomesAvailableOnKafkaById(batchId)) / 1000); // in sec
        metric.add(diff, { legacy: legacyThresholds });
    }
}

export function checkExporterMetricsCPI(){
    const calculationIDs = getFinishedCalculationIDs().join("|");
    const firstCalculationStarts = getMetrics(`sort(pm_stats_calculator_spark_calculation_start_time_value{calculation_id=~"${calculationIDs}"})`)[0].value[1];
    const unixTestStartTime = Math.floor(firstCalculationStarts / 1000);
    const lastRopTime = kafkaDataDate.toISOString().split('T')[0] + "T23:45:00";

    const exportMetrics = getMetrics(`topk(1, pm_stats_exporter_cts_avro_export{id=~"${calculationIDs}"}) by (id, table, start, end, instance) - on (id) group_left() topk(1, pm_stats_exporter_exec_arrive) by (id)`);
    for (let i = 0; i < exportMetrics.length; i++) {
        customMetrics.executionReportToExportTime.add(exportMetrics[i].value[1], { legacy: legacyThresholds });
    }

    const execReportCountMetric = getMetrics(`sum(pm_stats_exporter_execution_report_timer_seconds_count) - sum(pm_stats_exporter_execution_report_timer_seconds_count @ ${unixTestStartTime} or vector(0))`)[0].value[1];
    customMetrics.executionReportCount.add(execReportCountMetric, { legacy: legacyThresholds });

    const execReportSumMetric = getMetrics(`sum(pm_stats_exporter_execution_report_timer_seconds_sum) - sum(pm_stats_exporter_execution_report_timer_seconds_sum @ ${unixTestStartTime} or vector(0))`)[0].value[1];
    customMetrics.executionReportSum.add(execReportSumMetric * 1000, { legacy: legacyThresholds });

    const execReportMaxMetric = getMetrics("max(max_over_time(pm_stats_exporter_execution_report_timer_seconds_max[1h]))")[0].value[1];
    customMetrics.executionReportMax.add(execReportMaxMetric * 1000, { legacy: legacyThresholds });

    // 12. time between data becoming available on Kafka and hourly scheduled KPIs are exported
    //getTimeBetweenNthBatchAvailableAndSimpleKPIsAreExportedByExecutionGroup(5, "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndHourlySimpleKPIsExportedToKafkaFDD, "pm_cell_downtime_auto_hourly_TDD");
    //getTimeBetweenNthBatchAvailableAndSimpleKPIsAreExportedByExecutionGroup(6, "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndHourlySimpleKPIsExportedToKafkaTDD, "pm_radio_thp_vol_ul_hourly_TDD");
    //getTimeBetweenNthBatchAvailableAndSimpleKPIsAreExportedByExecutionGroup(6, "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndQuarterlySimpleKPIsExportedToKafkaTDD, "pm_cell_ho_exe_TDD");
    //getTimeBetweenNthBatchAvailableAndSimpleKPIsAreExportedByExecutionGroup(5, "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndQuarterlySimpleKPIsExportedToKafkaFDD, "pm_ue_thp_time_ul_TDD");

    // 12. time between data becoming available on Kafka and hourly scheduled KPIs are exported
    getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(6, "group1", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndHourlyComplexKPIsExportedToKafkaTDD, "final_avg_dl_mac_cell_throughtput_hourly");
    getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(5, "group1", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndHourlyComplexKPIsExportedToKafkaFDD, "final_cell_availability_hourly");

    //13. time between data becoming available on Kafka and daily scheduled KPIs are exported to Kafka
    getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(6, "group2", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndDailyComplexKPIsExportedToKafkaTDD, "final_avg_dl_mac_cell_throughtput_daily");
    getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(5, "group2", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndDailyComplexKPIsExportedToKafkaFDD, "final_avg_dl_mac_cell_throughtput_daily");
    getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(6, "group3", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndQuarterlyComplexKPIsExportedToKafkaTDD, "final_added_erab_estab_succ_rate");
    getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(5, "group3", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndQuarterlyComplexKPIsExportedToKafkaFDD, "final_average_dl_pdcp_ue_throughput");
}

export function checkCalculatorMetricsForCPI() {
    const calculationIDs = getFinishedCalculationIDs().join("|");
    const firstCalculationStarts = getFirstCalculationStartsTime(calculationIDs);
    const lastCalculationEnds = getLastCalculationEndsTime(calculationIDs);
    const lastRopTime = kafkaDataDate.toISOString().split('T')[0] + "T23:45:00";//+Z

    // Time between first batch becomes available on Kafka and first calculation starts
    getTimeBetweenFirstBatchAvailableAndFirstCalcStart(calculationIDs);

    // Time between first batch becomes available on Kafka and last calculation ends
    getTimeBetweenFirstBatchAvailableAndLastCalcEnds(calculationIDs);

    // Time between first calculation starts and last calculation ends
    getTimeBetweenFirstCalcStartsAndLastCalcEnds(firstCalculationStarts, lastCalculationEnds);

    // Calculation duration for Simple KPIs
    getcalcDurationForSimpleKPIs(calculationIDs, ["EUtranCell"]);

    // Calculation duration for Complex KPIs
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["group"], customMetrics.calculationDurationForComplexKPIs);

    //6 average and maximum time of hourly Complex KPIs calculations from start to finish
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["group1"], customMetrics.averageAndMaximumTimeOfHourlyComplexCalculationsFromStartToFinish);

    //8 average and maximum time of daily Complex KPIs calculations from start to finish
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["group2"], customMetrics.averageAndMaximumTimeOfDailyComplexCalculationsFromStartToFinish);

    // average and maximum time of 15min Complex KPIs calculations from start to finish
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["group3"], customMetrics.averageAndMaximumTimeOfQuarterlyComplexCalculationsFromStartToFinish);

    // 2 Time between data becoming available on Kafka and all Simple KPI calculations finished
    getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(6, "EUtranCellTDD" , lastRopTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedTDD);
    getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(5, "EUtranCellFDD" , lastRopTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedFDD);

    // 5 Time between data becoming available on Kafka and all hourly Scheduled Complex KPI calculations finished
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup(5, "group1", "EUtranCellFDD", lastRopTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedFDD);
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup(6, "group1", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedTDD);
    
    // 7 Time between data becoming available on Kafka and all daily Scheduled Complex KPI calculations finished
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup(5, "group2", "EUtranCellFDD", lastRopTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledDailyComplexCalculationsFinishedFDD);
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup(6, "group2", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledDailyComplexCalculationsFinishedTDD);

    // Time between data becoming available on Kafka and all 15min Scheduled Complex KPI calculations finished
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup(5, "group3", "EUtranCellFDD", lastRopTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledQuarterlyComplexCalculationsFinishedFDD);
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup(6, "group3", "EUtranCellTDD", lastRopTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledQuarterlyComplexCalculationsFinishedTDD);
}

export function checkExporterMetricsCAU(){
    checkExporterMetrics();

    // 12. time between data becoming available on Kafka and hourly scheduled KPIs are exported
    getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(6, "group4", "EUtranCellFDD_1", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndHourlyComplexKPIsExportedToKafkaFDD, "achievable_throughput_dist");
    getTimeBetweenNthBatchAvailableAndComplexKPIsAreExportedByExecutionGroup(5, "group4", "NbIotCell", lastRopTime, customMetrics.timeBetweenDataOnKafkaAndHourlyComplexKPIsExportedToKafkaNbIotCell, "num_bad_samples_rsrp_ta_q1");
}

export function checkCalculatorMetricsForCAU() {
    const calculationIDs = getFinishedCalculationIDs().join("|");
    const firstCalculationStarts = getFirstCalculationStartsTime(calculationIDs);
    const lastCalculationEnds = getLastCalculationEndsTime(calculationIDs);
    const lastBatchTime = kafkaDataDate.toISOString().split('T')[0] + "T23:45:00";//+Z

    // Time between first batch becomes available on Kafka and first calculation starts
    getTimeBetweenFirstBatchAvailableAndFirstCalcStart(calculationIDs);

    // Time between first batch becomes available on Kafka and last calculation ends
    getTimeBetweenFirstBatchAvailableAndLastCalcEnds(calculationIDs);

    // Time between first calculation starts and last calculation ends
    getTimeBetweenFirstCalcStartsAndLastCalcEnds(firstCalculationStarts, lastCalculationEnds);

    // Calculation duration for Simple KPIs
    getcalcDurationForSimpleKPIs(calculationIDs, ["EUtranCell", "NbIotCell"]);

    // Calculation duration for Complex KPIs
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["group"], customMetrics.calculationDurationForComplexKPIs);

    // 4 Average and maximum time of daily Simple KPIs calculations from start to finish
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["EUtranCellRelation_1"], customMetrics.averageAndMaximumTimeOfDailySimpleCalculationsFromStartToFinish);

    // 8 Average and maximum time of hourly Complex KPIs calculations from start to finish
    getcalcDurationForKPIsByExecGroupAndMetric(calculationIDs, ["group4"], customMetrics.averageAndMaximumTimeOfHourlyComplexCalculationsFromStartToFinish);

    // 2 Time between data becoming available on Kafka and all Simple KPI calculations finished
    getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(6, "EUtranCellFDD" , lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedFDD);
    getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(5, "NbIotCell" , lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedNbIotCell);
    getTimeBetweenNthBatchAvailableAndLastCalcEndsByExecutionGroup(5, "CellRelation" , lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedCellRelation);

    // 5 Time between data becoming available on Kafka and all Scheduled hourly Complex KPI calculations finished
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup (6, "group4", "EUtranCellFDD_1", lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedFDD);
    getTimeBetweenNthBatchAvailableAndLastComplexCalcEndsByExecutionGroup (5, "group4", "NbIotCell", lastBatchTime, customMetrics.timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedNbIotCell);
}
