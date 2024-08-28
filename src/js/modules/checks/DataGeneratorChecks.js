import { check, fail, sleep } from "k6";
import { getDataGeneratorStatus, submitDataGeneratorConfigFile } from "../implementations/DataGeneratorImpl.js";
import { poll } from "../implementations/KafkaImpl.js";


export function checkDataGeneratorStarted() {
    const response = poll({
        interval: 10,
        times: 30,
        pollingFunction: getDataGeneratorStatus,
        pollingFunctionArgs: [],
        checker: (response) => response
    });
    if (!check(response, {
        ["Data Generator is running"]: (r) => r
    })) {
        fail("Data Generator failed to start in time!");
    }
}

export function checkSubmitDataGeneratorConfigFile(config) {
    const response = submitDataGeneratorConfigFile(config);
    if (!check(response, {
        ["Config file is sent in successfully"]: (r) => r
    })) {
        fail("Could not send in Data Generator config file!");
    }
}

export function synchronizeToCalculatorHeartbeat(offset = 0, calculatorHeartbeat = 5) {
    const currentTime = new Date();
    const nextCalculatorHeartbeat = new Date(currentTime);
    nextCalculatorHeartbeat.setMinutes(nextCalculatorHeartbeat.getMinutes() - nextCalculatorHeartbeat.getMinutes() % calculatorHeartbeat);
    nextCalculatorHeartbeat.setSeconds(0 - offset);
    while (currentTime > nextCalculatorHeartbeat) {
        nextCalculatorHeartbeat.setMinutes(nextCalculatorHeartbeat.getMinutes() + calculatorHeartbeat);
    }

    const sleepTime = Math.floor((nextCalculatorHeartbeat - currentTime) / 1000);
    console.log(`Waiting for ${sleepTime} seconds to synchronize with the calculator heartbeat`);
    sleep(sleepTime);
}
