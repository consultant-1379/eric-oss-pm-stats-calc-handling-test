import { group } from "k6";
import { CpiKpis, CauKpis, kpiSet } from "../../modules/constants/Constants.js";
import { checkDefineKpis } from "../../modules/checks/CalculatorChecks.js";


export function defineKpis() {
    group("UseCase: Define KPIs", () => {
        if (kpiSet === "CPI") {
            group("Define CPI KPIs", () => {
                checkDefineKpis(CpiKpis);
            });
        } else if (kpiSet === "CAU") {
            group("Define CAU KPIs", () => {
                checkDefineKpis(CauKpis);
            });
        }
    });
}
