#!/usr/bin/env bash

echo "truncating and dropping tables"

if [ "$DB_CLEANUP" = true ]; then

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
-c 'drop table if exists kpi_fdn_complex_aggr_element_60 cascade;' \
-c 'drop table if exists kpi_fdn_complex_expr_60 cascade;' \
-c 'drop table if exists kpi_fdn_od_aggr_element_60 cascade;' \
-c 'drop table if exists kpi_fdn_od_expr_60 cascade;' \
-c 'drop table if exists kpi_fdn_od_filter_60 cascade;' \
-c 'drop table if exists kpi_fdn_simple_expr_60 cascade;' \
-c 'drop table if exists kpi_mo_complex_ cascade;' \
-c 'drop table if exists kpi_mo_complex_1_15 cascade;' \
-c 'drop table if exists kpi_mo_complex_2_60 cascade;' \
-c 'drop table if exists kpi_mo_complex_2_innerjoin_60 cascade;' \
-c 'drop table if exists kpi_mo_complex_3_1440 cascade;' \
-c 'drop table if exists kpi_mo_complex_4_60 cascade;' \
-c 'drop table if exists kpi_mo_on_demand_1_15 cascade;' \
-c 'drop table if exists kpi_mo_on_demand_2_post_agg_60 cascade;' \
-c 'drop table if exists kpi_mo_on_demand_4_60 cascade;' \
-c 'drop table if exists kpi_mo_on_demand_param_60 cascade;' \
-c 'drop table if exists kpi_mo_on_demand_result_check_1440 cascade;' \
-c 'drop table if exists kpi_mo_simple_ cascade;' \
-c 'drop table if exists kpi_mo_simple_1_15 cascade;' \
-c 'drop table if exists kpi_mo_simple_2_60 cascade;' \
-c 'drop table if exists kpi_mo_simple_3_1440 cascade;' \
-c 'drop table if exists kpi_mo_simple_4_1440 cascade;' \
-c 'drop table if exists kpi_mo_simple_array_60 cascade;' \
-c 'drop table if exists kpi_mo_simple_dll_15 cascade;' \
-c 'drop table if exists kpi_ondemand_tabular_1440 cascade;' \
-c 'drop table if exists kpi_mo_simple_for_bur_15 cascade;' \
-c 'drop table if exists kpi_ondemand_tabular_array_60 cascade;'"

fi