import React from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction } from 'lodash';
import { FIELD_CSS } from './css';
import { CSS } from '../index';

const FieldMessage = (props: {
    type: 'error' | 'info' | 'success' | 'warnning' | 'secondard' | 'default',
    content: string,
    style?: Record<string, any>,
    className?: string,
    onClick?: any
}) => {

    const { type, content, style, className } = props;
    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick();
    }
    return isNonEmptyString(content) ?
        <>
            <CSS id="field-css" content={FIELD_CSS} />
            <div className={`field field-message field-message-${type} ${className}`}
                onClick={onClick}
                style={{ ...isFunction(props.onClick) ? { cursor: 'pointer', textDecoration: 'underline' } : {}, ...style }}
                dangerouslySetInnerHTML={{ __html: content }} />
        </>
        : null;

}
export default FieldMessage;
