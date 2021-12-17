import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { isNil, isString, isArray, map, without, isEmpty } from 'lodash';

import { _window } from "douhub-helper-util";

export const abortCallAPI = () => {
    if (isEmpty(_window)) return;
    return new _window.AbortController;
}

const processServerlessOfflineResult = (data: string) => {
    try {
        data = data.replace('statusCode=', '"statusCode":')
            .replace('headers=', '"headers":"')
            .replace('body=', '", "body":');
        const dataJSON: Record<string, any> = JSON.parse(data);
        const headers = dataJSON?.headers?.replace('{', '').replace('}', '').split(',');
        dataJSON.headers = without(map(headers, (header) => {
            const headerPair = header.split('=');
            const newHeader: Record<string, any> = {};
            if (headerPair.length > 1 && headerPair[0].trim().length > 0) {
                newHeader[headerPair[0].trim()] = headerPair[1].trim();
                return newHeader;
            }
            else {
                return null;
            }
        }), null);
        return dataJSON;
    }
    catch
    {
        console.error({ error: 'Failed to process the result from the offline API.', data });
    }

    return data;
}


export const callAPI = (
    url: string,
    data: Record<string, any>,
    method?: string,
    settings?: {
        apiToken?: string, skipCognito?: boolean, cognito?: any, solutionId?: string
    }): Promise<Record<string, any>> => {

    if (!isObject(settings)) settings = {};
    if (isNil(data)) data = {};
    method = isNonEmptyString(method) ? method?.toUpperCase() : 'POST';

    let headers: Record<string, any> = {
        'Accept': 'application/json,application/xml,text/plain,text/html,*.*',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (settings?.solutionId) {
        headers.solutionId = settings.solutionId;
    }

    if (settings?.cognito?.signInUserSession && !settings.skipCognito) {
        headers.Authorization = settings.cognito.signInUserSession.idToken.jwtToken;
        headers.AccessToken = settings.cognito.signInUserSession.accessToken.jwtToken;
    }

    if (isNonEmptyString(settings?.apiToken)) {
        headers.apiToken = settings?.apiToken;
    }

    let params = Object.keys(data).map((key) => {
        let v = data[key];
        if (isArray(v) || isObject(v)) v = JSON.stringify(v);
        return encodeURIComponent(key) + '=' + encodeURIComponent(v);
    }).join('&');

    if (method === 'GET') {
        if (params.length > 0) url = url.indexOf('?') > 0 ? `${url}&${params}` : `${url}?${params}`;
    }

    return new Promise((resolve, reject) => {
        const localAPI = url.indexOf('//localhost') > 0;
        fetch(url, {
            method, headers,
            redirect: "follow",
            body: method === 'GET' ? null : params
        })
            .then((response) => response.json())
            .then((data) => {

                if (localAPI) {
                    data = processServerlessOfflineResult(data);
                }

                if (isObject(data) && (data.errorType || data.errorMessage)) {
                    throw data;
                }

                if (isObject(data) && data.type == 'error') {
                    throw data;
                }

                if (isObject(data) && isObject(data.error)) {
                    throw data.error;
                }

                if (isObject(data) && data.statusCode === 200) {
                    data = data.body;
                }
                // console.log({ data})
                resolve(data);
            })
            .catch((error) => {

                if (isString(error)) {
                    error = { errorMessage: error };
                }
                else {
                    if (isString(error.errorMessage)) {
                        try {
                            error = JSON.parse(error.errorMessage);
                        }
                        catch (ex) {
                            error.message = error.errorMessage
                        }
                    }
                }

                if (error.message && !error.statusMessage) error.statusMessage = error.message;
                if (error.name && !error.statusName) error.statusName = error.name;
                if (error.code && !error.statusCode) error.statusCode = error.code;

                if (error.statusMessage === 'Failed to fetch') {
                    error.statusMessage = 'ERROR_SYSTEM_FAILEDTOFETCH';
                }

                delete error.errorMessage;
                delete error.message;

                reject(error);
            });

    });

}
