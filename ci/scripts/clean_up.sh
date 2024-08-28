#!/usr/bin/env bash

echo "---uninstall data loader---"
helm uninstall data-loader -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} || true

echo "---remove proj-eric-oss-drop-helm repo---"
helm repo remove proj-eric-oss-drop-helm-bragi || true

echo "---remove eric-oss-pm-stats-calc-handling-app-test release---"
helm uninstall eric-oss-pm-stats-calc-handling-test -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} || true
