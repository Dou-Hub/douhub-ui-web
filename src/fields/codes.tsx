import React from 'react';
import { useEffect, useState } from 'react';
import { isInteger, isFunction } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';
import Label from './label';
import Note from './note';
// import dynamic from 'next/dynamic';
import InputPassword from '../controls/antd/password';
import Input from '../controls/antd/input';
import CSS from '../controls/css';

const DISPLAY_NAME = 'CodesField';

const CODES_FIELD_CSS = `
    .field-codes {
        border-bottom: none !important; 
    }

    .field-code {
        margin-top: 10px;
        margin-right: 10px;
        text-align: center;
    }

    .field-code-last-true {
        margin-right: 0px;
    }
`;

const initValue = (count: number, value: string) => {
    const values = Array(count).fill('');
    const valueArray = value.split('');
    for (let i = 0; i < valueArray.length && i < Math.min(valueArray.length, count); i++) {
        values[i] = valueArray[i];
    }
    return values;
}

const CodesField = (props: Record<string, any>) => {

    const { label, disabled, type, note } = props;

    const defaultValue = isNonEmptyString(props.defaultValue) ? props.defaultValue : '';
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const count = isInteger(props.count) ? props.count : 8;
    const [value, setValue] = useState(initValue(count, isNonEmptyString(props.value) ? props.value : defaultValue));

    useEffect(() => {
        setValue(initValue(count, isNonEmptyString(props.value) ? props.value : defaultValue));
    }, [props.value, defaultValue]);

    const onChange = (e:any, i:number) => {
        const newValue = value.slice(0);
        newValue[i] = e.target.value;
        setValue(newValue);
        if (isFunction(props.onChange)) props.onChange(newValue.join(''));
    }


    const onFocus = (e:any) => {
        e.target.select();
    }

    const renderCodes = () => {
        let InputControl = null;
        switch (type) {
            case 'password':
                {

                    // if (!InputPassword) InputPassword = logDynamic(dynamic(() => import('../../controls/antd/password'), { ssr: false }), '../controls/antd/password', DISPLAY_NAME);
                    InputControl = InputPassword;
                    break;
                }
            default:
                // if (!Input) Input = logDynamic(dynamic(() => import('../../controls/antd/input'), { ssr: false }), '../controls/antd/input', DISPLAY_NAME);
                InputControl = Input;
                break;
        }

        const codes = [];
        for (let i = 0; i < value.length && i < Math.min(value.length, count); i++) {
            codes.push(<InputControl
                onFocus={onFocus}
                maxLength={1}
                key={i}
                disabled={disabled}
                defaultValue={defaultValue}
                className={`field-code field-code-first-${i == 1 ? 'true' : 'false'} field-code-last-${i == value.length ? 'true' : 'false'}`}
                placeholder={placeholder}
                onChange={(e) => onChange(e, i)}
                value={value[i]} />)
        }

        return codes;
    }

    return <>
        <CSS id="field-codes-css" content={CODES_FIELD_CSS}/>
        <Label text={label} disabled={disabled} />
        <div className={`field field-codes ${disabled ? 'field-disabled' : ''} ${type ? 'field-codes-' + type : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}>
            {renderCodes()}
        </div>
        <Note text={note} />
    </>
}

CodesField.displayName = DISPLAY_NAME;
export default CodesField;
