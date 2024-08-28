import { group } from "k6";
import { bodyForSoftDelete } from "../../modules/constants/Constants.js";
import { checkKpisSoftDeleteWithParameter } from "../../modules/checks/CalculatorChecks.js";

export function softDeleteKpis() {

    console.log("UseCase9: Soft delete KPIs through the REST API");

    group("UseCase9: Soft delete KPIs through the REST API", () => {
        group("Check kpis are soft deleted", () => {
            checkKpisSoftDeleteWithParameter(bodyForSoftDelete, false);
        });
    });
}
