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
import FieldDoing from '../fields/doing';
import { getRecaptchaToken } from '../controls/recaptcha';
import FieldRecaptcha from '../fields/recaptcha';
import { setWebQueryValue } from '../../../shared/util/data';
import Modal from '../controls/antd/modal';
import FieldMessage from '../fields/message';
import { signUp } from '../../util/authentication';
import { validateLoginIdPassword, SignInFields } from './auth-helper';

const recaptchaId = 'sign-up';
const MESSAGE_CREATING_NEWUSER = 'Creating a new account ...';

const SignUp = (props) => {
    const { onClose } = props;
    const [doing, setDoing] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [form, setForm] = useState({ type: 'email' });

    const onCancel = () => {
        setErrorMessage(null);
        setDoing(null);
        if (_.isFunction(onClose)) onClose();
    }

    const onChangeForm = (fieldName, value) => {
        setErrorMessage('');
        form[fieldName] = value;
        setForm({ ...form });
    }

    const onCreateError = (error) => {
        setDoing(null);
        setErrorMessage(error);
    }

    const onClickRecaptcha = () => {
        setErrorMessage('');
    }

    const onSubmit = () => {

        (async () => {

            setErrorMessage('');

            const recaptchaToken = getRecaptchaToken(recaptchaId);
            if (!_.isNonEmptyString(recaptchaToken)) {
                return onCreateError('Are you a robot? Please finish reRAPTCHA check.');
            }

            if (!validateLoginIdPassword(form, onCreateError)) return;

            setDoing(MESSAGE_CREATING_NEWUSER);

            const result = await signUp(form.email, form.password, { type: 'email', recaptchaToken });
             if (result.error == 'ERROR_API_USEREXISTS') {
                return onCreateError("There is already a user with the same email.");
            }
            else {
                if (result.error) return onCreateError(`Failed to sign up. [${result.error}]`);
            }

            window.location = setWebQueryValue(setWebQueryValue(`${window.location}`, 'verification-code', '000000'), 'email', form.email);

        })();
    }

    return <Modal title="Sign Up"
        className={doing ? "doing" : ""}
        visible={true}
        okText={"Submit"}
        onOk={onSubmit}
        onCancel={onCancel}>
        <SignInFields onChangeForm={onChangeForm} disabled={doing} />
        <FieldRecaptcha id={recaptchaId} onClick={onClickRecaptcha} />
        <FieldMessage content={errorMessage} type="error" />
        <FieldDoing text={doing} hidden={!doing} />
    </Modal>
};

export default SignUp;
