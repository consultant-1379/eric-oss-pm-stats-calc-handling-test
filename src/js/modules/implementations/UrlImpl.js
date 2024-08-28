import { URLS } from "../constants/Constants.js";

export function getQueryCalcResultUrl() {
	return URLS.GAS_URL
        ? URLS.GAS_URL + URLS.QUERY_CALC_RESULT_URL
        : URLS.QUERY_SERVICE_LOCAL + URLS.QUERY_CALC_RESULT_URL;
};

export function getDefinitionUrl() {
    return URLS.GAS_URL
        ? URLS.GAS_URL+ URLS.DEFINITION_ENDPOINT
        : URLS.CALCULATOR_LOCAL + URLS.DEFINITION_ENDPOINT;
}

export function getDefinitionUrlWithShowDeletedParameter(isShow) {
    return URLS.GAS_URL
        ? URLS.GAS_URL + URLS.DEFINITION_ENDPOINT + URLS.SHOW_DELETED + isShow
        : URLS.CALCULATOR_LOCAL + URLS.DEFINITION_ENDPOINT + URLS.SHOW_DELETED + isShow;
}

export function getCalculationUrl() {
    return URLS.GAS_URL
        ? URLS.GAS_URL + URLS.CALCULATION_ENDPOINT
        : URLS.CALCULATOR_LOCAL + URLS.CALCULATION_ENDPOINT;
}

export function getSchemasUrl() {
    return __ENV.SCHEMA_REGISTRY_HOSTNAME
    ? __ENV.SCHEMA_REGISTRY_HOSTNAME + URLS.SCHEMAS_ENDPOINT
    : URLS.SCHEMA_REGISTRY_LOCAL + URLS.SCHEMAS_ENDPOINT;
}

export function getDataCatalogUrl() {
    return __ENV.DATA_CATALOG_HOSTNAME
    ? __ENV.DATA_CATALOG_HOSTNAME
    : URLS.DATA_CATALOG_LOCAL;
}