#!/usr/bin/env bash

echo "---remove release if exist"
helm uninstall eric-oss-pm-stats-calc-handling-test -n ${NAMESPACE} --kubeconfig ${KUBECONFIG}

echo "---remove existing eric-oss-pm-stats-calc-handling-test"
rm -rf ./eric-oss-pm-stats-calc-handling-test

echo "---add proj-eric-oss-drop-helm repo---"
helm repo add proj-eric-oss-drop-helm-bragi https://arm.seli.gic.ericsson.se/artifactory/proj-eric-oss-drop-helm-local --username ${FUNCTIONAL_USER_USERNAME} --password ${FUNCTIONAL_USER_PASSWORD}

echo "---update helm repos---"
helm repo update proj-eric-oss-drop-helm-bragi

echo "---list helm repos---"
helm repo ls

echo "---pull eric-oss-pm-stats-calc-handling-test---"
helm pull proj-eric-oss-drop-helm-bragi/eric-oss-pm-stats-calc-handling-test --untar=true --destination ./

echo "---check eric-oss-pm-stats-calc-handling-test is successfully pulled---"
ls ./

echo "---install testware---"
helm install eric-oss-pm-stats-calc-handling-test ./eric-oss-pm-stats-calc-handling-test/ \
--set env.BUILD_URL=${BUILD_URL} \
--set env.APIGW_USER=${APIGW_USER} \
--set env.APIGW_PASSWORD=${APIGW_PASSWORD} \
--set env.SEF_ADMIN_USER=${SEF_ADMIN_USER} \
--set env.SEF_ADMIN_PASSWORD=${SEF_ADMIN_PASSWORD} \
${KPI_SET:+
--set env.MAIN_TEST_FILE=${MAIN_TEST_FILE} \
--set env.OPTIONS_FILE=${OPTIONS_FILE} \
--set env.KPI_SET=${KPI_SET} \
--set env.THRESHOLDS="false" \
} \
-n ${NAMESPACE} --kubeconfig ${KUBECONFIG}
