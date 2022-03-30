import React, { useEffect, useState } from 'react';
import BasicModal from '../../controls/modals/basic';
import { _window } from 'douhub-ui-web-basic';
import { isNonEmptyString, formatText } from 'douhub-helper-util';
import { isFunction, isNil, without } from 'lodash';
import { FormBase } from '../../index';

const BaseFormFieldEditModal = (props: Record<string, any>) => {

    const { field } = props;
    const title = props.title ? props.title : 'Edit Field';
    const [data, setData] = useState<Record<string, any>>({});
    const [error, setError] = useState('');
    const show = !isNil(field);

    const supportPlaceHolder = data.type != 'date' && data.type != 'time' && data.type != 'datetime';

    useEffect(() => {
        setData(field);
    }, [field]);

    const onClose = () => {
        if (isFunction(props.onClose)) props.onClose();
    }

    const onChange = (newData: Record<string, any>) => {
        setError('')
        setData({ ...newData, name: formatText(newData.label, 'camel') });
        if (isFunction(props.onChange)) props.onChange({ ...newData });
    }

    const formInfo = {
        rows: without([
            {
                fields: [
                    {
                        name: 'label',
                        type: 'text',
                        label: "Label",
                        alwaysShowLabel: true
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'name',
                        type: 'text',
                        label: "Name",
                        disabled: true,
                        alwaysShowLabel: true
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'type',
                        type: 'picklist',
                        label: "Type",
                        options: [
                            { value: 'text', text: 'Text' },
                            { value: 'number', text: 'Number' },
                            { value: 'phone-number', text: 'Phone #' },
                            { value: 'email', text: 'Email' },
                            { value: 'textarea', text: 'Textarea' },
                            { value: 'html', text: 'Html' },
                            { value: 'date', text: 'Date' },
                            { value: 'time', text: 'Time' },
                            { value: 'datetime', text: 'DateTime' },
                            { value: 'tags', text: 'Tags' }
                        ],
                        alwaysShowLabel: true
                    }
                ]
            },
            supportPlaceHolder ? {
                fields: [
                    {
                        name: 'placeholder',
                        type: 'text',
                        label: "Placeholder",
                        alwaysShowLabel: true
                    }
                ]
            } : null
        ], null)
    }

    const renderContent = () => {

        return <div className="flex flex-col">
            <FormBase data={data} form={formInfo} onChange={onChange} />
        </div>
    }

    const onSubmit = () => {
        if (!isNonEmptyString(data.label)) return setError("Please provide a label");
        if (!isNonEmptyString(data.name)) return setError("Please provide a name");
        if (isFunction(props.onSubmit)) props.onSubmit(data);
    }

    const onRemove = () => {
        if (isFunction(props.onRemove)) props.onRemove();
    }

    return <BasicModal
        titleClassName="text-left"
        show={show}
        onClose={onClose}
        onSubmit={onSubmit}
        title={title}
        content={renderContent()}
        error={error}
        buttons={
            [
                {
                    text: "Remove",
                    type: "danger",
                    confirmationTitle: "Are you sure to remove this field?",
                    confirmationOk: "Yes",
                    className: "absolute",
                    onClick: () => { },
                    onClickConfirm: onRemove
                },
                {
                    text: "Cancel",
                    type: "cancel",
                    onClick: onClose
                },
                {
                    text: "Update",
                    type: "info"
                }
            ]}
    />
}

export default BaseFormFieldEditModal;