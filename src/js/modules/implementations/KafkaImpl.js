import { sleep } from "k6";
import http from "k6/http";
import { URLS } from "../constants/Constants.js";


export function getTopics() {
    console.log("Getting topic names");
    const response = http.get(`${URLS.KAFKA_SIDECAR_ENDPOINT}/get-kafka-topics`);
    const topics = response.json();
    console.log(`Got topics: ${JSON.stringify(topics)}'`);
    return topics;
}

export function getMessageCountForTopic(topic, consume=false) {
    console.log(`Getting message count for '${topic}' topic`);
    const response = http.get(`${URLS.KAFKA_SIDECAR_ENDPOINT}/get-kafka-message-count?topic=${topic}&consume=${consume}`);
    const count = response.json();
    console.log(`Got message count: ${count}`);
    return count;
}

export function getMessagesOnTopic(topic) {
    console.log(`Getting messages on '${topic}' topic`);
    const response = http.get(`${URLS.KAFKA_SIDECAR_ENDPOINT}/get-kafka-messages?topic=${topic}&deserializer=avro`);
    const messages = response.json();
    return messages;
}

export function deleteTopic(topic) {
    console.log(`Deleting '${topic}' topic`);
    const response = http.post(`${URLS.KAFKA_SIDECAR_ENDPOINT}/delete-kafka-topic?topic=${topic}`);
    console.log(`Got status code: ${response.status}`);
    return response;
}

export function poll({ interval, times, pollingFunction, pollingFunctionArgs, checker }) {
    console.log(`Starting polling for '${pollingFunction.name}' function`);
    for (let i = 1; i <= times; i++) {
        console.log(`Iteration ${i} out of ${times}`);
        const result = pollingFunction.apply(this, pollingFunctionArgs);
        if (i === times || checker(result)) {
            return result;
        }
        sleep(interval);
    }
}

export function getNumberOfMessagesForKPI(messages, kpi) {
    let numberOfMessages = 0;
    for (let i = 0; i < messages.length; i++) {
        if (kpi in messages[i].value) {
            numberOfMessages += 1;
        }
    }
    return numberOfMessages;
}

export function getAggregationBeginTimesForKPI(messages, kpi) {
    let aggregationBeginTimes = [];
    for (let i = 0; i < messages.length; i++) {
        if (kpi in messages[i].value) {
            let row = messages[i].value;
            if ("aggregation_begin_time" in row && !aggregationBeginTimes.includes(row.aggregation_begin_time)) {
                aggregationBeginTimes.push(row.aggregation_begin_time);
            }
        }
    }
    aggregationBeginTimes.sort();
    return aggregationBeginTimes;
}
