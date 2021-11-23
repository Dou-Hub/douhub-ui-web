import React from 'react';
import _ from '../../../shared/util/base';

const DISPLAY_NAME = 'FieldHr';

const FieldHrCSS = () => <style global jsx>{`
    .field-hr
    {
        margin-bottom: 30px;
        width: 100%;
        border-bottom: dashed 5px rgba(0,0,0,0.1) !important;
    }
`}</style>

const FieldHr = React.forwardRef((props, ref) => {

    const { style } = props;
    return <>
        <FieldHrCSS />
        <div className="field field-hr" style={style}></div>
    </>
});

FieldHr.displayName = DISPLAY_NAME;
export default FieldHr;
