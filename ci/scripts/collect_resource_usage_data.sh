#!/usr/bin/env bash
NAMESPACE=$1
SLEEP_DURATION=$2


while :
do
    time="$(date +%F-%T)"
    kubectl top pods --no-headers -n ${NAMESPACE} | while read line; do echo -e "$time   $line"; done
    sleep ${SLEEP_DURATION}
done
