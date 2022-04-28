import React from 'react';
import {cloneDeep, isFunction} from 'lodash';
import {isNonEmptyString} from 'douhub-helper-util';

const Input = React.forwardRef((p:Record<string,any>, ref:any) => {

    const props = cloneDeep(p);
    
    if (props.editable) props.editable = 'editable';
    delete props.editable;

    const onKeyDown = (event:Record<string,any>) => {
        if (event.key === 'Enter') {
            if (isFunction(p.onKeyDown)) p.onKeyDown(event);
            if (isFunction(p.onSubmit)) {
                event.preventDefault();
                event.stopPropagation();
                p.onSubmit();
            }
        }
    }

    const onChange = (event: Record<string,any>) => {
        if (isFunction(p.onChange)) p.onChange(event.target.value);
    }

    return <input {...props}
        value={isNonEmptyString(props.value) ? props.value : ''}
        ref={ref}
        onKeyPress={onKeyDown}
        onChange={onChange}
        style={{... props.style, outline: 'none'}} />
});

Input.displayName = 'Input';
export default Input;