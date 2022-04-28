import React from "react";
import TextField from '../../fields/text';
import CodesField from '../../fields/codes';
import MessageField from '../../fields/message';
import AntCheckbox from '../../controls/antd/checkbox';
import { isObject, isFunction } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';

export const SignInFields = (props: Record<string, any>) => {

    const { onChangeForm, disabled, alwaysShowLabel } = props;
    const data: Record<string, any> = isObject(props.data) ? props.data : {};
    const showCodes = data.action == 'activate-with-password' || data.action == 'activate-without-password' || data.action == 'activate-reset-password' || data.result == 'sign-up-success';

    const onPressEnterPassword = () => {
        if (isFunction(props.onSubmitPassword)) props.onSubmitPassword(data);
    }

    const onPressEnterEmail = () => {
        if (isFunction(props.onSubmitEmail)) props.onSubmitEmail(data);
    }

    const onChangeRememberMe = () => {
        if (isFunction(props.onChangeRememberMe)) props.onChangeRememberMe(data);
    }

    const onClickResendCodes = () => {
        if (isFunction(props.onClickResendCodes)) props.onClickResendCodes(data);
    }

    const renderRememberMe = () => {
        if (!isFunction(props.onChangeRememberMe) || data.action == 'reset-password') return null;
        // if (!AntCheckbox) AntCheckbox = logDynamic(dynamic(() => import('../../../controls/antd/checkbox'), { ssr: false }), '../../../controls/antd/checkbox','Helper.SignInFields');
        return <AntCheckbox style={{ marginBottom: '1rem' }} disabled={disabled} checked={data.rememberMe == true} onChange={onChangeRememberMe}>Remember me</AntCheckbox>
    }

    return <>

        {(data.codeSent == 'verification' || data.result == 'sign-up-success') && <MessageField style={{ color: 'green' }}
            content={`Thank you! The verification code has been sent to your ${data?.type == 'mobile' ? 'mobile phone' : 'email address'}.`}
            type="info" />}

        {data.codeSent == 'reset-password' && <MessageField style={{ color: 'green' }}
            content={`Thank you! The password reset link has been sent to your ${data?.type == 'mobile' ? 'mobile phone' : 'email address'}.`}
            type="info" />}

        {showCodes && <CodesField
            onChange={(v: string) => onChangeForm('codes', v)}
            disabled={disabled}
            value={isNonEmptyString(data.codes) ? data.codes : ''}
            alwaysShowLabel={alwaysShowLabel}
            label="Your verification codes" />}

        {showCodes && <MessageField
            style={{ marginBottom: '4rem' }}
            className="underline-offset-2 cursor-pointer"
            content="Click here to resent the verification codes."
            type="info"
            onClick={onClickResendCodes} />}

        <TextField
            onChange={(v: string) => onChangeForm('email', v)}
            onPressEnter={onPressEnterEmail}
            disabled={disabled}
            type="email"
            placeholder="Type your email here"
            value={isNonEmptyString(data.email) ? data.email : ''}
            alwaysShowLabel={alwaysShowLabel}
            label="Your email address" />
        {data.action != 'reset-password' && <TextField
            onPressEnter={onPressEnterPassword}
            onChange={(v: string) => onChangeForm('password', v)}
            disabled={disabled}
            type="password"
            placeholder="Type your password here"
            label="Your password"
            alwaysShowLabel={alwaysShowLabel}
            value={isNonEmptyString(data.password) ? data.password : ''}
            note="Require combination of number, special character (!@#$%^&*), uppercase letter and lowercase letter. Minimum 8 characters."
        />}
        {(data.action == 'activate-with-password' || data.action == 'activate-reset-password') && <TextField
            onPressEnter={onPressEnterPassword}
            onChange={(v: string) => onChangeForm('confirmPassword', v)}
            disabled={disabled}
            type="password"
            placeholder="Confirm your password here"
            label="Confirm your password"
            alwaysShowLabel={alwaysShowLabel}
            value={isNonEmptyString(data.confirmPassword) ? data.confirmPassword : ''}
        />}
        {renderRememberMe()}
    </>
}

export const SignUpFields = (props: Record<string, any>) => {

    const { onChangeForm, disabled, alwaysShowLabel } = props;
    const data: Record<string, any> = isObject(props.data) ? props.data : {};

    const onPressEnterPassword = () => {
        if (isFunction(props.onSubmitPassword)) props.onSubmitPassword(data);
    }

    const onPressEnterEmail = () => {
        if (isFunction(props.onSubmitEmail)) props.onSubmitEmail(data);
    }


    return <>
        <TextField
            onChange={(v: string) => onChangeForm('email', v)}
            onPressEnter={onPressEnterEmail}
            disabled={disabled}
            type="email"
            placeholder="Type your email here"
            value={isNonEmptyString(data.email) ? data.email : ''}
            alwaysShowLabel={alwaysShowLabel}
            label="Your email address" />
        <TextField
            onPressEnter={onPressEnterPassword}
            onChange={(v: string) => onChangeForm('password', v)}
            disabled={disabled}
            type="password"
            placeholder="Type your password here"
            label="Your password"
            alwaysShowLabel={alwaysShowLabel}
            value={isNonEmptyString(data.password) ? data.password : ''}
            note="Require combination of number, special character (!@#$%^&*), uppercase letter and lowercase letter. Minimum 8 characters."
        />
        <TextField
            onPressEnter={onPressEnterPassword}
            onChange={(v: string) => onChangeForm('confirmPassword', v)}
            disabled={disabled}
            type="password"
            placeholder="Confirm your password here"
            label="Confirm your password"
            alwaysShowLabel={alwaysShowLabel}
            value={isNonEmptyString(data.confirmPassword) ? data.confirmPassword : ''}
        />
    </>
}