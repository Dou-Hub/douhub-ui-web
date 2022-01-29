import React from 'react';

const DISPLAY_NAME = 'PlaceholderField';

const PlaceholderField = (props:Record<string,any>) => {
    return <div className="field-placeholder flex flex-1" style={{minHeight:30}} {...props} ></div>
};

PlaceholderField.displayName = DISPLAY_NAME;
export default PlaceholderField;
