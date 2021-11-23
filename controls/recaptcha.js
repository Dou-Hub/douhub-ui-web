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

import React, { useEffect } from 'react';

import _ from '../../../shared/util/base';
import { solution } from '../../../shared/metadata/solution';

export const getRecaptchaToken = (id) => {
    const elemId = _.isNonEmptyString(id) ? `recaptcha_${id}` : null;
    return _.isNonEmptyString(elemId) && grecaptcha.enterprise.getResponse(window[elemId]);
}


const Recaptcha = (props) => {

    const { style, className } = props;
    const id = _.isNonEmptyString(props.id) ? `recaptcha_${props.id}` : null;
    const scriptId = `${id}_script`;
    const functionId = `${id}_onLoadRecaptcha`.replace(/-/g,'').replace(/_/g,'');

    useEffect(() => {

       
        if (_.isNonEmptyString(id) && !document.getElementById(scriptId)) {

            if (!_.isFunction(window[functionId])) {
                window[functionId] = () => {
                    window[id] = grecaptcha.enterprise.render(id, {
                        sitekey: solution.keys.recaptchaSiteKey,
                        theme: 'light'
                    });
                }

                window[scriptId] = document.createElement("script");
                window[scriptId].id = scriptId;
                window[scriptId].src = `https://www.google.com/recaptcha/enterprise.js?onload=${functionId}&render=explicit`;
                document.body.appendChild(window[scriptId]);
            }
        }

        return () => {
            if (window[functionId]) window[functionId] = null;
            if (window[scriptId]) window[scriptId].remove();
        }

    }, [process.browser])

    return <div id={id} style={style} className={className}></div>
};

export default Recaptcha;
