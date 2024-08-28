import time
import kubernetes.client
from logger import logger



NAMESPACE = open("/var/run/secrets/kubernetes.io/serviceaccount/namespace", "r").read()
TOKEN = open("/var/run/secrets/kubernetes.io/serviceaccount/token", "r").read()
CA_CERT_PATH = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"


configuration = kubernetes.client.Configuration(
    host="https://kubernetes.default.svc",
    api_key={
        "authorization": f"Bearer {TOKEN}"
    }
)
configuration.ssl_ca_cert = CA_CERT_PATH


def kubernetes_get_pods(selector=None):
    with kubernetes.client.ApiClient(configuration) as api_client:
        api_instance = kubernetes.client.CoreV1Api(api_client)
        response = api_instance.list_namespaced_pod(NAMESPACE, label_selector=selector)
        return api_client.sanitize_for_serialization(response)

def kubernetes_get_pod(name):
    with kubernetes.client.ApiClient(configuration) as api_client:
        api_instance = kubernetes.client.CoreV1Api(api_client)
        response = api_instance.read_namespaced_pod(name, NAMESPACE)
        return api_client.sanitize_for_serialization(response)

def kubernetes_scale_deployment(name, replicas):
    with kubernetes.client.ApiClient(configuration) as api_client:
        api_instance = kubernetes.client.AppsV1Api(api_client)
        response = api_instance.patch_namespaced_deployment_scale(name, NAMESPACE, {"spec": {"replicas": replicas}})
        return api_client.sanitize_for_serialization(response)


def kubernetes_restart_calculator_pod(deployment="eric-oss-pm-stats-calculator"):
    logger.info("Stopping calculator pod")
    kubernetes_scale_deployment(deployment, 0)

    logger.info("Waiting for calculator pod shutdown")
    pods = 1
    while pods != 0:
        pods = len(kubernetes_get_pods(selector=f"app.kubernetes.io/name={deployment}")["items"])
        time.sleep(5)

    logger.info("Restarting calculator pod")
    kubernetes_scale_deployment(deployment, 1)
