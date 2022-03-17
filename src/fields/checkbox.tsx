import React, { useEffect, useState } from 'react';
import {isBoolean, isFunction} from 'lodash';
import NoteField from './note';
import {SVG, CSS} from 'douhub-ui-web-basic';
import {isNonEmptyString} from 'douhub-helper-util';
import {marked} from 'marked';
import {CHECKBOX_FIELD_CSS} from './checkbox-css';

const CheckboxField = (props: Record<string,any>) => {

    const { label, subLabel, disabled, note, style, className, size, id, name} = props;

    const defaultValue = isBoolean(props.defaultValue) ? props.defaultValue : null;
    const [value, setValue] = useState<boolean|undefined|null>(isBoolean(props.value) ? props.value : defaultValue);
    const showInfo = isFunction(props.onClickInfo);
    const small = size && size?.toLowerCase()=='small'?true:false;
    const hideCheckboxWhenDisabled = props.hideCheckboxWhenDisabled==true;
    const hideCheckboxWhenNotDisabled = props.hideCheckboxWhenNotDisabled==true;
   
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
        <div className={`field field-checkbox ${small?'small':''} ${disabled?'field-disabled':''} field-checkbox-selected-${value?'true':'false'} ${isNonEmptyString(note) ? 'field-note-true' : ''} ${isNonEmptyString(className) ? className : ''} `} 
            style={style}>
            { !(disabled && hideCheckboxWhenDisabled || !disabled && hideCheckboxWhenNotDisabled) && <div className='checkbox' onClick={onClick}>
                <SVG id={`field-checkbox-${id}-${name}`} className="checkmark" src="/icons/checkmark.svg" />
            </div>}
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
