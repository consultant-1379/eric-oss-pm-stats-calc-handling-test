#!/usr/bin/env bash

echo create array
services=("eric-oss-pm-stats-calculator" "eric-oss-pm-stats-exporter" "eric-oss-pm-stats-query-service" "eric-pm-kpi-data" "eric-pm-kpi-data-replica" "eric-pm-kpi-spark-cluster")
service_ips=""

echo get service ip
for ((i=0; i<${#services[@]}; i++)); do
	service_ips+="$(kubectl get service/${services[$i]} -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -o jsonpath='{.spec.clusterIP}') "
done

echo "$service_ips"

echo get nmap pod name
nmap_pod=$(kubectl -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods  --selector=app=nmap  -o name)
nmap_pod_name=${nmap_pod##*/}

echo wait 10 sec
sleep 10

echo run nmap commands
kubectl exec -it ${nmap_pod_name} -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -- nmap -T5 -Pn -sT -sU -sY -sZ -oA nmapPMH ${service_ips}
#echo create folder
#kubectl exec -it ${nmap_pod_name} -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -- mkdir nmap
#echo copy files
#kubectl exec -it ${nmap_pod_name} -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -- cp nmapPMH.* /nmap/
echo list folders
kubectl exec -it ${nmap_pod_name} -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -- ls
#kubectl exec -it ${nmap_pod_name} -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} -- ls /nmap