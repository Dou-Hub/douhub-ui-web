import React from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction } from 'lodash';

const FieldMessage = (props:Record<string,any>) => {

    const { type, content, style, className } = props;
    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick();
    }
    return isNonEmptyString(content) ?
        <div className={`field field-message field-message-${type} ${className}`}
            onClick={onClick}
            style={{ ...isFunction(props.onClick) ? { cursor: 'pointer', textDecoration: 'underline' } : {}, ...style }}
            dangerouslySetInnerHTML={{ __html: content }} />
        : null;
}
export default FieldMessage;
