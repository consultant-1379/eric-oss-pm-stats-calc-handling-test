import http from 'k6/http';
import { getDataCatalogUrl } from "./UrlImpl.js";
import { URLS } from "../constants/Constants.js";

export function getDataCatalogResponse(dcEndpoint){
    var dataCatalogUrlWithEndpoint = getDataCatalogUrl() + dcEndpoint;
    console.log("Data Catalog URL with endpoint: " + dataCatalogUrlWithEndpoint);
    return http.get(dataCatalogUrlWithEndpoint);
}

export function getDataCatalogContent(dataType) {
    console.log("\n\n" + dataType + " check");
    switch(dataType) {
        case "dataSpace":
            return getDataCatalogResponse(URLS.DATA_CATALOG_DATA_SPACE_ENDPOINT);
        case "dataCategory":
            return getDataCatalogResponse(URLS.DATA_CATALOG_DATA_PROVIDER_TYPE_ENDPOINT);
        case "schema ID":
            return getDataCatalogResponse(URLS.DATA_CATALOG_MESSAGE_SCHEMA_ENDPOINT);
        case "Kafka Broker":
            return getDataCatalogResponse(URLS.DATA_CATALOG_MESSAGE_BUS_ENDPOINT);
        case "Message Data Topic":
            return getDataCatalogResponse(URLS.DATA_CATALOG_MESSAGE_DATA_TOPIC_ENDPOINT);
        default:
            console.error("Invalid dataType: " + dataType);
    };
}
