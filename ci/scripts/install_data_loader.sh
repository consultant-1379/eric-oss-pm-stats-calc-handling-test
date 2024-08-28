#!/usr/bin/env bash

config="./src/resources/configs/config.json"
if [[ $KPI_SET == "CPI" ]]; then
	config="./src/resources/configs/config-cpi.json"
elif [[ $KPI_SET == "CAU" ]]; then
	config="./src/resources/configs/config-cau.json"
elif [[ $KPI_SET == "BUR" ]]; then
	config="./src/resources/configs/config-bur.json"
fi

echo "---delete data loader folder if present---"
rm -rf ./src/js/eric-oss-data-loader

echo "---add proj-eric-oss-drop-helm repo---"
helm repo add proj-eric-oss-drop-helm-bragi https://arm.seli.gic.ericsson.se/artifactory/proj-eric-oss-drop-helm-local --username ${FUNCTIONAL_USER_USERNAME} --password ${FUNCTIONAL_USER_PASSWORD}

echo "---update helm repos---"
helm repo update proj-eric-oss-drop-helm-bragi

echo "---list helm repos---"
helm repo ls

echo "---pull data loader---"
helm pull proj-eric-oss-drop-helm-bragi/eric-oss-data-loader --devel --untar=true --version 1.0.27-169 --destination ./src/js/

echo "---check Data Loader is present---"
ls ./src/js/

echo "---copy config file---"
cp $config ./src/js/eric-oss-data-loader/config/config.default.json

if [ ! $KPI_SET ]; then
	echo "---update config file---"
	date_of_yesterday=$(date -u -d "yesterday" +"%Y-%m-%d")
	sed -i -E "s/(\"firstRopStartDate\":.*\")(.+)(\",)/\1$date_of_yesterday\3/g" ./src/js/eric-oss-data-loader/config/config.default.json
	cat ./src/js/eric-oss-data-loader/config/config.default.json | grep -i 'firstRopStartDate'
fi

echo "---synchronizing the start of data generator to calculator (5 min.) heartbeat---"
offset=90
if [ $KPI_SET ]; then
	offset=0
fi
#offset has to be lower than 300 seconds (= 5 minutes, default calculator heartbeat)
current_hour=$(date +"%H")
current_min=$(date +"%M")
current_sec=$(date +"%S")
echo "Current time: ${current_hour}:${current_min}:${current_sec}"
next_chb_min=$(( 5 - (10#$current_min % 5) + 10#$current_min))
echo "next CHB min: ${next_chb_min}"
remaining_time=$((($next_chb_min - 10#$current_min) * 60 - 10#$current_sec))
sleep_in_seconds=$(($remaining_time - $offset))
if [ ${sleep_in_seconds} -ge 0 ]
then
	echo "Sleeping ${sleep_in_seconds} seconds..."
	sleep ${sleep_in_seconds}
else
	echo "Offset (${offset}) is higher than the remaining time (${remaining_time}) until next CHB"
	sleep_beyond_chb=$(($remaining_time + 300 - $offset))
	echo "Sleeping ${sleep_beyond_chb} seconds..."
	sleep ${sleep_beyond_chb}
fi

echo "---install data loader---"
helm install data-loader ./src/js/eric-oss-data-loader -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} \
--set imageCredentials.eric-oss-data-generator.pullSecret=k8s-registry-secret --set global.security.tls.enabled=true --set global.serviceMesh.enabled=true
