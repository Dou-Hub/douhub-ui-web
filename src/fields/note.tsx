import React from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { FIELD_CSS } from './css';
import CSS from '../controls/css';

const FieldNote = (props: Record<string, any>) => {

    const { text, disabled, hidden, style, type } = props;
    return isNonEmptyString(text) && !hidden ?
        <>
            <CSS id="field-css" content={FIELD_CSS} />
            <div style={style} className={`field-note ${isNonEmptyString(type) ? 'field-note-' + type : ''} ${disabled ? 'field-disabled' : ''}`} dangerouslySetInnerHTML={{ __html: text }} />
        </> : <></>
}
export default FieldNote;
