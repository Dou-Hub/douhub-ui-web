import React from 'react';
import { Input } from 'antd';
import AntdCSS from './css';
console.log('Load Ant Input');
const AntInput = (props: Record<string,any>) => {
    return (
        <>
            <AntdCSS />
            <Input {...props} />
        </>
    )
}

AntInput.displayName = 'AntInput';
export default AntInput;