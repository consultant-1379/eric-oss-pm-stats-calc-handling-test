import { group } from "k6";
import { checkDefineKpis, checkTablesAreCreated, checkNamesOfKpisAreCreated } from "../../modules/checks/CalculatorChecks.js";
import { SimpleKpis, ComplexKpis, OnDemandKpis, LateComplexKpi } from "../../modules/constants/Constants.js";

export function defineKpis() {

  console.log("UseCase1: Define KPIs");

  group("UseCase1: Define KPIs", () => {

    group("Define Simple KPIs", () => {
      checkDefineKpis(SimpleKpis);
      checkTablesAreCreated(SimpleKpis, "false");
      checkNamesOfKpisAreCreated(SimpleKpis, "false");
    });

    group("Define a Complex KPI to work with late data", () => {
      checkDefineKpis(LateComplexKpi);
      checkTablesAreCreated(LateComplexKpi, "false");
      checkNamesOfKpisAreCreated(LateComplexKpi, "false");
    });

    group("Define Complex KPIs", () => {
      checkDefineKpis(ComplexKpis);
      checkTablesAreCreated(ComplexKpis, "false");
      checkNamesOfKpisAreCreated(ComplexKpis, "false");
    });

    group("Define On-Demand KPIs", () => {
      checkDefineKpis(OnDemandKpis);
      checkTablesAreCreated(OnDemandKpis, "false");
      checkNamesOfKpisAreCreated(OnDemandKpis, "false");
    });
  })
}
