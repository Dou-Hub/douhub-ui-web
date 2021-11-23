
import React, { useMemo } from 'react';

const Image = (props) => {
    const { src, alt, className } = props;
    return useMemo(() => <img {...props} />, [src, alt, className])
};

export default Image;