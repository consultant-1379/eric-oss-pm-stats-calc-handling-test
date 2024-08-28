export const SCHEMAS = {
    KPI_SCHEMA: "kpi",
};

export const isSef = __ENV.SEF_STATUS.toLowerCase() === "true";
export const legacyThresholds = __ENV.THRESHOLDS;
export const kpiSet = __ENV.KPI_SET.toUpperCase();
export const globalQueryLimit = 10000;

export const currentTime = new Date();
export const kafkaDataDate = kpiSet ? currentTime : new Date(new Date().setDate(new Date().getDate() - 1));

export const URLS = {
    GAS_URL: isSef ? `https://${__ENV.EIC_HOSTNAME}` : `https://${__ENV.HOSTNAME}`,
    DEFINITION_ENDPOINT: "/kpi-handling/model/v1/definitions/",
    CALCULATION_ENDPOINT: "/kpi-handling/calc/v1/calculations/",
    QUERY_CALC_RESULT_URL: "/kpi-handling/exposure/v1/",
    SCHEMAS_ENDPOINT: "/schemas",
    CALCULATOR_LOCAL: "http://localhost:8081",
    QUERY_SERVICE_LOCAL: "http://localhost:8080",
    QUERY_SERVICE: "http://eric-oss-pm-stats-query-service:8080/kpi-handling/exposure/v1/",
    SCHEMA_REGISTRY_LOCAL: "http://localhost:3000",
    DATA_CATALOG_LOCAL: "http://localhost:9590",
    DATA_CATALOG_DATA_SERVICE_ENDPOINT: "/catalog/v1/data-service",
    DATA_CATALOG_DATA_SPACE_ENDPOINT: "/catalog/v1/data-space",
    DATA_CATALOG_MESSAGE_DATA_TOPIC_ENDPOINT: "/catalog/v2/message-data-topic",
    DATA_CATALOG_DATA_PROVIDER_TYPE_ENDPOINT: "/catalog/v2/data-provider-type",
    DATA_CATALOG_MESSAGE_SCHEMA_ENDPOINT: "/catalog/v2/message-schema",
    DATA_CATALOG_MESSAGE_BUS_ENDPOINT: "/catalog/v1/message-bus",
    SHOW_DELETED: "?showDeleted=",
    KAFKA_SIDECAR_ENDPOINT: "http://localhost:8082",
    DATA_GENERATOR_ENDPOINT: "http://eric-oss-data-loader:8080"
};

export const ODATA_FEATURES = {
    SELECT: "$select",
    ORDER_BY: "$orderby",
    TOP: "$top",
    SKIP: "$skip",
    COUNT: "$count",
    FILTER: "$filter",
    FORMAT: "$format"
};

export const TABLE_NAMES = {
    MO_SIMPLE: "kpi_mo_simple_1_60",
    KPI_DEFINITION: "kpi_definition",
    KPI_CALCULATION: "kpi_calculation",
    READINESS_LOG: "readiness_log",
    LATEST_PROCESSED_OFFSETS: "latest_processed_offsets",
    KPI_EXECUTION_GROUPS: "kpi_execution_groups",
};

export const CALCULATION_STATUSES = {
    STARTED: "STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    FINALIZING: "FINALIZING",
    FINISHED: "FINISHED",
    FAILED: "FAILED",
    NOTHING_CALCULATED: "NOTHING_CALCULATED"
};

export const DB_STRING = {
    LOCAL_DB_USER: "kpi_service_user",
    LOCAL_DB_PWD: "hfbeOgXOCo",
    LOCAL_DB_HOST: "localhost",
    LOCAL_DB_PORT: "5432",
    LOCAL_DB_STRING: "",
    DB_HOST: "eric-pm-kpi-data",
    DB_PORT: "5432",
    DB_STRING: "",
};

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    FORBIDDEN: 403,
    NOT_FOUND: 404
};

export const KAFKA = {
    BROKERS: [__ENV.KAFKA_BOOTSTRAP_SERVERS],
    SCHEMA_REGISTRY_URL: "http://eric-schema-registry-sr:8081",
    STRIMZI_BRIDGE: "http://eric-oss-dmm-kf-sz-bridge-service:8080",
    EXPORTER_ONDEMAND_TOPIC: "pm-stats-calc-handling-avro-on-demand",
    EXPORTER_SCHEDULED_TOPIC: "pm-stats-calc-handling-avro-scheduled",
    EXPORTER_BACKUP_TOPIC: "pm-stats-exporter-json-backup",
    EXPORTER_TIMESTAMP_TOPIC: "pm-stats-exporter-json-completed-timestamp",
    DATA_LOADER_TOPIC: "topic",
    DATA_LOADER_TOPIC_CHAR: "cpi-topic"
};

export const CpiDGConfig = open("../../../resources/configs/config-cpi.json");

export const CauDGConfig = open("../../../resources/configs/config-cau.json");


export const SimpleKpis = open("../../../resources/kpi-definitions/functional/SimpleKPIs.json");

export const ComplexKpis = open("../../../resources/kpi-definitions/functional/ComplexKPIs.json");

