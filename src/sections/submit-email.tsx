import React, { useState } from 'react';
import { isNonEmptyString, isEmail } from 'douhub-helper-util';
import { callAPIBase, getRecaptchaToken } from 'douhub-ui-web-basic';
import RecaptchaField from '../fields/recaptcha';
import { isFunction } from 'lodash';


const SubmitEmailSection = (props: {
    apiEndpoint: string,
    recaptchaId: string,
    apiData?: Record<string, any>,
    colorName?: string,
    thankYouMessage?: string,
    errorMessage?: string,
    buttonText?: string,
    privacyPolicyUrl?: string,
    contactEmail?: string,
    onError?: (result: any) => void,
    onSuccess?: (error: any) => void,
}) => {

    const { apiEndpoint, recaptchaId } = props;
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [doing, setDoing] = useState('');
    const [showRecaptcha, setShowRecaptcha] = useState(false);

    const colorName: string = props.colorName && isNonEmptyString(props.colorName) ? props.colorName : 'sky';
    const contactEmail: string = props.contactEmail && isNonEmptyString(props.contactEmail) ? props.contactEmail : 'sky';
    const thankYouMessage: string = props.thankYouMessage && isNonEmptyString(props.thankYouMessage) ? props.thankYouMessage : 'Thank you, you email has been submitted successfully.';
    const errorMessage: string = props.errorMessage && isNonEmptyString(props.errorMessage) ? props.errorMessage : `Sorry, we can not submit your request at the moment, please try again later${contactEmail.length > 0 ? ` or email to ${contactEmail}` : ''}.`
    const buttonText: string = props.buttonText && isNonEmptyString(props.buttonText) ? props.buttonText : 'Submit'
    const privacyPolicyUrl: string = props.privacyPolicyUrl && isNonEmptyString(props.privacyPolicyUrl) ? props.privacyPolicyUrl : '/read/page/privacy-policy';
    const apiData: Record<string, any> = props.apiData ? props.apiData : {};

    const onChangeEmail = (e: any) => {
        const text = e.target.value;
        if (isEmail(text) && !showRecaptcha) {
            setShowRecaptcha(true);
        }
        setEmail(text);
    }

    const onSubmit = () => {
        if (!isEmail(email)) {
            setError('Please provide a valid email address.');
            return;
        }

        const recaptchaToken = getRecaptchaToken(recaptchaId);
        if (!isNonEmptyString(recaptchaToken)) {
            setError('Are you a robot? Please finish reRAPTCHA check.');
            return;
        }

        setDoing('Submitting ...');
        setError('');

        callAPIBase(apiEndpoint, {
            ...apiData,
            email, recaptchaToken
        }, 'POST')
            .then((result) => {
                setShowRecaptcha(false);
                setSuccess(thankYouMessage);
                if (isFunction(props.onSuccess)) props.onSuccess(result);
            })
            .catch((error) => {
                setError(errorMessage);
                if (isFunction(props.onError)) props.onError(error);
            })
            .finally(() => {
                setDoing('');
            })
    }

    const onClickRecaptcha = () => {
        setError('');
    }

    return <>
        {showRecaptcha && <div className="w-full flex my-2">
            <RecaptchaField id={recaptchaId} onClick={onClickRecaptcha} />
        </div>}
        <div className="mt-3 sm:max-w-lg sm:w-full sm:flex">
            <div className="min-w-0 flex-1">
                <div className="w-full">
                    <input
                        onChange={onChangeEmail}
                        value={email}
                        type="email"
                        className={`block w-full border border-gray-300 rounded-md p-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-${colorName}-500 focus:ring-${colorName}-500`}
                        placeholder="Enter your email"
                    />
                </div>
            </div>
            <div className="mt-2 sm:mt-0 ml-0 sm:ml-3">
                <button
                    disabled={isNonEmptyString(doing)}
                    onClick={onSubmit}
                    type="submit"
                    className={`block w-full rounded-md ${isNonEmptyString(doing) ? 'cursor-not-allowed' : 'cursor-pointer'} border border-transparent px-5 py-3 bg-${colorName}-600 text-base font-medium text-white shadow hover:bg-${colorName}-700 focus:outline-none focus:ring-2 focus:ring-${colorName}-700 focus:ring-offset-2 sm:px-10`}
                >
                    {isNonEmptyString(doing) ? doing : buttonText}
                </button>
            </div>
        </div>
        {isNonEmptyString(error) && <div className="mt-4 w-full flex text-red-700" style={{ maxWidth: 460 }}>{error}</div>}
        {isNonEmptyString(success) && <div className="mt-4 w-full flex text-green-700" style={{ maxWidth: 460 }}>{success}</div>}
        <div className="mt-6">
            <p className="mt-3 text-sm text-gray-500">We care about the protection of your data. Read our <a href={privacyPolicyUrl} className="font-medium underline">Privacy Policy</a>.</p>
        </div>
    </>
}


export default SubmitEmailSection;