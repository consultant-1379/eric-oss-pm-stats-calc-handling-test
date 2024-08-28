#!/usr/bin/env bash

echo "truncating and dropping tables"

kubectl exec -it eric-pm-kpi-data-0 -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -- sh \
-c "psql -U kpi_service_user -d kpi_service_db \
-c 'truncate table readiness_log cascade;' \
-c 'truncate table complex_readiness_log cascade;' \
-c 'truncate table latest_processed_offsets cascade;' \
-c 'truncate table kpi_execution_groups cascade;' \
-c 'truncate table kpi_calculation cascade;' \
-c 'truncate table kpi_definition cascade;' \
-c 'truncate table latest_source_data cascade;' \
-c 'truncate table calculation_reliability cascade;' \
-c 'truncate table on_demand_tabular_parameters cascade;' \
-c 'truncate table on_demand_definitions_per_calculation cascade;' \
-c 'truncate table on_demand_parameters cascade;' \
-c 'drop table if exists kpi_cell_15 cascade;' \
-c 'drop table if exists kpi_cell_60 cascade;' \
-c 'drop table if exists kpi_cell_complex_15 cascade;' \
-c 'drop table if exists kpi_cell_complex_60 cascade;' \
-c 'drop table if exists kpi_cell_complex_1440 cascade;' \
-c 'drop table if exists kpi_cell_guid_60 cascade;' \
-c 'drop table if exists kpi_cell_guid_flm_60 cascade;' \
-c 'drop table if exists kpi_cell_sector_60 cascade;' \
-c 'drop table if exists kpi_sector_60 cascade;' \
-c 'drop table if exists kpi_cell_guid_1440 cascade;' \
-c 'drop table if exists kpi_cell_guid_flm_1440 cascade;' \
-c 'drop table if exists kpi_relation_guid_source_guid_target_guid_1440 cascade;'"