export const OnDemandKpis = open("../../../resources/kpi-definitions/functional/OnDemandKPIs.json");

export const LateComplexKpi = open("../../../resources/kpi-definitions/functional/LateComplexKpi.json");

export const CpiKpis = open("../../../resources/kpi-definitions/characteristics/cpiSimpleAndComplex.json");

export const CauKpis = open("../../../resources/kpi-definitions/characteristics/cauSimpleAndComplex.json");

export const NewSimpleKpi = open("../../../resources/kpi-definitions/bur/NewSimpleKpi.json");

export const bodyForCalculatingOnDemandKPIs =
{
    "kpi_names": [
        "od_filter",
        "on_demand_percentile_index",
        "od_ae", "od_expr",
        "max_60_on_demand",
        "sum_60_on_demand",
        "post_agg_60_on_demand",
        "tabular_expression",
        "tabular_array",
        "on_demand_mo_counter_percentage",
        "on_demand_with_params",
        "sum_on_demand_check"
    ],
    "parameters": [
        {
            "name": "param.filter",
            "value": "ENM_Athlone_1"
        }, {
            "name": "treshold_value",
            "value": 10000
        }, {
            "name": "part_of_parsing",
            "value": "MeContext"
        }, {
            "name": "subnet",
            "value": "ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00016"
        }, {
            "name": "start_date_for_filter",
            "value": `${kafkaDataDate.toISOString().split('T')[0]}T23:00:00Z`
        }
    ],
    "tabular_parameters": [
        {
            "name": "mo_data",
            "format": "JSON",
            "value": "{\"mo_data\": [{\"nodeFDN\": \"ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00001\", \"moFdn\": \"ManagedElement=MoFDNManagedElement1,Equipment=1,SupportUnit=1,ManagedObject2=1\", \"mo_divide\": 500}, {\"nodeFDN\": \"ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00064\", \"moFdn\": \"ManagedElement=MoFDNManagedElement1,Equipment=1,SupportUnit=1,ManagedObject2=1\", \"mo_divide\": 40}, {\"nodeFDN\": \"ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00029\", \"moFdn\": \"ManagedElement=MoFDNManagedElement1,Equipment=1,SupportUnit=1,ManagedObject2=1\", \"mo_divide\": 50}, {\"nodeFDN\": \"ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00002\", \"moFdn\": \"ManagedElement=MoFDNManagedElement1,Equipment=1,SupportUnit=1,ManagedObject2=1\", \"mo_divide\": 125}, {\"nodeFDN\": \"ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00016\", \"moFdn\": \"ManagedElement=MoFDNManagedElement1,Equipment=1,SupportUnit=1,ManagedObject2=1\", \"mo_divide\": 400}]}"
        },
        {
            "name": "mo_data_for_array",
            "format": "CSV",
            "header": "nodeFDN,mo_multiply",
            "value": "\"ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00001\",3\n\"ManagedElement=NodeFDNManagedElement0,Equipment=0,SupportUnit=0,MeContext=Node00002\",5\n\"ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00003\",9"
        }
    ]
};

export const bodyForSoftDelete = '["mo_max_1440_simple","sum_1440_complex","on_demand_with_params","on_demand_percentile_index"]';


export var exporterMetrics = [
    "pm_stats_exporter_backup_timer_seconds_count",
    "pm_stats_exporter_backup_timer_seconds_max",
    "pm_stats_exporter_backup_timer_seconds_sum",
    "pm_stats_exporter_completed_timestamp_timer_seconds_count",
    "pm_stats_exporter_completed_timestamp_timer_seconds_max",
    "pm_stats_exporter_completed_timestamp_timer_seconds_sum",
    "pm_stats_exporter_cts_avro_export",
    "pm_stats_exporter_exec_arrive",
    "pm_stats_exporter_execution_report_timer_seconds_count",
    "pm_stats_exporter_execution_report_timer_seconds_max",
    "pm_stats_exporter_execution_report_timer_seconds_sum",
    "pm_stats_exporter_execution_report_validation_timer_seconds_count",
    "pm_stats_exporter_execution_report_validation_timer_seconds_max",
    "pm_stats_exporter_execution_report_validation_timer_seconds_sum",
    "pm_stats_exporter_number_of_execution_reports_from_Kafka_total",
    "pm_stats_exporter_number_of_created_schemas_in_data_catalog_total",
    "pm_stats_exporter_number_of_different_tables_in_execution_reports_total",
    "pm_stats_exporter_number_of_kpis_in_execution_reports_total",
    "pm_stats_exporter_number_of_read_rows_from_postgres_total",
    "pm_stats_exporter_number_of_records_put_on_Kafka_total",
    "pm_stats_exporter_number_of_tables_in_execution_reports_total",
    "pm_stats_exporter_number_of_tr_1_failed_execution_report_msg_validation_total",
    "pm_stats_exporter_number_of_tr_2_empty_postgres_queries_total",
    "pm_stats_exporter_number_of_tr_2_invalid_completed_timestamp_msg_total",
    "pm_stats_exporter_number_of_tr_2_processed_completed_timestamp_msg_total",
    "pm_stats_exporter_number_of_tr_2_successful_kafka_writings_total",
    "pm_stats_exporter_number_of_tr_2_successful_postgres_queries_total",
    "pm_stats_exporter_occurrence_of_table_in_execution_reports_total",
    "pm_stats_exporter_occurrence_of_a_table_in_an_avro_topic_total",
    "pm_stats_exporter_time_of_tr_1_ms_total",
    "pm_stats_exporter_time_of_tr_2_ms_total"]

