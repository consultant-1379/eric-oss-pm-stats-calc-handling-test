{{/*
Expand the name of the chart.
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Common labels
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.labels" -}}
helm.sh/chart: {{ include "eric-oss-pm-stats-calc-handling-test.chart" . }}
{{ include "eric-oss-pm-stats-calc-handling-test.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
{{/*
Selector labels
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.selectorLabels" -}}
app.kubernetes.io/name: {{ include "eric-oss-pm-stats-calc-handling-test.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{/*
Create the name of the service account to use
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "eric-oss-pm-stats-calc-handling-test.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
check global.security.tls.enabled
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.global-security-tls-enabled" -}}
{{- if  .Values.global -}}
  {{- if  .Values.global.security -}}
    {{- if  .Values.global.security.tls -}}
      {{- .Values.global.security.tls.enabled | toString -}}
    {{- else -}}
      {{- "false" -}}
    {{- end -}}
  {{- else -}}
    {{- "false" -}}
  {{- end -}}
{{- else -}}
  {{- "false" -}}
{{- end -}}
{{- end -}}

{{/*
DR-D470217-007-AD This helper defines whether this service enter the Service Mesh or not.
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.service-mesh-enabled" }}
  {{- $globalMeshEnabled := "false" -}}
  {{- if .Values.global -}}
    {{- if .Values.global.serviceMesh -}}
        {{- $globalMeshEnabled = .Values.global.serviceMesh.enabled -}}
    {{- end -}}
  {{- end -}}
  {{- $globalMeshEnabled -}}
{{- end -}}


{{/*
DR-D470217-011 This helper defines the annotation which bring the service into the mesh.
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.service-mesh-inject" }}
{{- if eq (include "eric-oss-pm-stats-calc-handling-test.service-mesh-enabled" .) "true" }}
sidecar.istio.io/inject: "true"
{{- else -}}
sidecar.istio.io/inject: "false"
{{- end -}}
{{- end -}}

{{/*
GL-D470217-080-AD
This helper captures the service mesh version from the integration chart to
annotate the workloads so they are redeployed in case of service mesh upgrade.
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.service-mesh-version" }}
{{- if eq (include "eric-oss-pm-stats-calc-handling-test.service-mesh-enabled" .) "true" }}
  {{- if .Values.global.serviceMesh -}}
    {{- if .Values.global.serviceMesh.annotations -}}
      {{ .Values.global.serviceMesh.annotations | toYaml }}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- end -}}

{{/*
Define kafka bootstrap server
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.kafka-bootstrap-server" -}}
{{- $kafkaBootstrapServer := "" -}}
{{- $serviceMesh := ( include "eric-oss-pm-stats-calc-handling-test.service-mesh-enabled" . ) -}}
{{- $tls := ( include "eric-oss-pm-stats-calc-handling-test.global-security-tls-enabled" . ) -}}
{{- if and (eq $serviceMesh "true") (eq $tls "true") -}}
    {{- $kafkaBootstrapServer = .Values.kafka.bootstrapServerTls -}}
{{ else }}
    {{- $kafkaBootstrapServer = .Values.kafka.bootstrapServer -}}
{{ end }}
{{- print $kafkaBootstrapServer -}}
{{- end -}}

{{/*
This helper defines the annotation for define service mesh volume.
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.service-mesh-volume" }}
{{- if and (eq (include "eric-oss-pm-stats-calc-handling-test.service-mesh-enabled" .) "true") (eq (include "eric-oss-pm-stats-calc-handling-test.global-security-tls-enabled" .) "true") }}
sidecar.istio.io/userVolume: '{"eric-oss-pm-stats-calculator-eric-pm-kpi-data-certs-tls":{"secret":{"secretName":"eric-oss-pm-stats-calculator-eric-pm-kpi-data-secret","optional":true}},"eric-oss-pm-stats-calc-handling-test-kafka-bootstrap-certs-tls":{"secret":{"secretName":"eric-oss-pm-stats-calc-handling-test-eric-oss-dmm-kf-op-sz-kafka-bootstrap-secret","optional":true}},"eric-oss-pm-stats-calc-handling-test-certs-ca-tls":{"secret":{"secretName":"eric-sec-sip-tls-trusted-root-cert"}}}'
sidecar.istio.io/userVolumeMount: '{"eric-oss-pm-stats-calculator-eric-pm-kpi-data-certs-tls":{"mountPath":"/etc/istio/tls/eric-pm-kpi-data/","readOnly":true},"eric-oss-pm-stats-calc-handling-test-kafka-bootstrap-certs-tls":{"mountPath":"/etc/istio/tls/eric-oss-dmm-kf-op-sz-kafka-bootstrap/","readOnly":true},"eric-oss-pm-stats-calc-handling-test-certs-ca-tls":{"mountPath":"/etc/istio/tls-ca","readOnly":true}}'
{{ end }}
{{- end -}}

{{/*
This helper defines which out-mesh services are reached by the eric-oss-pm-stats-calc-handling-test.
*/}}
{{- define "eric-oss-pm-stats-calc-handling-test.service-mesh-ism2osm-labels" }}
{{- if eq (include "eric-oss-pm-stats-calc-handling-test.service-mesh-enabled" .) "true" }}
  {{- if eq (include "eric-oss-pm-stats-calc-handling-test.global-security-tls-enabled" .) "true" }}
eric-oss-dmm-kf-op-sz-kafka-ism-access: "true"
eric-pm-kpi-data-ism-access: "true"
  {{- end }}
{{- end -}}
{{- end -}}

{{- define "get-application-version" -}}
  {{- $configMapObj := (lookup "v1" "ConfigMap" .Release.Namespace "eric-installed-applications") }}
  {{- $configData := (get $configMapObj.data "Installed") | fromYaml }}
  {{- range $configData.csar }}
    {{- if eq .name $.Values.env.APP_NAME }}
        {{ .version }}
    {{ end}}
  {{- end}}
{{- end}}

{{- define "get-product-version" -}}
  {{- $configMapObj := (lookup "v1" "ConfigMap" .Release.Namespace "eric-installed-applications") }}
  {{- $configData := (get $configMapObj.data "Installed") | fromYaml }}
  {{ $configData.helmfile.release }}
{{- end}}
