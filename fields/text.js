import React, { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import Label from './label';
import Note from './note';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';

const DISPLAY_NAME = 'FieldText';

let Input = null;
let InputPassword = null;
let InputTextArea = null;

const FieldTextCSS = () => <style global jsx>{`
   
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

const FieldText = React.forwardRef((props, ref) => {

    const { label, disabled, type, note, minRows, maxRows, labelStyle, inputStyle, alwaysShowLabel, hideLabel } = props;

    const defaultValue = _.isNonEmptyString(props.defaultValue) ? props.defaultValue : null;
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(null);
    const className = _.isNonEmptyString(props.className) ? props.className : '';

    useEffect(() => {
        const newValue = _.isNonEmptyString(props.value) ? props.value : defaultValue;
        setValue(newValue);
        if (!_.isNonEmptyString(props.value) && _.isNonEmptyString(defaultValue) && newValue==defaultValue)
        {
            onChange(newValue);
        }
        
    }, [props.value, defaultValue]);

    const onChangeText = (e) => {
        onChange(e.target.value);
    }

    const onChange = (newValue)=>{
        setValue(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue);
    }

    const renderInput = () => {

        let InputControl = null;
        const inputProps = {};
        switch (type) {
            case 'password':
                {
                    if (!InputPassword) InputPassword = logDynamic(dynamic(() => import('../controls/antd/password'), { ssr: false }), '../controls/antd/password',DISPLAY_NAME);
                    InputControl = InputPassword;
                    break;
                }
            case 'textarea':
                {
                    if (!InputTextArea) InputTextArea = logDynamic(dynamic(() => import('../controls/antd/textarea'), { ssr: false }), '../controls/antd/textarea',DISPLAY_NAME);
                    InputControl = InputTextArea;
                    inputProps.autoSize = { minRows: _.isNumber(minRows) ? minRows : 1, maxRows: _.isNumber(maxRows) ? maxRows : 100 };
                    break;
                }
            default:
                if (!Input) Input = logDynamic(dynamic(() => import('../controls/antd/input'), { ssr: false }), '../controls/antd/input',DISPLAY_NAME);
                InputControl = Input;
                break;
        }

        return <InputControl
            ref={ref}
            style={inputStyle}
            disabled={disabled}
            defaultValue={defaultValue}
            className={`field field-text has-wrapper ${className} ${disabled ? 'field-disabled' : ''} ${type ? 'field-text-' + type : ''} ${_.isNonEmptyString(note) ? 'field-note-true' : ''}`}
            placeholder={placeholder}
            onChange={onChangeText}
            value={_.isNonEmptyString(value)?value:''}
            {...inputProps}
        />
    }
    return <>
        <FieldTextCSS/>
        <Label text={label} disabled={disabled} style={labelStyle}
        hidden={!(!hideLabel && (alwaysShowLabel || _.isNonEmptyString(value) || !_.isNonEmptyString(placeholder))) }
        />
        <div className={`field-wrapper-input field-note-${_.isNonEmptyString(note)?'true':'false'}`}>
            {renderInput()}
        </div>
        <Note text={note} />
    </>
});

FieldText.displayName = DISPLAY_NAME;
export default FieldText;
