import { check } from "k6";
import { STATUS_CODES } from "../constants/Constants.js";
import { getDataCatalogContent } from "../implementations/DataCatalogImpl.js";

export function checkDataCatalogResponseStatusAndBody(dataType, expectedValues){

    let dcResponse = getDataCatalogContent(dataType);
    if(!check(dcResponse, {[`Status code is ${STATUS_CODES.OK}`]: (r) => r.status === STATUS_CODES.OK})){
        console.error("DC response was not 200 OK: " + dcResponse.status);
    }

    console.log("Check the existence of " + expectedValues + " in the body of DC response:\n" + dcResponse.body);
    for (var i in expectedValues){
        console.log("Expected " + dataType + ": " + expectedValues[i]);
        if(!check(dcResponse, {'body contains expected dataType': (r) => r.body.includes(`"${expectedValues[i]}"`)})){
            console.error("Expected " + dataType + " not found in Data Catalog: " + expectedValues[i]);
        }
    }
}
