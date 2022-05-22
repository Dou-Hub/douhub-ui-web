import React, { useEffect, useRef, useState } from 'react';
import { isNonEmptyString, isPassword, isEmail } from 'douhub-helper-util';
import { isFunction, isNumber, isNil } from 'lodash';
import { LabelField as LabelFieldInternal, NoteField, InputPassword, InputTextArea, InputText, InputNumber, FIELD_CSS } from '../index';
import { CSS, _window } from 'douhub-ui-web-basic';
import { IMaskInput } from 'react-imask';

const TEXT_FIELD_CSS = `
   
    .field-wrapper-input
    {
        min-height: 30px;
        border-bottom: dashed 1px #cccccc;
        margin-bottom: 1rem;
    }

    .field-wrapper-input input,
    .field-wrapper-input textarea,
    .field-wrapper-input .ant-input-number
    {
        min-height: 30px;
        border-radius: 0 !important;
        font-size: 1rem !important;
    }

    .field-wrapper-input .ant-input-number-input-wrap
    {
        width: 100%;
    }

    .field-wrapper-input .field-text,
    .field-wrapper-input .ant-input-number-input
    {
        padding: 5px 0 !important;
        font-size: 1rem !important;
    }

    .field-wrapper-input.h1
    {
        padding-bottom: 0.75rem !important;
    }

    .field-text.h1
    {
        font-size: 2.2rem !important;
        line-height: 1.2;
        font-weight: 700;
        min-height: 3.2rem !important;
    }

    .field-wrapper-input.h2
    {
        padding-bottom: 0.6rem !important;
    }

    .field-text.h2
    {
        font-size: 1.8rem !important;
        line-height: 1.2;
        font-weight: 500;
        min-height: 2.62rem !important;
    }

    .field-wrapper-input.h3
    {
        padding-bottom: 0.45rem !important;
    }

    .field-text.h3
    {
        font-size: 1.4rem !important;
        font-weight: 500;
        line-height: 1.2;
        min-height: 2.03rem !important;
    }

    .field-wrapper-input.h4
    {
        padding-bottom: 0.4rem !important;
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
        maxRows, labelStyle, inputStyle, alwaysShowLabel, button,
         onPressEnter, headFontSize } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
  
    const inputControl = useRef(null);
    const LabelField = isNil(props.LabelField) ? LabelFieldInternal : props.LabelField;
    const defaultValue = isNonEmptyString(props.defaultValue) ? props.defaultValue : null;
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState('');
    const className = isNonEmptyString(props.className) ? props.className : '';
    const solution = _window.solution;
    const passwordRules = props.passwordRules ? props.passwordRules : solution?.auth?.passwordRules;
    const [errorMessage, setErrorMessage] = useState('');

    let mask = type == 'mask' && props.mask || type == 'phone-number' && '+0(000)0000000';
    if (type == 'phone-number' && props.mask) {
        mask = props.mask;
    }

    useEffect(() => {
        const newValue = !isNil(props.value) ? props.value : defaultValue;
        if (newValue != value) {
            validateValye(newValue);
            setValue(newValue);
        }
    }, [props.value, defaultValue]);

    const onChangeText = (e: any) => {
        onChange(isNil(e?.target?.value) ? e : e?.target?.value);
    }

    const onChangeMaskValue = (newValue: any) => {
        onChange(newValue);
    }

    const validateValye = (newValue: any) => {
        switch (type) {
            case 'password':
                {
                    if (!isPassword(newValue, passwordRules)) {
                        setErrorMessage('Invalid Password');
                    }
                    else {
                        setErrorMessage('');
                    }
                    break;
                }
            case 'email':
                {
                    newValue = isNonEmptyString(newValue) ? newValue.trim().toLowerCase().replace(/[ ]{2,}/gi, '') : '';
                    if (isNonEmptyString(newValue) && !isEmail(newValue)) {
                        setErrorMessage('Invalid Email');
                    }
                    else {
                        setErrorMessage('');
                    }
                    break;
                }
        }
    }

    const onChange = (newValue: any) => {
        validateValye(newValue);
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
            case 'number':
                {
                    InputControl = InputNumber;
                    inputProps.controls = false;
                    break;
                }
            default:
                {
                    // if (!Input) Input = logDynamic(dynamic(() => import('../../controls/antd/input'), { ssr: false }), '../controls/antd/input', DISPLAY_NAME);
                    InputControl = InputText;
                    break;
                }
        }

        useEffect(() => {
            const curInput: any = inputControl?.current;
            const style = curInput?.resizableTextArea?.textArea?.style;
           
            if (style && style.height == '') {
                setTimeout(() => { 
                    curInput.resizableTextArea.resizeTextarea(); 
                }, 300);
            }
        }, [value])

        return mask ? <IMaskInput
            mask={mask}
            value={isNonEmptyString(value) ? value : ''}
            unmask={true} // true|false|'typed'
            ref={inputControl}
            disabled={disabled}
            className={`field field-text has-wrapper ${className} ${isNonEmptyString(headFontSize) ? headFontSize : ''} ${disabled ? 'field-disabled' : ''} ${type ? 'field-text-' + type : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
            onAccept={onChangeMaskValue}
            placeholder={placeholder}
        /> : <InputControl
            ref={inputControl}
            style={inputStyle}
            disabled={disabled}
            defaultValue={defaultValue}
            onPressEnter={onPressEnter}
            className={`ant-input field field-text has-wrapper ${className} ${isNonEmptyString(headFontSize) ? headFontSize : ''} ${disabled ? 'field-disabled' : ''} ${type ? 'field-text-' + type : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
            placeholder={placeholder}
            onChange={onChangeText}
            value={value}
            {...inputProps}
        />
    }
    return <div className="flex flex-col w-full" style={wrapperStyle}>
        <CSS id="field-css" content={FIELD_CSS} />
        <CSS id="field-text-css" content={TEXT_FIELD_CSS} />
        <LabelField {...(isNil(props.LabelField)?{}:props)}
            text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />
        <div style={inputWrapperStyle} className={`field-wrapper-input ${isNonEmptyString(headFontSize) ? headFontSize : ''} field-note-${isNonEmptyString(note) || isNonEmptyString(errorMessage) ? 'true' : 'false'}`}>
            {renderInput()}
        </div>
        <NoteField text={note} />
        {isNonEmptyString(errorMessage) && <NoteField text={errorMessage} type="error" />}
        {isFunction(button?.onClick) && isNonEmptyString(button?.text) && <div className="flex flex-col">
            {isNonEmptyString(button?.error) && <div className="flex flex-row justify-end text-red-500 mb-2">{button?.error}</div>}
            {isNonEmptyString(button?.doing) && <div className="flex flex-row justify-end mb-2">{button?.doing}</div>}
            {!isNonEmptyString(button?.doing) && <div className="flex flex-row justify-end"><button
                onClick={button?.onClick}
                className={`flex cursor-pointer whitespace-nowrap inline-flexitems-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 ${isNonEmptyString(button?.className) ? button?.className : ''}`}>
                {button?.text}
            </button></div>}
        </div>}
    </div>
};

export default TextField;
