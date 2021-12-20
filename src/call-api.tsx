import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { isNil, isString, map, without, isEmpty } from 'lodash';
import axios, {Method} from 'axios';
import { _window } from "douhub-helper-util";

export const abortCallAPI = () => {
    if (isEmpty(_window)) return;
    return new _window.AbortController;
}

const processServerlessOfflineError = (data: string) => {
    try {
        data = data
        .replace('{errorMessage=','{"errorMessage":')
            .replace('statusCode=', '"statusCode":')
            .replace('headers=', '"headers":"')
            .replace('errorType=Error','"errorType":"Error"')
            .replace('body=', '", "body:')
            .replace('"body":"','"body":')
            .replace(/\\"/g, '"');
        
        data = data.substring(0,data.indexOf('stackTrace=')).substring(0,data.indexOf('"errorType":"Error"'))
        data = data.substring(0, data.length-4) + "}}";
        return JSON.parse(data).errorMessage;
    }
    catch
    {
        console.error({ error: 'Failed to process the result from the offline API.', data });
    }

    return data;
}

const processServerlessOfflineResult = (data: string) => {
    try {
        data = data
            .replace('statusCode=', '"statusCode":')
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
    method: Method,
    settings?: {
        apiToken?: string, 
        skipCognito?: boolean, 
        cognito?: any, 
        solutionId?: string,
        stage?:'dev'|'staging'|'prod' 
    }): Promise<Record<string, any>> => {

    if (!isObject(settings)) settings = {};
    if (isNil(data)) data = {};
   
    let headers: Record<string, any> = {
        'Accept': 'application/json,application/xml,text/plain,text/html,*.*',
        // 'Content-Type': 'application/x-www-form-urlencoded'
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

    const config:Record<string,any> = {
        url, 
        method,
        headers
    }

    // if (method === 'GET') {
    //     let params = Object.keys(data).map((key) => {
    //         let v = data[key];
    //         if (isArray(v) || isObject(v)) v = JSON.stringify(v);
    //         return encodeURIComponent(key) + '=' + encodeURIComponent(v);
    //     }).join('&');

    //     if (params.length > 0) url = url.indexOf('?') > 0 ? `${url}&${params}` : `${url}?${params}`;
    // }

    if (method === 'GET')
    {
       if (isObject(data)) config.params = data;
    }
    else
    {
        if (isObject(data)) config.data = data;
    }

    return new Promise((resolve, reject) => {
        const localAPI = url.indexOf('//localhost') > 0;
        axios(config)
            .then((result:Record<string,any>) => {
                let data = result.data;

                if (localAPI && data) {
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
            .catch((response:Record<string,any>) => {
                
                console.log({response});

                let error = response.response?response.response:{message:response.message, code:500};

                if (localAPI && error?.data) {
                    error = processServerlessOfflineError(error.data);
                    if (isObject(error?.body)) error = error.body;
                }
               
                if (isString(error)) {
                    error = { errorMessage: error };
                }
                else {
                    if (!isObject(error)) error = {};
                    if (isString(error?.errorMessage)) {
                        try {
                            error = JSON.parse(error?.errorMessage);
                        }
                        catch (ex) {
                            error.message = error?.errorMessage
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
