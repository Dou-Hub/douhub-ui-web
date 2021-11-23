import React, { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import Label from './label';
import Note from './note';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';

const DISPLAY_NAME = 'FieldPicklist';

let Select = null;
let SelectOption = null;

const FieldPicklistCSS = () => <style global jsx>
    {`
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
    }

    .field-picklist.ant-select-focused .ant-select-selector
    {
        border: none !important;
        box-shadow: none !important;
    }
`}
</style>


const FieldPicklist = React.forwardRef((props, ref) => {

    const { label, disabled, note, style, labelStyle, inputStyle, alwaysShowLabel, hideLabel } = props;

    const defaultValue = _.isNonEmptyString(props.defaultValue) || _.isInteger(props.defaultValue) ? props.defaultValue : null;
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(null);
    const className = _.isNonEmptyString(props.className) ? props.className : '';

    const onChange = (newValue) => {
        if (newValue!=value || _.isNil(value))
        {
            newValue = _.isNonEmptyString(newValue) || _.isInteger(newValue) ? newValue : defaultValue;
            setValue(newValue);
            console.log({label: newValue})
            if (_.isFunction(props.onChange)) props.onChange(newValue);
        }
    }

    useEffect(() => {
        onChange(props.value);
    }, [props.value, defaultValue]);

    const renderSelect = () => {

        if (!Select) {
            Select = logDynamic(dynamic(() => import('../controls/antd/select'), { ssr: false }), '../controls/antd/select', DISPLAY_NAME);
            SelectOption = logDynamic(dynamic(() => import('../controls/antd/select-option'), { ssr: false }), '../controls/antd/select-option', DISPLAY_NAME);
        }

        const options = _.map(props.options, (o) => {
            return <SelectOption key={o.value} value={o.value}>{o.text}</SelectOption>
        })

        return <Select
            ref={ref}
            style={_.style(style, inputStyle)}
            disabled={disabled}
            defaultValue={defaultValue}
            className={`field field-picklist ${className} ${disabled ? 'field-disabled' : ''} ${_.isNonEmptyString(note) ? 'field-note-true' : ''}`}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
        >
            {options}
        </Select>
    }

    return <>
        <Label text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || _.isNonEmptyString(value) || !_.isNonEmptyString(placeholder)))}
        />
        <FieldPicklistCSS />
        {renderSelect()}
        <Note text={note} />
    </>
});

FieldPicklist.displayName = DISPLAY_NAME;
export default FieldPicklist;
