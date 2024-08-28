import os
import re
import time
from confluent_kafka import Consumer, TopicPartition, KafkaError
from confluent_kafka.admin import AdminClient
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroDeserializer
from confluent_kafka.serialization import SerializationContext, MessageField, StringDeserializer
from logger import logger



class KafkaConsumerContext():
    def __enter__(self):
        self.consumer = Consumer({
            "bootstrap.servers": os.environ["KAFKA_BOOTSTRAP_SERVERS"],
            "group.id": "kafka-sidecar",
            "auto.offset.reset": "earliest",
            "enable.partition.eof": True
        })
        return self.consumer

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.consumer.close()

class KafkaAdminContext():
    def __enter__(self):
        self.admin = AdminClient({
            "bootstrap.servers": os.environ["KAFKA_BOOTSTRAP_SERVERS"]
        })
        return self.admin

    def __exit__(self, exc_type, exc_value, exc_traceback):
        pass


def kafka_topics():
    logger.info(f"Getting kafka topics")
    with KafkaConsumerContext() as consumer:
        topics = list(consumer.list_topics().topics)
    logger.info(f"Topics: {topics}")
    return topics

def kafka_partitions(topic):
    logger.info(f"Getting partitions for \"{topic}\" topic")
    partitions = []
    with KafkaConsumerContext() as consumer:
        topics = consumer.list_topics().topics
        if topic in topics:
            partitions = list(topics[topic].partitions)
    logger.info(f"Partitions: {partitions}")
    return partitions

def kafka_message_count(topic, partition, consume):
    logger.info(f"Getting message count for \"{topic}\" topic")
    count = 0
    partitions = [partition] if partition else kafka_partitions(topic)
    for p in partitions:
        with KafkaConsumerContext() as consumer:
            if consume:
                topic_partition = TopicPartition(topic, p, 0)
                consumer.assign([topic_partition])
                consumer.seek(topic_partition)
                while True:
                    msg = consumer.poll(1)
                    if msg is None:
                        continue

                    if msg.error():
                        if msg.error().code() == KafkaError._PARTITION_EOF:
                            break
                        logger.warning(f"Consumer error: {msg.error()}")
                        continue

                    count += 1
            else:
                topic_partition = TopicPartition(topic, p)
                start_offset, end_offset = consumer.get_watermark_offsets(topic_partition)
                count += end_offset - start_offset
    logger.info(f"Message count: {count}")
    return count

def kafka_messages(topic, partition, limit, deserializer):
    logger.info(f"Getting messages for \"{topic}\" topic")
    deserializers = {
        "avro": AvroDeserializer(SchemaRegistryClient({ "url": os.environ["SCHEMA_REGISTRY_HOSTNAME"] })),
        "string": StringDeserializer()
    }
    count = 0
    messages = []
    partitions = [partition] if partition else kafka_partitions(topic)
    for p in partitions:
        with KafkaConsumerContext() as consumer:
            topic_partition = TopicPartition(topic, p, 0)
            consumer.assign([topic_partition])
            consumer.seek(topic_partition)
            while limit != count:
                msg = consumer.poll(1)
                if msg is None:
                    continue

                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        break
                    logger.warning(f"Consumer error: {msg.error()}")
                    continue

                count += 1
                if deserializer in deserializers:
                    value = deserializers[deserializer](msg.value(), SerializationContext(msg.topic(), MessageField.VALUE))
                else:
                    value = re.escape(str(msg.value()))

                messages.append({
                    "partition": msg.partition(),
                    "offset": msg.offset(),
                    "value": value
                })

    logger.info(f"Message count: {count}")
    return messages

def kafka_topic_delete(topic):
    logger.info(f"Deleting \"{topic}\" topic")
    with KafkaAdminContext() as admin:
        futures = admin.delete_topics([topic], operation_timeout=30)
        for f in futures.values():
            f.result()
    time.sleep(10)
