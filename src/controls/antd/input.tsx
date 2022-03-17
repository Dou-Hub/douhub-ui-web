import React from 'react';
import { Input } from 'antd';
import { CSS } from 'douhub-ui-web-basic';
import { ANT_CSS } from './css';

console.log('Load Ant Input');
const AntInput = React.forwardRef((props: Record<string, any>, ref: any) => {
    return (
        <>
            <CSS id='antd-css' content={ANT_CSS} />
            <Input {...props} ref={ref} />
        </>
    )
})

AntInput.displayName = 'AntInput';
export default AntInput;