import { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';

const FieldError = (props) => {

    const { text, style } = props;
    return _.isNonEmptyString(text) && <div style={style} className="field-error">{text}</div>
}

FieldError.displayName = 'FieldError';
export default FieldError;
