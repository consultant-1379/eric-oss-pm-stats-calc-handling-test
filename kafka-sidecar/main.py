from waitress import serve
from flask import Flask, request, jsonify
from kafka_consumer import *
from db_loader import *
from kubernetes_api import *
from logger import logger

app = Flask(__name__)

@app.before_request
def before_request():
    logger.info(f"{request.method} {request.environ['REQUEST_URI']}")

@app.route("/get-kafka-topics", methods=["GET"])
def get_kafka_topics():
    topics = kafka_topics()
    return jsonify(topics), 200

@app.route("/get-kafka-topic-partitions", methods=["GET"])
def get_kafka_topic_partitions():
    topic = request.args.get("topic")
    partitions = kafka_partitions(topic)
    return jsonify(partitions), 200

@app.route("/get-kafka-message-count", methods=["GET"])
def get_kafka_message_count():
    topic = request.args.get("topic")
    partition = request.args.get("partition", type=int)
    consume = request.args.get("consume", default="false").lower() == "true" # "consume=true" will count the actual messages, "false" will only use the offsets, which might not be accurate
    count = kafka_message_count(topic, partition, consume)
    return jsonify(count), 200

@app.route("/get-kafka-messages", methods=["GET"])
def get_kafka_messages():
    topic = request.args.get("topic")
    partition = request.args.get("partition", type=int)
    limit = request.args.get("limit", default=-1, type=int)
    deserializer = request.args.get("deserializer")
    messages = kafka_messages(topic, partition, limit, deserializer)
    return jsonify(messages), 200

@app.route("/delete-kafka-topic", methods=["POST"])
def delete_kafka_topic():
    topic = request.args.get("topic")
    kafka_topic_delete(topic)
    return jsonify(True), 200

@app.route("/restart-calculator-pod", methods=["POST"])
def restart_calculator_pod():
    kubernetes_restart_calculator_pod()
    return jsonify(True), 200

@app.route("/get-table-row-count", methods=["GET"])
def get_table_row_count():
    table = request.args.get("table")
    row_count = db_get_table_row_count(table)
    return jsonify(row_count), 200

@app.route("/", methods=["GET"])
def server_liveness():
    return "Server is up and live"

@app.route("/load-db", methods=["POST"])
def load_db():
    kpiSet = request.args.get("kpiSet")
    number_of_preloaded_days = request.args.get("number_of_preloaded_days")
    load_database(kpiSet, number_of_preloaded_days)
    return jsonify(True), 200

@app.route("/get-dbloading-status", methods=["GET"])
def get_loading():
    kpiSet = request.args.get("kpiSet")
    status = get_loading_status(kpiSet)
    return jsonify(status), 200

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8082, threads=10)
