import { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import Label from './label';
import Note from './note';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';

const DISPLAY_NAME = 'FieldCodes';

const FieldCodesCSS = () => <style global jsx>
{`
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
`}
</style>
FieldCodesCSS.displayName = 'FieldCodesCSS';

let Input = null;
let InputPassword = null;

const initValue = (count, value) => {
    const values = Array(count).fill('');
    const valueArray = value.split('');
    for (let i = 0; i < valueArray.length && i < Math.min(valueArray.length, count); i++) {
        values[i] = valueArray[i];
    }
    return values;
}

const FieldCodes = (props) => {

    const { label, disabled, type, note } = props;

    const defaultValue = _.isNonEmptyString(props.defaultValue) ? props.defaultValue : '';
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const count = _.isInteger(props.count) ? props.count : 8;
    const [value, setValue] = useState(initValue(count, _.isNonEmptyString(props.value) ? props.value : defaultValue));

    useEffect(() => {
        setValue(initValue(count, _.isNonEmptyString(props.value) ? props.value : defaultValue));
    }, [props.value, defaultValue]);

    const onChange = (e, i) => {
        const newValue = value.slice(0);
        newValue[i] = e.target.value;
        setValue(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue.join(''));
    }


    const onFocus = (e) => {
        e.target.select();
    }

    const renderCodes = () => {
        let InputControl = null;
        switch (type) {
            case 'password':
                {

                    if (!InputPassword) InputPassword = logDynamic(dynamic(() => import('../controls/antd/password'), { ssr: false }), '../controls/antd/password', DISPLAY_NAME);
                    InputControl = InputPassword;
                    break;
                }
            default:
                if (!Input) Input = logDynamic(dynamic(() => import('../controls/antd/input'), { ssr: false }), '../controls/antd/input', DISPLAY_NAME);
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
        <FieldCodesCSS/>
        <Label text={label} disabled={disabled} />
        <div className={`field field-codes ${disabled ? 'field-disabled' : ''} ${type ? 'field-codes-' + type : ''} ${_.isNonEmptyString(note) ? 'field-note-true' : ''}`}>
            {renderCodes()}
        </div>
        <Note text={note} />
    </>
}

FieldCodes.displayName = DISPLAY_NAME;
export default FieldCodes;
