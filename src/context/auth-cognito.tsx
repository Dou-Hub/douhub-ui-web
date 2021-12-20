
import { callAPIBase} from '../call-api';
import { assign, each, without, map } from 'lodash';
import { isPhoneNumber, isEmail, isPassword, isNonEmptyString, isObject, _window } from 'douhub-helper-util';

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
    auth: any,
    solution: Record<string, any>,
    data: Record<string, any>,
    settings: Record<string, any>) => {

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
            `${solution?.apiEndpoint?.context}user-orgs`,
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
                        console.log({ userOrgs, users })
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


export const getCurrentPoolUser =  (auth: any): Record<string, any> => {

    let hasCognito = false;
    for (let x in _window.localStorage) {
        if (x.indexOf('CognitoIdentityServiceProvider') >= 0 && !hasCognito) {
            hasCognito = true;
        }
    }
    if (!hasCognito) return {};
    return getCurrentPoolUserInternal(auth);
}

export const getCurrentPoolUserInternal =  (auth: any): Record<string, any> => {
    return new Promise((resolve) => {
        auth.currentUserPoolUser()
            .then((user: Record<string, any>) => {
                resolve(user);
            })
            .catch((error: Record<string, any>) => {
                console.error(error);
                resolve({});
            })
    });
}