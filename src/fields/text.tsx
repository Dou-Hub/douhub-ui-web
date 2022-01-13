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

const DISPLAY_NAME = 'FieldText';


const FieldTextCSS = () => <style global={true} jsx={true}>{`
   
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
        margin-bottom: 1rem;
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

`}</style>

const FieldText = (props: Record<string, any>) => {

    const { label, disabled, type, note, minRows, maxRows, labelStyle, inputStyle, alwaysShowLabel, hideLabel, onPressEnter } = props;

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
    return <>
        <FieldTextCSS />
        <Label text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />
        <div className={`field-wrapper-input field-note-${isNonEmptyString(note) ? 'true' : 'false'}`}>
            {renderInput()}
        </div>
        <Note text={note} />
    </>
};

FieldText.displayName = DISPLAY_NAME;
export default FieldText;