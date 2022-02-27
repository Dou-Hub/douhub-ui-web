import React, { useEffect, useRef, useState } from 'react';
import { isNonEmptyString, isPassword, isEmail } from 'douhub-helper-util';
import { isFunction, isNumber } from 'lodash';
import { _window, LabelField, NoteField, CSS, InputPassword, InputTextArea, InputText } from '../index';
import { IMaskInput } from 'react-imask';

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
        min-height: 3.2rem !important;
    }

    .field-text.h2
    {
        font-size: 1.8rem !important;
        line-height: 1.2;
        font-weight: 500;
        min-height: 2.62rem !important;
    }

    .field-text.h3
    {
        font-size: 1.4rem !important;
        font-weight: 500;
        line-height: 1.2;
        min-height: 2.03rem !important;
    }

    .field-text.h4
    {
        font-size: 1.2rem !important;
        font-weight: 500;
        line-height: 1.2;
        min-height: 1.74rem !important;
    }

    .field-text:-internal-autofill-selected,
    .field-text-password input:-internal-autofill-selected
    {
        background-color: #ffffff !important;
    }

`;

const TextField = (props: Record<string, any>) => {

    const { label, disabled, type, wrapperStyle, note, minRows, inputWrapperStyle,
        maxRows, labelStyle, inputStyle, alwaysShowLabel,
        hideLabel, onPressEnter } = props;

    const defaultValue = isNonEmptyString(props.defaultValue) ? props.defaultValue : null;
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState('');
    const className = isNonEmptyString(props.className) ? props.className : '';
    const solution = _window.solution;
    const passwordRules = props.passwordRules ? props.passwordRules : solution?.auth?.passwordRules;
    const [errorMessage, setErrorMessage] = useState('');

    let mask = type == 'mask' && props.mask || type == 'phone-number' && '+0(000)0000000';
    if (type == 'phone-number' && props.mask)
    {
        mask = props.mask;
    }

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

    const onChangeMaskValue = (newValue: any) => {
        onChange(newValue);
    }

    const onChange = (newValue: string) => {
        switch (type) {
            case 'mask':
                {

                }
            case 'password':
                {
                    if (!isPassword(newValue, passwordRules)) {
                        setErrorMessage('Invalid Password');
                    }
                    else {
                        setErrorMessage('');
                    }
                }
            case 'email':
                {
                    console.log({email: newValue})
                    if (!isEmail(newValue)) {
                        setErrorMessage('Invalid Email');
                    }
                    else {
                        setErrorMessage('');
                    }
                }
        }
        setValue(newValue);
        if (isFunction(props.onChange)) props.onChange(newValue);
    }

    const renderInput = () => {
        const inputControl = useRef(null);
        let InputControl = null;
        const inputProps: Record<string, any> = {};
        switch (type) {
            case 'password':
                {
                    // if (!InputPassword) InputPassword = logDynamic(dynamic(() => import('../../controls/antd/password'), { ssr: false }), '../controls/antd/password', DISPLAY_NAME);
                    InputControl = InputPassword;
                    break;
                }
            case 'email':
                {
                    InputControl = InputText;
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
                InputControl = InputText;
                break;
        }

        const curInput: any = inputControl?.current;
        const style = curInput?.resizableTextArea?.textArea?.style;

        useEffect(() => {
            const curInput: any = inputControl?.current;
            const style = curInput?.resizableTextArea?.textArea?.style;
            if (style && style.height == '') {
                setTimeout(() => { style.height = '0px' }, 500);
            }
        }, [style && style.height])

        return mask ? <IMaskInput
            mask={mask}
            value={isNonEmptyString(value) ? value : ''}
            unmask={true} // true|false|'typed'
            ref={inputControl}
            disabled={disabled}
            className={`field field-text has-wrapper ${className} ${disabled ? 'field-disabled' : ''} ${type ? 'field-text-' + type : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
            onAccept={onChangeMaskValue}
            placeholder={placeholder}
        /> : <InputControl
            ref={inputControl}
            style={inputStyle}
            disabled={disabled}
            defaultValue={defaultValue}
            onPressEnter={onPressEnter}
            className={`ant-input field field-text has-wrapper ${className} ${disabled ? 'field-disabled' : ''} ${type ? 'field-text-' + type : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
            placeholder={placeholder}
            onChange={onChangeText}
            value={isNonEmptyString(value) ? value : ''}
            {...inputProps}
        />
    }
    return <div className="flex flex-col w-full" style={wrapperStyle}>
        <CSS id="field-text-css" content={TEXT_FIELD_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />
        <div style={inputWrapperStyle} className={`field-wrapper-input field-note-${isNonEmptyString(note) || isNonEmptyString(errorMessage)? 'true' : 'false'}`}>
            {renderInput()}
        </div>
        <NoteField text={note} />
        {isNonEmptyString(errorMessage) && <NoteField text={errorMessage} type="error" />}
    </div>
};

TextField.displayName = DISPLAY_NAME;
export default TextField;
