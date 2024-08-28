<#
This build scrip is for build/re-build/install of K6 testware.
- Set the required variables below
- Start the script from the root directory
- For uninstall later the unbuild.ps1 script (created during install) can be used
Authors: ETSHCAM, EISTILY
#>

$signum = "<your_own_signum>"
$hostname = "<e.g. https://gas.klug020-x1.ews.gic.ericsson.se>"
$namespace = "<e.g. klug020-eric-eic-1>"
$tls = "false"
$servmesh = "true"
$sef = "true"
$secret = "apiVersion: v1
kind: Secret
metadata:
  name: testware-resources-secret
type: Opaque
data:
  api_url: aHR0cDovL2FwaS5kZXYtc3RhZ2luZy1yZXBvcnQuZXdzLmdpYy5lcmljc3Nvbi5zZS9hcGk=
  database_url: cG9zdGdyZXNxbDovL3Rlc3R3YXJlX3VzZXI6dGVzdHdhcmVAa3JvdG8wMTcucm5kLmdpYy5lcmljc3Nvbi5zZTozMDAwMS9zdGFnaW5n
  gui_url: aHR0cDovL2d1aS5kZXYtc3RhZ2luZy1yZXBvcnQuZXdzLmdpYy5lcmljc3Nvbi5zZS9zdGFnaW5nLXJlcG9ydHM="

if (Test-Path .\unbuild.ps1) {
    Remove-Item .\unbuild.ps1
}
New-Item -Path .\unbuild.ps1 -ItemType File -Value "helm uninstall eric-oss-pm-stats-calc-handling-test -n $namespace"

./gradlew clean build helmPackage

Set-Location build/helm/charts/eric-oss-pm-stats-calc-handling-test

New-Item -Path .\testware-resources-secret.yaml -ItemType File -Value $secret
kubectl apply -f testware-resources-secret.yaml

$images = @()
Get-ChildItem .\values.yaml | Get-Content | Foreach-Object {
    $line = $_
    $line -replace '(armdocker.+:[\d.]+)', "`$1-$signum"
    if ($line -match '(armdocker.+:[\d.]+)') {
        $image = $line | Select-String -Pattern '(armdocker.+:[\d.]+)' | % { $_.matches.groups[1].Value }
        $images += $image
    }
} | Set-Content -encoding Default .\values2.yaml

Remove-Item values.yaml
Rename-Item values2.yaml values.yaml

foreach ($image in $images) {
    $image_signum = "$image-$signum"
    docker image tag $image $image_signum
    docker image push $image_signum
}

helm install eric-oss-pm-stats-calc-handling-test . --set env.SCHEMA_REGISTRY_HOSTNAME=http://eric-schema-registry-sr:8081 --set env.DATA_CATALOG_HOSTNAME=http://eric-oss-data-catalog:9590 --set env.postgres.POSTGRES_USER=kpi_service_user --set env.postgres.POSTGRES_PASSWD="4YUwpduAVz7m" --set env.CALCULATOR_HOSTNAME=http://eric-oss-pm-stats-calculator:8080 --set env.QUERY_SERVICE_HOSTNAME=http://eric-oss-pm-stats-query-service:8080 --set env.HOSTNAME=$hostname --set env.APIGW_USER=calc-admin --set env.APIGW_PASSWORD=Ericsson123! --set env.BUILD_URL=build_url --set env.ENVIRONMENT=development --set env.NAMESPACE=$namespace -n $namespace --set env.EIC_HOSTNAME=$hostname --set env.SEF_STATUS=$sef --set env.SEF_ADMIN_USER="gas-user" --set env.SEF_ADMIN_PASSWORD="Ericsson123!" --set global.serviceMesh.enabled=$servmesh --set global.security.tls.enabled=$tls

Set-Location ../../../../
