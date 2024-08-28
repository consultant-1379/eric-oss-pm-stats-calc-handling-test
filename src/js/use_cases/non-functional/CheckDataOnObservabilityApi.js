import { group } from "k6";
import { waitForNumberOfCalculations, runQuerysUntilAllCalculationsAreDone } from "../../modules/checks/ObservabilityChecks.js";
import { kpiSet } from "../../modules/constants/Constants.js";
import { issueAllRequestsCPI } from "../../../resources/query-sets/CpiSets.js";
import { issueAllRequestsCAU } from "../../../resources/query-sets/CauSets.js";


const executionGroupsCPI = [
    "4G|PM_COUNTERS|EUtranCellFDD_1",
    "4G|PM_COUNTERS|EUtranCellTDD_1",
    "group1",
    "group2",
    "group3"
];

const executionGroupsCAU = [
    "4G|PM_COUNTERS|EUtranCellFDD_1",
    "4G|PM_COUNTERS|NbIotCell_1",
    "4G|PM_COUNTERS|EUtranCellRelation_1",
    "group1",
    "group2",
    "group3",
    "group4"
];

export function checkDataOnObservabilityApi() {
    group("UseCase: Check KPIs in the Observability API", () => {
        group("Check durations of each QuerySet", () => {
            // Waiting for the end of first calculation
            waitForNumberOfCalculations(1);

            // Collecting/reporting the duration of each queries
            if(kpiSet === "CPI"){
                runQuerysUntilAllCalculationsAreDone(executionGroupsCPI, "23:45:00", issueAllRequestsCPI, 300);
            } else if (kpiSet === "CAU"){
                runQuerysUntilAllCalculationsAreDone(executionGroupsCAU, "23:45:00", issueAllRequestsCAU, 300);
            }
        });
    });
}
