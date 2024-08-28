import { Trend } from "k6/metrics";


// Calculator metrics
export const submitKpisDuration = new Trend("Calculator_Submit_KPI_Definitions_Duration__ms", true);
export const getCalculationDuration = new Trend("Calculator_Get_Calculation_Duration__ms", true);
export const getCalculationsDuration = new Trend("Calculator_Get_Calculations_Duration__ms", true);

// Exporter metrics
export const executionReportToExportTime = new Trend("Exporter_Time_Between_Execution_Report_And_Export__ms", true);
export const executionReportCount = new Trend("Exporter_Number_Of_Execution_Reports");
export const executionReportSum = new Trend("Exporter_Time_To_Process_Execution_Report_Sum__ms", true);
export const executionReportMax = new Trend("Exporter_Time_To_Process_Execution_Report_Max__ms", true);

//Exporter adding metrics
export const timeBetweenDataOnKafkaAndHourlySimpleKPIsExportedToKafkaFDD = new Trend("Exporter_TB_Kafka_And_Hourly_Simples_Exported_FDD__s", true);
export const timeBetweenDataOnKafkaAndHourlySimpleKPIsExportedToKafkaTDD = new Trend("Exporter_TB_Kafka_And_Hourly_Simples_Exported_TDD__s", true);
export const timeBetweenDataOnKafkaAndHourlyComplexKPIsExportedToKafkaFDD = new Trend("Exporter_TB_Kafka_And_Hourly_Complex_Exported_FDD__s", true);
export const timeBetweenDataOnKafkaAndHourlyComplexKPIsExportedToKafkaTDD = new Trend("Exporter_TB_Kafka_And_Hourly_Complex_Exported_TDD__s", true);
export const timeBetweenDataOnKafkaAndHourlyComplexKPIsExportedToKafkaNbIotCell = new Trend("Exporter_TB_Kafka_And_Hourly_Complex_Exported_NbIotCell__s", true);
export const timeBetweenDataOnKafkaAndDailySimpleKPIsExportedToKafkaFDD = new Trend("Exporter_TB_Kafka_And_Daily_Simples_Exported_FDD__s", true);
export const timeBetweenDataOnKafkaAndDailySimpleKPIsExportedToKafkaTDD = new Trend("Exporter_TB_Kafka_And_Daily_Simples_Exported_TDD__s", true);
export const timeBetweenDataOnKafkaAndDailyComplexKPIsExportedToKafkaFDD = new Trend("Exporter_TB_Kafka_And_Daily_Complex_Exported_FDD__s", true);
export const timeBetweenDataOnKafkaAndDailyComplexKPIsExportedToKafkaTDD = new Trend("Exporter_TB_Kafka_And_Daily_Complex_Exported_TDD__s", true);
export const timeBetweenDataOnKafkaAndQuarterlySimpleKPIsExportedToKafkaFDD = new Trend("Exporter_TB_Kafka_And_Quarterly_Simples_Exported_FDD__s", true);
export const timeBetweenDataOnKafkaAndQuarterlySimpleKPIsExportedToKafkaTDD = new Trend("Exporter_TB_Kafka_And_Quarterly_Simples_Exported_TDD__s", true);
export const timeBetweenDataOnKafkaAndQuarterlyComplexKPIsExportedToKafkaFDD = new Trend("Exporter_TB_Kafka_And_Quarterly_Complex_Exported_FDD__s", true);
export const timeBetweenDataOnKafkaAndQuarterlyComplexKPIsExportedToKafkaTDD = new Trend("Exporter_TB_Kafka_And_Quarterly_Complex_Exported_TDD__s", true);

// Calculator metrics for characteristics
export const timeBetweenFirstBatchBecomesAvailableOnKafkaAndFirstCalculationStarts = new Trend("Time_Between_First_Batch_Becomes_Available_On_Kafka_And_First_Calculation_Starts__s", true);
export const timeBetweenFirstBatchBecomesAvailableOnKafkaAndLastCalculationEnds = new Trend("Time_Between_First_Batch_Becomes_Available_On_Kafka_And_Last_Calculation_Ends__s", true);
export const timeBetweenFirstCalculationStartsAndLastCalculationEnds = new Trend("Time_Between_First_Calculation_Starts_And_Last_Calculation_Ends__s", true);
export const calculationDurationForSimpleKPIs = new Trend("Calculation_Duration_For_Simple_KPIs__s", true);
export const calculationDurationForComplexKPIs = new Trend("Calculation_Duration_For_Complex_KPIs__s", true);
export const calculationDurationForOnDemandKPIs = new Trend("Calculation_Duration_For_On_Demand_KPIs__s", true);

