import { group } from "k6";
import { checkDataCatalogResponseStatusAndBody } from "../../modules/checks/DataCatalogChecks.js";
import { calculatorMetrics, exporterMetrics, queryMetrics } from "../../modules/constants/Constants.js";
import { getScrapePools, metricCollectionCheck } from "../../modules/checks/MetricsChecks.js";
import { checkExporterMetrics, checkCalculatorMetricsForCharacteristics } from "../../modules/implementations/MetricsImpl.js";


let expectedTopics = ["pm-stats-calc-handling-avro-scheduled",
                      "pm-stats-calc-handling-avro-on-demand"];

let expectedSchemas = [
    "kpi_mo_simple_dll_15",
    "kpi_mo_complex_1_15",
    "kpi_mo_complex_2_60",
    "kpi_mo_complex_3_1440",
    "kpi_fdn_complex_aggr_element_60",
    "kpi_fdn_complex_expr_60",
    "kpi_mo_on_demand_param_60",
    "kpi_mo_on_demand_result_check_1440",
    "kpi_mo_on_demand_2_post_agg_60",
    "kpi_mo_on_demand_4_60",
    "kpi_fdn_od_aggr_element_60",
    "kpi_fdn_od_expr_60",
    "kpi_fdn_od_filter_60",

    /* Disabled due to IDUN-120269:
        "kpi_mo_simple_",
        "kpi_mo_simple_2_60",
        "kpi_mo_simple_3_1440",
        "kpi_fdn_simple_expr_60",
    */
    /* Disabled due to IDUN-119446:
        "kpi_ondemand_tabular_1440",
    */
];


export function postChecks() {

    console.log("UseCase10: PostChecks");

    group("UseCase10: PostChecks", () => {
        group("Check the existence of topics created by Exporter in Data Catalog", () => {
            checkDataCatalogResponseStatusAndBody("Message Data Topic", expectedTopics);
        });
        group("Check the existence of schemas created by Exporter in Data Catalog", () => {
            checkDataCatalogResponseStatusAndBody("schema ID", expectedSchemas);
        });
        group("Scraping of metrics validation", () => {
            getScrapePools();
        });
        group("Check calculator custom metrics", () => {
            metricCollectionCheck(calculatorMetrics);
        });
        group("Check exporter custom metrics", () => {
            metricCollectionCheck(exporterMetrics);
        });
        group("Check query-service custom metrics", () => {
            metricCollectionCheck(queryMetrics);
        });
        group("Exporter metrics are processed", () => {
            checkExporterMetrics();
        });
        group("Check calculator metrics for characteristics", () => {
            checkCalculatorMetricsForCharacteristics();
        });
    });
}
