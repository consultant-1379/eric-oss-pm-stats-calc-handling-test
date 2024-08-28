import { group, check } from "k6";
import { STATUS_CODES } from "../constants/Constants.js";
import { generateToken, createUser, checkUrlsForUser } from "../implementations/SefGw.js";


export function checkLogin() {
    createUser({
        user: {
            firstName: "PMSCH",
            lastName: "Calchandling",
            email: __ENV.APIGW_USER + "@ericsson.se",
            username: __ENV.APIGW_USER,
            status: "Enabled",
            privileges: ["PMSCH_Application_Operator","OSSPortalAdmin"]
        },
        password: __ENV.APIGW_PASSWORD,
        passwordResetFlag: false,
        tenant: "master"
    });
    const response = generateToken(__ENV.APIGW_USER, __ENV.APIGW_PASSWORD);
    if (
        !check(response, {
            ["Generating token is successful"]: (r) => {
                return r.status === STATUS_CODES.OK;
            }
        })
    ) {
        console.error("Generating token is not successful.");
    }
}

export function checkRBAC() {
    group("Check RBAC user with no roles", () => {
        const user = {
            user: {
                firstName: "PMSCH",
                lastName: "Calchandling",
                email:  "calc-norole@ericsson.se",
                username: "calc-norole",
                status: "Enabled",
                privileges: []
            },
            password: __ENV.APIGW_PASSWORD,
            passwordResetFlag: false,
            tenant: "master"
        };
        checkUrlsForUser(user, {
            admin: false,
            readonly: false
        });
    });

    group("Check RBAC user with read-only roles", () => {
        const user = {
            user: {
                firstName: "PMSCH",
                lastName: "Calchandling",
                email:  "calc-readonly@ericsson.se",
                username: "calc-readonly",
                status: "Enabled",
                privileges: ["PMSCH_Application_ReadOnly"]
            },
            password: __ENV.APIGW_PASSWORD,
            passwordResetFlag: false,
            tenant: "master"
        };
        checkUrlsForUser(user, {
            admin: false,
            readonly: true
        });
    });
}