// Calculator adding metrics for characteristics
//E2E
export const averageAndMaximumTimeOfDailySimpleCalculationsFromStartToFinishManagedObject2 = new Trend("Calculator_Daily_Simple_Calculations_From_Start_To_Finish_For_MO2__s", true);
export const averageAndMaximumTimeOfQuarterlySimpleCalculationsFromStartToFinishManagedObject3 = new Trend("Calculator_Quarterly_Simple_Calculations_From_Start_To_Finish_For_MO3__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedManagedObject1 = new Trend("Calculator_TB_Kafka_And_All_Simple_Calculations_Finished_MO1__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedManagedObject2 = new Trend("Calculator_TB_Kafka_And_All_Simple_Calculations_Finished_MO2__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedManagedObject3 = new Trend("Calculator_TB_Kafka_And_All_Simple_Calculations_Finished_MO3__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedManagedObject3 = new Trend("Calculator_TB_Kafka_And_All_Hourly_Complex_Calculations_Finished_MO3__s", true);

//NIGHTLY
export const averageAndMaximumTimeOfHourlySimpleCalculationsFromStartToFinishTDD = new Trend("Calculator_Hourly_Simple_Calculations_From_Start_To_Finish_For_TDD__s", true);
export const averageAndMaximumTimeOfHourlySimpleCalculationsFromStartToFinishFDD = new Trend("Calculator_Hourly_Simple_Calculations_From_Start_To_Finish_For_FDD__s", true);
export const averageAndMaximumTimeOfDailylySimpleCalculationsFromStartToFinishCellRelation = new Trend("Calculator_Hourly_Simple_Calculations_From_Start_To_Finish_For_CellRelation__s", true);
export const averageAndMaximumTimeOfDailySimpleCalculationsFromStartToFinish = new Trend("Calculator_Daily_Simple_Calculations_From_Start_To_Finish__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedFDD = new Trend("Calculator_TB_Kafka_And_All_Simple_Calculations_Finished_FDD__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedTDD = new Trend("Calculator_TB_Kafka_And_All_Simple_Calculations_Finished_TDD__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedNbIotCell = new Trend("Calculator_TB_Kafka_And_All_Simple_Calculations_Finished_NbIotCell__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllSimpleCalculationsFinishedCellRelation = new Trend("Calculator_TB_Kafka_And_All_Simple_Calculations_Finished_CellRelation__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledQuarterlyComplexCalculationsFinishedFDD = new Trend("Calculator_TB_Kafka_And_All_Quarterly_Complex_Calculations_Finished_FDD__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledQuarterlyComplexCalculationsFinishedTDD = new Trend("Calculator_TB_Kafka_And_All_Quarterly_Complex_Calculations_Finished_TDD__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedFDD = new Trend("Calculator_TB_Kafka_And_All_Hourly_Complex_Calculations_Finished_FDD__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedTDD = new Trend("Calculator_TB_Kafka_And_All_Hourly_Complex_Calculations_Finished_TDD__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledHourlyComplexCalculationsFinishedNbIotCell = new Trend("Calculator_TB_Kafka_And_All_Hourly_Complex_Calculations_Finished_NbIotCell__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledDailyComplexCalculationsFinishedFDD = new Trend("Calculator_TB_Kafka_And_All_Daily_Complex_Calculations_Finished_FDD__s", true);
export const timeBetweenDataBecomingAvailableOnKafkaAndAllScheduledDailyComplexCalculationsFinishedTDD = new Trend("Calculator_TB_Kafka_And_All_Daily_Complex_Calculations_Finished_TDD__s", true);
export const averageAndMaximumTimeOfQuarterlyComplexCalculationsFromStartToFinish = new Trend("Calculator_Quarterly_Complex_Calculations_From_Start_To_Finish__s", true);
export const averageAndMaximumTimeOfDailyComplexCalculationsFromStartToFinish = new Trend("Calculator_Daily_Complex_Calculations_From_Start_To_Finish__s", true);
export const averageAndMaximumTimeOfHourlyComplexCalculationsFromStartToFinish = new Trend("Calculator_Hourly_Complex_Calculations_From_Start_To_Finish__s", true);

// Query Service metrics
export const durationsOfEachQuerySet = new Trend("Durations_Of_Each_Query_Set__ms", true);
export const queryResponse = new Trend("Query_Service_Response__ms", true);
export const queryKpiCount = new Trend("Query_Service_Response_KpiCount__ms", true);
export const queryKpiCountWithTop = new Trend("Query_Service_Response_KpiCountWithTop__ms", true);
export const queryTop = new Trend("Query_Service_Response_Top__ms", true);
export const querySkip = new Trend("Query_Service_Response_Skip__ms", true);
export const queryTimeLess = new Trend("Query_Service_Response_TimeLess__ms", true);
export const queryTimeLarger = new Trend("Query_Service_Response_TimeLarger__ms", true);
export const queryTimeLargerWithTop = new Trend("Query_Service_Response_TimeLargerWithTop__ms", true);
export const queryLessThan = new Trend("Query_Service_Response_LessThan__ms", true);
export const querySelectWithFilter = new Trend("Query_Service_Response_SelectWithFilter__ms", true);
export const queryContains = new Trend("Query_Service_Response_Contains__ms", true);
export const queryContainsWithCount = new Trend("Query_Service_Response_ContainsWithCount__ms", true);
export const queryContainsWithOrderBy = new Trend("Query_Service_Response_ContainsWithOrderBy__ms", true);
export const queryContainsSelectAndLessThan = new Trend("Query_Service_Response_ContainsSelectAndLessThan__ms", true);
export const queryContainsSelectOrLessEqual = new Trend("Query_Service_Response_ContainsSelectOrLessEqual__ms", true);
export const queryOrderedLessThanWithCount = new Trend("Query_Service_Response_OrderedLessThanWithCount__ms", true);
export const queryOrderByWithLessEqualsLessThan = new Trend("Query_Service_Response_OrderByWithLessEqualsLessThan__ms", true);
export const queryTimeLargerAndContainsAndSelect = new Trend("Query_Service_Response_TimeLargerAndContainsAndSelect__ms", true);
export const queryTimeEqualsWithOrderByAndTopAndCount = new Trend("Query_Service_Response_TimeEqualsWithOrderByAndTopAndCount__ms", true);
export const queryLessThanGreaterEqualsAndTopSkip = new Trend("Query_Service_Response_LessThanGreaterEqualsAndTopSkip__ms", true);
export const queryCountWithLessThanGreaterEqualsAndTopSkip = new Trend("Query_Service_Response_CountWithLessThanGreaterEqualsAndTopSkip__ms", true);
export const queryCountWithContainsAndGreaterAndSkip = new Trend("Query_Service_Response_CountWithContainsAndGreaterAndSkip__ms", true);