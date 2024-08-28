import { group } from "k6";
import { waitForNumberOfCalculations, runQuerysUntilAllCalculationsAreDone, checkGroupCollectedRows } from "../../modules/checks/ObservabilityChecks.js";
import { issueAllRequestsFunctional } from "../../../resources/query-sets/FunctionalSets.js";


const executionGroups = [
    "dataSpace|dataCategory|ManagedObject1",
    "dataSpace|dataCategory|ManagedObject2",
    "dataSpace|dataCategory|ManagedObject3",
    "group1",
    "group2"
];

export function checkReadinessLogInObservabilityApi() {

    console.log("UseCase2: Check ReadinessLog of Simple and Complex KPIs in the Observability API");

    group("UseCase2: Check ReadinessLog of Simple and Complex KPIs in the Observability API", () => {
        group("Check durations of each QuerySet", () => {
            // Waiting for the end of first calculation
            waitForNumberOfCalculations(1);

            // Collecting/reporting the duration of each queries
            runQuerysUntilAllCalculationsAreDone(executionGroups, "23:45:00", issueAllRequestsFunctional);
        });

        group("Check the collected rows in case of Simple KPIs", () => {
            checkGroupCollectedRows("dataSpace|dataCategory|ManagedObject1", 150000);
            checkGroupCollectedRows("dataSpace|dataCategory|ManagedObject2", 150000);
            checkGroupCollectedRows("dataSpace|dataCategory|ManagedObject3", 95000);
        });

        group("Check the collected rows in case of Complex KPIs", () => {
            checkGroupCollectedRows("group1", 95000);
            checkGroupCollectedRows("group2", 300000);
        });
    });
}
