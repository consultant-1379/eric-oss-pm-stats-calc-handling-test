import http from "k6/http";
import { getSchemasUrl } from "./UrlImpl.js";


export function getSchemasInSchemaRegistry() {
    let response = http.get(getSchemasUrl());
    console.log("Schema Registry url: ", getSchemasUrl());
    console.log("status: ", response.status);
    console.log("response when checking schemas in Schema Registry: ", response.body);
    return response;
}

export function checkSchemaExist(response, schemaName) {
    for(let i = 0; i < response.json().length; i++) {
        if(response.json()[i].subject === schemaName) {
            console.log("subject: ", response.json()[i].subject);
            return true;
        }
    }
}
