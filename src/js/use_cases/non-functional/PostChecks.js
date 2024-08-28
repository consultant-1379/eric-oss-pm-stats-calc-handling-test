import { group, sleep } from "k6";
import { kpiSet } from "../../modules/constants/Constants.js";
import { checkCalculatorMetricsForCPI, checkCalculatorMetricsForCAU, checkExporterMetricsCPI, checkExporterMetricsCAU } from "../../modules/implementations/MetricsImpl.js";

export function postChecks() {
    group("UseCase: PostChecks", () => {
        sleep(120);
        if(kpiSet === "CPI"){
            group("Check calculator metrics for characteristics", () => {
                checkCalculatorMetricsForCPI();
            });
            group("Exporter metrics are processed", () => {
                checkExporterMetricsCPI();
            });
        } else if(kpiSet === "CAU"){
            group("Check calculator metrics for characteristics", () => {
                checkCalculatorMetricsForCAU();
            });
             group("Exporter metrics are processed", () => {
                checkExporterMetricsCAU();
            });
        }
    });
}
