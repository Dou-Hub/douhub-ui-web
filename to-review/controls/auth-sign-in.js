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
import Modal from '../controls/antd/modal';
import FieldMessage from '../fields/message';
import { signIn } from '../../util/authentication';
import { SignInFields } from './auth-helper';
import { colorByName} from '../../../shared/util/colors';

const SignIn = (props) => {
    const { onClose } = props;
    const [doing, setDoing] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [form, setForm] = useState(props.data ? props.data : {});
    const [askForVerification, setAskForVerification] = useState(_.isNonEmptyString(form.verificationCode));

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


    const onClickSignUp = () => {
        if (_.isFunction(props.onClickSignUp)) props.onClickSignUp();
    }

    const onSubmit = () => {

        (async () => {

            setErrorMessage('');
            setDoing('Processing ...');
            //try sign in by the user
            const result = await signIn(form);
            setDoing(null);

            if (result.error) {

                switch (result.error) {
                    case 'ERROR_API_AUTH_USER_ORGS_VERIFICATION_FAILED':
                        {
                            setAskForVerification(true);
                            return onCreateError(`The email verification failed. Please provide a correct verification code above.`);
                        }
                    case 'ERROR_SIGNIN_NEED_VERIFY':
                        {
                            setAskForVerification(true);
                            return onCreateError(`The user's email was not verified yet. Please provide your verification code above.`);
                        }
                    case 'ERROR_SIGNIN_NEED_EMAIL':
                        {
                            setDoing(null);
                            return onCreateError(`Please provide a valid email.`);
                        }
                    case 'ERROR_SIGNIN_NEED_PASSWORD':
                        {
                            setDoing(null);
                            return onCreateError(`Please provide a valid password.`);
                        }
                    case 'ERROR_SIGNIN_USERNOTFOUND':
                        {
                            setDoing(null);
                            return onCreateError('The user does not exist.');
                        }
                    default:
                        {
                            setDoing(null);
                            return onCreateError('Failed to sign in.');
                        }
                }
            }
            window.postMessage({ action: 'user-session-on', user: result.user });
            window.location = '/home';
            //onCancel();
        })();

    }

    const onClickResetPassword = () => {
        if (_.isFunction(props.onClickResetPassword)) props.onClickResetPassword();
    }

    return <Modal title="Sign In"
        className={doing ? "doing" : ""}
        visible={true}
        okText={"Submit"}
        onOk={onSubmit}
        onCancel={onCancel}>
        {askForVerification && form.verificationCode == '000000' &&
            <FieldMessage style={{ color: colorByName('green') }}
                content="Thank you! The email verification code has been sent to your email address."
                type="info" />
        }
        <SignInFields data={form} onChangeForm={onChangeForm} disabled={doing} askForVerification={askForVerification} />
        <FieldMessage style={{ fontSize: '0.85rem', lineHeight: 1, marginBottom: 10, marginTop: 30 }} content="Do not have a user account? Click here to sign up." type="info" onClick={onClickSignUp} />
        <FieldMessage style={{ fontSize: '0.85rem', lineHeight: 1 }} content="Forgot your password? Click here to reset." type="info" onClick={onClickResetPassword} />
        <FieldMessage content={errorMessage} type="error" />
        <FieldDoing text={doing} hidden={!doing} />
    </Modal>
};

export default SignIn;
