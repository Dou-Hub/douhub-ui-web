import React from 'react';
import _ from '../../../shared/util/base';

const DISPLAY_NAME = 'FieldContainer';

const FieldContainer = React.forwardRef((props, ref) => {

    const { style } = props;

    return <div style={_.style({borderBottom: 'none'},style)} className="field field-container">
        {props.children}
    </div> 
});

FieldContainer.displayName = DISPLAY_NAME;
export default FieldContainer;
