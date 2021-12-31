
import React, { useEffect, useState } from 'react';
import { isEmail, isNonEmptyString, _window, _track } from 'douhub-helper-util';
import { sendMessage } from 'douhub-ui-store';
import {
    signIn, SignInSection, MessageField,
    SVG, getCookie, removeCookie, setCookie,
} from '../../index';
import { cloneDeep, isNil, isFunction } from 'lodash';

const SignInPageBody = (props: Record<string, any>) => {

    const { solution, supportSSO } = props;
    const [doing, setDoing] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [form, setForm] = useState<Record<string, any>>({});
    const [askForVerification, setAskForVerification] = useState(false);

    useEffect(() => {
        const newForm = { email: getCookie('sign-in-email'), ...props.data };
        if (isNil(newForm.rememberMe)) newForm.rememberMe = isEmail(newForm.email);
        setForm(newForm);
        setAskForVerification(isNonEmptyString(newForm.verificationCode))
    }, [props.data])

    const onChangeForm = (newForm: Record<string, any>) => {
        setForm(newForm);
        if (isFunction(props.onChangeForm)) props.onChangeForm(newForm);
    }

    const onChangeRememberMe = () => {
        const newForm: Record<string, any> = cloneDeep(form);
        newForm.rememberMe = !(newForm.rememberMe == true);
        if (!newForm.rememberMe) {
            removeCookie('sign-in-email');
        }
        onChangeForm(newForm);
        if (isFunction(props.onChangeRememberMe)) props.onChangeRememberMe(newForm);
    }

    const onClickSignUp = () => {
        if (isFunction(props.onClickSignUp)) props.onClickSignUp();
    }

    const onClickResetPassword = () => {
        if (isFunction(props.onClickResetPassword)) props.onClickResetPassword();
    }

    const onCreateError = (error: string) => {
        setDoing('');
        setErrorMessage(error);
        if (isFunction(props.onCreateError)) props.onChangeRememberMe(error);
    }

    const onSubmit = () => {

        (async () => {

            try {

                setErrorMessage('');
                setDoing('Processing ...');
                //try sign in by the user
                const result = await signIn(solution, form, {});

                setDoing('');

                if (result.error) {

                    if (_track) console.error({error: result.error});

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
                                setDoing('');
                                return onCreateError(`Please provide a valid email.`);
                            }
                        case 'ERROR_SIGNIN_NEED_PASSWORD':
                            {
                                setDoing('');
                                return onCreateError(`Please provide a valid password.`);
                            }
                        case 'ERROR_SIGNIN_USERNOTFOUND':
                            {
                                setDoing('');
                                return onCreateError('The user does not exist.');
                            }
                        default:
                            {
                                setDoing('');
                                return onCreateError('Failed to sign in.');
                            }
                    }
                }

                //setCookie to keep email here
                if (form.rememberMe) {
                    setCookie('sign-in-email', form.email);
                }
                else {
                    removeCookie('sign-in-email');
                }

                sendMessage('context-sign-in-success', 'action', result);
                if (isFunction(props.onSuccess)) props.onSuccess(form);
            }
            catch (error) {
                if (_track) console.error({error});
                setDoing('');
                return onCreateError('Failed to sign in.');
            }
            
        })();

    }

    const renderSSO = () => {
        return supportSSO && <>
            <div className="relative flex space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-500 flex flex- items-center justify-center ring-8 ring-white">
                    <svg className="h-5 w-5 text-white" x-description="Heroicon name: solid/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <span className="text-base">Sign in with social accounts</span>
                </div>
            </div>

            <div className="mt-5 mb-10 py-10 pl-8 border-0 border-l ml-3">
                <button style={{ maxWidth: 250 }} className="mb-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <SVG src="/icons/logo-google.svg" className="flex justify-center" style={{ width: 20, marginRight: 10 }} />Google
                </button>
                <button style={{ maxWidth: 250 }} className="mb-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <SVG src="/icons/logo-facebook.svg" className="flex justify-center" style={{ width: 20, marginRight: 10 }} />Facebook
                </button>
            </div>
        </>
    }

    return <>
        <div className="min-h-full flex max-w-screen-xl mx-auto py-10 px-4 sm:px-6  lg:px-8">
            <div className="hidden lg:block relative w-0 flex-1">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/misc/drawing.jpeg"
                    alt="/misc/drawing.jpeg"
                />
            </div>
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-md lg:w-96">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                    </div>
                    <div className="mt-8">
                        {renderSSO()}

                        {supportSSO && <div className="relative flex space-x-3">
                            <div className="h-8 w-8 rounded-full bg-green-500 flex flex- items-center justify-center ring-8 ring-white">
                                <svg className="h-5 w-5 text-white" x-description="Heroicon name: solid/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>

                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <span className="text-base">Or sign in with your email</span>
                            </div>
                        </div>}

                        <div className={supportSSO ?
                            "mt-5 py-10 pl-8 border-0 border-l ml-3"
                            :
                            "py-6"
                        }>
                            <SignInSection
                                data={form}
                                onChangeForm={onChangeForm}
                                solution={solution}
                                alwaysShowLabel={true}
                                askForVerification={askForVerification}
                                errorMessage={errorMessage}
                                onSubmitPassword={onSubmit}
                                onChangeRememberMe={onChangeRememberMe}
                                doing={doing} />
                            {doing ?
                                <button disabled className="my-10 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ">
                                    {doing}
                                </button> :
                                <button className="my-10 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 " onClick={onSubmit}>
                                    Sign in
                                </button>}
                            <MessageField style={{ fontSize: '0.85rem', lineHeight: 1, marginBottom: 10, marginTop: 30 }} content="Do not have a user account? Click here to sign up." type="info" onClick={onClickSignUp} />
                            <MessageField style={{ fontSize: '0.85rem', lineHeight: 1 }} content="Forgot your password? Click here to reset." type="info" onClick={onClickResetPassword} />
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </>
};

export default SignInPageBody
