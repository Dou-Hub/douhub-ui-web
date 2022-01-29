import React, { useEffect, useState } from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction, isNumber } from 'lodash';
import Label from './label';
import Note from './note';
// import dynamic from 'next/dynamic';
// import { logDynamic } from '../util';
import InputPassword from '../controls/antd/password';
import Input from '../controls/antd/input';
import InputTextArea from '../controls/antd/textarea';
import CSS from '../controls/css';

const DISPLAY_NAME = 'TextField';

const TEXT_FIELD_CSS = `
   
    .field-wrapper-input
    {
        min-height: 30px;
        border-bottom: dashed 1px #cccccc;
        margin-bottom: 1rem;
    }

    .field-wrapper-input input,
    .field-wrapper-input textarea
    {
        min-height: 30px;
        border-radius: 0 !important;
        font-size: 0.9rem !important;
    }

    .field-text
    {
        padding: 5px 0 !important;
        font-size: 1rem !important;
    }

    .field-text.h1
    {
        font-size: 2.2rem !important;
        line-height: 1.2;
        font-weight: 700;
        min-height: 2.64rem !important;
    }

    .field-text.h2
    {
        font-size: 1.8rem !important;
        line-height: 1.2;
        font-weight: 500;
        min-height: 2.16rem !important;
    }

    .field-text.h3
    {
        font-size: 1.4rem !important;
        font-weight: 500;
        line-height: 1.2;
        min-height: 1.68rem !important;
    }

    .field-text.h4
    {
        font-size: 1.2rem !important;
        font-weight: 500;
        line-height: 1.2;
        min-height: 1.44rem !important;
    }

    .field-text-password input
    {
        font-size: 1rem !important;
    }

    .field-text:-internal-autofill-selected,
    .field-text-password input:-internal-autofill-selected
    {
        background-color: #ffffff !important;
    }

`;

const TextField = (props: Record<string, any>) => {

    const { label, disabled, type, wrapperStyle, note, minRows, 
        maxRows, labelStyle, inputStyle, alwaysShowLabel, 
        hideLabel, onPressEnter } = props;

    const defaultValue = isNonEmptyString(props.defaultValue) ? props.defaultValue : null;
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState('');
    const className = isNonEmptyString(props.className) ? props.className : '';

    useEffect(() => {
        const newValue = isNonEmptyString(props.value) ? props.value : defaultValue;
        setValue(newValue);
        if (!isNonEmptyString(props.value) && isNonEmptyString(defaultValue) && newValue == defaultValue) {
            onChange(newValue);
        }

    }, [props.value, defaultValue]);

    const onChangeText = (e: Record<string, any>) => {
        onChange(e.target.value);
    }

    const onChange = (newValue: string) => {
        setValue(newValue);
        if (isFunction(props.onChange)) props.onChange(newValue);
    }

    const renderInput = () => {

        let InputControl = null;
        const inputProps: Record<string, any> = {};
        switch (type) {
            case 'password':
                {
                    // if (!InputPassword) InputPassword = logDynamic(dynamic(() => import('../../controls/antd/password'), { ssr: false }), '../controls/antd/password', DISPLAY_NAME);
                    InputControl = InputPassword;
                    break;
                }
            case 'textarea':
                {
                    // if (!InputTextArea) InputTextArea = logDynamic(dynamic(() => import('../../controls/antd/textarea'), { ssr: false }), '../controls/antd/textarea', DISPLAY_NAME);
                    InputControl = InputTextArea;
                    inputProps.autoSize = { minRows: isNumber(minRows) ? minRows : 1, maxRows: isNumber(maxRows) ? maxRows : 100 };
                    break;
                }
            default:
                // if (!Input) Input = logDynamic(dynamic(() => import('../../controls/antd/input'), { ssr: false }), '../controls/antd/input', DISPLAY_NAME);
                InputControl = Input;
                break;
        }

        return <InputControl
            style={inputStyle}
            disabled={disabled}
            defaultValue={defaultValue}
            onPressEnter={onPressEnter}
            className={`field field-text has-wrapper ${className} ${disabled ? 'field-disabled' : ''} ${type ? 'field-text-' + type : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
            placeholder={placeholder}
            onChange={onChangeText}
            value={isNonEmptyString(value) ? value : ''}
            {...inputProps}
        />
    }
    return <div className="flex flex-col w-full" style={wrapperStyle}>
        <CSS id="field-text-css" content={TEXT_FIELD_CSS} />
        <Label text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />
        <div className={`field-wrapper-input field-note-${isNonEmptyString(note) ? 'true' : 'false'}`}>
            {renderInput()}
        </div>
        <Note text={note} />
    </div>
};

TextField.displayName = DISPLAY_NAME;
export default TextField;
