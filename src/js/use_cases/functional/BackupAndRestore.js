import { group } from "k6";
import { KAFKA } from "../../modules/constants/Constants.js";
import { waitingForDataLoader } from "../../modules/checks/KafkaChecks.js"
import { checkQueryOriginallyExistingAfterBackupAndRestore, checkPatchOriginallyExistingAfterBackupAndRestore, checkDeleteOriginallyExistingAfterBackupAndRestore, checkNewSubmitAndQueryAfterBackupAndRestore } from "../../modules/checks/CalculatorChecks.js";

export function backupAndRestorePostChecks() {
    group("BackupAndRestorePostChecks", () => {
        group("Waiting for Data Loader + Kafka checks", () => {
            waitingForDataLoader(KAFKA.DATA_LOADER_TOPIC, 80);
        });
        group("Query KPI after backup- and restore process existed originally.", () => {
            checkQueryOriginallyExistingAfterBackupAndRestore();
        });
        group("Patch KPI after backup- and restore process existed originally.", () => {
            checkPatchOriginallyExistingAfterBackupAndRestore();
        });
        group("Delete KPI after backup- and restore process existed originally.", () => {
            checkDeleteOriginallyExistingAfterBackupAndRestore();
        });
        group("Submit-, query- and delete KPI after backup- and restore process.", () => {
            checkNewSubmitAndQueryAfterBackupAndRestore();
        });
    });
}
