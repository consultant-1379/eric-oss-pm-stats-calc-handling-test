#!/usr/bin/env bash
REPORT_PATH=$1
NAMESPACE=$2


retries="90";
if [ $KPI_SET ]; then
	retries="150"
fi
sleep_duration="60";
pod="eric-oss-pm-stats-calc-handling-test";

while [ $retries -ge 0 ]
do
    kubectl --kubeconfig ${KUBECONFIG} cp ${NAMESPACE}/${pod}:/reports/summary.json ${REPORT_PATH}/summary.json
    if [[ "$retries" -eq "0" ]]
    then
        echo no report file available
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${pod} > ${REPORT_PATH}/${pod}.log
        exit 1
    elif ! test -f ${REPORT_PATH}/summary.json;
    then
        let "retries-=1"
        echo report not available, Retries left = $retries :: Sleeping for $sleep_duration seconds
        sleep $sleep_duration
        time="$(date +%F-%T)"
        kubectl top pods --no-headers -n ${NAMESPACE} | while read line; do echo -e "$time   $line" >> resource_usage.log; done
    else
        echo report copied
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${pod} > ${REPORT_PATH}/${pod}.log
        break
    fi
done
