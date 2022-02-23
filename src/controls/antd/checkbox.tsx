import React from 'react';
import { Checkbox } from 'antd';
import {_track} from '../../util';
import CSS from '../../controls/css';


if (_track) console.log('Load Ant Button');
   
const CheckboxCSS = `
    .ant-checkbox-wrapper
    {
        font-size: 0.9rem;
    }
`

const AntCheckbox = (props:Record<string,any>) => {
    return (
        <>
            <CSS id="ant-check-box" content={CheckboxCSS}/>
            <Checkbox {...props}/>
        </>
    )
}

AntCheckbox.displayName = 'AntCheckbox';
export default AntCheckbox;