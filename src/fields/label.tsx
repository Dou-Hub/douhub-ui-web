import React from "react";
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction } from 'lodash';
import { marked } from 'marked';
import FieldCSS from './css';
import CSS from '../controls/css';

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
    const { text, disabled, style, hidden } = props;
    const onClick = (e: any) => {
        if (isFunction(props.onClick)) props.onClick(e);
    }
    return (
        <>
            <CSS id="field-label-css" content={LABEL_FIELD_CSS} />
            <FieldCSS/>
            {isNonEmptyString(text) && !hidden && <div style={style}
                onClick={onClick}
                className={`field-label ${disabled ? 'field-disabled' : ''}`}
                dangerouslySetInnerHTML={{ __html: marked(text) }} />}
        </>
    )
}

FieldLabel.displayName = 'FieldLabel';
export default FieldLabel;
