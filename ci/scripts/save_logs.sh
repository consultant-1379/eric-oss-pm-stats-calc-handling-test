#!/usr/bin/env bash
REPORT_PATH=$1
NAMESPACE=$2


echo "-----------Data Loader----------"
kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-oss-data-loader --all-containers > ${REPORT_PATH}/eric-oss-data-loader.log
echo "-----------Schema Registry----------"
kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-schema-registry-sr --all-containers > ${REPORT_PATH}/eric-schema-registry-sr.log
echo "-----------Exporter----------"
kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-oss-pm-stats-exporter --all-containers > ${REPORT_PATH}/eric-oss-pm-stats-exporter.log
echo "-----------Calculator----------"
kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=10000000000000 --selector=app.kubernetes.io/name=eric-oss-pm-stats-calculator -c eric-oss-pm-stats-calculator > ${REPORT_PATH}/eric-oss-pm-stats-calculator.log
echo "-----------Query Service----------"
kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-oss-pm-stats-query-service --all-containers > ${REPORT_PATH}/eric-oss-pm-stats-query-service.log
echo "-----------Log transformer----------"
kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-log-transformer --all-containers > ${REPORT_PATH}/eric-log-transformer.log
echo "-----------Describe pods----------"
kubectl describe pods -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} > ${REPORT_PATH}/describe-pods.log
echo "-----------List containers----------"
kubectl --kubeconfig ${KUBECONFIG} get pods -n ${NAMESPACE} -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' | sort > ${REPORT_PATH}/containers.log
echo "-----------Get events-----------"
kubectl get events --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} --sort-by=.metadata.creationTimestamp > ${REPORT_PATH}/events.log