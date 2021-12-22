import { isObject } from 'douhub-helper-util';
import { getCurrentPoolUser } from './auth-cognito';
import { Method } from 'axios';
import { isEmpty } from 'lodash';
import { callAPIBase } from '../call-api';
import { getAuth } from '..';

export const callAPI = async (
    solution: Record<string, any>,
    path: string,
    data: Record<string, any>,
    method: Method,
    settings?: Record<string, any>): Promise<Record<string, any>> => {

    const auth = await getAuth(solution);
    if (!isObject(settings)) settings = {};
    if (settings) settings.solutionId = solution.id;

    return new Promise((resolve, reject) => {
        getCurrentPoolUser(auth)
            .then((cognito: any) => {
                console.log({cognito});
                if (settings) settings.headers = {};
                if (settings && !isEmpty(cognito)) 
                {
                    settings.headers.Authorization = cognito.signInUserSession.idToken.jwtToken;
                    settings.headers.AccessToken = cognito.signInUserSession.accessToken.jwtToken;
                }
                
                callAPIBase(path, data, method, settings)
                    .then((data: any) => {
                        //console.log(data)
                        if (isObject(data) && (data.error || data.errorType || data.errorMessage)) {
                            throw data;
                        }
                        else {
                            resolve(data);
                        }
                    })
                    .catch((error: any) => {
                        console.error(error);
                        reject(error);
                    });
            })
            .catch((error: any) => {
                console.error({ error });
                //If there's error here.
                //We will sign out
                reject(error);
            });
    });
}
