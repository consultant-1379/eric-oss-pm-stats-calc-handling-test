import { group } from "k6";
import { SCHEMAS, kafkaDataDate } from "../../modules/constants/Constants.js";
import { checkTablesUnderGivenSchema, checkFilterEqual, checkSelect, checkDateLater, checkResultsForKPI, checkerStatic, checkerDiffForAggPeriod } from "../../modules/checks/QueryServiceChecks.js";

export function queryScheduledCalcResultsThroughRestAPI() {

    console.log("UseCase4: Read scheduled KPIs through the REST API");

    group("UseCase4: Read scheduled KPIs through the REST API", () => {
        group("List tables under the schema", () => {
            checkTablesUnderGivenSchema(SCHEMAS.KPI_SCHEMA);
        });

        group("Check the result of calculations in the tables", () => {
            // Simple
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_`, "simple_sum", 30000, checkerStatic, [15000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_1_15`, "mo_sum_15_simple", 150000, checkerStatic, [3000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_1_15`, "pm_counters_sum_15_simple", 150000, checkerStatic, [8000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_2_60`, "mo_sum_60_simple", 2, checkerDiffForAggPeriod, [150000000, 600000000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_3_1440`, "mo_max_1440_simple", 30000, checkerStatic, [1000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_3_1440`, "mo_count_1440_simple", 30000, checkerStatic, [5]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_4_1440`, "simple_for_tabular", 30000, checkerStatic, [5000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_array_60`, "simple_array_sum", 60000, checkerDiffForAggPeriod, [[100, 200, 400], [400, 800, 1600]]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_array_60`, "simple_first_element", 60000, checkerStatic, [100]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_dll_15`, "mo_sum_15_simple_dll", 5, checkerDiffForAggPeriod, [6000000, 8000000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_simple_dll_15`, "mo_sum_15_simple_dll_2", 5, checkerDiffForAggPeriod, [6000000, 8000000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_fdn_simple_expr_60`, "simple_expression", 60000, checkerStatic, ["ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1"]);

            // Complex
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_`, "sum_complex", 30000, checkerStatic, [100]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_1_15`, "max_15_complex", 150000, checkerStatic, [3000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_1_15`, "sum_15_complex", 150000, checkerStatic, [8000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_1_15`, "float_post_aggregation_1", 150000, checkerStatic, [24000000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_2_60`, "sum_dlb_complex_1", 2, checkerDiffForAggPeriod, [6000000, 32000000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_2_innerjoin_60`, "inner_join_60_complex_1", 60000, checkerStatic, [3000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_3_1440`, "sum_1440_complex", 30000, checkerStatic, [200]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_4_60`, "complex_array", 60000, checkerDiffForAggPeriod, [[100, 200, 400, 1700], [400, 800, 1600, 1700]]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_4_60`, "complex_divider", 60000, checkerDiffForAggPeriod, [200, 500]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_complex_4_60`, "float_inmemory", 60000, checkerDiffForAggPeriod, [12, 9]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_fdn_complex_aggr_element_60`, "complex_ae", 60000, checkerStatic, ["ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1"]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_fdn_complex_expr_60`, "complex_expression", 60000, checkerStatic, ["ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1"]);
        });

        group("Filter data in the table", () => {
            checkFilterEqual(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_dll_15", "8000000", "mo_sum_15_simple_dll", 4);
        });

        group("Filter data based on date", () => {
            let formattedDate = kafkaDataDate.toISOString().split('T')[0];
            formattedDate = formattedDate + 'T23:00:00Z';
            checkDateLater(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_dll_15", formattedDate, "aggregation_begin_time", 3);
        });

        group("Select data from the table", () => {
            checkSelect(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_2_60", "mo_sum_60_simple", 2);
            checkSelect(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_2_60", "sum_dlb_complex_1", 2);
        });
    });
}
