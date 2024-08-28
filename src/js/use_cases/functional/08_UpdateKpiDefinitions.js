import { group } from "k6";
import { checkUpdatedKpiDefinition } from "../../modules/checks/CalculatorChecks.js";
import { updateKpiDefinition } from "../../modules/implementations/CalculatorImpl.js";

export function updateKpiDefinitions() {

  console.log("UseCase8: Update KPI definitions");

    group("UseCase8: Update KPI definitions", () => {
        group("Re-Submit a simple KPI with updated parameters", () => {
            updateKpiDefinition("mo_sum_15_simple", {"exportable": false, "expression": "SUM(ManagedObject1.pmCounters.pmCounter1.counterValue)+1",
              "object_type": "FLOAT", "data_lookback_limit": 7201, "reexport_late_data": false});
            checkUpdatedKpiDefinition("mo_sum_15_simple", "exportable", "false");
            checkUpdatedKpiDefinition("mo_sum_15_simple", "expression", "SUM(ManagedObject1.pmCounters.pmCounter1.counterValue)+1");
            checkUpdatedKpiDefinition("mo_sum_15_simple", "object_type", "FLOAT");
            checkUpdatedKpiDefinition("mo_sum_15_simple", "data_lookback_limit", 7201);
            checkUpdatedKpiDefinition("mo_sum_15_simple", "reexport_late_data", "false");
        });

        group("Re-Submit a complex KPI with updated parameters", () => {
            updateKpiDefinition("sum_1440_complex", {"exportable": false,
              "expression": "SUM(kpi_mo_simple_3_1440.mo_sum_1440_simple)+1 FROM kpi_db://kpi_mo_simple_3_1440", "object_type": "LONG", "data_lookback_limit": 7201,
              "reexport_late_data": false, "filters": ["kpi_db://kpi_mo_simple_3_1440.mo_sum_1440_simple > 5"]});
            checkUpdatedKpiDefinition("sum_1440_complex", "exportable", "false");
            checkUpdatedKpiDefinition("sum_1440_complex", "expression", "SUM(kpi_mo_simple_3_1440.mo_sum_1440_simple)+1 FROM kpi_db://kpi_mo_simple_3_1440");
            checkUpdatedKpiDefinition("sum_1440_complex", "object_type", "LONG");
            checkUpdatedKpiDefinition("sum_1440_complex", "data_lookback_limit", 7201);
            checkUpdatedKpiDefinition("sum_1440_complex", "reexport_late_data", "false");
            checkUpdatedKpiDefinition("sum_1440_complex", "filters", "[\"kpi_db://kpi_mo_simple_3_1440.mo_sum_1440_simple > 5\"]");
        });

        group("Re-Submit two on-demand KPIs with updated parameters", () => {
            updateKpiDefinition("on_demand_percentile_index", {"exportable": false,
              "expression": "MAX(kpi_mo_simple_2_60.mo_sum_60_simple)+1 FROM kpi_db://kpi_mo_simple_2_60", "object_type": "TEXT"});
            checkUpdatedKpiDefinition("on_demand_percentile_index", "exportable", "false");
            checkUpdatedKpiDefinition("on_demand_percentile_index", "expression", "MAX(kpi_mo_simple_2_60.mo_sum_60_simple)+1 FROM kpi_db://kpi_mo_simple_2_60");
            checkUpdatedKpiDefinition("on_demand_percentile_index", "object_type", "TEXT");
            updateKpiDefinition("on_demand_with_params", {"filters": ["kpi_db://kpi_mo_simple_1_filter_15.mo_sum_15_simple < 1201"]});
            checkUpdatedKpiDefinition("on_demand_with_params", "filters", "[\"kpi_db://kpi_mo_simple_1_filter_15.mo_sum_15_simple < 1201\"]");
        });

    });
}