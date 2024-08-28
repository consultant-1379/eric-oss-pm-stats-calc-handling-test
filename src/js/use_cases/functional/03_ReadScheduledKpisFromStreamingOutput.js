import { group } from "k6";
import { KAFKA } from "../../modules/constants/Constants.js";
import { checkTopicExists, checkExpectedMessagesPresentOnTopic, checkResultsOnTopic, checkerStatic, checkerDiffForAggPeriod } from "../../modules/checks/KafkaChecks.js";
import { getMessagesOnTopic } from "../../modules/implementations/KafkaImpl.js";


export function readScheduledKpisInOutputKafkaTopic() {

    console.log("UseCase3: Read scheduled KPIs from the streaming output");

    group("UseCase3: Read scheduled KPIs from the streaming output", () => {

        group("Check that the Kafka topic exists for scheduled KPIs", () => {
            checkTopicExists(KAFKA.EXPORTER_SCHEDULED_TOPIC);
        });

        /*group("Check the number of messages on the scheduled topic", () => {
            checkExpectedMessagesPresentOnTopic(KAFKA.EXPORTER_SCHEDULED_TOPIC, 300006);
        });*/

        group("Check the result of calculations on the scheduled topic", () => {
            const scheduledMessages = getMessagesOnTopic(KAFKA.EXPORTER_SCHEDULED_TOPIC);

            /*checkResultsOnTopic(scheduledMessages, "simple_sum", 0, checkerStatic, []);
            checkResultsOnTopic(scheduledMessages, "simple_expression", 0, checkerStatic, []);
            checkResultsOnTopic(scheduledMessages, "mo_sum_60_simple", 0, checkerStatic, []);
            checkResultsOnTopic(scheduledMessages, "mo_sum_15_simple_dll", 4, (r) => {
                return (r._index === 0 && r._result === 6000000) ||
                       (r._index === 1 && r._result === 6000000) ||
                       (r._index === 2 && r._result === 8000000) ||
                       (r._index === 3 && r._result === 8000000);
            });
            checkResultsOnTopic(scheduledMessages, "mo_sum_15_simple_dll_2", 4, (r) => {
                return (r._index === 0 && r._result === 6000000) ||
                       (r._index === 1 && r._result === 6000000) ||
                       (r._index === 2 && r._result === 8000000) ||
                       (r._index === 3 && r._result === 8000000);
            });*/

            checkResultsOnTopic(scheduledMessages, "max_15_complex", 150000, checkerStatic, [3000]);
            checkResultsOnTopic(scheduledMessages, "sum_15_complex", 150000, checkerStatic, [8000]);
            checkResultsOnTopic(scheduledMessages, "float_post_aggregation_1", 150000, checkerStatic, [24000000]);
            checkResultsOnTopic(scheduledMessages, "complex_ae", 60000, checkerStatic, ["ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1"]);
            checkResultsOnTopic(scheduledMessages, "complex_expression", 60000, checkerStatic, ["ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1"]);
            checkResultsOnTopic(scheduledMessages, "sum_1440_complex", 30000, checkerStatic, [200]);
            checkResultsOnTopic(scheduledMessages, "sum_dlb_complex_1", 2, checkerDiffForAggPeriod, [6000000, 32000000]);
        });

    });
}
