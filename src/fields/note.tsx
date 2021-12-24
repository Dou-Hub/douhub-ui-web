import React from 'react';
import {isNonEmptyString} from 'douhub-helper-util';
import FieldCSS from './css';

const FieldNote = (props:Record<string,any>) => {

    const { text, disabled, hidden } = props;
    return isNonEmptyString(text) && !hidden? 
    <>
    <FieldCSS/>
    <div className={`field-note ${disabled ? 'field-disabled' : ''}`} dangerouslySetInnerHTML={{ __html: text }}/>
    </>:<></>
}
export default FieldNote;
