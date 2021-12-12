
import nookies from 'nookies';
import { isObject, isNonEmptyString } from 'douhub-helper-util';
import { isNumber } from 'lodash';

export const getPlatformApiEndpoint = (appSettings: Record<string, any>, apiName: string, functionName: string, country?: string): string => {
    return `${appSettings.platformEndpoint
        .replace('{name}', apiName)
        .replace('{stage}', appSettings.stage)
        .replace('{country}', country ? country : appSettings.country)}/${functionName}`;
}

export const getSession = (name: string, ctx?: any) => {
    const o = nookies.get(ctx);
    if (!isObject(o)) return '';
    const v = nookies.get(ctx)[name];
    return v ? v : '';
};

export const setSession = (name: string, value: string, ctx?: any, maxAgeMins?: number) => {
    if (!isNumber(maxAgeMins)) maxAgeMins = 360;
    const option = { path: "/", maxAge: maxAgeMins * 60 };
    nookies.set(ctx, name, value, option);
};

export const removeSession = (name: string, ctx?: any) => {
    nookies.destroy(ctx, name, { path: "/" });
};

export const logDynamic = (object: Record<string, any>, url: string, name: string) => {
    if (isNonEmptyString(name)) {
        console.log(`Dynamic load ${url} ${name}`);
    }
    else {
        console.log(`Dynamic load ${url}`);
    }
    return object;
}


