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

import { solution } from '../../../shared/metadata/solution';
import { callAPI } from '../../util/web';
import FieldText from '../fields/text';
import FieldDoing from '../fields/doing';
import FieldMessage from '../fields/message';
import dynamic from 'next/dynamic';
import { logDynamic } from './base';
import CreateNewButtonCSS from './create-new-button-css';

const MESSAGE_CREATING_PAGE = 'Creating the page ...';
const DISPLAY_NAME = 'CreateNewButton';

let Select = null;
let SelectOption = null;
let Modal = null;

const CreateNewButton = (props) => {
    const { user, size } = props;
    const [showCreatePageDialog, setShowCreatePageDialog] = useState(false);
    const [doing, setDoing] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [form, setForm] = useState({});

    const onCreatePage = () => {
        if (!user) {
            props.onCreatePage();
        }
        else {
            setShowCreatePageDialog(true);
        }
    }

    const onCancelCreate = () => {
        setShowCreatePageDialog(false);
        setDoing(null);
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

    const onCreate = () => {

        (async () => {

            setErrorMessage('');
           
            if (!_.isNonEmptyString(form.title)) {
                return onCreateError('Please provide a title for your page.');
            }

            setDoing(MESSAGE_CREATING_PAGE);

            try
            {
                const newPage = await callAPI(`${solution.apis.data}create`, {
                    data: {title: form.title, entityName: 'Page'}
                }, 'POST');

                window.location = `/edit/${newPage.slug}`;
            }
            catch(error)
            {
                setDoing(null);
                return onCreateError('We are sorry, the page can not be created at the moment. Please try again later.');
                console.error(error);
                
            }
            
        })();

    }


    const renderNewPageModal = () => {
        if (!showCreatePageDialog) return null;
        if (!Modal) Modal = logDynamic(dynamic(() => import('./antd/modal'), { ssr: false }), '../controls/antd/modal',
        DISPLAY_NAME);
        return <Modal title="Create a new page"
            className={doing ? "doing" : ""}
            visible={true}
            okText={"Create Page"}
            onOk={onCreate}
            onCancel={onCancelCreate}>
                <div>
            <FieldText 
            onChange={(v) => onChangeForm('title', v)} 
            disabled={doing} 
            placeholder="Type the title of the page here" 
            label="The title of the page" />
            <FieldMessage content={errorMessage} type="error" />
            <FieldDoing text={doing} hidden={!doing} />
            </div>
        </Modal>
    }

    return (
        <>
            <div className="create-new-button" onClick={onCreatePage}>Create Page</div> 
            {renderNewPageModal()}
            <CreateNewButtonCSS />
        </>
    )
};

CreateNewButton.displayName = DISPLAY_NAME;
export default CreateNewButton;
