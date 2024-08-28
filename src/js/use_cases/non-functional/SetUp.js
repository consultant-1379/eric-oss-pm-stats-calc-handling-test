import { group } from "k6";
import { KAFKA, kpiSet, SCHEMAS, CpiDGConfig, CauDGConfig } from "../../modules/constants/Constants.js";
import { checkSchemasInSchemaRegistry } from "../../modules/checks/SchemaRegistryChecks.js";
import { checkDataCatalogResponseStatusAndBody } from "../../modules/checks/DataCatalogChecks.js";
import { waitingForDataLoader } from "../../modules/checks/KafkaChecks.js"
import { checkPreloadedDatabase, checkRestartCalculator, checkRowCountOfTableWithSidecar } from "../../modules/checks/DatabaseChecks.js";
import { checkRowCountOfTable } from "../../modules/checks/QueryServiceChecks.js";
import { checkDataGeneratorStarted, synchronizeToCalculatorHeartbeat, checkSubmitDataGeneratorConfigFile } from "../../modules/checks/DataGeneratorChecks.js";

var expectedSubjects = ["pmCounters.EUtranCellFDD_1", "pmCounters.NbIotCell_1", "pmCounters.EUtranCellRelation_1", "pmCounters.ENodeBFunction_1", "pmCounters.EUtranCellTDD_1"];

let expectedDataSpaces = ["4G"];

let expectedDataCategories = ["PM_COUNTERS"];

let expectedSchemas = ["pmCounters.EUtranCellFDD_1/1", "pmCounters.NbIotCell_1/1", "pmCounters.EUtranCellRelation_1/1", "pmCounters.ENodeBFunction_1/1", "pmCounters.EUtranCellTDD_1/1"]

let expectedKafkaAccessEndpoints = [ KAFKA.BROKERS[0] ]

let expectedMessageDataTopics = ["cpi-topic"]

export function checkPrerequisites() {

    console.log("UseCase0: Setup");

    group("SetUp", () => {

        group("Preloading database", () => {
            switch(kpiSet) {
                case "CPI":
                    checkPreloadedDatabase("CPI", 15);
                    break;
                case "CAU":
                    checkPreloadedDatabase("CAU", 8);
                    break;
                default:
                  console.error("Preloading database: Invalid KPI set (" + kpiSet + ") has been selected.");
            }
        });

        group("Restart calculator pod", () => {
            checkRestartCalculator();
        });

        group("Check preloaded tables with query service", () => {
            if (kpiSet === "CPI") {
                checkRowCountOfTableWithSidecar(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_15`, 125644256);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_60`, 31411064);
                checkRowCountOfTableWithSidecar(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_complex_15`, 125644256);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_complex_60`, 31411064);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_complex_1440`, 1312440);
            } else if (kpiSet === "CAU") {
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_guid_60`, 3133737);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_guid_flm_60`, 1044579);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_sector_60`, 1044579);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_sector_60`, 1044579);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_guid_1440`, 4287696);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_cell_guid_flm_1440`, 350016);
                checkRowCountOfTable(`${SCHEMAS.KPI_SCHEMA}/kpi_relation_guid_source_guid_target_guid_1440`, 3500160);
            }
        });

        group("Start data generation", () => {
            checkDataGeneratorStarted();
            if (kpiSet === "CPI") {
                synchronizeToCalculatorHeartbeat(270);
                checkSubmitDataGeneratorConfigFile(CpiDGConfig);
            } else if (kpiSet === "CAU") {
                synchronizeToCalculatorHeartbeat(90);
                checkSubmitDataGeneratorConfigFile(CauDGConfig);
            }
        });

        if (kpiSet === "CPI") {
            group("Waiting for Data Loader + Kafka checks", () => {
                waitingForDataLoader(KAFKA.DATA_LOADER_TOPIC_CHAR, 5000000, 20);
            });
        } else if (kpiSet === "CAU") {
            group("Waiting for Data Loader + Kafka checks", () => {
                waitingForDataLoader(KAFKA.DATA_LOADER_TOPIC_CHAR, 406250, 15);
            });
        }

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
