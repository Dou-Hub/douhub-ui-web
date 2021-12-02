import React, { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import Label from './label';
import Note from './note';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';

const FieldNumberCSS = () => <style global jsx>{`
    .field-number 
    {
        min-height: 30px;
        margin-bottom: 1rem !important;
    }

    .field-number .ant-input-number
    {
        padding: 0 !important;
        margin: 0;
        border: none !important;
    }

    .field-number .ant-input-number-focused
    {
        box-shadow: none !important;
    }

    .field-number input
    {
        padding: 5px 0 !important;
        font-size: 1rem !important;
    }
`}</style>
FieldNumberCSS.displayName = 'FieldNumberCSS';


const DISPLAY_NAME = 'FieldNumber';

let InputNumber = null;

const FieldNumber = React.forwardRef((props, ref) => {

    const { label, disabled, type, note, labelStyle, inputStyle, alwaysShowLabel } = props;

    const defaultValue = _.isNumber(props.defaultValue) ? props.defaultValue : null;
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(_.isNumber(props.value) ? props.value : defaultValue);
    const className = _.isNonEmptyString(props.className) ? props.className : '';

    useEffect(() => {
        const newValue = _.isNonEmptyString(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, defaultValue]);

    const onChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue);
    }

    const renderInput = () => {

        if (!InputNumber) InputNumber = logDynamic(dynamic(() => import('../controls/antd/number'), { ssr: false }), '../controls/antd/number', DISPLAY_NAME);
        let formatter = null;
        let parser = null;

        switch (type) {
            case 'money':
                {
                    formatter = value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    parser = value => value.replace(/\$\s?|(,*)/g, '');
                    break;
                }
            case 'percentage':
                {
                    formatter = value => value => `${value}%`;
                    parser = value => value => value.replace('%', '');
                    break;
                }
        }

        return <InputNumber
            ref={ref}
            style={inputStyle}
            formatter={formatter}
            parser={parser}
            disabled={disabled}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            {...props}
        />
    }
    return <>
        <FieldNumberCSS/>
        <Label text={label} disabled={disabled} style={labelStyle} 
        hidden={!(alwaysShowLabel || _.isNumber(value) || !_.isNonEmptyString(placeholder)) }
        />
        <div className={`field field-number ${className} ${disabled ? 'field-disabled' : ''} ${type ? 'field-number-' + type : ''} ${_.isNonEmptyString(note) ? 'field-note-true' : ''}`}>
            {renderInput()}
        </div>
        <Note text={note} />
    </>
});

FieldNumber.displayName = DISPLAY_NAME;
export default FieldNumber;
