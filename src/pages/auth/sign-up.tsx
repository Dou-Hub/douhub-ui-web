
import React, { useEffect, useState } from 'react';
import { isEmail } from 'douhub-helper-util';
import { sendMessage } from 'douhub-ui-store';
import { _window, _track } from "../../util";
import { SignUpSection, MessageField, getCookie, callAPIBase } from '../../index';
import { isNil, isFunction } from 'lodash';

const SignUpPageBody = (props: Record<string, any>) => {

    const { solution } = props;
    const [doing, setDoing] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [form, setForm] = useState<Record<string, any>>({});

    useEffect(() => {
        const newForm = { email: getCookie('sign-in-email'), ...props.data };
        if (isNil(newForm.rememberMe)) newForm.rememberMe = isEmail(newForm.email);
        setForm(newForm);
    }, [props.data])

    const onChangeForm = (newForm: Record<string, any>) => {
        setForm(newForm);
        if (isFunction(props.onChangeForm)) props.onChangeForm(newForm);
    }

    const onClickSignIn = () => {
        if (isFunction(props.onClickSignIn)) props.onClickSignIn();
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
                // const result = await signIn(solution, form, {});

                const result = await callAPIBase(`${solution.apis.organization}/sign-up`, form, 'POST', { solutionId: solution.id });

                setDoing('');

                if (result.error) {

                    console.error({ error: result.error });

                    switch (result.error) {
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
                                return onCreateError('Failed to sign up.');
                            }
                    }
                }

                sendMessage('context-sign-in-success', 'action', result);
                if (isFunction(props.onSuccess)) props.onSuccess(form);
            }
            catch (error) {
                console.error({ error });
                setDoing('');
                return onCreateError('Failed to sign up.');
            }

        })();

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
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign up your organization/team</h2>
                    </div>
                    <div className="mt-8">

                        <div className="py-6">
                            <SignUpSection
                                data={form}
                                onChangeForm={onChangeForm}
                                solution={solution}
                                alwaysShowLabel={true}
                                errorMessage={errorMessage}
                                onSubmitPassword={onSubmit}
                                doing={doing} />
                            {doing ?
                                <button disabled className="my-10 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ">
                                    {doing}
                                </button> :
                                <button className="my-10 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 " onClick={onSubmit}>
                                    Sign Up
                                </button>}
                            <MessageField
                                className="underline-offset-2 cursor-pointer"
                                content="Have a user account already? Click here to sign in."
                                type="info" onClick={onClickSignIn} />
                            <MessageField className="underline-offset-2 cursor-pointer"
                                content="Forgot your password? Click here to reset."
                                type="info" onClick={onClickResetPassword} />

                        </div>


                    </div>
                </div>
            </div>
        </div>
    </>
};

export default SignUpPageBody
