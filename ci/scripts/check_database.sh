#!/usr/bin/env bash

echo "listing tables: "

kubectl exec -it eric-pm-kpi-data-0 -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -- sh \
-c "psql -U kpi_service_user -d kpi_service_db \
-c '\dt'"

echo "checking content of tables: latest_processed_offsets, kpi_calculation, kpi_definition, kpi_execution_groups, readiness_log, and complex_readiness_log"

kubectl exec -it eric-pm-kpi-data-0 -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -- sh \
-c "psql -U kpi_service_user -d kpi_service_db \
-c 'select * from latest_processed_offsets;' \
-c 'select * from kpi_calculation order by time_created;' \
-c 'select * from kpi_definition;' \
-c 'select * from kpi_execution_groups;' \
-c 'select * from readiness_log;' \
-c 'select * from complex_readiness_log;'"
