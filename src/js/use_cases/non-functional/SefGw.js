import { group } from "k6";
import { checkLogin, checkRBAC } from "../../modules/checks/SefGwCheck.js";


export function loginToSefGw() {
    group("Login to SEF Gateway", () => {
        group("Login to SEF Gateway", () => {
            checkLogin();
        });
    });
}
