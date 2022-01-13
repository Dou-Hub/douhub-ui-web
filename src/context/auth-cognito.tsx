
import { useEffect, useState } from 'react';
import { callAPIBase } from '../call-api';
import { callAPI } from '../context/auth-call-api';
import { assign, each, without, map, isFunction, isBoolean } from 'lodash';
import { isPhoneNumber, isEmail, isPassword, isNonEmptyString, isObject } from 'douhub-helper-util';
import { _window, _track } from "../util";
import { useRouter } from 'next/router';
import { useContextStore } from 'douhub-ui-store';

//create aws-amplify/auth object with settings from solution profile
export const getAuth = async (solution: Record<string, any>) => {
    if (!_window._auth) {
        if (_track) console.log(`getAuth`);
        _window._auth = (await import('@aws-amplify/auth')).default;
        _window._auth.configure({ ...solution && solution.auth.cognito });
    }
    return _window._auth;
}

export const signInCognito = async (auth: any, loginId: string, password: string) => {
    return await (new Promise((resolve, reject) => {
        auth.signIn(loginId, password)
            .then((data: any) => {
                resolve(data);
            })
            .catch((error: any) => {
                console.error(error);
                reject(error);
            });
    }));
}

export const signIn = async (
    solution: Record<string, any>,
    data: Record<string, any>,
    settings: Record<string, any>) => {

    const auth = await getAuth(solution);
    let user: any = null;
    const { password, verificationCode } = data;

    if (!isEmail(data?.email) && !isPhoneNumber(data?.mobile)) {
        return { error: 'ERROR_SIGNIN_NEED_EMAIL' };
    }

    //console.log({password, rules:solution.auth.passwordRules, result: isPassword(password, solution.auth.passwordRules)});
    if (!isPassword(password, solution?.auth?.passwordRules)) {
        return { error: 'ERROR_SIGNIN_NEED_PASSWORD' };
    }

    if (isNonEmptyString(verificationCode) && verificationCode.length != 8) {
        return { error: 'ERROR_SIGNIN_NEED_VERIFY' };
    }

    try {
        if (!isObject(settings)) settings = {};

        const type = settings.type == 'mobile' ? settings.type : 'email';

        const userOrgs: Record<string, any> = await callAPIBase(
            `${solution.apis.context}user-orgs`,
            assign(
                type == 'mobile' ? { mobile: data?.mobile } : { email: data?.email },
                isNonEmptyString(verificationCode) ? { verificationCode } : {}
            ),
            'GET');

        let users = without(map(userOrgs, (user) => {
            return (type == 'email' && user.emailVerifiedOn || type == 'mobile' && user.mobileVerifiedOn)
                && user.stateCode == 0 ? user : null;
        }), null);

        switch (users.length) {
            case 0:
                {
                    if (userOrgs.length > 0) {
                        if (_track) console.log({ userOrgs, users })
                        return { error: 'ERROR_SIGNIN_NEED_VERIFY' };
                    }
                    else {
                        return { error: 'ERROR_SIGNIN_USERNOTFOUND' };
                    }

                }
            case 1:
                {
                    user = userOrgs[0];
                    break;
                }
            default:
                {

                    //If there're more orgs, we will sort by latestSignInOn and modifiedOn field
                    user = userOrgs[0];
                    user.latestSignInOn = user.latestSignInOn ? user.latestSignInOn : user.modifiedOn;
                    each(userOrgs, (userOrg) => {
                        let dt = userOrg.latestSignInOn ? userOrg.latestSignInOn : userOrg.modifiedOn;
                        user = user.latestSignInOn < dt ? userOrg : user;
                    });
                }
        }
    }
    catch (error) {
        console.error(error);
        return { error: 'SIGNIN_ERROR_USERORGS' };
    }

    try {
        const organizationId = user.organizationId;
        const userId = user.id;

        await signInCognito(auth, `${organizationId}.${userId}`, password);
    }
    catch (error) {
        console.error(error);
        return { error: 'SIGNIN_ERROR_COGNITO' };
    }

    return { user }
}


export const getCurrentPoolUser = async (solution: Record<string, any>): Promise<Record<string, any> | null> => {
    const auth = await getAuth(solution);
    let hasCognito = false;
    for (let x in _window.localStorage) {
        if (x.indexOf('CognitoIdentityServiceProvider') >= 0 && !hasCognito) {
            hasCognito = true;
        }
    }
    if (!hasCognito) return null;
    return getCurrentPoolUserInternal(auth);
}

export const getCurrentPoolUserInternal = (auth: any): Record<string, any> => {

    return new Promise((resolve) => {
        auth.currentUserPoolUser()
            .then((user: Record<string, any>) => {
                resolve(user);
            })
            .catch((error: any) => {
                console.error(error);
                resolve(null);
            })
    });
}


export const signOut = async (solution: Record<string, any>): Promise<boolean> => {
    const auth = await getAuth(solution);
    return await signOutInternal(auth);
}

export const signOutInternal = (auth: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        auth.currentUserPoolUser()
            .then(() => {
                auth.signOut()
                    .then(() => {
                        resolve(true);
                    })
                    .catch((error: any) => {
                        console.error(error);
                        reject(false);
                    })
            })
            .catch((error: any) => {
                console.error(error);
                reject(false);
            })
    });
}

export const useCurrentContext = (solution: Record<string, any>, settings?: {
    signInUrl?: '/auth/sign-in',
    needAuthorization?: boolean,
    needSolution?: boolean,
    onSuccess?: any,
    onError?: any,
    context?: Record<string, any>
}) => {
    const router = useRouter();
    const [context, setContext] = useState<Record<string, any> | null>(null);
    const contextStore = useContextStore();

    useEffect(() => {
        if (!context && _window) {

            if (!settings) settings = {
                signInUrl: '/auth/sign-in',
                needAuthorization: true,
                needSolution: false,
                onSuccess: null,
                onError: null
            }

            if (!isBoolean(settings.needAuthorization)) settings.needAuthorization = true;
            if (!isBoolean(settings.needSolution)) settings.needSolution = false;
            
            const apiParams: Record<string, any> = { 
                needAuthorization: settings.needAuthorization == true, 
                needSolution: settings.needSolution == true };

            callAPI(solution, `${solution.apis.context}current`, apiParams, 'GET')
                .then((result: Record<string, any>) => {
                    const currentContext = result.context;
                    setContext(currentContext);
                    contextStore.setData(currentContext);
                    if (isFunction(settings?.onSuccess)) {
                        settings?.onSuccess(currentContext);
                    }
                })
                .catch((error: any) => {
                    if (_track) console.error(error);
                    if (isFunction(settings?.onError)) {
                        settings?.onError(error);
                    }
                    else {
                        if (settings?.signInUrl) router.push(settings.signInUrl);
                    }
                })
        }
    }, [_window]);

    return context;
}