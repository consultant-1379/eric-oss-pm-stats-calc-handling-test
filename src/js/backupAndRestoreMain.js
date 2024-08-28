import { sleep } from "k6";
import exec from "k6/execution";
import { isSef, KAFKA } from "./modules/constants/Constants.js";
import { loginToSefGw } from "./use_cases/non-functional/SefGw.js";
import { loginToApiGw, logoutFromApiGw } from "./use_cases/functional/00_ApiGw.js";
import { backupAndRestorePostChecks } from "./use_cases/functional/BackupAndRestore.js";
import { checkTopicsAreDeletedSuccessfully } from "./modules/checks/KafkaChecks.js";

export function handleSummary(data) {
    return {
        "/reports/summary.json": JSON.stringify(data)
    };
}

export default function () {
    console.log("!!!: BUR main has started ..");
    if (isSef) {
        loginToSefGw();
    } else {
        loginToApiGw();
    }
    console.log("!!!: Logged in for executing BUR tests ..");
    backupAndRestorePostChecks();
    console.log("!!!: BUR tests finished ..");
    if (!isSef) {
        logoutFromApiGw();
    }
    console.log("!!!: Logged out.");
}

export function teardown() {
    checkTopicsAreDeletedSuccessfully([
        KAFKA.DATA_LOADER_TOPIC,
        KAFKA.EXPORTER_SCHEDULED_TOPIC,
        KAFKA.EXPORTER_ONDEMAND_TOPIC
    ]);
}
