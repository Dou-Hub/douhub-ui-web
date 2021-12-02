//  COPYRIGHT:       PrimeObjects Software Inc. (C) 2021 All Right Reserved
//  COMPANY URL:     https://www.primeobjects.com/
//  CONTACT:         developer@primeobjects.com
//
//  This source is subject to the PrimeObjects License Agreements.
//
//  Our EULAs define the terms of use and license for each PrimeObjects product.
//  Whenever you install a PrimeObjects product or research PrimeObjects source code file, you will be prompted to review and accept the terms of our EULA.
//  If you decline the terms of the EULA, the installation should be aborted and you should remove any and all copies of our products and source code from your computer.
//  If you accept the terms of our EULA, you must abide by all its terms as long as our technologies are being employed within your organization and within your applications.
//
//  THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY
//  OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT
//  LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
//  FITNESS FOR A PARTICULAR PURPOSE.
//
//  ALL OTHER RIGHTS RESERVED

import React, { useState } from 'react';
import _ from '../../../shared/util/base';
import FieldText from '../fields/text';
import FieldCodes from '../fields/codes';
import { solution } from '../../../shared/metadata/solution';

export const validateLoginIdPassword = (form, onCreateError) => {

    if (form.type == 'email' && !_.isEmail(form.email)) {
        onCreateError('Please provide a valid email.');
        return false;
    }

    if (form.type == 'mobile' && !_.isPhoneNumber(form.mobile)) {
        onCreateError('Please provide a valid mobile number.');
        return false;
    }

    if (!_.isPassword(form.password, solution.auth.passwordRules)) {
        onCreateError('Please provide a valid password.');
        return false;
    }

    return true;
}


export const SignInFields = (props) => {

    const { onChangeForm, disabled, askForVerification } = props;
    const data = _.isObject(props.data) ? props.data : {};
    return <>
        {askForVerification && <FieldCodes
            onChange={(v) => onChangeForm('verificationCode', v)}
            disabled={disabled}
            value={_.isNonEmptyString(data.verificationCode) ? data.verificationCode : ''}
            label="Your verification codes" />}
        <FieldText
            onChange={(v) => onChangeForm('email', v)}
            disabled={disabled} type="email"
            placeholder="Type your email here"
            value={_.isNonEmptyString(data.email) ? data.email : ''}
            label="Your email address" />
        <FieldText
            onChange={(v) => onChangeForm('password', v)}
            disabled={disabled}
            type="password"
            placeholder="Type your password here"
            label="Your password"
            value={_.isNonEmptyString(data.password) ? data.password : ''}
            note="Require combination of number, special character (!@#$%^&*), uppercase letter and lowercase letter. Minimum 8 characters."
        />
    </>
}
