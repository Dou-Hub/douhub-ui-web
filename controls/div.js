
import React from 'react';

const Div = (props) => {
    return <div {...props}>
        {props.children}
        </div>
};

export default Div;