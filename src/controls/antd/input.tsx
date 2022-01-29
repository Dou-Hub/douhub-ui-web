import React from 'react';
import { Input } from 'antd';
import CSS from '../css';
import {ANT_CSS} from './css';

console.log('Load Ant Input');
const AntInput = (props: Record<string,any>) => {
    return (
        <>
            <CSS id='antd-css' content={ANT_CSS} />
            <Input {...props} />
        </>
    )
}

AntInput.displayName = 'AntInput';
export default AntInput;