export var queryMetrics = ["pm_stats_query_service_build_count_query_timer_seconds_count",
    "pm_stats_query_service_build_count_query_timer_seconds_max",
    "pm_stats_query_service_build_count_query_timer_seconds_sum",
    "pm_stats_query_service_build_listing_query_timer_seconds_count",
    "pm_stats_query_service_build_listing_query_timer_seconds_max",
    "pm_stats_query_service_build_listing_query_timer_seconds_sum",
    "pm_stats_query_service_built_count_queries_counter_total",
    "pm_stats_query_service_built_listing_queries_counter_total",
    "pm_stats_query_service_convert_result_list_timer_seconds_count",
    "pm_stats_query_service_convert_result_list_timer_seconds_max",
    "pm_stats_query_service_convert_result_list_timer_seconds_sum",
    "pm_stats_query_service_count_query_execution_timer_seconds_count",
    "pm_stats_query_service_count_query_execution_timer_seconds_max",
    "pm_stats_query_service_count_query_execution_timer_seconds_sum",
    "pm_stats_query_service_executed_count_queries_counter_total",
    "pm_stats_query_service_executed_listing_queries_counter_total",
    "pm_stats_query_service_exposed_schemas_gauge",
    "pm_stats_query_service_get_schema_timer_seconds_count",
    "pm_stats_query_service_get_schema_timer_seconds_max",
    "pm_stats_query_service_get_schema_timer_seconds_sum",
    "pm_stats_query_service_get_table_timer_seconds_count",
    "pm_stats_query_service_get_table_timer_seconds_max",
    "pm_stats_query_service_get_table_timer_seconds_sum",
    "pm_stats_query_service_list_columns_timer_seconds_count",
    "pm_stats_query_service_list_columns_timer_seconds_max",
    "pm_stats_query_service_list_columns_timer_seconds_sum",
    "pm_stats_query_service_list_tables_timer_seconds_count",
    "pm_stats_query_service_list_tables_timer_seconds_max",
    "pm_stats_query_service_list_tables_timer_seconds_sum",
    "pm_stats_query_service_query_execution_timer_seconds_count",
    "pm_stats_query_service_query_execution_timer_seconds_max",
    "pm_stats_query_service_query_execution_timer_seconds_sum",
    "pm_stats_query_service_records_counter_total",
    "pm_stats_query_service_schema_change_events_counter_total",
    "pm_stats_query_service_served_queries_counter_total"]

export var calculatorMetrics = ["pm_stats_calculator_api_definition_post_endpoint_duration_ms_count",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_oneminuterate",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_fiveminuterate",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_fifteenminuterate",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_50thpercentile",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_75thpercentile",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_95thpercentile",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_98thpercentile",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_99thpercentile",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_999thpercentile",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_max",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_min",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_mean",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_meanrate",
    "pm_stats_calculator_api_definition_post_endpoint_duration_ms_stddev",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_50thpercentile",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_75thpercentile",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_95thpercentile",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_98thpercentile",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_999thpercentile",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_99thpercentile",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_count",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_fifteenminuterate",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_fiveminuterate",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_max",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_mean",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_meanrate",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_min",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_oneminuterate",
    "pm_stats_calculator_api_definition_delete_endpoint_duration_ms_stddev",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_50thpercentile",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_75thpercentile",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_95thpercentile",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_98thpercentile",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_999thpercentile",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_99thpercentile",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_count",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_fifteenminuterate",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_fiveminuterate",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_max",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_mean",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_meanrate",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_min",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_oneminuterate",
    "pm_stats_calculator_api_definition_get_endpoint_duration_ms_stddev",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_50thpercentile",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_75thpercentile",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_95thpercentile",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_98thpercentile",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_999thpercentile",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_99thpercentile",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_count",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_fifteenminuterate",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_fiveminuterate",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_max",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_mean",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_meanrate",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_min",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_oneminuterate",
    "pm_stats_calculator_api_definition_patch_endpoint_duration_ms_stddev",
    "pm_stats_calculator_scheduler_current_on_demand_calculation_count",
    "pm_stats_calculator_scheduler_on_demand_calculation_queue_count",
    "pm_stats_calculator_scheduler_on_demand_calculation_queue_remaining_weight_count",
    "pm_stats_calculator_scheduler_on_demand_sql_queries_to_be_executed_towards_datasource_count",
    "pm_stats_calculator_scheduler_scheduled_calculation_queue_count",
    "pm_stats_calculator_scheduler_scheduled_calculation_queue_remaining_weight_count",
    "pm_stats_calculator_spark_calculation_start_time_number",
    "pm_stats_calculator_spark_calculation_duration_number",
    "pm_stats_calculator_spark_calculation_end_time_number"]
