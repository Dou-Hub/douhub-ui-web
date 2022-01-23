import React, { useEffect, useState } from 'react';
import {isBoolean, isFunction} from 'lodash';
import NoteField from './note';
import SVG from '../controls/svg';
import {isNonEmptyString} from 'douhub-helper-util';
import {marked} from 'marked';
import CSS from '../controls/css';

const CHECKBOX_FIELD_CSS = `
    .field-checkbox
    {
        border-bottom: none !important;
    }

    .field-checkbox.field-note-true
    {
        margin-bottom: 1rem !important;
    }

    .field-checkbox .checkbox 
    {
        border: solid 1px #cccccc;
        margin-right: 10px;
        height: 30px;
        width: 30px;
        display: flex;
        cursor: pointer;
    }

    .field-checkbox.field-disabled .checkbox 
    {
        border: solid 1px rgba(0,0,0,0.3);
    }

    .field-checkbox .checkmark 
    {
        height: 28px;
        width: 28px;
    }

    .field-checkbox .text 
    {
        align-self: center;
        position: relative;
    }

    .field-checkbox .text.info-true
    {
        padding-right: 20px;
    }

    .field-checkbox .text .info
    {
        position: absolute;
        right: 0;
        top: -8px;
        width: 16px;
        height: 16px;
        cursor: pointer;
    }

    .field-checkbox .text .info svg
    {
        fill: #0288d1;
    }

    .field-checkbox .text p
    {
        margin-bottom: 0;
    }

    .field-checkbox .text .label
    {
        font-size: 0.9rem;
    }

    .field-checkbox .text .sub-label
    {
        font-size: 0.75rem;
        color: #666666;
        line-height: 1.1;
    }

    .field-checkbox .checkmark svg 
    {
        width: 22px !important;
        height: 22px !important;
        margin: 3px;
        fill: #ffffff;
    }

    .field-checkbox-selected-true .checkmark svg 
    {
        fill: #333333;
    }

    .field-checkbox-selected-true.field-disabled .checkmark svg 
    {
        fill: rgba(0,0,0,0.3);
    }

    .field-checkbox.field-disabled .checkbox
    {
        cursor: not-allowed;

    }
`;

const CheckboxField = (props: Record<string,any>) => {

    const { label, subLabel, disabled, note, style, className} = props;

    const defaultValue = isBoolean(props.defaultValue) ? props.defaultValue : null;
    const [value, setValue] = useState<boolean|undefined|null>(isBoolean(props.value) ? props.value : defaultValue);
    const showInfo = isFunction(props.onClickInfo);
   
    useEffect(() => {
        const newValue = isBoolean(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, defaultValue]);

    const onClick = () => {
        if (disabled) return;
        onChange(!value);
    }

    const onChange = (newValue:boolean) => {
        setValue(newValue);
        if (isFunction(props.onChange)) props.onChange(newValue);
    }

    return <>
        <CSS id="field-checkbox-css" content={CHECKBOX_FIELD_CSS}/>
        <div className={`field field-checkbox ${disabled?'field-disabled':''} field-checkbox-selected-${value} ${isNonEmptyString(note) ? 'field-note-true' : ''} ${isNonEmptyString(className) ? className : ''} `} 
            style={style}>
            <div className='checkbox' onClick={onClick}>
                <SVG className="checkmark" src="/icons/checkmark.svg" />
            </div>
            <div className={`text info-${showInfo?'true':'false'}`}>
                <div className='label' dangerouslySetInnerHTML={{ __html: label && marked(label) }} />
                {isNonEmptyString(subLabel) && <div className='sub-label' dangerouslySetInnerHTML={{ __html: subLabel && marked(subLabel) }} />}
                {isFunction(props.onClickInfo) && <SVG src="/icons/info.svg" className="info" onClick={props.onClickInfo}/>}
            </div>
            
        </div>
        <NoteField text={note} />
    </>
};

CheckboxField.displayName = 'CheckboxField';
export default CheckboxField;
