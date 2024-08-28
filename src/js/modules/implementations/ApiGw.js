import http from "k6/http";
import { URLS } from "../constants/Constants.js";

var token = "undefined";
export function login() {
    let res = http.post(URLS.GAS_URL +'/auth/v1/login', "", {
        headers: {
            'X-Login': __ENV.APIGW_USER,
            'X-Password': __ENV.APIGW_PASSWORD,
        },
      });
    token = res.body;
    return res;
}

export function logout() {
    setCookie(URLS.GAS_URL + '/auth/v1/logout');
    return http.get(URLS.GAS_URL + '/auth/v1/logout')
}

export function setCookie(url){
    const jar = http.cookieJar();
    jar.set(url, 'JSESSIONID', token);
}

export function clearCookie(url){
    const jar = http.cookieJar();
    jar.clear(url);
}

export function createuser(){
    let jsessionId = http.post(URLS.GAS_URL +'/auth/v1/login', "", {
        headers: {
            'X-Login': "gas-user",
            'X-Password': __ENV.APIGW_PASSWORD,
        },
    });
    let params = {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'JSESSIONID=' + jsessionId,
        },
    };
    let payload = JSON.stringify({
        "user":{
            "firstName": "PMSCH",
            "lastName": "Calchandling",
            "email": __ENV.APIGW_USER + "@ericsson.se",
            "username": __ENV.APIGW_USER,
            "status": "Enabled",
            "privileges": ["PMSCH_Application_Operator","OSSPortalAdmin"]
        },
       "password": __ENV.APIGW_PASSWORD,
       "passwordResetFlag": false,
       "tenant": "master"
    });
    let user_url = URLS.GAS_URL + '/idm/usermgmt/v1/users';
    let res = http.post(user_url, payload, params);
    http.get(URLS.GAS_URL + '/auth/v1/logout')
    clearCookie(URLS.GAS_URL)
    return res;
}