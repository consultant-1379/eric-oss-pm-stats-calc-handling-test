#!/usr/bin/env bash

echo "---uninstall NMAP---"
helm uninstall nmap -n ${NAMESPACE} --kubeconfig ${KUBECONFIG}