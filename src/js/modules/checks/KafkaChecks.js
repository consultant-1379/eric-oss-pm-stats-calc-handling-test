import { check, fail, group, sleep } from "k6";
import { getTopics, getMessagesOnTopic, getMessageCountForTopic, deleteTopic, poll, getNumberOfMessagesForKPI, getAggregationBeginTimesForKPI } from "../implementations/KafkaImpl.js";


export function checkTopicExists(topic) {
    const topics = getTopics();
    if (!check(topics, {
        ["Check if topic exists"]: (t) => t.includes(topic)
    })) {
        fail(`'${topic}' topic does not exist!`);
    }
}

export function checkExpectedMessagesPresentOnDGTopic(topic, expectedMessages) {
    const messageCount = getMessageCountForTopic(topic, false);
    if (!check(messageCount, {
        ["Check number of messages on topic"]: (m) => m === expectedMessages
    })) {
        fail("Number of kafka messages are not as expected!");
    }
}

export function checkExpectedMessagesPresentOnTopic(topic, expectedMessages) {
    const messageCount = poll({
        interval: 10,
        times: 10,
        pollingFunction: getMessageCountForTopic,
        pollingFunctionArgs: [topic, true],
        checker: (result) => {
            return result === expectedMessages;
        }
    })
    if (messageCount !== expectedMessages) {
        const messages = getMessagesOnTopic(topic);
        console.log(`Messages on topic: ${JSON.stringify(messages)}`);
    }
    if (!check(messageCount, {
        ["Check number of messages on topic"]: (m) => m === expectedMessages
    })) {
        fail("Number of kafka messages are not as expected!");
    }
}

export function checkResultsOnTopic(messages, kpi, rowCount, checkerFunction, checkerArgs = []) {
    const numberOfMessages = getNumberOfMessagesForKPI(messages, kpi);
    const numberOfMessagesIsCorrect = numberOfMessages === rowCount;
    if (!check(numberOfMessagesIsCorrect, {
        ["Number of results for KPI are correct"]: (r) => r === true
    })) {
        console.error(`Number of messages for '${kpi}' is unexpected! Expected: ${rowCount}, Got: ${numberOfMessages}`);
    }

    let kpiIndex = 0;
    let allResultsAreCorrect = true;
    const aggregationBeginTimes = getAggregationBeginTimesForKPI(messages, kpi);
    for (let i = 0; i < messages.length; i++) {
        if (kpi in messages[i].value) {
            let row = messages[i].value;
            row._result = row[kpi];
            row._index = kpiIndex;
            if ("aggregation_begin_time" in row) {
                row._aggPeriod = aggregationBeginTimes.indexOf(row.aggregation_begin_time) + 1;
            }

            const checkerResult = checkerFunction.apply(this, [row, ...checkerArgs]);
            if (!checkerResult) {
                allResultsAreCorrect = false;
                console.error(`Result for '${kpi}' is unexpected!`);
                console.error(`Got row: ${JSON.stringify(row)}`);
            }
            kpiIndex += 1;
        }
    }

    allResultsAreCorrect = allResultsAreCorrect && numberOfMessagesIsCorrect;
    if (!check(allResultsAreCorrect, {
        ["KPI results are correct"]: (r) => r === true
    })) {
        fail("KPI results are unexpected!");
    }
}

export function checkerStatic(row, expectedResult) {
    return JSON.stringify(row._result) === JSON.stringify(expectedResult);
}

export function checkerDiffForAggPeriod(row, ...expectedResults) {
    return JSON.stringify(row._result) === JSON.stringify(expectedResults[Math.min(row._aggPeriod, expectedResults.length) - 1]);
}

export function checkTopicIsDeletedSuccessfully(topic) {
    deleteTopic(topic);
    const messageCount = getMessageCountForTopic(topic);
    if (!check(messageCount, {
        ["Check if topic was deleted"]: (m) => m === 0
    })) {
        console.error("Topic deletion failed!");
    }
}

export function checkTopicsAreDeletedSuccessfully(topics) {
    group("Delete messages on Kafka topics", () => {
        for (let i = 0; i < topics.length; i++) {
            checkTopicIsDeletedSuccessfully(topics[i]);
        }
    });
}

export function waitingForDataLoader(topic, expectedNumberOfMessages, waitForMinutes=10) {
    console.log("Waiting for first batch to be sent to kafka topic");
    const messageCount = poll({
        interval: 10,
        times: waitForMinutes * 6,
        pollingFunction: getMessageCountForTopic,
        pollingFunctionArgs: [topic],
        checker: (result) => {
            return result === expectedNumberOfMessages;
        }
    })
    if (!check(messageCount, {
        ["Check number of messages on topic"]: (m) => m === expectedNumberOfMessages
    })) {
        fail("Number of kafka messages are not as expected!");
    }
}
