import { check } from "k6";
import { STATUS_CODES } from "../constants/Constants.js";
import { getSchemasInSchemaRegistry, checkSchemaExist } from "../implementations/SchemaRegistryImpl.js";


export function checkSchemasInSchemaRegistry(expectedSubjects) {
    let response = getSchemasInSchemaRegistry();
    console.log("number of schemas: ", response.json().length);
    for(let i = 0; i < expectedSubjects.length; i++) {
        if(
            !check(response, {
                [`Status code is ${STATUS_CODES.OK}`]: (r) => r.status === STATUS_CODES.OK,
                [`Schemas are registered`]: (r) =>
                    checkSchemaExist(r, expectedSubjects[i])
                })
        ) console.error(`Schema Registry does not contain the needed schema: ${expectedSubjects[i]}`);
    }
}
