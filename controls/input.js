import React from 'react';
import _ from '../../../shared/util/base';

const Input = React.forwardRef((p, ref) => {

    const props = _.cloneDeep(p);
    
    if (props.editable) props.editable = 'editable';
    delete props.editable;

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (_.isFunction(p.onKeyDown)) p.onKeyDown(event);
            if (_.isFunction(p.onSubmit)) {
                event.preventDefault();
                event.stopPropagation();
                p.onSubmit();
            }
        }
    }

    const onChange = (event) => {
        if (_.isFunction(p.onChange)) p.onChange(event.target.value);
    }

    return <input {...props}
        value={_.isNonEmptyString(props.value) ? props.value : ''}
        ref={ref}
        onKeyPress={onKeyDown}
        onChange={onChange}
        style={_.style(props.style, { outline: 'none' })} />
});

Input.displayName = 'Input';
export default Input;