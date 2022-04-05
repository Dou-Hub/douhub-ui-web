import React, { useEffect, useState } from 'react';
import BasicModal from '../../controls/modals/basic';
import { _window, CSS } from 'douhub-ui-web-basic';
import { isNonEmptyString, formatText } from 'douhub-helper-util';
import { isFunction, isNil, without, cloneDeep } from 'lodash';
import { FormBase, Switch, LabelField } from '../../index';


const LabelFieldForName = (props: Record<string, any>) => {

    const [autoNaming, setAutoNaming] = useState(false);
    const [isSystem, setIsSystem] = useState(true);

    const SWITCH_CSS = `
    .switch-auto-naming .ant-switch-inner
        {
            font-size: 10px !important;
        } 
    `;

    useEffect(() => {
       _window.FormFieldEditModalAuthNamingField = props.record;
    }, [props.record])

    useEffect(() => {
        if ((props.record?.autoNaming==true)!==autoNaming) setAutoNaming(props.record?.autoNaming==true);
    }, [props.record?.autoNaming])

    useEffect(() => {
        if ((props.record?.system==true)!==isSystem) setIsSystem(props.record?.system==true);
    }, [props.record?.system])
    
    const onClickLockFieldName = (value: boolean) => {
        const newData = cloneDeep(_window.FormFieldEditModalAuthNamingField);
        newData.autoNaming = value;
        setAutoNaming(value);
        if (isFunction(props.onClickLockFieldName)) props.onClickLockFieldName(newData);
    }

    return <LabelField {...props} text="" Content={() =>
        <div className="w-full flex field-label">
            <CSS id='switch-auto-naming' content={SWITCH_CSS} />
            <div className="flex-1">Name</div>
            <Switch className="switch-auto-naming"
                checkedChildren="Auto Naming (On)"
                size="small"
                disabled={isSystem}
                unCheckedChildren="Auto Naming (Off)"
                checked={autoNaming || isSystem}
                onClick={onClickLockFieldName} />
        </div>} />
}

const FormFieldEditModal = (props: Record<string, any>) => {

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
        setError('');
        if (data.autoNaming == true && data.system != true) {
            setData({ ...newData, name: formatText(newData.label, 'camel') });
        }
        else {
            setData(newData);
        }
        if (isFunction(props.onChange)) props.onChange({ ...newData });
    }

    const onClickLockFieldName = (newField: Record<string, any>) => {
        console.log({newField})
       onChange(newField);
    }

    const formInfo = {
        rows: without([
            field.system ? {
                fields: [
                    {
                        name: 'alertSystemField',
                        type: 'alert-warning',
                        message: 'This is a system field',
                        description: `<ul>
                        <li>The name and type can not be changed.</li>
                        <li>The system field can not be deleted.</li>
                        </ul>`
                    }
                ]
            } : null,
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
                        LabelField: LabelFieldForName,
                        onClickLockFieldName,
                        name: 'name',
                        type: 'text',
                        label: "Name",
                        autoNaming: data.autoNaming,
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
                        disabled: field.system,
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
        if (isFunction(props.onSubmit)) {
            const newError = props.onSubmit(data);
            if (isNonEmptyString(newError)) {
                setError(newError);
            }
            else {
                onClose();
            }
        }
    }

    const onRemove = () => {
        if (isFunction(props.onRemove)) props.onRemove();
    }

    return <BasicModal
        id={`field-edit-${field.name}`}
        titleClassName="text-left"
        show={show}
        onClose={onClose}
        onSubmit={onSubmit}
        title={title}
        content={renderContent()}
        error={error}
        buttons={
            without([
                !field.system ? {
                    text: "Remove",
                    type: "danger",
                    confirmationTitle: "Are you sure to remove this field?",
                    confirmationOk: "Yes",
                    confirmationOkType: "danger",
                    className: "absolute",
                    onClick: () => { },
                    onClickConfirm: onRemove
                } : null,
                {
                    text: "Cancel",
                    type: "cancel",
                    onClick: onClose
                },
                {
                    text: "Update",
                    type: "info"
                }
            ], null)}
    />
}

export default FormFieldEditModal;