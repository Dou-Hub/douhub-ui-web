import React, { useEffect, useState } from 'react';
import { map, isFunction, isNil, isInteger, find } from 'lodash';
import SelectOption from '../controls/antd/select-option';
import Select from '../controls/antd/select';
import NoteField from './note';
import LabelField from './label';
import { CSS } from 'douhub-ui-web-basic';

import { isNonEmptyString } from 'douhub-helper-util';

const DISPLAY_NAME = 'PicklistField';

const PICKLIST_FIELD_CSS = `
    .field-picklist
    {
        margin-bottom: 1rem !important;
        width: 100% !important;
    }

    .field-picklist .ant-select-selector,
    .field-picklist .ant-select-selection-search,
    .field-picklist .ant-select-selection-item
    {
        border-radius: 0;
        padding: 0 !important;
        height: 30px !important;
        border: none !important;
        font-size: 0.9rem;
        text-align: left;
    }

    .field-picklist .ant-select-arrow
    {
        right: 0 !important
    }

    .field-picklist.ant-select-focused .ant-select-selector
    {
        border: none !important;
        box-shadow: none !important;
    }

    .field-picklist.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector
    {
        color: rgba(0, 0, 0, 0.85) !important;
        background: transparent !important;
    }
`;


const PicklistField = (props: Record<string, any>) => {

    const { label, disabled, note, style, labelStyle, inputStyle, alwaysShowLabel,  wrapperStyle } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
   
    const defaultValue = isNonEmptyString(props.defaultValue) || isInteger(props.defaultValue) ? props.defaultValue : null;
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState<string | number | undefined | null>(isNil(props.value) ? defaultValue : props.value);
    const className = isNonEmptyString(props.className) ? props.className : '';

    const onChange = (newValue: any) => {

        if (newValue != value || isNil(value)) {
            newValue = isNonEmptyString(newValue) || isInteger(newValue) ? newValue : defaultValue;
            setValue(newValue);
            const option = find(props.options, (option) => {return option.value == newValue });
            if (isFunction(props.onChange)) props.onChange(option);
        }
    }

    useEffect(() => {
        setValue(isNil(props.value) ? defaultValue : props.value);
    }, [props.value]);

    const renderSelect = () => {

        const options = map(props.options, (o) => {
            return <SelectOption key={o.value} value={o.value}>{o.text}</SelectOption>
        })

        return <Select
            style={{ ...style, ...inputStyle }}
            disabled={disabled}
            defaultValue={defaultValue}
            className={`field field-picklist ${className} ${disabled ? 'field-disabled' : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
        >
            {options}
        </Select>
    }

    return <div className="flex flex-col w-full" style={wrapperStyle}>
        <CSS id="field-picklist-css" content={PICKLIST_FIELD_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />
        {renderSelect()}
        <NoteField text={note} />
    </div>
};

PicklistField.displayName = DISPLAY_NAME;
export default PicklistField;
