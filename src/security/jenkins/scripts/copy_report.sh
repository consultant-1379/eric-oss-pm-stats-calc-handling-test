#!/usr/bin/env bash
REPORT_PATH=$1
NAMESPACE=$2


get_pod=$(kubectl -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods --selector=app=nmap -o name)
pod=${get_pod##*/}
echo "pod: ${pod}"

echo copy NMAP report
kubectl --kubeconfig ${KUBECONFIG} cp ${NAMESPACE}/${pod}:nmapPMH.gnmap ${REPORT_PATH}/nmapPMH.gnmap -c nmap
kubectl --kubeconfig ${KUBECONFIG} cp ${NAMESPACE}/${pod}:nmapPMH.nmap ${REPORT_PATH}/nmapPMH.nmap -c nmap
kubectl --kubeconfig ${KUBECONFIG} cp ${NAMESPACE}/${pod}:nmapPMH.xml ${REPORT_PATH}/nmapPMH.xml -c nmap

echo list
ls ${REPORT_PATH}