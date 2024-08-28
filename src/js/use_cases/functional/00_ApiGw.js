import { checkLogin, checkLogout } from "../../modules/checks/ApiGwCheck.js"
import { group } from "k6";

export function loginToApiGw() {
    group("Login to API Gateway", () => {
        group("Login to API Gateway", () => {
            checkLogin();
        })
    })
}
export function logoutFromApiGw() {
    group("Logout from API Gateway", () => {
        group("Logout from API Gateway", () => {
            checkLogout();
        })
    })
}