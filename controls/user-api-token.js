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

import React, { useState, useEffect } from 'react';
import _ from '../../../shared/util/base';

import { solution } from '../../../shared/metadata/solution';
import { callAPI } from '../../util/web';
import FieldText from '../fields/text';
import FieldMessage from '../fields/message';
import FieldDoing from '../fields/doing';
import Modal from '../controls/antd/modal';

const UserAPIToken = (props) => {

    const [doing, setDoing] = useState(true);
    const [message, setMessage] = useState({});
    const [value, setValue] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setDoing(true);
                setMessage({});
                const result = await callAPI(`${solution.apis.auth}current-user-token?type=api`, null, 'GET');
                setValue(result.token);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setDoing(false);
            }
        })();
    }, []);

    const onChange = (v) => {
        setValue(v)
    }

    const onCancel = () => {
        props.onCancel();
    }

    const onCopy = () => {
        navigator.clipboard.writeText(value);
        setMessage({ content: 'The token has been copied to your clipboard.', type: 'info' });
    }

    return <Modal title="User API Token"
        className={doing ? "doing" : ""}
        visible={true}
        okText={"Copy to clipboard"}
        onOk={onCopy}
        onCancel={onCancel}>
        <FieldDoing text={doing} hidden={!doing} />
        <FieldText onChange={onChange} disabled={doing} value={value} type="textarea" />
        <FieldMessage content={message.content} type={message.type} />
    </Modal>
};

export default UserAPIToken;
