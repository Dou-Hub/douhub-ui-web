import React from 'react';
import { Checkbox } from 'antd';
console.log('Load Ant Checkbox');

const CheckboxCSS = () => <style global={true} jsx={true}>{`
    .ant-checkbox-wrapper
    {
        font-size: 0.9rem;
    }
`}
</style>



const AntCheckbox = (props:Record<string,any>) => {
    console.log('Load Ant Button');
    return (
        <>
            <CheckboxCSS />
            <Checkbox {...props}/>
        </>
    )
}

AntCheckbox.displayName = 'AntCheckbox';
export default AntCheckbox;