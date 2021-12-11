import React from "react";
const View = (props: Record<string, any>) => {
    return <div {...props} style={{ display: 'flex', flexDirection: 'row', ...props.style }}>
        {props.children}
    </div>;
};

export default View;