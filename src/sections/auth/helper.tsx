import React from "react";
// import { isEmail, isPhoneNumber, isPassword } from "douhub-helper-util";
import FieldText from '../../fields/text';
import FieldCodes from '../../fields/codes';
import AntCheckbox from '../../controls/antd/checkbox';
import { isObject, isFunction } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';
// import { logDynamic } from 'douhub-ui-web';
// import dynamic from 'next/dynamic';

// let AntCheckbox:any = null;
export const SignInFields = (props: Record<string,any>) => {

    const { onChangeForm, disabled, askForVerification, alwaysShowLabel } = props;
    const data:Record<string,any> = isObject(props.data) ? props.data : {};

    const onPressEnterPassword=()=>{
        if (isFunction(props.onSubmitPassword)) props.onSubmitPassword(data);
    }

    const onPressEnterEmail=()=>{
        if (isFunction(props.onSubmitEmail)) props.onSubmitEmail(data);
    }

    const onChangeRememberMe = ()=>{
        if (isFunction(props.onChangeRememberMe)) props.onChangeRememberMe(data);
    }

    const renderRememberMe=()=>{
        if (!isFunction(props.onChangeRememberMe)) return null;
        // if (!AntCheckbox) AntCheckbox = logDynamic(dynamic(() => import('../../../controls/antd/checkbox'), { ssr: false }), '../../../controls/antd/checkbox','Helper.SignInFields');
        return <AntCheckbox disabled={disabled} checked={data.rememberMe==true} onChange={onChangeRememberMe}>Remember me</AntCheckbox>
    }

    return <>
        {askForVerification && <FieldCodes
            onChange={(v:string) => onChangeForm('verificationCode', v)}
            disabled={disabled}
            value={isNonEmptyString(data.verificationCode) ? data.verificationCode : ''}
            alwaysShowLabel={alwaysShowLabel}
            label="Your verification codes" />}
        <FieldText
            onChange={(v:string) => onChangeForm('email', v)}
            onPressEnter={onPressEnterEmail}
            disabled={disabled} 
            type="email"
            placeholder="Type your email here"
            value={isNonEmptyString(data.email) ? data.email : ''}
            alwaysShowLabel={alwaysShowLabel}
            label="Your email address" />
        <FieldText
            onPressEnter={onPressEnterPassword}
            onChange={(v:string) => onChangeForm('password', v)}
            disabled={disabled}
            type="password"
            placeholder="Type your password here"
            label="Your password"
            alwaysShowLabel={alwaysShowLabel}
            value={isNonEmptyString(data.password) ? data.password : ''}
            note="Require combination of number, special character (!@#$%^&*), uppercase letter and lowercase letter. Minimum 8 characters."
        />
        {renderRememberMe()}
    </>
}
