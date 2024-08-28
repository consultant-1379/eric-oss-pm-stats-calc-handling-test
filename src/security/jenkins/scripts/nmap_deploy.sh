#!/usr/bin/env bash

#!/usr/bin/env bash

#echo "---delete NMAP folder if present---"
#rm -rf ./src/security/nmap*

#echo "---add proj-eric-oss-drop-helm repo---"
#helm repo add proj-adp-spider-team-helm-bragi https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-adp-spider-team-helm --username ${FUNCTIONAL_USER_USERNAME} --password ${FUNCTIONAL_USER_PASSWORD}

echo "---update helm repos---"
helm repo update

echo "---list helm repos---"
helm repo ls

echo "---pull data loader---"
#helm pull proj-adp-spider-team-helm-bragi/nmap --devel --untar=true --destination ./src/security

echo "---check folder---"
ls ./src/security

echo "---install NMAP---"
helm install nmap ./src/security/nmap-1.0.0-6.tgz --namespace ${NAMESPACE} --username ${FUNCTIONAL_USER_USERNAME} --password ${FUNCTIONAL_USER_PASSWORD} --kubeconfig ${KUBECONFIG}
#helm install ./src/security/nmap --namespace ${NAMESPACE} --username ${FUNCTIONAL_USER_USERNAME} --password ${FUNCTIONAL_USER_PASSWORD} --kubeconfig ${KUBECONFIG}