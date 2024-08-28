import http from 'k6/http';
import { check, sleep } from 'k6';
import { URLS, isSef } from "../constants/Constants.js";
import { setCookie } from '../implementations/ApiGw.js';
import { addAuthorizationHeader } from "../implementations/SefGw.js";

export function getScrapePools() {
  let scrape_url = URLS.GAS_URL + '/metrics/viewer/api/v1/targets?state=active';
  let params = {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };
  if (isSef) {
    params = addAuthorizationHeader(params);
  } else {
    setCookie(scrape_url);
  }
  console.log("Scrape URL: " + scrape_url);
  let res = http.get(scrape_url, params);
  console.log("Scrape response status: " + res.status);
  console.log("Scrape response: ");
  console.log(res.body);

  check(res, {
    "Get scrape pools status should be 200": (r) => r.status === 200
  }, { legacy: "false" });

  if (res.status === 200) {
    let pools = JSON.parse(res.body);
    let allPoolsUp = true;
    let numberOfTargetDown = 0;
    for (let i = 0; i < pools.data.activeTargets.length; i++) {
      let target = pools.data.activeTargets[i];
      if (target.health != "up") {
        numberOfTargetDown++;
        console.log("TARGET DOWN: " + target.scrapePool);
        console.log("   lastError: " + target.lastError);
        if (target.labels.pod_name != undefined) {
          console.log("   POD name: " + target.labels.pod_name);
        }
        else if (target.discoveredLabels.__meta_kubernetes_pod_name != undefined) {
          console.log("   POD name: " + target.discoveredLabels.__meta_kubernetes_pod_name);
        }
        allPoolsUp = false;
      }
    }
    if (!allPoolsUp) {
      console.warn("Total number of unhealthy targets: " + numberOfTargetDown);
    }
    check(allPoolsUp, {
      "All scrape pools should be up": (r) => r === true
    }, { legacy: "false" });
  }
}


export function metricCollectionCheck(metrics) {
  let res = '';
  let params = {};
  for (let i = 0; i < metrics.length; i++) {
    let reqParam = URLS.GAS_URL + "/metrics/viewer/api/v1/query?query=" + metrics[i];
    if (isSef) {
      params = addAuthorizationHeader(params);
    } else {
      setCookie(reqParam);
    }
    res = '';
    res = http.get(reqParam, params);
    let json = JSON.parse(res.body);
    check(res, {
      [`Check metrics: ${metrics[i]}`]: (r) => r.status === 200 && json.data.result.length != 0
    }, { legacy: "false" });
  }
  sleep(5); // Needed because of SEF rate limiting
}