import { group } from "k6";
import { checkSchemasInSchemaRegistry } from "../../modules/checks/SchemaRegistryChecks.js";
import { checkDataCatalogResponseStatusAndBody } from "../../modules/checks/DataCatalogChecks.js";
import { waitingForDataLoader } from "../../modules/checks/KafkaChecks.js"
import { KAFKA } from "../../modules/constants/Constants.js";

var expectedSubjects = ["pmCounters.ManagedObject1", "pmCounters.ManagedObject2", "pmCounters.ManagedObject3"];

let expectedDataSpaces = ["dataSpace"];

let expectedDataCategories = ["dataCategory"];

let expectedSchemas = ["pmCounters.ManagedObject1/1", "pmCounters.ManagedObject2/1",  "pmCounters.ManagedObject3/1"]

let expectedKafkaAccessEndpoints = [ KAFKA.BROKERS[0] ]

let expectedMessageDataTopics = ["topic"]

export function checkPrerequisites() {

    console.log("UseCase0: Setup");

    group("SetUp", () => {

        group("Waiting for Data Loader + Kafka checks", () => {
            waitingForDataLoader(KAFKA.DATA_LOADER_TOPIC, 75000);
        });

        group("Check that schemas exist in Schema Registry", () => {
            checkSchemasInSchemaRegistry(expectedSubjects);
        });

        group("Check that dataSpace exists in Data Catalog", () => {
            checkDataCatalogResponseStatusAndBody("dataSpace", expectedDataSpaces);
        });

        group("Check that dataCategory exists in Data Catalog", () => {
            checkDataCatalogResponseStatusAndBody("dataCategory", expectedDataCategories);
        });

        group("Check that schema ID exists in Data Catalog", () => {
            checkDataCatalogResponseStatusAndBody("schema ID", expectedSchemas);
        });

        group("Check that kafka broker exists in Data Catalog", () => {
            checkDataCatalogResponseStatusAndBody("Kafka Broker", expectedKafkaAccessEndpoints);
        });

        group("Check that message data topic exists in Data Catalog", () => {
            checkDataCatalogResponseStatusAndBody("Message Data Topic", expectedMessageDataTopics);
        });

    });

}
