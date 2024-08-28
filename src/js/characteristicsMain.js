import { sleep } from "k6";
import exec from "k6/execution";
import { KAFKA } from "./modules/constants/Constants.js";
import { checkTopicsAreDeletedSuccessfully } from "./modules/checks/KafkaChecks.js";
import { loginToSefGw } from "./use_cases/non-functional/SefGw.js";
import { checkPrerequisites } from "./use_cases/non-functional/SetUp.js";
import { defineKpis } from "./use_cases/non-functional/DefineKpis.js";
import { checkDataOnObservabilityApi } from "./use_cases/non-functional/CheckDataOnObservabilityApi.js";
import { runQuerySetInParallel } from "./use_cases/non-functional/ParallelQuerySet.js";
import { postChecks } from "./use_cases/non-functional/PostChecks.js";


export function handleSummary(data) {
    return {
        "/reports/summary.json": JSON.stringify(data)
    };
}

export function prepare() {

}

export default function () {
    loginToSefGw();
    checkPrerequisites();
    defineKpis();
    checkDataOnObservabilityApi();
    postChecks();
}

export function teardown() {
    checkTopicsAreDeletedSuccessfully([
        KAFKA.DATA_LOADER_TOPIC_CHAR,
        KAFKA.EXPORTER_SCHEDULED_TOPIC,
        KAFKA.EXPORTER_ONDEMAND_TOPIC
    ]);
}

export function parallelQuerySet() {
    while (exec.instance.iterationsCompleted === 0) {
        sleep(10);
    }
    runQuerySetInParallel();
}
