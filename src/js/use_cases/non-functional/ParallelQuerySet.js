import { group } from "k6";
import { kpiSet } from "../../modules/constants/Constants.js";
import { runningQuerySet } from "../../modules/implementations/ObservabilityImpl.js";
import { issueAllRequestsCPI } from "../../../resources/query-sets/CpiSets.js";
import { issueAllRequestsCAU } from "../../../resources/query-sets/CauSets.js";


export function runQuerySetInParallel() {
    group("Query Set with multiple VUs", () => {
        group("Query Service requests are successful", () => {
            if (kpiSet === "CPI") {
                runningQuerySet(() => issueAllRequestsCPI(true));
            } else if (kpiSet === "CAU") {
                runningQuerySet(() => issueAllRequestsCAU(true));
            }
        });
    });
}
