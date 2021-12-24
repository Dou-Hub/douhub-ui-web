import React from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction } from 'lodash';

const styles = {
    onClick: { cursor: 'pointer', textDecoration: 'underline' }
}

const FieldMessage = (props:Record<string,any>) => {

    const { type, content, style } = props;
    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick();
    }
    return isNonEmptyString(content) ?
        <div className={`field field-message field-message-${type}`}
            onClick={onClick}
            style={{ ...isFunction(props.onClick) ? styles.onClick : {}, ...style }}
            dangerouslySetInnerHTML={{ __html: content }} />
        : null;
}
export default FieldMessage;
