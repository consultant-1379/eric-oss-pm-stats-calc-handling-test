import { group } from "k6";
import { checkTriggerOnDemandKpiCalc, checkStatusOfOnDemandCalc } from "../../modules/checks/CalculatorChecks.js";

export function triggerOnDemandKpiCalculation() {

    console.log("UseCase5: Submit On-Demand KPIs for calculation");

    group("UseCase5: Submit On-Demand KPIs for calculation", () => {

        group("Trigger On-Demand KPI calculation", () => {
            checkTriggerOnDemandKpiCalc();
        });

        group("Check the status of On-Demand KPIs calculations", () => {
            checkStatusOfOnDemandCalc();
        });
    })
}
