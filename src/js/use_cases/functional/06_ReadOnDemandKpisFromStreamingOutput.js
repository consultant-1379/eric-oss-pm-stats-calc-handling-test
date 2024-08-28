import { group } from "k6";
import { KAFKA } from "../../modules/constants/Constants.js";
import { checkTopicExists, checkExpectedMessagesPresentOnTopic, checkResultsOnTopic, checkerStatic, checkerDiffForAggPeriod } from "../../modules/checks/KafkaChecks.js";
import { getMessagesOnTopic } from "../../modules/implementations/KafkaImpl.js";


export function readOnDemandKpisInOutputKafkaTopic() {

    console.log("UseCase6: Read on-demand KPIs from the streaming output");

    group("UseCase6: Read on-demand KPIs from the streaming output", () => {

        group("Check that the Kafka topic exists for on-demand KPIs", () => {
            checkTopicExists(KAFKA.EXPORTER_ONDEMAND_TOPIC);
        });

        group("Check the number of messages on the on-demand topic", () => {
            checkExpectedMessagesPresentOnTopic(KAFKA.EXPORTER_ONDEMAND_TOPIC, 150007);
        });

        group("Check the result of calculations on the on-demand topic", () => {
            const onDemandMessages = getMessagesOnTopic(KAFKA.EXPORTER_ONDEMAND_TOPIC);

            checkResultsOnTopic(onDemandMessages, "on_demand_with_params", 30000, checkerStatic, [false]);
            checkResultsOnTopic(onDemandMessages, "sum_60_on_demand", 2, checkerDiffForAggPeriod, [150000000, 600000000]);
            checkResultsOnTopic(onDemandMessages, "max_60_on_demand", 2, checkerDiffForAggPeriod, [150000000, 600000000]);
            checkResultsOnTopic(onDemandMessages, "post_agg_60_on_demand", 2, checkerStatic, [1]);
            checkResultsOnTopic(onDemandMessages, "od_ae", 2, checkerStatic, ["ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1"]);
            checkResultsOnTopic(onDemandMessages, "od_expr", 60000, checkerStatic, ["ManagedElement=NodeFDNManagedElement1"]);
            checkResultsOnTopic(onDemandMessages, "od_filter", 2, (r) => {
                return r["nodeFDN"] === "ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00016";
            });
            //checkResultsOnTopic(ondDemandMessages, "tabular_expression", 0, checkerStatic, []);
            checkResultsOnTopic(onDemandMessages, "on_demand_percentile_index", 60000, checkerStatic, [3]);
        });

    });
}
