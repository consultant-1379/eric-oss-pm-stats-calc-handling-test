import { group } from "k6";
import { SCHEMAS } from "../../modules/constants/Constants.js";
import { checkResultsForKPI, checkerStatic, checkerDiffForAggPeriod } from "../../modules/checks/QueryServiceChecks.js";


export function queryOnDemandCalcResultsThroughRestAPI() {

    console.log("UseCase7: Read on-demand KPIs through the REST API");

    group("UseCase7: Read on-demand KPIs through the REST API", () => {
        group("Check the result of calculations in the tables", () => {
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_on_demand_1_15`, "on_demand_mo_counter_percentage", 150000, checkerStatic, [37.5]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_on_demand_2_post_agg_60`, "sum_60_on_demand", 2, checkerDiffForAggPeriod, [150000000, 600000000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_on_demand_2_post_agg_60`, "max_60_on_demand", 2, checkerDiffForAggPeriod, [150000000, 600000000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_on_demand_2_post_agg_60`, "post_agg_60_on_demand", 2, checkerStatic, [1]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_on_demand_4_60`, "on_demand_percentile_index", 60000, checkerStatic, [3]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_on_demand_param_60`, "on_demand_with_params", 30000, checkerStatic, [false]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_mo_on_demand_result_check_1440`, "sum_on_demand_check", 1, checkerStatic, [750000]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_fdn_od_aggr_element_60`, "od_ae", 2, checkerStatic, ["ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1"]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_fdn_od_expr_60`, "od_expr", 60000, checkerStatic, ["ManagedElement=NodeFDNManagedElement1"]);
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_fdn_od_filter_60`, "od_filter", 2, (r) => {
                return r["nodeFDN"] === "ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00016";
            });
            /*checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_ondemand_tabular_1440`, "tabular_expression", 5, (r) => {
                return (r["nodeFDN"].includes("Node00001") && r._result === 10) ||
                       (r["nodeFDN"].includes("Node00002") && r._result === 40) ||
                       (r["nodeFDN"].includes("Node00016") && r._result === 12.5) ||
                       (r["nodeFDN"].includes("Node00029") && r._result === 100) ||
                       (r["nodeFDN"].includes("Node00064") && r._result === 125);
            });*/
            checkResultsForKPI(`${SCHEMAS.KPI_SCHEMA}/kpi_ondemand_tabular_array_60`, "tabular_array", 4, (r) => {
                return (r["nodeFDN"].includes("Node00001") && r._aggPeriod === 1 && JSON.stringify(r._result) === JSON.stringify([300, 600, 1200])) ||
                       (r["nodeFDN"].includes("Node00001") && r._aggPeriod === 2 && JSON.stringify(r._result) === JSON.stringify([1200, 2400, 4800])) ||
                       (r["nodeFDN"].includes("Node00003") && r._aggPeriod === 1 && JSON.stringify(r._result) === JSON.stringify([900, 1800, 3600])) ||
                       (r["nodeFDN"].includes("Node00003") && r._aggPeriod === 2 && JSON.stringify(r._result) === JSON.stringify([3600, 7200, 14400]));
            });
        });
    });
}
