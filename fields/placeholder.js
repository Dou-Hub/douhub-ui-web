import React from 'react';
import _ from '../../../shared/util/base';

const DISPLAY_NAME = 'FieldPlaceholder';

const FieldPlaceholder = React.forwardRef((props, ref) => {
    return <div ref={ref} className="field-placeholder"></div>
});

FieldPlaceholder.displayName = DISPLAY_NAME;
export default FieldPlaceholder;
