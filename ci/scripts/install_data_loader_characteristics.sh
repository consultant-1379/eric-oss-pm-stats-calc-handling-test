#!/usr/bin/env bash

echo "---delete data loader folder if present---"
rm -rf ./src/js/eric-oss-data-loader

echo "---add proj-eric-oss-drop-helm repo---"
helm repo add proj-eric-oss-drop-helm-bragi https://arm.seli.gic.ericsson.se/artifactory/proj-eric-oss-drop-helm-local --username ${FUNCTIONAL_USER_USERNAME} --password ${FUNCTIONAL_USER_PASSWORD}

echo "---update helm repos---"
helm repo update proj-eric-oss-drop-helm-bragi

echo "---list helm repos---"
helm repo ls

echo "---pull data loader---"
helm pull proj-eric-oss-drop-helm-bragi/eric-oss-data-loader --devel --untar=true --version 1.0.27-189 --destination ./src/js/

echo "---check Data Loader is present---"
ls ./src/js/

echo "---install data loader---"
helm install data-loader ./src/js/eric-oss-data-loader -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} \
--set imageCredentials.eric-oss-data-generator.pullSecret=k8s-registry-secret --set global.security.tls.enabled=true --set global.serviceMesh.enabled=true \
--set resources.eric-oss-data-generator.limits.cpu="6000m"
