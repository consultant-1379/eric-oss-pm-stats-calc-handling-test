import { STATUS_CODES } from "../constants/Constants.js";
import { login, logout, createuser } from "../implementations/ApiGw.js";
import { check } from "k6";

export function checkLogin() {
    let createResponse = createuser();
    console.log("Response for user creation:");
    console.log(createResponse);
    let response = login();
    if (
        !check(response, {
            ["Login to Api Gateway is successful"]: (r) => {
                console.log("status code at login: ", r.status);
                console.log("response body at login: ", r.body);
                return r.status === STATUS_CODES.OK;
            }
        })
    ) {
        console.error("Login to Api Gateway is not successful.");
    }
}

export function checkLogout() {
    let response = logout();
    if (
        !check(response, {
            ["Logout from Api Gateway is successful"]: (r) => {
                console.log("status code at logout: ", r.status);
                console.log("response body at logout: ", r.body);
                return r.status === STATUS_CODES.OK;
            }
        })
    ) {
        console.error("Logout from Api Gateway is not successful.");
    }
}