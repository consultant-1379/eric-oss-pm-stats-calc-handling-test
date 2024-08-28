import http from "k6/http";
import { getCalculationUrl, getDefinitionUrl, getDefinitionUrlWithShowDeletedParameter } from "./UrlImpl.js";
import { bodyForCalculatingOnDemandKPIs, isSef } from "../constants/Constants.js";
import { check, fail } from "k6";
import { STATUS_CODES } from "../constants/Constants.js";
import { setCookie } from "./ApiGw.js";
import { addAuthorizationHeader } from "./SefGw.js";

export function defineKpis(kpis) {
    let params = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(getDefinitionUrl());
    }
    console.log("definition url: ", getDefinitionUrl());
    let res = http.post(getDefinitionUrl(), kpis, params);
    let jar = http.cookieJar();
    let cookies = jar.cookiesForURL(res.url);
    console.log("CC::"+JSON.stringify(cookies));
    return res;
}

export function getKpiDefinitions(isShowDeleted) {
    let params = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(getDefinitionUrlWithShowDeletedParameter(isShowDeleted));
    }
    console.log("definition url: ", getDefinitionUrlWithShowDeletedParameter(isShowDeleted));
    let res = http.get(getDefinitionUrlWithShowDeletedParameter(isShowDeleted), params);
    return res;

}

export function softDeleteKpis(kpisNameList) {
    let params = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(getDefinitionUrl());
    }
    console.log("deletion url: ", getDefinitionUrl());
    let res = http.del(getDefinitionUrl(), kpisNameList, params);
    return res;
}

export function triggerOnDemandKpiCalc() {
    let params = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(getCalculationUrl());
    }
    console.log("Triggering on demand KPI calculation");
    console.log("url: ", getCalculationUrl());
    let res = http.post(getCalculationUrl(),  JSON.stringify(bodyForCalculatingOnDemandKPIs), params);
    return res;
}

export function getKpi(kpi_name) {
    let params = {};
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(getDefinitionUrl());
    }
    let response = http.get(getDefinitionUrl(), params);
    let responseBody = JSON.parse(response.body);
    let kpiNotFound = true;
    for (let h=0; h<Object.keys(responseBody).length; h++){
        let kpiType= Object.keys(responseBody)[h];
        for (let i=0; i<(responseBody[kpiType].kpi_output_tables).length; i++){
            for (let j=0; j<(responseBody[kpiType].kpi_output_tables[i].kpi_definitions).length; j++){
                if (responseBody[kpiType].kpi_output_tables[i].kpi_definitions[j].name == kpi_name){
                    kpiNotFound = false;
                    return(responseBody[kpiType].kpi_output_tables[i].kpi_definitions[j]);
                }
            }
        }
    }
    if(kpiNotFound){return("KPI with name " + kpi_name + " was not found in database.");}
}

export function updateKpiDefinition(kpi_name, patchBody){
    let params = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    if (isSef) {
        params = addAuthorizationHeader(params);
    } else {
        setCookie(getDefinitionUrl());
    }
    console.log("\nKPI name to be patched: " + kpi_name);
    console.log("New values for the patch: " + JSON.stringify(patchBody));
    let url = getDefinitionUrl() + kpi_name;
    console.log("URL used for PATCH operation: " + url);
    let response = http.patch(url, JSON.stringify(patchBody), params);
    if (
        !check(response, {
          [`Status code is ${STATUS_CODES.OK}`]: (r) =>
            r.status === STATUS_CODES.OK,
        })
    ){
        console.error(response.status + " " + response.body);
        fail("KPI PATCH was not successful: " + response.status);
    }
}
