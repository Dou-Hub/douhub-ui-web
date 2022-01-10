import React from 'react';
import { Checkbox } from 'antd';
import {_track} from '../../util';
if (_track) console.log('Load Ant Button');
   
const CheckboxCSS = () => <style global={true} jsx={true}>{`
    .ant-checkbox-wrapper
    {
        font-size: 0.9rem;
    }
`}
</style>

const AntCheckbox = (props:Record<string,any>) => {
    return (
        <>
            <CheckboxCSS />
            <Checkbox {...props}/>
        </>
    )
}

AntCheckbox.displayName = 'AntCheckbox';
export default AntCheckbox;