import React from "react";
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction } from 'lodash';
import { marked } from 'marked';
import {FIELD_CSS} from './css';
import {CSS} from 'douhub-ui-web-basic'

const LABEL_FIELD_CSS = `
    .field-label
    {
        font-size: 0.8rem !important;
        color: #333333;
        line-height: 1.1 !important;
        margin-bottom: 0 !important;
        min-height: 18px;
        text-align: left
    } 

    .field-label p
    {
        margin-bottom: 0;
    }

    .field-label .title
    {
        line-height: 1.1;
    }

    .field-label .sub-label
    {
        font-size: 0.8rem;
        line-height: 1.1;
    }
`;

const FieldLabel = (props: Record<string, any>) => {
    const { text, disabled, style, hidden, className } = props;
    const onClick = (e: any) => {
        if (isFunction(props.onClick)) props.onClick(e);
    }
    return isNonEmptyString(text) && !hidden ?
        <>
            <CSS id="field-label-css" content={LABEL_FIELD_CSS} />
            <CSS id="field-css" content={FIELD_CSS} />
            <div style={style}
                onClick={onClick}
                className={`w-full field-label ${disabled ? 'field-disabled' : ''} ${isNonEmptyString(className) ? className : ''}`}
                dangerouslySetInnerHTML={{ __html: marked(text) }} />
        </>:<></>
}

FieldLabel.displayName = 'FieldLabel';
export default FieldLabel;
