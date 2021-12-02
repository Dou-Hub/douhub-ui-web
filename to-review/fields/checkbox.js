import React, { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import Note from './note';
import SVG from '../controls/svg';
import marked from 'marked';

const FieldCheckboxCSS = () => <style global jsx>
{`
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
        border: solid 1px #aaaaaa;
        margin-right: 10px;
        height: 30px;
        width: 30px;
        display: flex;
        cursor: pointer;
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

    .field-checkbox.field-disabled .checkbox
    {
        cursor: not-allowed;
    }
`}
</style>

const FieldCheckbox = React.forwardRef((props, ref) => {

    const { label, subLabel, disabled, note, style, className} = props;

    const defaultValue = _.isBoolean(props.defaultValue) ? props.defaultValue : null;
    const [value, setValue] = useState(_.isBoolean(props.value) ? props.value : defaultValue);
    const showInfo = _.isFunction(props.onClickInfo);
   
    useEffect(() => {
        const newValue = _.isBoolean(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, defaultValue]);

    const onClick = () => {
        if (disabled) return;
        onChange(!value);
    }

    const onChange = (newValue) => {
        setValue(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue);
    }

    return <>
        <FieldCheckboxCSS/>
        <div className={`field field-checkbox ${disabled?'field-disabled':''} field-checkbox-selected-${value} ${_.isNonEmptyString(note) ? 'field-note-true' : ''} ${_.isNonEmptyString(className) ? className : ''} `} 
            style={style}>
            <div className='checkbox' onClick={onClick}>
                <SVG className="checkmark" src="/icons/checkmark.svg"/>
            </div>
            <div className={`text info-${showInfo?'true':'false'}`}>
                <div className='label' dangerouslySetInnerHTML={{ __html: marked(label) }} />
                {_.isNonEmptyString(subLabel) && <div className='sub-label' dangerouslySetInnerHTML={{ __html: marked(subLabel) }} />}
                {_.isFunction(props.onClickInfo) && <SVG src="/icons/info.svg" className="info" onClick={props.onClickInfo}/>}
            </div>
            
        </div>
        <Note text={note} />
    </>
});

FieldCheckbox.displayName = 'FieldText';
export default FieldCheckbox;
